import { useState } from "react";
import HeroSection from "../components/HeroSection";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";

/* =========================================================
   REUSABLE SVG ICONS
========================================================= */
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

/* =========================================================
   PAGE DATA
========================================================= */
const FEATURES = [
  { eyebrow: "01", title: "Concept Root", description: "Break every topic down to its fundamental building blocks. Instantly pinpoint missing prerequisites before moving ahead.", href: "/concept-root", tag: "Prerequisite Intelligence" },
  { eyebrow: "02", title: "Mistake Map", description: "Every wrong answer is automatically mapped to the underlying concept error, transforming mistakes into actionable fixes.", href: "/mistake-map", tag: "Error Pattern Tracking" },
  { eyebrow: "03", title: "Skill Gap", description: "Measure the exact distance between your current capability and target career standards — ranked by priority.", href: "/skill-gap", tag: "Job Readiness Scoring" },
];

const STEPS = [
  { step: "01", title: "Take the Assessment", description: "A short, adaptive test evaluating your reasoning and depth across foundational concepts." },
  { step: "02", title: "Get Your Custom Roadmap", description: "An end-to-end guidance roadmap built dynamically from your empirical test output." },
  { step: "03", title: "Track Career Readiness", description: "Watch your skill gap close live as you master targeted milestone concepts." },
];

const OBSERVATORY_TABS = [
  { id: "tracking", title: "Real-time concept tracking", description: "Every question you attempt is mapped back to its root concept live.", stat: "99.4% Accuracy", badge: "Live Telemetry" },
  { id: "pattern", title: "Pattern detection", description: "AI spots recurring mistake patterns before they become major learning bottlenecks.", stat: "3.2x Faster Learning", badge: "Predictive AI" },
  { id: "adaptive", title: "Adaptive difficulty", description: "Your roadmap automatically adjusts in real-time as your skill gap closes.", stat: "100% Dynamic", badge: "Auto Optimization" },
];

const CHALLENGE_SOLUTIONS = [
  { challenge: "Don't know which topic to revise first", solution: "Concept Root isolates the exact weak spot" },
  { challenge: "Mistakes repeat without knowing why", solution: "Mistake Map traces every error to its root cause" },
  { challenge: "Generic courses don't match the job role", solution: "Skill Gap ranks what actually matters for hiring" },
];

export default function Home() {
  const [activeObsTab, setActiveObsTab] = useState(OBSERVATORY_TABS[0]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* =========================================================
         HERO SECTION
      ========================================================= */}
      <HeroSection
        variant="home"
        eyebrow="AIFinity · Built for Job-Ready Learning"
        title="Know exactly what to"
        highlightWord="learn next"
        description="Find your weak concepts, see your skill gap, and follow an end-to-end roadmap built around your own mistakes — not a generic syllabus."
        primaryCta={{ label: "Start Assessment", href: "/onboardingpage" }}
        secondaryCta={{ label: "Explore Roadmap", href: "/roadmap" }}
      />

      {/* =========================================================
         THREE CORE TOOLS (FEATURES) SECTION
      ========================================================= */}
      <Section>
        <SectionHeading
          eyebrow="THREE ESSENTIAL TOOLS"
          title="One clear picture of your progress"
          subtitle="Everything is connected to your actual empirical test results — not arbitrary assumptions."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              icon={<span style={{ fontFamily: "var(--font-mono)" }} className="text-lg font-bold">{feature.eyebrow}</span>}
              eyebrow={feature.tag}
              title={feature.title}
              footer={
                <Button
                  as="a"
                  href={feature.href}
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                >
                  Explore {feature.title}
                </Button>
              }
            >
              {feature.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* =========================================================
         CHALLENGES & DIRECT SOLUTIONS MATRIX
      ========================================================= */}
      <Section>
        <SectionHeading
          eyebrow="WHY IT WORKS"
          title="Every challenge, matched with a direct solution"
          subtitle="No generic advice — just specific fixes for specific learning bottlenecks."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CHALLENGE_SOLUTIONS.map((item) => (
            <Card key={item.challenge} hoverable>
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "var(--color-error)", color: "#fff", opacity: 0.85 }}
                >
                  ✕
                </span>
                <p className="text-sm font-medium leading-5" style={{ color: "var(--color-text-muted)" }}>
                  {item.challenge}
                </p>
              </div>

              <div className="my-4 border-t" style={{ borderColor: "var(--color-border)" }} />

              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "var(--color-confirm)", color: "#fff" }}
                >
                  ✓
                </span>
                <p className="text-sm font-bold leading-5" style={{ color: "var(--color-text-h)" }}>
                  {item.solution}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* =========================================================
         AI OBSERVATORY INTERACTIVE PREVIEW
      ========================================================= */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className="order-2 lg:order-1 relative overflow-hidden rounded-3xl border p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full animate-pulse" style={{ background: "var(--color-accent)" }} />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}
                >
                  {activeObsTab.badge}
                </span>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)", fontFamily: "var(--font-mono)" }}
              >
                {activeObsTab.stat}
              </span>
            </div>

            <div className="py-8 text-center">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-lg"
                style={{ background: "var(--color-primary-600)" }}
              >
                <SparklesIcon className="w-10 h-10" />
              </div>

              <h4 className="mt-5 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}>
                {activeObsTab.title}
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>
                {activeObsTab.description}
              </p>
            </div>

            <div
              className="rounded-xl border p-4 text-center"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface-secondary)" }}
            >
              <p className="text-[11px] font-semibold" style={{ color: "var(--color-text-muted)" }}>
                Continuous AI Evaluation Active
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-start gap-5 text-left">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-mono)",
                borderColor: "var(--color-border-strong)",
                background: "var(--color-primary-50)",
                color: "var(--color-primary-700)",
              }}
            >
              AI Observatory Engine
            </span>

            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}
            >
              An AI that watches your progress, so you don't have to guess
            </h2>

            <p className="text-base leading-7" style={{ color: "var(--color-text-muted)" }}>
              Every attempt, mistake, and concept is continuously analyzed and turned into a clear picture of your readiness.
            </p>

            <div className="mt-2 flex flex-col gap-3 w-full">
              {OBSERVATORY_TABS.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveObsTab(tab)}
                  className="cursor-pointer rounded-2xl border p-4 transition-all duration-200"
                  style={
                    activeObsTab.id === tab.id
                      ? { borderColor: "var(--color-primary-600)", background: "var(--color-primary-50)", boxShadow: "var(--shadow-card-hover)" }
                      : { borderColor: "var(--color-border)", background: "var(--color-surface)" }
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm" style={{ color: "var(--color-text-h)" }}>{tab.title}</p>
                    <span className="text-xs font-bold" style={{ color: "var(--color-primary-600)" }}>{tab.stat}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>
                    {tab.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* =========================================================
         HOW IT WORKS — 3 STEP FLOW
      ========================================================= */}
      <Section>
        <SectionHeading eyebrow="THREE-STEP FLOW" title="From assessment to roadmap in three steps" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card
              key={step.step}
              hoverable
              className="text-center"
              icon={<span style={{ fontFamily: "var(--font-mono)" }} className="text-lg font-bold">{step.step}</span>}
              title={step.title}
            >
              {step.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* =========================================================
         FINAL CTA BANNER
      ========================================================= */}
      <Section>
        <CtaBanner
          eyebrow="READY TO BEGIN?"
          title="Your career skill gap is waiting for you."
          buttonLabel="Start Free Assessment"
          href="/onboardingpage"
        />
      </Section>
    </div>
  );
}