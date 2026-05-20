export type PrepDifficulty = "easy" | "medium" | "hard";

export type PrepTask = {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: PrepDifficulty;
  starter: string;
  tests: string[];
};

export type PrepTrack = {
  slug: string;
  title: string;
  description: string;
  kind: "DSA" | "System Design" | "LLD" | "Core CS" | "SQL" | "Aptitude";
  tags: string[];
  tasks: PrepTask[];
};

export const placementCategories = [
  { slug: "dsa", title: "DSA Sheets", description: "A2Z, SDE, Blind 75, playlists, CP and revision tracks.", href: "/placement/dsa" },
  { slug: "interview", title: "Interview Experience", description: "Company-wise questions and repeated interview patterns.", href: "/placement/companies" },
  { slug: "core-cs", title: "Core CS Subjects", description: "CN, DBMS, OS, OOP and implementation-heavy fundamentals.", href: "/placement/core/dbms" },
  { slug: "system-design", title: "System Design", description: "Primer-backed scalable systems with buildable tasks.", href: "/placement/system-design" },
];

export const dsaSheets = [
  { title: "A2Z Sheet", description: "Master DSA from basics to advanced.", href: "/placement/dsa" },
  { title: "Blind 75 Sheet", description: "Interview problems with video solutions.", href: "/placement/dsa?sheet=blind-75" },
  { title: "SDE Sheet", description: "Most frequently asked interview questions.", href: "/placement/dsa?sheet=sde" },
  { title: "Striver 79 Sheet", description: "Last minute preparation.", href: "/placement/dsa?sheet=striver-79" },
  { title: "DSA Concept Revision", description: "Theory, intuition and quick recall notes for every pattern.", href: "/placement/dsa?sheet=concept-revision" },
  { title: "Quick Revision", description: "Last-day checklist for patterns, templates and edge cases.", href: "/placement/dsa?sheet=quick-revision" },
  { title: "All Problems", description: "One searchable problem bank across sheets and playlists.", href: "/placement/dsa?sheet=all-problems" },
];

export const dsaPlaylists = [
  { title: "Fundamentals of Programming", description: "Flowcharts, logical thinking, language setup and basics.", href: "/placement/learn" },
  { title: "Array", description: "Learn from basics to advanced.", href: "/placement/dsa?topic=arrays" },
  { title: "Binary Search", description: "Patterns on answers, partitions, and sorted spaces.", href: "/placement/dsa?topic=binary-search" },
  { title: "Dynamic Programming", description: "Memoization, tabulation, subsequences, grids and stocks.", href: "/placement/dsa?topic=dynamic-programming" },
  { title: "Graphs", description: "Traversal, shortest paths, DSU, topo sort and MST.", href: "/placement/dsa?topic=graphs" },
  { title: "Trees", description: "Traversals, BST, LCA, views and path problems.", href: "/placement/dsa?topic=trees" },
  { title: "Tries", description: "Prefix trees, XOR tries and word-search patterns.", href: "/placement/dsa?topic=tries" },
  { title: "Stack & Queue", description: "Monotonic stack, queues, deques and expression parsing.", href: "/placement/dsa?topic=stack-queue" },
];

export const coreSubjects = [
  { title: "CN Sheet", description: "Most asked computer networks interview questions.", href: "/placement/core/cn" },
  { title: "DBMS Sheet", description: "Most asked DBMS interview questions.", href: "/placement/core/dbms" },
  { title: "OS Sheet", description: "Most asked operating system interview questions.", href: "/placement/core/os" },
  { title: "OOPS Sheet", description: "Object-oriented concepts, patterns and interview questions.", href: "/placement/core/oops" },
  { title: "OOP + LLD", description: "Design patterns and machine-coding rounds.", href: "/placement/lld" },
];

export const competitiveProgramming = [
  { title: "CP Sheet", description: "Level up competitive programming with curated problems.", href: "/placement/dsa?sheet=cp" },
];

