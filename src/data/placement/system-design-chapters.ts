export const systemDesignChapters = [
  {
    "slug": "scalability-basics",
    "title": "Scalability Basics",
    "chapter": 1,
    "readTime": "18 min",
    "description": "Performance vs scalability, latency vs throughput, and the first-principles vocabulary from system-design-primer.",
    "build": "Implement a tiny load simulator that measures p50, p95, p99 latency for a mock API.",
    "source": "system-design-primer: performance vs scalability, latency vs throughput"
  },
  {
    "slug": "back-of-the-envelope",
    "title": "Back of the Envelope",
    "chapter": 2,
    "readTime": "20 min",
    "description": "Capacity estimates, powers of two, storage math, QPS, bandwidth, and interview sizing habits.",
    "build": "Build a capacity calculator for reads, writes, storage, cache size, and network bandwidth.",
    "source": "system-design-primer: powers of two, latency numbers, study guide"
  },
  {
    "slug": "load-balancing",
    "title": "Load Balancing",
    "chapter": 3,
    "readTime": "22 min",
    "description": "Layer 4 vs Layer 7, active-active, active-passive, health checks, and horizontal scaling.",
    "build": "Implement round-robin, weighted round-robin, and least-connections routing over mock servers.",
    "source": "system-design-primer: load balancer, horizontal scaling"
  },
  {
    "slug": "caching",
    "title": "Caching",
    "chapter": 4,
    "readTime": "24 min",
    "description": "Client, CDN, web server, database, and application caching with cache-aside, write-through, and refresh-ahead.",
    "build": "Implement an LRU cache with TTL, cache-aside reads, and stale entry invalidation.",
    "source": "system-design-primer: cache, when to update the cache"
  },
  {
    "slug": "cdn",
    "title": "CDN",
    "chapter": 5,
    "readTime": "18 min",
    "description": "Push vs pull CDNs, edge caching, invalidation, static assets, and global latency reduction.",
    "build": "Design and implement a static asset URL signer with cache-control headers and purge simulation.",
    "source": "system-design-primer: content delivery network"
  },
  {
    "slug": "database-indexes",
    "title": "Database Indexes",
    "chapter": 6,
    "readTime": "21 min",
    "description": "Index tradeoffs, SQL tuning, read amplification, write overhead, and query-shape thinking.",
    "build": "Implement an in-memory secondary index for search-by-email and compare scan vs indexed lookup.",
    "source": "system-design-primer: database, SQL tuning"
  },
  {
    "slug": "sql-vs-nosql",
    "title": "SQL vs NoSQL",
    "chapter": 7,
    "readTime": "22 min",
    "description": "Relational, key-value, document, wide-column, and graph stores with practical selection heuristics.",
    "build": "Model the same notification product using SQL tables and a document schema, then compare queries.",
    "source": "system-design-primer: RDBMS, NoSQL, SQL or NoSQL"
  },
  {
    "slug": "replication",
    "title": "Replication",
    "chapter": 8,
    "readTime": "23 min",
    "description": "Master-slave, master-master, failover, read replicas, replication lag, and availability patterns.",
    "build": "Implement primary-replica writes with async replication lag and read-your-writes toggle.",
    "source": "system-design-primer: replication, fail-over"
  },
  {
    "slug": "sharding",
    "title": "Sharding",
    "chapter": 9,
    "readTime": "24 min",
    "description": "Range, hash, directory-based sharding, hot partitions, rebalancing, and shard key selection.",
    "build": "Implement hash-based routing for users across shards and simulate a resharding event.",
    "source": "system-design-primer: sharding, federation"
  },
  {
    "slug": "consistency-patterns",
    "title": "Consistency Patterns",
    "chapter": 10,
    "readTime": "22 min",
    "description": "CAP, weak consistency, eventual consistency, strong consistency, and user-facing tradeoffs.",
    "build": "Implement a eventually consistent like counter with conflict resolution and reconciliation.",
    "source": "system-design-primer: CAP theorem, consistency patterns"
  },
  {
    "slug": "queues-and-streams",
    "title": "Queues and Streams",
    "chapter": 11,
    "readTime": "21 min",
    "description": "Message queues, task queues, back pressure, retries, idempotency, and asynchronous workflows.",
    "build": "Implement a durable job queue with retry count, dead-letter state, and idempotency keys.",
    "source": "system-design-primer: asynchronism, message queues, back pressure"
  },
  {
    "slug": "api-design",
    "title": "API Design",
    "chapter": 12,
    "readTime": "19 min",
    "description": "REST, RPC, resource modeling, pagination, idempotent writes, versioning, and API contracts.",
    "build": "Implement REST endpoints for a URL shortener with create, redirect, analytics, and pagination.",
    "source": "system-design-primer: communication, REST, RPC"
  },
  {
    "slug": "rate-limiting",
    "title": "Rate Limiting",
    "chapter": 13,
    "readTime": "20 min",
    "description": "Fixed window, sliding window, token bucket, leaky bucket, distributed counters, and abuse protection.",
    "build": "Implement token bucket and sliding-window rate limiters with per-user and per-IP keys.",
    "source": "system-design-primer: security, availability, cache primitives"
  },
  {
    "slug": "search-systems",
    "title": "Search Systems",
    "chapter": 14,
    "readTime": "23 min",
    "description": "Inverted indexes, ranking, autocomplete, write pipelines, indexing lag, and query fanout.",
    "build": "Implement a tiny inverted index with prefix search and simple term-frequency ranking.",
    "source": "system-design-primer: real-world architectures and search-oriented design prompts"
  },
  {
    "slug": "monitoring-and-reliability",
    "title": "Monitoring and Reliability",
    "chapter": 15,
    "readTime": "20 min",
    "description": "SLOs, health checks, alerting, logs, metrics, tracing, graceful degradation, and failure drills.",
    "build": "Implement a health dashboard that aggregates service status, error rate, and latency buckets.",
    "source": "system-design-primer: availability patterns, real-world architectures"
  },
  {
    "slug": "design-interview-playbook",
    "title": "Design Interview Playbook",
    "chapter": 16,
    "readTime": "25 min",
    "description": "A repeatable interview method: requirements, API, data model, high-level design, bottlenecks, and tradeoffs.",
    "build": "Complete one end-to-end design: URL shortener, news feed, chat, file store, or metrics system.",
    "source": "system-design-primer: how to approach a system design interview question"
  }
] as const;
