export type GateQuestionType = "MCQ" | "MSQ" | "NAT" | "CODE";

export type GateSubject = {
  id: string;
  title: string;
  short: string;
  weightage: string;
  readiness: number;
  color: string;
  topics: string[];
  pyqs: number;
  formulas: GateFormula[];
};

export type GateFormula = {
  title: string;
  expression: string;
  note: string;
};

export type GateQuestion = {
  id: string;
  subjectId: string;
  year: number;
  type: GateQuestionType;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: 1 | 2;
  topic: string;
  timeLimit: string;
  title: string;
  prompt: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  codeStarter?: string;
  sampleTests?: { input: string; output: string }[];
};

export type GateMock = {
  id: string;
  title: string;
  durationSeconds: number;
  questions: string[];
  focus: string;
  status: "Ready" | "Building";
};

export const gateSubjects: GateSubject[] = [
  {
    id: "algorithms",
    title: "Algorithms",
    short: "Algo",
    weightage: "8-12 marks",
    readiness: 72,
    color: "#38bdf8",
    topics: ["Asymptotic analysis", "Divide and conquer", "Greedy", "Dynamic programming", "Graphs"],
    pyqs: 86,
    formulas: [
      { title: "Master theorem", expression: "T(n)=aT(n/b)+f(n)", note: "Compare f(n) with n^(log_b a)." },
      { title: "Dijkstra", expression: "O((V+E) log V)", note: "Binary heap adjacency-list implementation." },
      { title: "Knapsack state", expression: "dp[i][w]=max(skip,take)", note: "Classic 0/1 dynamic-programming transition." },
    ],
  },
  {
    id: "data-structures",
    title: "Data Structures",
    short: "DS",
    weightage: "6-10 marks",
    readiness: 66,
    color: "#22c55e",
    topics: ["Stacks and queues", "Trees", "BST and AVL", "Heaps", "Hashing"],
    pyqs: 74,
    formulas: [
      { title: "Complete tree height", expression: "floor(log2 n)", note: "Height when levels are filled left to right." },
      { title: "Open addressing", expression: "h(k,i)=(h(k)+i) mod m", note: "Linear probing sequence." },
      { title: "AVL balance", expression: "BF=height(left)-height(right)", note: "Allowed balance factors are -1, 0, and 1." },
    ],
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    short: "DBMS",
    weightage: "7-11 marks",
    readiness: 58,
    color: "#f59e0b",
    topics: ["ER models", "Relational algebra", "SQL", "Normalization", "Transactions"],
    pyqs: 93,
    formulas: [
      { title: "BCNF", expression: "X -> Y implies X is a superkey", note: "Use for every non-trivial dependency." },
      { title: "Conflict serializable", expression: "Acyclic precedence graph", note: "Cycle means not conflict serializable." },
      { title: "B+ tree fanout", expression: "floor(block / pointer-entry)", note: "Useful for index height questions." },
    ],
  },
  {
    id: "os",
    title: "Operating Systems",
    short: "OS",
    weightage: "7-10 marks",
    readiness: 61,
    color: "#a855f7",
    topics: ["Processes", "CPU scheduling", "Deadlocks", "Memory management", "File systems"],
    pyqs: 88,
    formulas: [
      { title: "Turnaround", expression: "completion - arrival", note: "Waiting time is turnaround minus burst." },
      { title: "Effective access", expression: "hit*time + miss*penalty", note: "Used in TLB and paging numericals." },
      { title: "Banker's safety", expression: "need <= available", note: "Find a sequence that can finish all processes." },
    ],
  },
  {
    id: "cn",
    title: "Computer Networks",
    short: "CN",
    weightage: "6-9 marks",
    readiness: 54,
    color: "#ef4444",
    topics: ["TCP/IP", "Routing", "Subnetting", "Flow control", "Congestion control"],
    pyqs: 69,
    formulas: [
      { title: "Subnet hosts", expression: "2^h - 2", note: "Traditional usable-host count." },
      { title: "Transmission delay", expression: "packet size / bandwidth", note: "Do not mix with propagation delay." },
      { title: "Window throughput", expression: "window size / RTT", note: "Upper bound without losses." },
    ],
  },
  {
    id: "toc",
    title: "Theory of Computation",
    short: "TOC",
    weightage: "7-10 marks",
    readiness: 49,
    color: "#ec4899",
    topics: ["DFA and NFA", "Regular expressions", "CFG", "PDA", "Decidability"],
    pyqs: 81,
    formulas: [
      { title: "DFA states", expression: "2^n subset construction", note: "NFA to DFA worst case." },
      { title: "CFG ambiguity", expression: "multiple parse trees", note: "One string with two leftmost derivations is enough." },
      { title: "Closure", expression: "Regular closed under complement", note: "Also closed under union, intersection, and difference." },
    ],
  },
  {
    id: "math",
    title: "Engineering Mathematics",
    short: "Math",
    weightage: "13-15 marks",
    readiness: 57,
    color: "#14b8a6",
    topics: ["Linear algebra", "Calculus", "Probability", "Discrete math", "Numerical methods"],
    pyqs: 112,
    formulas: [
      { title: "Bayes theorem", expression: "P(A|B)=P(B|A)P(A)/P(B)", note: "Common probability pattern." },
      { title: "Eigen equation", expression: "det(A-lambda I)=0", note: "Find characteristic roots first." },
      { title: "Inclusion-exclusion", expression: "|A union B|=|A|+|B|-|A cap B|", note: "Extend carefully for three sets." },
    ],
  },
  {
    id: "aptitude",
    title: "General Aptitude",
    short: "Apt",
    weightage: "15 marks",
    readiness: 78,
    color: "#eab308",
    topics: ["Verbal ability", "Numerical ability", "Reasoning", "Data interpretation", "Percentages"],
    pyqs: 120,
    formulas: [
      { title: "Percentage change", expression: "change/original x 100", note: "Track base value carefully." },
      { title: "Work rate", expression: "work = rate x time", note: "Add rates when people work together." },
      { title: "Compound interest", expression: "P(1+r/100)^n", note: "Use fractional n for partial periods." },
    ],
  },
];

