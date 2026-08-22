import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Card from "../components/Card";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";

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
      { id: 1, title: "Phase 1: Programming Fundamentals & Data Structures", phase: "Foundations (0-25% Readiness)", status: "completed", duration: "4 Weeks", concepts: ["Algorithms & Big-O", "Data Structures", "Git & Version Control", "Object-Oriented Design"], description: "Master foundational problem solving, data structures, and fundamental programming concepts.", questions: 20 },
      { id: 2, title: "Phase 2: Modern Frontend & State Management", phase: "Core Competency (25-50% Readiness)", status: "current", duration: "6 Weeks", concepts: ["React & Component Architecture", "State Management & Hooks", "Tailwind CSS & Responsive Layouts", "REST & Async Data Fetching"], description: "Build interactive, high-performance web applications using modern component-driven libraries.", questions: 25 },
      { id: 3, title: "Phase 3: Backend Systems & API Architecture", phase: "Advanced Specialization (50-75% Readiness)", status: "upcoming", duration: "6 Weeks", concepts: ["Node.js & Express APIs", "Relational & NoSQL Databases", "Authentication & Security", "System Architecture & Caching"], description: "Design secure, scalable backend microservices, database schemas, and robust API endpoints.", questions: 30 },
      { id: 4, title: "Phase 4: Full-Stack Capstone & Job Readiness Portfolio", phase: "Career Readiness (75-100% Job Ready)", status: "locked", duration: "8 Weeks", concepts: ["Production Cloud Deployment (Vite/Docker)", "CI/CD Pipeline Integration", "System Design Mock Interviews", "Portfolio & Resume Showcase"], description: "Complete real-world full-stack capstone applications, optimize performance, and verify job readiness.", questions: 25 },
    ],
  },
  {
    id: "data",
    title: "Data Scientist & AI Specialist",
    field: "Data & AI",
    icon: "⚛",
    duration: "6 Months",
    stages: [
      { id: 1, title: "Phase 1: Python, Math & Data Analysis Foundations", phase: "Foundations (0-25% Readiness)", status: "completed", duration: "4 Weeks", concepts: ["Python for Data Science", "Pandas & NumPy Dataframes", "Linear Algebra & Statistics", "Data Cleaning & Wrangling"], description: "Build deep quantitative skills, exploratory data analysis techniques, and statistical modeling basics.", questions: 18 },
      { id: 2, title: "Phase 2: Supervised & Unsupervised Machine Learning", phase: "Core Competency (25-50% Readiness)", status: "current", duration: "6 Weeks", concepts: ["Scikit-Learn Modeling", "Regression & Classification", "Feature Engineering", "Model Evaluation Metrics"], description: "Train, tune, and evaluate machine learning models for predictive analytics.", questions: 22 },
      { id: 3, title: "Phase 3: Deep Learning & Generative AI", phase: "Advanced Specialization (50-75% Readiness)", status: "upcoming", duration: "8 Weeks", concepts: ["PyTorch / TensorFlow Neural Nets", "NLP & Large Language Models", "Computer Vision Basics", "Fine-Tuning & Prompting"], description: "Implement neural network architectures and leverage GenAI models for complex real-world datasets.", questions: 28 },
      { id: 4, title: "Phase 4: MLOps Deployment & AI Career Readiness", phase: "Career Readiness (75-100% Job Ready)", status: "locked", duration: "6 Weeks", concepts: ["Model Deployment APIs", "BigQuery / SQL Analytics", "Kaggle & Portfolio Projects", "Technical Case Interview Prep"], description: "Deploy machine learning pipelines to cloud infrastructure and build an industry-grade portfolio.", questions: 20 },
    ],
  },
  {
    id: "finance",
    title: "Financial & Investment Analyst",
    field: "Finance",
    icon: "₹",
    duration: "5 Months",
    stages: [
      { id: 1, title: "Phase 1: Financial Statements & Accounting Logic", phase: "Foundations (0-25% Readiness)", status: "completed", duration: "4 Weeks", concepts: ["Income Statement & Balance Sheet", "Cash Flow Modeling", "Financial Ratio Analysis", "Working Capital Management"], description: "Understand core accounting logic and evaluate business operational health.", questions: 15 },
      { id: 2, title: "Phase 2: Valuation Frameworks & DCF Modeling", phase: "Core Competency (25-50% Readiness)", status: "current", duration: "5 Weeks", concepts: ["Discounted Cash Flow (DCF)", "Enterprise Value & Multiples", "Growth Assumptions & WACC", "Comparable Company Analysis"], description: "Learn to estimate intrinsic valuation of public and private companies.", questions: 20 },
      { id: 3, title: "Phase 3: Risk Sensitivity & Financial Modeling", phase: "Advanced Specialization (50-75% Readiness)", status: "upcoming", duration: "5 Weeks", concepts: ["Excel / Python Financial Modeling", "Scenario & Sensitivity Analysis", "Macroeconomic Risk Assessment", "Capital Structure Optimization"], description: "Build quantitative financial models to evaluate investment trade-offs under uncertainty.", questions: 24 },
      { id: 4, title: "Phase 4: Equity Research & Investment Committee Pitch", phase: "Career Readiness (75-100% Job Ready)", status: "locked", duration: "6 Weeks", concepts: ["Investment Teaser Creation", "Portfolio Risk Management", "Equity Research Report Writing", "Mock Investment Pitch"], description: "Draft professional investment memos and pitch equity recommendations to hiring managers.", questions: 18 },
    ],
  },
];

