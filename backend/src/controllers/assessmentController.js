import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import AttemptResult from "../models/AttemptResult.js";
import { generatePersonalizedRoadmap } from "./analyticsController.js";

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
  const questions = (data.questions || []).map((question) => {
    const item = { ...question, id: String(question._id || question.id) };
    delete item._id;
    if (!includeAnswers) delete item.answer;
    return item;
  });
  return { ...data, id: String(data._id || data.id), _id: undefined, questions };
};

export async function listPublished(req, res) {
  const assessments = await Assessment.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a, false)) });
}

export async function getPublished(req, res) {
  let assessment = null;
  const targetId = req.params.id;

  if (mongoose.Types.ObjectId.isValid(targetId)) {
    assessment = await Assessment.findOne({ _id: targetId, status: "published" });
  }

  if (!assessment) {
    assessment = await Assessment.findOne({
      $or: [
        { category: new RegExp(targetId, "i") },
        { field: new RegExp(targetId, "i") },
        { title: new RegExp(targetId, "i") },
      ],
      status: "published",
    });
  }

  if (!assessment) {
    return res.status(404).json({ success: false, message: "Assessment not found." });
  }

  res.json({ success: true, assessment: serialize(assessment, false) });
}

export async function startAttempt(req, res) {
  let assessment = null;
  const targetId = req.params.id;

  if (mongoose.Types.ObjectId.isValid(targetId)) {
    assessment = await Assessment.findOne({ _id: targetId, status: "published" });
  }

  if (!assessment) {
    assessment = await Assessment.findOne({
      $or: [
        { category: new RegExp(targetId, "i") },
        { field: new RegExp(targetId, "i") },
        { title: new RegExp(targetId, "i") },
      ],
      status: "published",
    });
  }

  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (assessment) {
    const rawData = assessment.toObject ? assessment.toObject() : assessment;
    const answersMap = new Map();

    const shuffledQuestions = shuffleArray(rawData.questions || []).map((q) => {
      const qId = String(q._id || q.id);
      const originalAnswer = q.answer;
      const originalOptions = q.options ? [...q.options] : null;

      answersMap.set(qId, {
        type: q.type,
        answer: originalAnswer,
        options: originalOptions,
        concept: q.concept || assessment.category || "General",
      });

      const questionItem = {
        id: qId,
        type: q.type,
        difficulty: q.difficulty,
        concept: q.concept || assessment.category || "General",
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
      assessmentTitle: assessment.title,
      assessmentCategory: assessment.category || "General",
      assessmentField: assessment.field || "",
      createdAt: Date.now(),
      answersMap,
    });

    const assessmentMeta = serialize(assessment, false);
    assessmentMeta.questions = shuffledQuestions;

    return res.json({
      success: true,
      attemptId,
      assessment: assessmentMeta,
    });
  }

  // Session metadata fallback for client side or preset assessments
  activeAttemptSessions.set(attemptId, {
    assessmentId: targetId,
    assessmentTitle: req.body.assessmentTitle || targetId,
    assessmentCategory: req.body.assessmentCategory || "General",
    createdAt: Date.now(),
    answersMap: new Map(),
  });

  return res.json({
    success: true,
    attemptId,
    assessment: null,
  });
}

function getNormalizedType(q) {
  const t = String(q.type || "").toLowerCase().trim();
  if (["mcq", "multiple-choice", "scenario", "logical-reasoning", "data-interpretation"].includes(t)) {
    return "mcq";
  }
  if (["true_false", "true-false", "tf", "boolean"].includes(t)) {
    return "true_false";
  }
  if (["short_answer", "short-answer", "short", "output", "fill-in-the-blank"].includes(t)) {
    return "short_answer";
  }
  if (["long_answer", "long-answer", "essay", "descriptive", "conceptual", "problem-solving", "coding"].includes(t)) {
    return "long_answer";
  }
  if (Array.isArray(q.options) && q.options.length > 0) {
    if (q.options.length === 2) {
      const o0 = String(q.options[0]).toLowerCase();
      const o1 = String(q.options[1]).toLowerCase();
      if ((o0 === "true" || o0 === "false") && (o1 === "true" || o1 === "false")) {
        return "true_false";
      }
    }
    return "mcq";
  }
  return "short_answer";
}

function evaluateSingleQuestion(q, userResp, sessionQ) {
  const maxMarks = 10;
  const normType = getNormalizedType(q);
  const qId = String(q._id || q.id);
  const qText = q.question || q.questionText || "Question Prompt";

  const originalAnswer = sessionQ ? sessionQ.answer : q.answer;
  const originalOptions = sessionQ ? (sessionQ.options || q.options) : q.options;
  const shuffledOptions = sessionQ ? sessionQ.shuffledOptions : q.options;

  // Unanswered Check
  if (userResp === undefined || userResp === null || String(userResp).trim() === "") {
    return {
      questionId: qId,
      questionText: qText,
      type: normType,
      userAnswer: null,
      correctAnswer: originalAnswer != null ? String(originalAnswer) : "N/A",
      status: "unanswered",
      isCorrect: false,
      marksAwarded: 0,
      maxMarks,
      explanation: "Question was left unanswered.",
    };
  }

  // 1. MCQ
  if (normType === "mcq") {
    let userText = String(userResp);
    if (typeof userResp === "number" && Array.isArray(shuffledOptions) && shuffledOptions[userResp] !== undefined) {
      userText = shuffledOptions[userResp];
    }

    let correctText = String(originalAnswer);
    if (typeof originalAnswer === "number" && Array.isArray(originalOptions) && originalOptions[originalAnswer] !== undefined) {
      correctText = originalOptions[originalAnswer];
    }

    const isMatch = userText.trim().toLowerCase() === correctText.trim().toLowerCase();
    return {
      questionId: qId,
      questionText: qText,
      type: normType,
      userAnswer: userText,
      correctAnswer: correctText,
      status: isMatch ? "correct" : "incorrect",
      isCorrect: isMatch,
      marksAwarded: isMatch ? maxMarks : 0,
      maxMarks,
      explanation: isMatch ? "Correct option selected." : `Incorrect option selected. You chose "${userText}".`,
    };
  }

  // 2. TRUE / FALSE
  if (normType === "true_false") {
    let userChoice = String(userResp).trim().toLowerCase();
    if (userResp === 0 || userResp === "0") userChoice = "true";
    if (userResp === 1 || userResp === "1") userChoice = "false";
    if (userChoice === "t" || userChoice === "yes") userChoice = "true";
    if (userChoice === "f" || userChoice === "no") userChoice = "false";

    let correctChoice = String(originalAnswer).trim().toLowerCase();
    if (originalAnswer === true || originalAnswer === 0 || originalAnswer === "0" || correctChoice === "t" || correctChoice === "yes") correctChoice = "true";
    if (originalAnswer === false || originalAnswer === 1 || originalAnswer === "1" || correctChoice === "f" || correctChoice === "no") correctChoice = "false";

    const isMatch = userChoice === correctChoice;
    const formattedUser = userChoice === "true" ? "True" : "False";
    const formattedCorrect = correctChoice === "true" ? "True" : "False";

    return {
      questionId: qId,
      questionText: qText,
      type: normType,
      userAnswer: formattedUser,
      correctAnswer: formattedCorrect,
      status: isMatch ? "correct" : "incorrect",
      isCorrect: isMatch,
      marksAwarded: isMatch ? maxMarks : 0,
      maxMarks,
      explanation: isMatch ? "Correct choice selected." : `Incorrect choice. You selected "${formattedUser}".`,
    };
  }

  // 3. SHORT ANSWER
  if (normType === "short_answer") {
    const userText = String(userResp).trim();
    const correctText = originalAnswer ? String(originalAnswer).trim() : "";

    const cleanUser = userText.toLowerCase().replace(/[^\w\s]/gi, "");
    const cleanCorrect = correctText.toLowerCase().replace(/[^\w\s]/gi, "");

    let isMatch = cleanUser === cleanCorrect;
    if (!isMatch && cleanCorrect && cleanUser.includes(cleanCorrect)) {
      isMatch = true;
    }

    return {
      questionId: qId,
      questionText: qText,
      type: normType,
      userAnswer: userText,
      correctAnswer: correctText || "Valid short answer required",
      status: isMatch ? "correct" : "incorrect",
      isCorrect: isMatch,
      marksAwarded: isMatch ? maxMarks : 0,
      maxMarks,
      explanation: isMatch ? "Exact/Normalized match with target answer." : `Submitted: "${userText}". Expected: "${correctText}".`,
    };
  }

  // 4. LONG ANSWER / ESSAY / CODE
  if (normType === "long_answer") {
    const userText = String(userResp).trim();
    const modelAnswer = originalAnswer ? String(originalAnswer).trim() : "";

    const words = userText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let marksAwarded = 0;
    let status = "incorrect";
    let isCorrect = false;
    let explanation = "";

    if (modelAnswer) {
      const modelKeywords = modelAnswer
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const uniqueKeywords = [...new Set(modelKeywords)];
      let matchedCount = 0;
      const cleanUserLower = userText.toLowerCase();

      uniqueKeywords.forEach((kw) => {
        if (cleanUserLower.includes(kw)) matchedCount++;
      });

      const matchRatio = uniqueKeywords.length ? matchedCount / uniqueKeywords.length : 0.5;

      if (matchRatio >= 0.6 && wordCount >= 10) {
        marksAwarded = maxMarks;
        status = "correct";
        isCorrect = true;
        explanation = "Comprehensive answer covering key technical concepts accurately.";
      } else if (matchRatio >= 0.3 || wordCount >= 25) {
        marksAwarded = 7;
        status = "partial";
        isCorrect = true;
        explanation = "Satisfactory answer covering core points with relevant detail.";
      } else if (wordCount >= 10) {
        marksAwarded = 5;
        status = "partial";
        isCorrect = false;
        explanation = "Basic response provided, but lacks necessary depth and key concepts.";
      } else {
        marksAwarded = 2;
        status = "incorrect";
        isCorrect = false;
        explanation = "Response is too brief to adequately address the question prompt.";
      }
    } else {
      if (wordCount >= 25) {
        marksAwarded = maxMarks;
        status = "correct";
        isCorrect = true;
        explanation = "Detailed, thorough answer provided.";
      } else if (wordCount >= 10) {
        marksAwarded = 7;
        status = "partial";
        isCorrect = true;
        explanation = "Clear response provided.";
      } else {
        marksAwarded = 3;
        status = "incorrect";
        isCorrect = false;
        explanation = "Response is too brief.";
      }
    }

    return {
      questionId: qId,
      questionText: qText,
      type: normType,
      userAnswer: userText,
      correctAnswer: modelAnswer || "Detailed explanation",
      status,
      isCorrect,
      marksAwarded,
      maxMarks,
      explanation,
    };
  }

  return {
    questionId: qId,
    questionText: qText,
    type: normType,
    userAnswer: String(userResp),
    correctAnswer: "N/A",
    status: "correct",
    isCorrect: true,
    marksAwarded: maxMarks,
    maxMarks,
    explanation: "Answer submitted.",
  };
}

export async function submitAttempt(req, res) {
  const {
    attemptId,
    responses = {},
    elapsedSeconds = 0,
    violations = [],
    assessmentTitle: bodyTitle,
    assessmentCategory: bodyCategory,
    assessmentField: bodyField,
  } = req.body;

  let assessment = null;
  const targetId = req.params.id;

  if (mongoose.Types.ObjectId.isValid(targetId)) {
    assessment = await Assessment.findById(targetId);
  }

  if (!assessment) {
    assessment = await Assessment.findOne({
      $or: [
        { category: new RegExp(targetId, "i") },
        { field: new RegExp(targetId, "i") },
        { title: new RegExp(targetId, "i") },
      ],
    });
  }

  const session = activeAttemptSessions.get(attemptId);
  const rawQuestions = (assessment && assessment.questions) ? assessment.questions : [];

  const questionResults = [];
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  if (rawQuestions.length > 0) {
    rawQuestions.forEach((q) => {
      const qId = String(q._id || q.id);
      const userResp = responses ? responses[qId] : undefined;
      const sessionQ = session && session.answersMap ? session.answersMap.get(qId) : null;

      const evalResult = evaluateSingleQuestion(q, userResp, sessionQ);
      evalResult.concept = q.concept || sessionQ?.concept || assessment?.category || bodyCategory || "General";
      questionResults.push(evalResult);

      totalScore += evalResult.marksAwarded;
      maxScore += evalResult.maxMarks;

      if (evalResult.status === "correct" || evalResult.marksAwarded >= 7) {
        correctCount++;
      } else if (evalResult.status === "unanswered") {
        unansweredCount++;
      } else {
        incorrectCount++;
      }
    });
  } else if (req.body.questionResults && Array.isArray(req.body.questionResults)) {
    // If client supplied evaluated question results directly
    req.body.questionResults.forEach((q) => {
      questionResults.push({
        ...q,
        concept: q.concept || bodyCategory || "General",
      });
      const marks = q.marksAwarded || (q.isCorrect ? 10 : 0);
      const maxM = q.maxMarks || 10;
      totalScore += marks;
      maxScore += maxM;

      if (q.isCorrect || marks >= 7) correctCount++;
      else if (q.status === "unanswered") unansweredCount++;
      else incorrectCount++;
    });
  }

  const totalQuestions = rawQuestions.length || questionResults.length || 1;
  if (maxScore === 0) maxScore = totalQuestions * 10;

  const percentage = maxScore > 0 ? Math.min(100, Math.round((totalScore / maxScore) * 100)) : (req.body.scorePercent || 0);

  if (attemptId) {
    activeAttemptSessions.delete(attemptId);
  }

  const title = assessment?.title || bodyTitle || (targetId ? `Assessment (${targetId})` : "General Assessment");
  const category = assessment?.category || bodyCategory || "General";
  const field = assessment?.field || bodyField || "";

  // Persist the attempt result for the authenticated user (dashboard & roadmap analytics)
  if (req.user) {
    try {
      await AttemptResult.create({
        userId: req.user._id,
        assessmentId: assessment?._id,
        assessmentTitle: title,
        assessmentCategory: category,
        assessmentField: field,
        scorePercent: percentage,
        totalScore,
        maxScore,
        correctCount,
        incorrectCount,
        unansweredCount,
        gradableCount: totalQuestions,
        totalQuestions,
        elapsedSeconds: elapsedSeconds || 0,
        questionResults,
        completedAt: new Date(),
      });

      // Automatically regenerate personalized roadmap with latest assessment results
      await generatePersonalizedRoadmap(req.user._id);
    } catch (saveErr) {
      console.error("[Dashboard] Failed to persist attempt result:", saveErr.message);
    }
  }

  res.json({
    success: true,
    scorePercent: percentage,
    totalScore,
    maxScore,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    answeredCount: totalQuestions - unansweredCount,
    totalQuestions,
    questionResults,
    elapsedSeconds,
    violationsCount: violations.length,
    violations,
    autoSubmitted: violations.length >= 3,
  });
}

/**
 * Direct attempt result synchronization endpoint.
 * Guaranteed to save attempt results to MongoDB and trigger personalized roadmap updates.
 */
export async function syncAttemptResult(req, res) {
  try {
    const userId = req.user._id;
    const {
      assessmentTitle = "Assessment",
      assessmentCategory = "General",
      assessmentField = "",
      scorePercent = 0,
      totalScore = 0,
      maxScore = 10,
      correctCount = 0,
      incorrectCount = 0,
      unansweredCount = 0,
      totalQuestions = 1,
      elapsedSeconds = 0,
      questionResults = [],
    } = req.body;

    const attempt = await AttemptResult.create({
      userId,
      assessmentTitle,
      assessmentCategory,
      assessmentField,
      scorePercent: Math.min(100, Math.max(0, Number(scorePercent))),
      totalScore: Number(totalScore),
      maxScore: Number(maxScore),
      correctCount: Number(correctCount),
      incorrectCount: Number(incorrectCount),
      unansweredCount: Number(unansweredCount),
      gradableCount: Number(totalQuestions),
      totalQuestions: Number(totalQuestions),
      elapsedSeconds: Number(elapsedSeconds),
      questionResults,
      completedAt: new Date(),
    });

    // Automatically regenerate personalized roadmap with latest assessment results
    const updatedRoadmap = await generatePersonalizedRoadmap(userId);

    return res.json({
      success: true,
      message: "Attempt synchronized successfully and personalized roadmap updated.",
      attemptId: attempt._id,
      roadmap: updatedRoadmap,
    });
  } catch (err) {
    console.error("[Assessment] Error syncing attempt result:", err);
    return res.status(500).json({ success: false, message: "Failed to sync attempt result." });
  }
}

export async function listAdmin(req, res) {
  const assessments = await Assessment.find().sort({ createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a, true)) });
}

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
