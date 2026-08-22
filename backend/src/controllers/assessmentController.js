import Assessment from "../models/Assessment.js";
import AttemptResult from "../models/AttemptResult.js";

// Active in-memory attempt sessions cache for server-side evaluation
const activeAttemptSessions = new Map();

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const serialize = (assessment, includeAnswers = false) => {
  const data = assessment.toObject ? assessment.toObject() : assessment;
  const questions = data.questions.map((question) => {
    const item = { ...question, id: String(question._id) };
    delete item._id;
    if (!includeAnswers) delete item.answer;
    return item;
  });
  return { ...data, id: String(data._id), _id: undefined, questions };
};

export async function listPublished(req, res) {
  const assessments = await Assessment.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a, false)) });
}

export async function getPublished(req, res) {
  const assessment = await Assessment.findOne({ _id: req.params.id, status: "published" });
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, assessment: serialize(assessment, false) });
}

export async function startAttempt(req, res) {
  const assessment = await Assessment.findOne({ _id: req.params.id, status: "published" });
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });

  const rawData = assessment.toObject ? assessment.toObject() : assessment;
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const answersMap = new Map();

  // Shuffle questions order
  const shuffledQuestions = shuffleArray(rawData.questions || []).map((q) => {
    const qId = String(q._id);
    const originalAnswer = q.answer;
    const originalOptions = q.options ? [...q.options] : null;

    answersMap.set(qId, {
      type: q.type,
      answer: originalAnswer,
      options: originalOptions,
    });

    const questionItem = {
      id: qId,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      context: q.context,
    };

    if (Array.isArray(originalOptions) && originalOptions.length > 0) {
      const shuffledOptions = shuffleArray(originalOptions);
      questionItem.options = shuffledOptions;
      answersMap.get(qId).shuffledOptions = shuffledOptions;
    }

    return questionItem;
  });

  activeAttemptSessions.set(attemptId, {
    assessmentId: String(assessment._id),
    createdAt: Date.now(),
    answersMap,
  });

  const assessmentMeta = serialize(assessment, false);
  assessmentMeta.questions = shuffledQuestions;

  res.json({
    success: true,
    attemptId,
    assessment: assessmentMeta,
  });
}