export const blogs = [
  { title: "Arrays", description: "Fundamental data structure for storing elements of the same type.", href: "/placement/dsa?topic=arrays" },
  { title: "Introduction to DSA", description: "Primer on data structures and algorithms.", href: "/placement/roadmap" },
  { title: "Binary Search", description: "Efficient searching algorithm for sorted and monotonic spaces.", href: "/placement/dsa?topic=binary-search" },
  { title: "Binary Search Tree", description: "Hierarchical data structure with efficient search and updates.", href: "/placement/dsa?topic=trees" },
];

export const sqlTracks = [
  { title: "SQL Sheet", description: "Selects, joins, windows, CTEs and interview query patterns.", href: "/placement/sql" },
  { title: "SQL Labs", description: "Hands-on query playground with testable datasets.", href: "/placement/sql/labs" },
  { title: "DBMS Revision", description: "Transactions, indexing, normalization and storage fundamentals.", href: "/placement/core/dbms" },
];

export const aptitudeTracks = [
  { title: "Logical Reasoning", description: "Puzzles, arrangements, syllogisms and deduction sets.", href: "/placement/aptitude/logical-reasoning" },
  { title: "Quantitative Aptitude", description: "Numbers, percentages, time-work, probability and DI.", href: "/placement/aptitude/quantitative" },
  { title: "Verbal Ability", description: "Grammar, reading comprehension and placement verbal prep.", href: "/placement/aptitude/verbal" },
  { title: "Mock Test", description: "Timed mixed tests across DSA, CS, aptitude and SQL.", href: "/placement/aptitude/mock-test" },
];

export const dsaCourseSections = [
  {
    title: "Fundamentals of Programming",
    lessons: [
      "What is Programming?",
      "Flowcharts and Logical Thinking",
      "Pseudocode and Dry Run",
    ],
  },
  {
    title: "Language Basics",
    lessons: [
      "CPP Setup",
      "Cpp Basics",
      "Java Setup",
      "Java Basics",
      "Java OOPs Basic",
      "Python Setup",
      "Python Basics",
      "Python Libraries Part 1",
      "Python Libraries Part 2",
    ],
  },
  {
    title: "DSA Patterns",
    lessons: [
      "Arrays",
      "Binary Search",
      "Recursion",
      "Linked List",
      "Trees",
      "Graphs",
      "Dynamic Programming",
    ],
  },
];

function implementationTask(
  slug: string,
  title: string,
  description: string,
  category: string,
  difficulty: PrepDifficulty = "medium"
): PrepTask {
  return {
    slug,
    title,
    description,
    category,
    difficulty,
    starter: `// ${title}\nexport function solve(input) {\n  // TODO: implement ${title.toLowerCase()}\n  return input;\n}`,
    tests: [
      "Handles the happy path",
      "Handles empty and edge inputs",
      "Explains time, space and distributed tradeoffs",
    ],
  };
}

