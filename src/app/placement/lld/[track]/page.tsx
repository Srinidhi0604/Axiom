import Link from "next/link";
import { notFound } from "next/navigation";
import { lldTracks } from "@/data/placement";
import styles from "../../placement.module.css";

export default async function LldTrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const track = lldTracks.find((item) => item.slug === slug);
  if (!track) notFound();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement/lld" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to LLD"}
      </Link>
      <section style={{ marginTop: 58, marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.05 }}>{track.title}</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 780, lineHeight: 1.75, marginTop: 24 }}>{track.description}</p>
      </section>
      <div className={styles.taskTrack}>
        {track.tasks.map((task, index) => (
          <Link key={task.slug} href={`/placement/lld/${track.slug}/implement/${task.slug}`} className={styles.taskRow}>
            <div className={styles.taskIndex}><span>Task</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.taskBody}><h3>{task.title}</h3><p>{task.description}</p></div>
            <span className={styles.pill}>{task.category}</span>
            <div className="completion-circle" />
          </Link>
        ))}
      </div>
    </main>
  );
}
