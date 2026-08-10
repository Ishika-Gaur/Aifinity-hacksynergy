import { useState, useMemo, useEffect } from "react";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Card from "../components/Card";
import CtaBanner from "../components/CtaBanner";

/* =========================================================
   REUSABLE SVG ICONS
========================================================= */
function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function BriefcaseIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-5 h-5 animate-spin" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* =========================================================
   CAREER FIELD ROADMAP GENERATOR TEMPLATES
========================================================= */
const PRESET_CAREERS = [
  {
    id: "software",
    title: "Full-Stack Software Engineer",
    field: "Technology",
    icon: "⌘",
    duration: "6 Months",
    stages: [
      {
        id: 1,
        title: "Phase 1: Programming Fundamentals & Data Structures",
        phase: "Foundations (0-25% Readiness)",
        status: "completed",
        duration: "4 Weeks",
        concepts: ["Algorithms & Big-O", "Data Structures", "Git & Version Control", "Object-Oriented Design"],
        description: "Master foundational problem solving, data structures, and fundamental programming concepts.",
        questions: 20,
      },
      {
        id: 2,
        title: "Phase 2: Modern Frontend & State Management",
        phase: "Core Competency (25-50% Readiness)",
        status: "current",
        duration: "6 Weeks",
        concepts: ["React & Component Architecture", "State Management & Hooks", "Tailwind CSS & Responsive Layouts", "REST & Async Data Fetching"],
        description: "Build interactive, high-performance web applications using modern component-driven libraries.",
        questions: 25,
      },
      {
        id: 3,
        title: "Phase 3: Backend Systems & API Architecture",
        phase: "Advanced Specialization (50-75% Readiness)",
        status: "upcoming",
        duration: "6 Weeks",
        concepts: ["Node.js & Express APIs", "Relational & NoSQL Databases", "Authentication & Security", "System Architecture & Caching"],
        description: "Design secure, scalable backend microservices, database schemas, and robust API endpoints.",
        questions: 30,
      },
      {
        id: 4,
        title: "Phase 4: Full-Stack Capstone & Job Readiness Portfolio",
        phase: "Career Readiness (75-100% Job Ready)",
        status: "locked",
        duration: "8 Weeks",
        concepts: ["Production Cloud Deployment (Vite/Docker)", "CI/CD Pipeline Integration", "System Design Mock Interviews", "Portfolio & Resume Showcase"],
        description: "Complete real-world full-stack capstone applications, optimize performance, and verify job readiness.",
        questions: 25,
      },
    ],
  },
  {
    id: "data",
    title: "Data Scientist & AI Specialist",
    field: "Data & AI",
    icon: "⚛",
    duration: "6 Months",
    stages: [
      {
        id: 1,
        title: "Phase 1: Python, Math & Data Analysis Foundations",
        phase: "Foundations (0-25% Readiness)",
        status: "completed",
        duration: "4 Weeks",
        concepts: ["Python for Data Science", "Pandas & NumPy Dataframes", "Linear Algebra & Statistics", "Data Cleaning & Wrangling"],
        description: "Build deep quantitative skills, exploratory data analysis techniques, and statistical modeling basics.",
        questions: 18,
      },
      {
        id: 2,
        title: "Phase 2: Supervised & Unsupervised Machine Learning",
        phase: "Core Competency (25-50% Readiness)",
        status: "current",
        duration: "6 Weeks",
        concepts: ["Scikit-Learn Modeling", "Regression & Classification", "Feature Engineering", "Model Evaluation Metrics"],
        description: "Train, tune, and evaluate machine learning models for predictive analytics.",
        questions: 22,
      },
      {
        id: 3,
        title: "Phase 3: Deep Learning & Generative AI",
        phase: "Advanced Specialization (50-75% Readiness)",
        status: "upcoming",
        duration: "8 Weeks",
        concepts: ["PyTorch / TensorFlow Neural Nets", "NLP & Large Language Models", "Computer Vision Basics", "Fine-Tuning & Prompting"],
        description: "Implement neural network architectures and leverage GenAI models for complex real-world datasets.",
        questions: 28,
      },
      {
        id: 4,
        title: "Phase 4: MLOps Deployment & AI Career Readiness",
        phase: "Career Readiness (75-100% Job Ready)",
        status: "locked",
        duration: "6 Weeks",
        concepts: ["Model Deployment APIs", "BigQuery / SQL Analytics", "Kaggle & Portfolio Projects", "Technical Case Interview Prep"],
        description: "Deploy machine learning pipelines to cloud infrastructure and build an industry-grade portfolio.",
        questions: 20,
      },
    ],
  },
  {
    id: "finance",
    title: "Financial & Investment Analyst",
    field: "Finance",
    icon: "₹",
    duration: "5 Months",
    stages: [
      {
        id: 1,
        title: "Phase 1: Financial Statements & Accounting Logic",
        phase: "Foundations (0-25% Readiness)",
        status: "completed",
        duration: "4 Weeks",
        concepts: ["Income Statement & Balance Sheet", "Cash Flow Modeling", "Financial Ratio Analysis", "Working Capital Management"],
        description: "Understand core accounting logic and evaluate business operational health.",
        questions: 15,
      },
      {
        id: 2,
        title: "Phase 2: Valuation Frameworks & DCF Modeling",
        phase: "Core Competency (25-50% Readiness)",
        status: "current",
        duration: "5 Weeks",
        concepts: ["Discounted Cash Flow (DCF)", "Enterprise Value & Multiples", "Growth Assumptions & WACC", "Comparable Company Analysis"],
        description: "Learn to estimate intrinsic valuation of public and private companies.",
        questions: 20,
      },
      {
        id: 3,
        title: "Phase 3: Risk Sensitivity & Financial Modeling",
        phase: "Advanced Specialization (50-75% Readiness)",
        status: "upcoming",
        duration: "5 Weeks",
        concepts: ["Excel / Python Financial Modeling", "Scenario & Sensitivity Analysis", "Macroeconomic Risk Assessment", "Capital Structure Optimization"],
        description: "Build quantitative financial models to evaluate investment trade-offs under uncertainty.",
        questions: 24,
      },
      {
        id: 4,
        title: "Phase 4: Equity Research & Investment Committee Pitch",
        phase: "Career Readiness (75-100% Job Ready)",
        status: "locked",
        duration: "6 Weeks",
        concepts: ["Investment Teaser Creation", "Portfolio Risk Management", "Equity Research Report Writing", "Mock Investment Pitch"],
        description: "Draft professional investment memos and pitch equity recommendations to hiring managers.",
        questions: 18,
      },
    ],
  },
];

