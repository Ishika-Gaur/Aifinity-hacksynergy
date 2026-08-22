/**
 * ConceptRoot Diagnostic Data & AI Integration Engine
 * Product: AIFinity
 *
 * Core ConceptRoot Schema (8 Fields):
 * 1. verdict: 'Incorrect' | 'Partially Correct' | 'Correct' | 'Correct with Weakness' | 'Ambiguous'
 * 2. verdictType: 'error' | 'warning' | 'success' | 'indigo' | 'info'
 * 3. whatYouGotRight: string | null (explicitly preserves correct understanding)
 * 4. whatNeedsAttention: string | null (pinpoints specific breakdown/anti-pattern)
 * 5. focusFirst: string (minimum prerequisite or core concept to study first)
 * 6. whyYoureGettingStuck: string (clear explanation of the underlying problem)
 * 7. personalizedExplanation: string (explanation tailored directly to student's answer)
 * 8. optionalNextStep: string (concrete actionable next step)
 */

export const NORMAL_ANSWER_PRESETS = [
  {
    id: "binary-search-incorrect",
    title: "Binary Search Complexity (Completely Incorrect)",
    category: "Completely Wrong",
    question: "What is the time complexity of Binary Search on a sorted array of size n?",
    userAnswer: "It is O(n) because it checks each element in the array one by one.",
    analysis: {
      verdict: "Incorrect",
      verdictType: "error",
      whatYouGotRight: null,
      whatNeedsAttention: "Assuming search must inspect every array element sequentially.",
      focusFirst: "Search Space Halving + Logarithmic Complexity O(log n)",
      whyYoureGettingStuck:
        "Linear search inspects items one-by-one, but binary search cuts the remaining items in half on every comparison step.",
      personalizedExplanation:
        "Your answer describes linear search (checking items sequentially). In binary search, because the array is sorted, comparing your target to the middle element eliminates half of the remaining elements instantly. Halving 1,000 items takes about 10 steps, which is logarithmic O(log n), not linear O(n).",
      optionalNextStep:
        "Trace binary search manually on an array of 16 numbers and count how many comparisons are made.",
    },
  },
  {
    id: "recursion-partially-correct",
    title: "Recursion Base Case (Partially Correct)",
    category: "Partially Correct",
    question: "Why does recursive factorial(n) cause a stack overflow when given negative numbers like n = -5?",
    userAnswer: "Because negative numbers don't have factorials in math and the recursion keeps calling itself.",
    analysis: {
      verdict: "Partially Correct",
      verdictType: "warning",
      whatYouGotRight:
        "You correctly identified that negative numbers cause infinite recursion and that factorials are mathematically defined for non-negative integers.",
      whatNeedsAttention:
        "Missing the execution mechanism — the code lacks a boundary guard clause (e.g. n <= 1 or n < 0) to stop recursion.",
      focusFirst: "Recursion Boundary Guards & Defensive Base Cases",
      whyYoureGettingStuck:
        "The runtime environment does not enforce math rules automatically. Without an explicit guard clause like `if (n <= 1) return 1`, factorial(-5) calls factorial(-6), -7, -8 endlessly until stack memory is exhausted.",
      personalizedExplanation:
        "Your mathematical intuition is spot-on: negative factorials aren't defined. However, inside code, the function follows execution rules, not math definitions. If your base case only checks `if (n === 1)`, starting at -5 decrements down forever (-6, -7, etc.). The fix requires adding a boundary guard clause.",
      optionalNextStep:
        "Add defensive validation like `if (n <= 1) return 1;` or throw an error for negative inputs at the start of your function.",
    },
  },
  {
    id: "quicksort-wrong-reasoning",
    title: "QuickSort vs Selection Sort (Correct Output, Flawed Reasoning)",
    category: "Wrong Reasoning",
    question: "Which sorting algorithm is faster on average: Selection Sort or QuickSort?",
    userAnswer: "QuickSort is faster because Selection Sort uses two loops and QuickSort uses only one loop.",
    analysis: {
      verdict: "Correct with Weakness",
      verdictType: "indigo",
      whatYouGotRight:
        "You correctly concluded that QuickSort is faster on average than Selection Sort.",
      whatNeedsAttention:
        "Fragile reasoning: QuickSort does not use 'only one loop' — it uses recursive partitioning with nested operations.",
      focusFirst: "Divide-and-Conquer Recurrences vs Iterative Comparison Loops",
      whyYoureGettingStuck:
        "Your final conclusion is right, but your justification is incorrect. Judging algorithm speed by counting visible loops in code leads to inaccurate complexity analysis.",
      personalizedExplanation:
        "You reached the right conclusion (QuickSort is O(n log n) average vs Selection Sort's O(n²)), but your reason ('QuickSort uses only one loop') is false. QuickSort uses recursive partitioning which makes multiple passes across sub-arrays. Time complexity comes from how problem sizes divide, not loop counts.",
      optionalNextStep:
        "Derive the recursion tree for QuickSort to visualize why its depth is log n rather than a single loop.",
    },
  },
  {
    id: "binary-search-unjustified",
    title: "Binary Search Complexity (Correct but Unjustified)",
    category: "Correct but Weak",
    question: "What is the time complexity of Binary Search?",
    userAnswer: "O(log n)",
    analysis: {
      verdict: "Correct with Weakness",
      verdictType: "indigo",
      whatYouGotRight:
        "Your time complexity answer of O(log n) is completely accurate.",
      whatNeedsAttention:
        "Surface-level response: You stated the complexity value without explaining how binary search achieves logarithmic growth.",
      focusFirst: "Justifying Complexity through Problem Size Reduction",
      whyYoureGettingStuck:
        "Memorizing complexity values without internalizing the divide-and-conquer mechanism makes it difficult to analyze modified algorithms in technical interviews.",
      personalizedExplanation:
        "Your answer 'O(log n)' is correct. To make your response interview-ready, explain the underlying mechanism: because each step divides the remaining search space in half (n, n/2, n/4 ... 1), requiring log₂ n comparisons to reach a single element.",
      optionalNextStep:
        "Write down a one-sentence explanation connecting array halving to log₂ n.",
    },
  },
  {
    id: "hashtable-completely-correct",
    title: "Hash Table Lookup (Completely Correct)",
    category: "Completely Correct",
    question: "Why does a hash table achieve O(1) average time complexity for lookups?",
    userAnswer:
      "The hash function converts the key directly into an array index in O(1) time, allowing direct memory access to the bucket without scanning items.",
    analysis: {
      verdict: "Correct",
      verdictType: "success",
      whatYouGotRight:
        "Flawless explanation! You correctly linked the hash function, direct index calculation, and array memory mapping to O(1) time complexity.",
      whatNeedsAttention: null,
      focusFirst: "Collision Resolution Mechanisms (Chaining vs Open Addressing)",
      whyYoureGettingStuck:
        "You aren't stuck! Your core conceptual understanding of hash table lookup mechanics is solid.",
      personalizedExplanation:
        "Great job! You cleanly articulated why hash table lookups are O(1) by highlighting direct index computation via hash functions. You demonstrate complete mastery on this concept.",
      optionalNextStep:
        "Explore collision resolution strategies (e.g. Separate Chaining vs Linear Probing) when multiple keys hash to the same bucket index.",
    },
  },
  {
    id: "memoization-ambiguous",
    title: "Dynamic Programming Memoization (Ambiguous)",
    category: "Ambiguous Input",
    question: "How does memoization improve performance in Dynamic Programming?",
    userAnswer: "It uses memory to make it faster.",
    analysis: {
      verdict: "Ambiguous",
      verdictType: "info",
      whatYouGotRight: null,
      whatNeedsAttention:
        "The response is too vague to evaluate whether you understand how caching subproblem results avoids re-computation.",
      focusFirst: "Memoization: Caching Overlapping Subproblems",
      whyYoureGettingStuck:
        "Stating that 'it uses memory' is broadly related, but does not explain what is stored or how it reduces exponential operations.",
      personalizedExplanation:
        "Your answer is ambiguous. While memoization does trade memory for speed, simply saying 'it uses memory' doesn't clarify whether you understand the mechanism: caching the return values of expensive recursive subproblems so identical inputs are looked up instead of recomputed. Could you elaborate on what gets stored and how it affects time complexity?",
      optionalNextStep:
        "Re-explain memoization specifically using recursive Fibonacci calls as an example.",
    },
  },
];

