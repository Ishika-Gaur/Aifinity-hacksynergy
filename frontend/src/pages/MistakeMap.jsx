import React from "react";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";

const HOW_IT_WORKS = [
  {
    title: "You attempt a question",
    description:
      "Practice like normal — assessments, quizzes, or mock tests across any topic.",
  },
  {
    title: "AI finds the real reason",
    description:
      "Every wrong answer is traced back to the exact concept behind it, not just marked incorrect.",
  },
  {
    title: "It's added to your map",
    description:
      "The concept gets placed on your Mistake Map, ranked by how often it's costing you marks.",
  },
];

const FEATURES = [
  {
    eyebrow: "Root cause",
    title: "AI-Detected Patterns",
    description:
      "The AI looks past the wrong answer to the concept you actually misunderstood — so you fix the cause, not the symptom.",
  },
  {
    eyebrow: "Clustering",
    title: "Concept Clustering",
    description:
      "Related mistakes group together automatically, so five wrong answers can point to one real gap.",
  },
  {
    eyebrow: "Priority",
    title: "Ranked by Impact",
    description:
      "Your map is sorted by which concepts are costing you the most — fix what matters first.",
  },
];

const STATS = [
  { value: "100%", label: "Traced to a concept" },
  { value: "Auto", label: "Clustering, no manual tagging" },
  { value: "Live", label: "Updates after every attempt" },
];

const COMPARISON = [
  {
    without: "Redo entire mock tests hoping the same mistakes don't repeat",
    withMap: "See exactly which concepts to revise, ranked by impact",
  },
  {
    without: "Wrong answers just get marked incorrect, nothing more",
    withMap: "Every wrong answer traced back to the concept behind it",
  },
  {
    without: "Manually figure out if a mistake is a pattern or a one-off",
    withMap: "Patterns get clustered and flagged automatically",
  },
  {
    without: "One subject at a time, tracked separately",
    withMap: "Coding, aptitude, GK, verbal — all traced the same way",
  },
];

