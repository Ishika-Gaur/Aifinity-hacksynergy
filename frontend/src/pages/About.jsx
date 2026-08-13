import React from "react";
import Section from "../components/Section";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";

const PROBLEM_CARDS = [
  {
    eyebrow: "01",
    title: "Hidden Concept Gaps",
    description:
      "Students know what they got wrong, but not which underlying concept is missing or causing the failure.",
  },
  {
    eyebrow: "02",
    title: "Repeated Mistakes",
    description:
      "Students repeat similar mistakes across assignments without understanding the underlying pattern.",
  },
  {
    eyebrow: "03",
    title: "Unclear Career Readiness",
    description:
      "Students don't know whether their current skills match actual career goals and role requirements.",
  },
];

const THINKING_STEPS = [
  {
    step: "01",
    label: "DISCOVER",
    title: "Understand Struggle",
    description: "Identify what the student is struggling with from test attempts or code submissions.",
  },
  {
    step: "02",
    label: "ANALYZE",
    title: "Root Cause & Patterns",
    description: "Find the root concept and recurring mistake patterns behind the struggle.",
  },
  {
    step: "03",
    label: "IMPROVE",
    title: "Targeted Learning",
    description: "Recommend targeted concepts and practice exercises to fix missing prerequisites.",
  },
  {
    step: "04",
    label: "PREPARE",
    title: "Career Readiness",
    description: "Connect learning progress with real-world role requirements and career benchmarks.",
  },
];

const THREE_SYSTEMS = [
  {
    name: "CONCEPTROOT",
    tagline: "Understand why you got it wrong.",
    description:
      "Identifies the root concept behind an incorrect answer and detects missing prerequisite concepts that need review before moving forward.",
    href: "/concept-root",
  },
  {
    name: "MISTAKEMAP",
    tagline: "Understand the patterns behind your mistakes.",
    description:
      "Analyzes multiple attempts to reveal recurring weaknesses, blind spots, and error patterns across different topics over time.",
    href: "/mistake-map",
  },
  {
    name: "SKILLGAP",
    tagline: "Know what you need for your target career.",
    description:
      "Compares current learning performance directly with real career requirements to build a personalized action roadmap.",
    href: "/skill-gap",
  },
];

const JOURNEY_STAGES = [
  "Student Attempt",
  "Concept Analysis",
  "Learning Gap",
  "Personalized Guidance",
  "Career Readiness",
];

const IMPACT_OUTCOMES = [
  {
    title: "Better Concept Understanding",
    desc: "Master foundational concepts rather than just memorizing correct test answers.",
  },
  {
    title: "Fewer Repeated Mistakes",
    desc: "Break recurring error loops by solving missing prerequisite gaps early.",
  },
  {
    title: "Personalized Learning",
    desc: "Focus study time strictly on what you need, skipping redundant topics.",
  },
  {
    title: "Continuous Progress Tracking",
    desc: "Watch gaps shrink as you complete targeted practice milestones.",
  },
  {
    title: "Career Readiness",
    desc: "Align academic performance with industry-level expectations.",
  },
  {
    title: "Higher Learning Confidence",
    desc: "Proceed into advanced topics knowing your foundation is solid.",
  },
];

export default function About() {
  return (
    <div>
      {/* HERO SECTION */}
      <HeroSection
        eyebrow="ABOUT AIFINITY"
        title="Learning should show you"
        highlightWord="what you're missing."
        description="Afinity AI helps students understand the root cause behind their mistakes, identify their learning gaps, and turn those insights into a clearer path toward their goals."
      />

      {/* WHY COGNIFY EXISTS */}
      <Section>
        <SectionHeading
          eyebrow="THE PROBLEM"
          title="Students know their scores. They don't always know their gaps."
          subtitle="Traditional learning platforms tell you what answer was wrong, but leave you guessing why you made the mistake or how to fix it."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEM_CARDS.map((card) => (
            <Card key={card.eyebrow} eyebrow={card.eyebrow} title={card.title}>
              {card.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* HOW COGNIFY THINKS */}
      <Section className="border-y border-[var(--color-border)]">
        <SectionHeading
          eyebrow="OUR METHODOLOGY"
          title="From mistakes to meaningful progress."
          subtitle="Afinity transforms isolated quiz attempts into a structured learning loop."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {THINKING_STEPS.map((step) => (
            <Card
              key={step.step}
              icon={<span style={{ fontFamily: "var(--font-mono)" }} className="text-lg font-bold">{step.step}</span>}
              eyebrow={step.label}
              title={step.title}
            >
              {step.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* THREE SYSTEMS */}
      <Section>
        <SectionHeading
          eyebrow="PRODUCT ARCHITECTURE"
          title="Three intelligent systems. One clearer learning journey."
          subtitle="Each system addresses a distinct phase of learning diagnosis and growth."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {THREE_SYSTEMS.map((system) => (
            <Card
              key={system.name}
              eyebrow={system.name}
              title={system.tagline}
              footer={
                <Button as="a" href={system.href} variant="subtle" size="sm" className="w-full justify-center">
                  Explore {system.name}
                </Button>
              }
            >
              {system.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* THE COGNIFY JOURNEY */}
      <Section className="border-y border-[var(--color-border)]">
        <SectionHeading
          eyebrow="CONNECTED LEARNING"
          title="The Afinity Journey"
          subtitle="Afinity is designed to connect these stages instead of treating them as isolated activities."
        />

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {JOURNEY_STAGES.map((stage, idx) => (
              <div
                key={stage}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--color-primary-50)]/50 border border-[var(--color-primary-100)]"
              >
                <span className="text-xs font-mono font-bold text-[var(--color-primary-600)] mb-1">
                  STAGE 0{idx + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text-h)]">{stage}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm leading-relaxed text-[var(--color-text-muted)] max-w-2xl mx-auto">
            By linking attempt evaluations to concept prerequisites, practice guidance, and career standards, Afinity
            ensures every learning activity has a clear purpose.
          </p>
        </div>
      </Section>

      {/* IMPACT */}
      <Section>
        <SectionHeading
          eyebrow="OUTCOMES"
          title="Turn learning into measurable progress."
          subtitle="Designed to build deep conceptual clarity and long-term retention."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMPACT_OUTCOMES.map((item) => (
            <Card
              key={item.title}
              icon={<span className="text-base font-bold">✓</span>}
              title={item.title}
            >
              {item.desc}
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
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