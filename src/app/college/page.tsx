import Link from "next/link";
import { collegeDepartments, getCollegeSemesters, getCollegeStats, slugifyDepartment } from "@/lib/college";
import styles from "../axiom.module.css";

export default function CollegePage() {
  const stats = getCollegeStats();
  const semesters = getCollegeSemesters();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>College Exam Prep</p>
          <h1 style={{ fontSize: 48, fontWeight: 950 }}>Choose semester, department, then a course workspace</h1>
          <p className={styles.muted}>The College Prep flow is preserved: semester maps, department filters, course learning maps, module tasks, and concept workspaces.</p>
        </div>
        <Link href="/" className="btn-secondary" style={{ textDecoration: "none" }}>Back to Axiom</Link>
      </div>

      <section className={styles.wideGrid}>
        {[
          ["Departments", stats.departments],
          ["Semester Maps", stats.semesters],
          ["Courses", stats.courses],
        ].map(([label, value]) => (
          <div className={styles.metric} key={label}><span className={styles.muted}>{label}</span><strong>{Number(value).toLocaleString()}</strong></div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Semester path</p><h2>Start semester-wise</h2></div></div>
        <div className={styles.grid}>
          {semesters.map((semester) => (
            <Link className={styles.card} href={`/college/semesters/${semester}`} key={semester}>
              <div>
                <div className={styles.cardStripe} style={{ background: "#8dc9ad" }} />
                <h3>Semester {semester}</h3>
                <p className={styles.muted}>Pick a department with mapped courses for this semester.</p>
              </div>
              <span className={styles.action}>Choose Department</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Department path</p><h2>Or start by branch</h2></div></div>
        <div className={styles.grid}>
          {collegeDepartments.map((department) => (
            <Link className={styles.card} href={`/college/departments/${slugifyDepartment(department.id)}`} key={department.id}>
              <div>
                <div className={styles.cardStripe} style={{ background: "#06B6D4" }} />
                <h3>{department.id}</h3>
                <p className={styles.muted}>{Object.keys(department.semesters).length} semesters with syllabus-backed course maps.</p>
              </div>
              <span className={styles.action}>Open Courses</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
