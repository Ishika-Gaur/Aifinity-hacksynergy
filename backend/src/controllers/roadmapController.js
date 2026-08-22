import AttemptResult from "../models/AttemptResult.js";
import User from "../models/User.js";

/**
 * Computes per-category performance from attempts.
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
  if (avgScore >= 75) return "completed";
  if (avgScore >= 55) return "current";
  if (avgScore >= 40) return "upcoming";
  return "locked";
}

/**
 * Generates personalized roadmap stages from assessment data.
 * Prioritizes weak areas and builds a logical learning sequence.
 */
function buildRoadmapStages(catStats, careerGoal) {
  if (!catStats || catStats.length === 0) {
    return [];
  }

  // Sort by performance (weakest first for priority)
  const sortedByPerformance = [...catStats].sort((a, b) => a.avgScore - b.avgScore);

  // Build stages based on performance tiers
  const stages = [];
  
  // Stage 1: Foundation (weakest areas - highest priority)
  const foundationAreas = sortedByPerformance.filter((c) => c.avgScore < 55);
  if (foundationAreas.length > 0) {
    stages.push({
      id: 1,
      title: `Foundation: ${foundationAreas[0].category} Fundamentals`,
      phase: "Foundational Learning",
      status: "current",
      concepts: foundationAreas.slice(0, 3).map((c) => c.category),
      description: `Strengthen your understanding of ${foundationAreas[0].category} and related foundational concepts.`,
      priority: "high",
      estimatedDuration: `${foundationAreas.length * 2} Weeks`,
    });
  }

  // Stage 2: Core Competency (improving areas)
  const coreAreas = sortedByPerformance.filter((c) => c.avgScore >= 55 && c.avgScore < 75);
  if (coreAreas.length > 0) {
    stages.push({
      id: 2,
      title: `Core Competency: ${coreAreas[0].category} Mastery`,
      phase: "Skill Development",
      status: foundationAreas.length === 0 ? "current" : "upcoming",
      concepts: coreAreas.slice(0, 3).map((c) => c.category),
      description: `Build intermediate proficiency in ${coreAreas[0].category} and related skills.`,
      priority: "medium",
      estimatedDuration: `${coreAreas.length * 2} Weeks`,
    });
  }

  // Stage 3: Advanced (strong areas - for reinforcement)
  const advancedAreas = sortedByPerformance.filter((c) => c.avgScore >= 75);
  if (advancedAreas.length > 0) {
    stages.push({
      id: 3,
      title: `Advanced: ${advancedAreas[0].category} Specialization`,
      phase: "Advanced Application",
      status: "upcoming",
      concepts: advancedAreas.slice(0, 3).map((c) => c.category),
      description: `Apply advanced ${advancedAreas[0].category} concepts in complex scenarios.`,
      priority: "low",
      estimatedDuration: `${advancedAreas.length * 2} Weeks`,
    });
  }

  // Stage 4: Integration (if user has multiple areas)
  if (catStats.length >= 2) {
    stages.push({
      id: 4,
      title: "Integration: Cross-Domain Application",
      phase: "Career Readiness",
      status: "locked",
      concepts: ["Project Integration", "System Design", "Portfolio Development"],
      description: "Integrate learned skills into comprehensive projects and build your professional portfolio.",
      priority: "medium",
      estimatedDuration: "4-6 Weeks",
    });
  }

  return stages;
}

/**
 * GET /api/roadmap
 * Returns personalized learning roadmap based on real assessment performance.
 */
export async function getRoadmap(req, res) {
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
    const catStats = getCategoryStats(attempts);
    const avgScore = Math.round(attempts.reduce((s, a) => s + a.scorePercent, 0) / attempts.length);

    // Identify current focus (weakest area)
    const sortedByPerformance = [...catStats].sort((a, b) => a.avgScore - b.avgScore);
    const currentFocus = sortedByPerformance.length > 0 ? sortedByPerformance[0] : null;

    // Build roadmap stages
    const stages = buildRoadmapStages(catStats, careerGoal);

    // Build next steps based on weak areas
    const nextSteps = sortedByPerformance
      .filter((c) => c.avgScore < 75)
      .slice(0, 3)
      .map((cat) => ({
        concept: cat.category,
        currentScore: cat.avgScore,
        targetScore: 75,
        action: `Practice ${cat.category} assessments`,
        priority: cat.avgScore < 50 ? "high" : cat.avgScore < 65 ? "medium" : "low",
      }));

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
        currentPosition: {
          overallScore: avgScore,
          totalAssessments: attempts.length,
          currentFocus: currentFocus ? {
            concept: currentFocus.category,
            score: currentFocus.avgScore,
            status: scoreToStatus(currentFocus.avgScore),
          } : null,
        },
        roadmap: {
          stages,
          totalStages: stages.length,
        },
        nextSteps,
        categoryPerformance: catStats,
      },
    });
  } catch (err) {
    console.error("[Roadmap] Error fetching Roadmap data:", err);
    return res.status(500).json({ success: false, message: "Unable to load your Roadmap. Please try again." });
  }
}
