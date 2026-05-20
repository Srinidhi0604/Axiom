import Link from "next/link";
import type { GateSubject } from "@/data/gate";

export function SubjectCard({
  subject,
  onOpenPyq,
  onOpenPractice,
}: {
  subject: GateSubject;
  onOpenPyq?: (subjectId: string) => void;
  onOpenPractice?: (subjectId: string) => void;
}) {
  const pyqAction = onOpenPyq ? (
    <button type="button" onClick={() => onOpenPyq(subject.id)} className="year-badge gate-clickable-badge gate-card-button">
      {subject.pyqs} PYQs
    </button>
  ) : (
    <Link href={`/gate/pyq?subject=${subject.id}`} className="year-badge gate-clickable-badge" style={{ textDecoration: "none" }}>
      {subject.pyqs} PYQs
    </Link>
  );

  return (
    <article className="glass-card gate-subject-card" style={{ padding: 22, borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div>
          <Link href={`/gate/syllabus?subject=${subject.id}`} style={{ color: "var(--text-primary)", textDecoration: "none" }}>
            <h3 style={{ fontSize: 20, marginBottom: 6 }}>{subject.title}</h3>
          </Link>
          <Link href={`/gate/analytics?subject=${subject.id}`} style={{ color: subject.color, fontSize: 12, fontWeight: 900, textDecoration: "none" }}>
            {subject.weightage}
          </Link>
        </div>
        {pyqAction}
      </div>
      <Link
        href={`/gate/analytics?subject=${subject.id}`}
        aria-label={`${subject.title} analytics`}
        style={{ display: "block", height: 8, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 16 }}
      >
        <div style={{ width: `${subject.readiness}%`, height: "100%", background: subject.color }} />
      </Link>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {subject.topics.slice(0, 5).map((topic) => (
          <Link
            key={topic}
            href={`/gate/practice?subject=${subject.id}&topic=${encodeURIComponent(topic)}`}
            className="tag-pill gate-topic-link"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", textDecoration: "none" }}
          >
            {topic}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {onOpenPyq ? (
          <button type="button" onClick={() => onOpenPyq(subject.id)} className="btn-secondary" style={{ borderRadius: 7, padding: "8px 12px" }}>
            PYQs
          </button>
        ) : (
          <Link href={`/gate/pyq?subject=${subject.id}`} className="btn-secondary" style={{ textDecoration: "none", borderRadius: 7, padding: "8px 12px" }}>
            PYQs
          </Link>
        )}
        {onOpenPractice ? (
          <button type="button" onClick={() => onOpenPractice(subject.id)} className="btn-primary" style={{ borderRadius: 7, padding: "8px 12px" }}>
            Practice
          </button>
        ) : (
          <Link href={`/gate/practice?subject=${subject.id}`} className="btn-primary" style={{ textDecoration: "none", borderRadius: 7, padding: "8px 12px" }}>
            Practice
          </Link>
        )}
      </div>
    </article>
  );
}
