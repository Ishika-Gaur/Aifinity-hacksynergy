import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import { ArrowRight } from "lucide-react";
import {
  TYPE_FILTERS,
  DIFFICULTY_FILTERS,
  getUserProfile,
  formatType,
} from "../data/assessments";
import { assessmentApi } from "../services/api";

const ITEMS_PER_PAGE = 6;

/* ---------------- Category palette (gradient tiles + Quest-style cards) ---------------- */

const CATEGORY_GRADIENTS = [
  "from-[#2563eb] to-[#4f46e5]", // blue -> indigo
  "from-[#0d9488] to-[#059669]", // teal -> emerald (brand teal)
  "from-[#9333ea] to-[#c026d3]", // purple -> fuchsia
  "from-[#d97706] to-[#ea580c]", // amber -> orange (brand amber)
  "from-[#e11d48] to-[#db2777]", // rose -> pink
  "from-[#0891b2] to-[#2563eb]", // cyan -> blue
];

const CATEGORY_ICON_STYLES = [
  "bg-blue-50 text-blue-600",
  "bg-teal-50 text-teal-600",
  "bg-purple-50 text-purple-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-cyan-50 text-cyan-600",
];

// A small rotating set of generic outline icons for category tiles.
const CATEGORY_ICON_PATHS = [
  <path key="layers" d="M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  <>
    <ellipse key="db1" cx="12" cy="6" rx="7" ry="2.5" strokeWidth="1.6" />
    <path key="db2" d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" strokeWidth="1.6" />
    <path key="db3" d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" strokeWidth="1.6" />
  </>,
  <path key="pencil" d="M4 20l1-4L16 5l3 3L8 19l-4 1z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  <>
    <circle key="tg1" cx="12" cy="12" r="8" strokeWidth="1.6" />
    <circle key="tg2" cx="12" cy="12" r="4" strokeWidth="1.6" />
    <circle key="tg3" cx="12" cy="12" r="0.6" fill="currentColor" />
  </>,
  <path key="spark" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="puzzle" d="M9 4h4v2.2a1.8 1.8 0 003.6 0V4H20v4.2a1.8 1.8 0 000 3.6V16h-4.2a1.8 1.8 0 00-3.6 0V20H8v-4.2a1.8 1.8 0 00-3.6 0H4V12h2.2a1.8 1.8 0 000-3.6H4V4h5z" strokeWidth="1.4" strokeLinejoin="round" />,
];

function getCategoryIndex(cat) {
  return Array.from(cat).reduce((hash, character) => hash + character.charCodeAt(0), 0) % CATEGORY_GRADIENTS.length;
}

/* ---------------- Left sidebar nav (LeetCode-style rail) ---------------- */

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <path d="M4 12l8-8 8 8M6 10v10h12V10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    id: "categories",
    label: "Categories",
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" strokeWidth="1.6" />
      </>
    ),
  },
  {
    id: "recommended",
    label: "Recommended",
    icon: (
      <path
        d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L12 3z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "daily",
    label: "Daily Challenge",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" strokeWidth="1.6" />
        <path d="M4 9h16M8 3v4M16 3v4" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "explore",
    label: "Explore",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
        <path d="M20 20l-3.6-3.6" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

function SidebarNav({ active, open, onToggle }) {
  return (
    <nav className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-h)]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 shrink-0">
          <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {open && <span className="text-sm font-medium">Menu</span>}
      </button>

      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            title={item.label}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
              ? "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-h)]"
              }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={`h-5 w-5 shrink-0 ${isActive ? "text-[var(--color-primary-600)]" : "text-[var(--color-text-light)] group-hover:text-[var(--color-text-h)]"}`}
            >
              {item.icon}
            </svg>
            {open && <span>{item.label}</span>}
          </a>
        );
      })}
    </nav>
  );
}

/* ---------------- Hero signature visual: one clean skill-score ring ----------------
   Deliberately minimal — a single ring is the "characteristic thing" for an
   assessment tool (a score), so it carries the whole visual instead of
   stacking a card, a question, options, a meter, and a floating pill. */
