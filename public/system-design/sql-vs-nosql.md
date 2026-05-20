# SQL vs NoSQL

_Source: system-design-primer: RDBMS, NoSQL, SQL or NoSQL._

Relational, key-value, document, wide-column, and graph stores with practical selection heuristics.

## What You Build

Model the same notification product using SQL tables and a document schema, then compare queries.

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
