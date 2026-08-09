import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Container from "../components/Container";
import Section from "../components/Section";
import SectionHeading from "../components/SectionHeading";
import CtaBanner from "../components/CtaBanner";

/* =========================================================
   REUSABLE SVG ICONS
========================================================= */
function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-5 h-5 animate-spin" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* =========================================================
   STATIC CONFIG & DATA
========================================================= */
const DOMAINS = [
  {
    id: "technology",
    label: "Technology",
    icon: "⌘",
    examples: "Programming, AI, Web Dev",
    sampleQuestion: "Explain how a REST API differs from GraphQL.",
    sampleAnswer: "REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE) with fixed endpoints returning predefined data structures. GraphQL uses a single endpoint where clients specify exact query fields needed, avoiding over-fetching or under-fetching.",
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: "∑",
    examples: "Algebra, Calculus, Stats",
    sampleQuestion: "Explain the intuition behind the Central Limit Theorem.",
    sampleAnswer: "The Central Limit Theorem states that as sample size increases, the distribution of sample means approaches a normal distribution, regardless of the population's original shape, provided samples are independent.",
  },
  {
    id: "science",
    label: "Science",
    icon: "⚛",
    examples: "Physics, Chemistry, Bio",
    sampleQuestion: "How do enzymes lower activation energy in chemical reactions?",
    sampleAnswer: "Enzymes act as biological catalysts by binding substrates at active sites. They stabilize transition states, align reactants, and weaken chemical bonds, thereby lowering the required activation energy.",
  },
  {
    id: "business",
    label: "Business",
    icon: "◫",
    examples: "Strategy, Management, Marketing",
    sampleQuestion: "What is the difference between cost leadership and differentiation?",
    sampleAnswer: "Cost leadership focuses on achieving lower operational costs to offer competitive low prices. Differentiation focuses on creating unique product features or brand value that command premium prices.",
  },
  {
    id: "finance",
    label: "Finance",
    icon: "₹",
    examples: "Investing, Accounting, Econ",
    sampleQuestion: "Explain why raising interest rates helps control inflation.",
    sampleAnswer: "Raising interest rates increases borrowing costs for consumers and businesses. This reduces spending and investments, slowing aggregate demand and cooling price inflation across the economy.",
  },
  {
    id: "communication",
    label: "Communication",
    icon: "Aa",
    examples: "Writing, Speaking, Pitching",
    sampleQuestion: "How do you structure an executive elevator pitch?",
    sampleAnswer: "Start with the core problem statement, follow with your concise solution, highlight unique value proposition with key metrics, and close with a clear call to action.",
  },
  {
    id: "design",
    label: "Design",
    icon: "◇",
    examples: "UI/UX, Visual, Research",
    sampleQuestion: "Explain visual hierarchy in user interface design.",
    sampleAnswer: "Visual hierarchy guides user focus through contrast, typography scale, spacing, color highlights, and alignment to ensure key actions are clear and intuitive.",
  },
  {
    id: "other",
    label: "Other",
    icon: "＋",
    examples: "General Professional Skills",
    sampleQuestion: "How do you prioritize competing project deadlines?",
    sampleAnswer: "I use an Eisenhower Matrix framework evaluating urgency and impact, communicate with stakeholders to align expectations, and break tasks into milestone deliverables.",
  },
];

const GOALS = [
  {
    id: "software",
    title: "Software Engineer",
    category: "Technology",
    requiredSkills: ["Problem Solving", "Programming", "Data Structures", "System Design"],
  },
  {
    id: "data",
    title: "Data Scientist",
    category: "Technology",
    requiredSkills: ["Statistics", "Python", "Data Analysis", "Machine Learning"],
  },
  {
    id: "manager",
    title: "Business Manager",
    category: "Business",
    requiredSkills: ["Decision Making", "Communication", "Leadership", "Business Strategy"],
  },
  {
    id: "finance",
    title: "Financial Analyst",
    category: "Finance",
    requiredSkills: ["Financial Analysis", "Statistics", "Decision Making", "Communication"],
  },
  {
    id: "designer",
    title: "UI/UX Designer",
    category: "Design",
    requiredSkills: ["Visual Design", "User Research", "Problem Solving", "Communication"],
  },
  {
    id: "research",
    title: "Researcher",
    category: "Science",
    requiredSkills: ["Critical Thinking", "Research", "Analysis", "Communication"],
  },
];