export const gateQuestions: GateQuestion[] = [
  {
    id: "algo-2024-dp",
    subjectId: "algorithms",
    year: 2024,
    type: "MCQ",
    difficulty: "Medium",
    marks: 2,
    topic: "Dynamic Programming",
    timeLimit: "3 min",
    title: "Dynamic programming state count",
    prompt: "A 0/1 knapsack instance has 8 items and capacity 20. If the standard item-prefix and capacity DP table is used, how many states are evaluated?",
    options: ["160", "168", "189", "200"],
    answer: "189",
    explanation: "The table has (n+1)(W+1) states, so 9 x 21 = 189.",
  },
  {
    id: "algo-code-bfs",
    subjectId: "algorithms",
    year: 2023,
    type: "CODE",
    difficulty: "Medium",
    marks: 2,
    topic: "Graph Traversal",
    timeLimit: "8 min",
    title: "Implement BFS distance",
    prompt: "Write a function shortest_distance(graph, source, target) that returns the number of edges in the shortest unweighted path. Return -1 if unreachable.",
    answer: "queue",
    explanation: "A queue-based BFS explores vertices by distance layers, so the first time target is reached is shortest.",
    codeStarter: "def shortest_distance(graph, source, target):\n    # graph is a dict: node -> list of neighbors\n    pass\n",
    sampleTests: [
      { input: "{0:[1,2],1:[3],2:[3],3:[]}, 0, 3", output: "2" },
      { input: "{0:[1],1:[],2:[0]}, 0, 2", output: "-1" },
    ],
  },
  {
    id: "ds-2022-heap",
    subjectId: "data-structures",
    year: 2022,
    type: "NAT",
    difficulty: "Easy",
    marks: 1,
    topic: "Heaps",
    timeLimit: "2 min",
    title: "Heap height",
    prompt: "What is the height of a complete binary heap with 31 nodes? Use root height as 0.",
    answer: "4",
    explanation: "A complete heap with 31 nodes has 5 full levels, so height is 4.",
  },
  {
    id: "dbms-2021-normal",
    subjectId: "dbms",
    year: 2021,
    type: "MSQ",
    difficulty: "Hard",
    marks: 2,
    topic: "Normalization",
    timeLimit: "4 min",
    title: "Normal form checks",
    prompt: "Which statements are true for BCNF decomposition?",
    options: ["It is always dependency preserving", "It is always lossless", "Every determinant must be a superkey", "It removes all partial dependencies"],
    answer: ["It is always lossless", "Every determinant must be a superkey"],
    explanation: "BCNF decomposition can sacrifice dependency preservation, but the standard algorithm is lossless and enforces superkey determinants.",
  },
  {
    id: "os-2020-schedule",
    subjectId: "os",
    year: 2020,
    type: "NAT",
    difficulty: "Medium",
    marks: 2,
    topic: "CPU Scheduling",
    timeLimit: "3 min",
    title: "SJF waiting time",
    prompt: "Three processes arrive at time 0 with burst times 3, 5, and 9. What is the average waiting time under non-preemptive SJF?",
    answer: "3.67",
    explanation: "Order is 3, 5, 9. Waiting times are 0, 3, 8. Average is 11/3 = 3.67.",
  },
  {
    id: "cn-2019-subnet",
    subjectId: "cn",
    year: 2019,
    type: "MCQ",
    difficulty: "Medium",
    marks: 2,
    topic: "IPv4 Subnetting",
    timeLimit: "3 min",
    title: "Subnet host count",
    prompt: "How many usable host addresses are available in a traditional /27 IPv4 subnet?",
    options: ["30", "31", "32", "62"],
    answer: "30",
    explanation: "A /27 leaves 5 host bits. 2^5 - 2 = 30 usable addresses.",
  },
  {
    id: "toc-2023-regular",
    subjectId: "toc",
    year: 2023,
    type: "MCQ",
    difficulty: "Easy",
    marks: 1,
    topic: "Closure Properties",
    timeLimit: "2 min",
    title: "Regular language closure",
    prompt: "Which operation always preserves regularity?",
    options: ["Complement", "Undecidable mapping", "Context-free intersection", "Turing reduction"],
    answer: "Complement",
    explanation: "Regular languages are closed under complement by swapping accepting and rejecting DFA states.",
  },
  {
    id: "math-2024-prob",
    subjectId: "math",
    year: 2024,
    type: "NAT",
    difficulty: "Medium",
    marks: 2,
    topic: "Probability",
    timeLimit: "2 min",
    title: "Conditional probability",
    prompt: "If P(A)=0.5, P(B)=0.4, and P(A intersect B)=0.2, find P(A|B).",
    answer: "0.5",
    explanation: "P(A|B)=P(A intersect B)/P(B)=0.2/0.4=0.5.",
  },
  {
    id: "apt-2024-work",
    subjectId: "aptitude",
    year: 2024,
    type: "MCQ",
    difficulty: "Easy",
    marks: 1,
    topic: "Time and Work",
    timeLimit: "2 min",
    title: "Work rate",
    prompt: "A can finish a task in 10 days and B in 15 days. Together, how many days do they take?",
    options: ["4", "5", "6", "8"],
    answer: "6",
    explanation: "Combined rate is 1/10 + 1/15 = 1/6, so they take 6 days.",
  },
  {
    id: "algo-2022-master",
    subjectId: "algorithms",
    year: 2022,
    type: "MCQ",
    difficulty: "Medium",
    marks: 2,
    topic: "Recurrences",
    timeLimit: "3 min",
    title: "Master theorem case",
    prompt: "For T(n)=2T(n/2)+n log n, what is the tight asymptotic bound?",
    options: ["Theta(n)", "Theta(n log n)", "Theta(n log^2 n)", "Theta(n^2)"],
    answer: "Theta(n log^2 n)",
    explanation: "Here a=2, b=2, so n^(log_b a)=n. Since f(n)=n log n, case 2 with k=1 gives Theta(n log^2 n).",
  },
  {
    id: "ds-2021-stack",
    subjectId: "data-structures",
    year: 2021,
    type: "MSQ",
    difficulty: "Medium",
    marks: 2,
    topic: "Stacks and Expressions",
    timeLimit: "3 min",
    title: "Stack applications",
    prompt: "Which operations are natural stack applications?",
    options: ["Function call management", "Balanced parenthesis checking", "Level-order traversal queue", "Postfix expression evaluation"],
    answer: ["Function call management", "Balanced parenthesis checking", "Postfix expression evaluation"],
    explanation: "Function calls, parenthesis matching, and postfix evaluation are LIFO patterns. Level-order traversal is queue-based.",
  },
  {
    id: "dbms-2023-sql",
    subjectId: "dbms",
    year: 2023,
    type: "MCQ",
    difficulty: "Medium",
    marks: 2,
    topic: "SQL Aggregation",
    timeLimit: "3 min",
    title: "GROUP BY semantics",
    prompt: "In SQL, which clause filters groups after aggregation?",
    options: ["WHERE", "HAVING", "ORDER BY", "SELECT"],
    answer: "HAVING",
    explanation: "WHERE filters rows before grouping. HAVING filters grouped rows after aggregate computation.",
  },
  {
    id: "os-2022-paging",
    subjectId: "os",
    year: 2022,
    type: "NAT",
    difficulty: "Hard",
    marks: 2,
    topic: "Paging",
    timeLimit: "4 min",
    title: "Page offset bits",
    prompt: "A system has page size 4 KB. How many bits are required for the page offset?",
    answer: "12",
    explanation: "4 KB = 4096 bytes = 2^12 bytes, so the offset field needs 12 bits.",
  },
  {
    id: "cn-2021-delay",
    subjectId: "cn",
    year: 2021,
    type: "NAT",
    difficulty: "Medium",
    marks: 2,
    topic: "Delay Analysis",
    timeLimit: "3 min",
    title: "Transmission delay",
    prompt: "A 1500-byte packet is sent over a 1 Mbps link. What is the transmission delay in milliseconds?",
    answer: "12",
    explanation: "1500 bytes = 12000 bits. 12000 / 10^6 seconds = 0.012 seconds = 12 ms.",
  },
  {
    id: "toc-2022-dfa",
    subjectId: "toc",
    year: 2022,
    type: "MCQ",
    difficulty: "Medium",
    marks: 2,
    topic: "Finite Automata",
    timeLimit: "3 min",
    title: "DFA for divisibility",
    prompt: "A DFA that accepts binary strings whose numeric value is divisible by 3 needs at least how many states?",
    options: ["2", "3", "4", "6"],
    answer: "3",
    explanation: "The DFA tracks the remainder modulo 3, so three states are necessary and sufficient.",
  },
  {
    id: "math-2022-matrix",
    subjectId: "math",
    year: 2022,
    type: "NAT",
    difficulty: "Medium",
    marks: 2,
    topic: "Linear Algebra",
    timeLimit: "3 min",
    title: "Trace of a matrix",
    prompt: "If A has eigenvalues 2, 3, and 5, what is trace(A)?",
    answer: "10",
    explanation: "The trace of a square matrix equals the sum of its eigenvalues, counted with multiplicity.",
  },
  {
    id: "apt-2023-percent",
    subjectId: "aptitude",
    year: 2023,
    type: "MCQ",
    difficulty: "Easy",
    marks: 1,
    topic: "Percentages",
    timeLimit: "2 min",
    title: "Successive discount",
    prompt: "Two successive discounts of 10% and 20% are equivalent to a single discount of:",
    options: ["28%", "30%", "32%", "72%"],
    answer: "28%",
    explanation: "Remaining price is 0.9 x 0.8 = 0.72, so the effective discount is 28%.",
  },
  {
    id: "dbms-code-fd",
    subjectId: "dbms",
    year: 2020,
    type: "CODE",
    difficulty: "Hard",
    marks: 2,
    topic: "Functional Dependencies",
    timeLimit: "10 min",
    title: "Attribute closure helper",
    prompt: "Write attribute_closure(attrs, fds) that returns all attributes implied by attrs. fds is a list of (left_set, right_set).",
    answer: "changed",
    explanation: "Keep applying dependencies while the closure grows. The fixed point is the attribute closure.",
    codeStarter: "def attribute_closure(attrs, fds):\n    closure = set(attrs)\n    # fds: list of (set(left), set(right))\n    pass\n",
    sampleTests: [
      { input: "{'A'}, [({'A'}, {'B'}), ({'B'}, {'C'})]", output: "{'A','B','C'}" },
      { input: "{'A'}, [({'B'}, {'C'})]", output: "{'A'}" },
    ],
  },
];

