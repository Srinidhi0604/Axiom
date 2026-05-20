import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollegeCourse, slugifyCourse } from "@/lib/college";
import styles from "../../../axiom.module.css";

export default async function CollegeCoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: courseSlug } = await params;
  const course = getCollegeCourse(courseSlug);
  if (!course) notFound();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <Link href="/college" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to College</Link>
          <p className={styles.eyebrow} style={{ marginTop: 28 }}>{course.department} / Semester {course.semester}</p>
          <h1 style={{ fontSize: 48, fontWeight: 950 }}>{course.title}</h1>
          <p className={styles.muted}>Concept-first modules for {course.code}, shaped as focused implementation tasks instead of a static syllabus list.</p>
        </div>
        {course.pdf ? <a className="btn-secondary" href={course.pdf} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>Open Syllabus PDF</a> : null}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Learning map</p><h2>Modules</h2></div>
          <span className={styles.pill}>{course.moduleCount} Modules</span>
        </div>
        <div className={styles.wideGrid}>
          {(course.modules ?? []).map((module, index) => (
            <Link className={styles.card} href={`/college/courses/${slugifyCourse(course.code, course.title)}/${module.slug}`} key={module.slug}>
              <div>
                <div className={styles.cardStripe} style={{ background: "#06B6D4" }} />
                <span className={styles.pill}>Module {index + 1}</span>
                <h3 style={{ marginTop: 18 }}>{module.title}</h3>
                <p className={styles.muted}>{module.summary}</p>
              </div>
              <div className={styles.stats}><span className={styles.pill}>{module.topics?.length ?? 0} tasks</span><span className={styles.pill}>CampusLabs</span></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