export const CODE_SUBMISSION_PRESETS = [
  {
    id: "array-max-negative-bug",
    title: "Array Maximum (Negative Numbers Bug)",
    category: "Code: Boundary Bug",
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
      verdict: "Partially Correct",
      verdictType: "warning",
      whatYouGotRight:
        "The loop structure, comparison mechanics, and array traversal are logically sound for positive numbers.",
      whatNeedsAttention:
        "Initial state assumption: Initializing `max = 0` causes the function to return incorrect results when all array elements are negative.",
      focusFirst: "Invariant Initialization & Boundary Conditions",
      whyYoureGettingStuck:
        "0 is an arbitrary constant. If input is `[-10, -5, -3]`, 0 is larger than all array elements, so the function returns 0 instead of -3.",
      personalizedExplanation:
        "Your array traversal is clean! However, by writing `let max = 0`, you assume the maximum element is at least 0. For negative array inputs like `[-10, -5]`, `0` remains the max, producing a wrong answer. Always initialize extreme accumulators with `arr[0]` or `Number.NEGATIVE_INFINITY`.",
      optionalNextStep:
        "Change `let max = 0;` to `let max = arr[0];` (and add an empty array check).",
    },
  },
  {
    id: "async-foreach-bug",
    title: "Async Array Iteration (Execution Semantics)",
    category: "Code: Logic Flaw",
    code: `async function fetchItems(ids) {
  let results = [];
  ids.forEach(async (id) => {
    const item = await api.get(id);
    results.push(item);
  });
  return results;
}`,
    analysis: {
      verdict: "Incorrect",
      verdictType: "error",
      whatYouGotRight:
        "You recognized that API calls are asynchronous and correctly used `async/await` inside the callback.",
      whatNeedsAttention:
        "`Array.prototype.forEach` does not await asynchronous promise resolutions before executing subsequent code.",
      focusFirst: "Promise Resolution in Iteration (Promise.all vs for...of)",
      whyYoureGettingStuck:
        "`forEach` triggers callbacks concurrently without awaiting their promises, so `fetchItems` returns `results` as `[]` immediately.",
      personalizedExplanation:
        "Your use of `async/await` shows good understanding of promises. However, `forEach` is synchronous and ignores promises returned by callback functions. Thus `results` is returned before any `api.get` call finishes. Use `await Promise.all(ids.map(id => api.get(id)))` or a `for...of` loop instead.",
      optionalNextStep:
        "Refactor the code using `Promise.all` with `ids.map()` to await all fetch operations concurrently.",
    },
  },
  {
    id: "nested-if-complex",
    title: "Boolean Logic & Control Flow (Unnecessarily Complex)",
    category: "Code: Unnecessary Complexity",
    code: `function isEligible(age, hasID) {
  if (age >= 18) {
    if (hasID === true) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}`,
    analysis: {
      verdict: "Correct with Weakness",
      verdictType: "indigo",
      whatYouGotRight:
        "Logical correctness: The function correctly returns `true` only when age is at least 18 AND `hasID` is true.",
      whatNeedsAttention:
        "Unnecessary complexity: Deeply nested `if/else` statements returning explicit boolean literals (`true`/`false`).",
      focusFirst: "Boolean Expression Simplification & Readability",
      whyYoureGettingStuck:
        "Your code yields correct behavior, but nested control flow with explicit boolean returns makes code verbose and error-prone.",
      personalizedExplanation:
        "Your logic works! The weakness is readability: comparison expressions naturally evaluate to boolean values. Instead of nested `if` statements, this can be written as a single clean line: `return age >= 18 && hasID;`.",
      optionalNextStep:
        "Refactor the function body into a single `return age >= 18 && hasID;` statement.",
    },
  },
  {
    id: "clean-binary-search-code",
    title: "Binary Search Implementation (Flawless Code)",
    category: "Code: Completely Correct",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
    analysis: {
      verdict: "Correct",
      verdictType: "success",
      whatYouGotRight:
        "Optimal implementation! You correctly handled pointer initialization, boundary conditions (`left <= right`), overflow-safe mid calculation, and index updates.",
      whatNeedsAttention: null,
      focusFirst: "Binary Search Variants (Lower Bound & Upper Bound)",
      whyYoureGettingStuck:
        "You are not stuck! Your code is clean, optimal, and robust against overflow.",
      personalizedExplanation:
        "Excellent code submission! You used `Math.floor(left + (right - left) / 2)` which avoids integer overflow issues, and your pointer movements (`left = mid + 1`, `right = mid - 1`) prevent infinite loops. Your code is complete and production-ready.",
      optionalNextStep:
        "Try extending this implementation to find the first occurrence of a duplicate target value.",
    },
  },
];

