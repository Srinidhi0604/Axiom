import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollegeModule, slugifyCourse } from "@/lib/college";
import styles from "../../../../axiom.module.css";

export default async function CollegeModulePage({ params }: { params: Promise<{ course: string; module: string }> }) {
  const { course: courseSlug, module: moduleSlug } = await params;
  const result = getCollegeModule(courseSlug, moduleSlug);
  if (!result) notFound();
  const { course, module } = result;

  return (
    <main className={styles.shell}>
      <Link href={`/college/courses/${slugifyCourse(course.code, course.title)}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
        Back to {course.title}
      </Link>
      <section style={{ marginTop: 44, maxWidth: 900 }}>
        <h1 style={{ fontSize: 48, fontWeight: 950 }}>{course.code}: {module.title}</h1>
        <div className={styles.stats} style={{ marginTop: 18 }}>
          <span className={styles.pill}>Semester {course.semester}</span>
          <span className={styles.pill}>CampusLabs</span>
          <span className={styles.pill}>{module.topics?.length ?? 0} Tasks</span>
        </div>
        <p className={styles.muted} style={{ marginTop: 24, fontSize: 18 }}>{module.summary}</p>
      </section>
      <section style={{ marginTop: 52, maxWidth: 940 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <h2 style={{ fontSize: 32 }}>Implementation Track</h2>
          <span className={styles.pill}>{module.topics?.length ?? 0} Tasks</span>
        </div>
        <div className={styles.trackList}>
          {(module.topics ?? []).map((topic, index) => (
            <Link className={styles.trackRow} href={`/college/courses/${slugifyCourse(course.code, course.title)}/${module.slug}/${topic.slug}`} key={topic.slug}>
              <div className={styles.index}><span>Task</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
              <div className={styles.rowBody}><h3>{topic.title}</h3><p className={styles.muted}>Complete the concept workspace and run the implementation checks for this topic.</p></div>
              <div className={styles.rowMeta}><span className={styles.pill}>Micro</span><span className={styles.pill}>{topic.status === "locked" ? "Preview" : "Easy"}</span></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
