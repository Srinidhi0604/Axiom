import Link from "next/link";
import { notFound } from "next/navigation";
import { lldTracks } from "@/data/placement";
import { WorkspaceActions } from "@/app/placement/WorkspaceActions";
import styles from "../../../../placement.module.css";

export default async function LldTaskPage({ params }: { params: Promise<{ track: string; task: string }> }) {
  const { track: trackSlug, task: taskSlug } = await params;
  const track = lldTracks.find((item) => item.slug === trackSlug);
  const task = track?.tasks.find((item) => item.slug === taskSlug);
  if (!track || !task) notFound();

  return (
    <main className={styles.workspace}>
      <section className={styles.workspacePane}>
        <div className={styles.problemTopbar}>
          <Link href={`/placement/lld/${track.slug}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>←</Link>
          <strong>{task.title}</strong>
          <span className={`badge-${task.difficulty}`} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800 }}>{task.difficulty}</span>
        </div>
        <article className={styles.problemContent}>
          <h1>{task.title}</h1>
          <h2>Problem Description</h2>
          <p>{task.description}</p>
          <h2>Expected Design</h2>
          <p>Model entities, responsibilities, APIs, invariants and edge cases before coding.</p>
          <h2>Starter</h2>
          <pre className={styles.formula}>{task.starter}</pre>
          <h2>Acceptance Tests</h2>
          <ol>{task.tests.map((test) => <li key={test}>{test}</li>)}</ol>
        </article>
      </section>
      <section className={styles.editorPane}>
        <div className={styles.editorTopbar}>
          <div className={styles.tabs}><span className={styles.tab}>solution.ts</span><span className={styles.tab}>test.ts</span></div>
          <div className={styles.runRow}><WorkspaceActions /></div>
        </div>
        <div className={styles.editorBody}><pre className={styles.codeEditor}>{task.starter}</pre></div>
      </section>
    </main>
  );
}