export default function MistakeMapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <Section background="tint" className="pt-14 pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start gap-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-100)] bg-white px-3 py-1 text-sm font-semibold text-[var(--color-primary-600)]">
              AI-Powered · Mistake Map
            </span>
            <h1 className="max-w-xl text-5xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-6xl lg:text-[3.75rem] lg:leading-[1.08]">
              Every mistake,{" "}
              <span className="text-[var(--color-primary-600)]">
                mapped to its cause
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)] sm:text-xl">
              Wrong answers don't just get marked incorrect. Our AI traces
              each one back to the concept behind it, so you always know
              exactly what to fix.
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/assessment" size="lg">
                See Your Mistake Map
              </Button>
              <Button as="a" href="/about" variant="outline" size="lg">
                How It Works
              </Button>
            </div>

            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-6 border-t border-[var(--color-primary-100)] pt-5">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[var(--color-text-h)]">
                    {stat.value}
                  </span>
                  <span className="text-sm leading-snug text-[var(--color-text-muted)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature visual — a live mistake map card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-[var(--color-primary-100)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-semibold text-[var(--color-text-h)]">
                  Your Mistake Map
                </span>
                <span className="rounded-full bg-[var(--color-primary-50)] px-2.5 py-1 text-sm font-semibold text-[var(--color-primary-600)]">
                  Live
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <MistakeRow concept="Closures & Scope" count={6} tone="high" />
                <MistakeRow concept="Array Mutation" count={4} tone="mid" />
                <MistakeRow concept="Event Bubbling" count={2} tone="low" />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-[var(--color-primary-50)]/60 px-3 py-2.5">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Concepts flagged this week
                </span>
                <span className="text-base font-bold text-[var(--color-primary-600)]">
                  3
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[var(--color-primary-100)] bg-white px-4 py-3 shadow-[var(--shadow-card-hover)] sm:block">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                AI flagged
              </p>
              <p className="text-base font-semibold text-[var(--color-text-h)]">
                Closures & Scope
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section background="white">
        <SectionHeading
          title="From wrong answer to clear fix, automatically"
          subtitle="No manual tagging. The AI does the tracing so your map stays accurate on its own."
        />
        <div className="relative mt-10">
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-[var(--color-primary-100)] sm:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center gap-3 text-center"
              >
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-base font-semibold text-white ring-4 ring-[var(--color-primary-50)]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-[var(--color-text-h)]">
                  {step.title}
                </h3>
                <p className="max-w-xs text-base leading-relaxed text-[var(--color-text-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section background="tint">
        <SectionHeading
          title="Built to find the real gap, not just the wrong answer"
          subtitle="Three ways the AI keeps your map accurate and useful."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
            >
              {feature.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* NEW: What happens next — arrow-connected flow, visually distinct from the numbered steps above */}
      <Section background="white">
        <SectionHeading
          title="Here's where you go next"
          subtitle="Your Mistake Map only starts filling in once you've taken an assessment."
        />
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
          <div className="flex w-full max-w-[220px] flex-col gap-1.5 rounded-xl border border-[var(--color-primary-100)] bg-white px-5 py-4 text-center shadow-[var(--shadow-card)]">
            <span className="text-sm font-semibold text-[var(--color-primary-600)]">
              Take the assessment
            </span>
            <span className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              ~10 minutes, any subject
            </span>
          </div>

          <span
            className="hidden text-xl text-[var(--color-primary-300)] sm:block"
            aria-hidden="true"
          >
            →
          </span>
          <span
            className="block text-xl text-[var(--color-primary-300)] sm:hidden"
            aria-hidden="true"
          >
            ↓
          </span>

          <div className="flex w-full max-w-[220px] flex-col gap-1.5 rounded-xl border border-[var(--color-primary-100)] bg-white px-5 py-4 text-center shadow-[var(--shadow-card)]">
            <span className="text-sm font-semibold text-[var(--color-primary-600)]">
              We analyse your answers
            </span>
            <span className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              Every mistake traced to a concept
            </span>
          </div>

          <span
            className="hidden text-xl text-[var(--color-primary-300)] sm:block"
            aria-hidden="true"
          >
            →
          </span>
          <span
            className="block text-xl text-[var(--color-primary-300)] sm:hidden"
            aria-hidden="true"
          >
            ↓
          </span>

          <div className="flex w-full max-w-[220px] flex-col gap-1.5 rounded-xl border-2 border-[var(--color-primary-600)] bg-white px-5 py-4 text-center shadow-[var(--shadow-card-hover)]">
            <span className="text-sm font-semibold text-[var(--color-text-h)]">
              Your Mistake Map is ready
            </span>
            <span className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              Flagged concepts, ranked by impact
            </span>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button as="a" href="/assessment" size="lg">
            Take the Assessment
          </Button>
        </div>
      </Section>

      {/* NEW: Without vs With — comparison, replaces the earlier subject grid above the CTA */}
      <Section background="tint">
        <SectionHeading
          title="What changes once you have a Mistake Map"
          subtitle="Same mistakes, same test results — just organized into something you can act on."
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-2">
            <div className="border-b border-r border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-text-muted)]">
              Without Mistake Map
            </div>
            <div className="border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-primary-700)]">
              With Mistake Map
            </div>
          </div>
          {COMPARISON.map((row, index) => (
            <div key={index} className="grid grid-cols-2">
              <div
                className={[
                  "flex items-start gap-2 border-r border-[var(--color-border)] px-5 py-4 text-sm leading-relaxed text-[var(--color-text-muted)]",
                  index !== COMPARISON.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : "",
                ].join(" ")}
              >
                <span className="mt-0.5 shrink-0 text-[var(--color-text-light)]">✕</span>
                {row.without}
              </div>
              <div
                className={[
                  "flex items-start gap-2 bg-[var(--color-primary-50)]/40 px-5 py-4 text-sm leading-relaxed text-[var(--color-text-body)]",
                  index !== COMPARISON.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : "",
                ].join(" ")}
              >
                <span className="mt-0.5 shrink-0 text-[var(--color-primary-600)]">✓</span>
                {row.withMap}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="white">
        <CtaBanner
          eyebrow="Ready to begin?"
          title="Your skill gap is waiting for you."
          subtitle="Takes less than 10 minutes. No sign-up required to see your first result."
          buttonLabel="Start Free Assessment"
          href="/assessment"
        />
      </Section>
    </div>
  );
}

/* Small helper — a row in the Mistake Map preview card */
function MistakeRow({ concept, count, tone }) {
  const toneMap = {
    high: "bg-[var(--color-primary-600)] text-white",
    mid: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    low: "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]",
  };
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
      <span className="text-sm font-medium text-[var(--color-text-h)]">
        {concept}
      </span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneMap[tone]}`}
      >
        {count}×
      </span>
    </div>
  );
}