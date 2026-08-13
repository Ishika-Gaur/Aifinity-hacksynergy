import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Section from "../components/Section";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";
import { getAssessmentById, formatType } from "../data/assessments";

const CONFIDENCE_OPTIONS = ["Low Confidence", "Medium Confidence", "High Confidence"];

/* Types with a definite correct answer we can auto-grade.
   "conceptual", "coding", and "problem-solving" are free text —
   attempted only, not graded here (real grading comes with AI analysis later). */
const GRADABLE_TYPES = ["mcq", "scenario", "logical-reasoning", "data-interpretation", "output"];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function isCorrect(question, response) {
  if (!GRADABLE_TYPES.includes(question.type) || response === undefined) return false;
  if (question.type === "output") {
    return (
      String(response).trim().toLowerCase() ===
      String(question.answer).trim().toLowerCase()
    );
  }
  return response === question.answer;
}

/* ---------------- Question type renderers ---------------- */

function McqQuestion({ question, response, onAnswer }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {question.options.map((option, index) => (
        <button key={option} type="button" onClick={() => onAnswer(index)} className="text-left">
          <Card
            title={option}
            hoverable={response !== index}
            className={
              response === index
                ? "border-2 border-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
                : "border-[var(--color-border)]"
            }
          />
        </button>
      ))}
    </div>
  );
}

/* Scenario, Logical Reasoning, and Data Interpretation questions all use
   the same select-one-option interaction as MCQ — kept as separate
   wrappers so each can get its own visual treatment later without
   touching the others. */
function ScenarioQuestion(props) {
  return <McqQuestion {...props} />;
}

function LogicalReasoningQuestion(props) {
  return <McqQuestion {...props} />;
}

function DataInterpretationQuestion(props) {
  return <McqQuestion {...props} />;
}

function ConceptualQuestion({ response, onAnswer }) {
  return (
    <textarea
      value={response || ""}
      onChange={(e) => onAnswer(e.target.value)}
      rows={6}
      placeholder="Type your explanation here..."
      className="mt-6 w-full resize-none rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
    />
  );
}

/* Problem Solving spans very different fields (algorithmic, case-study,
   design-decision, campaign strategy...) so it stays free text — the
   same open-ended shape works for all of them. */
function ProblemSolvingQuestion({ response, onAnswer }) {
  return (
    <textarea
      value={response || ""}
      onChange={(e) => onAnswer(e.target.value)}
      rows={7}
      placeholder="Walk through your approach here..."
      className="mt-6 w-full resize-none rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
    />
  );
}

function CodingQuestion({ response, onAnswer }) {
  return (
    <textarea
      value={response || ""}
      onChange={(e) => onAnswer(e.target.value)}
      rows={10}
      spellCheck={false}
      placeholder="// write your code here"
      className="mt-6 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-navy)] px-4 py-3 font-mono text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]/30"
    />
  );
}

function OutputQuestion({ response, onAnswer }) {
  return (
    <input
      type="text"
      value={response || ""}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Type the expected output..."
      className="mt-6 w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-3 font-mono text-sm text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
    />
  );
}

function QuestionBody({ question, response, onAnswer }) {
  switch (question.type) {
    case "mcq":
      return <McqQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "scenario":
      return <ScenarioQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "logical-reasoning":
      return <LogicalReasoningQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "data-interpretation":
      return <DataInterpretationQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "problem-solving":
      return <ProblemSolvingQuestion response={response} onAnswer={onAnswer} />;
    case "conceptual":
      return <ConceptualQuestion response={response} onAnswer={onAnswer} />;
    case "coding":
      return <CodingQuestion response={response} onAnswer={onAnswer} />;
    case "output":
      return <OutputQuestion response={response} onAnswer={onAnswer} />;
    default:
      return null;
  }
}