/* =========================================================
   PROGRESS & STATUS SUB-COMPONENTS
========================================================= */
function StatusBadge({ status }) {
  const styles = {
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    current: "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
    upcoming: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    locked: "border-slate-200 bg-slate-100 text-slate-500",
  };

  const labels = {
    completed: "Completed Phase",
    current: "Active Focus",
    upcoming: "Next Milestone",
    locked: "Locked Phase",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
        styles[status] || styles.locked
      }`}
    >
      {status === "completed" && <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />}
      {status === "current" && <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
      {status === "upcoming" && <ArrowRightIcon className="w-3.5 h-3.5 text-indigo-600" />}
      {status === "locked" && <LockIcon className="w-3.5 h-3.5 text-slate-400" />}
      {labels[status]}
    </span>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 transition-all duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function StageCard({ stage, expanded, onToggle, onStart, onToggleCompletion }) {
  const isLocked = stage.status === "locked";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        stage.status === "current"
          ? "border-indigo-300 shadow-lg shadow-indigo-100/60 ring-2 ring-indigo-500/10"
          : "border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
      } ${isLocked ? "opacity-80 bg-slate-50/50" : ""}`}
    >
      {stage.status === "current" && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Completion Toggle Circle */}
          <button
            type="button"
            onClick={() => !isLocked && onToggleCompletion(stage.id)}
            title={isLocked ? "Locked phase" : "Click to mark phase completed"}
            disabled={isLocked}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
              stage.status === "completed"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600 hover:scale-105 active:scale-95"
                : stage.status === "current"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95"
                : isLocked
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 active:scale-95"
            }`}
          >
            {stage.status === "completed" ? <CheckIcon className="w-5 h-5" /> : stage.id}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={stage.status} />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {stage.phase}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                <ClockIcon className="w-4 h-4 text-slate-400" />
                {stage.duration}
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {stage.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {stage.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {concept}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">{stage.questions}</span> career practice modules
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(stage.id)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95"
                >
                  {expanded ? "Hide details" : "View details"}
                </button>

                {!isLocked && (
                  <Button
                    size="sm"
                    variant={stage.status === "current" ? "primary" : "outline"}
                    onClick={() => onStart(stage)}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {stage.status === "completed"
                      ? "Review Phase"
                      : stage.status === "current"
                      ? "Start Learning"
                      : "Preview"}
                  </Button>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 sm:p-5 transition-all">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Required Competencies & Action Items
                </p>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {stage.concepts.map((concept, index) => (
                    <div
                      key={concept}
                      className="flex items-center gap-3 rounded-lg border border-indigo-50 bg-white p-3 shadow-xs transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-slate-700">
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

/* =========================================================
   MAIN ROADMAP COMPONENT
========================================================= */
export default function Roadmap() {
  const [selectedCareer, setSelectedCareer] = useState(PRESET_CAREERS[0]);
  const [customCareer, setCustomCareer] = useState("");
  const [targetTimeline] = useState("6 Months");
  const [stages, setStages] = useState(PRESET_CAREERS[0].stages);
  const [expandedStage, setExpandedStage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => setNotification(""), 4500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification]);

  // Calculate dynamic readiness score based on completed stages
  const readinessScore = useMemo(() => {
    const completedCount = stages.filter((s) => s.status === "completed").length;
    return Math.round((completedCount / stages.length) * 100);
  }, [stages]);

  const handleSelectPreset = (career) => {
    setSelectedCareer(career);
    setCustomCareer("");
    setStages(career.stages);
    setNotification(`Loaded end-to-end roadmap for ${career.title}.`);
  };

  const handleGenerateCustom = () => {
    if (!customCareer.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const generatedTitle = customCareer.trim();
      const generatedStages = [
        {
          id: 1,
          title: `Phase 1: Foundations of ${generatedTitle}`,
          phase: "Foundations (0-25% Readiness)",
          status: "completed",
          duration: "4 Weeks",
          concepts: ["Core Principles & Theory", "Essential Tools & Environment", "Fundamental Terminology", "Basic Hands-on Practice"],
          description: `Build complete baseline knowledge and setup required tools for ${generatedTitle}.`,
          questions: 15,
        },
        {
          id: 2,
          title: `Phase 2: Core Competencies & Real-World Projects`,
          phase: "Core Competency (25-50% Readiness)",
          status: "current",
          duration: "6 Weeks",
          concepts: ["Standard Workflows", "Intermediate Problem Solving", "Hands-on Project Building", "Quality Control"],
          description: `Implement hands-on projects and master intermediate skills expected in ${generatedTitle} roles.`,
          questions: 20,
        },
        {
          id: 3,
          title: `Phase 3: Advanced Specialization & Architecture`,
          phase: "Advanced Specialization (50-75% Readiness)",
          status: "upcoming",
          duration: "6 Weeks",
          concepts: ["Advanced Design Patterns", "Performance & Optimization", "Complex Problem Decomposition", "Industry Best Practices"],
          description: `Master advanced frameworks and system architecture techniques for professional proficiency.`,
          questions: 25,
        },
        {
          id: 4,
          title: `Phase 4: Industry Capstone & Job Readiness Portfolio`,
          phase: "Career Readiness (75-100% Job Ready)",
          status: "locked",
          duration: "6 Weeks",
          concepts: ["Production Portfolio Project", "Resume & LinkedIn Alignment", "Technical Mock Case Interviews", "Final Career Verification"],
          description: `Assemble your job readiness portfolio, pass mock assessments, and verify career readiness.`,
          questions: 20,
        },
      ];

      setSelectedCareer({
        id: "custom",
        title: generatedTitle,
        field: "Custom Career",
        icon: "✦",
        duration: targetTimeline,
        stages: generatedStages,
      });

      setStages(generatedStages);
      setNotification(`End-to-End Career Roadmap generated for "${generatedTitle}".`);
    }, 800);
  };

  const handleToggle = (id) => {
    setExpandedStage((current) => (current === id ? null : id));
  };

  const handleStart = (stage) => {
    setNotification(`${stage.title} session is ready. Proceed with practice modules.`);
  };

  const handleToggleCompletion = (id) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id === id) {
          const nextStatus =
            stage.status === "completed"
              ? "current"
              : stage.status === "current"
              ? "completed"
              : stage.status === "upcoming"
              ? "completed"
              : stage.status;
          return { ...stage, status: nextStatus };
        }
        return stage;
      })
    );
  };

  const filteredStages = useMemo(() => {
    if (!searchQuery.trim()) return stages;
    return stages.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [stages, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-md rounded-xl border border-cyan-200 bg-white p-4 shadow-2xl transition-all sm:right-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Afinity AI Career Guidance</p>
                <p className="mt-0.5 text-xs text-slate-600">{notification}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotification("")}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

        <Container size="wide">
          <div className="relative py-14 sm:py-18 lg:py-20">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-xs">
                <SparklesIcon className="w-4 h-4 text-cyan-500" />
                End-to-End AI Career Guidance & Readiness Engine
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Your complete path to{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  career readiness.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Tell Afinity AI what career or skill you want to master. We generate a 0-to-100% sequential roadmap providing step-by-step guidance from zero prerequisites to job readiness.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {PRESET_CAREERS.map((career) => (
                  <button
                    key={career.id}
                    type="button"
                    onClick={() => handleSelectPreset(career)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      selectedCareer.id === career.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs ring-2 ring-indigo-500/20 scale-105"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{career.icon}</span>
                    {career.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Career Input Card */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="custom-career" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Want a custom career roadmap? Type any field or skill goal:
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <BriefcaseIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="custom-career"
                    type="text"
                    placeholder="e.g. Cybersecurity Engineer, Product Manager, Cloud Architect..."
                    value={customCareer}
                    onChange={(e) => setCustomCareer(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
                  />
                </div>

                <Button
                  size="md"
                  disabled={!customCareer.trim() || isGenerating}
                  onClick={handleGenerateCustom}
                  icon={isGenerating ? <SpinnerIcon /> : <SparklesIcon className="w-4 h-4" />}
                >
                  {isGenerating ? "Generating Roadmap..." : "Generate Custom Roadmap"}
                </Button>
              </div>
            </div>

            {/* Career Readiness Analytics Bar */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card hoverable={false} className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Career Role
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900 truncate">
                  {selectedCareer.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Estimated Duration: <span className="font-semibold text-indigo-600">{selectedCareer.duration}</span>
                </p>
              </Card>

              <Card hoverable={false} className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Career Readiness Score
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-3xl font-bold text-slate-900">{readinessScore}%</p>
                  <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-800">
                    {readinessScore >= 75
                      ? "Job Ready"
                      : readinessScore >= 50
                      ? "Advanced Specialization"
                      : readinessScore >= 25
                      ? "Building Competency"
                      : "Foundations"}
                  </span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={readinessScore} />
                </div>
              </Card>

              <Card hoverable={false} className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Guidance Objective
                </p>
                <p className="mt-2 text-xs font-medium leading-5 text-slate-700">
                  From zero prerequisites to verified job readiness with practical portfolio milestones.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* END TO END ROADMAP STAGES */}
      <Section background="white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              End-to-End Career Progression
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {selectedCareer.title} Guidance Path
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Click stage numbers to mark phases completed and dynamically increase your Career Readiness Score.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter milestones & tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-10">
          <div className="absolute bottom-8 left-5 top-8 hidden w-0.5 bg-gradient-to-b from-emerald-300 via-indigo-300 to-slate-200 sm:block" />

          <div className="space-y-5">
            {filteredStages.map((stage) => (
              <div key={stage.id} className="relative sm:pl-16">
                <div
                  onClick={() => stage.status !== "locked" && handleToggleCompletion(stage.id)}
                  className={`absolute left-0 top-6 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white text-xs font-bold shadow-sm transition-all sm:flex hover:scale-110 active:scale-95 ${
                    stage.status === "completed"
                      ? "bg-emerald-500 text-white"
                      : stage.status === "current"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {stage.status === "completed" ? <CheckIcon className="w-4 h-4" /> : stage.id}
                </div>

                <StageCard
                  stage={stage}
                  expanded={expandedStage === stage.id}
                  onToggle={handleToggle}
                  onStart={handleStart}
                  onToggleCompletion={handleToggleCompletion}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* JOB READINESS CHECKLIST SECTION */}
      <Section background="tint">
        <SectionHeading
          eyebrow="JOB READINESS VERIFICATION"
          title="What makes you job-ready?"
          subtitle="Afinity AI verifies your readiness through four essential career criteria."
        />

        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              num: "01",
              title: "Foundational Theory",
              desc: "Master foundational concepts, terminology, and core principles of your domain.",
              done: readinessScore >= 25,
            },
            {
              num: "02",
              title: "Applied Projects",
              desc: "Build real-world hands-on projects demonstrating practical problem solving.",
              done: readinessScore >= 50,
            },
            {
              num: "03",
              title: "System Architecture",
              desc: "Understand enterprise design patterns, scaling trade-offs, and tool ecosystems.",
              done: readinessScore >= 75,
            },
            {
              num: "04",
              title: "Portfolio & Interview",
              desc: "Complete technical case studies, portfolio showcase, and mock interviews.",
              done: readinessScore >= 100,
            },
          ].map((item) => (
            <Card key={item.num} hoverable className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">{item.num}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    item.done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.done ? "Verified ✓" : "Pending"}
                </span>
              </div>
              <h4 className="mt-4 font-bold text-slate-900 text-base">{item.title}</h4>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section background="white">
        <CtaBanner
          eyebrow="CAREER INTELLIGENCE"
          title="Verify your skills with Afinity AI Skill Gap."
          buttonLabel="Explore Skill Gap"
          href="/skill-gap"
        />
      </Section>
    </div>
  );
}