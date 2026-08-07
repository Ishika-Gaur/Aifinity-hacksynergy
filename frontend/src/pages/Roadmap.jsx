// import Container from '../components/Container';
// import Section from '../components/Section';

// export default function Roadmap() {
//   return (
//     <Section>
//       <Container>
//         <div className="text-center py-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Roadmap</h1>
//           <p className="text-xl text-gray-600">Coming Soon</p>
//         </div>
//       </Container>
//     </Section>
//   );
// }



import { useState } from "react";
import Container from "../components/Container";
import Section from "../components/Section";
import Button from "../components/Button";

/*
|--------------------------------------------------------------------------
| MOCK AI ROADMAP DATA
|--------------------------------------------------------------------------
| This is temporary frontend data.
| Later, the backend/AI will provide this dynamically.
|
| The structure is intentionally domain-independent.
| It can represent:
| - Mathematics
| - Finance
| - Business
| - Programming
| - Physics
| - Communication
| - Any other learning domain
|--------------------------------------------------------------------------
*/

const ROADMAP_DATA = {
  learner: {
    name: "Student",
    currentDomain: "Financial Analysis",
    confidence: 82,
    progress: 64,
    goal: "Build strong analytical and financial decision-making skills",
  },

  domains: [
    {
      name: "Finance",
      score: 72,
      level: "Developing",
    },
    {
      name: "Mathematics",
      score: 68,
      level: "Developing",
    },
    {
      name: "Business",
      score: 54,
      level: "Needs Focus",
    },
    {
      name: "Communication",
      score: 76,
      level: "Strong",
    },
  ],

  strengths: [
    "Financial fundamentals",
    "Basic quantitative reasoning",
    "Business terminology",
  ],

  gaps: [
    "Company valuation",
    "Risk analysis",
    "Connecting ratios with business decisions",
  ],

  recommendation: {
    title: "Strengthen company valuation fundamentals",
    description:
      "Your recent performance suggests that you understand individual financial concepts, but need more practice connecting them to real business decisions.",
    reason:
      "Cognify identified a gap between financial-ratio knowledge and practical valuation reasoning.",
    action: "Start Valuation Fundamentals",
  },

  stages: [
    {
      id: 1,
      title: "Financial Ratios",
      category: "Foundation",
      status: "completed",
      duration: "3 days",
      concepts: [
        "Profitability ratios",
        "Liquidity ratios",
        "Solvency ratios",
        "Efficiency ratios",
      ],
      description:
        "Build a strong understanding of how financial ratios describe the health and performance of a business.",
      questions: 12,
    },

    {
      id: 2,
      title: "Company Valuation",
      category: "Current Focus",
      status: "current",
      duration: "5 days",
      concepts: [
        "Enterprise value",
        "DCF fundamentals",
        "P/E ratio",
        "Growth assumptions",
      ],
      description:
        "Learn how financial information can be used to estimate the value of a company.",
      questions: 15,
    },

    {
      id: 3,
      title: "Risk Analysis",
      category: "Next",
      status: "upcoming",
      duration: "4 days",
      concepts: [
        "Market risk",
        "Business risk",
        "Risk-return relationship",
        "Scenario analysis",
      ],
      description:
        "Understand how uncertainty and risk influence financial decisions.",
      questions: 10,
    },

    {
      id: 4,
      title: "Financial Modelling",
      category: "Advanced",
      status: "locked",
      duration: "7 days",
      concepts: [
        "Forecasting",
        "Financial statements",
        "Sensitivity analysis",
        "Scenario modelling",
      ],
      description:
        "Apply your financial knowledge to structured real-world modelling problems.",
      questions: 18,
    },

    {
      id: 5,
      title: "Investment Analysis",
      category: "Application",
      status: "locked",
      duration: "6 days",
      concepts: [
        "Investment evaluation",
        "Portfolio concepts",
        "Fundamental analysis",
        "Decision making",
      ],
      description:
        "Combine your previous skills to evaluate investment opportunities and make informed decisions.",
      questions: 14,
    },
  ],
};

const DOMAIN_ICONS = {
  Finance: "₹",
  Mathematics: "∑",
  Business: "◈",
  Communication: "Aa",
};

