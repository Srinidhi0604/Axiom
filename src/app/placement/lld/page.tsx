import Link from "next/link";
import { lldTracks } from "@/data/placement";
import styles from "../placement.module.css";

export default function LldPage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to PlacePrep"}
      </Link>
      <section style={{ marginTop: 58, marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.05 }}>LLD + Machine Coding</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 780, lineHeight: 1.75, marginTop: 24 }}>
          Object-oriented design rounds shaped as Axiom implementation tracks.
        </p>
      </section>
      <div className={styles.taskTrack}>
        {lldTracks.map((track, index) => (
          <Link key={track.slug} href={`/placement/lld/${track.slug}`} className={styles.taskRow}>
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
    </main>
  );
}