/* =========================================================
   ANALYSIS ENGINE (SIMULATED AI)
========================================================= */
function generateAnalysis(question, answer, domain, goal) {
  const text = `${question} ${answer}`.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  let baseScore = 60;
  if (wordCount >= 25) baseScore += 8;
  if (wordCount >= 50) baseScore += 7;
  if (answer.includes("=")) baseScore += 3;
  if (text.includes("because") || text.includes("since")) baseScore += 4;
  if (text.includes("therefore") || text.includes("thus")) baseScore += 3;
  if (text.includes("example") || text.includes("such as")) baseScore += 4;
  if (text.includes("however") || text.includes("whereas")) baseScore += 3;

  const score = Math.min(baseScore, 92);

  const strengthsByDomain = {
    technology: ["Problem decomposition", "Technical reasoning", "Modular thinking"],
    mathematics: ["Analytical reasoning", "Pattern recognition", "Quantitative rigor"],
    science: ["Conceptual depth", "Cause-and-effect reasoning", "Evidence analysis"],
    business: ["Strategic alignment", "Decision trade-offs", "Commercial awareness"],
    finance: ["Financial logic", "Risk awareness", "Quantitative interpretation"],
    communication: ["Clarity of thought", "Structured expression", "Audience orientation"],
    design: ["User-centric reasoning", "Visual hierarchy", "Contextual empathy"],
    other: ["Critical thinking", "Structured decomposition", "Practical application"],
  };

  const gapsByDomain = {
    technology: [
      {
        name: "System Architecture",
        current: Math.min(95, 60 + Math.floor((score - 60) / 3)),
        target: 88,
        priority: "High",
        description: "Practice connecting isolated code modules into scalable end-to-end architectures.",
      },
      {
        name: "Algorithm Efficiency",
        current: Math.min(95, 54 + Math.floor((score - 60) / 4)),
        target: 82,
        priority: "Medium",
        description: "Focus on time and space complexity trade-offs under high-scale scenarios.",
      },
      {
        name: "Testing & Resilience",
        current: Math.min(95, 48 + Math.floor((score - 60) / 4)),
        target: 78,
        priority: "Medium",
        description: "Build robust error handling, automated tests, and edge case coverage.",
      },
    ],
    finance: [
      {
        name: "Valuation Frameworks",
        current: Math.min(95, 58 + Math.floor((score - 60) / 3)),
        target: 87,
        priority: "High",
        description: "Connect financial statements to discounted cash flow (DCF) models.",
      },
      {
        name: "Risk Sensitivity",
        current: Math.min(95, 52 + Math.floor((score - 60) / 4)),
        target: 82,
        priority: "Medium",
        description: "Evaluate macroeconomic shifts and scenario modeling for portfolio safety.",
      },
      {
        name: "Capital Allocation",
        current: Math.min(95, 46 + Math.floor((score - 60) / 4)),
        target: 76,
        priority: "Medium",
        description: "Analyze debt vs equity financing decisions for corporate growth.",
      },
    ],
  };

  const gaps = gapsByDomain[domain] || [
    {
      name: "Advanced Critical Reasoning",
      current: Math.min(95, 56 + Math.floor((score - 60) / 3)),
      target: 86,
      priority: "High",
      description: "Strengthen written justifications and step-by-step logic proof.",
    },
    {
      name: "Domain Synthesis",
      current: Math.min(95, 52 + Math.floor((score - 60) / 4)),
      target: 80,
      priority: "Medium",
      description: "Apply theoretical principles to multi-faceted real-world cases.",
    },
    {
      name: "Structured Execution",
      current: Math.min(95, 47 + Math.floor((score - 60) / 4)),
      target: 75,
      priority: "Medium",
      description: "Improve execution speed while maintaining high quality standards.",
    },
  ];

  const strengths = strengthsByDomain[domain] || strengthsByDomain.other;
  const averageGap = Math.round(
    gaps.reduce((sum, gap) => sum + Math.max(gap.target - gap.current, 0), 0) / gaps.length
  );

  return { score, averageGap, strengths, gaps, goal, domain, question, answer };
}