/**
 * System Prompt Generator for real AI / LLM Integration (e.g. Gemini 1.5/2.0 API)
 */
export function buildConceptRootPrompt(submission) {
  return `You are ConceptRoot AI, the diagnostic intelligence engine of AIFinity.
Your job is to analyze a student's answer or code submission and produce structured diagnostic feedback.

CRITICAL INSTRUCTION:
Do NOT simply mark an answer as wrong. Identify what the student understands, what is weak/incorrect, why it breaks, what they should focus on first, and provide a personalized explanation based specifically on their actual response.

Input Mode: ${submission.mode}
Question/Context: ${submission.question || "Code Review Analysis"}
Student Submission:
${submission.text || submission.code}

Return ONLY valid JSON matching this exact 8-field schema:
{
  "verdict": "Incorrect" | "Partially Correct" | "Correct" | "Correct with Weakness" | "Ambiguous",
  "verdictType": "error" | "warning" | "success" | "indigo" | "info",
  "whatYouGotRight": "string explaining what the student understood correctly, or null if completely wrong/ambiguous",
  "whatNeedsAttention": "string describing the exact conceptual gap, fragile reasoning, or code anti-pattern, or null if completely correct",
  "focusFirst": "string naming the single minimum prerequisite or concept to review first",
  "whyYoureGettingStuck": "string explaining the core mechanism behind the mistake in clear language",
  "personalizedExplanation": "string giving a targeted explanation referencing the student's actual response",
  "optionalNextStep": "string giving a concrete actionable step (e.g. review prerequisite, rewrite code)"
}`;
}

