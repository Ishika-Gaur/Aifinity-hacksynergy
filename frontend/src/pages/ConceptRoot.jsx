import React from "react";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";
import ConceptRootDemo from "../components/ConceptRootDemo";

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
  const scrollToDemo = () => {
    const elem = document.getElementById("interactive-demo");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHowItWorks = () => {
    const elem = document.getElementById("how-it-works");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <Section background="tint" className="pt-20 pb-16 border-b border-[var(--color-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-100)] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-700)]">
              CONCEPTROOT AI
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-h)] tracking-tight leading-tight">
              Don't just see what's wrong. Understand why.
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-[var(--color-text-muted)] max-w-xl">
              ConceptRoot helps uncover the concept behind a mistake, identify missing prerequisites, and show students what to learn next.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button onClick={scrollToDemo} size="lg">
                Try ConceptRoot
              </Button>
              <Button onClick={scrollToHowItWorks} variant="outline" size="lg">
                How It Works
              </Button>
            </div>
          </div>

          {/* Hero Right Visual Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card-hover)] space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <span className="text-xs font-mono font-semibold text-[var(--color-primary-600)] uppercase tracking-wider">
                  Live Analysis Preview
                </span>
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                  Needs Review
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                    Question / Code
                  </span>
                  <span className="font-mono text-gray-800">
                    let max = 0; // for negative array
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[var(--color-primary-50)] p-2.5 rounded-lg border border-[var(--color-primary-100)]">
                    <span className="text-[10px] font-bold text-[var(--color-primary-700)] block uppercase">
                      Root Concept
                    </span>
                    <span className="font-semibold text-[var(--color-primary-900)]">
                      Boundary Conditions
                    </span>
                  </div>
                  <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-700 block uppercase">
                      Missing Gap
                    </span>
                    <span className="font-semibold text-indigo-900">
                      Edge-Case Invariants
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                    Targeted Recommendation
                  </span>
                  <span className="text-gray-700">
                    Review accumulator initialization strategies with negative array bounds.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* THE CORE IDEA */}
      <Section background="white">
        <SectionHeading
          eyebrow="CORE PHILOSOPHY"
          title="An incorrect answer is only the symptom."
          subtitle="Traditional feedback stops at telling you you're wrong. ConceptRoot diagnoses the exact concept chain that led to the mistake."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Feedback Card */}
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

          {/* ConceptRoot Card */}
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
      <Section id="how-it-works" background="tint" className="border-y border-[var(--color-border)]">
        <SectionHeading
          eyebrow="STEP-BY-STEP"
          title="How ConceptRoot Works"
          subtitle="Four simple steps from attempt to deep conceptual clarity."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
            >
              <span className="text-2xl font-bold text-[var(--color-primary-600)] block mb-3">
                {s.step}
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-text-h)] mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* INTERACTIVE DEMO */}
      <Section id="interactive-demo" background="white">
        <SectionHeading
          eyebrow="LIVE DEMO"
          title="Interactive ConceptRoot Demo"
          subtitle="Try out ConceptRoot on a sample conceptual question or JavaScript code snippet."
        />

        <ConceptRootDemo />
      </Section>

      {/* WHAT CONCEPTROOT FINDS */}
      <Section background="tint" className="border-y border-[var(--color-border)]">
        <SectionHeading
          eyebrow="DIAGNOSTICS"
          title="What ConceptRoot Finds"
          subtitle="Three core capabilities engineered to eliminate blind spots."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURE_CARDS.map((f) => (
            <Card
              key={f.eyebrow}
              eyebrow={f.eyebrow}
              title={f.title}
            >
              {f.description}
            </Card>
          ))}
        </div>
      </Section>

      {/* EXAMPLE LEARNING JOURNEY */}
      <Section background="white">
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

      {/* FINAL CTA */}
      <Section background="dark" className="py-20 text-center">
        <Container size="narrow">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Know what to learn next.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Turn every mistake into a clearer learning path with ConceptRoot.
          </p>
          <Button onClick={scrollToDemo} variant="primary" size="lg">
            Try ConceptRoot
          </Button>
        </Container>
      </Section>
    </div>
  );
}
