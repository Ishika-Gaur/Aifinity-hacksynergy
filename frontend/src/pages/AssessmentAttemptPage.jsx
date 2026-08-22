import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Section from "../components/Section";
import Container from "../components/Container";
import Button from "../components/Button";
import { formatType } from "../data/assessments";
import {
  createAttemptSession,
  submitAttemptSession,
  getNormalizedQuestionType,
} from "../services/assessmentService";

const CONFIDENCE_OPTIONS = ["Low Confidence", "Medium Confidence", "High Confidence"];
const MAX_VIOLATIONS = 3;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------------- Dedicated Question Input Renderers ---------------- */

function McqQuestion({ question, response, onAnswer }) {
  const options = question.options || [];

  return (
    <div className="mt-6 flex flex-col gap-3">
      {options.map((option, index) => {
        const isSelected = response === index || response === option;
        return (
          <label
            key={index}
            onClick={() => onAnswer(index)}
            className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left cursor-pointer transition-all ${
              isSelected
                ? "border-[#1B332C] bg-[#1B332C]/5 text-[#1B332C] font-semibold ring-2 ring-[#1B332C]/20 shadow-sm"
                : "border-gray-200 bg-white hover:border-[#1B332C]/40 text-gray-800"
            }`}
          >
            <input
              type="radio"
              name={`q_${question.id}`}
              checked={isSelected}
              onChange={() => onAnswer(index)}
              className="h-4 w-4 accent-[#1B332C] cursor-pointer"
            />
            <span className="text-sm leading-relaxed">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function TrueFalseQuestion({ question, response, onAnswer }) {
  const options = ["True", "False"];

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt) => {
        const isSelected =
          String(response).toLowerCase() === opt.toLowerCase() ||
          (response === 0 && opt === "True") ||
          (response === 1 && opt === "False");

        return (
          <label
            key={opt}
            onClick={() => onAnswer(opt)}
            className={`flex items-center gap-3.5 rounded-2xl border px-5 py-4 cursor-pointer transition-all ${
              isSelected
                ? "border-[#1B332C] bg-[#1B332C]/5 text-[#1B332C] font-bold ring-2 ring-[#1B332C]/20 shadow-sm"
                : "border-gray-200 bg-white hover:border-[#1B332C]/40 text-gray-800"
            }`}
          >
            <input
              type="radio"
              name={`q_${question.id}`}
              checked={isSelected}
              onChange={() => onAnswer(opt)}
              className="h-4 w-4 accent-[#1B332C] cursor-pointer"
            />
            <span className="text-base font-semibold">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function ShortAnswerQuestion({ response, onAnswer }) {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
        Your Short Answer
      </label>
      <input
        type="text"
        value={response || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Type your concise answer here..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#1B332C] placeholder:text-gray-400 focus:border-[#1B332C] focus:outline-none focus:ring-2 focus:ring-[#1B332C]/10"
      />
    </div>
  );
}

function LongAnswerQuestion({ response, onAnswer }) {
  const value = response || "";
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
          Detailed Explanation / Code Solution
        </label>
        <span className="text-xs text-gray-500 font-mono">{wordCount} word{wordCount === 1 ? "" : "s"}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onAnswer(e.target.value)}
        rows={8}
        placeholder="Provide your detailed explanation, reasoning, or code solution here..."
        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-[#1B332C] placeholder:text-gray-400 focus:border-[#1B332C] focus:outline-none focus:ring-2 focus:ring-[#1B332C]/10 font-sans"
      />
    </div>
  );
}

function QuestionBody({ question, response, onAnswer }) {
  const normType = getNormalizedQuestionType(question);

  switch (normType) {
    case "mcq":
      return <McqQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "true_false":
      return <TrueFalseQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "short_answer":
      return <ShortAnswerQuestion question={question} response={response} onAnswer={onAnswer} />;
    case "long_answer":
      return <LongAnswerQuestion question={question} response={response} onAnswer={onAnswer} />;
    default:
      return <ShortAnswerQuestion question={question} response={response} onAnswer={onAnswer} />;
  }
}

export default function AssessmentAttemptPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);

  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({});
  const [confidence, setConfidence] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Security & Anti-Cheat States
  const [violations, setViolations] = useState([]);
  const [isBlurred, setIsBlurred] = useState(false);
  const [securityWarning, setSecurityWarning] = useState("");

  // Submitting / Result States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);

  const attemptContainerRef = useRef(null);

  // Initialize fresh, randomized attempt session
  const initAttempt = useCallback(async () => {
    setLoadingAssessment(true);
    setCompleted(false);
    setResultData(null);
    setResponses({});
    setConfidence({});
    setElapsedSeconds(0);
    setViolations([]);
    setCurrent(0);

    const res = await createAttemptSession(id);
    if (res.success) {
      setAssessment(res.assessment);
      setAttemptId(res.attemptId);
    } else {
      setAssessment(null);
    }
    setLoadingAssessment(false);
  }, [id]);

  useEffect(() => {
    initAttempt();
  }, [initAttempt]);

  // Timer
  useEffect(() => {
    if (completed || loadingAssessment || !assessment) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [completed, loadingAssessment, assessment]);

  const handleFinalSubmitRef = useRef(null);

  // Submit assessment and evaluate answers securely on backend
  const handleFinalSubmit = useCallback(
    async (overrideViolations) => {
      if (isSubmitting || completed) return;
      setIsSubmitting(true);

      const activeViolations = overrideViolations || violations;
      const result = await submitAttemptSession(
        id,
        attemptId,
        responses,
        elapsedSeconds,
        activeViolations
      );

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setResultData(result);
      setCompleted(true);
      setIsSubmitting(false);
    },
    [isSubmitting, completed, violations, id, attemptId, responses, elapsedSeconds]
  );

  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit;
  }, [handleFinalSubmit]);

  // Helper to record a security violation
  const addViolation = useCallback(
    (reason) => {
      if (completed) return;
      const newRecord = { timestamp: new Date().toLocaleTimeString(), reason };

      setViolations((prev) => {
        const nextViolations = [...prev, newRecord];
        const count = nextViolations.length;

        setSecurityWarning(
          `⚠️ Security Notice (${count}/${MAX_VIOLATIONS}): ${reason}`
        );

        if (count >= MAX_VIOLATIONS) {
          setTimeout(() => {
            if (handleFinalSubmitRef.current) {
              handleFinalSubmitRef.current(nextViolations);
            }
          }, 300);
        }
        return nextViolations;
      });
    },
    [completed]
  );

  // Anti-cheat event listeners
  useEffect(() => {
    if (completed || loadingAssessment || !assessment) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
        addViolation("Tab switched / hidden window detected");
      }
    };

    const handleWindowBlur = () => {
      setIsBlurred(true);
      addViolation("Window lost focus");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addViolation("Exited fullscreen mode");
      }
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "PrintScreen" ||
        ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(e.key.toLowerCase())) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        addViolation(`Attempted restricted key action (${e.key})`);
      }
    };

    const handleCopyCut = (e) => {
      e.preventDefault();
      addViolation("Text copy/cut action detected");
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation("Right-click context menu action detected");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [completed, loadingAssessment, assessment, addViolation]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (loadingAssessment) {
    return (
      <Section className="py-24 bg-[#FBF8F0] min-h-screen">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1B332C]/10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1B332C] border-t-transparent"></div>
            </div>
            <p className="font-medium text-[var(--color-text-muted)]">
              Generating fresh randomized assessment attempt...
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!assessment) {
    return (
      <Section className="py-24 bg-[#FBF8F0] min-h-screen">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-bold text-[#1B332C]">Assessment not found</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              This assessment may have been moved or doesn't exist.
            </p>
            <Button as={Link} to="/assessment" className="mt-6">
              Back to Assessments
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const questions = assessment.questions || [];
  const question = questions[current] || {};
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

  /* ---------------- DETAILED RESULTS VIEW ---------------- */
  if (completed && resultData) {
    const {
      scorePercent,
      percentage,
      totalScore,
      maxScore,
      correctCount,
      totalQuestions,
      questionResults = [],
      autoSubmitted,
    } = resultData;

    const displayPercentage = percentage !== undefined ? percentage : scorePercent;

    return (
      <Section className="py-16 bg-[#FBF8F0] min-h-screen">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-md ${
                autoSubmitted
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {autoSubmitted ? "⚠️" : "✓"}
            </span>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1B332C] sm:text-4xl">
                {autoSubmitted ? "Assessment Auto-Submitted" : "Assessment Completed!"}
              </h1>
              {autoSubmitted && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block">
                  Auto-Submitted due to 3 Security Violations
                </p>
              )}
            </div>

            {/* Overall Telemetry Cards */}
            <div className="mt-2 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label="Overall Score" value={`${displayPercentage}%`} />
              <StatBlock label="Total Marks" value={`${totalScore}/${maxScore || (totalQuestions * 10)}`} />
              <StatBlock label="Correct / Partial" value={`${correctCount}/${totalQuestions || questions.length}`} />
              <StatBlock label="Time Taken" value={formatTime(elapsedSeconds)} />
            </div>

            {/* Security Violation Log */}
            {violations.length > 0 && (
              <div className="w-full text-left rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                  Security Log ({violations.length} Warning{violations.length > 1 ? "s" : ""})
                </p>
                <ul className="space-y-1 text-xs text-amber-900">
                  {violations.map((v, i) => (
                    <li key={i} className="flex justify-between border-b border-amber-200/50 pb-1">
                      <span>• {v.reason}</span>
                      <span className="font-mono text-amber-700">{v.timestamp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Question-by-Question Evaluation Breakdown */}
            {questionResults.length > 0 && (
              <div className="w-full text-left mt-4 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[#1B332C]">
                  Traceable Evaluation Breakdown
                </h2>
                <div className="flex flex-col gap-3">
                  {questionResults.map((item, idx) => {
                    let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                    let statusLabel = "Correct";
                    if (item.status === "unanswered") {
                      statusBadge = "bg-gray-100 text-gray-700 border-gray-200";
                      statusLabel = "Unanswered";
                    } else if (item.status === "partial") {
                      statusBadge = "bg-amber-100 text-amber-800 border-amber-200";
                      statusLabel = "Partial Credit";
                    } else if (item.status === "incorrect") {
                      statusBadge = "bg-rose-100 text-rose-800 border-rose-200";
                      statusLabel = "Incorrect";
                    }

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
                            Q{idx + 1} • {formatType(item.type)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                              {statusLabel}
                            </span>
                            <span className="text-xs font-bold text-[#1B332C]">
                              {item.marksAwarded}/{item.maxMarks} marks
                            </span>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#1B332C]">
                          {item.questionText}
                        </p>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-500 block mb-0.5">Your Response:</span>
                            <span className="text-slate-800 font-medium">
                              {item.userAnswer || <em className="text-gray-400">Unanswered</em>}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 block mb-0.5">Expected Target:</span>
                            <span className="text-slate-800 font-medium">{item.correctAnswer}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 italic mt-1">
                          💡 <strong>Evaluation:</strong> {item.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 w-full mt-4">
              <Button onClick={initAttempt} variant="outline" size="md">
                🔄 Start Fresh Attempt
              </Button>
              <Button as={Link} to="/roadmap" size="md">
                View Personalized Roadmap →
              </Button>
              <Button as={Link} to="/dashboard" variant="subtle" size="md">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  /* ---------------- ATTEMPT VIEW ---------------- */

  return (
    <div
      ref={attemptContainerRef}
      className="relative min-h-screen bg-white select-none"
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* SCREEN BLUR / FOCUS LOST SHIELD */}
      {isBlurred && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1B332C]/95 backdrop-blur-md p-6 text-center text-white">
          <div className="rounded-2xl border border-[#D9A62B]/40 bg-[#1B332C] p-8 shadow-2xl max-w-md">
            <span className="text-4xl">⚠️</span>
            <h2 className="mt-4 text-2xl font-bold text-[#E8C547]">Assessment Content Protected</h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Window focus lost or tab switched. Assessment content is hidden for security deterrence.
            </p>
            <p className="mt-4 text-xs font-mono text-[#D9A62B]">
              Return to window and click Resume Assessment.
            </p>
            <Button
              onClick={() => setIsBlurred(false)}
              className="mt-6 w-full shadow-lg"
            >
              Resume Assessment
            </Button>
          </div>
        </div>
      )}

      {/* TOP SECURITY BAR */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-900/10 bg-[#1B332C] px-6 py-3 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-700/50">
            🔒 Anti-Cheat Active
          </span>
          {securityWarning && (
            <span className="hidden text-xs font-semibold text-amber-300 sm:inline">
              {securityWarning}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="rounded-md bg-white/10 px-2.5 py-1 text-slate-200">
            Warnings: <strong className="text-amber-300">{violations.length}/{MAX_VIOLATIONS}</strong>
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-md border border-white/20 px-2.5 py-1 text-slate-200 hover:bg-white/10 transition"
          >
            Fullscreen Toggle
          </button>
        </div>
      </div>

      <Section className="py-10">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* MAIN QUESTION DISPLAY AREA */}
            <main className="lg:col-span-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#1B332C]/10 px-2.5 py-1 text-xs font-bold text-[#1B332C] uppercase font-mono">
                      Question {current + 1} of {questions.length}
                    </span>
                    <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {formatType(question.type)}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-600">
                    ⏱️ Elapsed: {formatTime(elapsedSeconds)}
                  </div>
                </div>

                <h2 className="mt-6 text-xl font-bold leading-snug text-[#1B332C]">
                  {question.question}
                </h2>

                {question.context && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed font-mono">
                    {question.context}
                  </div>
                )}

                {/* DEDICATED INPUT UI FOR QUESTION TYPE */}
                <QuestionBody
                  question={question}
                  response={responses[question.id]}
                  onAnswer={setAnswer}
                />

                {/* CONFIDENCE RATING */}
                <div className="mt-8 border-t border-gray-100 pt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono block mb-2">
                    Self-Assessed Confidence Level:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CONFIDENCE_OPTIONS.map((levelOption) => (
                      <button
                        key={levelOption}
                        type="button"
                        onClick={() => setQuestionConfidence(levelOption)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          confidence[question.id] === levelOption
                            ? "border-[#1B332C] bg-[#1B332C] text-white shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {levelOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PREV / NEXT / SUBMIT STEP NAVIGATION */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                  <Button
                    variant="outline"
                    onClick={() => goTo(current - 1)}
                    disabled={current === 0}
                  >
                    ← Previous
                  </Button>

                  {current < questions.length - 1 ? (
                    <Button onClick={() => goTo(current + 1)}>
                      Next Question →
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleFinalSubmit()}
                      disabled={isSubmitting}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
                    >
                      {isSubmitting ? "Evaluating..." : "Submit Assessment ✓"}
                    </Button>
                  )}
                </div>
              </div>
            </main>

            {/* SIDEBAR NAVIGATION PALETTE */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B332C] font-mono mb-2">
                  Question Palette
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {answeredCount} of {questions.length} questions answered
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    const answered = responses[q.id] !== undefined && responses[q.id] !== "";
                    const isCurrent = index === current;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => goTo(index)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-[#1B332C] text-white ring-2 ring-[#1B332C]/30 shadow-sm"
                            : answered
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-[11px] text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">🔒 Security Rules</p>
                  <p>• Do not switch tabs or minimize window.</p>
                  <p>• Copying, screenshot shortcuts, & right click are disabled.</p>
                  <p>• 3 violations trigger auto-submission.</p>
                </div>

                <Button
                  onClick={() => handleFinalSubmit()}
                  disabled={isSubmitting}
                  className="mt-6 w-full shadow-md"
                >
                  {isSubmitting ? "Evaluating..." : "Submit All Answers"}
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className="text-2xl font-bold text-[#1B332C]">{value}</span>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}