/**
 * Dynamic Analysis Generator (Mock/Offline fallback for custom user input)
 */
export function analyzeSubmission(mode, inputData) {
  if (mode === "normal") {
    const text = (inputData.userAnswer || "").trim().toLowerCase();

    // Check presets first
    const matched = NORMAL_ANSWER_PRESETS.find(
      (p) => p.userAnswer.trim().toLowerCase() === text
    );
    if (matched) return matched.analysis;

    // Dynamic heuristic classification
    if (text.length < 15) {
      return {
        verdict: "Ambiguous",
        verdictType: "info",
        whatYouGotRight: null,
        whatNeedsAttention: "The response is too brief to evaluate conceptual understanding.",
        focusFirst: "Explaining Step-by-Step Reasoning",
        whyYoureGettingStuck:
          "Very short answers make it difficult to determine whether you have a solid grasp of the underlying principles.",
        personalizedExplanation: `Your answer "${inputData.userAnswer}" lacks detailed context. To give you precise diagnostic feedback, ConceptRoot needs a bit more detail about your reasoning. Could you elaborate on your thought process?`,
        optionalNextStep: "Provide a 2-3 sentence explanation of how you arrived at this answer.",
      };
    }

    if (text.includes("o(n)") || text.includes("linear") || text.includes("wrong")) {
      return {
        verdict: "Incorrect",
        verdictType: "error",
        whatYouGotRight: null,
        whatNeedsAttention: "Conceptual misapplication of search algorithms.",
        focusFirst: "Divide-and-Conquer Logarithmic Halving",
        whyYoureGettingStuck:
          "Confusing sequential array traversal with recursive search space halving.",
        personalizedExplanation: `In your response "${inputData.userAnswer.slice(0, 50)}...", you applied a linear evaluation mindset. When a problem domain is structured or sorted, binary partitioning reduces problem size logarithmically rather than linearly.`,
        optionalNextStep: "Review divide-and-conquer fundamentals and logarithmic scale growth.",
      };
    }

    if (text.includes("because") || text.includes("so") || text.includes("if")) {
      return {
        verdict: "Partially Correct",
        verdictType: "warning",
        whatYouGotRight: "You demonstrated partial reasoning and attempted to justify your conclusion.",
        whatNeedsAttention: "The explanation leaves out boundary edge cases or prerequisite definitions.",
        focusFirst: "Boundary Condition Invariants",
        whyYoureGettingStuck:
          "Your intuition moves in the right direction, but misses a key constraint required for full correctness.",
        personalizedExplanation: `Your explanation "${inputData.userAnswer.slice(0, 60)}..." shows valid partial logic. However, it breaks down when applied to extreme edge cases or negative boundary inputs.`,
        optionalNextStep: "Test your reasoning against boundary cases to verify its stability.",
      };
    }

    return {
      verdict: "Correct with Weakness",
      verdictType: "indigo",
      whatYouGotRight: "Your core conclusion appears technically valid.",
      whatNeedsAttention: "The response lacks explicit technical justification.",
      focusFirst: "Rigorous Technical Justification",
      whyYoureGettingStuck:
        "Stating correct answers without step-by-step reasoning makes it harder to defend in technical evaluations.",
      personalizedExplanation: `Your answer "${inputData.userAnswer.slice(0, 60)}..." reaches an acceptable conclusion. Adding explicit justification will strengthen your conceptual depth.`,
      optionalNextStep: "Add a short sentence explaining the mechanism behind your answer.",
    };
  } else {
    // Code mode
    const code = (inputData.code || "").trim();

    const matched = CODE_SUBMISSION_PRESETS.find(
      (p) => p.code.trim() === code
    );
    if (matched) return matched.analysis;

    if (code.length < 20) {
      return {
        verdict: "Ambiguous",
        verdictType: "info",
        whatYouGotRight: null,
        whatNeedsAttention: "The submitted code snippet is incomplete or too short.",
        focusFirst: "Complete Function Definitions",
        whyYoureGettingStuck: "Cannot analyze algorithm structure without complete variable bindings and loop controls.",
        personalizedExplanation: "The code snippet provided is too brief to analyze execution flow or boundary behavior. Please submit a complete function.",
        optionalNextStep: "Paste a full function implementation including variable declarations.",
      };
    }

    if (code.includes("foreach") && code.includes("async")) {
      return CODE_SUBMISSION_PRESETS.find((p) => p.id === "async-foreach-bug").analysis;
    }

    if (code.includes("max = 0") || code.includes("min = 0")) {
      return CODE_SUBMISSION_PRESETS.find((p) => p.id === "array-max-negative-bug").analysis;
    }

    if ((code.match(/if/g) || []).length > 3) {
      return CODE_SUBMISSION_PRESETS.find((p) => p.id === "nested-if-complex").analysis;
    }

    return {
      verdict: "Correct",
      verdictType: "success",
      whatYouGotRight: "Clean syntax, proper variable scoping, and valid execution structure.",
      whatNeedsAttention: null,
      focusFirst: "Performance Profiling & Edge Case Assertions",
      whyYoureGettingStuck: "Your code runs cleanly and follows good structural practices!",
      personalizedExplanation: "Your submitted JavaScript code appears logically sound and well-structured. Core variables and return paths are clear.",
      optionalNextStep: "Write unit tests covering empty arrays and unexpected parameter types.",
    };
  }
}
