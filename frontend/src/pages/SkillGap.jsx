import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import CtaBanner from "../components/CtaBanner";

/* =========================================================
   DOMAIN DATA
========================================================= */

const DOMAINS = [
  {
    id: "technology",
    label: "Technology",
    icon: "⌘",
    examples: "Programming, AI, Web Development",
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: "∑",
    examples: "Algebra, Calculus, Statistics",
  },
  {
    id: "science",
    label: "Science",
    icon: "⚛",
    examples: "Physics, Chemistry, Biology",
  },
  {
    id: "business",
    label: "Business",
    icon: "◫",
    examples: "Strategy, Management, Marketing",
  },
  {
    id: "finance",
    label: "Finance",
    icon: "₹",
    examples: "Investing, Accounting, Economics",
  },
  {
    id: "communication",
    label: "Communication",
    icon: "Aa",
    examples: "Writing, Speaking, Presentation",
  },
  {
    id: "design",
    label: "Design",
    icon: "◇",
    examples: "UI/UX, Visual Design, Creativity",
  },
  {
    id: "other",
    label: "Other",
    icon: "＋",
    examples: "Any subject or professional skill",
  },
];

const GOALS = [
  {
    id: "software",
    title: "Software Engineer",
    category: "Technology",
    requiredSkills: [
      "Problem Solving",
      "Programming",
      "Data Structures",
      "System Design",
    ],
  },
  {
    id: "data",
    title: "Data Scientist",
    category: "Technology",
    requiredSkills: [
      "Statistics",
      "Python",
      "Data Analysis",
      "Machine Learning",
    ],
  },
  {
    id: "manager",
    title: "Business Manager",
    category: "Business",
    requiredSkills: [
      "Decision Making",
      "Communication",
      "Leadership",
      "Business Strategy",
    ],
  },
  {
    id: "finance",
    title: "Financial Analyst",
    category: "Finance",
    requiredSkills: [
      "Financial Analysis",
      "Statistics",
      "Decision Making",
      "Communication",
    ],
  },
  {
    id: "designer",
    title: "UI/UX Designer",
    category: "Design",
    requiredSkills: [
      "Visual Design",
      "User Research",
      "Problem Solving",
      "Communication",
    ],
  },
  {
    id: "research",
    title: "Researcher",
    category: "Science",
    requiredSkills: [
      "Critical Thinking",
      "Research",
      "Analysis",
      "Communication",
    ],
  },
];

/* =========================================================
   MOCK AI ANALYSIS
   This will later be replaced by the backend API.
========================================================= */

