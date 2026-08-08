import React, { useState } from "react";
import Button from "./Button";
import {
  NORMAL_ANSWER_PRESETS,
  CODE_SUBMISSION_PRESETS,
  analyzeSubmission,
} from "../data/conceptRootMockData";

export default function ConceptRootDemo({ className = "" }) {
  const [mode, setMode] = useState("normal"); // 'normal' | 'code'

  // Normal answer state
  const [normalPresetId, setNormalPresetId] = useState("binary-search");
  const [questionText, setQuestionText] = useState(
    NORMAL_ANSWER_PRESETS[0].question
  );
  const [userAnswerText, setUserAnswerText] = useState(
    NORMAL_ANSWER_PRESETS[0].userAnswer
  );

  // Code submission state
  const [codePresetId, setCodePresetId] = useState("array-max");
  const [codeText, setCodeText] = useState(CODE_SUBMISSION_PRESETS[0].code);

  // Interactive flow state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(NORMAL_ANSWER_PRESETS[0].analysis);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  // Switch modes
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setIsLoading(false);
    if (newMode === "normal") {
      const preset =
        NORMAL_ANSWER_PRESETS.find((p) => p.id === normalPresetId) ||
        NORMAL_ANSWER_PRESETS[0];
      setQuestionText(preset.question);
      setUserAnswerText(preset.userAnswer);
      setResult(preset.analysis);
    } else {
      const preset =
        CODE_SUBMISSION_PRESETS.find((p) => p.id === codePresetId) ||
        CODE_SUBMISSION_PRESETS[0];
      setCodeText(preset.code);
      setResult(preset.analysis);
    }
    setHasAnalyzed(true);
  };

  // Select Normal Answer Preset
  const handleSelectNormalPreset = (preset) => {
    setNormalPresetId(preset.id);
    setQuestionText(preset.question);
    setUserAnswerText(preset.userAnswer);
    setResult(preset.analysis);
    setHasAnalyzed(true);
  };

  // Select Code Preset
  const handleSelectCodePreset = (preset) => {
    setCodePresetId(preset.id);
    setCodeText(preset.code);
    setResult(preset.analysis);
    setHasAnalyzed(true);
  };

  // Run mock analysis
  const handleRunAnalysis = () => {
    setIsLoading(true);
    setHasAnalyzed(false);

    setTimeout(() => {
      let res;
      if (mode === "normal") {
        res = analyzeSubmission("normal", {
          question: questionText,
          userAnswer: userAnswerText,
        });
      } else {
        res = analyzeSubmission("code", {
          code: codeText,
        });
      }
      setResult(res);
      setIsLoading(false);
      setHasAnalyzed(true);
    }, 600);
  };

  // Reset form
  const handleReset = () => {
    setHasAnalyzed(false);
    setIsLoading(false);
    if (mode === "normal") {
      const preset = NORMAL_ANSWER_PRESETS[0];
      setNormalPresetId(preset.id);
      setQuestionText(preset.question);
      setUserAnswerText(preset.userAnswer);
    } else {
      const preset = CODE_SUBMISSION_PRESETS[0];
      setCodePresetId(preset.id);
      setCodeText(preset.code);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card-hover)] overflow-hidden ${className}`}
    >
      {/* Card Header & Mode Switcher */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-primary-50)]/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
              Interactive Demo
            </span>
            <h3 className="mt-2 text-xl font-bold text-[var(--color-text-h)]">
              Test ConceptRoot Analysis
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Select a submission type below to analyze root causes and missing prerequisites.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center rounded-xl bg-white p-1.5 border border-[var(--color-border)] shadow-sm shrink-0">
            <button
              type="button"
              onClick={() => handleModeSwitch("normal")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "normal"
                  ? "bg-[var(--color-primary-600)] text-white shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-h)]"
              }`}
            >
              Normal Answer
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("code")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "code"
                  ? "bg-[var(--color-primary-600)] text-white shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-h)]"
              }`}
            >
              Code Submission
            </button>
          </div>
        </div>

        {/* Preset Selector Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            Sample Presets:
          </span>
          {mode === "normal"
            ? NORMAL_ANSWER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectNormalPreset(preset)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
                    normalPresetId === preset.id
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                  }`}
                >
                  {preset.title}
                </button>
              ))
            : CODE_SUBMISSION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectCodePreset(preset)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
                    codePresetId === preset.id
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
        </div>
      </div>

      {/* Main Interactive Body */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form Column */}
          <div className="flex flex-col justify-between space-y-6">
            {mode === "normal" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Question
                  </label>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-50)]/40 p-4 text-sm font-medium text-[var(--color-text-h)]">
                    {questionText}
                  </div>
                </div>

                <div>
                  <label htmlFor="user-answer-input" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Student Answer
                  </label>
                  <input
                    id="user-answer-input"
                    type="text"
                    value={userAnswerText}
                    onChange={(e) => setUserAnswerText(e.target.value)}
                    placeholder="Enter student answer..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white p-3.5 text-sm font-medium text-[var(--color-text-h)] placeholder-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="code-textarea" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Submitted JavaScript Code
                    </label>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">
                      solution.js
                    </span>
                  </div>
                  <div className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-navy)] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-4 py-2 text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 inline-block" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block" />
                      </div>
                      <span>JS Function</span>
                    </div>
                    <textarea
                      id="code-textarea"
                      value={codeText}
                      onChange={(e) => setCodeText(e.target.value)}
                      rows={9}
                      className="w-full bg-transparent p-4 font-mono text-sm leading-relaxed text-emerald-400 focus:outline-none resize-none"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleRunAnalysis}
                disabled={isLoading}
                size="md"
                className="flex-1"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Concept...
                  </span>
                ) : mode === "normal" ? (
                  "Analyze Submission"
                ) : (
                  "Analyze Code"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                size="md"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Analysis Output Column */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                ConceptRoot Analysis Output
              </h4>
              <span className="text-xs font-mono text-[var(--color-primary-600)]">
                {isLoading ? "Analyzing..." : "Real-time Breakdown"}
              </span>
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-primary-200)] bg-[var(--color-primary-50)]/30 p-8 text-center space-y-4">
                <div className="h-10 w-10 rounded-full border-2 border-[var(--color-primary-600)] border-t-transparent animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-h)]">
                    Analyzing submission mechanics...
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Identifying root cause, missing prerequisite, and targeted learning path.
                  </p>
                </div>
              </div>
            ) : hasAnalyzed && result ? (
              <div className="flex-1 flex flex-col justify-between space-y-5 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                {/* Result Status Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Submission Status:
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                        result.statusType === "error"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      ✕ {result.status}
                    </span>
                  </div>
                </div>

                {/* Key Insights Grid */}
                <div className="space-y-4 text-sm">
                  {/* Issue */}
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-muted)] block uppercase tracking-wider mb-1">
                      Detected Issue
                    </span>
                    <p className="font-medium text-[var(--color-text-h)] bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                      {result.detectedIssue}
                    </p>
                  </div>

                  {/* Root Concept & Prerequisite Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-700)] block mb-1">
                        Root Concept
                      </span>
                      <p className="text-xs font-semibold text-[var(--color-primary-900)]">
                        {result.rootConcept}
                      </p>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                        Missing Prerequisite
                      </span>
                      <p className="text-xs font-semibold text-indigo-900">
                        {result.missingPrerequisite}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-muted)] block uppercase tracking-wider mb-1">
                      Why It Happened (Explanation)
                    </span>
                    <p className="text-xs leading-relaxed text-[var(--color-text-body)]">
                      {result.explanation}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 font-bold text-[var(--color-primary-600)]">
                        👉 Recommended Study:
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        {result.recommendedNext}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 font-bold text-[var(--color-primary-600)]">
                        🎯 Practice Focus:
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        {result.recommendedPractice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-muted)]">
                Click "Analyze Submission" or "Analyze Code" above to run the ConceptRoot diagnostic.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
