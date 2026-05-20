import Link from "next/link";
import { notFound } from "next/navigation";
import { collegeDepartments, getCollegeSemesters, getCoursesForSemesterAndDepartment, slugifyDepartment } from "@/lib/college";
import styles from "../../../axiom.module.css";

export default async function CollegeSemesterPage({ params }: { params: Promise<{ semester: string }> }) {
  const { semester } = await params;
  if (!getCollegeSemesters().includes(Number(semester))) notFound();
  const departments = collegeDepartments.filter((department) => getCoursesForSemesterAndDepartment(semester, slugifyDepartment(department.id)).length > 0);

  return (
    <main className={styles.shell}>
      <Link href="/college" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to semesters</Link>
      <section style={{ marginTop: 32 }}>
        <p className={styles.eyebrow}>Semester {semester}</p>
        <h1 style={{ fontSize: 44, fontWeight: 950 }}>Choose your department</h1>
        <p className={styles.muted}>Departments below have mapped courses for this semester. Pick one to see the course path.</p>
      </section>
      <div className={styles.wideGrid} style={{ marginTop: 32 }}>
        {departments.map((department) => {
          const slug = slugifyDepartment(department.id);
          return (
            <Link className={styles.card} href={`/college/semesters/${semester}/departments/${slug}`} key={department.id}>
              <div>
                <div className={styles.cardStripe} style={{ background: "#8dc9ad" }} />
                <h3>{department.id}</h3>
                <p className={styles.muted}>{getCoursesForSemesterAndDepartment(semester, slug).length} courses mapped for semester {semester}.</p>
              </div>
              <span className={styles.action}>Open Department</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
