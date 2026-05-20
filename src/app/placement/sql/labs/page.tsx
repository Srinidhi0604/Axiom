import styles from "../../placement.module.css";
import { WorkspaceActions } from "@/app/placement/WorkspaceActions";

export default function SqlLabsPage() {
  return (
    <main className={styles.workspace}>
      <section className={styles.workspacePane}>
        <div className={styles.problemTopbar}><strong>Department Top Earners</strong><span className="badge-medium" style={{ padding: "3px 10px", borderRadius: 4 }}>Medium</span></div>
        <article className={styles.problemContent}>
          <h1>Department Top Earners</h1>
          <h2>Problem Description</h2>
          <p>Write a query that returns each department&apos;s highest paid employees, including ties.</p>
          <h2>Acceptance Tests</h2>
          <ol><li>Handles ties</li><li>Returns every department</li><li>Does not duplicate non-top employees</li></ol>
        </article>
      </section>
      <section className={styles.editorPane}>
        <div className={styles.editorTopbar}><div className={styles.tabs}><span className={styles.tab}>solution.sql</span><span className={styles.tab}>schema.sql</span></div><div className={styles.runRow}><WorkspaceActions /></div></div>
        <div className={styles.editorBody}><pre className={styles.codeEditor}>SELECT department_id, employee_id, salary{"\n"}FROM employees{"\n"}-- write your query</pre></div>
      </section>
    </main>
  );
}
