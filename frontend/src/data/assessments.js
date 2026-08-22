/* =========================================================
   AIFinity — Assessment data
   Field-agnostic assessment system driven by the user's
   onboarding profile (career goal / field / skills / level).
   Static/mock for now — same shape a future API response would
   have, so swapping this for a real fetch later needs no UI
   changes in AssessmentPage.jsx or AssessmentAttemptPage.jsx.
========================================================= */

/* ---------------- User profile ----------------
   Read from what OnboardingPage saves to localStorage. Falls back
   to a sensible default if the person hasn't onboarded yet (or is
   visiting /assessment directly), so nothing ever breaks. */
const ONBOARDING_STORAGE_KEY = "aifinity_onboarding_profile";

const DEFAULT_PROFILE = {
  careerGoal: "Software Developer",
  field: "Software Development",
  skills: ["DSA", "JavaScript", "React"],
  currentLevel: "Intermediate",
};

/* Free-text onboarding answers ("interest" / "customInput") don't map
   1:1 to our known fields, so we match on keywords. Unmatched input
   falls back to the default field rather than guessing wrong. */
const FIELD_KEYWORDS = {
  "Software Development": [
    "software", "developer", "programming", "code", "coding",
    "web dev", "app dev", "dsa", "javascript", "react", "computer science",
  ],
  "Data Analysis": ["data", "analyst", "analytics", "sql", "statistics", "data science"],
  "Graphic Design": ["design", "graphic", "ui", "ux", "visual", "illustrator", "photoshop"],
  "Digital Marketing": ["marketing", "seo", "social media", "content", "campaign"],
  "Business / Management": ["business", "management", "manager", "mba", "entrepreneur", "finance"],
  Engineering: ["engineer", "engineering", "mechanical", "civil", "electrical", "core branch"],
};

function matchField(text) {
  const lower = (text || "").toLowerCase().trim();
  if (!lower) return null;
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return field;
  }
  return null;
}

/* Reads the onboarding answers OnboardingPage saved to localStorage
   and turns them into the { careerGoal, field, skills, currentLevel }
   shape the rest of this file expects. Call this fresh wherever the
   profile is needed — it's cheap, and picks up onboarding changes
   without needing a full page reload. */
