import Link from "next/link";
import { notFound } from "next/navigation";
import { systemDesignChapters } from "@/data/placement/system-design-chapters";
import { systemDesignTasks } from "@/data/placement/system-design-tasks";
import styles from "@/components/placement/placement.module.css";

export default async function Page({ params }: { params: Promise<{ chapter: string; task: string }> }) {
  const { chapter, task } = await params;
  const chapterMeta = systemDesignChapters.find((item) => item.slug === chapter);
  const currentTask = (systemDesignTasks[chapter] ?? []).find((item) => item.slug === task);
  if (!chapterMeta || !currentTask) notFound();

  return (
    <main className={styles.paperShell}>
      <Link href={`/placement/system-design/${chapter}`} className={styles.backLink}>{"<- Back to Track"}</Link>

      <section className={styles.paperHero}>
        <div>
          <h1>{currentTask.title}</h1>
          <div className={styles.heroMeta}>
            <span>{chapterMeta.title}</span>
            <span>{currentTask.category}</span>
            <span>{currentTask.difficulty}</span>
          </div>
          <p>{currentTask.description}</p>
        </div>
        <div className={styles.heroActions}>
          <Link className="btn-primary" href={`/placement/system-design/${chapter}`}>Read Concept</Link>
        </div>
      </section>

      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>Problem Statement</h2>
          <span>Implementable</span>
        </div>
        <article className={`${styles.panel} ${styles.reader}`}>
          <h2>Goal</h2>
          <p>{currentTask.description}</p>
          <h2>Starter</h2>
          <pre className="code-block">{currentTask.starter}</pre>
          <h2>Acceptance Tests</h2>
          <ul>
            {currentTask.tests.map((test) => <li key={test}>{test}</li>)}
          </ul>
          <h2>Interview Follow-Up</h2>
          <p>Explain the API, data model, bottleneck, failure mode, and the tradeoff you would make when this primitive becomes distributed.</p>
        </article>
      </section>
    </main>
  );
}
