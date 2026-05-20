import Link from "next/link";
import { getVibeTrack } from "@/data/vibe";
import styles from "../../axiom.module.css";

const recommendations = [
  ["1k users", "Add indexes and pagination before the first growth spike."],
  ["10k users", "Cache hot reads, batch writes, and define p95/p99 dashboards."],
  ["100k users", "Move slow work into queues and add load shedding."],
  ["1M users", "Partition hot paths, test failover, and rehearse recovery."],
];

export default function VibeScalePage() {
  const track = getVibeTrack("scale-plan");

  return (
    <main className={styles.shell}>
      <Link href="/vibe" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to Vibe Lab</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>Repo scan and tasks</p>
        <h1 style={{ fontSize: 48, fontWeight: 950 }}>Mass-user survival plan</h1>
        <p className={styles.muted}>Scaling recommendations plus implementation tasks for indexes, cache, queues, backpressure, and observability.</p>
      </section>
      <div className={styles.wideGrid} style={{ marginTop: 34 }}>
        {recommendations.map(([title, body]) => (
          <article className={styles.card} key={title}>
            <div><div className={styles.cardStripe} style={{ background: "#06B6D4" }} /><span className={styles.pill}>{title}</span><h3 style={{ marginTop: 18 }}>Likely failure</h3><p className={styles.muted}>{body}</p></div>
          </article>
        ))}
      </div>
      <div className={styles.trackList} style={{ marginTop: 34 }}>
        {track?.tasks.map((task, index) => (
          <Link className={styles.trackRow} href={`/vibe/tasks/scale-plan/${task.slug}`} key={task.slug}>
            <div className={styles.index}><span>Scale</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.rowBody}><h3>{task.title}</h3><p className={styles.muted}>{task.description}</p></div>
            <div className={styles.rowMeta}><span className={styles.pill}>{task.kind}</span><span className={styles.pill}>{task.difficulty}</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
