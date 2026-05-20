import Link from "next/link";
import { notFound } from "next/navigation";
import { gateQuestions, getGateSubject } from "@/data/gate";
import styles from "../../../axiom.module.css";

export default async function GateSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = getGateSubject(subjectId);
  if (!subject) notFound();
  const questions = gateQuestions.filter((question) => question.subjectId === subject.id);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <Link href="/gate" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to GATE</Link>
          <h1 style={{ fontSize: 44, fontWeight: 950, marginTop: 18 }}>{subject.title}</h1>
          <p className={styles.muted}>{subject.weightage} / {subject.pyqs} PYQs / {subject.readiness}% readiness</p>
        </div>
        <Link href="/gate/practice" className="btn-minimalist">Practice Questions</Link>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Formula cards</p><h2>Revise fast</h2></div>
        </div>
        <div className={styles.wideGrid}>
          {subject.formulas.map((formula) => (
            <article className={styles.card} key={formula.title}>
              <div>
                <div className={styles.cardStripe} style={{ background: subject.color }} />
                <h3>{formula.title}</h3>
                <pre className={styles.pre}>{formula.expression}</pre>
                <p className={styles.muted}>{formula.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Subject practice</p><h2>Questions</h2></div>
        </div>
        <div className={styles.trackList}>
          {questions.map((question, index) => (
            <Link className={styles.trackRow} href={`/gate/practice/${question.id}`} key={question.id}>
              <div className={styles.index}><span>{question.type}</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
              <div className={styles.rowBody}><h3>{question.title}</h3><p className={styles.muted}>{question.topic} / {question.year}</p></div>
              <div className={styles.rowMeta}><span className={styles.pill}>{question.difficulty}</span></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
