import Link from "next/link";
import { systemDesignTracks } from "@/data/placement";
import styles from "../placement.module.css";

export default function SystemDesignPage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to PlacePrep"}
      </Link>
      <section style={{ marginTop: 58, marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.05 }}>System Design</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22 }}>
          {["donnemartin/system-design-primer", "Buildable", "Interview Ready"].map((tag) => (
            <span key={tag} className={styles.pill}>{tag}</span>
          ))}
        </div>
        <p style={{ color: "var(--text-secondary)", maxWidth: 780, lineHeight: 1.75, marginTop: 24 }}>
          Primer-backed tracks converted into PaperLabs-style implementation problems: read the concept, implement the primitive, then explain the system tradeoffs.
        </p>
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 22 }}>Implementation Track</h2>
          <span className={styles.pill}>{systemDesignTracks.length} Tracks</span>
        </div>
        <div className={styles.taskTrack}>
          {systemDesignTracks.map((track, index) => (
            <Link key={track.slug} href={`/placement/system-design/${track.slug}`} className={styles.taskRow}>
              <div className={styles.taskIndex}>
                <span>Track</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className={styles.taskBody}>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
              </div>
              <span className={styles.pill}>{track.tasks.length} Tasks</span>
              <div className="completion-circle" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