function generateAnalysis(question, answer, domain, goal) {
  const text = `${question} ${answer}`.toLowerCase();

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  let baseScore = 58;

  if (wordCount >= 30) baseScore += 8;
  if (wordCount >= 60) baseScore += 7;
  if (answer.includes("=")) baseScore += 4;
  if (text.includes("because")) baseScore += 4;
  if (text.includes("therefore")) baseScore += 3;
  if (text.includes("example")) baseScore += 3;
  if (text.includes("however")) baseScore += 2;

  const score = Math.min(baseScore, 91);

  const strengthsByDomain = {
    technology: [
      "Problem decomposition",
      "Technical reasoning",
      "Logical thinking",
    ],
    mathematics: [
      "Analytical reasoning",
      "Pattern recognition",
      "Quantitative thinking",
    ],
    science: [
      "Conceptual understanding",
      "Scientific reasoning",
      "Cause-effect analysis",
    ],
    business: [
      "Decision reasoning",
      "Strategic thinking",
      "Business awareness",
    ],
    finance: [
      "Quantitative reasoning",
      "Risk awareness",
      "Decision making",
    ],
    communication: [
      "Expression",
      "Clarity of thought",
      "Structured communication",
    ],
    design: [
      "Creative reasoning",
      "User perspective",
      "Visual thinking",
    ],
    other: [
      "Reasoning",
      "Conceptual understanding",
      "Problem solving",
    ],
  };

  const gapsByDomain = {
    technology: [
      {
        name: "Advanced Problem Solving",
        current: 64,
        target: 85,
        priority: "High",
        description:
          "Your reasoning is developing, but complex problems require more structured decomposition.",
      },
      {
        name: "Technical Depth",
        current: 52,
        target: 80,
        priority: "Medium",
        description:
          "Strengthen the underlying concepts rather than relying only on surface-level solutions.",
      },
      {
        name: "System Thinking",
        current: 44,
        target: 75,
        priority: "Medium",
        description:
          "Practice connecting individual concepts into larger systems.",
      },
    ],
    mathematics: [
      {
        name: "Mathematical Reasoning",
        current: 61,
        target: 86,
        priority: "High",
        description:
          "Work on explaining why a solution works, not just reaching the final result.",
      },
      {
        name: "Problem Decomposition",
        current: 55,
        target: 82,
        priority: "Medium",
        description:
          "Break complex problems into smaller mathematical relationships.",
      },
      {
        name: "Proof & Explanation",
        current: 48,
        target: 76,
        priority: "Medium",
        description:
          "Develop stronger written reasoning and step-by-step justification.",
      },
    ],
    science: [
      {
        name: "Conceptual Depth",
        current: 63,
        target: 86,
        priority: "High",
        description:
          "Strengthen the underlying concepts and relationships between them.",
      },
      {
        name: "Scientific Reasoning",
        current: 57,
        target: 82,
        priority: "Medium",
        description:
          "Practice forming explanations from evidence and observations.",
      },
      {
        name: "Application",
        current: 49,
        target: 78,
        priority: "Medium",
        description:
          "Connect theoretical concepts with real-world situations.",
      },
    ],
    business: [
      {
        name: "Strategic Thinking",
        current: 62,
        target: 87,
        priority: "High",
        description:
          "Improve your ability to connect individual decisions with larger business outcomes.",
      },
      {
        name: "Decision Making",
        current: 58,
        target: 82,
        priority: "Medium",
        description:
          "Evaluate alternatives, constraints and trade-offs more systematically.",
      },
      {
        name: "Business Communication",
        current: 66,
        target: 84,
        priority: "Medium",
        description:
          "Practice communicating decisions with clear reasoning and evidence.",
      },
    ],
    finance: [
      {
        name: "Financial Reasoning",
        current: 60,
        target: 88,
        priority: "High",
        description:
          "Strengthen your ability to interpret financial information and implications.",
      },
      {
        name: "Quantitative Analysis",
        current: 57,
        target: 83,
        priority: "Medium",
        description:
          "Improve numerical reasoning and interpretation of financial data.",
      },
      {
        name: "Risk Assessment",
        current: 51,
        target: 80,
        priority: "Medium",
        description:
          "Develop stronger frameworks for evaluating uncertainty and risk.",
      },
    ],
    communication: [
      {
        name: "Clarity",
        current: 69,
        target: 90,
        priority: "High",
        description:
          "Your ideas are developing, but stronger structure will make your communication more effective.",
      },
      {
        name: "Persuasion",
        current: 55,
        target: 82,
        priority: "Medium",
        description:
          "Learn to support ideas with evidence, examples and clear reasoning.",
      },
      {
        name: "Structured Expression",
        current: 62,
        target: 86,
        priority: "Medium",
        description:
          "Practice organizing complex ideas into a simple and logical flow.",
      },
    ],
    design: [
      {
        name: "Design Reasoning",
        current: 61,
        target: 86,
        priority: "High",
        description:
          "Strengthen the reasoning behind design decisions and trade-offs.",
      },
      {
        name: "User Understanding",
        current: 55,
        target: 84,
        priority: "Medium",
        description:
          "Develop stronger understanding of user needs and behavior.",
      },
      {
        name: "Visual Communication",
        current: 64,
        target: 82,
        priority: "Medium",
        description:
          "Practice communicating complex ideas through clear visual systems.",
      },
    ],
    other: [
      {
        name: "Critical Thinking",
        current: 62,
        target: 85,
        priority: "High",
        description:
          "Strengthen your ability to evaluate information and assumptions.",
      },
      {
        name: "Problem Solving",
        current: 58,
        target: 82,
        priority: "Medium",
        description:
          "Practice breaking unfamiliar problems into manageable parts.",
      },
      {
        name: "Conceptual Depth",
        current: 54,
        target: 78,
        priority: "Medium",
        description:
          "Move beyond surface understanding by connecting related concepts.",
      },
    ],
  };

  const gaps = gapsByDomain[domain] || gapsByDomain.other;

  const adjustedGaps = gaps.map((gap) => ({
    ...gap,
    current: Math.min(95, gap.current + Math.floor((score - 58) / 4)),
  }));

  const strengths = strengthsByDomain[domain] || strengthsByDomain.other;

  const averageGap = Math.round(
    adjustedGaps.reduce(
      (sum, gap) => sum + Math.max(gap.target - gap.current, 0),
      0
    ) / adjustedGaps.length
  );

  return {
    score,
    averageGap,
    strengths,
    gaps: adjustedGaps,
    goal,
    domain,
    question,
    answer,
  };
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ScoreRing({ score }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="10"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#4F46E5"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#0F172A]">{score}</span>
        <span className="text-xs font-medium text-[#64748B]">/ 100</span>
      </div>
    </div>
  );
}