export async function submitAttempt(req, res) {
  const { attemptId, responses, elapsedSeconds, violations = [] } = req.body;
  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });

  const session = activeAttemptSessions.get(attemptId);
  const rawQuestions = assessment.questions || [];
  const GRADABLE_TYPES = ["mcq", "scenario", "logical-reasoning", "data-interpretation", "output"];
  const gradableQuestions = rawQuestions.filter((q) => GRADABLE_TYPES.includes(q.type));

  let correctCount = 0;
  let attemptedGradableCount = 0;

  gradableQuestions.forEach((q) => {
    const qId = String(q._id);
    const userResp = responses ? responses[qId] : undefined;
    if (userResp === undefined || userResp === null || userResp === "") return;

    attemptedGradableCount++;

    if (session && session.answersMap.has(qId)) {
      const sessionQ = session.answersMap.get(qId);
      const originalAnswer = sessionQ.answer;

      if (q.type === "output") {
        if (String(userResp).trim().toLowerCase() === String(originalAnswer).trim().toLowerCase()) {
          correctCount++;
        }
      } else if (Array.isArray(sessionQ.shuffledOptions)) {
        const selectedText = typeof userResp === "number" ? sessionQ.shuffledOptions[userResp] : String(userResp);
        let correctText = originalAnswer;
        if (typeof originalAnswer === "number" && sessionQ.options) {
          correctText = sessionQ.options[originalAnswer];
        }
        if (String(selectedText).trim().toLowerCase() === String(correctText).trim().toLowerCase()) {
          correctCount++;
        }
      }
    } else {
      // Fallback check against raw database question
      if (q.type === "output") {
        if (String(userResp).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
          correctCount++;
        }
      } else if (Array.isArray(q.options)) {
        const selectedText = typeof userResp === "number" ? q.options[userResp] : String(userResp);
        let correctText = q.answer;
        if (typeof q.answer === "number" && q.options[q.answer]) {
          correctText = q.options[q.answer];
        }
        if (String(selectedText).trim().toLowerCase() === String(correctText).trim().toLowerCase()) {
          correctCount++;
        }
      }
    }
  });

  const incorrectCount = attemptedGradableCount - correctCount;
  const unansweredCount = gradableQuestions.length - attemptedGradableCount;
  const totalQuestions = rawQuestions.length;
  const attemptedCount = Object.keys(responses || {}).length;
  const unansweredTotalCount = totalQuestions - attemptedCount;

  // Score based on gradable questions only (consistent with existing logic)
  const scorePercent = gradableQuestions.length
    ? Math.round((correctCount / gradableQuestions.length) * 100)
    : 0;

  if (attemptId) {
    activeAttemptSessions.delete(attemptId);
  }

  // Persist the attempt result for the authenticated user (dashboard analytics)
  if (req.user) {
    try {
      await AttemptResult.create({
        userId: req.user._id,
        assessmentId: assessment._id,
        assessmentTitle: assessment.title,
        assessmentCategory: assessment.category || "General",
        assessmentField: assessment.field || "",
        scorePercent,
        correctCount,
        gradableCount: gradableQuestions.length,
        totalQuestions: rawQuestions.length,
        elapsedSeconds: elapsedSeconds || 0,
        completedAt: new Date(),
      });
    } catch (saveErr) {
      console.error("[Dashboard] Failed to persist attempt result:", saveErr.message);
    }
  }

  res.json({
    success: true,
    scorePercent,
    totalQuestions,
    attemptedCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    unansweredTotalCount,
    gradableCount: gradableQuestions.length,
    attemptedGradableCount,
    elapsedSeconds,
    violationsCount: violations.length,
    violations,
    autoSubmitted: violations.length >= 3,
  });
}

export async function listAdmin(req, res) {
  const assessments = await Assessment.find().sort({ createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a, true)) });
}

// Helper validation function
function validateAssessment(data) {
  const errors = [];
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push("Title is required and must be a non‑empty string.");
  }
  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push("Category is required and must be a non‑empty string.");
  }
  if (data.duration == null || typeof data.duration !== "number" || data.duration < 1) {
    errors.push("Duration is required and must be a positive number (minutes).");
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push("At least one question is required.");
  } else {
    data.questions.forEach((q, idx) => {
      if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
        errors.push(`Question ${idx + 1}: text is required.`);
      }
      if (Array.isArray(q.options) && q.options.length > 0) {
        const hasValidAnswer = q.answer !== undefined && q.answer !== null;
        if (!hasValidAnswer) {
          errors.push(`Question ${idx + 1}: answer is required when options are provided.`);
        }
      }
    });
  }
  return errors;
}

export async function createAssessment(req, res) {
  try {
    const validationErrors = validateAssessment(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }
    const assessment = await Assessment.create({
      ...req.body,
      createdBy: req.user._id,
      publishedAt: req.body.status === "published" ? new Date() : undefined,
    });
    res.status(201).json({ success: true, assessment: serialize(assessment, true) });
  } catch (err) {
    console.error("Error creating assessment:", err);
    res.status(500).json({ success: false, message: "Server error while creating assessment." });
  }
}

export async function updateAssessment(req, res) {
  try {
    const validationErrors = validateAssessment(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }
    const update = { ...req.body };
    if (update.status === "published" && !update.publishedAt) update.publishedAt = new Date();
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
    res.json({ success: true, assessment: serialize(assessment, true) });
  } catch (err) {
    console.error("Error updating assessment:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid assessment ID format." });
    }
    res.status(500).json({ success: false, message: "Server error while updating assessment." });
  }
}

export async function removeAssessment(req, res) {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, message: "Assessment deleted." });
}
