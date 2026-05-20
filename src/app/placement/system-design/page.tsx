import Link from "next/link";
import { systemDesignChapters } from "@/data/placement/system-design-chapters";
import styles from "@/components/placement/placement.module.css";

export default function Page() {
  return (
    <main className={styles.shell}>
      <h1>System Design</h1>
      <p className={styles.subtitle}>Sixteen system-design-primer backed tracks. Each one is built like a coding sheet: learn the concept, implement the primitive, then explain tradeoffs in interview format.</p>
      <div className={styles.grid} style={{ marginTop: 26 }}>
        {systemDesignChapters.map((chapter) => (
          <Link className={styles.chapterCard} key={chapter.slug} href={`/placement/system-design/${chapter.slug}`}>
            <p className={styles.eyebrow}>Chapter {chapter.chapter} · {chapter.readTime}</p>
            <h2>{chapter.title}</h2>
            <p className={styles.meta}>{chapter.description}</p>
            <div className={styles.panel} style={{ margin: "14px 0 0", padding: 12 }}>
              <strong>Build:</strong>
              <p className={styles.meta}>{chapter.build}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
