import React from "react";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";

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

const STATS = [
  { value: "10 min", label: "To your first result" },
  { value: "3 steps", label: "From test to roadmap" },
  { value: "0", label: "Sign-ups needed to start" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <Section background="tint" className="pt-14 pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <div className="flex flex-col items-start gap-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-semibold text-blue-700">
              Built for job-ready learning
            </span>
            <h1 className="max-w-xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-[3.75rem] lg:leading-[1.08]">
              Know exactly what to{" "}
              <span className="text-blue-700">learn next</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
              Find your weak concepts, see your skill gap, and follow a
              roadmap built around your own mistakes — not a generic
              syllabus.
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/assessment" size="lg">
                Start Assessment
              </Button>
              <Button as="a" href="/about" variant="outline" size="lg">
                How It Works
              </Button>
            </div>

            {/* Stat strip */}
            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-6 border-t border-blue-100 pt-5">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-sm leading-snug text-slate-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature visual — the "gap" made visible */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">
                  Your Skill Gap
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
                  Frontend Dev
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <GapRow label="Where you are" value={42} tone="light" />
                <GapRow label="Role needs" value={90} tone="dark" />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-blue-50/60 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-600">
                  Concepts to close the gap
                </span>
                <span className="text-base font-bold text-blue-700">12</span>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.10),0_2px_6px_rgba(15,23,42,0.06)] sm:block">
              <p className="text-sm font-medium text-slate-500">
                Next up
              </p>
              <p className="text-base font-semibold text-slate-900">
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
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* How it works */}
      <Section background="tint">
        <SectionHeading
          eyebrow="How it works"
          title="From assessment to roadmap in three steps"
          align="center"
        />
        <div className="relative mt-10">
          {/* connecting line — steps are a real sequence, so the line + numbers earn their place */}
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-blue-100 sm:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center gap-3 text-center"
              >
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-base font-semibold text-white ring-4 ring-blue-50">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="max-w-xs text-base leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="white">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-12 text-center">
          <h2 className="max-w-lg text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to see your skill gap?
          </h2>
          <p className="max-w-md text-base leading-relaxed text-slate-600">
            Takes less than 10 minutes. No sign-up required to see your
            first result.
          </p>
          <Button as="a" href="/assessment" size="lg">
            Start Free Assessment
          </Button>
        </div>
      </Section>
    </div>
  );
}

/* Small helper for the hero's "skill gap" visual — a labelled progress bar. */
function GapRow({ label, value, tone }) {
  const barColor = tone === "dark" ? "bg-blue-700" : "bg-blue-300";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}