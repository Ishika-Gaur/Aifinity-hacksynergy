import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Section from "../components/Section";
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import Button from "../components/Button";
import CtaBanner from "../components/CtaBanner";
import HeroSection from "../components/HeroSection";
import { mistakeMapApi, authApi } from "../services/api";
import { Link } from "react-router-dom";

const HOW_IT_WORKS = [
  {
    title: "You attempt a question",
    description:
      "Practice like normal — assessments, quizzes, or mock tests across any topic.",
  },
  {
    title: "AI finds the real reason",
    description:
      "Every wrong answer is traced back to the exact concept behind it, not just marked incorrect.",
  },
  {
    title: "It's added to your map",
    description:
      "The concept gets placed on your Mistake Map, ranked by how often it's costing you marks.",
  },
];

const FEATURES = [
  {
    eyebrow: "Root cause",
    title: "AI-Detected Patterns",
    description:
      "The AI looks past the wrong answer to the concept you actually misunderstood — so you fix the cause, not the symptom.",
  },
  {
    eyebrow: "Clustering",
    title: "Concept Clustering",
    description:
      "Related mistakes group together automatically, so five wrong answers can point to one real gap.",
  },
  {
    eyebrow: "Priority",
    title: "Ranked by Impact",
    description:
      "Your map is sorted by which concepts are costing you the most — fix what matters first.",
  },
];

const COMPARISON = [
  {
    without: "Redo entire mock tests hoping the same mistakes don't repeat",
    withMap: "See exactly which concepts to revise, ranked by impact",
  },
  {
    without: "Wrong answers just get marked incorrect, nothing more",
    withMap: "Every wrong answer traced back to the concept behind it",
  },
  {
    without: "Manually figure out if a mistake is a pattern or a one-off",
    withMap: "Patterns get clustered and flagged automatically",
  },
  {
    without: "One subject at a time, tracked separately",
    withMap: "Coding, aptitude, GK, verbal — all traced the same way",
  },
];

const CHART_COLOR_BEFORE = "#9CA3AF"; // matches --color-text-light
const CHART_COLOR_PRIMARY = "#14776e"; // matches --color-primary-600
const CHART_COLOR_ATTENTION = "#f59e0b"; // amber-500

function ProgressTooltip({ active, payload, label, topicData }) {
  if (!active || !payload || !payload.length) return null;
  const row = topicData?.find((t) => t.concept === label);
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-xs font-semibold text-[var(--color-text-h)]">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs text-[var(--color-text-muted)]">
          {p.name}: <span className="font-medium text-[var(--color-text-h)]">{p.value}</span>
        </p>
      ))}
      {row?.needsAttention && (
        <p className="mt-1 text-xs font-semibold text-amber-600">Needs attention</p>
      )}
    </div>
  );
}