export function getUserProfile() {
  if (typeof window === "undefined" || !window.localStorage) return DEFAULT_PROFILE;
  try {
    let sessionUser = null;
    try {
      sessionUser = JSON.parse(window.localStorage.getItem("user") || "null");
    } catch (_) {}

    if (sessionUser && sessionUser.selectedField) {
      const profile = sessionUser.onboardingProfile || {};
      return {
        careerGoal: profile.careerGoal || sessionUser.selectedField,
        field: sessionUser.selectedField,
        skills: DEFAULT_PROFILE.skills,
        currentLevel: profile.level || DEFAULT_PROFILE.currentLevel,
      };
    }

    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const saved = JSON.parse(raw);

    if (saved.field && saved.careerGoal) {
      return {
        careerGoal: saved.careerGoal,
        field: saved.field,
        skills: DEFAULT_PROFILE.skills,
        currentLevel: saved.level || DEFAULT_PROFILE.currentLevel,
      };
    }

    const field =
      matchField(saved.customInput) || matchField(saved.interest) || DEFAULT_PROFILE.field;
    const careerGoal = saved.customInput || saved.goal || saved.interest || DEFAULT_PROFILE.careerGoal;
    return {
      careerGoal,
      field,
      skills: saved.customInput ? [saved.customInput] : DEFAULT_PROFILE.skills,
      currentLevel: saved.level || DEFAULT_PROFILE.currentLevel,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

/* ---------------- Question types ----------------
   The assessment system is never MCQ-only. */
export const QUESTION_TYPES = [
  "mcq",
  "problem-solving",
  "coding",
  "conceptual",
  "scenario",
  "logical-reasoning",
  "data-interpretation",
  "output",
];

/* Types with one definite correct answer — auto-graded.
   Free-text types (problem-solving / coding / conceptual) are
   "attempted only" for now; real grading comes with AI analysis later. */
export const GRADABLE_TYPES = ["mcq", "scenario", "logical-reasoning", "data-interpretation", "output"];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export function formatType(type) {
  return type
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/* Assessment-level `type`: the single question type if every
   question shares one, otherwise "Mixed". Derived, not hand-set,
   so it can never drift out of sync with the questions array. */
function deriveType(questions) {
  const types = new Set(questions.map((q) => q.type));
  return types.size > 1 ? "Mixed" : [...types][0];
}

function assessment(a) {
  return { ...a, type: deriveType(a.questions) };
}

/* ============================================================
   ASSESSMENTS
   One "core" assessment per field (3 Easy / 3 Medium / 3 Hard,
   mixing question types), plus the original Software Development
   / Data Analysis practice sets kept on as extra Explore content.
============================================================ */

export const ASSESSMENTS = [
  /* ---------------- Software Development ---------------- */
  assessment({
    id: "software-development-core",
    title: "Software Development Assessment",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Programming & DSA",
    icon: "</>",
    difficulty: "Mixed",
    duration: 30,
    description:
      "Programming fundamentals, data structures, and problem-solving for developers.",
    questions: [
      {
        id: "sdc-1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which of these best describes a linked list?",
        options: [
          "A fixed-size block of contiguous memory",
          "A sequence of nodes where each node points to the next",
          "A key-value lookup structure",
          "A structure that only allows LIFO access",
        ],
        answer: 1,
      },
      {
        id: "sdc-2",
        type: "conceptual",
        difficulty: "Easy",
        question: "In your own words, explain what a function is and why we use them.",
        options: null,
        answer: null,
      },
      {
        id: "sdc-3",
        type: "logical-reasoning",
        difficulty: "Easy",
        question: "If array indices start at 0, what is the index of the 5th element?",
        options: ["3", "4", "5", "6"],
        answer: 1,
      },
      {
        id: "sdc-4",
        type: "mcq",
        difficulty: "Medium",
        question:
          "Which comparison-based sorting algorithm has an average time complexity of O(n log n)?",
        options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
        answer: 1,
      },
      {
        id: "sdc-5",
        type: "coding",
        difficulty: "Medium",
        question: "Write a function reverseString(str) that returns the string reversed.",
        options: null,
        answer: null,
      },
      {
        id: "sdc-6",
        type: "problem-solving",
        difficulty: "Medium",
        question:
          "You have an array of integers. Describe an approach (no code needed) to find two numbers that sum to a target value, faster than checking every pair.",
        options: null,
        answer: null,
      },
      {
        id: "sdc-7",
        type: "mcq",
        difficulty: "Hard",
        question: "What is the average time complexity of inserting into a hash map?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
      },
      {
        id: "sdc-8",
        type: "coding",
        difficulty: "Hard",
        question: "Write a function that checks whether a given string is a palindrome.",
        options: null,
        answer: null,
      },
      {
        id: "sdc-9",
        type: "logical-reasoning",
        difficulty: "Hard",
        question:
          "A recursive function calls itself with no base case. What happens when it runs?",
        options: [
          "It returns immediately",
          "It causes a stack overflow / infinite recursion",
          "It automatically optimizes into a loop",
          "Nothing — it's valid",
        ],
        answer: 1,
      },
    ],
  }),

  {
    ...assessment({
      id: "dsa-fundamentals",
      title: "DSA Fundamentals",
      field: "Software Development",
      careerGoals: ["Software Developer"],
      category: "DSA",
      icon: "▤",
      difficulty: "Medium",
      duration: 20,
      description: "Core data structures and algorithms every developer should know.",
      questions: [
        {
          id: "q1",
          type: "mcq",
          difficulty: "Easy",
          question: "Which data structure uses LIFO (Last In, First Out) order?",
          options: ["Queue", "Stack", "Array", "Graph"],
          answer: 1,
        },
        {
          id: "q2",
          type: "coding",
          difficulty: "Medium",
          question: "Write a function that returns the factorial of a number n.",
          options: null,
          answer: null,
        },
        {
          id: "q3",
          type: "output",
          difficulty: "Easy",
          question: "What is the output of: console.log(typeof NaN)",
          options: null,
          answer: "number",
        },
        {
          id: "q4",
          type: "mcq",
          difficulty: "Medium",
          question: "What is the time complexity of binary search on a sorted array?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
          answer: 2,
        },
        {
          id: "q5",
          type: "conceptual",
          difficulty: "Hard",
          question: "Explain the difference between a stack and a queue, in your own words.",
          options: null,
          answer: null,
        },
      ],
    }),
  },

  assessment({
    id: "arrays-strings",
    title: "Arrays & Strings",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "DSA",
    icon: "▥",
    difficulty: "Easy",
    duration: 15,
    description: "Practice common patterns for working with arrays and strings.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which array method reverses an array in place?",
        options: ["reverse()", "sort()", "slice()", "splice()"],
        answer: 0,
      },
      {
        id: "q2",
        type: "output",
        difficulty: "Easy",
        question: "What is the output of: [1, 2, 3].join('-')",
        options: null,
        answer: "1-2-3",
      },
      {
        id: "q3",
        type: "scenario",
        difficulty: "Medium",
        question:
          "You need to remove duplicate values from an array. Which approach is most appropriate?",
        options: [
          "Use a Set",
          "Use a for loop with nested comparisons only",
          "Sort, then manually delete entries",
          "Convert to a string and back",
        ],
        answer: 0,
      },
    ],
  }),

  assessment({
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Programming Fundamentals",
    icon: "{ }",
    difficulty: "Easy",
    duration: 15,
    description: "Core JavaScript concepts you'll use in almost every project.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which keyword declares a block-scoped variable?",
        options: ["var", "let", "function", "global"],
        answer: 1,
      },
      {
        id: "q2",
        type: "conceptual",
        difficulty: "Medium",
        question: "Explain the difference between == and === in JavaScript.",
        options: null,
        answer: null,
      },
      {
        id: "q3",
        type: "mcq",
        difficulty: "Easy",
        question: "What is the output of typeof null?",
        options: ["null", "object", "undefined", "number"],
        answer: 1,
      },
      {
        id: "q4",
        type: "output",
        difficulty: "Medium",
        question: "What is the output of: console.log(2 + '2')",
        options: null,
        answer: "22",
      },
    ],
  }),

  assessment({
    id: "problem-solving-generic",
    title: "Problem Solving",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Problem Solving",
    icon: "◆",
    difficulty: "Medium",
    duration: 20,
    description: "How you approach and break down unfamiliar problems.",
    questions: [
      {
        id: "q1",
        type: "scenario",
        difficulty: "Medium",
        question:
          "Your code works for small inputs but times out on large ones. What should you check first?",
        options: [
          "Time complexity of your algorithm",
          "Variable naming",
          "Code comments",
          "File structure",
        ],
        answer: 0,
      },
      {
        id: "q2",
        type: "mcq",
        difficulty: "Medium",
        question: "Which technique breaks a problem into smaller overlapping subproblems?",
        options: ["Recursion", "Dynamic Programming", "Sorting", "Hashing"],
        answer: 1,
      },
      {
        id: "q3",
        type: "conceptual",
        difficulty: "Easy",
        question: "Describe your general approach when you first see a new coding problem.",
        options: null,
        answer: null,
      },
    ],
  }),

  assessment({
    id: "react-fundamentals",
    title: "React Fundamentals",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Web Development",
    icon: "⚛",
    difficulty: "Medium",
    duration: 20,
    description: "Component state, props, and effects — the React essentials.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useRef", "useMemo"],
        answer: 1,
      },
      {
        id: "q2",
        type: "mcq",
        difficulty: "Easy",
        question: "What is used to pass data from a parent to a child component?",
        options: ["State", "Props", "Context only", "Redux only"],
        answer: 1,
      },
      {
        id: "q3",
        type: "output",
        difficulty: "Medium",
        question:
          "Given <button onClick={() => console.log('hi')}>Click</button>, what gets logged when clicked?",
        options: null,
        answer: "hi",
      },
      {
        id: "q4",
        type: "conceptual",
        difficulty: "Hard",
        question: "Explain when you would reach for useEffect in a component.",
        options: null,
        answer: null,
      },
    ],
  }),

  assessment({
    id: "web-dev-basics",
    title: "Web Development Basics",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Web Development",
    icon: "◫",
    difficulty: "Easy",
    duration: 15,
    description: "HTML and CSS fundamentals for building web pages.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<h1>", "<head>", "<header>"],
        answer: 1,
      },
      {
        id: "q2",
        type: "mcq",
        difficulty: "Easy",
        question: "Which CSS property controls text size?",
        options: ["font-weight", "font-size", "text-style", "font-color"],
        answer: 1,
      },
    ],
  }),

  assessment({
    id: "programming-fundamentals",
    title: "Programming Fundamentals",
    field: "Software Development",
    careerGoals: ["Software Developer"],
    category: "Programming Fundamentals",
    icon: "⌘",
    difficulty: "Easy",
    duration: 15,
    description: "The basic building blocks behind every programming language.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which of these is a loop structure?",
        options: ["if", "for", "switch", "try"],
        answer: 1,
      },
      {
        id: "q2",
        type: "conceptual",
        difficulty: "Easy",
        question: "Explain what a variable is in programming, in your own words.",
        options: null,
        answer: null,
      },
    ],
  }),

  /* ---------------- Data Analysis ---------------- */
  assessment({
    id: "data-analysis-core",
    title: "Data Analysis Assessment",
    field: "Data Analysis",
    careerGoals: ["Data Analyst"],
    category: "Data Analysis",
    icon: "▤",
    difficulty: "Mixed",
    duration: 30,
    description: "SQL, statistics, and data interpretation for analysts.",
    questions: [
      {
        id: "dac-1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which SQL clause filters groups after aggregation?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        answer: 1,
      },
      {
        id: "dac-2",
        type: "mcq",
        difficulty: "Easy",
        question: "What does the mean of a dataset represent?",
        options: [
          "The most frequent value",
          "The middle value",
          "The average value",
          "The spread of values",
        ],
        answer: 2,
      },
      {
        id: "dac-3",
        type: "data-interpretation",
        difficulty: "Easy",
        context: "A store's daily sales this week: Mon 120, Tue 150, Wed 90, Thu 200, Fri 180.",
        question: "Which day had the lowest sales?",
        options: ["Mon", "Tue", "Wed", "Thu"],
        answer: 2,
      },
      {
        id: "dac-4",
        type: "data-interpretation",
        difficulty: "Medium",
        context: "A dataset contains the values: 10, 12, 12, 15, 100.",
        question: "Which measure of central tendency is least affected by the outlier (100)?",
        options: ["Mean", "Median", "Range", "Sum"],
        answer: 1,
      },
      {
        id: "dac-5",
        type: "problem-solving",
        difficulty: "Medium",
        question:
          "You're given messy sales data with duplicate rows and missing values. Describe your cleaning approach before analysis.",
        options: null,
        answer: null,
      },
      {
        id: "dac-6",
        type: "conceptual",
        difficulty: "Medium",
        question: "Explain the difference between correlation and causation, with a short example.",
        options: null,
        answer: null,
      },
      {
        id: "dac-7",
        type: "mcq",
        difficulty: "Hard",
        question: "Which SQL JOIN returns only matching rows from both tables?",
        options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
        answer: 2,
      },
      {
        id: "dac-8",
        type: "problem-solving",
        difficulty: "Hard",
        question:
          "A dashboard shows revenue increased but profit decreased over the same quarter. What factors would you investigate?",
        options: null,
        answer: null,
      },
      {
        id: "dac-9",
        type: "logical-reasoning",
        difficulty: "Hard",
        context:
          "Product A converts at 4% and gets 3x the traffic of Product B, which converts at 6%.",
        question: "Based on total volume, which product likely drives more total conversions?",
        options: ["Product A", "Product B", "Both equal", "Cannot be determined"],
        answer: 0,
      },
    ],
  }),

  assessment({
    id: "sql-basics",
    title: "SQL Basics",
    field: "Data Analysis",
    careerGoals: ["Data Analyst"],
    category: "SQL",
    icon: "⌗",
    difficulty: "Easy",
    duration: 15,
    description: "Querying and filtering data with SQL.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which SQL keyword is used to filter rows?",
        options: ["SELECT", "WHERE", "ORDER BY", "GROUP BY"],
        answer: 1,
      },
      {
        id: "q2",
        type: "mcq",
        difficulty: "Easy",
        question: "What does COUNT(*) return?",
        options: ["Sum of all values", "Total number of rows", "Average value", "Maximum value"],
        answer: 1,
      },
    ],
  }),

  /* ---------------- Graphic Design ---------------- */
  assessment({
    id: "graphic-design-core",
    title: "Graphic Design Assessment",
    field: "Graphic Design",
    careerGoals: ["Graphic Designer"],
    category: "Design",
    icon: "◐",
    difficulty: "Mixed",
    duration: 25,
    description: "Design principles, typography, and visual reasoning.",
    questions: [
      {
        id: "gdc-1",
        type: "mcq",
        difficulty: "Easy",
        question: "Which color model is used for digital screens?",
        options: ["RGB", "CMYK", "Pantone", "Grayscale"],
        answer: 0,
      },
      {
        id: "gdc-2",
        type: "mcq",
        difficulty: "Easy",
        question: "What is 'kerning' in typography?",
        options: ["Line spacing", "Space between individual letters", "Font weight", "Column width"],
        answer: 1,
      },
      {
        id: "gdc-3",
        type: "conceptual",
        difficulty: "Easy",
        question: "Explain why whitespace is important in a design layout.",
        options: null,
        answer: null,
      },
      {
        id: "gdc-4",
        type: "scenario",
        difficulty: "Medium",
        question:
          "A client wants a logo that feels 'trustworthy and professional' for a bank. Which palette fits best?",
        options: ["Bright neon colors", "Deep blues and greys", "Pastel pinks", "Random rainbow gradient"],
        answer: 1,
      },
      {
        id: "gdc-5",
        type: "scenario",
        difficulty: "Medium",
        question:
          "Text on your poster is hard to read against the background image. What's the best first fix?",
        options: [
          "Increase image brightness randomly",
          "Add a contrasting overlay or adjust text color/contrast",
          "Make the text smaller",
          "Remove the text entirely",
        ],
        answer: 1,
      },
      {
        id: "gdc-6",
        type: "problem-solving",
        difficulty: "Medium",
        question: "A client keeps rejecting your design without clear feedback. How would you approach the next revision round?",
        options: null,
        answer: null,
      },
      {
        id: "gdc-7",
        type: "mcq",
        difficulty: "Hard",
        question: "What does the 'rule of thirds' help achieve in a composition?",
        options: [
          "A balanced, visually interesting composition",
          "Faster file export",
          "Better color accuracy",
          "Smaller file size",
        ],
        answer: 0,
      },
      {
        id: "gdc-8",
        type: "problem-solving",
        difficulty: "Hard",
        question:
          "You need to design a page that must work across both print and web. What constraints would you consider?",
        options: null,
        answer: null,
      },
      {
        id: "gdc-9",
        type: "conceptual",
        difficulty: "Hard",
        question: "Describe the difference between serif and sans-serif fonts and when you'd choose each.",
        options: null,
        answer: null,
      },
    ],
  }),

  /* ---------------- Digital Marketing ---------------- */
  assessment({
    id: "digital-marketing-core",
    title: "Digital Marketing Assessment",
    field: "Digital Marketing",
    careerGoals: ["Digital Marketer"],
    category: "Marketing",
    icon: "▲",
    difficulty: "Mixed",
    duration: 25,
    description: "SEO, campaign strategy, and marketing analytics.",
    questions: [
      {
        id: "dmc-1",
        type: "mcq",
        difficulty: "Easy",
        question: "What does SEO stand for?",
        options: [
          "Search Engine Optimization",
          "Site Engagement Overview",
          "Search Element Order",
          "Social Engagement Output",
        ],
        answer: 0,
      },
      {
        id: "dmc-2",
        type: "mcq",
        difficulty: "Easy",
        question: "Which metric measures the % of visitors who leave after viewing only one page?",
        options: ["Conversion Rate", "Bounce Rate", "Click-through Rate", "Retention Rate"],
        answer: 1,
      },
      {
        id: "dmc-3",
        type: "data-interpretation",
        difficulty: "Easy",
        context: "An ad campaign had 10,000 impressions and 250 clicks.",
        question: "What is the click-through rate (CTR)?",
        options: ["1%", "2.5%", "0.25%", "25%"],
        answer: 1,
      },
      {
        id: "dmc-4",
        type: "scenario",
        difficulty: "Medium",
        question: "Your email open rates are dropping steadily each month. What would you test first?",
        options: ["Subject lines / send time", "Font size only", "Server location", "Nothing, it's normal"],
        answer: 0,
      },
      {
        id: "dmc-5",
        type: "problem-solving",
        difficulty: "Medium",
        question:
          "A campaign has a high click-through rate but very low conversions. What could be wrong, and how would you investigate?",
        options: null,
        answer: null,
      },
      {
        id: "dmc-6",
        type: "data-interpretation",
        difficulty: "Medium",
        context: "Campaign A: ₹5000 spend, 200 conversions. Campaign B: ₹3000 spend, 150 conversions.",
        question: "Which campaign has a lower cost per conversion?",
        options: ["Campaign A", "Campaign B", "Both equal", "Cannot be determined"],
        answer: 1,
      },
      {
        id: "dmc-7",
        type: "mcq",
        difficulty: "Hard",
        question: "Which of these is a 'paid' marketing channel?",
        options: ["Organic search ranking", "Google Ads / PPC", "Word of mouth", "Direct traffic"],
        answer: 1,
      },
      {
        id: "dmc-8",
        type: "problem-solving",
        difficulty: "Hard",
        question:
          "You have a limited budget across SEO, paid ads, and social media for a new product launch. How would you decide the allocation?",
        options: null,
        answer: null,
      },
      {
        id: "dmc-9",
        type: "conceptual",
        difficulty: "Hard",
        question: "Explain the concept of a 'marketing funnel' in your own words.",
        options: null,
        answer: null,
      },
    ],
  }),

  /* ---------------- Business / Management ---------------- */
  assessment({
    id: "business-management-core",
    title: "Business & Management Assessment",
    field: "Business / Management",
    careerGoals: ["Business Manager", "Business Analyst"],
    category: "Business",
    icon: "◈",
    difficulty: "Mixed",
    duration: 25,
    description: "Business reasoning, decision-making, and case-study problems.",
    questions: [
      {
        id: "bmc-1",
        type: "mcq",
        difficulty: "Easy",
        question: "What does 'ROI' stand for?",
        options: ["Rate of Interest", "Return on Investment", "Risk of Inflation", "Ratio of Income"],
        answer: 1,
      },
      {
        id: "bmc-2",
        type: "mcq",
        difficulty: "Easy",
        question: "In a SWOT analysis, what does the 'O' stand for?",
        options: ["Objectives", "Opportunities", "Operations", "Outcomes"],
        answer: 1,
      },
      {
        id: "bmc-3",
        type: "conceptual",
        difficulty: "Easy",
        question: "Explain the difference between a manager and a leader, in your own words.",
        options: null,
        answer: null,
      },
      {
        id: "bmc-4",
        type: "scenario",
        difficulty: "Medium",
        question:
          "Two team members disagree strongly on project direction and it's affecting deadlines. What's your first step as the manager?",
        options: [
          "Ignore it and hope it resolves itself",
          "Meet each person separately to understand perspectives, then align the team",
          "Publicly pick a side",
          "Cancel the project",
        ],
        answer: 1,
      },
      {
        id: "bmc-5",
        type: "problem-solving",
        difficulty: "Medium",
        question: "Your team consistently misses sprint deadlines by 2-3 days. Walk through how you'd diagnose the root cause.",
        options: null,
        answer: null,
      },
      {
        id: "bmc-6",
        type: "mcq",
        difficulty: "Medium",
        question: "Which pricing strategy involves setting a high price and lowering it over time?",
        options: ["Penetration pricing", "Price skimming", "Cost-plus pricing", "Competitive pricing"],
        answer: 1,
      },
      {
        id: "bmc-7",
        type: "scenario",
        difficulty: "Hard",
        question: "A key client is unhappy with delayed delivery and threatens to leave. How do you respond?",
        options: [
          "Ignore the client until they calm down",
          "Acknowledge the issue, give a clear recovery plan and timeline",
          "Blame the delivery team publicly",
          "Offer a discount without addressing the cause",
        ],
        answer: 1,
      },
      {
        id: "bmc-8",
        type: "problem-solving",
        difficulty: "Hard",
        question:
          "You're asked to cut departmental costs by 15% without reducing output quality. What would you evaluate first?",
        options: null,
        answer: null,
      },
      {
        id: "bmc-9",
        type: "conceptual",
        difficulty: "Hard",
        question: "Describe what 'stakeholder management' means and why it matters for a project's success.",
        options: null,
        answer: null,
      },
    ],
  }),

  /* ---------------- Engineering ---------------- */
  assessment({
    id: "engineering-core",
    title: "Engineering Assessment",
    field: "Engineering",
    careerGoals: ["Mechanical Engineer", "Engineer"],
    category: "Engineering",
    icon: "⚙",
    difficulty: "Mixed",
    duration: 25,
    description: "Core concepts and numerical/technical problem solving.",
    questions: [
      {
        id: "ec-1",
        type: "mcq",
        difficulty: "Easy",
        question: "What is the SI unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        answer: 1,
      },
      {
        id: "ec-2",
        type: "mcq",
        difficulty: "Easy",
        question: "Which of these best describes 'stress' in mechanics?",
        options: ["Force per unit area", "Distance traveled", "Rate of change of velocity", "Mass times gravity"],
        answer: 0,
      },
      {
        id: "ec-3",
        type: "conceptual",
        difficulty: "Easy",
        question: "Explain, in your own words, the difference between stress and strain.",
        options: null,
        answer: null,
      },
      {
        id: "ec-4",
        type: "problem-solving",
        difficulty: "Medium",
        question: "A beam is deflecting more than expected under load. What factors would you check first?",
        options: null,
        answer: null,
      },
      {
        id: "ec-5",
        type: "logical-reasoning",
        difficulty: "Medium",
        question:
          "Machine A makes 40 units/hour, Machine B makes 25 units/hour. Working together, how long to produce 260 units?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        answer: 2,
      },
      {
        id: "ec-6",
        type: "mcq",
        difficulty: "Medium",
        question: "Which type of energy is stored in a compressed spring?",
        options: ["Kinetic energy", "Potential (elastic) energy", "Thermal energy", "Chemical energy"],
        answer: 1,
      },
      {
        id: "ec-7",
        type: "problem-solving",
        difficulty: "Hard",
        question:
          "You're designing a component that must withstand repeated loading cycles without failing. What design considerations come into play?",
        options: null,
        answer: null,
      },
      {
        id: "ec-8",
        type: "mcq",
        difficulty: "Hard",
        question: "What does 'factor of safety' represent in engineering design?",
        options: [
          "The exact load a part will fail at",
          "A margin between a part's strength and expected load",
          "The weight of the part",
          "The cost margin",
        ],
        answer: 1,
      },
      {
        id: "ec-9",
        type: "conceptual",
        difficulty: "Hard",
        question: "Explain why engineers use factor of safety instead of designing exactly to the calculated load.",
        options: null,
        answer: null,
      },
    ],
  }),
];

