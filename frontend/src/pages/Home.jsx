import { useState } from "react";
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
   INTERACTIVE HERO SIMULATOR DATA
========================================================= */
const HERO_ROLE_PRESETS = [
  {
    id: "frontend",
    label: "Frontend Dev",
    current: 42,
    target: 90,
    gapConcepts: 12,
    nextConcept: "Closures & Scope",
    color: "from-indigo-600 to-cyan-500",
  },
  {
    id: "datascience",
    label: "Data Scientist",
    current: 55,
    target: 88,
    gapConcepts: 9,
    nextConcept: "Gradient Boosting & XGBoost",
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "finance",
    label: "Financial Analyst",
    current: 48,
    target: 85,
    gapConcepts: 11,
    nextConcept: "DCF Valuation Modeling",
    color: "from-violet-600 to-indigo-600",
  },
];

const FEATURES = [
  {
    eyebrow: "01",
    title: "Concept Root",
    description:
      "Break every topic down to its fundamental building blocks. Instantly pinpoint missing prerequisites before moving ahead.",
    href: "/concept-root",
    tag: "Prerequisite Intelligence",
  },
  {
    eyebrow: "02",
    title: "Mistake Map",
    description:
      "Every wrong answer is automatically mapped to the underlying concept error, transforming mistakes into actionable fixes.",
    href: "/mistake-map",
    tag: "Error Pattern Tracking",
  },
  {
    eyebrow: "03",
    title: "Skill Gap",
    description:
      "Measure the exact distance between your current capability and target career standards — ranked by priority.",
    href: "/skill-gap",
    tag: "Job Readiness Scoring",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Take the Assessment",
    description:
      "A short, adaptive test evaluating your reasoning and depth across foundational concepts.",
  },
  {
    step: "02",
    title: "Get Your Custom Roadmap",
    description:
      "An end-to-end guidance roadmap built dynamically from your empirical test output.",
  },
  {
    step: "03",
    title: "Track Career Readiness",
    description:
      "Watch your skill gap close live as you master targeted milestone concepts.",
  },
];

const OBSERVATORY_TABS = [
  {
    id: "tracking",
    title: "Real-time concept tracking",
    description: "Every question you attempt is mapped back to its root concept live.",
    stat: "99.4% Accuracy",
    badge: "Live Telemetry",
  },
  {
    id: "pattern",
    title: "Pattern detection",
    description: "AI spots recurring mistake patterns before they become major learning bottlenecks.",
    stat: "3.2x Faster Learning",
    badge: "Predictive AI",
  },
  {
    id: "adaptive",
    title: "Adaptive difficulty",
    description: "Your roadmap automatically adjusts in real-time as your skill gap closes.",
    stat: "100% Dynamic",
    badge: "Auto Optimization",
  },
];

const CHALLENGE_SOLUTIONS = [
  {
    challenge: "Don't know which topic to revise first",
    solution: "Concept Root isolates the exact weak spot",
  },
  {
    challenge: "Mistakes repeat without knowing why",
    solution: "Mistake Map traces every error to its root cause",
  },
  {
    challenge: "Generic courses don't match the job role",
    solution: "Skill Gap ranks what actually matters for hiring",
  },
];

