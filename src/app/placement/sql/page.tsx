import Link from "next/link";
import { sqlImplementationTracks, sqlTracks } from "@/data/placement";
import styles from "../placement.module.css";

export default function SqlPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.mainPanel}>
        <h1 className={styles.sectionTitle}>SQL Sheet</h1>
        <div className={styles.cardGrid}>
          {sqlTracks.map((item) => (
            <Link key={item.title} href={item.href} className={`${styles.trackCard} ${styles.green}`}>
              <div><strong>{item.title}</strong><p>{item.description}</p></div>
              <span className={styles.startButton}>Start Learning</span>
            </Link>
          ))}
        </div>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Implementation Track</h2>
          <div className={styles.taskTrack}>
            {sqlImplementationTracks.map((track, index) => (
              <Link key={track.slug} href="/placement/sql/labs" className={styles.taskRow}>
                <div className={styles.taskIndex}><span>Track</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
                <div className={styles.taskBody}><h3>{track.title}</h3><p>{track.description}</p></div>
                <span className={styles.pill}>{track.tasks.length} Tasks</span>
                <div className="completion-circle" />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