/* ---------------- Fields & career goals (for onboarding) ----------------
   Derived from ASSESSMENTS so onboarding options never drift out of
   sync with what recommendations can actually match against. */
export const FIELDS = Array.from(new Set(ASSESSMENTS.map((a) => a.field)));

export const CAREER_GOALS_BY_FIELD = FIELDS.reduce((acc, field) => {
  const goals = new Set();
  ASSESSMENTS.filter((a) => a.field === field).forEach((a) =>
    a.careerGoals.forEach((g) => goals.add(g))
  );
  acc[field] = Array.from(goals);
  return acc;
}, {});

/* Icon shown on the onboarding field-picker cards — reuses each
   field's "core" assessment icon so it stays visually consistent
   with the assessment cards later. */
export const FIELD_ICONS = FIELDS.reduce((acc, field) => {
  const core = ASSESSMENTS.find((a) => a.field === field);
  acc[field] = core?.icon || "◆";
  return acc;
}, {});

/* ---------------- Data-driven filter options ----------------
   Never hardcoded — always derived from ASSESSMENTS, so adding a
   new field/category later needs no changes here. */
export const CATEGORIES = ["All", ...Array.from(new Set(ASSESSMENTS.map((a) => a.category)))];

export const TYPE_FILTERS = ["All", ...QUESTION_TYPES.filter((t) => t !== "output")];

