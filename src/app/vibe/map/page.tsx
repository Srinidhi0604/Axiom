import Link from "next/link";
import styles from "../../axiom.module.css";

const principles = [
  ["Entrypoints", "Find where requests, events, and UI state enter the repo."],
  ["Data Ownership", "Name the models, stores, APIs, and persistence boundaries."],
  ["Control Flow", "Trace how an action moves from interface to backend and back."],
  ["Failure Modes", "List what breaks first: auth, DB, cache, queue, build, or deploy."],
  ["Refactor Targets", "Pick the smallest behavior-preserving slice that improves clarity."],
  ["Learning Tasks", "Convert each architectural insight into a concrete implementation task."],
];

export default function VibeMapPage() {
  return (
    <main className={styles.shell}>
      <Link href="/vibe" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to Vibe Lab</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>Principles Map</p>
        <h1 style={{ fontSize: 48, fontWeight: 950 }}>First-principles repo map</h1>
        <p className={styles.muted}>A Vibe Lab scan turns repository structure into mental-model blocks before generating tasks.</p>
      </section>
      <div className={styles.wideGrid} style={{ marginTop: 34 }}>
        {principles.map(([title, body], index) => (
          <article className={styles.card} key={title}>
            <div>
              <div className={styles.cardStripe} style={{ background: index % 2 ? "#06B6D4" : "#10B981" }} />
              <span className={styles.pill}>Block {index + 1}</span>
              <h3 style={{ marginTop: 18 }}>{title}</h3>
              <p className={styles.muted}>{body}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