const systemDesignTaskSets = {
  rateLimiting: [
    implementationTask("token-bucket", "Token Bucket Limiter", "Implement per-key token bucket rate limiting with refill over time.", "Micro"),
    implementationTask("sliding-window", "Sliding Window Limiter", "Implement a sliding-window limiter using timestamp buckets.", "Micro", "hard"),
    implementationTask("fixed-window-counter", "Fixed Window Counter", "Implement fixed-window request counting with reset boundaries.", "Micro", "easy"),
    implementationTask("leaky-bucket", "Leaky Bucket Queue", "Smooth bursts using a leaky bucket queue and drain rate.", "Micro"),
    implementationTask("distributed-counter", "Distributed Counter Merge", "Merge per-node counters without losing increments.", "Distributed", "hard"),
    implementationTask("rate-limit-headers", "Rate Limit Headers", "Return remaining, reset and retry-after metadata for clients.", "API"),
    implementationTask("user-ip-policy", "User + IP Policy", "Apply separate limits for users, IPs and anonymous traffic.", "API"),
    implementationTask("burst-override", "Burst Override Rules", "Support tier-based burst capacity without pro/locked UI.", "Policy"),
    implementationTask("abuse-audit-log", "Abuse Audit Log", "Record rejected requests for later investigation.", "Storage"),
    implementationTask("hot-key-protection", "Hot Key Protection", "Detect a single key overwhelming limiter storage.", "Distributed", "hard"),
  ],
  caching: [
    implementationTask("lru-cache-with-ttl", "LRU Cache with TTL", "Implement get/set eviction with TTL expiration and capacity control.", "Storage"),
    implementationTask("cache-aside-read", "Cache Aside Read", "Fetch from backing store on miss and hydrate cache.", "Storage"),
    implementationTask("write-through-cache", "Write Through Cache", "Write synchronously to cache and database.", "Storage"),
    implementationTask("write-behind-queue", "Write Behind Queue", "Buffer writes and flush asynchronously.", "Distributed", "hard"),
    implementationTask("refresh-ahead", "Refresh Ahead", "Refresh hot keys before expiration.", "Storage"),
    implementationTask("negative-cache", "Negative Cache", "Cache missing objects safely with shorter TTL.", "Storage"),
    implementationTask("cache-invalidation", "Cache Invalidation", "Invalidate by key, prefix and version.", "Distributed"),
    implementationTask("two-level-cache", "Two Level Cache", "Coordinate local memory cache with shared cache.", "Distributed", "hard"),
    implementationTask("stale-while-revalidate", "Stale While Revalidate", "Serve stale value while refreshing in background.", "Storage"),
    implementationTask("cache-metrics", "Cache Metrics", "Track hit rate, miss rate, evictions and stale reads.", "Micro", "easy"),
  ],
  loadBalancing: [
    implementationTask("round-robin", "Round Robin", "Cycle traffic across healthy servers.", "Distributed", "easy"),
    implementationTask("weighted-round-robin", "Weighted Round Robin", "Route requests across healthy servers according to configured weights.", "Distributed"),
    implementationTask("least-connections", "Least Connections", "Pick the server with the fewest active requests.", "Distributed"),
    implementationTask("health-checks", "Health Checks", "Remove unhealthy servers and re-add recovered nodes.", "Reliability"),
    implementationTask("consistent-hashing", "Consistent Hashing", "Route sticky keys while minimizing movement.", "Distributed", "hard"),
    implementationTask("layer-7-routing", "Layer 7 Routing", "Route by path, host and request metadata.", "API"),
    implementationTask("active-passive", "Active Passive Failover", "Fail over from primary to standby service.", "Reliability"),
    implementationTask("active-active", "Active Active Routing", "Distribute traffic across active regions.", "Distributed", "hard"),
    implementationTask("connection-draining", "Connection Draining", "Stop sending new traffic while existing requests finish.", "Reliability"),
    implementationTask("load-balancer-metrics", "Load Balancer Metrics", "Track latency, errors and per-server load.", "Micro", "easy"),
  ],
  queues: [
    implementationTask("durable-job-queue", "Durable Job Queue", "Implement enqueue, lease, ack, retry, and dead-letter behavior.", "Distributed"),
    implementationTask("visibility-timeout", "Visibility Timeout", "Hide leased jobs until ack or timeout.", "Distributed"),
    implementationTask("retry-backoff", "Retry Backoff", "Retry failed jobs with exponential delay.", "Reliability"),
    implementationTask("dead-letter-queue", "Dead Letter Queue", "Move exhausted jobs to a separate queue.", "Reliability"),
    implementationTask("idempotency-key", "Idempotency Key", "Avoid duplicate side effects for retried jobs.", "API"),
    implementationTask("priority-queue", "Priority Queue", "Schedule urgent jobs before normal work.", "Storage"),
    implementationTask("delayed-jobs", "Delayed Jobs", "Run jobs only after a scheduled timestamp.", "Storage"),
    implementationTask("consumer-groups", "Consumer Groups", "Distribute partitions across workers.", "Distributed", "hard"),
    implementationTask("back-pressure", "Back Pressure", "Pause producers when queues are overloaded.", "Distributed", "hard"),
    implementationTask("queue-dashboard", "Queue Dashboard", "Expose lag, retries, failures and throughput.", "Micro", "easy"),
  ],
};

