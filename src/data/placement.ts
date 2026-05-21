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
  scalabilityBasics: [
    implementationTask("latency-histogram", "Latency Histogram", "Implement p50, p95, and p99 latency calculation for a stream of request durations.", "Micro", "easy"),
    implementationTask("capacity-estimator", "Capacity Estimator", "Estimate read QPS, write QPS, daily storage, and monthly bandwidth from product assumptions.", "Micro", "medium"),
  ],
  backOfEnvelope: [
    implementationTask("qps-storage-calculator", "QPS + Storage Calculator", "Build a reusable sizing helper for system design interviews.", "Micro", "easy"),
    implementationTask("powers-of-two", "Powers of Two Memorization", "Memorize latency numbers and storage units for interview sizing.", "Micro", "easy"),
  ],
  loadBalancing: [
    implementationTask("round-robin", "Round Robin", "Cycle traffic across healthy servers.", "Distributed", "easy"),
    implementationTask("weighted-round-robin", "Weighted Round Robin", "Route requests across healthy servers according to configured weights.", "Distributed", "medium"),
    implementationTask("least-connections", "Least Connections", "Pick the server with the fewest active requests.", "Distributed", "medium"),
    implementationTask("consistent-hashing", "Consistent Hashing", "Route sticky keys while minimizing movement.", "Distributed", "hard"),
  ],
  caching: [
    implementationTask("lru-cache-with-ttl", "LRU Cache with TTL", "Implement get/set eviction with TTL expiration and capacity control.", "Storage", "medium"),
    implementationTask("cache-aside-read", "Cache Aside Read", "Fetch from backing store on miss and hydrate cache.", "Storage", "medium"),
    implementationTask("write-through-cache", "Write Through Cache", "Write synchronously to cache and database.", "Storage", "medium"),
    implementationTask("negative-cache", "Negative Cache", "Cache missing objects safely with shorter TTL.", "Storage", "easy"),
  ],
  cdn: [
    implementationTask("asset-url-signer", "Asset URL Signer", "Generate and verify signed asset URLs with expiry for edge delivery.", "API", "medium"),
    implementationTask("cache-control-headers", "Cache Control Headers", "Set proper cache headers for edge and browser caching.", "API", "easy"),
  ],
  databaseIndexes: [
    implementationTask("secondary-index", "Secondary Index", "Maintain an email-to-user-id index alongside primary user records.", "Storage", "easy"),
    implementationTask("index-tradeoffs", "Index Tradeoffs", "Compare scan vs index lookup performance and storage overhead.", "Storage", "medium"),
  ],
  sqlVsNosql: [
    implementationTask("dual-data-model", "Dual Data Model", "Represent notifications as both normalized SQL-like tables and document records.", "Storage", "medium"),
    implementationTask("schema-design-tradeoffs", "Schema Design Tradeoffs", "Compare relational, document, and key-value models for a use case.", "Storage", "medium"),
  ],
  replication: [
    implementationTask("async-replica", "Async Replica", "Simulate primary writes, async replica lag, and read-your-writes behavior.", "Distributed", "hard"),
    implementationTask("failover-behavior", "Failover Behavior", "Implement primary failure detection and promotion.", "Distributed", "medium"),
  ],
  sharding: [
    implementationTask("hash-shard-router", "Hash Shard Router", "Route user IDs to shards and support adding a shard with minimal movement.", "Distributed", "medium"),
    implementationTask("shard-key-selection", "Shard Key Selection", "Choose shard keys to avoid hot partitions.", "Distributed", "hard"),
  ],
  consistencyPatterns: [
    implementationTask("eventual-like-counter", "Eventual Like Counter", "Merge per-region like counters and reconcile conflicts without losing increments.", "Distributed", "hard"),
    implementationTask("strong-consistency-vs-eventual", "Strong vs Eventual Consistency", "Compare consistency models and their tradeoffs.", "Distributed", "medium"),
  ],
  queuesAndStreams: [
    implementationTask("durable-job-queue", "Durable Job Queue", "Implement enqueue, lease, ack, retry, and dead-letter behavior.", "Distributed", "medium"),
    implementationTask("visibility-timeout", "Visibility Timeout", "Hide leased jobs until ack or timeout.", "Distributed", "medium"),
    implementationTask("idempotency-key", "Idempotency Key", "Avoid duplicate side effects for retried jobs.", "API", "medium"),
  ],
  apiDesign: [
    implementationTask("url-shortener-api", "URL Shortener API", "Design create, redirect, analytics, and pagination handlers for a URL shortener.", "API", "medium"),
    implementationTask("rest-resource-modeling", "REST Resource Modeling", "Design resource endpoints and HTTP methods for a domain.", "API", "easy"),
  ],
  rateLimitingChapter: [
    implementationTask("token-bucket-limiter", "Token Bucket Limiter", "Implement per-key token bucket rate limiting with refill over time.", "Micro", "medium"),
    implementationTask("sliding-window-limiter", "Sliding Window Limiter", "Implement a sliding-window limiter using timestamp buckets.", "Micro", "hard"),
    implementationTask("distributed-rate-limit", "Distributed Rate Limit", "Apply rate limits across distributed systems.", "Distributed", "hard"),
  ],
  searchSystems: [
    implementationTask("tiny-inverted-index", "Tiny Inverted Index", "Index documents by terms and rank search results using term frequency.", "Storage", "medium"),
    implementationTask("autocomplete-prefix-search", "Autocomplete Prefix Search", "Implement efficient prefix search with ranking.", "Storage", "medium"),
  ],
  monitoringAndReliability: [
    implementationTask("service-health-rollup", "Service Health Rollup", "Aggregate service checks into healthy, degraded, or down status.", "Micro", "easy"),
    implementationTask("alert-routing", "Alert Routing", "Route alerts based on severity and escalation policies.", "Micro", "medium"),
  ],
  designInterviewPlaybook: [
    implementationTask("end-to-end-design-doc", "End-to-End Design Doc", "Produce a structured design response for URL shortener, feed, chat, file store, or metrics.", "API", "hard"),
    implementationTask("bottleneck-analysis", "Bottleneck Analysis", "Identify and quantify bottlenecks in system design.", "API", "medium"),
  ],
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
    slug: "scalability-basics",
    title: "Scalability Basics",
    description: "Performance vs scalability, latency vs throughput, and the first-principles vocabulary from system-design-primer.",
    kind: "System Design",
    tags: ["Performance", "Scalability", "Fundamentals"],
    tasks: systemDesignTaskSets.scalabilityBasics,
  },
  {
    slug: "back-of-the-envelope",
    title: "Back of the Envelope",
    description: "Capacity estimates, powers of two, storage math, QPS, bandwidth, and interview sizing habits.",
    kind: "System Design",
    tags: ["Estimation", "Sizing", "Fundamentals"],
    tasks: systemDesignTaskSets.backOfEnvelope,
  },
  {
    slug: "load-balancing",
    title: "Load Balancing",
    description: "Layer 4 vs Layer 7, active-active, active-passive, health checks, and horizontal scaling.",
    kind: "System Design",
    tags: ["Networking", "Reliability", "Scalability"],
    tasks: systemDesignTaskSets.loadBalancing,
  },
  {
    slug: "caching",
    title: "Caching",
    description: "Client, CDN, web server, database, and application caching with cache-aside, write-through, and refresh-ahead.",
    kind: "System Design",
    tags: ["Cache", "Storage", "Latency"],
    tasks: systemDesignTaskSets.caching,
  },
  {
    slug: "cdn",
    title: "CDN",
    description: "Push vs pull CDNs, edge caching, invalidation, static assets, and global latency reduction.",
    kind: "System Design",
    tags: ["CDN", "Networking", "Latency"],
    tasks: systemDesignTaskSets.cdn,
  },
  {
    slug: "database-indexes",
    title: "Database Indexes",
    description: "Index tradeoffs, SQL tuning, read amplification, write overhead, and query-shape thinking.",
    kind: "System Design",
    tags: ["Database", "Storage", "Performance"],
    tasks: systemDesignTaskSets.databaseIndexes,
  },
  {
    slug: "sql-vs-nosql",
    title: "SQL vs NoSQL",
    description: "Relational, key-value, document, wide-column, and graph stores with practical selection heuristics.",
    kind: "System Design",
    tags: ["Database", "Storage", "Design"],
    tasks: systemDesignTaskSets.sqlVsNosql,
  },
  {
    slug: "replication",
    title: "Replication",
    description: "Master-slave, master-master, failover, read replicas, replication lag, and availability patterns.",
    kind: "System Design",
    tags: ["Database", "Reliability", "Distributed"],
    tasks: systemDesignTaskSets.replication,
  },
  {
    slug: "sharding",
    title: "Sharding",
    description: "Range, hash, directory-based sharding, hot partitions, rebalancing, and shard key selection.",
    kind: "System Design",
    tags: ["Database", "Scalability", "Distributed"],
    tasks: systemDesignTaskSets.sharding,
  },
  {
    slug: "consistency-patterns",
    title: "Consistency Patterns",
    description: "CAP, weak consistency, eventual consistency, strong consistency, and user-facing tradeoffs.",
    kind: "System Design",
    tags: ["Consistency", "Distributed", "Reliability"],
    tasks: systemDesignTaskSets.consistencyPatterns,
  },
  {
    slug: "queues-and-streams",
    title: "Queues and Streams",
    description: "Message queues, task queues, back pressure, retries, idempotency, and asynchronous workflows.",
    kind: "System Design",
    tags: ["Async", "Reliability", "Scalability"],
    tasks: systemDesignTaskSets.queuesAndStreams,
  },
  {
    slug: "api-design",
    title: "API Design",
    description: "REST, RPC, resource modeling, pagination, idempotent writes, versioning, and API contracts.",
    kind: "System Design",
    tags: ["API", "Design", "Fundamentals"],
    tasks: systemDesignTaskSets.apiDesign,
  },
  {
    slug: "rate-limiting",
    title: "Rate Limiting",
    description: "Fixed window, sliding window, token bucket, leaky bucket, distributed counters, and abuse protection.",
    kind: "System Design",
    tags: ["Security", "Scalability", "Cache"],
    tasks: systemDesignTaskSets.rateLimitingChapter,
  },
  {
    slug: "search-systems",
    title: "Search Systems",
    description: "Inverted indexes, ranking, autocomplete, write pipelines, indexing lag, and query fanout.",
    kind: "System Design",
    tags: ["Search", "Storage", "Scalability"],
    tasks: systemDesignTaskSets.searchSystems,
  },
  {
    slug: "monitoring-and-reliability",
    title: "Monitoring and Reliability",
    description: "SLOs, health checks, alerting, logs, metrics, tracing, graceful degradation, and failure drills.",
    kind: "System Design",
    tags: ["Monitoring", "Reliability", "Operations"],
    tasks: systemDesignTaskSets.monitoringAndReliability,
  },
  {
    slug: "design-interview-playbook",
    title: "Design Interview Playbook",
    description: "A repeatable interview method: requirements, API, data model, high-level design, bottlenecks, and tradeoffs.",
    kind: "System Design",
    tags: ["Interview", "Design", "Full-Stack"],
    tasks: systemDesignTaskSets.designInterviewPlaybook,
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