function GapBar({ current, target }) {
  return (
    <div className="space-y-2">
      <div className="relative h-3 overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#4F46E5]"
          style={{ width: `${current}%` }}
        />

        <div
          className="absolute inset-y-0 w-1 rounded-full bg-[#06B6D4]"
          style={{ left: `${target}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-[#64748B]">
        <span>Current {current}%</span>
        <span className="font-medium text-[#06B6D4]">
          Target {target}%
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function SkillGap() {
  const [domain, setDomain] = useState("technology");
  const [goal, setGoal] = useState("Software Engineer");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [activeGap, setActiveGap] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedGoal = useMemo(
    () => GOALS.find((item) => item.title === goal) || GOALS[0],
    [goal]
  );

  const selectedDomain = useMemo(
    () => DOMAINS.find((item) => item.id === domain) || DOMAINS[0],
    [domain]
  );

  const canAnalyze =
    question.trim().length >= 8 && answer.trim().length >= 10;

  const handleAnalyze = () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const result = generateAnalysis(
        question,
        answer,
        domain,
        selectedGoal.title
      );

      setAnalysis(result);
      setIsAnalyzing(false);

      setTimeout(() => {
        document
          .getElementById("analysis-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    }, 900);
  };

  const handleDomainChange = (id) => {
    setDomain(id);
    setAnalysis(null);
  };

  const handleGoalChange = (value) => {
    setGoal(value);
    setAnalysis(null);
  };

  const resetAssessment = () => {
    setAnalysis(null);
    setQuestion("");
    setAnswer("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#0F172A]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#4F46E5]/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#06B6D4]/10 blur-3xl" />

        <Container>
          <div className="relative mx-auto max-w-4xl py-20 text-center sm:py-24 lg:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur">
              <span className="text-[#06B6D4]">✦</span>
              Cognify AI · Skill Intelligence
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Measure what you know.
              <br />
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                Discover what you're missing.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Don't just tell us your skills. Show us what you know.
              Cognify analyzes your answers, identifies demonstrated
              capabilities, and measures the distance between your current
              level and your career goal.
            </p>

            <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
              {[
                ["01", "Ask", "Answer a real question"],
                ["02", "Analyze", "AI evaluates your performance"],
                ["03", "Map", "See your career skill gap"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-[#06B6D4]/40 hover:bg-white/[0.07]"
                >
                  <span className="text-xs font-bold text-[#06B6D4]">
                    {number}
                  </span>

                  <h3 className="mt-2 font-semibold text-white">{title}</h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          ASSESSMENT
      ===================================================== */}
      <Section background="white" id="assessment">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Start with what you actually know."
            subtitle="Choose a field, set a goal, and answer a question. Your performance becomes the evidence Cognify uses to understand your capabilities."
          />

          {/* DOMAIN */}
          <div className="mb-12">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 01
                </span>

                <h3 className="mt-1 text-xl font-semibold text-[#0F172A]">
                  What are you learning?
                </h3>
              </div>

              <span className="text-sm text-[#64748B]">
                Any field. Any subject.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DOMAINS.map((item) => {
                const active = domain === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleDomainChange(item.id)}
                    className={[
                      "group rounded-xl border p-4 text-left transition-all duration-200",
                      active
                        ? "border-[#4F46E5] bg-indigo-50 shadow-md shadow-indigo-500/10"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-lg text-lg font-semibold transition",
                        active
                          ? "bg-[#4F46E5] text-white"
                          : "bg-[#F1F5F9] text-[#4F46E5] group-hover:bg-indigo-50",
                      ].join(" ")}
                    >
                      {item.icon}
                    </div>

                    <h4 className="mt-3 text-sm font-semibold text-[#0F172A]">
                      {item.label}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-[#64748B]">
                      {item.examples}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CAREER */}
          <div className="mb-12">
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                Step 02
              </span>

              <h3 className="mt-1 text-xl font-semibold text-[#0F172A]">
                Where do you want to go?
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GOALS.map((item) => {
                const active = goal === item.title;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGoalChange(item.title)}
                    className={[
                      "group flex items-center justify-between rounded-xl border p-5 text-left transition-all duration-200",
                      active
                        ? "border-[#7C3AED] bg-violet-50 shadow-md shadow-violet-500/10"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md",
                    ].join(" ")}
                  >
                    <div>
                      <span className="text-xs font-medium text-[#64748B]">
                        {item.category}
                      </span>

                      <h4 className="mt-1 font-semibold text-[#0F172A]">
                        {item.title}
                      </h4>
                    </div>

                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition",
                        active
                          ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                          : "border-slate-200 text-slate-400 group-hover:border-violet-300 group-hover:text-violet-600",
                      ].join(" ")}
                    >
                      {active ? "✓" : "→"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUESTION */}
          <Card
            hoverable={false}
            className="border-slate-200 p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 03
                </span>

                <h3 className="mt-1 text-xl font-semibold text-[#0F172A]">
                  Show us what you know.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Ask yourself a question, paste a problem you attempted, or
                  explain a concept. It doesn't have to be technical.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
                AI Assessment
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="question"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  The question or problem
                </label>

                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder={`Example: Explain why increasing interest rates can affect inflation...`}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#4F46E5] focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="answer"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Your answer
                  </label>

                  <span className="text-xs text-[#64748B]">
                    {answer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={7}
                  placeholder="Explain your reasoning in your own words. Cognify evaluates how you think, not just whether your final answer is correct."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm leading-6 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#4F46E5] focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#06B6D4] shadow-sm">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      How Cognify evaluates you
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#64748B]">
                      Reasoning · Understanding · Application · Explanation
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  disabled={!canAnalyze || isAnalyzing}
                  className="w-full border-[#4F46E5] bg-[#4F46E5] hover:border-[#4338CA] hover:bg-[#4338CA] sm:w-auto"
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze My Skills"}
                  {!isAnalyzing && <span>→</span>}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* =====================================================
          AI RESULT
      ===================================================== */}
      {analysis && (
        <section
          id="analysis-result"
          className="scroll-mt-20 border-y border-slate-200 bg-[#F1F5F9] py-16 sm:py-20 lg:py-24"
        >
          <Container>
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                  <span>✦</span>
                  AI Analysis Complete
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                  Here's what we found.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Based on your response in{" "}
                  <strong className="text-[#0F172A]">
                    {selectedDomain.label}
                  </strong>
                  , Cognify estimated your demonstrated capabilities against
                  the requirements of{" "}
                  <strong className="text-[#4F46E5]">{analysis.goal}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={resetAssessment}
                className="w-fit text-sm font-semibold text-[#4F46E5] transition hover:text-[#7C3AED]"
              >
                ← Ask another question
              </button>
            </div>

            {/* OVERVIEW */}
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Card
                hoverable
                className="border-slate-200 shadow-sm"
              >
                <div className="flex flex-col items-center gap-7 sm:flex-row">
                  <ScoreRing score={analysis.score} />

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">
                      Demonstrated capability
                    </span>

                    <h3 className="mt-2 text-2xl font-bold text-[#0F172A]">
                      {analysis.score >= 75
                        ? "Strong foundation"
                        : analysis.score >= 60
                        ? "Developing capability"
                        : "Early-stage capability"}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#64748B]">
                      This score reflects how effectively your response
                      demonstrated understanding, reasoning and application.
                      It is not simply a correctness score.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                hoverable
                className="border-slate-200 shadow-sm"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                  Career gap
                </span>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#0F172A]">
                    {analysis.averageGap}
                  </span>

                  <span className="mb-2 text-sm text-[#64748B]">
                    points average gap
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                    style={{
                      width: `${Math.min(
                        analysis.averageGap * 2.5,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#64748B]">
                  The smaller this number becomes, the closer your demonstrated
                  abilities are to your target career requirements.
                </p>
              </Card>
            </div>

            {/* STRENGTHS */}
            <div className="mt-8">
              <Card
                hoverable={false}
                className="border-cyan-100 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-lg text-[#06B6D4]">
                    ✓
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0F172A]">
                      Capabilities you demonstrated
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysis.strengths.map((strength) => (
                        <span
                          key={strength}
                          className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* GAPS */}
            <div className="mt-12">
              <SectionHeading
                title="Your skill gaps"
                subtitle="These are the areas where your demonstrated ability is furthest from your target career level."
                className="mb-8"
              />

              <div className="grid gap-5 lg:grid-cols-3">
                {analysis.gaps.map((gap, index) => {
                  const expanded = activeGap === index;

                  return (
                    <button
                      key={gap.name}
                      type="button"
                      onClick={() =>
                        setActiveGap(expanded ? null : index)
                      }
                      className="text-left"
                    >
                      <Card
                        hoverable
                        className={[
                          "h-full transition-all",
                          expanded
                            ? "border-[#7C3AED] shadow-lg shadow-violet-500/10"
                            : "",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                              gap.priority === "High"
                                ? "bg-violet-50 text-[#7C3AED]"
                                : "bg-indigo-50 text-[#4F46E5]",
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <span
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                              gap.priority === "High"
                                ? "border-violet-100 bg-violet-50 text-violet-700"
                                : "border-indigo-100 bg-indigo-50 text-indigo-700",
                            ].join(" ")}
                          >
                            {gap.priority}
                          </span>
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">
                          {gap.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                          {gap.description}
                        </p>

                        <div className="mt-6">
                          <GapBar
                            current={gap.current}
                            target={gap.target}
                          />
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs font-medium text-[#64748B]">
                            {expanded ? "Hide details" : "View details"}
                          </span>

                          <span
                            className={[
                              "text-[#4F46E5] transition-transform",
                              expanded ? "rotate-90" : "",
                            ].join(" ")}
                          >
                            →
                          </span>
                        </div>

                        {expanded && (
                          <div className="mt-4 rounded-lg bg-[#F8FAFC] p-4">
                            <p className="text-xs font-semibold text-[#0F172A]">
                              Recommended focus
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#64748B]">
                              Practice this capability through progressively
                              harder problems and real-world applications.
                            </p>
                          </div>
                        )}
                      </Card>
                    </button>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <Section background="white">
        <SectionHeading
          title="Skill Gap is not a checklist."
          subtitle="Your capabilities are inferred from evidence, not simply from the technologies you claim to know."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Demonstrate",
              text: "Answer questions, solve problems or explain concepts from any field.",
              icon: "◈",
            },
            {
              number: "02",
              title: "Understand",
              text: "Cognify analyzes your reasoning, understanding, application and explanation.",
              icon: "✦",
            },
            {
              number: "03",
              title: "Measure",
              text: "Your demonstrated capabilities are compared with the requirements of your goal.",
              icon: "◎",
            },
          ].map((item) => (
            <Card
              key={item.number}
              hoverable
              className="group h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4F46E5]">
                  {item.number}
                </span>

                <span className="text-xl text-[#06B6D4] transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                {item.text}
              </p>
            </Card>
          ))}
        </div>
      </Section>

     {/* CTA */}
           <Section background="white">
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