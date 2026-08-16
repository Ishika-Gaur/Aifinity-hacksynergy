import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";

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

// Personalized progress — mistakes before vs now per topic.
// Replace with real data from your API (per-concept mistake counts over attempts).
const TOPIC_PROGRESS = [
  { concept: "Time & Work", before: 9, after: 2, needsAttention: false },
  { concept: "Recursion", before: 7, after: 5, needsAttention: true },
  { concept: "Probability", before: 8, after: 3, needsAttention: false },
  { concept: "SQL Joins", before: 6, after: 6, needsAttention: true },
  { concept: "Verbal Analogies", before: 5, after: 1, needsAttention: false },
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

// Custom tooltip so it matches the site's card styling instead of recharts' default box
function ProgressTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const row = TOPIC_PROGRESS.find((t) => t.concept === label);
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-xs font-semibold text-[var(--color-text-h)]">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs text-[var(--color-text-muted)]">
          {p.name}: <span className="font-medium text-[var(--color-text-h)]">{p.value}</span>
        </p>
      ))}
      {row?.needsAttention && (
        <p className="mt-1 text-xs font-semibold text-amber-600">Needs attention</p>
      )}
    </div>
  );
}

export default function MistakeMapPage() {
  return (
    <div className="flex min-h-screen flex-col ">
      {/* Hero */}
      <HeroSection
        eyebrow="AI-Powered · Mistake Map"
        title="Every mistake,"
        highlightWord="mapped to its cause"
        description="Wrong answers don't just get marked incorrect. Our AI traces each one back to the concept behind it, so you always know exactly what to fix."
        primaryCta={{ label: "See Your Mistake Map", href: "/assessment" }}
        secondaryCta={{ label: "How It Works", href: "/about" }}
      />

      {/* How it works */}
      <Section>
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
      <Section>
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

      {/* Your Progress — real recharts bar graph, before vs now per topic */}
      <Section>
        <SectionHeading
          title="Your progress, topic by topic"
          subtitle="How many mistakes you made before vs. now — topics still flagged in amber need more work."
        />
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={TOPIC_PROGRESS}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="concept"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Mistakes",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--color-text-muted)",
                  fontSize: 12,
                }}
              />
              <Tooltip content={<ProgressTooltip />} cursor={{ fill: "var(--color-surface-secondary)" }} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--color-text-muted)" }}
              />
              <Bar dataKey="before" name="Before" fill="var(--color-text-light)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" name="Now" radius={[4, 4, 0, 0]}>
                {TOPIC_PROGRESS.map((entry) => (
                  <Cell
                    key={entry.concept}
                    fill={entry.needsAttention ? "#f59e0b" : "var(--color-primary-600)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for the attention flag, since recharts Cell colors aren't in the auto-legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary-600)]" />
              Improved / stable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Needs attention
            </span>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button as="a" href="/assessment" size="lg">
            Take Another Assessment
          </Button>
        </div>
      </Section>

      {/* Without vs With — comparison, replaces the earlier subject grid above the CTA */}
      <Section>
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
      <Section>
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