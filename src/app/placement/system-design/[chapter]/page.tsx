import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { ChapterReader } from "@/components/placement/ChapterReader";
import { systemDesignChapters } from "@/data/placement/system-design-chapters";
import { systemDesignTasks } from "@/data/placement/system-design-tasks";
import styles from "@/components/placement/placement.module.css";

export default async function Page({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const meta = systemDesignChapters.find((item) => item.slug === chapter);
  const tasks = systemDesignTasks[chapter] ?? [];
  const markdown = await fs.readFile(path.join(process.cwd(), "public", "system-design", `${chapter}.md`), "utf8");
  return (
    <main className={styles.shell}>
      <Link href="/placement/system-design" className={styles.problemLink}>Back to chapters</Link>
      <div style={{ height: 18 }} />
      {meta ? (
        <section className={styles.panel}>
          <p className={styles.eyebrow}>Chapter {meta.chapter} · {meta.source}</p>
          <h1>{meta.title}</h1>
          <p className={styles.subtitle}>{meta.description}</p>
          <div className={styles.grid} style={{ marginTop: 18 }}>
            <div className={styles.card}>
              <strong>Implement</strong>
              <p className={styles.meta}>{meta.build}</p>
            </div>
            <div className={styles.card}>
              <strong>Acceptance Checklist</strong>
              <p className={styles.meta}>API contract, data model, happy path, bottleneck, failure mode, and tradeoff notes.</p>
            </div>
          </div>
        </section>
      ) : null}
      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>Implementation Track</h2>
          <span>{tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}</span>
        </div>
        <div className={styles.paperCategoryGrid}>
          {tasks.map((task, index) => (
            <Link key={task.slug} href={`/placement/system-design/${chapter}/implement/${task.slug}`} className="task-card">
              <div className={styles.taskIndex}>
                <span>Task</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className={styles.taskBody}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <span className={`${styles.badge} ${task.difficulty === "easy" ? styles.easy : task.difficulty === "medium" ? styles.medium : styles.hard}`}>
                {task.difficulty}
              </span>
              <div className="completion-circle" />
            </Link>
          ))}
        </div>
      </section>
      <ChapterReader markdown={markdown} />
    </main>
  );
}
