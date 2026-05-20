import Link from "next/link";
import { notFound } from "next/navigation";
import { getGateQuestion, getGateSubject } from "@/data/gate";
import { WorkspaceActions } from "@/app/placement/WorkspaceActions";
import styles from "../../../axiom.module.css";

export default async function GateQuestionPage({ params }: { params: Promise<{ question: string }> }) {
  const { question: questionId } = await params;
  const question = getGateQuestion(questionId);
  if (!question) notFound();
  const subject = getGateSubject(question.subjectId);

  return (
    <main className={styles.workspace}>
      <section className={styles.workspacePane}>
        <div className={styles.workspaceTop}>
          <Link href="/gate/practice" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back</Link>
          <strong>{question.title}</strong>
          <span className={styles.pill}>{question.difficulty}</span>
        </div>
        <article className={styles.workspaceContent}>
          <h1>{question.title}</h1>
          <h2>Prompt</h2>
          <p>{question.prompt}</p>
          {question.options ? (
            <>
              <h2>Options</h2>
              <ol>{question.options.map((option) => <li key={option}>{option}</li>)}</ol>
            </>
          ) : null}
          <h2>Subject Context</h2>
          <p>{subject?.title} / {question.topic} / {question.year} / {question.type} / {question.marks} marks</p>
          <h2>Explanation</h2>
          <p>{question.explanation}</p>
        </article>
      </section>
      <section className={styles.editorPane}>
        <div className={styles.workspaceTop}>
          <div style={{ display: "flex", gap: 24 }}><strong>answer.txt</strong><strong>scratch.py</strong></div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><WorkspaceActions submitLabel="Submit Answer" /></div>
        </div>
        <div className={styles.code}>
          <pre>{question.codeStarter ?? `# Write your reasoning here\n# Expected answer: ${Array.isArray(question.answer) ? question.answer.join(", ") : question.answer}\n`}</pre>
        </div>
      </section>
    </main>
  );
}
