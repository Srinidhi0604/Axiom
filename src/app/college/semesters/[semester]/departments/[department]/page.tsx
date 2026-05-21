import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoursesForSemesterAndDepartment, getCollegeDepartment, slugifyCourse } from "@/lib/college";
import styles from "../../../../../axiom.module.css";

export default async function CollegeSemesterDepartmentPage({ params }: { params: Promise<{ semester: string; department: string }> }) {
  const { semester, department: departmentSlug } = await params;
  const department = getCollegeDepartment(departmentSlug);
  const courses = getCoursesForSemesterAndDepartment(semester, departmentSlug);
  if (!department || courses.length === 0) notFound();

  return (
    <main className={styles.shell}>
      <Link href={`/college/semesters/${semester}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to departments</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>{department.id} / Semester {semester}</p>
        <h1 style={{ fontSize: 44, fontWeight: 950 }}>Course tracks</h1>
        <p className={styles.muted}>Each course opens into an Axiom-style learning map.</p>
      </section>
      <div className={styles.trackList} style={{ marginTop: 32 }}>
        {courses.map((course, index) => (
          <Link className={styles.courseRow} href={`/college/courses/${slugifyCourse(course.code, course.title)}`} key={`${course.code}-${index}`}>
            <div className={styles.index}><span>COURSE</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.rowBody}><h3>{course.code} - {course.title}</h3><p className={styles.muted}>{course.moduleCount} modules / {department.id}</p></div>
            <div className={styles.rowMeta}><span className={styles.pill}>Start Learning</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