const lldTaskSets = {
  parkingLot: [
    implementationTask("vehicle-slot-allocation", "Vehicle Slot Allocation", "Implement a parking lot allocator for bikes, cars and trucks.", "LLD"),
    implementationTask("ticket-generation", "Ticket Generation", "Generate tickets with entry time, vehicle and slot metadata.", "LLD", "easy"),
    implementationTask("exit-and-payment", "Exit and Payment", "Calculate fees and close a parking ticket.", "LLD"),
    implementationTask("floor-strategy", "Floor Allocation Strategy", "Choose floors using nearest, cheapest or least-filled strategies.", "LLD"),
    implementationTask("display-board", "Display Board", "Show available slots by type on every floor.", "LLD", "easy"),
    implementationTask("reservation-flow", "Reservation Flow", "Reserve slots for a limited time window.", "LLD"),
    implementationTask("admin-operations", "Admin Operations", "Add floors, slots and pricing rules.", "LLD"),
    implementationTask("concurrent-parking", "Concurrent Parking", "Avoid double allocation under simultaneous requests.", "LLD", "hard"),
    implementationTask("payment-retry", "Payment Retry", "Handle failed payment and retry states.", "LLD"),
    implementationTask("parking-lot-tests", "Parking Lot Tests", "Build full machine-coding test coverage.", "LLD", "easy"),
  ],
  splitwise: [
    implementationTask("balance-simplifier", "Balance Simplifier", "Reduce group balances into minimal settlement transactions.", "LLD", "hard"),
    implementationTask("exact-expense", "Exact Expense", "Split expense by exact amounts.", "LLD", "easy"),
    implementationTask("percentage-expense", "Percentage Expense", "Split expense by percentages and validate totals.", "LLD"),
    implementationTask("equal-expense", "Equal Expense", "Split expense equally and handle rounding.", "LLD", "easy"),
    implementationTask("ledger", "User Ledger", "Maintain per-user incoming and outgoing balances.", "LLD"),
    implementationTask("group-expenses", "Group Expenses", "Create groups and add shared expenses.", "LLD"),
    implementationTask("settlement-history", "Settlement History", "Record settled transactions and audit trail.", "LLD"),
    implementationTask("expense-comments", "Expense Comments", "Attach comments and activity to expenses.", "LLD", "easy"),
    implementationTask("currency-conversion", "Currency Conversion", "Normalize multi-currency expenses.", "LLD", "hard"),
    implementationTask("splitwise-tests", "Splitwise Tests", "Build end-to-end machine coding tests.", "LLD", "easy"),
  ],
};

const sqlTaskSet = [
  implementationTask("department-top-earners", "Department Top Earners", "Write a query that returns each department's highest paid employees.", "Query"),
  implementationTask("second-highest-salary", "Second Highest Salary", "Find the second highest salary with null handling.", "Query", "easy"),
  implementationTask("rolling-average", "Rolling Average", "Compute rolling averages with window functions.", "Query"),
  implementationTask("retention-cohort", "Retention Cohort", "Calculate weekly user retention cohorts.", "Analytics", "hard"),
  implementationTask("duplicate-emails", "Duplicate Emails", "Find duplicate records and counts.", "Query", "easy"),
  implementationTask("market-analysis", "Market Analysis", "Join users, orders and items for buyer statistics.", "Query"),
  implementationTask("consecutive-logins", "Consecutive Logins", "Find users active for consecutive days.", "Analytics", "hard"),
  implementationTask("tree-hierarchy-sql", "Tree Hierarchy SQL", "Query manager-reporting hierarchies.", "Query"),
  implementationTask("top-products", "Top Products", "Rank products by category using dense rank.", "Analytics"),
  implementationTask("sql-test-harness", "SQL Test Harness", "Validate query output against expected rows.", "Query", "easy"),
];