/* =========================================================
   CUSTOM CAREER DROPDOWN OPTIONS (used to auto-generate a roadmap)
========================================================= */
const CUSTOM_CAREER_OPTIONS = [
  "Cybersecurity Engineer",
  "Product Manager",
  "Cloud Architect",
  "UI/UX Designer",
  "DevOps Engineer",
  "Digital Marketing Specialist",
  "Business Analyst",
  "Mobile App Developer",
];

/* =========================================================
   PROGRESS & STATUS SUB-COMPONENTS (theme tokens)
========================================================= */
function StatusBadge({ status }) {
  const styleMap = {
    completed: { borderColor: "var(--color-confirm)", background: "var(--color-primary-50)", color: "var(--color-confirm)" },
    current: { borderColor: "var(--color-accent)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" },
    upcoming: { borderColor: "var(--color-primary-200)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" },
    locked: { borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-light)" },
  };

  const labels = {
    completed: "Completed Phase",
    current: "Active Focus",
    upcoming: "Next Milestone",
    locked: "Locked Phase",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200"
      style={styleMap[status] || styleMap.locked}
    >
      {status === "completed" && <CheckIcon className="w-3.5 h-3.5" style={{ color: "var(--color-confirm)" }} />}
      {status === "current" && <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--color-accent)" }} />}
      {status === "upcoming" && <ArrowRightIcon className="w-3.5 h-3.5" style={{ color: "var(--color-primary-600)" }} />}
      {status === "locked" && <LockIcon className="w-3.5 h-3.5" style={{ color: "var(--color-text-light)" }} />}
      {labels[status]}
    </span>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full ${className}`} style={{ background: "var(--color-surface-secondary)" }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, background: "var(--color-primary-600)" }}
      />
    </div>
  );
}

function StageCard({ stage, expanded, onToggle, onStart, onToggleCompletion }) {
  const navigate = useNavigate();
  const isLocked = stage.status === "locked";

  const handleViewDetails = () => {
    navigate("/dashboard");
  };

  const handleActionClick = () => {
    if (stage.status === "completed") {
      navigate("/dashboard");
    } else {
      onStart(stage);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        borderColor: stage.status === "current" ? "var(--color-primary-300)" : "var(--color-border)",
        background: isLocked ? "var(--color-surface-secondary)" : "var(--color-surface)",
        boxShadow: stage.status === "current" ? "var(--shadow-card-hover)" : "var(--shadow-card)",
        opacity: isLocked ? 0.85 : 1,
      }}
    >
      {stage.status === "current" && (
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--color-primary-600)" }} />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Completion Toggle Circle */}
          <button
            type="button"
            onClick={() => !isLocked && onToggleCompletion(stage.id)}
            title={isLocked ? "Locked phase" : "Click to mark phase completed"}
            disabled={isLocked}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={
              stage.status === "completed"
                ? { background: "var(--color-confirm)", color: "#fff" }
                : stage.status === "current"
                ? { background: "var(--color-primary-600)", color: "#fff" }
                : isLocked
                ? { background: "var(--color-surface-secondary)", color: "var(--color-text-light)", cursor: "not-allowed" }
                : { background: "var(--color-primary-50)", color: "var(--color-primary-600)" }
            }
          >
            {stage.status === "completed" ? <CheckIcon className="w-5 h-5" /> : stage.id}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={stage.status} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
                    {stage.phase}
                  </span>
                </div>

                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>{stage.title}</h3>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                <ClockIcon className="w-4 h-4" style={{ color: "var(--color-text-light)" }} />
                {stage.duration}
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
              {stage.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {stage.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors duration-200"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }}
                >
                  {concept}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--color-border)" }}>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span className="font-bold" style={{ color: "var(--color-text-h)" }}>{stage.questions}</span> career practice modules
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleViewDetails}
                  className="rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  View details
                </button>

                {!isLocked && (
                  <Button
                    size="sm"
                    variant={stage.status === "current" ? "primary" : "outline"}
                    onClick={handleActionClick}
                  >
                    {stage.status === "completed" ? "Review Phase" : stage.status === "current" ? "Start Learning" : "Preview"}
                  </Button>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-5 rounded-xl border p-4 sm:p-5 transition-all" style={{ borderColor: "var(--color-primary-100)", background: "var(--color-primary-50)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
                  Required Competencies & Action Items
                </p>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {stage.concepts.map((concept, index) => (
                    <div
                      key={concept}
                      className="flex items-center gap-3 rounded-lg border p-3 shadow-xs transition-all hover:shadow-md"
                      style={{ borderColor: "var(--color-primary-100)", background: "var(--color-surface)" }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}>
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
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
        { id: 1, title: `Phase 1: Foundations of ${generatedTitle}`, phase: "Foundations (0-25% Readiness)", status: "completed", duration: "4 Weeks", concepts: ["Core Principles & Theory", "Essential Tools & Environment", "Fundamental Terminology", "Basic Hands-on Practice"], description: `Build complete baseline knowledge and setup required tools for ${generatedTitle}.`, questions: 15 },
        { id: 2, title: `Phase 2: Core Competencies & Real-World Projects`, phase: "Core Competency (25-50% Readiness)", status: "current", duration: "6 Weeks", concepts: ["Standard Workflows", "Intermediate Problem Solving", "Hands-on Project Building", "Quality Control"], description: `Implement hands-on projects and master intermediate skills expected in ${generatedTitle} roles.`, questions: 20 },
        { id: 3, title: `Phase 3: Advanced Specialization & Architecture`, phase: "Advanced Specialization (50-75% Readiness)", status: "upcoming", duration: "6 Weeks", concepts: ["Advanced Design Patterns", "Performance & Optimization", "Complex Problem Decomposition", "Industry Best Practices"], description: `Master advanced frameworks and system architecture techniques for professional proficiency.`, questions: 25 },
        { id: 4, title: `Phase 4: Industry Capstone & Job Readiness Portfolio`, phase: "Career Readiness (75-100% Job Ready)", status: "locked", duration: "6 Weeks", concepts: ["Production Portfolio Project", "Resume & LinkedIn Alignment", "Technical Mock Case Interviews", "Final Career Verification"], description: `Assemble your job readiness portfolio, pass mock assessments, and verify career readiness.`, questions: 20 },
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
            stage.status === "completed" ? "current" : stage.status === "current" ? "completed" : stage.status === "upcoming" ? "completed" : stage.status;
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
    <div className="min-h-screen">
      {/* Toast Notification */}
      {notification && (
        <div
          className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-md rounded-xl border p-4 shadow-2xl transition-all sm:right-6"
          style={{ borderColor: "var(--color-primary-100)", background: "var(--color-surface)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}>
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text-h)" }}>AIFinity AI Career Guidance</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{notification}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotification("")}
              className="font-bold text-sm transition"
              style={{ color: "var(--color-text-light)" }}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <HeroSection
        variant="roadmap"
        eyebrow="End-to-End AI Career Guidance & Readiness Engine"
        title="Your complete path to"
        highlightWord="career readiness."
        description="Tell AIFinity AI what career or skill you want to master. We generate a 0-to-100% sequential roadmap providing step-by-step guidance from zero prerequisites to job readiness."
        primaryCta={{ label: "Build My Roadmap", href: "#career-select" }}
        secondaryCta={{ label: "See How It Works", href: "#roadmap-stages" }}
      />

      {/* PRESET SELECTOR + CUSTOM GENERATOR + ANALYTICS */}
      <Section className="pt-0 sm:pt-0">
        {/* Preset Career Dropdown */}
        <div className="max-w-md">
          <label htmlFor="career-select" className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>
            Choose a career path
          </label>

          <select
            id="career-select"
            value={PRESET_CAREERS.some((c) => c.id === selectedCareer.id) ? selectedCareer.id : ""}
            onChange={(e) => {
              const chosen = PRESET_CAREERS.find((c) => c.id === e.target.value);
              if (chosen) handleSelectPreset(chosen);
            }}
            className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition-all duration-200 focus:ring-4"
            style={{ borderColor: "var(--color-primary-600)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}
          >
            {!PRESET_CAREERS.some((c) => c.id === selectedCareer.id) && (
              <option value="" disabled>
                Custom roadmap active — pick a preset to switch
              </option>
            )}
            {PRESET_CAREERS.map((career) => (
              <option key={career.id} value={career.id}>
                {career.icon} {career.title}
              </option>
            ))}
          </select>

          {selectedCareer.id === "custom" && (
            <p className="mt-2 text-xs font-medium" style={{ color: "var(--color-primary-600)" }}>
              Currently viewing custom roadmap: {selectedCareer.title}
            </p>
          )}
        </div>

        {/* Custom Career Dropdown + Generate */}
        <div className="mt-6 rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <label htmlFor="custom-career" className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>
            Want a custom career roadmap? Choose a field or skill goal:
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              id="custom-career"
              value={customCareer}
              onChange={(e) => setCustomCareer(e.target.value)}
              className="w-full flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-h)" }}
            >
              <option value="" disabled>
                Select a career or skill goal
              </option>
              {CUSTOM_CAREER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

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
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card hoverable={false} className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>Target Career Role</p>
            <p className="mt-2 text-lg font-bold truncate" style={{ color: "var(--color-text-h)" }}>{selectedCareer.title}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Estimated Duration: <span className="font-semibold" style={{ color: "var(--color-primary-600)" }}>{selectedCareer.duration}</span>
            </p>
          </Card>

          <Card hoverable={false} className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>Career Readiness Score</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>{readinessScore}%</p>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}>
                {readinessScore >= 75 ? "Job Ready" : readinessScore >= 50 ? "Advanced Specialization" : readinessScore >= 25 ? "Building Competency" : "Foundations"}
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={readinessScore} />
            </div>
          </Card>

          <Card hoverable={false} className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>Guidance Objective</p>
            <p className="mt-2 text-xs font-medium leading-5" style={{ color: "var(--color-text-muted)" }}>
              From zero prerequisites to verified job readiness with practical portfolio milestones.
            </p>
          </Card>
        </div>
      </Section>

      {/* END TO END ROADMAP STAGES */}
      <Section id="roadmap-stages">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              End-to-End Career Progression
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {selectedCareer.title} Guidance Path
            </h2>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--color-text-muted)" }}>
              Click stage numbers to mark phases completed and dynamically increase your Career Readiness Score.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <SearchIcon className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2" style={{ color: "var(--color-text-light)" }} />
              <input
                type="text"
                placeholder="Filter milestones & tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border py-2 pl-9 pr-4 text-xs outline-none transition focus:ring-2"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-h)" }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-10">
          <div className="absolute bottom-8 left-5 top-8 hidden w-0.5 sm:block" style={{ background: "var(--color-border)" }} />

          <div className="space-y-5">
            {filteredStages.map((stage) => (
              <div key={stage.id} className="relative sm:pl-16">
                <div
                  onClick={() => stage.status !== "locked" && handleToggleCompletion(stage.id)}
                  className="absolute left-0 top-6 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 text-xs font-bold shadow-sm transition-all sm:flex hover:scale-110 active:scale-95"
                  style={{
                    borderColor: "var(--color-surface)",
                    background: stage.status === "completed" ? "var(--color-confirm)" : stage.status === "current" ? "var(--color-primary-600)" : "var(--color-surface-secondary)",
                    color: stage.status === "completed" || stage.status === "current" ? "#fff" : "var(--color-text-light)",
                  }}
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
      <Section>
        <SectionHeading
          eyebrow="JOB READINESS VERIFICATION"
          title="What makes you job-ready?"
          subtitle="AIFinity  verifies your readiness through four essential career criteria."
        />

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { num: "01", title: "Foundational Theory", desc: "Master foundational concepts, terminology, and core principles of your domain.", done: readinessScore >= 25 },
            { num: "02", title: "Applied Projects", desc: "Build real-world hands-on projects demonstrating practical problem solving.", done: readinessScore >= 50 },
            { num: "03", title: "System Architecture", desc: "Understand enterprise design patterns, scaling trade-offs, and tool ecosystems.", done: readinessScore >= 75 },
            { num: "04", title: "Portfolio & Interview", desc: "Complete technical case studies, portfolio showcase, and mock interviews.", done: readinessScore >= 100 },
          ].map((item) => (
            <Card key={item.num} hoverable className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: "var(--color-primary-600)" }}>{item.num}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                  style={item.done ? { background: "var(--color-primary-50)", color: "var(--color-confirm)" } : { background: "var(--color-surface-secondary)", color: "var(--color-text-light)" }}
                >
                  {item.done ? "Verified ✓" : "Pending"}
                </span>
              </div>
              <h4 className="mt-4 font-bold text-base" style={{ color: "var(--color-text-h)" }}>{item.title}</h4>
              <p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <CtaBanner
          eyebrow="CAREER INTELLIGENCE"
          title="Verify your skills with AIFinity Skill Gap."
          buttonLabel="Explore Skill Gap"
          href="/skill-gap"
        />
      </Section>
    </div>
  );
}
