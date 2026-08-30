import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import LearningProgressChart from "../components/dashboard/LearningProgressChart";
import Calendar from "../components/Calendar";
import { dashboardApi } from "../services/api";

const PAGE_CONFIG = {
  progress: { title: "Overall Progress", description: "Your assessment performance and learning momentum." },
  assessments: { title: "Assessment History", description: "Every completed assessment for your account." },
  streak: { title: "Learning Streak", description: "Your assessment activity by calendar day." },
  skills: { title: "Skills Improved", description: "Measured improvements across assessment categories." },
};

function Metric({ label, value }) {
  return (
    <div className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-5 shadow-[var(--shadow-card)]">
      <p className="font-['Space_Mono'] text-xs font-bold uppercase tracking-wider text-[#5B6B5F]">{label}</p>
      <p className="mt-2 font-['Kalam'] text-4xl font-bold text-[#1B332C]">{value}</p>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-10 text-center shadow-[var(--shadow-card)]">
      <p className="font-['Kalam'] text-xl text-[#1B332C]">{children}</p>
      <Link to="/assessment" className="mt-4 inline-block font-['Space_Mono'] text-xs font-bold text-[#1B332C] hover:text-[#C4952A]">
        Browse Assessments →
      </Link>
    </div>
  );
}

function CategoryList({ items, emptyText }) {
  if (!items.length) return <p className="text-sm text-[#5B6B5F]">{emptyText}</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.category} className="flex items-center justify-between gap-4 rounded border border-[#2E4F42]/10 bg-[#F1EDE1]/45 px-4 py-3">
          <span className="font-medium text-[#1B332C]">{item.category}</span>
          <span className="font-['Space_Mono'] text-xs font-bold text-[#C4952A]">{item.avgScore}%</span>
        </div>
      ))}
    </div>
  );
}

