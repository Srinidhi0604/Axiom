# Caching

_Source: system-design-primer: cache, when to update the cache._

Client, CDN, web server, database, and application caching with cache-aside, write-through, and refresh-ahead.

## What You Build

Implement an LRU cache with TTL, cache-aside reads, and stale entry invalidation.

## LeetCode-Style Task

Implement the core primitive locally first. Keep the interface small, deterministic, and testable. After it works, write the system design explanation around the primitive instead of giving only theory.

## Required Deliverables

- Public API or function signature
- Data model and storage choice
- Happy-path algorithm
- Edge cases and failure modes
- Complexity or capacity estimate
- Tradeoffs and when to choose another design

## Interview Walkthrough

1. Clarify requirements and non-goals.
2. Estimate reads, writes, storage, and latency expectations.
3. Sketch the high-level design.
4. Drill into the primitive you implemented.
5. Discuss bottlenecks, consistency, availability, and observability.

## Practice Extension

Add one distributed constraint: multiple app servers, partial failure, cache invalidation, replication lag, hot keys, or rate spikes. Explain what changes and what remains the same.