function TopicRow({ topic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[var(--color-text-h)]">
          {topic.concept}
        </span>
        <span
          className={[
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            topic.needsAttention
              ? "bg-amber-100 text-amber-700"
              : "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
          ].join(" ")}
        >
          {topic.before} → {topic.after}
        </span>
      </div>

      {expanded && (
        <>
          <p className="mt-1 text-xs font-medium text-[var(--color-text-body)]">
            Mistake: {topic.mistakePattern}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {topic.needsAttention ? "Why it's repeating: " : "What improved: "}
            {topic.needsAttention ? topic.whyItHappened : topic.whatChanged}
          </p>
          {topic.needsAttention && (
            <p className="mt-1 text-xs font-semibold text-amber-600">
              ⚠ Needs attention — same mistake keeps repeating
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 text-xs font-semibold text-[var(--color-primary-600)] hover:underline"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}

export default function MistakeMapPage() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (_) {
      return null;
    }
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const res = await authApi.getMe();
      if (res && res.success && res.user) {
        setUser(res.user);
        try {
          localStorage.setItem("user", JSON.stringify(res.user));
        } catch (_) {}
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }
      const res = await mistakeMapApi.get();
      if (res.success) {
        setData(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  const hasData = data && data.hasData;
  const topicData = data?.concepts || [];

  return (
    <div className="flex min-h-screen flex-col ">
      {/* Hero */}
      <HeroSection
        variant="mistake-map"
        eyebrow="AI-Powered · Mistake Map"
        title="Every mistake,"
        highlightWord="mapped to its cause"
        description="Wrong answers don't just get marked incorrect. Our AI traces each one back to the concept behind it, so you always know exactly what to fix."
        primaryCta={{ label: "See Your Mistake Map", href: "#your-mistake-map" }}
        secondaryCta={{ label: "How It Works", href: "#how-it-works" }}
      />

      {/* How it works */}
      {/* <Section id="how-it-works">
        <SectionHeading
          title="From wrong answer to clear fix, automatically"
          subtitle="No manual tagging. The AI does the tracing so your map stays accurate on its own."
        />
        <div className="relative mt-10">
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-[var(--color-primary-100)] sm:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center gap-3 text-center"
              >
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-base font-semibold text-white ring-4 ring-[var(--color-primary-50)]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-[var(--color-text-h)]">
                  {step.title}
                </h3>
                <p className="max-w-xs text-base leading-relaxed text-[var(--color-text-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section> */}

      {/* Features */}
      {/* <Section>
        <SectionHeading
          title="Built to find the real gap, not just the wrong answer"
          subtitle="Three ways the AI keeps your map accurate and useful."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
            >
              {feature.description}
            </Card>
          ))}
        </div>
      </Section> */}

      {/* YOUR MISTAKE MAP — Personalized Section */}
      <Section id="your-mistake-map" className="border-t border-[var(--color-border)] scroll-mt-20">
        <SectionHeading
          eyebrow="YOUR MISTAKE MAP"
          title="See how your mistakes are changing across concepts and where you still need improvement"
          subtitle="Real analysis of your learning patterns based on your assessment results."
        />

        {loading ? (
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load your Mistake Map</h3>
            <p className="text-gray-600 mb-6">There was a problem fetching your personalized data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !user ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-[var(--color-primary-600)] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to see your Mistake Map</h3>
            <p className="text-gray-600 mb-6">Log in to view your personalized mistake analysis and patterns.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : !hasData ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-[var(--color-primary-600)] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Mistake Map will appear here after you complete an assessment</h3>
            <p className="text-gray-600 mb-6">Take an assessment to unlock your personalized mistake pattern analysis.</p>
            <Link
              to="/assessment"
              className="inline-block px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Summary */}
            {data.summary && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--color-text-h)] mb-4">Your Mistake Map Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-[var(--color-primary-50)] rounded-xl">
                    <div className="text-3xl font-bold text-[var(--color-primary-600)]">{data.summary.totalMistakes}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Mistakes</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div className="text-3xl font-bold text-gray-900">{data.summary.conceptsAffected}</div>
                    <div className="text-sm text-gray-600 mt-1">Concepts Affected</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600">{data.summary.improvedConcepts}</div>
                    <div className="text-sm text-gray-600 mt-1">Improved</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600">{data.summary.conceptsNeedingAttention}</div>
                    <div className="text-sm text-gray-600 mt-1">Needs Attention</div>
                  </div>
                </div>
                {data.summary.mostFrequentMistakeArea && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Most frequent mistake area: <span className="font-semibold text-[var(--color-text-h)]">{data.summary.mostFrequentMistakeArea}</span>
                  </div>
                )}
              </div>
            )}

            {/* Your Progress — real recharts bar graph, before vs now per topic */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
              {/* Chart */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-h)]">Your progress, topic by topic</h3>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart
                    data={topicData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="concept"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--color-border)" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: "Mistakes",
                        angle: -90,
                        position: "insideLeft",
                        fill: "var(--color-text-muted)",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip content={<ProgressTooltip topicData={topicData} />} cursor={{ fill: "var(--color-surface-secondary)" }} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: "var(--color-text-muted)" }}
                    />
                    <Bar dataKey="before" name="Before" fill={CHART_COLOR_BEFORE} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="after" name="Now" fill={CHART_COLOR_PRIMARY} radius={[4, 4, 0, 0]}>
                      {topicData.map((entry) => (
                        <Cell
                          key={entry.concept}
                          fill={entry.needsAttention ? CHART_COLOR_ATTENTION : CHART_COLOR_PRIMARY}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Legend for the attention flag, since recharts Cell colors aren't in the auto-legend */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary-600)]" />
                    Improved / stable
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Needs attention
                  </span>
                </div>
              </div>

              {/* Per-topic breakdown — collapsed by default, expandable per row so the column stays compact */}
              <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-6">
                <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-h)]">
                  Topic by topic — what's actually going on
                </h3>
                <div className="flex flex-col divide-y divide-[var(--color-border)]">
                  {topicData.map((topic) => (
                    <TopicRow key={topic.concept} topic={topic} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button as="a" href="/assessment" size="lg">
                Take Another Assessment
              </Button>
            </div>
          </div>
        )}
      </Section>

      {/* Without vs With — comparison, replaces the earlier subject grid above the CTA */}
      <Section>
        <SectionHeading
          title="What changes once you have a Mistake Map"
          subtitle="Same mistakes, same test results — just organized into something you can act on."
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-2">
            <div className="border-b border-r border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-text-muted)]">
              Without Mistake Map
            </div>
            <div className="border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-primary-700)]">
              With Mistake Map
            </div>
          </div>
          {COMPARISON.map((row, index) => (
            <div key={index} className="grid grid-cols-2">
              <div
                className={[
                  "flex items-start gap-2 border-r border-[var(--color-border)] px-5 py-4 text-sm leading-relaxed text-[var(--color-text-muted)]",
                  index !== COMPARISON.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : "",
                ].join(" ")}
              >
                <span className="mt-0.5 shrink-0 text-[var(--color-text-light)]">✕</span>
                {row.without}
              </div>
              <div
                className={[
                  "flex items-start gap-2 bg-[var(--color-primary-50)]/40 px-5 py-4 text-sm leading-relaxed text-[var(--color-text-body)]",
                  index !== COMPARISON.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : "",
                ].join(" ")}
              >
                <span className="mt-0.5 shrink-0 text-[var(--color-primary-600)]">✓</span>
                {row.withMap}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CtaBanner
          eyebrow="Ready to begin?"
          title="Your skill gap is waiting for you."
          subtitle="Takes less than 10 minutes. No sign-up required to see your first result."
          buttonLabel="Start Free Assessment"
          href="/assessment"
        />
      </Section>
    </div>
  );
}

/* Small helper — a row in the Mistake Map preview card */
function MistakeRow({ concept, count, tone }) {
  const toneMap = {
    high: "bg-[var(--color-primary-600)] text-white",
    mid: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    low: "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]",
  };
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
      <span className="text-sm font-medium text-[var(--color-text-h)]">
        {concept}
      </span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneMap[tone]}`}
      >
        {count}×
      </span>
    </div>
  );
}
