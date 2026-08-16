import React, { useRef } from "react";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import ConceptRootDemo from "../components/ConceptRootDemo";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Student Submission",
    description: "Submit a normal quiz answer, conceptual response, or JavaScript code snippet.",
  },
  {
    step: "02",
    title: "Analyze the Mistake",
    description: "ConceptRoot evaluates the submission mechanics beyond simple right/wrong checks.",
  },
  {
    step: "03",
    title: "Find the Root Cause",
    description: "Identify the exact underlying concept and missing prerequisite knowledge gap.",
  },
  {
    step: "04",
    title: "Personalized Guidance",
    description: "Receive targeted study topics and practice recommendations customized to your gap.",
  },
];

const FEATURE_CARDS = [
  {
    eyebrow: "DIAGNOSTIC 01",
    title: "Root Cause Analysis",
    description:
      "Pinpoint the exact foundational concept that caused the mistake, rather than relying on rote answer memorization.",
  },
  {
    eyebrow: "DIAGNOSTIC 02",
    title: "Concept Gap Detection",
    description:
      "Identify missing prerequisite knowledge from earlier topics that is blocking progress on current material.",
  },
  {
    eyebrow: "DIAGNOSTIC 03",
    title: "Adaptive Learning Path",
    description:
      "Get targeted concepts and tailored practice exercises directly addressing the detected gap.",
  },
];

const JOURNEY_STEPS = [
  "Student Submission",
  "Mistake Detected",
  "Root Concept",
  "Missing Prerequisite",
  "Recommended Concept",
  "Practice",
  "Improved Understanding",
];

export default function ConceptRoot() {
  const demoRef = useRef(null);
  const howItWorksRef = useRef(null);

  const handleScrollToDemo = (e) => {
    if (e) e.preventDefault();
    if (demoRef.current) {
      const navbarHeight = 85;
      const elementPosition = demoRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToHowItWorks = (e) => {
    if (e) e.preventDefault();
    if (howItWorksRef.current) {
      const navbarHeight = 85;
      const elementPosition = howItWorksRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <HeroSection
        eyebrow="CONCEPTROOT AI"
        title="Don't just see what's wrong."
        highlightWord="Understand why."
        description="ConceptRoot helps uncover the concept behind a mistake, identify missing prerequisites, and show students what to learn next."
        primaryCta={{ label: "Try ConceptRoot", onClick: handleScrollToDemo }}
        secondaryCta={{ label: "How It Works", onClick: handleScrollToHowItWorks }}
      />

      {/* THE CORE IDEA */}
      <Section>
        <SectionHeading
          eyebrow="CORE PHILOSOPHY"
          title="An incorrect answer is only the symptom."
          subtitle="Traditional feedback stops at telling you you're wrong. ConceptRoot diagnoses the exact concept chain that led to the mistake."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Feedback Card — kept bespoke: this is a one-off
              comparison layout, not a repeatable list item, so the
              generic Card shape doesn't fit it. */}
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
                Traditional Feedback
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Surface-Level Checking
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100 text-red-600">
                  <span className="text-lg">❌</span>
                  <span>Incorrect Answer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 text-gray-700">
                  <span className="text-lg">✓</span>
                  <span>Correct answer provided (Memorize it)</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              Result: Student memorizes the correct answer without fixing the underlying concept gap.
            </p>
          </div>

          {/* ConceptRoot Card — same, bespoke flow layout */}
          <div className="rounded-2xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)]/40 p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-[var(--color-primary-600)] uppercase tracking-wider block mb-2">
                ConceptRoot AI
              </span>
              <h3 className="text-xl font-bold text-[var(--color-text-h)] mb-6">
                Root Cause Diagnosis
              </h3>
              <div className="space-y-2.5 text-xs font-medium">
                <div className="p-2.5 bg-white rounded-lg border border-red-200 text-red-700 flex items-center justify-between">
                  <span>❌ Incorrect Attempt</span>
                </div>
                <div className="text-center text-[var(--color-primary-600)] font-bold text-xs">↓</div>
                <div className="p-2.5 bg-white rounded-lg border border-[var(--color-primary-200)] text-[var(--color-text-h)]">
                  🔍 Mistake Identified
                </div>
                <div className="text-center text-[var(--color-primary-600)] font-bold text-xs">↓</div>
                <div className="p-2.5 bg-white rounded-lg border border-[var(--color-primary-200)] text-[var(--color-primary-900)] font-semibold">
                  🧠 Root Concept Detected
                </div>
                <div className="text-center text-[var(--color-primary-600)] font-bold text-xs">↓</div>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-200 text-indigo-900 font-semibold">
                  ⚠️ Missing Prerequisite Identified
                </div>
                <div className="text-center text-[var(--color-primary-600)] font-bold text-xs">↓</div>
                <div className="p-2.5 bg-[var(--color-primary-600)] text-white rounded-lg font-bold text-center">
                  🎯 Targeted Practice & Guidance
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <div ref={howItWorksRef} id="how-it-works" className="scroll-mt-20">
        <Section className="border-y border-[var(--color-border)]">
          <SectionHeading
            eyebrow="STEP-BY-STEP"
            title="How ConceptRoot Works"
            subtitle="Four simple steps from attempt to deep conceptual clarity."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <Card
                key={s.step}
                icon={<span style={{ fontFamily: "var(--font-mono)" }} className="text-lg font-bold">{s.step}</span>}
                title={s.title}
              >
                {s.description}
              </Card>
            ))}
          </div>
        </Section>
      </div>

      {/* INTERACTIVE DEMO */}
      <div ref={demoRef} id="interactive-demo" className="scroll-mt-20">
        <Section>
          <SectionHeading
            eyebrow="LIVE DEMO"
            title="Interactive ConceptRoot Demo"
            subtitle="Try out ConceptRoot on a sample conceptual question or JavaScript code snippet."
          />

          <ConceptRootDemo />
        </Section>
      </div>

      {/* WHAT CONCEPTROOT FINDS */}
      <Section className="border-y border-[var(--color-border)]">
        <SectionHeading
          eyebrow="DIAGNOSTICS"
          title="What ConceptRoot Finds"
          subtitle="Three core capabilities engineered to eliminate blind spots."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURE_CARDS.map((f) => (
            <Card key={f.eyebrow} eyebrow={f.eyebrow} title={f.title}>
              {f.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* EXAMPLE LEARNING JOURNEY */}
      <Section>
        <SectionHeading
          eyebrow="VISUAL PROGRESSION"
          title="Example Learning Journey"
          subtitle="How ConceptRoot transforms an error into master-level understanding."
        />

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 text-center">
            {JOURNEY_STEPS.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex-1 min-w-[130px] p-3 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)]">
                  <span className="text-[10px] font-mono font-bold text-[var(--color-primary-700)] block uppercase">
                    Step 0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-h)]">
                    {step}
                  </span>
                </div>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <span className="hidden lg:block text-xs font-bold text-[var(--color-primary-400)]">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
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