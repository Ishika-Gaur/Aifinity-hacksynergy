import React, { useEffect, useState } from "react";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import ImageCard from "../components/ImageCard";
import { FIELDS, FIELD_ICONS, CAREER_GOALS_BY_FIELD } from "../data/assessments";

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

const LEVEL_OPTIONS = [
  { title: "Beginner", description: "Starting from the basics" },
  { title: "Intermediate", description: "Comfortable with the fundamentals" },
  { title: "Advanced", description: "Ready to go deeper" },
];

const TOTAL_STEPS = 4;

/* Read by data/assessments.js (getUserProfile) to personalize the
   Assessment page. Keep this key in sync if it's ever renamed. */
const ONBOARDING_STORAGE_KEY = "aifinity_onboarding_profile";

export default function OnboardingPage() {
  const [step, setStep] = useState(1); // 1-4 = flow, 5 = final screen
  const [field, setField] = useState(null);
  const [level, setLevel] = useState(null);
  const [careerGoal, setCareerGoal] = useState(null);

  // Career-goal options depend on the chosen field. If the field
  // changes after a goal was already picked, drop the stale goal so
  // we never save a goal that doesn't belong to the selected field.
  useEffect(() => {
    if (careerGoal && field && !CAREER_GOALS_BY_FIELD[field]?.includes(careerGoal)) {
      setCareerGoal(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // Persist the onboarding answers once the person reaches the final
  // screen, so pages like Assessment can personalize using them.
  // No UI change — this is a silent side effect only.
  useEffect(() => {
    if (step !== 5) return;
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ field, careerGoal, level })
      );
    } catch {
      // localStorage unavailable (e.g. private browsing) — safe to ignore,
      // Assessment page just falls back to its default profile.
    }
  }, [step, field, careerGoal, level]);

  const careerGoalOptions = field ? CAREER_GOALS_BY_FIELD[field] || [] : [];

  return (
    <div className="flex min-h-screen flex-col ">
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

          {/* ---------------- STEP 2: FIELD ---------------- */}
          {step === 2 && (
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                title="What field are you focused on?"
                subtitle="This decides which assessments and recommendations you'll see — you can change it later."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <SelectableCard
                    key={f}
                    icon={FIELD_ICONS[f]}
                    title={f}
                    selected={field === f}
                    onSelect={() => setField(f)}
                  />
                ))}
              </div>

              <StepNav onBack={goBack} onNext={goNext} showBack nextDisabled={!field} />
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

              <StepNav onBack={goBack} onNext={goNext} showBack nextDisabled={!level} />
            </div>
          )}

          {/* ---------------- STEP 4: CAREER GOAL ---------------- */}
          {step === 4 && (
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                title={`What's your career goal in ${field}?`}
                subtitle="This shapes the roadmap and recommendations we build for you."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {careerGoalOptions.map((option) => (
                  <SelectableCard
                    key={option}
                    title={option}
                    selected={careerGoal === option}
                    onSelect={() => setCareerGoal(option)}
                  />
                ))}
                {careerGoalOptions.length === 0 && (
                  <p className="col-span-full text-sm text-[var(--color-text-muted)]">
                    Go back and pick a field first to see relevant goals here.
                  </p>
                )}
              </div>

              <StepNav
                onBack={goBack}
                onNext={goNext}
                showBack
                nextLabel="Finish →"
                nextDisabled={!careerGoal}
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
              <Button as="a" href="/assessment" size="lg" className="mt-2">
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

function SelectableCard({ icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left transition-transform duration-150 focus:outline-none"
    >
      <Card
        icon={icon ? <span className="text-lg font-bold text-[var(--color-primary-600)]">{icon}</span> : undefined}
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

function StepNav({ onBack, onNext, showBack, nextLabel = "Next →", nextDisabled = false }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {showBack ? (
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}