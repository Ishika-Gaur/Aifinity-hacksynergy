import AttemptResult from "../models/AttemptResult.js";
import User from "../models/User.js";

/**
 * Builds mistake map data from user's assessment attempts.
 * Returns concept-level mistake analysis with before/now comparison.
 */
function buildMistakeMapData(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      hasData: false,
      summary: null,
      concepts: [],
    };
  }

  // Group attempts by category (concept/topic)
  const categoryMap = {};
  attempts.forEach((attempt) => {
    const category = attempt.assessmentCategory || "General";
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        attempts: [],
        totalMistakes: 0,
        totalQuestions: 0,
      };
    }
    categoryMap[category].attempts.push(attempt);
    categoryMap[category].totalMistakes += (attempt.totalQuestions - attempt.correctCount);
    categoryMap[category].totalQuestions += attempt.totalQuestions;
  });

  // Split attempts into "before" (older) and "now" (recent) for comparison
  // Use the most recent 3 attempts as "now", rest as "before"
  const concepts = Object.values(categoryMap).map((catData) => {
    const sortedAttempts = [...catData.attempts].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    const splitIndex = Math.max(1, sortedAttempts.length - 3);
    
    const beforeAttempts = sortedAttempts.slice(0, splitIndex);
    const nowAttempts = sortedAttempts.slice(splitIndex);

    const beforeMistakes = beforeAttempts.reduce((sum, a) => sum + (a.totalQuestions - a.correctCount), 0);
    const nowMistakes = nowAttempts.reduce((sum, a) => sum + (a.totalQuestions - a.correctCount), 0);

    const beforeAvgScore = beforeAttempts.length > 0 
      ? Math.round(beforeAttempts.reduce((sum, a) => sum + a.scorePercent, 0) / beforeAttempts.length)
      : 0;
    const nowAvgScore = nowAttempts.length > 0
      ? Math.round(nowAttempts.reduce((sum, a) => sum + a.scorePercent, 0) / nowAttempts.length)
      : 0;

    // Determine if needs attention based on mistake trend
    const needsAttention = nowMistakes >= beforeMistakes && nowMistakes > 0;
    
    // Generate mistake pattern based on actual data
    let mistakePattern = "";
    let whyItHappened = "";
    let whatChanged = "";

    if (nowMistakes > beforeMistakes) {
      mistakePattern = "Mistakes increasing over recent attempts";
      whyItHappened = "Recent performance shows more errors compared to earlier attempts";
      whatChanged = "Concept needs review - current approach isn't working";
    } else if (nowMistakes < beforeMistakes) {
      mistakePattern = "Mistakes decreasing over recent attempts";
      whyItHappened = "Earlier attempts had more frequent errors";
      whatChanged = "Improvement observed - current approach is working";
    } else if (nowMistakes === beforeMistakes && nowMistakes > 0) {
      mistakePattern = "Consistent mistake pattern";
      whyItHappened = "Same error rate across attempts indicates a persistent gap";
      whatChanged = "No improvement yet - concept needs different learning approach";
    } else {
      mistakePattern = "Few or no mistakes";
      whyItHappened = "Strong performance in this area";
      whatChanged = "Concept well understood";
    }

    return {
      concept: catData.category,
      before: beforeMistakes,
      after: nowMistakes,
      needsAttention,
      mistakePattern,
      whyItHappened,
      whatChanged,
      beforeAvgScore,
      nowAvgScore,
      totalAttempts: catData.attempts.length,
      recentScore: nowAttempts.length > 0 ? nowAttempts[nowAttempts.length - 1].scorePercent : 0,
    };
  });

  // Sort by total mistakes (descending) to show most problematic concepts first
  concepts.sort((a, b) => (b.before + b.after) - (a.before + a.after));

  // Calculate summary metrics
  const totalMistakes = concepts.reduce((sum, c) => sum + c.before + c.after, 0);
  const conceptsNeedingAttention = concepts.filter((c) => c.needsAttention).length;
  const improvedConcepts = concepts.filter((c) => c.after < c.before && c.before > 0).length;
  const mostFrequentMistakeArea = concepts.length > 0 ? concepts[0].concept : null;

  const summary = {
    totalMistakes,
    conceptsAffected: concepts.length,
    conceptsNeedingAttention,
    improvedConcepts,
    mostFrequentMistakeArea,
  };

  return {
    hasData: true,
    summary,
    concepts,
  };
}

/**
 * GET /api/mistake-map
 * Returns personalized Mistake Map analysis for the authenticated user.
 */
export async function getMistakeMap(req, res) {
  try {
    const user = req.user;

    // Fetch all attempts for this user, sorted most recent first
    const attempts = await AttemptResult.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .lean();

    const mistakeMapData = buildMistakeMapData(attempts);

    return res.json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
        },
        ...mistakeMapData,
      },
    });
  } catch (err) {
    console.error("[MistakeMap] Error fetching MistakeMap data:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to load your Mistake Map analysis. Please try again.",
    });
  }
}