function StatusBadge({ status }) {
  const styles = {
    completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    current:
      "border-cyan-200 bg-cyan-50 text-cyan-700",
    upcoming:
      "border-indigo-200 bg-indigo-50 text-indigo-700",
    locked:
      "border-slate-200 bg-slate-100 text-slate-500",
  };

  const labels = {
    completed: "Completed",
    current: "Current Focus",
    upcoming: "Next Step",
    locked: "Locked",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        styles[status],
      ].join(" ")}
    >
      {status === "completed" && "✓ "}
      {status === "current" && "● "}
      {status === "upcoming" && "→ "}
      {status === "locked" && "🔒 "}
      {labels[status]}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function DomainCard({ domain }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-indigo-600 transition-colors group-hover:bg-indigo-50">
            {DOMAIN_ICONS[domain.name] || "✦"}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {domain.name}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {domain.level}
            </p>
          </div>
        </div>

        <span className="text-lg font-bold text-slate-900">
          {domain.score}%
        </span>
      </div>

      <div className="mt-5">
        <ProgressBar value={domain.score} />
      </div>
    </div>
  );
}

function StageCard({ stage, expanded, onToggle, onStart }) {
  const isLocked = stage.status === "locked";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border bg-white transition-all duration-300",
        stage.status === "current"
          ? "border-indigo-300 shadow-lg shadow-indigo-100/60"
          : "border-slate-200 hover:border-slate-300 hover:shadow-lg",
        isLocked ? "opacity-75" : "",
      ].join(" ")}
    >
      {stage.status === "current" && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Number */}
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              stage.status === "completed"
                ? "bg-emerald-50 text-emerald-700"
                : stage.status === "current"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : stage.status === "locked"
                ? "bg-slate-100 text-slate-400"
                : "bg-indigo-50 text-indigo-600",
            ].join(" ")}
          >
            {stage.status === "completed" ? "✓" : stage.id}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={stage.status} />

                  <span className="text-xs font-medium text-slate-400">
                    {stage.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {stage.title}
                </h3>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                <span>◷</span>
                {stage.duration}
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {stage.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {stage.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {concept}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {stage.questions}
                </span>{" "}
                practice questions
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(stage.id)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {expanded ? "Hide details" : "View details"}
                </button>

                {!isLocked && (
                  <Button
                    size="sm"
                    variant={
                      stage.status === "current"
                        ? "primary"
                        : "outline"
                    }
                    onClick={() => onStart(stage)}
                  >
                    {stage.status === "completed"
                      ? "Review"
                      : stage.status === "current"
                      ? "Start Learning"
                      : "Preview"}
                  </Button>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  What you'll work on
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {stage.concepts.map((concept, index) => (
                    <div
                      key={concept}
                      className="flex items-center gap-3 rounded-lg bg-white p-3"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {concept}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const [expandedStage, setExpandedStage] = useState(2);
  const [activeDomain, setActiveDomain] = useState("All");
  const [showProfile, setShowProfile] = useState(false);
  const [notification, setNotification] = useState("");

  const handleToggle = (id) => {
    setExpandedStage((current) => (current === id ? null : id));
  };

  const handleStart = (stage) => {
    setNotification(
      `${stage.title} is ready. Your learning session will begin here.`
    );

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const domains =
    activeDomain === "All"
      ? ROADMAP_DATA.domains
      : ROADMAP_DATA.domains.filter(
          (domain) => domain.name === activeDomain
        );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Notification */}
      {notification && (
        <div className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-md rounded-xl border border-cyan-200 bg-white p-4 shadow-2xl shadow-slate-300/30 sm:right-6">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 font-bold text-cyan-600">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Cognify AI
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {notification}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

        <Container size="wide">
          <div className="relative py-14 sm:py-18 lg:py-20">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                <span className="text-cyan-500">✦</span>
                AI-Powered Learning Path
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
                Your path from{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  where you are
                </span>{" "}
                to where you want to be.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#64748B] sm:text-lg">
                Cognify analyzes your questions, answers, mistakes, and
                performance to build a learning roadmap around your actual
                skill gaps — not a predefined course.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("next-action")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  icon={<span>↓</span>}
                >
                  Continue Learning
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowProfile((value) => !value)}
                >
                  {showProfile
                    ? "Hide Skill Profile"
                    : "View Skill Profile"}
                </Button>
              </div>
            </div>

            {/* Learner summary */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Direction
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {ROADMAP_DATA.learner.currentDomain}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  AI confidence:{" "}
                  <span className="font-semibold text-cyan-600">
                    {ROADMAP_DATA.learner.confidence}%
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Roadmap Progress
                </p>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-2xl font-bold text-slate-900">
                    {ROADMAP_DATA.learner.progress}%
                  </p>

                  <span className="text-xs font-medium text-slate-500">
                    1 of 5 stages completed
                  </span>
                </div>

                <div className="mt-3">
                  <ProgressBar value={ROADMAP_DATA.learner.progress} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Learning Goal
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                  {ROADMAP_DATA.learner.goal}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SKILL PROFILE */}
      {showProfile && (
        <section className="border-b border-slate-200 bg-[#F1F5F9]">
          <Container size="wide">
            <div className="py-12">
              <div className="mb-7">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  ✦ Performance Intelligence
                </span>

                <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">
                  Your cross-domain skill profile
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Your roadmap isn't limited to one subject. Cognify can
                  understand patterns across different fields as your
                  questions evolve.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ROADMAP_DATA.domains.map((domain) => (
                  <DomainCard key={domain.name} domain={domain} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* NEXT BEST ACTION */}
      <section id="next-action">
        <Container size="wide">
          <div className="py-14 sm:py-16">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                ✦ Cognify Recommendation
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#0F172A] sm:text-3xl">
                What should you do next?
              </h2>

              <p className="mt-2 text-sm text-[#64748B]">
                Your next step is selected from your current performance and
                identified skill gaps.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-xl shadow-indigo-100/40">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-600 via-violet-600 to-cyan-500" />

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                        HIGH PRIORITY
                      </span>

                      <span className="text-xs text-slate-400">
                        Based on recent performance
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      {ROADMAP_DATA.recommendation.title}
                    </h3>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                      {ROADMAP_DATA.recommendation.description}
                    </p>

                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Why Cognify recommended this
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {ROADMAP_DATA.recommendation.reason}
                      </p>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <Button
                      size="lg"
                      onClick={() =>
                        handleStart({
                          title:
                            ROADMAP_DATA.recommendation.action,
                        })
                      }
                      icon={<span>→</span>}
                    >
                      {ROADMAP_DATA.recommendation.action}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ROADMAP */}
      <section className="border-t border-slate-200 bg-white">
        <Container size="wide">
          <div className="py-14 sm:py-16 lg:py-20">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Personalized Learning Path
                </span>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
                  Your roadmap
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Move through each stage at your own pace. Cognify can
                  update this path as your performance changes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  ...ROADMAP_DATA.domains.map((domain) => domain.name),
                ].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setActiveDomain(domain)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                      activeDomain === domain
                        ? "bg-[#0F172A] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700",
                    ].join(" ")}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            {/* Main roadmap */}
            <div className="relative mt-10">
              {/* Vertical line */}
              <div className="absolute bottom-8 left-5 top-8 hidden w-px bg-gradient-to-b from-emerald-300 via-indigo-300 to-slate-200 sm:block" />

              <div className="space-y-5">
                {ROADMAP_DATA.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="relative sm:pl-16"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-6 hidden h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-xs font-bold text-slate-500 shadow-sm sm:flex">
                      {stage.status === "completed"
                        ? "✓"
                        : stage.id}
                    </div>

                    <StageCard
                      stage={stage}
                      expanded={expandedStage === stage.id}
                      onToggle={handleToggle}
                      onStart={handleStart}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* STRENGTHS + GAPS */}
      <section className="bg-[#F1F5F9]">
        <Container size="wide">
          <div className="py-14 sm:py-16">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                AI Skill Analysis
              </span>

              <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">
                Why this roadmap looks the way it does
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Cognify balances what you're already good at with the areas
                that are preventing you from progressing.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Your strengths
                    </h3>

                    <p className="text-xs text-slate-500">
                      Skills Cognify sees as established
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {ROADMAP_DATA.strengths.map((strength) => (
                    <div
                      key={strength}
                      className="flex items-center gap-3 rounded-xl bg-emerald-50/60 p-3"
                    >
                      <span className="text-sm text-emerald-600">
                        ✓
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {strength}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              <div className="rounded-2xl border border-amber-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    !
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Your skill gaps
                    </h3>

                    <p className="text-xs text-slate-500">
                      Areas affecting your next level
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {ROADMAP_DATA.gaps.map((gap) => (
                    <div
                      key={gap}
                      className="flex items-center gap-3 rounded-xl bg-amber-50/60 p-3"
                    >
                      <span className="text-sm text-amber-600">
                        →
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {gap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* DYNAMIC ROADMAP MESSAGE */}
      <section className="bg-[#0F172A]">
        <Container size="wide">
          <div className="py-14 text-center sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-cyan-400">
              ✦
            </div>

            <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-bold text-white sm:text-3xl">
              Your roadmap is not fixed.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Every question you ask gives Cognify more information about
              what you know, where you struggle, and where you can improve.
              Your learning path evolves with you.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                as="a"
                href="/assessment"
                size="lg"
                className="!border-indigo-500 !bg-indigo-600 hover:!bg-indigo-500"
              >
                Take an Assessment
              </Button>

              <Button
                as="a"
                href="/skill-gap"
                variant="outline"
                size="lg"
                className="!border-slate-600 !bg-transparent !text-white hover:!bg-white/10 hover:!text-white"
              >
                Explore Skill Gap
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}