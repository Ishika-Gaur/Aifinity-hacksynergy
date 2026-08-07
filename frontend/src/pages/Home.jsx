import React from "react";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";

const FEATURES = [
  {
    eyebrow: "01",
    title: "Concept Root",
    description:
      "Break every topic down to its root concepts, so you always know exactly what you're missing before you move ahead.",
    href: "/concept-root",
  },
  {
    eyebrow: "02",
    title: "Mistake Map",
    description:
      "Every wrong answer gets mapped to the concept behind it, turning your mistakes into a clear list of what to fix.",
    href: "/mistake-map",
  },
  {
    eyebrow: "03",
    title: "Skill Gap",
    description:
      "See the exact gap between where you are and where the role needs you to be — ranked by what matters most.",
    href: "/skill-gap",
  },
];

const STEPS = [
  {
    title: "Take the Assessment",
    description:
      "A short, focused test that figures out your current level across core concepts.",
  },
  {
    title: "Get Your Roadmap",
    description:
      "A step-by-step path built from your results — not a generic course list.",
  },
  {
    title: "Track on Dashboard",
    description:
      "Watch your skill gap close as you complete each step, with progress that's easy to read.",
  },
];

const OBSERVATORY_POINTS = [
  {
    title: "Real-time concept tracking",
    description: "Every question you attempt is mapped back to its root concept, live.",
  },
  {
    title: "Pattern detection",
    description: "AI spots recurring mistake patterns before they become bigger gaps.",
  },
  {
    title: "Adaptive difficulty",
    description: "Your roadmap adjusts automatically as your skill gap closes.",
  },
];

const CHALLENGE_SOLUTIONS = [
  {
    challenge: "Don't know which topic to revise first",
    solution: "Concept Root shows the exact weak spot",
  },
  {
    challenge: "Mistakes repeat without knowing why",
    solution: "Mistake Map traces every error to its cause",
  },
  {
    challenge: "Generic courses don't match the role",
    solution: "Skill Gap ranks what actually matters for the job",
  },
];

const STATS = [
  { value: "10 min", label: "To your first result" },
  { value: "3 steps", label: "From test to roadmap" },
  { value: "0", label: "Sign-ups needed to start" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {/* Hero */}
      <Section background="tint" className="pt-16 pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-200)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-700)] shadow-[var(--shadow-card)]">
              Built for job-ready learning
            </span>

            <h1 className="max-w-xl text-5xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-6xl lg:text-[3.75rem] lg:leading-[1.08]">
              Know exactly what to{" "}
              <span className="text-[var(--color-primary-600)]">
                learn next
              </span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)] sm:text-xl">
              Find your weak concepts, see your skill gap, and follow a
              roadmap built around your own mistakes — not a generic
              syllabus.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/assessment" size="lg">
                Start Assessment
              </Button>
              <Button as="a" href="/about" variant="outline" size="lg">
                How It Works
              </Button>
            </div>

            {/* Stat strip */}
            <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-6 border-t border-[var(--color-primary-200)] pt-6">
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

          {/* Signature visual — the "gap" made visible */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card-hover)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-semibold text-[var(--color-text-h)]">
                  Your Skill Gap
                </span>
                <span className="rounded-full bg-[var(--color-primary-50)] px-2.5 py-1 text-sm font-semibold text-[var(--color-primary-600)]">
                  Frontend Dev
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <GapRow label="Where you are" value={42} tone="light" />
                <GapRow label="Role needs" value={90} tone="dark" />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-[var(--color-primary-50)] px-3 py-2.5">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Concepts to close the gap
                </span>
                <span className="text-base font-bold text-[var(--color-primary-600)]">
                  12
                </span>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-card-hover)] sm:block">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Next up
              </p>
              <p className="text-base font-semibold text-[var(--color-text-h)]">
                Closures &amp; Scope
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section background="white">
        <SectionHeading
          eyebrow="What you get"
          title="Three tools, one clear picture of your progress"
          subtitle="Everything is connected to your actual results — not assumptions about what you should know."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
              footer={
                <Button as="a" href={feature.href} variant="ghost" size="sm">
                  Explore →
                </Button>
              }
            >
              {feature.description}
            </Card>
          ))}
        </div>
      </Section>

       {/* Challenges + Solution */}
<Section background="tint">
  <SectionHeading
    eyebrow="Why it works"
    title="Every challenge, matched with a direct solution"
    subtitle="No generic advice — just the specific fix for the specific problem."
  />
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
    {CHALLENGE_SOLUTIONS.map((item) => (
      <Card key={item.challenge} hoverable={false}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[var(--color-error)]">
            ✕
          </span>
          <p className="text-sm text-[var(--color-text-muted)]">
            {item.challenge}
          </p>
        </div>

        <div className="my-4 border-t border-[var(--color-border)]" />

        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary-600)]">
            ✓
          </span>
          <p className="text-sm font-medium text-[var(--color-text-h)]">
            {item.solution}
          </p>
        </div>
      </Card>
    ))}
  </div>
</Section>

      {/* AI Observatory */}
<Section background="white">
  <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
    <div className="order-2 lg:order-1 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card-hover)]">
      <img
        src="https://i.pinimg.com/1200x/4c/47/71/4c4771cb8762ad6e9aa4d73e13aec095.jpg"
        alt="AI Observatory dashboard"
        className="h-full w-full object-cover"
      />
    </div>

    <div className="order-1 lg:order-2 flex flex-col items-start gap-5 text-left">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-700)]">
        AI Observatory
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-4xl">
        An AI that watches your progress, so you don't have to guess
      </h2>
      <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
        Every attempt, every mistake, every concept — continuously observed
        and turned into a clear picture of where you stand.
      </p>

      <div className="mt-2 flex flex-col gap-4 w-full">
        {OBSERVATORY_POINTS.map((point) => (
          <div key={point.title} className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary-600)]">
              ✓
            </span>
            <div>
              <p className="font-semibold text-[var(--color-text-h)]">
                {point.title}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</Section>

      {/* How it works */}
      <Section background="tint">
        <SectionHeading
          eyebrow="How it works"
          title="From assessment to roadmap in three steps"
        />
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-[var(--color-primary-200)] sm:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
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


      {/* CTA */}
      <Section background="white">
        <CtaBanner
          eyebrow="Ready to begin?"
          title="Your skill gap is waiting for you."
          buttonLabel="Start Free Assessment"
          href="/assessment"
        />
      </Section>
    </div>
  );
}

/* Small helper for the hero's "skill gap" visual — a labelled progress bar. */
function GapRow({ label, value, tone }) {
  const barColor =
    tone === "dark"
      ? "bg-[var(--color-primary-600)]"
      : "bg-[var(--color-primary-300)]";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--color-text-muted)]">
          {label}
        </span>
        <span className="font-semibold text-[var(--color-text-h)]">
          {value}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}