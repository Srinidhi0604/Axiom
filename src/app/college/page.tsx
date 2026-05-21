"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { collegeDepartments, getCollegeSemesters, getCollegeStats, slugifyDepartment } from "@/lib/college";
import styles from "../axiom.module.css";
import { ProductLanding } from "@/components/ProductLanding";

function CollegeHome() {
  const stats = getCollegeStats();
  const semesters = getCollegeSemesters();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p className={styles.eyebrow}>College Exam Prep</p>
          <h1 style={{ fontSize: 48, fontWeight: 950 }}>Choose semester, department, then a course workspace</h1>
          <p className={styles.muted}>The College Prep flow is preserved: semester maps, department filters, course learning maps, module tasks, and concept workspaces.</p>
        </div>
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
            <Link className={styles.card} href={`/college/semesters/${semester}`} key={semester} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ height: 4, width: 32, background: "#8dc9ad", marginBottom: 16, borderRadius: 4 }} />
                <h3>Semester {semester}</h3>
                <p className={styles.muted} style={{ fontSize: 13, marginTop: 8 }}>Pick a department with mapped courses for this semester.</p>
              </div>
              <span className={styles.action} style={{ color: "#8dc9ad", fontSize: 13, fontWeight: 600 }}>Choose Department &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Department path</p><h2>Or start by branch</h2></div></div>
        <div className={styles.grid}>
          {collegeDepartments.map((department) => (
            <Link className={styles.card} href={`/college/departments/${slugifyDepartment(department.id)}`} key={department.id} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ height: 4, width: 32, background: "#06B6D4", marginBottom: 16, borderRadius: 4 }} />
                <h3>{department.id.split(" ")[0]}</h3>
                <p className={styles.muted} style={{ fontSize: 13, marginTop: 8 }}>{Object.keys(department.semesters).length} semesters with syllabus-backed course maps.</p>
              </div>
              <span className={styles.action} style={{ color: "#06B6D4", fontSize: 13, fontWeight: 600 }}>Open Courses &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function CollegePage() {
  const [launched, setLaunched] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?redirect=/college");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (launched) return <CollegeHome />;

  return (
    <ProductLanding
      subtitle="Axiom Academics"
      title="College Prep"
      description="Ace your semester exams. Navigate syllabus-backed course maps, access study modules, and solidify core concepts across your specific engineering branch and semester."
      launchText="Browse Semesters"
      colorHex="#0ea5e9"
      features={[
        {
          title: "Syllabus-Aligned Paths",
          desc: "Courses meticulously aligned with standard university curriculum. No more guessing what to study.",
        },
        {
          title: "Concept Workspaces",
          desc: "Bite-sized learning nodes that break down complex engineering algorithms and equations.",
        },
        {
          title: "Department Filtering",
          desc: "Dedicated content splits for Computer Science, Electrical, Mechanical, and Civil Engineering.",
        },
        {
          title: "Semester Architecture",
          desc: "A clean semester-by-semester view of precisely the subjects you need to focus on next.",
        }
      ]}
      onLaunch={() => setLaunched(true)}
    />
  );
}
