import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Card from "../components/Card";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";
import { authApi, roadmapApi } from "../services/api";

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

function ArrowRightIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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

function AlertIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

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
    completed: "Completed",
    current: "Active Focus",
    upcoming: "Next Priority",
    locked: "Locked",
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
    <div className={`h-2.5 w-full overflow-hidden rounded-full ${className}`} style={{ background: "var(--color-surface-secondary)" }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, background: "var(--color-primary-600)" }}
      />
    </div>
  );
}

/* =========================================================
   MAIN ROADMAP COMPONENT
========================================================= */
export default function Roadmap() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const userRes = await authApi.getMe();
        if (userRes.success) {
          setUser(userRes.user);
        }

        const roadmapRes = await roadmapApi.get();
        if (roadmapRes.success) {
          setData(roadmapRes.data);
        } else {
          setError(roadmapRes.error || "Failed to load Roadmap data");
        }
      } catch (err) {
        setError(err.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F1E7]">
        <div className="mx-auto max-w-md text-center">
          <SpinnerIcon className="mx-auto h-10 w-10 text-[#1B332C]" />
          <p className="mt-4 font-medium text-[var(--color-text-muted)]">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F1E7]">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-h)]">Unable to load Roadmap</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F1E7]">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-h)]">Sign In Required</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Please sign in to view your personalized learning roadmap.
          </p>
          <Button as={Link} to="/login" className="mt-6">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Empty state (no assessment data)
  if (!data || !data.hasData) {
    return (
      <div className="flex min-h-screen flex-col">
        <HeroSection
          variant="roadmap"
          eyebrow="End-to-End AI Career Guidance & Readiness Engine"
          title="Your complete path to"
          highlightWord="career readiness."
          description="AIFinity uses your assessment performance to identify your strengths, gaps, and the best learning path for you."
          primaryCta={{ label: "Start Assessment", href: "/assessment" }}
          secondaryCta={{ label: "See How It Works", href: "#how-it-works" }}
        />

        <Section id="how-it-works">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)] mx-auto">
              <AlertIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-h)]">Your Personalized Roadmap Isn't Ready Yet</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Complete an assessment to identify your strengths, gaps, and the best learning path for you.
            </p>
            <Button as={Link} to="/assessment" size="lg" className="mt-6">
              Take Assessment
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const { currentPosition, roadmap, nextSteps } = data;

  return (
    <div className="flex min-h-screen flex-col">
      {/* HERO SECTION */}
      <HeroSection
        variant="roadmap"
        eyebrow="End-to-End AI Career Guidance & Readiness Engine"
        title="Your complete path to"
        highlightWord="career readiness."
        description="AIFinity uses your assessment performance to identify your strengths, gaps, and the best learning path for you."
        primaryCta={{ label: "Start Assessment", href: "/assessment" }}
        secondaryCta={{ label: "See How It Works", href: "#how-it-works" }}
      />

      {/* THEORY SECTION */}
      <Section id="how-it-works">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>
            What is a Personalized Roadmap?
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
            Your learning path, based on your actual performance.
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
            AIFinity analyzes your assessment results to identify what you already understand, what needs improvement, and which concepts should be learned first. Your roadmap prioritizes weak areas and builds a logical sequence toward mastery.
          </p>
        </div>
      </Section>

      {/* YOUR PERSONALIZED ROADMAP */}
      <Section id="your-roadmap" className="border-t border-[var(--color-border)] scroll-mt-20">
        <SectionHeading
          title="Your Personalized Roadmap"
          subtitle="Your learning path is based on your assessment performance and the areas that need the most attention."
        />

        {/* Current Position */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Overall Performance
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {currentPosition.overallScore}%
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Average across {currentPosition.totalAssessments} assessment{currentPosition.totalAssessments !== 1 ? "s" : ""}
            </p>
          </Card>

          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Current Focus
            </span>
            <div className="mt-3">
              {currentPosition.currentFocus ? (
                <>
                  <h4 className="text-lg font-bold" style={{ color: "var(--color-text-h)" }}>{currentPosition.currentFocus.concept}</h4>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Current Score: {currentPosition.currentFocus.score}%
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No specific focus identified yet</p>
              )}
            </div>
          </Card>

          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Roadmap Stages
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {roadmap.totalStages}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Learning phases identified
            </p>
          </Card>
        </div>
      </Section>

      {/* CURRENT FOCUS */}
      {currentPosition.currentFocus && (
        <Section>
          <SectionHeading
            title="Current Focus"
            subtitle="The most important topic to work on right now."
          />

          <Card hoverable={false} className="mt-10 p-6 shadow-sm" style={{ borderColor: "var(--color-primary-200)", background: "var(--color-primary-50)" }}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--color-primary-600)", color: "#fff" }}>
                <span className="text-lg font-bold">★</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold" style={{ color: "var(--color-text-h)" }}>{currentPosition.currentFocus.concept}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Your current performance is {currentPosition.currentFocus.score}%. Focus on strengthening this foundational area before advancing to more complex topics.
                </p>
                <div className="mt-4">
                  <ProgressBar value={currentPosition.currentFocus.score} />
                </div>
              </div>
            </div>
          </Card>
        </Section>
      )}

      {/* LEARNING ROADMAP */}
      {roadmap.stages && roadmap.stages.length > 0 && (
        <Section>
          <SectionHeading
            title="Learning Roadmap"
            subtitle="Your personalized learning sequence based on your assessment performance."
          />

          <div className="mt-10 space-y-6">
            {roadmap.stages.map((stage) => (
              <Card key={stage.id} hoverable={false} className="p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold" style={{ background: stage.status === "current" ? "var(--color-primary-600)" : stage.status === "completed" ? "var(--color-confirm)" : "var(--color-surface-secondary)", color: stage.status === "current" || stage.status === "completed" ? "#fff" : "var(--color-text-light)" }}>
                    {stage.status === "completed" ? <CheckIcon className="w-5 h-5" /> : stage.id}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={stage.status} />
                      {stage.estimatedDuration && (
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                          <ClockIcon className="w-3 h-3" />
                          {stage.estimatedDuration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold" style={{ color: "var(--color-text-h)" }}>{stage.title}</h3>
                    <p className="mt-1 text-xs font-semibold" style={{ color: "var(--color-primary-600)" }}>{stage.phase}</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>{stage.description}</p>

                    {stage.concepts && stage.concepts.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {stage.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="rounded-lg border px-2.5 py-1 text-xs font-semibold"
                            style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* NEXT STEPS */}
      {nextSteps && nextSteps.length > 0 && (
        <Section>
          <SectionHeading
            title="Next Steps"
            subtitle="Recommended learning actions based on your performance."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nextSteps.map((step, index) => (
              <Card key={index} hoverable={false} className="p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                    style={
                      step.priority === "high"
                        ? { background: "var(--color-primary-50)", color: "var(--color-primary-700)" }
                        : step.priority === "medium"
                        ? { background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }
                        : { background: "var(--color-surface-secondary)", color: "var(--color-text-light)" }
                    }
                  >
                    {step.priority} Priority
                  </span>
                </div>

                <h4 className="font-bold text-base" style={{ color: "var(--color-text-h)" }}>{step.concept}</h4>
                <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Current: {step.currentScore}% → Target: {step.targetScore}%
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{step.action}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* CTA BANNER */}
      <Section>
        <CtaBanner
          eyebrow="EVIDENCE-BASED LEARNING"
          title="Track your progress with personalized assessments."
          buttonLabel="Take Assessment"
          href="/assessment"
        />
      </Section>
    </div>
  );
}
