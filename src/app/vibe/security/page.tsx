import Link from "next/link";
import { getVibeTrack } from "@/data/vibe";
import styles from "../../axiom.module.css";

export default function VibeSecurityPage() {
  const track = getVibeTrack("security-lab");

  return (
    <main className={styles.shell}>
      <Link href="/vibe" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to Vibe Lab</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>Cyber Attack Simulation Lab</p>
        <h1 style={{ fontSize: 48, fontWeight: 950 }}>Security vulnerabilities</h1>
        <p className={styles.muted}>Each issue is a PaperLabs-style implementation challenge: read the vulnerability, patch it, run, submit.</p>
      </section>
      <div className={styles.trackList} style={{ marginTop: 34 }}>
        {track?.tasks.map((task, index) => (
          <Link className={styles.trackRow} href={`/vibe/tasks/security-lab/${task.slug}`} key={task.slug}>
            <div className={styles.index}><span>Attack</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.rowBody}><h3>{task.title}</h3><p className={styles.muted}>{task.description}</p></div>
            <div className={styles.rowMeta}><span className={styles.pill}>{task.kind}</span><span className={styles.pill}>{task.difficulty}</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
