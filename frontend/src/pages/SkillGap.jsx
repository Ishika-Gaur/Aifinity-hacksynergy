import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";
import { authApi, skillGapApi } from "../services/api";

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

function GapBar({ current, target }) {
  return (
    <div className="space-y-2">
      <div className="relative h-3 overflow-hidden rounded-full" style={{ background: "var(--color-surface-secondary)" }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${current}%`, background: "var(--color-primary-600)" }} />
        <div className="absolute inset-y-0 w-1.5 rounded-full shadow-sm" style={{ left: `${target}%`, background: "var(--color-accent)" }} />
      </div>

      <div className="flex justify-between text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
        <span>Current: {current}%</span>
        <span className="font-bold" style={{ color: "var(--color-primary-600)" }}>Target: {target}%</span>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SKILL GAP COMPONENT
========================================================= */
export default function SkillGap() {
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

        const skillGapRes = await skillGapApi.get();
        if (skillGapRes.success) {
          setData(skillGapRes.data);
        } else {
          setError(skillGapRes.error || "Failed to load Skill Gap data");
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
          <p className="mt-4 font-medium text-[var(--color-text-muted)]">Loading your Skill Gap analysis...</p>
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
          <h1 className="text-2xl font-bold text-[var(--color-text-h)]">Unable to load Skill Gap</h1>
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
            Please sign in to view your personalized Skill Gap analysis.
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
          variant="skill-gap"
          eyebrow="AIFinity AI · Skill Gap Analysis"
          title="Know exactly where you"
          highlightWord="stand — and what's next."
          description="Discover your exact proficiency level in any skill with AI-powered analysis. Get personalized insights into your strengths and the gaps you need to close for your target career role."
          primaryCta={{ label: "Start Assessment", href: "/assessment" }}
          secondaryCta={{ label: "See How It Works", href: "#how-it-works" }}
        />

        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)] mx-auto">
              <AlertIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-h)]">Complete an assessment to see your Skill Gap</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Your Skill Gap analysis will appear here after your assessment results are available.
            </p>
            <Button as={Link} to="/assessment" size="lg" className="mt-6">
              Take Assessment
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const { performance, skills, categoryPerformance } = data;

  return (
    <div className="flex min-h-screen flex-col">
      {/* HERO SECTION */}
      <HeroSection
        variant="skill-gap"
        eyebrow="AIFinity AI · Skill Gap Analysis"
        title="Know exactly where you"
        highlightWord="stand — and what's next."
        description="Discover your exact proficiency level in any skill with AI-powered analysis. Get personalized insights into your strengths and the gaps you need to close for your target career role."
        primaryCta={{ label: "Start Assessment", href: "/assessment" }}
        secondaryCta={{ label: "See How It Works", href: "#how-it-works" }}
      />

      {/* THEORY SECTION */}
      <Section id="how-it-works">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>
            What is Skill Gap Analysis?
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
            Most people guess what they need to learn. AIFinity AI measures it.
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
            Based on your actual assessment performance, we identify your current proficiency levels and highlight specific areas where you need improvement to reach your career goals.
          </p>
        </div>
      </Section>

      {/* YOUR SKILL GAP - PERSONALIZED SECTION */}
      <Section id="your-skill-gap" className="border-t border-[var(--color-border)] scroll-mt-20">
        <SectionHeading
          title="Your Skill Gap"
          subtitle="Based on your assessment performance, here's where you currently stand and what needs improvement."
        />

        {/* Performance Overview Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Overall Performance
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {performance.overallScore}%
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Average across {performance.totalAssessments} assessment{performance.totalAssessments !== 1 ? "s" : ""}
            </p>
          </Card>

          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Skills Identified
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {categoryPerformance.length}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Different skill areas
            </p>
          </Card>

          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Strong Areas
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {performance.strongAreasCount}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Skills at 75%+ proficiency
            </p>
          </Card>

          <Card hoverable={false} className="p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary-600)" }}>
              Needs Improvement
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
              {performance.weakAreasCount}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Skills below 60% proficiency
            </p>
          </Card>
        </div>
      </Section>

      {/* YOUR SKILL PERFORMANCE */}
      <Section>
        <SectionHeading
          title="Your Skill Performance"
          subtitle="Current proficiency levels across different skill areas."
        />

        <div className="mt-10 space-y-4">
          {categoryPerformance.map((cat) => (
            <Card key={cat.category} hoverable={false} className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: "var(--color-text-h)" }}>{cat.category}</h4>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {cat.count} assessment{cat.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
                    {cat.avgScore}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar value={cat.avgScore} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FOCUS AREAS */}
      {skills.skillGaps && skills.skillGaps.length > 0 && (
        <Section>
          <SectionHeading
            title="Focus Areas"
            subtitle="Skills that need your attention to reach target proficiency."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {skills.skillGaps.map((gap) => (
              <Card key={gap.name} hoverable={false} className="p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={
                      gap.priority === "High"
                        ? { borderColor: "var(--color-primary-200)", background: "var(--color-primary-50)", color: "var(--color-primary-700)" }
                        : { borderColor: "var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }
                    }
                  >
                    {gap.priority} Priority
                  </span>
                </div>

                <h4 className="font-bold text-base" style={{ color: "var(--color-text-h)" }}>{gap.name}</h4>

                <div className="mt-4">
                  <GapBar current={gap.current} target={gap.target} />
                </div>

                <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Gap: {gap.gap} points • {gap.attempts} assessment{gap.attempts !== 1 ? "s" : ""}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* CTA BANNER */}
      <Section>
        <CtaBanner
          eyebrow="EVIDENCE-BASED LEARNING"
          title="Turn your skill gaps into personalized roadmaps."
          buttonLabel="View Personalized Roadmap"
          href="/roadmap"
        />
      </Section>
    </div>
  );
}
