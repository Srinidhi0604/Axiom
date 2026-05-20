import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollegeDepartment, getCoursesForDepartment, slugifyCourse } from "@/lib/college";
import styles from "../../../axiom.module.css";

export default async function CollegeDepartmentPage({ params }: { params: Promise<{ department: string }> }) {
  const { department: departmentSlug } = await params;
  const department = getCollegeDepartment(departmentSlug);
  const courses = getCoursesForDepartment(departmentSlug);
  if (!department) notFound();

  return (
    <main className={styles.shell}>
      <Link href="/college" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to College</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>{department.id}</p>
        <h1 style={{ fontSize: 44, fontWeight: 950 }}>Department course tracks</h1>
        <p className={styles.muted}>Course tracks filtered for this department across all mapped semesters.</p>
      </section>
      <div className={styles.trackList} style={{ marginTop: 32 }}>
        {courses.map((course, index) => (
          <Link className={styles.courseRow} href={`/college/courses/${slugifyCourse(course.code, course.title)}`} key={`${course.semester}-${course.code}-${index}`}>
            <div className={styles.index}><span>COURSE</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.rowBody}><h3>{course.code} - {course.title}</h3><p className={styles.muted}>Semester {course.semester} / {course.moduleCount} modules</p></div>
            <div className={styles.rowMeta}><span className={styles.pill}>Open Map</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
