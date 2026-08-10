import React, { useMemo, useState } from "react";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  CATEGORIES,
  TYPE_FILTERS,
  DIFFICULTY_FILTERS,
  ASSESSMENTS,
  getUserProfile,
  getDailyAssessments,
  getRecommendedAssessments,
  formatType,
} from "../data/assessments";

const DIFFICULTY_STYLES = {
  Easy: "text-green-600 bg-green-50 border-green-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Hard: "text-red-600 bg-red-50 border-red-200",
  Mixed:
    "text-[var(--color-primary-600)] bg-[var(--color-primary-50)] border-[var(--color-primary-100)]",
};

/* One assessment, shown the same way in "Recommended" and "Explore". */
function AssessmentCard({ assessment }) {
  const questionTypes = useMemo(
    () => Array.from(new Set(assessment.questions.map((q) => q.type))),
    [assessment]
  );

  return (
    <Card
      icon={
        <span className="text-lg font-bold text-[var(--color-primary-600)]">
          {assessment.icon || "◆"}
        </span>
      }
      eyebrow={assessment.category}
      title={assessment.title}
      footer={
        <Button as="a" href={`/assessment/${assessment.id}`} size="sm" className="w-full">
          Start Assessment
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        {assessment.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full border px-2.5 py-0.5 font-semibold ${DIFFICULTY_STYLES[assessment.difficulty] || DIFFICULTY_STYLES.Mixed}`}
        >
          {assessment.difficulty}
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-medium text-[var(--color-text-muted)]">
          {assessment.questions.length} questions
        </span>
        <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-medium text-[var(--color-text-muted)]">
          ~{assessment.duration} min
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        {questionTypes.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-[var(--color-surface-secondary)] px-2 py-0.5 font-medium text-[var(--color-text-muted)]"
          >
            {formatType(t)}
          </span>
        ))}
        {questionTypes.length > 3 && (
          <span className="rounded-md bg-[var(--color-surface-secondary)] px-2 py-0.5 font-medium text-[var(--color-text-muted)]">
            +{questionTypes.length - 3}
          </span>
        )}
      </div>
    </Card>
  );
}

/* ---------------- Daily calendar (LeetCode-style) ---------------- */

/* Single day cell — number in a circle, tiny activity dot below.
   Today gets a filled circle; locked days are dimmed and inert. */
function DayCell({ daily }) {
  const isLocked = daily.status === "Locked";
  const hasActivity = !isLocked;

  const content = (
    <div className="flex flex-col items-center justify-center gap-0.5 py-0.5">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
          daily.isToday
            ? "bg-[var(--color-primary-600)] text-white"
            : isLocked
            ? "text-[var(--color-text-light)]"
            : "text-[var(--color-text-h)] hover:bg-[var(--color-surface-secondary)]"
        }`}
      >
        {daily.day}
      </span>
      <span
        className={`h-1 w-1 rounded-full ${
          !hasActivity
            ? "bg-transparent"
            : daily.status === "Completed"
            ? "bg-green-500"
            : "bg-[var(--color-primary-600)]"
        }`}
      />
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <a href={`/assessment/${daily.id}`} className="block" title={daily.title}>
      {content}
    </a>
  );
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function AssessmentPage() {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [type, setType] = useState("All");

  const profile = useMemo(() => getUserProfile(), []);
  const recommended = useMemo(() => getRecommendedAssessments(profile), [profile]);
  const dailyAssessments = useMemo(() => getDailyAssessments(profile), [profile]);

  const completedDays = dailyAssessments.filter((d) => d.status === "Completed").length;
  const todayDay = new Date().getDate();

  // Which weekday (0=Sun..6=Sat) the 1st of the current month falls on,
  // so "Day 1" lines up under the correct column instead of always
  // starting at Sunday.
  const firstWeekdayOffset = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  }, []);

  const exploreList = useMemo(() => {
    return ASSESSMENTS.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (difficulty !== "All") {
        // Exact match for single-difficulty assessments, or "contains a
        // question of this difficulty" for Mixed ones.
        const matches = a.difficulty === difficulty || a.questions.some((q) => q.difficulty === difficulty);
        if (!matches) return false;
      }
      if (type !== "All" && !a.questions.some((q) => q.type === type)) return false;
      return true;
    });
  }, [category, difficulty, type]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ---------------- HEADER ---------------- */}
      <Section background="tint" className="pt-14 pb-10">
        <Container>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-h)] sm:text-5xl">
            Assess Your Skills
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            Practice what matters for your field and discover where you can improve.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex flex-col gap-0.5 rounded-xl border border-[var(--color-primary-100)] bg-white px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-600)]">
                Career Goal
              </span>
              <span className="text-base font-semibold text-[var(--color-text-h)]">
                {profile.careerGoal}
              </span>
            </div>
            <div className="inline-flex flex-col gap-0.5 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Field
              </span>
              <span className="text-base font-semibold text-[var(--color-text-h)]">
                {profile.field}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------- RECOMMENDED FOR YOU ---------------- */}
      <Section background="white">
        <SectionHeading
          title="Recommended for You"
          subtitle={`Recommended for your ${profile.careerGoal} goal — based on your field (${profile.field}) and skills: ${profile.skills.join(", ")}.`}
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
          {recommended.length === 0 && (
            <p className="col-span-full text-center text-sm text-[var(--color-text-muted)]">
              No recommendations yet — complete onboarding to get personalized picks.
            </p>
          )}
        </div>
      </Section>

      {/* ---------------- DAILY ASSESSMENT ---------------- */}
      <Section background="tint">
        <SectionHeading
          title="Daily Assessment"
          subtitle={`A fresh ${profile.field} challenge, every day this month.`}
        />

        <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          {/* Header: streak + month label */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-[var(--color-text-h)]">
                Day {todayDay}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {completedDays}/{dailyAssessments.length} days completed
              </p>
            </div>
            <span className="rounded-full border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-primary-600)]">
              {profile.field}
            </span>
          </div>

          {/* Weekday header */}
          <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-medium text-[var(--color-text-light)]">
            {WEEKDAY_LABELS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Day grid — leading blanks align "Day 1" to its real weekday */}
          <div className="mt-2 grid grid-cols-7 gap-y-2 text-center">
            {Array.from({ length: firstWeekdayOffset }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {dailyAssessments.map((daily) => (
              <DayCell key={daily.id} daily={daily} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--color-border)] pt-3 text-[11px] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-600)]" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-light)]" /> Locked
            </span>
          </div>
        </div>
      </Section>

      {/* ---------------- EXPLORE ASSESSMENTS ---------------- */}
      <Section background="white">
        <SectionHeading
          title="Explore Assessments"
          subtitle="Browse across every field — new ones are added as you progress."
        />

        <div className="mt-8 space-y-4">
          {/* Category filter */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-light)]">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === c
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty + Type filters */}
          <div className="flex flex-wrap gap-8">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-light)]">
                Difficulty
              </span>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_FILTERS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      difficulty === d
                        ? "border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-light)]">
                Type
              </span>
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      type === t
                        ? "border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-300)]"
                    }`}
                  >
                    {t === "All" ? "All" : formatType(t)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exploreList.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
          {exploreList.length === 0 && (
            <p className="col-span-full text-center text-sm text-[var(--color-text-muted)]">
              No assessments match these filters yet.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}