const STATS = [
  { value: "10 min", label: "To your first result" },
  { value: "3 steps", label: "From test to roadmap" },
  { value: "0", label: "Sign-ups needed to start" },
];

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(HERO_ROLE_PRESETS[0]);
  const [activeObsTab, setActiveObsTab] = useState(OBSERVATORY_TABS[0]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseOffset({
      x: Math.round(x * 0.04),
      y: Math.round(y * 0.04),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {/* =========================================================
         HERO SECTION WITH MOUSE-INTERACTIVE DOTTED FIELD (ANTIGRAVITY EFFECT)
      ========================================================= */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      >
        {/* INTERACTIVE DOTTED FIELD BACKGROUND PATTERN — SHIFTS ON MOUSE HOVER */}
        <div
          className="pointer-events-none absolute -inset-10 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-85 transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          }}
        />

        {/* Ambient Parallax Gradient Glow Orbs */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.8}px, 0)`,
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy Left */}
            <div className="flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-xs">
                <SparklesIcon className="w-4 h-4 text-cyan-500" />
                Afinity AI · Built for Job-Ready Learning
              </div>

              <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Know exactly what to{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  learn next
                </span>
              </h1>

              <p className="max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                Find your weak concepts, see your skill gap, and follow an end-to-end roadmap built around your own mistakes — not a generic syllabus.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Button
                  as="a"
                  href="/onboardingpage"
                  size="lg"
                  className="shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Start Assessment
                </Button>
                <Button
                  as="a"
                  href="/roadmap"
                  variant="outline"
                  size="lg"
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Explore Roadmap
                </Button>
              </div>

              {/* Stat Strip */}
              <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-6 border-t border-slate-200/80 pt-6">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Hero Visual — Skill Gap Interactive Simulator */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Main Card */}
              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:border-indigo-300 hover:shadow-2xl">
                {/* Role Selector Pills */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Role Simulator
                  </span>
                  <div className="flex gap-1.5">
                    {HERO_ROLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedRole(preset)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all duration-200 ${
                          selectedRole.id === preset.id
                            ? "bg-indigo-600 text-white shadow-sm scale-105"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Progress Bars */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Where you are</span>
                      <span className="font-bold text-slate-900">{selectedRole.current}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-400 transition-all duration-700 ease-out"
                        style={{ width: `${selectedRole.current}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Role Target</span>
                      <span className="font-bold text-slate-900">{selectedRole.target}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-700 ease-out"
                        style={{ width: `${selectedRole.target}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Concepts Badge Box */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 transition-colors duration-200 hover:bg-indigo-50">
                  <span className="text-xs font-semibold text-slate-600">
                    Concepts to close gap
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-xs">
                    {selectedRole.gapConcepts}
                  </span>
                </div>
              </div>

              {/* Floating Interactive Badge */}
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-lg transition-all duration-300 hover:scale-105 hover:border-cyan-300 sm:block hidden">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Next Concept Focus
                  </p>
                </div>
                <p className="mt-0.5 text-xs font-bold text-slate-900">
                  {selectedRole.nextConcept}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         THREE CORE TOOLS (FEATURES) SECTION
      ========================================================= */}
      <Section background="white">
        <SectionHeading
          eyebrow="THREE ESSENTIAL TOOLS"
          title="One clear picture of your progress"
          subtitle="Everything is connected to your actual empirical test results — not arbitrary assumptions."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {feature.eyebrow}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-700 transition-colors">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Button
                  as="a"
                  href={feature.href}
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                >
                  Explore {feature.title}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* =========================================================
         CHALLENGES & DIRECT SOLUTIONS MATRIX
      ========================================================= */}
      <Section background="tint">
        <SectionHeading
          eyebrow="WHY IT WORKS"
          title="Every challenge, matched with a direct solution"
          subtitle="No generic advice — just specific fixes for specific learning bottlenecks."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CHALLENGE_SOLUTIONS.map((item) => (
            <Card
              key={item.challenge}
              hoverable
              className="p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                  ✕
                </span>
                <p className="text-sm font-medium text-slate-500 leading-5">
                  {item.challenge}
                </p>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  ✓
                </span>
                <p className="text-sm font-bold text-slate-900 leading-5">
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
      <Section background="white">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Interactive Observatory Card Visual */}
          <div className="order-2 lg:order-1 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {activeObsTab.badge}
                </span>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {activeObsTab.stat}
              </span>
            </div>

            <div className="py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-200">
                <SparklesIcon className="w-10 h-10" />
              </div>

              <h4 className="mt-5 text-xl font-bold text-slate-900">
                {activeObsTab.title}
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                {activeObsTab.description}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center">
              <p className="text-[11px] font-semibold text-slate-500">
                Continuous AI Evaluation Active
              </p>
            </div>
          </div>

          {/* Tab Options */}
          <div className="order-1 lg:order-2 flex flex-col items-start gap-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
              AI Observatory Engine
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              An AI that watches your progress, so you don't have to guess
            </h2>

            <p className="text-base leading-7 text-slate-600">
              Every attempt, mistake, and concept is continuously analyzed and turned into a clear picture of your readiness.
            </p>

            <div className="mt-2 flex flex-col gap-3 w-full">
              {OBSERVATORY_TABS.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveObsTab(tab)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    activeObsTab.id === tab.id
                      ? "border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-sm">{tab.title}</p>
                    <span className="text-xs font-bold text-indigo-600">{tab.stat}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-5">
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
      <Section background="tint">
        <SectionHeading
          eyebrow="THREE-STEP FLOW"
          title="From assessment to roadmap in three steps"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card
              key={step.step}
              hoverable
              className="p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-base font-bold text-white shadow-md shadow-indigo-200">
                {step.step}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* =========================================================
         FINAL CTA BANNER
      ========================================================= */}
      <Section background="white">
        <CtaBanner
          eyebrow="READY TO BEGIN?"
          title="Your career skill gap is waiting for you."
          buttonLabel="Start Free Assessment"
          href="/assessment"
        />
      </Section>
    </div>
  );
}