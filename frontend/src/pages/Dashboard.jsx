import React, { useState } from "react";
import Container from "../components/Container";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import LearningProgressChart from "../components/dashboard/LearningProgressChart";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import CognifyModules from "../components/dashboard/CognifyModules";
import RoadmapSection from "../components/dashboard/RoadmapSection";
import RecentAssessmentsTable from "../components/dashboard/RecentAssessmentsTable";
import NextStepsCard from "../components/dashboard/NextStepsCard";
import CareerGoalCard from "../components/dashboard/CareerGoalCard";
import { careerGoalPresets, dashboardData } from "../data/dashboardData";

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState("Machine Learning Engineer");
  const [customGoalOverride, setCustomGoalOverride] = useState(null);

  // Retrieve active dataset matching the selected career goal pathway
  const activePreset = careerGoalPresets[selectedRole] || dashboardData;

  const activeDataset = customGoalOverride
    ? {
        ...activePreset,
        careerGoal: customGoalOverride,
        skillGap: {
          ...activePreset.skillGap,
          targetCareer: customGoalOverride.role,
        },
      }
    : activePreset;

  const {
    user,
    quotes = dashboardData.quotes,
    stats,
    progressSeries,
    aiInsight,
    conceptRoot,
    mistakeMap,
    skillGap,
    roadmap,
    assessments,
    recommendations,
    careerGoal,
  } = activeDataset;

  const handleUpdateGoal = (updatedGoal) => {
    if (updatedGoal?.role) {
      if (careerGoalPresets[updatedGoal.role]) {
        setSelectedRole(updatedGoal.role);
        setCustomGoalOverride(null);
      } else {
        setSelectedRole(updatedGoal.role);
        setCustomGoalOverride(updatedGoal);
      }
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <Container size="wide">
        <div className="flex flex-col gap-8">
          {/* 1. DASHBOARD HEADER WITH ROTATING MOTIVATIONAL QUOTES */}
          <DashboardHeader user={user} quotes={quotes} />

          {/* 2. LEARNING OVERVIEW (4 STAT CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label={stats.overallProgress.label}
              value={stats.overallProgress.value}
              unit={stats.overallProgress.unit}
              change={stats.overallProgress.change}
              href="/assessment"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <StatCard
              label={stats.assessments.label}
              value={stats.assessments.value}
              unit={stats.assessments.unit}
              change={stats.assessments.change}
              href="/assessment"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              label={stats.learningStreak.label}
              value={stats.learningStreak.value}
              unit={stats.learningStreak.unit}
              change={stats.learningStreak.change}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              }
            />
            <StatCard
              label={stats.skillsImproved.label}
              value={stats.skillsImproved.value}
              unit={stats.skillsImproved.unit}
              change={stats.skillsImproved.change}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
          </div>

          {/* 3. LEARNING PROGRESS CHART & 4. AI LEARNING INSIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <LearningProgressChart key={selectedRole} seriesData={progressSeries} />
            </div>
            <div className="lg:col-span-1 h-full">
              <AIInsightCard aiInsight={aiInsight} />
            </div>
          </div>

          {/* 5. COGNIFY AI MODULES (ConceptRoot, MistakeMap, SkillGap) */}
          <div>
            <CognifyModules
              conceptRoot={conceptRoot}
              mistakeMap={mistakeMap}
              skillGap={skillGap}
            />
          </div>

          {/* 6. LEARNING ROADMAP */}
          <div>
            <RoadmapSection roadmap={roadmap} />
          </div>

          {/* 7. RECENT ASSESSMENTS */}
          <div>
            <RecentAssessmentsTable assessments={assessments} />
          </div>

          {/* 8. RECOMMENDED NEXT STEPS & 9. CAREER GOAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NextStepsCard recommendations={recommendations} />
            </div>
            <div className="lg:col-span-1">
              <CareerGoalCard
                careerGoal={careerGoal}
                onUpdateGoal={handleUpdateGoal}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
