import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkspaceActions } from "@/app/placement/WorkspaceActions";
import { getVibeTask } from "@/data/vibe";
import styles from "../../../../axiom.module.css";

export default async function VibeTaskPage({ params }: { params: Promise<{ track: string; task: string }> }) {
  const { track: trackSlug, task: taskSlug } = await params;
  const result = getVibeTask(trackSlug, taskSlug);
  if (!result) notFound();
  const { track, task } = result;

  return (
    <main className={styles.workspace}>
      <section className={styles.workspacePane}>
        <div className={styles.workspaceTop}>
          <Link href={`/vibe/tasks/${track.slug}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back</Link>
          <strong>{task.title}</strong>
          <span className={styles.pill}>{task.difficulty}</span>
        </div>
        <article className={styles.workspaceContent}>
          <h1>{task.title}</h1>
          <h2>Problem Description</h2>
          <p>{task.description}</p>
          <h2>Track Context</h2>
          <p>{track.description}</p>
          <h2>Task Steps</h2>
          <ol>
            <li>Read the repo context and identify the file or module boundary.</li>
            <li>Implement the fix or analysis in the editor.</li>
            <li>Run the checks and explain the tradeoff.</li>
            <li>Submit when the implementation and reasoning are clean.</li>
          </ol>
          <h2>Acceptance Tests</h2>
          <ol>{task.tests.map((test) => <li key={test}>{test}</li>)}</ol>
        </article>
      </section>

      <section className={styles.editorPane}>
        <div className={styles.workspaceTop}>
          <div style={{ display: "flex", gap: 24 }}><strong>solution.ts</strong><strong>test.ts</strong></div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><WorkspaceActions /></div>
        </div>
        <div className={styles.code}>
          <pre>{task.starter}</pre>
        </div>
      </section>
    </main>
  );
}