export const DIFFICULTY_FILTERS = ["All", ...DIFFICULTIES];

/* ---------------- Recommendations ----------------
   Matches the user's field first, falls back to career-goal match. */
export function getRecommendedAssessments(profile = getUserProfile()) {
  const byField = ASSESSMENTS.filter((a) => a.field === profile.field);
  if (byField.length) return byField.slice(0, 6);
  return ASSESSMENTS.filter((a) => a.careerGoals.includes(profile.careerGoal)).slice(0, 6);
}

/* ============================================================
   DAILY ASSESSMENTS
   One entry per day of the CURRENT month (28–31, calculated
   dynamically) — not a fixed count. Content rotates through the
   user's field-relevant question pool so it stays personalized.
============================================================ */

const DAILY_QUESTION_SOURCE = {
  "Software Development": ASSESSMENTS.find((a) => a.id === "software-development-core").questions,
  "Data Analysis": ASSESSMENTS.find((a) => a.id === "data-analysis-core").questions,
  "Graphic Design": ASSESSMENTS.find((a) => a.id === "graphic-design-core").questions,
  "Digital Marketing": ASSESSMENTS.find((a) => a.id === "digital-marketing-core").questions,
  "Business / Management": ASSESSMENTS.find((a) => a.id === "business-management-core").questions,
  Engineering: ASSESSMENTS.find((a) => a.id === "engineering-core").questions,
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* FIX: default param referenced an undefined `USER_PROFILE` before —
   this only stayed silent because getDailyAssessments() always passed
   `profile` explicitly. Fixed to call getUserProfile() like every
   other default in this file. */
export function generateDailyAssessments(profile = getUserProfile(), referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate(); // 28–31, calculated dynamically
  const today = referenceDate.getDate();

  const pool = DAILY_QUESTION_SOURCE[profile.field] || DAILY_QUESTION_SOURCE["Software Development"];
  const fieldSlug = slugify(profile.field);

  return Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const offset = (day - 1) % pool.length;
    const questions = Array.from({ length: Math.min(4, pool.length) }, (_, q) => pool[(offset + q) % pool.length]);
    const status = day < today ? "Completed" : day === today ? "Available" : "Locked";

    return assessment({
      id: `daily-${fieldSlug}-day-${day}`,
      title: `Day ${day} · ${profile.field} Practice`,
      field: profile.field,
      careerGoals: [profile.careerGoal],
      category: "Daily Practice",
      difficulty: "Mixed",
      duration: 10,
      description: `A short daily set to keep your ${profile.field} skills sharp.`,
      day,
      status,
      /* NEW: lets the calendar UI highlight today's cell without
         re-deriving the date itself. */
      isToday: day === today,
      questions,
    });
  });
}

/* Call this (not a precomputed constant) so it always reflects the
   current profile — the profile can change after onboarding without
   a full page reload since this is a client-side route. */
export function getDailyAssessments(profile = getUserProfile()) {
  return generateDailyAssessments(profile);
}

/* ---------------- Lookup ---------------- */
export function getAssessmentById(id) {
  if (id.startsWith("daily-")) {
    const daily = getDailyAssessments().find((d) => d.id === id);
    if (daily) return daily;
  }
  return ASSESSMENTS.find((a) => a.id === id) || null;
}