export default function AssessmentAttemptPage() {
  const { id } = useParams();
  const assessment = useMemo(() => getAssessmentById(id), [id]);

  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({}); // { [questionId]: answer }
  const [confidence, setConfidence] = useState({}); // { [questionId]: "Low" | "Medium" | "High" }
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Elapsed-time timer — starts the moment the attempt page mounts.
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  if (!assessment) {
    return (
      <Section  className="py-24">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-bold text-[var(--color-text-h)]">
              Assessment not found
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              This assessment may have been moved or doesn't exist.
            </p>
            <Button as="a" href="/assessment" className="mt-6">
              Back to Assessments
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const questions = assessment.questions;
  const question = questions[current];
  const answeredCount = Object.keys(responses).length;

  function setAnswer(value) {
    setResponses((prev) => ({ ...prev, [question.id]: value }));
  }

  function setQuestionConfidence(level) {
    setConfidence((prev) => ({ ...prev, [question.id]: level }));
  }

  function goTo(index) {
    setCurrent(Math.max(0, Math.min(index, questions.length - 1)));
  }

  function handleSubmit() {
    setCompleted(true);
  }

  /* ---------------- Results ---------------- */
  if (completed) {
    const gradableQuestions = questions.filter((q) => GRADABLE_TYPES.includes(q.type));
    const correctCount = gradableQuestions.filter((q) =>
      isCorrect(q, responses[q.id])
    ).length;
    const scorePercent = gradableQuestions.length
      ? Math.round((correctCount / gradableQuestions.length) * 100)
      : 0;

    return (
      <Section  className="py-16">
        <Container>
          <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-3xl">
              ✓
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-5xl">
              Assessment Completed!
            </h1>

            <div className="mt-2 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label="Score" value={`${scorePercent}%`} />
              <StatBlock label="Attempted" value={`${answeredCount}/${questions.length}`} />
              <StatBlock label="Correct" value={`${correctCount}/${gradableQuestions.length}`} />
              <StatBlock label="Time Taken" value={formatTime(elapsedSeconds)} />
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              Your detailed learning analysis will appear on your Dashboard.
            </p>

            <Button as="a" href="/dashboard" size="lg" className="mt-2">
              Go to Dashboard
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  /* ---------------- Attempt UI ---------------- */
  return (
    <Section background="white" className="py-10">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main question area */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="text-sm font-medium text-[var(--color-primary-600)] disabled:opacity-30"
              >
                ← Previous
              </button>
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                Question {current + 1} of {questions.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-600)]">
                {formatType(question.type)}
              </span>
              {question.difficulty && (
                <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {question.difficulty}
                </span>
              )}
            </div>

            {question.context && (
              <p className="mt-3 rounded-lg bg-[var(--color-surface-secondary)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {question.context}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-[var(--color-text-h)] sm:text-3xl">
              {question.question}
            </h1>

            <QuestionBody
              question={question}
              response={responses[question.id]}
              onAnswer={setAnswer}
            />

            {/* Confidence level — shown once the question has a response */}
            {responses[question.id] !== undefined && responses[question.id] !== "" && (
              <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
                <p className="mb-3 text-sm font-medium text-[var(--color-text-h)]">
                  How confident are you?
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONFIDENCE_OPTIONS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setQuestionConfidence(level)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        confidence[question.id] === level
                          ? "border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
              <Button
                variant="outline"
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
              >
                Previous
              </Button>

              {current === questions.length - 1 ? (
                <Button onClick={handleSubmit}>Submit Assessment</Button>
              ) : (
                <Button onClick={() => goTo(current + 1)}>Next</Button>
              )}
            </div>
          </div>

          {/* Side panel — nav, progress, timer */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-[var(--color-border)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text-h)]">
                  Time Elapsed
                </span>
                <span className="font-mono text-sm font-semibold text-[var(--color-primary-600)]">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>Progress</span>
                  <span>
                    {answeredCount}/{questions.length}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-secondary)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary-600)] transition-all duration-300"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const answered = responses[q.id] !== undefined && responses[q.id] !== "";
                  const isCurrent = index === current;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => goTo(index)}
                      className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                        isCurrent
                          ? "bg-[var(--color-primary-600)] text-white"
                          : answered
                          ? "bg-[var(--color-primary-50)] text-[var(--color-primary-600)] border border-[var(--color-primary-100)]"
                          : "bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-4">
      <span className="text-xl font-bold text-[var(--color-text-h)]">{value}</span>
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}