export const gateMocks: GateMock[] = [
  {
    id: "diagnostic",
    title: "Diagnostic Mock",
    durationSeconds: 30 * 60,
    questions: ["algo-2024-dp", "ds-2022-heap", "cn-2019-subnet", "apt-2024-work", "dbms-2023-sql", "toc-2023-regular"],
    focus: "Find weak subjects before the study plan starts.",
    status: "Ready",
  },
  {
    id: "full-length-1",
    title: "Full Length CS Mock 1",
    durationSeconds: 180 * 60,
    questions: gateQuestions.filter((question) => question.type !== "CODE").map((question) => question.id),
    focus: "GATE pattern with MCQ, MSQ, NAT, and negative-marking awareness.",
    status: "Ready",
  },
  {
    id: "coding-sprint",
    title: "Coding Practice Sprint",
    durationSeconds: 45 * 60,
    questions: ["algo-code-bfs", "dbms-code-fd", "algo-2024-dp", "ds-2022-heap"],
    focus: "Code-heavy algorithm practice mixed with GATE-style checks.",
    status: "Ready",
  },
];

export const gateMilestones = [
  "Finish high-weight CS subjects with PYQ tagging",
  "Revise engineering mathematics and aptitude twice",
  "Attempt two mixed mocks every week",
  "Convert every wrong answer into a formula or concept card",
];

export function getGateSubject(subjectId: string) {
  return gateSubjects.find((subject) => subject.id === subjectId);
}

export function getGateQuestion(questionId: string) {
  return gateQuestions.find((question) => question.id === questionId);
}

export function getGateMock(testId: string) {
  return gateMocks.find((mock) => mock.id === testId);
}
