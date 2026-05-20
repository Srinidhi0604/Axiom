import Link from "next/link";
import { notFound } from "next/navigation";
import { getVibeTrack } from "@/data/vibe";
import styles from "../../../axiom.module.css";

export default async function VibeTrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: trackSlug } = await params;
  const track = getVibeTrack(trackSlug);
  if (!track) notFound();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <Link href="/vibe" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to Vibe Lab</Link>
          <h1 style={{ fontSize: 44, fontWeight: 950, marginTop: 18 }}>{track.title}</h1>
          <p className={styles.muted}>{track.description}</p>
        </div>
        <span className={styles.pill}>{track.tasks.length} Tasks</span>
      </div>

      <div className={styles.trackList}>
        {track.tasks.map((task, index) => (
          <Link className={styles.trackRow} href={`/vibe/tasks/${track.slug}/${task.slug}`} key={task.slug}>
            <div className={styles.index}><span>TASK</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.rowBody}>
              <h3>{task.title}</h3>
              <p className={styles.muted}>{task.description}</p>
            </div>
            <div className={styles.rowMeta}>
              <span className={styles.pill}>{task.kind}</span>
              <span className={styles.pill}>{task.difficulty}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
