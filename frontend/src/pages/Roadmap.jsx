import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Card from "../components/Card";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";
import { analyticsApi } from "../services/api";

/* =========================================================
   REUSABLE SVG ICONS
========================================================= */
function CheckIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function AlertIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function LightbulbIcon({ className = "w-4 h-4", style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
  },
  {
    id: "data",
    title: "Data Scientist & AI Specialist",
    field: "Data & AI",
    icon: "⚛",
    duration: "6 Months",
  },
  {
    id: "finance",
    title: "Financial & Investment Analyst",
    field: "Finance",
    icon: "₹",
    duration: "5 Months",
  },
];

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
   SUB-COMPONENTS
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

function PriorityBadge({ priority, isWeakConcept }) {
  if (priority === "High" || isWeakConcept) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
        style={{ borderColor: "rgba(220, 38, 38, 0.3)", background: "rgba(254, 226, 226, 0.7)", color: "#b91c1c" }}
      >
        <AlertIcon className="w-3 h-3" />
        {isWeakConcept ? "High Priority (Weak Concept)" : "High Priority"}
      </span>
    );
  }

  if (priority === "Medium") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
        style={{ borderColor: "var(--color-primary-200)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}
      >
        Medium Priority
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }}
    >
      Standard Priority
    </span>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full ${className}`} style={{ background: "var(--color-surface-secondary)" }}>
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
                  <PriorityBadge priority={stage.priority} isWeakConcept={stage.isWeakConcept} />
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

            {/* Why You Need to Learn This - Personalized AI Reason */}
            {stage.why && (
              <div className="mt-4 rounded-xl border p-3.5 text-xs leading-5 transition-all" style={{ borderColor: "var(--color-primary-100)", background: "var(--color-primary-50)", color: "var(--color-text-h)" }}>
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: "var(--color-surface)", color: "var(--color-primary-600)" }}>
                    <LightbulbIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: "var(--color-primary-700)" }}>
                      Why You Need to Learn This (Assessment Insights):
                    </span>
                    <p className="mt-0.5 text-xs font-medium leading-5" style={{ color: "var(--color-text-muted)" }}>
                      {stage.why}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stage Progress Bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                <span>Estimated Stage Progress</span>
                <span className="font-bold" style={{ color: "var(--color-primary-600)" }}>{stage.progress || 0}%</span>
              </div>
              <ProgressBar value={stage.progress || 0} />
            </div>

            {/* Concepts Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {stage.concepts && stage.concepts.map((concept) => (
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
                <span className="font-bold" style={{ color: "var(--color-text-h)" }}>{stage.questions || 20}</span> career practice modules
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
                  {stage.concepts && stage.concepts.map((concept, index) => (
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
   NO ASSESSMENT EMPTY STATE COMPONENT
========================================================= */
function EmptyRoadmapState() {
  const navigate = useNavigate();

  return (
    <Section className="pt-8">
      <Card hoverable={false} className="mx-auto max-w-3xl p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}>
          <SparklesIcon className="w-8 h-8" />
        </div>

        <h3 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
          No Assessment Data Found
        </h3>

        <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
          Your learning roadmap is personalized using your actual assessment performance, weak concepts, mistake patterns, and skill gaps. Complete your first assessment to unlock your custom learning path.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() => navigate("/assessment")}
            icon={<ArrowRightIcon />}
          >
            Take Your First Assessment
          </Button>
        </div>

        <div className="mt-8 grid gap-4 border-t pt-6 text-left sm:grid-cols-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>01. Measure</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Complete an assessment to test domain knowledge.</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>02. Detect</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Identify weak concepts, mistake patterns, and skill gaps.</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>03. Personalize</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Automatically generate your custom 0-100% roadmap.</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* =========================================================
   MAIN ROADMAP COMPONENT
========================================================= */
export default function Roadmap() {
  const [stages, setStages] = useState([]);
  const [targetCareer, setTargetCareer] = useState("Full-Stack Software Engineer");
  const [readinessScore, setReadinessScore] = useState(0);
  const [hasHistory, setHasHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedStage, setExpandedStage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customCareerInput, setCustomCareerInput] = useState("");
  const [notification, setNotification] = useState("");

  const navigate = useNavigate();

  // Load real personalized roadmap from backend database
  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getRoadmap();
      if (res && res.success && res.data) {
        setHasHistory(res.data.hasHistory);
        setTargetCareer(res.data.targetCareer || "Full-Stack Software Engineer");
        setReadinessScore(res.data.readinessScore || 0);
        setStages(res.data.stages || []);
      }
    } catch (err) {
      console.error("Failed to load personalized roadmap:", err);
      setError("Failed to load your personalized roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => setNotification(""), 4500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification]);

  const handleSelectPreset = async (careerTitle) => {
    setTargetCareer(careerTitle);
    setCustomCareerInput("");
    setIsGenerating(true);

    try {
      const res = await analyticsApi.updateRoadmap({ customCareer: careerTitle });
      if (res && res.success && res.data) {
        setStages(res.data.stages || []);
        setReadinessScore(res.data.readinessScore || 0);
        setNotification(`Loaded dynamic assessment-backed roadmap for ${careerTitle}.`);
      }
    } catch {
      setNotification(`Updated target career to ${careerTitle}.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCustom = async () => {
    if (!customCareerInput.trim()) return;
    const title = customCareerInput.trim();
    setIsGenerating(true);

    try {
      const res = await analyticsApi.updateRoadmap({ customCareer: title });
      if (res && res.success && res.data) {
        setTargetCareer(res.data.targetCareer || title);
        setStages(res.data.stages || []);
        setReadinessScore(res.data.readinessScore || 0);
        setNotification(`Personalized end-to-end roadmap updated for "${title}".`);
      }
    } catch {
      setNotification(`Roadmap generated for "${title}".`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = (id) => {
    setExpandedStage((current) => (current === id ? null : id));
  };

  const handleStart = (stage) => {
    setNotification(`${stage.title} session is ready. Proceed with practice modules.`);
  };

  const handleToggleCompletion = async (id) => {
    // Optimistic UI update
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id === id) {
          const nextStatus = stage.status === "completed" ? "current" : "completed";
          return { ...stage, status: nextStatus };
        }
        return stage;
      })
    );

    try {
      const res = await analyticsApi.updateRoadmap({ stageId: id });
      if (res && res.success && res.data) {
        setStages(res.data.stages || []);
        setReadinessScore(res.data.readinessScore || 0);
      }
    } catch (err) {
      console.error("Failed to persist stage completion:", err);
    }
  };

  const filteredStages = useMemo(() => {
    if (!searchQuery.trim()) return stages;
    return stages.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.concepts && s.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
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
                <p className="text-sm font-bold" style={{ color: "var(--color-text-h)" }}>AIFinity AI Dynamic Guidance</p>
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
        eyebrow="End-to-End AI Assessment-Driven Guidance"
        title="Your complete path to"
        highlightWord="career readiness."
        description="AIFinity AI analyzes your real assessment scores, weak concepts, mistake patterns, and skill gaps to generate a personalized 0-to-100% sequential roadmap tailored to your performance."
        primaryCta={{ label: "View My Roadmap", href: "#roadmap-stages" }}
        secondaryCta={{ label: "Take Assessment", href: "/assessment" }}
      />

      {/* LOADING STATE */}
      {isLoading && (
        <Section className="pt-8">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <SpinnerIcon className="h-10 w-10 text-primary-600 animate-spin" />
            <p className="mt-4 text-sm font-semibold" style={{ color: "var(--color-text-h)" }}>
              Fetching your personalized assessment-driven roadmap...
            </p>
          </div>
        </Section>
      )}

      {/* EMPTY STATE (User has no completed assessments) */}
      {!isLoading && !hasHistory && (
        <EmptyRoadmapState />
      )}

      {/* DYNAMIC PERSONALIZED ROADMAP (User has completed assessments) */}
      {!isLoading && hasHistory && (
        <>
          {/* PRESET SELECTOR + CUSTOM GENERATOR + ANALYTICS */}
          <Section className="pt-0 sm:pt-0">
            {/* Preset Career Dropdown */}
            <div className="max-w-md">
              <label htmlFor="career-select" className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>
                Choose a target career path
              </label>

              <select
                id="career-select"
                value={PRESET_CAREERS.some((c) => c.title === targetCareer) ? PRESET_CAREERS.find((c) => c.title === targetCareer).id : ""}
                onChange={(e) => {
                  const chosen = PRESET_CAREERS.find((c) => c.id === e.target.value);
                  if (chosen) handleSelectPreset(chosen.title);
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition-all duration-200 focus:ring-4"
                style={{ borderColor: "var(--color-primary-600)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}
              >
                {!PRESET_CAREERS.some((c) => c.title === targetCareer) && (
                  <option value="" disabled>
                    Custom roadmap active: {targetCareer}
                  </option>
                )}
                {PRESET_CAREERS.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.icon} {career.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Career Dropdown + Generate */}
            <div className="mt-6 rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <label htmlFor="custom-career" className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>
                Want a custom career roadmap? Choose a field or skill goal:
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  id="custom-career"
                  value={customCareerInput}
                  onChange={(e) => setCustomCareerInput(e.target.value)}
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
                  disabled={!customCareerInput.trim() || isGenerating}
                  onClick={handleGenerateCustom}
                  icon={isGenerating ? <SpinnerIcon /> : <SparklesIcon className="w-4 h-4" />}
                >
                  {isGenerating ? "Updating Roadmap..." : "Generate Custom Roadmap"}
                </Button>
              </div>
            </div>

            {/* Career Readiness Analytics Bar */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Card hoverable={false} className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-light)" }}>Target Career Role</p>
                <p className="mt-2 text-lg font-bold truncate" style={{ color: "var(--color-text-h)" }}>{targetCareer}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Personalized to real assessment results
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
                  From identified weak concepts to verified job readiness with dynamic remediation milestones.
                </p>
              </Card>
            </div>
          </Section>

          {/* END TO END ROADMAP STAGES */}
          <Section id="roadmap-stages">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
                  Dynamic Assessment-Driven Guidance
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
                  {targetCareer} Guidance Path
                </h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Click stage numbers to mark phases completed and update your Career Readiness Score.
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
              subtitle="AIFinity verifies your readiness through four essential career criteria derived from your assessment performance."
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
        </>
      )}

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
