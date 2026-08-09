import React, { useState } from "react";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import ImageCard from "../components/ImageCard";

/* Original, simple AI/learning illustration — no external image dependency. */
const WELCOME_ILLUSTRATION =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EEF2FF" />
      <stop offset="100%" stop-color="#E0E7FF" />
    </linearGradient>
  </defs>
  <rect width="400" height="250" fill="url(#bg)" />
  <g stroke="#A5B4FC" stroke-width="1.5" fill="none" opacity="0.9">
    <line x1="90" y1="80" x2="180" y2="60" />
    <line x1="180" y1="60" x2="280" y2="90" />
    <line x1="180" y1="60" x2="200" y2="150" />
    <line x1="90" y1="80" x2="200" y2="150" />
    <line x1="280" y1="90" x2="200" y2="150" />
    <line x1="200" y1="150" x2="130" y2="190" />
    <line x1="200" y1="150" x2="290" y2="180" />
  </g>
  <circle cx="90" cy="80" r="7" fill="#818CF8" />
  <circle cx="180" cy="60" r="9" fill="#4F46E5" />
  <circle cx="280" cy="90" r="7" fill="#818CF8" />
  <circle cx="200" cy="150" r="11" fill="#06B6D4" />
  <circle cx="130" cy="190" r="6" fill="#A5B4FC" />
  <circle cx="290" cy="180" r="6" fill="#A5B4FC" />
</svg>
`);

const INTEREST_OPTIONS = [
  "A Subject",
  "A Skill",
  "Exam Preparation",
  "Interview Preparation",
  "Something Else",
];

const LEVEL_OPTIONS = [
  { title: "Beginner", description: "Starting from the basics" },
  { title: "Intermediate", description: "Comfortable with the fundamentals" },
  { title: "Advanced", description: "Ready to go deeper" },
];

const GOAL_OPTIONS = [
  "Learn from the basics",
  "Improve my skills",
  "Prepare for an exam",
  "Prepare for an interview",
  "Master the subject",
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1); // 1-4 = flow, 5 = final screen
  const [interest, setInterest] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [level, setLevel] = useState(null);
  const [goal, setGoal] = useState(null);

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Section background="white" className="py-16">
        <Container>
          {/* Progress indicator — shown during the 4-step flow only */}
          {step >= 1 && step <= TOTAL_STEPS && (
            <div className="mx-auto mb-12 max-w-xl">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-[var(--color-text-muted)]">
                <span>
                  Step {step} of {TOTAL_STEPS}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i < step
                        ? "bg-[var(--color-primary-600)]"
                        : "bg-[var(--color-primary-100)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ---------------- STEP 1: WELCOME ---------------- */}
          {step === 1 && (
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="flex flex-col items-start gap-5 text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-100)] bg-white px-3 py-1 text-sm font-semibold text-[var(--color-primary-600)]">
                  AI-Powered Onboarding
                </span>
                <h1 className="max-w-lg text-4xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-5xl">
                  Welcome to your AI Learning Observatory
                </h1>
                <p className="max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
                  Let's personalize your learning experience and help you
                  understand your progress better.
                </p>
                <Button size="lg" onClick={goNext} className="mt-2">
                  Get Started →
                </Button>
              </div>

              <div className="mx-auto w-full max-w-sm">
                <ImageCard
                  image={WELCOME_ILLUSTRATION}
                  alt="Abstract illustration of connected learning concepts"
                  title="Built around how you actually learn"
                  description="Every answer helps shape a path that's specific to you."
                  hoverable={false}
                />
              </div>
            </div>
          )}

          {/* ---------------- STEP 2: WHAT DO YOU WANT TO LEARN ---------------- */}
          {step === 2 && (
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                title="What do you want to learn?"
                subtitle="Pick whatever fits best — you can always change this later."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {INTEREST_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option}
                    title={option}
                    selected={interest === option}
                    onSelect={() => setInterest(option)}
                  />
                ))}
              </div>

              <div className="mt-8">
                <label
                  htmlFor="custom-subject"
                  className="mb-2 block text-sm font-medium text-[var(--color-text-h)]"
                >
                  Or tell us exactly what you have in mind
                </label>
                <input
                  id="custom-subject"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your subject or skill"
                  className="w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                />
              </div>

              <StepNav onBack={goBack} onNext={goNext} showBack />
            </div>
          )}

          {/* ---------------- STEP 3: CURRENT LEVEL ---------------- */}
          {step === 3 && (
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                title="Where are you right now?"
                subtitle="Be honest — this just helps us pace things correctly."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {LEVEL_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.title}
                    title={option.title}
                    description={option.description}
                    selected={level === option.title}
                    onSelect={() => setLevel(option.title)}
                  />
                ))}
              </div>

              <StepNav onBack={goBack} onNext={goNext} showBack />
            </div>
          )}

          {/* ---------------- STEP 4: GOAL ---------------- */}
          {step === 4 && (
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                title="What do you want to achieve?"
                subtitle="This shapes the roadmap we build for you."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {GOAL_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option}
                    title={option}
                    selected={goal === option}
                    onSelect={() => setGoal(option)}
                  />
                ))}
              </div>

              <StepNav
                onBack={goBack}
                onNext={goNext}
                showBack
                nextLabel="Finish →"
              />
            </div>
          )}

          {/* ---------------- FINAL SCREEN ---------------- */}
          {step === 5 && (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-3xl">
                ✓
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-5xl">
                You're all set!
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
                Your personalized learning journey is ready. Let's see
                where you can go.
              </p>
              <Button as="a" href="/dashboard" size="lg" className="mt-2">
                Start Learning →
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

/* ---------------- Local helpers (kept in this file, not new component files) ---------------- */

function SelectableCard({ title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left transition-transform duration-150 focus:outline-none"
    >
      <Card
        title={title}
        hoverable={!selected}
        className={
          selected
            ? "border-2 border-[var(--color-primary-600)] bg-[var(--color-primary-50)] shadow-[var(--shadow-card-hover)]"
            : "border-[var(--color-border)]"
        }
      >
        {description}
      </Card>
    </button>
  );
}

function StepNav({ onBack, onNext, showBack, nextLabel = "Next →" }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {showBack ? (
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onNext}>{nextLabel}</Button>
    </div>
  );
}