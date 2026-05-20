export type SystemDesignTask = {
  slug: string;
  title: string;
  category: "Micro" | "API" | "Storage" | "Distributed";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  starter: string;
  tests: string[];
};

export const systemDesignTasks: Record<string, SystemDesignTask[]> = {
  "scalability-basics": [
    {
      slug: "latency-histogram",
      title: "Latency Histogram",
      category: "Micro",
      difficulty: "easy",
      description: "Implement p50, p95, and p99 latency calculation for a stream of request durations.",
      starter: "function summarizeLatency(samples: number[]) {\n  // return { p50, p95, p99 }\n}",
      tests: ["Handles unsorted samples", "Rounds percentile index consistently", "Returns zeroes for empty input"],
    },
    {
      slug: "capacity-estimator",
      title: "Capacity Estimator",
      category: "Micro",
      difficulty: "medium",
      description: "Estimate read QPS, write QPS, daily storage, and monthly bandwidth from product assumptions.",
      starter: "function estimateCapacity(input) {\n  // users, readsPerUser, writesPerUser, objectBytes\n}",
      tests: ["Computes daily writes", "Computes storage growth", "Computes read bandwidth"],
    },
  ],
  "back-of-the-envelope": [
    {
      slug: "qps-storage-calculator",
      title: "QPS + Storage Calculator",
      category: "Micro",
      difficulty: "easy",
      description: "Build a reusable sizing helper for system design interviews.",
      starter: "function sizeSystem({ dau, readsPerDay, writesPerDay, payloadBytes }) {\n  // calculate qps and bytes/day\n}",
      tests: ["Converts per-day traffic to QPS", "Handles peak multiplier", "Formats large byte values"],
    },
  ],
  "load-balancing": [
    {
      slug: "weighted-round-robin",
      title: "Weighted Round Robin",
      category: "Distributed",
      difficulty: "medium",
      description: "Route requests across healthy servers according to configured weights.",
      starter: "class WeightedRoundRobin {\n  constructor(servers) {}\n  next() {}\n}",
      tests: ["Skips unhealthy servers", "Honors weights over a cycle", "Returns null when none are healthy"],
    },
  ],
  "caching": [
    {
      slug: "lru-cache-with-ttl",
      title: "LRU Cache with TTL",
      category: "Storage",
      difficulty: "medium",
      description: "Implement get/set eviction with TTL expiration and capacity control.",
      starter: "class LruCache {\n  constructor(capacity, now = () => Date.now()) {}\n  get(key) {}\n  set(key, value, ttlMs) {}\n}",
      tests: ["Evicts least recently used key", "Expires stale keys", "Refreshes recency on get"],
    },
  ],
  "cdn": [
    {
      slug: "asset-url-signer",
      title: "Asset URL Signer",
      category: "API",
      difficulty: "medium",
      description: "Generate and verify signed asset URLs with expiry for edge delivery.",
      starter: "function signAssetUrl(path, expiresAt, secret) {\n  // return signed URL\n}",
      tests: ["Rejects expired signatures", "Rejects tampered path", "Accepts valid signature"],
    },
  ],
  "database-indexes": [
    {
      slug: "secondary-index",
      title: "Secondary Index",
      category: "Storage",
      difficulty: "easy",
      description: "Maintain an email-to-user-id index alongside primary user records.",
      starter: "class UserStore {\n  create(user) {}\n  findByEmail(email) {}\n}",
      tests: ["Finds by indexed email", "Updates index on email change", "Prevents duplicate emails"],
    },
  ],
  "sql-vs-nosql": [
    {
      slug: "dual-data-model",
      title: "Dual Data Model",
      category: "Storage",
      difficulty: "medium",
      description: "Represent notifications as both normalized SQL-like tables and document records.",
      starter: "function modelNotification(notification) {\n  // return { relational, document }\n}",
      tests: ["Keeps recipient query efficient", "Supports status updates", "Preserves metadata"],
    },
  ],
  "replication": [
    {
      slug: "async-replica",
      title: "Async Replica",
      category: "Distributed",
      difficulty: "hard",
      description: "Simulate primary writes, async replica lag, and read-your-writes behavior.",
      starter: "class ReplicatedStore {\n  write(key, value) {}\n  read(key, options) {}\n  tick() {}\n}",
      tests: ["Primary is immediately consistent", "Replica lags until tick", "Read-your-writes routes correctly"],
    },
  ],
  "sharding": [
    {
      slug: "hash-shard-router",
      title: "Hash Shard Router",
      category: "Distributed",
      difficulty: "medium",
      description: "Route user IDs to shards and support adding a shard with minimal movement notes.",
      starter: "function shardForKey(key, shardCount) {\n  // stable hash route\n}",
      tests: ["Routes deterministically", "Distributes common keys", "Handles shard count changes"],
    },
  ],
  "consistency-patterns": [
    {
      slug: "eventual-like-counter",
      title: "Eventual Like Counter",
      category: "Distributed",
      difficulty: "hard",
      description: "Merge per-region like counters and reconcile conflicts without losing increments.",
      starter: "function mergeCounters(regions) {\n  // return global count and vector state\n}",
      tests: ["Merges independent increments", "Is idempotent", "Handles duplicate sync events"],
    },
  ],
  "queues-and-streams": [
    {
      slug: "durable-job-queue",
      title: "Durable Job Queue",
      category: "Distributed",
      difficulty: "medium",
      description: "Implement enqueue, lease, ack, retry, and dead-letter behavior.",
      starter: "class JobQueue {\n  enqueue(job) {}\n  lease(workerId) {}\n  ack(jobId) {}\n  fail(jobId) {}\n}",
      tests: ["Retries failed jobs", "Moves exhausted jobs to DLQ", "Does not double-lease active jobs"],
    },
  ],
  "api-design": [
    {
      slug: "url-shortener-api",
      title: "URL Shortener API",
      category: "API",
      difficulty: "medium",
      description: "Design create, redirect, analytics, and pagination handlers for a URL shortener.",
      starter: "function createShortUrl(longUrl, userId) {\n  // return slug and metadata\n}",
      tests: ["Creates stable slug", "Redirect increments analytics", "Lists URLs with cursor pagination"],
    },
  ],
  "rate-limiting": [
    {
      slug: "token-bucket",
      title: "Token Bucket",
      category: "Micro",
      difficulty: "medium",
      description: "Implement per-key token bucket rate limiting with refill over time.",
      starter: "class TokenBucketLimiter {\n  constructor({ capacity, refillPerSecond, now }) {}\n  allow(key) {}\n}",
      tests: ["Allows initial burst", "Refills over elapsed time", "Separates users by key"],
    },
    {
      slug: "sliding-window",
      title: "Sliding Window Limiter",
      category: "Micro",
      difficulty: "hard",
      description: "Implement a sliding-window limiter using timestamp buckets.",
      starter: "class SlidingWindowLimiter {\n  constructor({ limit, windowMs, now }) {}\n  allow(key) {}\n}",
      tests: ["Rejects over limit", "Expires old events", "Handles boundary timestamps"],
    },
  ],
  "search-systems": [
    {
      slug: "tiny-inverted-index",
      title: "Tiny Inverted Index",
      category: "Storage",
      difficulty: "medium",
      description: "Index documents by terms and rank search results using term frequency.",
      starter: "class InvertedIndex {\n  add(id, text) {}\n  search(query) {}\n}",
      tests: ["Finds matching documents", "Ranks repeated terms higher", "Supports prefix search"],
    },
  ],
  "monitoring-and-reliability": [
    {
      slug: "service-health-rollup",
      title: "Service Health Rollup",
      category: "Micro",
      difficulty: "easy",
      description: "Aggregate service checks into healthy, degraded, or down status.",
      starter: "function rollupHealth(checks) {\n  // return service status\n}",
      tests: ["Marks down on critical failure", "Marks degraded on high latency", "Keeps healthy checks green"],
    },
  ],
  "design-interview-playbook": [
    {
      slug: "end-to-end-design-doc",
      title: "End-to-End Design Doc",
      category: "API",
      difficulty: "hard",
      description: "Produce a structured design response for URL shortener, feed, chat, file store, or metrics.",
      starter: "function outlineDesign(problem) {\n  // requirements, APIs, storage, architecture, bottlenecks\n}",
      tests: ["Includes functional requirements", "Includes APIs and data model", "Includes bottlenecks and tradeoffs"],
    },
  ],
};