function AttemptsTable({ attempts }) {
  return (
    <div className="overflow-x-auto rounded border border-[#2E4F42]/10">
      <table className="min-w-[680px] w-full text-left text-sm">
        <thead className="bg-[#EDE6D3] font-['Space_Mono'] text-xs font-bold text-[#1B332C]">
          <tr><th className="p-4">ASSESSMENT</th><th className="p-4">CATEGORY</th><th className="p-4 text-center">SCORE</th><th className="p-4 text-right">COMPLETED</th></tr>
        </thead>
        <tbody className="divide-y divide-[#2E4F42]/10 bg-[#FBF8F0]">
          {attempts.map((attempt) => (
            <tr key={attempt.id}>
              <td className="p-4 font-semibold text-[#1B332C]">{attempt.title}</td>
              <td className="p-4 text-[#5B6B5F]">{attempt.category}</td>
              <td className="p-4 text-center font-['Kalam'] text-lg font-bold text-[#1B332C]">{attempt.scorePercent}%</td>
              <td className="p-4 text-right font-['Space_Mono'] text-xs text-[#5B6B5F]">{new Date(attempt.completedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProgressDetails({ data }) {
  const { progress } = data;
  if (!progress.completedActivities) return <EmptyState>Complete your first assessment to start tracking your performance.</EmptyState>;
  return <div className="space-y-8">
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><Metric label="Overall progress" value={`${progress.overallProgress}%`} /><Metric label="Recent average" value={`${progress.recentAverage}%`} /><Metric label="Trend" value={progress.trend === null ? "—" : `${progress.trend > 0 ? "+" : ""}${progress.trend}%`} /></div>
    <LearningProgressChart seriesData={progress.progressSeries} />
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-6"><h2 className="mb-4 text-xl font-bold text-[#1B332C]">Strong areas</h2><CategoryList items={progress.strongAreas} emptyText="Complete more assessments to identify your strongest areas." /></section><section className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-6"><h2 className="mb-4 text-xl font-bold text-[#1B332C]">Areas to improve</h2><CategoryList items={progress.weakAreas} emptyText="No weak areas identified yet." /></section></div>
  </div>;
}

function AssessmentDetails({ data }) {
  const { assessments } = data;
  if (!assessments.totalCompleted) return <EmptyState>Complete your first assessment to start building your history.</EmptyState>;
  return <div className="space-y-8"><div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><Metric label="Completed" value={assessments.totalCompleted} /><Metric label="Average score" value={`${assessments.averageScore}%`} /><Metric label="Highest score" value={`${assessments.highestScore}%`} /></div><AttemptsTable attempts={assessments.history} /></div>;
}

function StreakDetails({ data }) {
  const { streak } = data;
  
  // Transform backend streak data to the format expected by Calendar component
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  
  // Build dailyAssessments array from calendar data
  const dailyAssessments = streak.calendar.map((day) => ({
    id: day.date || `day-${day.day}`,
    day: day.day,
    isToday: day.isToday || false,
    status: day.active ? "Completed" : day.isPadding ? "Locked" : "Available",
    title: day.active ? "Assessment completed" : "Available"
  }));
  
  // Add padding cells for days before the first day of the month
  const paddingCells = Array.from({ length: startDayOfWeek }).map((_, i) => ({
    id: `pad-${i}`,
    day: null,
    isToday: false,
    status: "Locked",
    title: ""
  }));
  
  const allDays = [...paddingCells, ...dailyAssessments];
  
  // Build profile object from available data
  const profile = {
    field: "Learning",
    careerGoal: "Skill Development",
    skills: []
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Metric label="Current streak" value={`${streak.current} days`} />
        <Metric label="Longest streak" value={`${streak.longest} days`} />
        <Metric label="Active days" value={streak.activeDays} />
      </div>
      {!streak.activeDays ? (
        <EmptyState>Start learning today to build your streak.</EmptyState>
      ) : (
        <section className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-6">
          <Calendar
            streak={streak.current}
            profile={profile}
            dailyAssessments={allDays}
            completedDays={streak.activeDays}
            showProgress={false}
          />
        </section>
      )}
    </div>
  );
}

function SkillsDetails({ data }) {
  const { skills } = data;
  if (!skills.improved.length) return <EmptyState>Complete more learning activities to see measurable skill improvements.</EmptyState>;
  return <div className="space-y-8"><div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><Metric label="Skills improved" value={skills.improved.length} /><Metric label="Strong areas" value={skills.strongAreas.length} /><Metric label="Needs attention" value={skills.needsAttention.length} /></div><section className="rounded-md border border-[#2E4F42]/12 bg-[#FBF8F0] p-6"><h2 className="mb-4 text-xl font-bold text-[#1B332C]">Measured improvements</h2><div className="space-y-3">{skills.improved.map((skill) => <div key={skill.category} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded border border-[#2E4F42]/10 bg-[#F1EDE1]/45 px-4 py-3 text-sm"><span className="font-semibold text-[#1B332C]">{skill.category}</span><span className="text-[#5B6B5F]">{skill.previousScore}% → {skill.currentScore}%</span><span className="font-['Space_Mono'] text-xs text-[#5B6B5F]">{skill.attempts} attempts</span><span className="font-['Space_Mono'] text-xs font-bold text-[#2E4F42]">+{skill.improvement}%</span></div>)}</div></section></div>;
}

export default function DashboardMetricPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { metric } = useParams();
  const config = PAGE_CONFIG[metric];
  const load = useCallback(async () => { const response = await dashboardApi.get(); if (response.success && response.data?.analytics) setData(response.data); else setError(response.error || "Unable to load your performance data."); }, []);
  useEffect(() => { load(); }, [load]);
  const content = data && ({ progress: <ProgressDetails data={data.analytics} />, assessments: <AssessmentDetails data={data.analytics} />, streak: <StreakDetails data={data.analytics} />, skills: <SkillsDetails data={data.analytics} /> })[metric];
  if (!config) return <Navigate to="/dashboard" replace />;
  return <div className="min-h-screen py-8 sm:py-10"><Container size="wide"><div className="mx-auto max-w-6xl"><Link to="/dashboard" className="font-['Space_Mono'] text-xs font-bold text-[#1B332C] hover:text-[#C4952A]">← Back to dashboard</Link><header className="mt-5 mb-8"><h1 className="font-['Kalam'] text-4xl font-bold text-[#1B332C]">{config.title}</h1><p className="mt-2 text-[#5B6B5F]">{config.description}</p></header>{error ? <div className="rounded-md border border-[#C1443C]/30 bg-[#FBF8F0] p-6 text-[#C1443C]">{error}</div> : content || <div className="py-20 text-center text-[#5B6B5F]">Loading your data…</div>}</div></Container></div>;
}