export const systemDesignTracks: PrepTrack[] = [
  {
    slug: "rate-limiting",
    title: "Rate Limiting",
    description: "Token bucket, sliding window, distributed counters and abuse protection.",
    kind: "System Design",
    tags: ["Security", "Scalability", "Cache"],
    tasks: systemDesignTaskSets.rateLimiting,
  },
  {
    slug: "caching",
    title: "Caching",
    description: "Cache-aside, write-through, TTL, eviction and invalidation.",
    kind: "System Design",
    tags: ["Cache", "Storage", "Latency"],
    tasks: systemDesignTaskSets.caching,
  },
  {
    slug: "load-balancing",
    title: "Load Balancing",
    description: "Layer 4/7 balancing, health checks and weighted routing.",
    kind: "System Design",
    tags: ["Networking", "Reliability"],
    tasks: systemDesignTaskSets.loadBalancing,
  },
  {
    slug: "queues-and-streams",
    title: "Queues and Streams",
    description: "Retries, leases, dead-letter queues, back pressure and idempotency.",
    kind: "System Design",
    tags: ["Async", "Reliability"],
    tasks: systemDesignTaskSets.queues,
  },
];

export const lldTracks: PrepTrack[] = [
  {
    slug: "parking-lot",
    title: "Parking Lot",
    description: "Design entities, allocation strategy, tickets and payments.",
    kind: "LLD",
    tags: ["OOP", "Strategy", "Machine Coding"],
    tasks: lldTaskSets.parkingLot,
  },
  {
    slug: "splitwise",
    title: "Splitwise",
    description: "Model expenses, balances and settlement simplification.",
    kind: "LLD",
    tags: ["OOP", "Greedy", "Ledger"],
    tasks: lldTaskSets.splitwise,
  },
];

export const sqlImplementationTracks: PrepTrack[] = [
  {
    slug: "joins-and-aggregation",
    title: "Joins and Aggregation",
    description: "Implement interview SQL patterns with query-style tasks.",
    kind: "SQL",
    tags: ["SQL", "Joins", "Aggregation"],
    tasks: sqlTaskSet,
  },
];

export const allPlacementTracks = [...systemDesignTracks, ...lldTracks, ...sqlImplementationTracks];

export const companyQuestionBank = {
  intuit: [
    { title: "Two Sum", difficulty: "easy", topic: "Arrays", url: "https://leetcode.com/problems/two-sum/" },
    { title: "LRU Cache", difficulty: "medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/" },
    { title: "Number of Islands", difficulty: "medium", topic: "Graphs", url: "https://leetcode.com/problems/number-of-islands/" },
    { title: "Design Rate Limiter", difficulty: "hard", topic: "System Design", url: "/placement/system-design/rate-limiting" },
  ],
  amazon: [
    { title: "Merge Intervals", difficulty: "medium", topic: "Intervals", url: "https://leetcode.com/problems/merge-intervals/" },
    { title: "Top K Frequent Elements", difficulty: "medium", topic: "Heap", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
    { title: "Parking Lot LLD", difficulty: "medium", topic: "LLD", url: "/placement/lld/parking-lot" },
  ],
  google: [
    { title: "Word Ladder", difficulty: "hard", topic: "Graphs", url: "https://leetcode.com/problems/word-ladder/" },
    { title: "Serialize and Deserialize Binary Tree", difficulty: "hard", topic: "Trees", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    { title: "Load Balancer", difficulty: "medium", topic: "System Design", url: "/placement/system-design/load-balancing" },
  ],
  microsoft: [
    { title: "Valid Parentheses", difficulty: "easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/" },
    { title: "Clone Graph", difficulty: "medium", topic: "Graphs", url: "https://leetcode.com/problems/clone-graph/" },
    { title: "Splitwise LLD", difficulty: "hard", topic: "LLD", url: "/placement/lld/splitwise" },
  ],
} as const;