function AssessmentHeroVisual({ className = "" }) {
  const pct = 88;
  const circumference = 2 * Math.PI * 54;
  const dash = (pct / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center gap-4 rounded-2xl border border-[#2E4F42]/15 bg-[#FBF8F0] px-8 py-9 text-center shadow-[var(--shadow-card)] ${className}`}
    >
      <span className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-[0.15em] text-[#C4952A]">
        Skill Snapshot
      </span>

      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1B332C1A" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#D9A62B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-[#1B332C]">{pct}%</span>
          <span className="text-[10px] text-[#5B6B5F]">Mastery</span>
        </div>
      </div>

      <p className="max-w-[220px] text-sm text-[#24413A]">
        Your average score across completed assessments this month.
      </p>
    </div>
  );
}

/* One assessment, shown the same way in "Recommended" and "Explore".
   Gradient banner on top (colored per category, like LeetCode's Explore /
   Study Plan tiles) with a plain white footer for stats + CTA below. */
function AssessmentCard({ assessment }) {
  const questionTypes = useMemo(
    () => Array.from(new Set(assessment.questions.map((q) => q.type))),
    [assessment]
  );
  const gradient = CATEGORY_GRADIENTS[getCategoryIndex(assessment.category)];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={`relative flex aspect-[4/3] flex-col justify-between bg-gradient-to-br ${gradient} p-5 text-white`}>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
            {assessment.category}
          </span>
          <h3 className="mt-1 text-lg font-bold leading-snug">{assessment.title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${assessment.difficulty === "Easy"
              ? "bg-white/90 text-green-700"
              : assessment.difficulty === "Hard"
                ? "bg-white/90 text-red-700"
                : "bg-white/90 text-amber-700"
              }`}
          >
            {assessment.difficulty}
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-lg font-bold backdrop-blur-sm">
            {assessment.icon || "◆"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {assessment.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span>{assessment.questions.length} questions</span>
          <span>·</span>
          <span>~{assessment.duration} min</span>
          {questionTypes.slice(0, 2).map((t) => (
            <span key={t} className="rounded-md bg-[var(--color-surface-secondary)] px-2 py-0.5 font-medium">
              {formatType(t)}
            </span>
          ))}
        </div>
        <Button as={Link} to={`/assessment/${assessment.id}`} size="sm" className="mt-4 w-full">
          Start Assessment
        </Button>
      </div>
    </div>
  );
}

/* Quest-style category tile: colored icon chip + a dotted "level path" that
   communicates count, not fake progress (we don't track per-assessment
   completion, so every dot stays open/unfilled — same as LeetCode's own
   "0/35 Levels" untouched state). */
function CategoryTile({ category, count, index, onSelect }) {
  const gradient = CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];
  const iconStyle = CATEGORY_ICON_STYLES[index % CATEGORY_ICON_STYLES.length];
  const iconPath = CATEGORY_ICON_PATHS[index % CATEGORY_ICON_PATHS.length];
  const dotCount = Math.max(1, Math.min(count, 10));

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[var(--color-text-h)]">{category}</h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {count} assessment{count === 1 ? "" : "s"}
          </p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            {iconPath}
          </svg>
        </span>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {Array.from({ length: dotCount }).map((_, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="h-px flex-1 bg-[var(--color-border)]" />}
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[var(--color-border)] bg-white" />
          </React.Fragment>
        ))}
      </div>

      <a
        href="#explore"
        onClick={() => onSelect(category)}
        className={`mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${gradient} px-4 py-1.5 text-sm font-semibold text-white`}
      >
        Start
      </a>
    </div>
  );
}


export default function AssessmentPage() {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [type, setType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [loadError, setLoadError] = useState("");

  const profile = useMemo(() => getUserProfile(), []);
  useEffect(() => {
    let isMounted = true;

    assessmentApi.getPublished().then((result) => {
      if (!isMounted) return;
      if (result.success) setAssessments(result.assessments);
      else setLoadError(result.error || "Assessments could not be loaded.");
    });

    return () => {
      isMounted = false;
    };
  }, []);
  const categories = useMemo(() => ["All", ...new Set(assessments.map((assessment) => assessment.category))], [assessments]);
  const recommended = useMemo(() => {
    const fieldMatches = assessments.filter((assessment) => assessment.field === profile.field);
    return (fieldMatches.length ? fieldMatches : assessments).slice(0, 6);
  }, [assessments, profile]);
  const dailyAssessments = useMemo(() => assessments.map((assessment, index) => ({
    ...assessment,
    day: index + 1,
    isToday: index === 0,
    status: "Available",
  })), [assessments]);

  const completedDays = dailyAssessments.filter((d) => d.status === "Completed").length;
  const todayDay = new Date().getDate();

  // Today's featured challenge + a Mon–Sun strip for the week it falls in,
  // so the Daily Assessment section has real content of its own instead of
  // just pointing at the calendar in the sidebar.
  const todayAssessment = useMemo(
    () => dailyAssessments.find((d) => d.isToday),
    [dailyAssessments]
  );

  // Generate actual calendar for current month
  const monthlyCalendar = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const today = now.getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const calendar = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push({ day: null, isPadding: true, isToday: false, status: "Locked" });
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today;
      // For now, mark days as Available (this could be enhanced with real assessment data)
      calendar.push({
        day,
        isPadding: false,
        isToday,
        status: isToday ? "Available" : day < today ? "Locked" : "Available"
      });
    }

    return calendar;
  }, []);

  const weekDays = monthlyCalendar;

  const exploreList = useMemo(() => {
    return assessments.filter((a) => {
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
  }, [assessments, category, difficulty, type]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, difficulty, type]);

  // Paginated explore list
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return exploreList.slice(start, end);
  }, [exploreList, currentPage]);

  const totalPages = Math.ceil(exploreList.length / ITEMS_PER_PAGE);

  // Scroll-spy: highlight the sidebar nav item for the section in view.
  useEffect(() => {
    const sectionEls = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveSection(top.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: "#F5F1E7",
        backgroundImage:
          "linear-gradient(rgba(90,74,58,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(90,74,58,0.14) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 pb-16 lg:px-8">
        {/* ---------------- LEFT SIDEBAR ---------------- */}
        <aside
          className={`sticky top-20 hidden h-fit shrink-0 self-start pt-14 transition-all duration-200 md:block ${sidebarOpen ? "w-44" : "w-12"
            }`}
        >
          <SidebarNav active={activeSection} open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div className="min-w-0 flex-1">
          {/* HEADER / HERO SECTION — two-column: pitch + live diagnostic preview */}
          <Section id="overview" className="scroll-mt-24 pt-8 pb-8 sm:pt-12 sm:pb-10">
            <div className="relative overflow-hidden rounded-3xl border border-[#2E4F42]/15 bg-[#FBF8F0] p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-card)] transition-all duration-300">
              {/* Decorative top gold accent bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D9A62B] via-[#E8C547] to-[#1B332C]" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Eyebrow, Heading, Description, CTA, Pillars & Context Cards */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* Eyebrow badge */}
                  <span className="font-['Space_Mono'] text-xs font-bold uppercase tracking-[0.15em] text-[#C4952A] w-fit">
                    Skill Assessment Center
                  </span>

                  {/* Main Heading */}
                  <div>
                    <h1 className="font-['Kalam'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B332C] leading-[1.15]">
                      Test Your Skills. <br className="hidden sm:inline" />
                      <span className="text-[#C4952A]">Discover Your Strengths.</span>
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-[#24413A] leading-relaxed max-w-xl font-normal">
                      Take personalized assessments to measure your knowledge, identify skill gaps, and understand where you can improve.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-1">
                    <Button
                      as="a"
                      href="#recommended"
                      size="md"
                      className="inline-flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                      <span>Start Assessment</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Career Goal & Field — dynamic from profile, neutral fallback */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-[#2E4F42]/10 pt-4 text-sm">
                    <span className="text-[#5B6B5F]">
                      Career Goal <span className="ml-1.5 font-semibold text-[#1B332C]">{profile.careerGoal || "Not set"}</span>
                    </span>
                    <span className="text-[#5B6B5F]">
                      Field <span className="ml-1.5 font-semibold text-[#1B332C]">{profile.field || "Not set"}</span>
                    </span>
                  </div>
                </div>

                {/* Right Column: Assessment Diagnostic Preview Visual */}
                <div className="lg:col-span-5 w-full">
                  <AssessmentHeroVisual />
                </div>
              </div>
            </div>
          </Section>

          {/* PRACTICE BY CATEGORY — Quest-style tiles */}
          <Section id="categories" className="scroll-mt-24">
            <SectionHeading
              title="Practice by Category"
              subtitle="Pick a track and work through it at your own pace."
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {categories.filter((c) => c !== "All").map((c, i) => {
                const count = assessments.filter((a) => a.category === c).length;
                return (
                  <CategoryTile
                    key={c}
                    category={c}
                    count={count}
                    index={i}
                    onSelect={setCategory}
                  />
                );
              })}
            </div>
          </Section>

          {/* MOBILE-ONLY: streak card sits inline since the right rail is hidden below xl */}
          <div className="mb-10 xl:hidden">
            <Calendar
              profile={profile}
              dailyAssessments={dailyAssessments}
              completedDays={completedDays}
            />
          </div>

          {loadError && (
            <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {loadError}
            </div>
          )}

          {/* RECOMMENDED FOR YOU */}
          <Section id="recommended" className="scroll-mt-24">
            <SectionHeading
              title="Recommended for You"
              subtitle={`Recommended for your ${profile.careerGoal || "goal"} — based on your field (${profile.field || "Not set"}) and skills: ${profile.skills.join(", ")}.`}
            />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

          {/* DAILY ASSESSMENT */}
          <Section id="daily" className="scroll-mt-24">
            <SectionHeading
              title="Daily Assessment"
              subtitle={`A fresh ${profile.field || "skill"} challenge, every day this month.`}
            />

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Today's challenge */}
              {todayAssessment ? (
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-600)] to-[#d97706] p-6 text-white shadow-sm">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                    Day {todayDay} · {profile.field || "Not set"}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold leading-snug">{todayAssessment.title}</h3>
                  <p className="mt-2 max-w-md text-sm text-white/80">
                    Keep your streak alive — finish today's challenge before it locks tomorrow.
                  </p>
                  <Button
                    as={Link}
                    to={`/assessment/${todayAssessment.id}`}
                    size="sm"
                    className="mt-6 !bg-white !text-[var(--color-text-h)] hover:!bg-white/90"
                  >
                    Start Today's Challenge
                  </Button>
                </div>
              ) : (
                <div className="flex items-center rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-sm text-[var(--color-text-muted)]">
                  No challenge is scheduled for today — check back tomorrow.
                </div>
              )}

              {/* This month */}
              <div className="rounded-2xl border border-[var(--color-border)] p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-light)]">
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <div className="mt-4">
                  <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <span key={day} className="text-xs font-semibold text-[var(--color-text-light)]">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {weekDays.map((d, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${d.isPadding
                            ? "invisible"
                            : d.isToday
                              ? "bg-[var(--color-primary-600)] text-white"
                              : d.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : d.status === "Locked"
                                  ? "text-[var(--color-text-light)]"
                                  : "text-[var(--color-text-h)]"
                            }`}
                        >
                          {d.day}
                        </span>
                        {!d.isPadding && (
                          <span
                            className={`h-1 w-1 rounded-full ${d.status === "Completed" ? "bg-green-500" : d.status === "Locked" ? "bg-transparent" : "bg-[var(--color-primary-600)]"
                              }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* EXPLORE ASSESSMENTS */}
          <Section id="explore" className="scroll-mt-24">
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
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${category === c
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
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${difficulty === d
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
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${type === t
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

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedList.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
              {paginatedList.length === 0 && (
                <p className="col-span-full text-center text-sm text-[var(--color-text-muted)]">
                  No assessments match these filters yet.
                </p>
              )}
            </div>

            {/* Pagination - Load More button */}
            {totalPages > 1 && currentPage < totalPages && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  variant="outline"
                  size="md"
                >
                  Load More Assessments ({currentPage} of {totalPages})
                </Button>
              </div>
            )}

            {currentPage === totalPages && exploreList.length > 0 && (
              <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
                Showing all {exploreList.length} assessments
              </p>
            )}
          </Section>
        </div>

        {/* ---------------- RIGHT SIDEBAR (streak calendar) ---------------- */}
        <aside className="sticky top-20 hidden h-fit w-64 shrink-0 self-start pt-14 xl:block">
          <Calendar
            profile={profile}
            dailyAssessments={dailyAssessments}
            completedDays={completedDays}
          />
        </aside>
      </div>
    </div>
  );
}
