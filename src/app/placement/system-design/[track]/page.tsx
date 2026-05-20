import Link from "next/link";
import { notFound } from "next/navigation";
import { systemDesignTracks } from "@/data/placement";
import styles from "../../placement.module.css";

export default async function SystemDesignTrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const track = systemDesignTracks.find((item) => item.slug === slug);
  if (!track) notFound();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement/system-design" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to System Design"}
      </Link>
      <section style={{ marginTop: 58, marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.05 }}>{track.title}</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22 }}>
          {track.tags.map((tag) => <span key={tag} className={styles.pill}>{tag}</span>)}
        </div>
        <p style={{ color: "var(--text-secondary)", maxWidth: 780, lineHeight: 1.75, marginTop: 24 }}>{track.description}</p>
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 22 }}>Implementation Track</h2>
          <span className={styles.pill}>{track.tasks.length} {track.tasks.length === 1 ? "Task" : "Tasks"}</span>
        </div>
        <div className={styles.taskTrack}>
          {track.tasks.map((task, index) => (
            <Link key={task.slug} href={`/placement/system-design/${track.slug}/implement/${task.slug}`} className={styles.taskRow}>
              <div className={styles.taskIndex}>
                <span>Task</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className={styles.taskBody}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <span className={styles.pill}>{task.category}</span>
              <span className={`badge-${task.difficulty}`} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                {task.difficulty}
              </span>
              <div className="completion-circle" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
