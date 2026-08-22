import { ASSESSMENTS } from "../data/assessments";
import { assessmentApi } from "./api";

// Private closure cache for offline / fallback attempt sessions (never exposed to React state or window)
const attemptSessionCache = new Map();

/**
 * Fisher-Yates array shuffler
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Normalizes answer comparison
 */
function checkAnswerMatch(question, response, originalAnswer) {
  if (response === undefined || response === null || response === "") return false;

  if (question.type === "output") {
    return String(response).trim().toLowerCase() === String(originalAnswer).trim().toLowerCase();
  }

  // Options-based question types (MCQ, scenario, logical-reasoning, data-interpretation)
  if (Array.isArray(question.options)) {
    // response is index in shuffled options
    const selectedOptionText = typeof response === "number" ? question.options[response] : String(response);
    
    // originalAnswer could be string or index in original options
    let correctOptionText = originalAnswer;
    if (typeof originalAnswer === "number" && question._originalOptions) {
      correctOptionText = question._originalOptions[originalAnswer];
    }
    
    return String(selectedOptionText).trim().toLowerCase() === String(correctOptionText).trim().toLowerCase();
  }

  return false;
}

/**
 * Creates a fresh, randomized assessment attempt.
 * Strips correct answers before returning question objects to the caller.
 */
export async function createAttemptSession(assessmentId) {
  // 1. Try backend API first if available
  try {
    const apiRes = await assessmentApi.startAttempt(assessmentId);
    if (apiRes && apiRes.success && apiRes.assessment) {
      return {
        success: true,
        attemptId: apiRes.attemptId,
        assessment: apiRes.assessment,
        isRemote: true,
      };
    }
  } catch (err) {
    // Fall back to local randomized attempt session generator
  }

  // 2. Fallback: Generate local randomized session from ASSESSMENTS pool
  const rawAssessment = ASSESSMENTS.find(
    (a) => String(a.id) === String(assessmentId) || String(a._id) === String(assessmentId)
  );

  if (!rawAssessment) {
    return { success: false, message: "Assessment not found." };
  }

  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const answersMap = new Map();

  // Shuffle question order
  const shuffledQuestions = shuffleArray(rawAssessment.questions || []).map((q, idx) => {
    const qId = q.id || q._id || `q_${idx}`;
    const originalAnswer = q.answer;
    
    // Store correct answer in private closure cache only
    answersMap.set(qId, {
      answer: originalAnswer,
      type: q.type,
      options: q.options ? [...q.options] : null,
    });

    // Copy question & randomize option order if options exist
    const questionCopy = { ...q, id: qId };
    delete questionCopy.answer; // SECURITY: Strip answer out of question object

    if (Array.isArray(q.options) && q.options.length > 0) {
      const originalOptions = [...q.options];
      const shuffledOptions = shuffleArray(originalOptions);
      questionCopy.options = shuffledOptions;
      // Store original options reference internally in closure
      answersMap.get(qId)._originalOptions = originalOptions;
      answersMap.get(qId).shuffledOptions = shuffledOptions;
    }

    return questionCopy;
  });

  // Save in closure-private session cache
  attemptSessionCache.set(attemptId, {
    assessmentId,
    createdAt: Date.now(),
    answersMap,
    questions: shuffledQuestions,
  });

  return {
    success: true,
    attemptId,
    assessment: {
      ...rawAssessment,
      questions: shuffledQuestions,
    },
    isRemote: false,
  };
}

/**
 * Validates and submits assessment answers server-side (or via session validator).
 * Correct answers are never sent to or evaluated inside frontend UI state.
 */
export async function submitAttemptSession(assessmentId, attemptId, responses, elapsedSeconds, violations = []) {
  // 1. Try backend API first if available
  try {
    const apiRes = await assessmentApi.submitAttempt(assessmentId, {
      attemptId,
      responses,
      elapsedSeconds,
      violations,
    });
    if (apiRes && apiRes.success) {
      return apiRes;
    }
  } catch (err) {
    // Fall back to local session evaluation
  }

  // 2. Fallback: Validate against private closure session cache
  const session = attemptSessionCache.get(attemptId);
  const rawAssessment = ASSESSMENTS.find(
    (a) => String(a.id) === String(assessmentId) || String(a._id) === String(assessmentId)
  );

  const questions = session ? session.questions : (rawAssessment ? rawAssessment.questions : []);
  const answersMap = session ? session.answersMap : null;

  const GRADABLE_TYPES = ["mcq", "scenario", "logical-reasoning", "data-interpretation", "output"];
  const gradableQuestions = questions.filter((q) => GRADABLE_TYPES.includes(q.type));
  let correctCount = 0;

  gradableQuestions.forEach((q) => {
    const userResp = responses[q.id];
    let isCorrect = false;

    if (answersMap && answersMap.has(q.id)) {
      const cached = answersMap.get(q.id);
      isCorrect = checkAnswerMatch(q, userResp, cached.answer);
    } else if (q.answer !== undefined) {
      // Fallback check if session expired
      isCorrect = checkAnswerMatch(q, userResp, q.answer);
    }

    if (isCorrect) correctCount++;
  });

  const scorePercent = gradableQuestions.length
    ? Math.round((correctCount / gradableQuestions.length) * 100)
    : 0;

  // Clean up session cache
  if (attemptId) {
    attemptSessionCache.delete(attemptId);
  }

  return {
    success: true,
    scorePercent,
    correctCount,
    gradableCount: gradableQuestions.length,
    answeredCount: Object.keys(responses || {}).length,
    totalQuestions: questions.length,
    elapsedSeconds,
    violationsCount: violations.length,
    violations,
    autoSubmitted: violations.length >= 3,
  };
}
