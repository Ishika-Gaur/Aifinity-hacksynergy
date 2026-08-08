/**
 * ConceptRoot Mock Data & Analysis Generator
 * Designed to be modular so it can easily be swapped with real backend API responses.
 */

export const NORMAL_ANSWER_PRESETS = [
  {
    id: "binary-search",
    title: "Binary Search Complexity",
    question: "What is the time complexity of binary search?",
    userAnswer: "O(n)",
    analysis: {
      status: "Incorrect",
      statusType: "error", // 'error' | 'warning' | 'success'
      detectedIssue: "Time complexity was identified as linear O(n).",
      rootConcept: "Binary Search Complexity",
      missingPrerequisite: "Understanding logarithmic growth",
      explanation:
        "Binary search eliminates roughly half of the remaining search space after each comparison, which leads to logarithmic time complexity O(log n) rather than linear O(n).",
      recommendedNext: "Review logarithmic complexity and divide-and-conquer concepts.",
      recommendedPractice:
        "Practice identifying time complexity for binary search, merge sort, and similar divide-and-conquer algorithms.",
    },
  },
  {
    id: "recursion-base-case",
    title: "Recursion Base Case",
    question: "Why does recursive factorial(n) cause stack overflow when n = -5?",
    userAnswer: "Because negative numbers cannot be factored.",
    analysis: {
      status: "Needs Review",
      statusType: "warning",
      detectedIssue: "Missing base case guard clause for negative integer inputs.",
      rootConcept: "Recursive Invariants & Base Cases",
      missingPrerequisite: "Mathematical Induction & Recursion Termination Guards",
      explanation:
        "Without checking if n <= 1 as a termination guard, calling factorial(-5) proceeds to n = -6, -7, endlessly until stack memory is exhausted.",
      recommendedNext: "Study recursion bounds, call stack limits, and defensive input validation.",
      recommendedPractice:
        "Write recursive functions with explicit base cases for boundary and negative values.",
    },
  },
];

export const CODE_SUBMISSION_PRESETS = [
  {
    id: "array-max",
    title: "Array Maximum (Boundary Bugs)",
    code: `function findMax(arr) {
  let max = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}`,
    analysis: {
      status: "Needs Review",
      statusType: "warning",
      detectedIssue:
        "Initialization and edge-case handling may cause incorrect results for arrays containing only negative values.",
      rootConcept: "Initialization and boundary conditions",
      missingPrerequisite: "Understanding edge cases and invariant initialization",
      explanation:
        "Initializing max to 0 assumes array elements will always be positive. If arr contains negative values like [-10, -5, -3], findMax returns 0 instead of -3.",
      recommendedNext: "Review initialization strategies and edge-case testing.",
      recommendedPractice:
        "Practice initializing boundary accumulator variables with initial array elements (e.g. max = arr[0]) or Number.NEGATIVE_INFINITY.",
    },
  },
  {
    id: "async-foreach",
    title: "Async Array Iteration",
    code: `async function fetchItems(ids) {
  let results = [];
  ids.forEach(async (id) => {
    const item = await api.get(id);
    results.push(item);
  });
  return results;
}`,
    analysis: {
      status: "Incorrect",
      statusType: "error",
      detectedIssue: "Array.prototype.forEach does not await asynchronous callbacks.",
      rootConcept: "Asynchronous Flow Control & Event Loop",
      missingPrerequisite: "Promises, async/await iteration semantics",
      explanation:
        "forEach executes callbacks asynchronously without waiting for promises to settle. fetchItems returns an empty array before any network calls complete.",
      recommendedNext: "Use for...of loops or Promise.all(ids.map(...)) for async operations.",
      recommendedPractice:
        "Refactor asynchronous loop logic using Promise.all or sequential for...of iteration.",
    },
  },
];

/**
 * Generate analysis for custom input (fallback when user modifies text)
 */
export function analyzeSubmission(mode, inputData) {
  if (mode === "normal") {
    // Match preset or fallback
    const matched = NORMAL_ANSWER_PRESETS.find(
      (p) => p.userAnswer.trim().toLowerCase() === inputData.userAnswer.trim().toLowerCase()
    );
    if (matched) return matched.analysis;

    return {
      status: "Needs Review",
      statusType: "warning",
      detectedIssue: `Concept gap detected in answer: "${inputData.userAnswer.slice(0, 40)}..."`,
      rootConcept: "Fundamental Conceptual Invariant",
      missingPrerequisite: "Core domain terminology and structural relationships",
      explanation:
        "The provided response shows a partial misunderstanding of the fundamental mechanics behind the question topic.",
      recommendedNext: "Review foundational principles and practice step-by-step reasoning.",
      recommendedPractice: "Solve guided practice problems focused on core definitions.",
    };
  } else {
    // Code mode match preset or fallback
    const matched = CODE_SUBMISSION_PRESETS.find(
      (p) => p.code.trim() === inputData.code.trim()
    );
    if (matched) return matched.analysis;

    return {
      status: "Needs Review",
      statusType: "warning",
      detectedIssue: "Potential logic flaw or boundary condition issue detected in submitted code.",
      rootConcept: "Algorithm Invariants & State Management",
      missingPrerequisite: "Boundary state checking and defensive programming",
      explanation:
        "The submitted logic may fail under specific edge cases, such as empty inputs, negative numbers, or unhandled concurrency.",
      recommendedNext: "Review input constraints, state mutations, and edge case assertions.",
      recommendedPractice: "Write unit tests covering boundary values and unexpected inputs.",
    };
  }
}
