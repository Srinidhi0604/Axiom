import Link from "next/link";
import { vibeTracks } from "@/data/vibe";
import styles from "../axiom.module.css";
import { VibeScanner } from "./VibeScanner";

export default function VibePage() {
  const taskCount = vibeTracks.reduce((count, track) => count + track.tasks.length, 0);

  return (
    <main className={styles.shell}>
      <div className={styles.hero} style={{ minHeight: "auto" }}>
        <div>
          <p className={styles.eyebrow}>Vibe Lab</p>
          <h1>Turn any GitHub repo into a learning lab.</h1>
          <p>
            Repo analysis, generated tasks, security drills, and scaling plans from the Vibe Lab reference repo,
            rebuilt inside the Axiom interface.
          </p>
          <div className={styles.heroActions}>
            <Link href="/vibe/tasks/repo-learning" className="btn-minimalist">Open Tasks</Link>
            <Link href="/vibe/tasks/security-lab" className="btn-secondary" style={{ textDecoration: "none" }}>Security Lab</Link>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Repo scanner</p>
          <VibeScanner />
        </div>
      </div>

      <section className={styles.wideGrid}>
        {[
          ["Tracks", vibeTracks.length, "/vibe/tasks/repo-learning"],
          ["Implementation Tasks", taskCount, "/vibe/tasks/repo-learning"],
          ["Modes", 6, "/vibe/map"],
        ].map(([label, value, href]) => (
          <Link className={styles.metric} href={String(href)} key={label} style={{ textDecoration: "none", color: "inherit" }}>
            <span className={styles.muted}>{label}</span>
            <strong>{Number(value).toLocaleString()}</strong>
          </Link>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Original Vibe Lab navigation</p><h2>Repo workflow</h2></div>
        </div>
        <div className={styles.grid}>
          {[
            ["Principles Map", "Architecture map and first-principles breakdown.", "/vibe/map"],
            ["Repo Tasks", "Generated learning tasks from a scan.", "/vibe/tasks/repo-learning"],
            ["Attack Lab", "Security vulnerabilities as implementation challenges.", "/vibe/security"],
            ["Scale Plan", "Mass-user survival plan with scaling tasks.", "/vibe/scale"],
            ["CEO Simulator", "Startup tickets, messages, users, equity, and sprint pressure.", "/vibe/ceo"],
          ].map(([title, desc, href]) => (
            <Link className={styles.card} href={href} key={title}>
              <div>
                <div className={styles.cardStripe} style={{ background: "#10B981" }} />
                <h3>{title}</h3>
                <p className={styles.muted}>{desc}</p>
              </div>
              <span className={styles.action}>Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Tracks</p><h2>Repo learning paths</h2></div>
        </div>
        <div className={styles.trackList}>
          {vibeTracks.map((track, index) => (
            <Link className={styles.trackRow} href={`/vibe/tasks/${track.slug}`} key={track.slug}>
              <div className={styles.index}><span>TRACK</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
              <div className={styles.rowBody}>
                <h3>{track.title}</h3>
                <p className={styles.muted}>{track.description}</p>
              </div>
              <div className={styles.rowMeta}>
                <span className={styles.pill}>{track.badge}</span>
                <span className={styles.pill}>{track.tasks.length} Tasks</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
