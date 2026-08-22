import AttemptResult from "../models/AttemptResult.js";
import User from "../models/User.js";

/**
 * Computes per-category performance from attempts.
 * Returns array of { category, avgScore, count }
 */
function getCategoryStats(attempts) {
  const map = {};
  attempts.forEach((a) => {
    const cat = a.assessmentCategory || "General";
    if (!map[cat]) map[cat] = { sum: 0, count: 0 };
    map[cat].sum += a.scorePercent;
    map[cat].count++;
  });
  return Object.entries(map).map(([category, { sum, count }]) => ({
    category,
    avgScore: Math.round(sum / count),
    count,
  }));
}

/**
 * Maps an average score to a status label.
 */
function scoreToStatus(avgScore) {
  if (avgScore >= 75) return "strong";
  if (avgScore >= 55) return "improving";
  return "attention";
}

/**
 * GET /api/skill-gap
 * Returns personalized Skill Gap analysis based on real assessment performance.
 */
export async function getSkillGap(req, res) {
  try {
    const user = req.user;
    const attempts = await AttemptResult.find({ userId: user._id }).sort({ completedAt: -1 }).lean();

    if (!attempts || attempts.length === 0) {
      return res.json({
        success: true,
        data: {
          hasData: false,
          user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            careerGoal: user.onboardingProfile?.careerGoal || user.selectedField || "",
          },
        },
      });
    }

    const careerGoal = user.onboardingProfile?.careerGoal || user.selectedField || "";
    const totalAttempts = attempts.length;
    const avgScore = Math.round(attempts.reduce((s, a) => s + a.scorePercent, 0) / totalAttempts);
    const catStats = getCategoryStats(attempts);

    // Strong areas (>= 75%)
    const strongAreas = catStats.filter((c) => c.avgScore >= 75).sort((a, b) => b.avgScore - a.avgScore);

    // Areas needing improvement (< 60%)
    const weakAreas = catStats.filter((c) => c.avgScore < 60).sort((a, b) => a.avgScore - b.avgScore);

    // Improving areas (55-74%)
    const improvingAreas = catStats.filter((c) => c.avgScore >= 55 && c.avgScore < 75).sort((a, b) => b.avgScore - a.avgScore);

    // Calculate skill gaps for weak areas
    const skillGaps = weakAreas.map((area) => {
      const targetScore = 75; // Target proficiency threshold
      const gap = Math.max(targetScore - area.avgScore, 0);
      const priority = gap >= 20 ? "High" : gap >= 10 ? "Medium" : "Low";
      
      return {
        name: area.category,
        current: area.avgScore,
        target: targetScore,
        gap,
        priority,
        attempts: area.count,
      };
    });

    // Identify demonstrated strengths
    const strengths = strongAreas.map((area) => area.category);

    return res.json({
      success: true,
      data: {
        hasData: true,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          careerGoal,
        },
        performance: {
          overallScore: avgScore,
          totalAssessments: totalAttempts,
          strongAreasCount: strongAreas.length,
          improvingAreasCount: improvingAreas.length,
          weakAreasCount: weakAreas.length,
        },
        skills: {
          strongAreas,
          improvingAreas,
          weakAreas,
          skillGaps,
          strengths,
        },
        categoryPerformance: catStats,
      },
    });
  } catch (err) {
    console.error("[SkillGap] Error fetching SkillGap data:", err);
    return res.status(500).json({ success: false, message: "Unable to load your Skill Gap analysis. Please try again." });
  }
}