/* =========================================================
   SUB-COMPONENTS FOR DRY & HOVER Polish
========================================================= */
function ScoreRing({ score }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-36 w-36 shrink-0 transition-transform duration-300 hover:scale-105">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{score}</span>
        <span className="text-xs font-medium text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 transition-all duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function GapBar({ current, target }) {
  return (
    <div className="space-y-2">
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-indigo-600 transition-all duration-700"
          style={{ width: `${current}%` }}
        />
        <div
          className="absolute inset-y-0 w-1.5 rounded-full bg-cyan-500 shadow-sm"
          style={{ left: `${target}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>Current: {current}%</span>
        <span className="text-cyan-600 font-bold">Target: {target}%</span>
      </div>
    </div>
  );
}

function DomainTile({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`group rounded-xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-indigo-600 bg-indigo-50/60 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-600/20 scale-[1.02]"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl active:scale-95"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${
          active
            ? "bg-indigo-600 text-white scale-110"
            : "bg-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110"
        }`}
      >
        {item.icon}
      </div>
      <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.label}</h4>
      <p className="mt-0.5 text-xs text-slate-500 truncate">{item.examples}</p>
    </button>
  );
}

function GoalCard({ item, active, isRecommended, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.title)}
      className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-violet-600 bg-violet-50/60 shadow-lg shadow-violet-500/10 ring-2 ring-violet-600/20 scale-[1.01]"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl active:scale-95"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{item.category}</span>
          {isRecommended && (
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-bold text-cyan-800 animate-pulse">
              Recommended
            </span>
          )}
        </div>
        <h4 className="mt-1 font-bold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">{item.title}</h4>
      </div>

      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-all duration-300 ${
          active
            ? "border-violet-600 bg-violet-600 text-white scale-110"
            : "border-slate-200 text-slate-400 group-hover:border-violet-400 group-hover:text-violet-600 group-hover:scale-110"
        }`}
      >
        {active ? <CheckIcon className="w-3.5 h-3.5" /> : <ArrowRightIcon className="w-3.5 h-3.5" />}
      </div>
    </button>
  );
}

/* =========================================================
   MAIN SKILL GAP COMPONENT
========================================================= */
export default function SkillGap() {
  const [domain, setDomain] = useState("technology");
  const [goal, setGoal] = useState("Software Engineer");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [activeGap, setActiveGap] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedGoal = useMemo(
    () => GOALS.find((item) => item.title === goal) || GOALS[0],
    [goal]
  );

  const selectedDomain = useMemo(
    () => DOMAINS.find((item) => item.id === domain) || DOMAINS[0],
    [domain]
  );

  const domainFilteredGoals = useMemo(() => {
    const matched = GOALS.filter((g) => g.category.toLowerCase() === selectedDomain.label.toLowerCase());
    return matched.length > 0 ? matched : GOALS;
  }, [selectedDomain]);

  const canAnalyze = question.trim().length >= 8 && answer.trim().length >= 10;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = generateAnalysis(question, answer, domain, selectedGoal.title);
      setAnalysis(result);
      setIsAnalyzing(false);

      setTimeout(() => {
        document.getElementById("analysis-result")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }, 850);
  };

  const handleDomainChange = (id) => {
    setDomain(id);
    setAnalysis(null);
    const targetDomainObj = DOMAINS.find((d) => d.id === id);
    if (targetDomainObj) {
      const matchedGoal = GOALS.find((g) => g.category.toLowerCase() === targetDomainObj.label.toLowerCase());
      if (matchedGoal) setGoal(matchedGoal.title);
    }
  };

  const handleGoalChange = (value) => {
    setGoal(value);
    setAnalysis(null);
  };

  const handleLoadPreset = () => {
    setQuestion(selectedDomain.sampleQuestion);
    setAnswer(selectedDomain.sampleAnswer);
  };

  const resetAssessment = () => {
    setAnalysis(null);
    setQuestion("");
    setAnswer("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredGaps = useMemo(() => {
    if (!analysis || !analysis.gaps) return [];
    if (priorityFilter === "All") return analysis.gaps;
    return analysis.gaps.filter((g) => g.priority === priorityFilter);
  }, [analysis, priorityFilter]);

  return (
    <div className="bg-[var(--color-surface)] text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

        <Container>
          <div className="relative mx-auto max-w-4xl py-14 sm:py-18 lg:py-20 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-xs">
              <SparklesIcon className="w-4 h-4 text-cyan-500" />
              Afinity AI · Skill Intelligence Engine
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Measure what you know.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                Discover what you're missing.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Show us what you know. Afinity evaluates your logic, reasoning, and answers to map the exact distance between your current level and career goals.
            </p>

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              {[
                ["01", "Demonstrate", "Answer a question or explain a concept"],
                ["02", "Evaluate", "AI analyzes reasoning and depth"],
                ["03", "Map Gap", "Get custom career skill gap analysis"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{number}</span>
                  <h3 className="mt-1.5 font-bold text-slate-900 text-sm">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ASSESSMENT SECTION */}
      <Section background="white" id="assessment">
        <SectionHeading
          eyebrow="STEP-BY-STEP ASSESSMENT"
          title="Start with what you actually know"
          subtitle="Select a domain, target goal, and answer a question. Afinity uses empirical evidence to measure capability."
        />

        {/* Step 1: Select Domain */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 01
              </span>
              <h3 className="mt-0.5 text-lg font-bold text-slate-900">What field are you learning?</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">8 Supported Domains</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DOMAINS.map((item) => (
              <DomainTile
                key={item.id}
                item={item}
                active={domain === item.id}
                onClick={handleDomainChange}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Select Goal */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step 02
            </span>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">What is your target career role?</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domainFilteredGoals.map((item) => {
              const active = goal === item.title;
              const isRecommended = item.category.toLowerCase() === selectedDomain.label.toLowerCase();
              return (
                <GoalCard
                  key={item.id}
                  item={item}
                  active={active}
                  isRecommended={isRecommended}
                  onClick={handleGoalChange}
                />
              );
            })}
          </div>
        </div>

        {/* Step 3: Question & Answer Submission Card */}
        <Card hoverable={false} className="border-slate-200 p-6 shadow-sm sm:p-8 transition-all duration-300 hover:shadow-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 03
              </span>
              <h3 className="mt-0.5 text-xl font-bold text-slate-900">Show us your knowledge</h3>
              <p className="mt-1 text-sm text-slate-500">
                Ask a question and explain your answer. Or click the preset button below to test instantly.
              </p>
            </div>

            <Button
              size="sm"
              variant="subtle"
              onClick={handleLoadPreset}
              icon={<SparklesIcon className="w-4 h-4 text-indigo-600" />}
              iconPosition="left"
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Load {selectedDomain.label} Sample
            </Button>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="question" className="mb-1.5 block text-sm font-semibold text-slate-900">
                The Question or Problem
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder={`e.g. ${selectedDomain.sampleQuestion}`}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="answer" className="block text-sm font-semibold text-slate-900">
                  Your Reasoning & Explanation
                </label>
                <span className="text-xs font-medium text-slate-500">{wordCount} words</span>
              </div>

              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Explain your thought process. Afinity evaluates logic, concepts, and depth..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-cyan-100 bg-cyan-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-xs">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">AI Evaluation Criteria</p>
                  <p className="text-xs text-slate-600">Decomposition · Logic · Concepts · Application</p>
                </div>
              </div>

              <Button
                size="lg"
                disabled={!canAnalyze || isAnalyzing}
                icon={isAnalyzing ? <SpinnerIcon /> : <ArrowRightIcon />}
                onClick={handleAnalyze}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Skill Gap"}
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      {/* AI ANALYSIS RESULTS SECTION */}
      {analysis && (
        <Section background="tint" id="analysis-result" className="scroll-mt-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                <SparklesIcon className="w-3.5 h-3.5" />
                AI Skill Analysis Complete
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Here's what we discovered
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Analysis based on response in <strong className="text-slate-900">{selectedDomain.label}</strong> evaluated against target role <strong className="text-indigo-600">{analysis.goal}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={resetAssessment}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              ← Analyze another question
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card hoverable={false} className="bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ScoreRing score={analysis.score} />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                    Demonstrated Capability
                  </span>

                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    {analysis.score >= 75
                      ? "Strong Capability Foundation"
                      : analysis.score >= 60
                      ? "Developing Capability"
                      : "Early Stage Capability"}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Reflects how effectively your reasoning demonstrated underlying concepts and application.
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable={false} className="bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Estimated Career Gap
              </span>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900">{analysis.averageGap}</span>
                <span className="mb-1 text-xs font-medium text-slate-500">points average skill gap</span>
              </div>

              <div className="mt-4">
                <ProgressBar value={Math.min(analysis.averageGap * 2.5, 100)} />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-600">
                The smaller this gap number, the closer your demonstrated abilities match your target role.
              </p>
            </Card>
          </div>

          {/* Strengths List */}
          <div className="mt-6">
            <Card hoverable={false} className="border-cyan-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <CheckIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Demonstrated Strengths</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.strengths.map((str) => (
                      <span
                        key={str}
                        className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100"
                      >
                        ✓ {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Gaps List & Priority Filter */}
          <div className="mt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Identified Skill Gaps</h3>
                <p className="text-xs text-slate-500">Focus on these areas to reach target proficiency.</p>
              </div>

              <div className="flex gap-1.5">
                {["All", "High", "Medium"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setPriorityFilter(priority)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                      priorityFilter === priority
                        ? "bg-slate-900 text-white scale-105 shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95"
                    }`}
                  >
                    {priority} Priority
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {filteredGaps.map((gap, index) => {
                const expanded = activeGap === index;
                return (
                  <button
                    key={gap.name}
                    type="button"
                    onClick={() => setActiveGap(expanded ? null : index)}
                    className="text-left"
                  >
                    <Card
                      hoverable
                      className={`h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        expanded ? "ring-2 ring-violet-500 shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700">
                          0{index + 1}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            gap.priority === "High"
                              ? "border-violet-200 bg-violet-50 text-violet-700"
                              : "border-indigo-200 bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </div>

                      <h4 className="mt-3 font-bold text-slate-900 text-base">{gap.name}</h4>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{gap.description}</p>

                      <div className="mt-4">
                        <GapBar current={gap.current} target={gap.target} />
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-indigo-600">
                          {expanded ? "Hide details" : "View recommendations"}
                        </span>
                        <ArrowRightIcon className={`w-3.5 h-3.5 text-indigo-600 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
                      </div>

                      {expanded && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                          <strong className="text-slate-900">Action Plan:</strong> Solve targeted practical problems covering {gap.name.toLowerCase()} concepts.
                        </div>
                      )}
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* FINAL CTA BANNER */}
      <Section background="white">
        <CtaBanner
          eyebrow="EVIDENCE-BASED LEARNING"
          title="Turn your skill gaps into personalized roadmaps."
          buttonLabel="View Personalized Roadmap"
          href="/roadmap"
        />
      </Section>
    </div>
  );
}