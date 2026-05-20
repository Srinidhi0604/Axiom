"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { gateSubjects } from "@/data/gate";

function GateSyllabusContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") ?? gateSubjects[0]?.id;
  const [activeSubjectId, setActiveSubjectId] = useState(initialSubject);
  const activeSubject = gateSubjects.find((subject) => subject.id === activeSubjectId) ?? gateSubjects[0];

  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>SYLLABUS ROADMAP</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Roadmap based GATE syllabus</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          Pick a subject and follow the roadmap from core concepts to PYQs, formulas, and practice.
        </p>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", gap: 18 }}>
        <aside className="glass-card-static" style={{ padding: 16, borderRadius: 8, alignSelf: "start", position: "sticky", top: 90 }}>
          <h2 style={{ fontSize: 17, marginBottom: 12 }}>Subjects</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {gateSubjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => setActiveSubjectId(subject.id)}
                className={subject.id === activeSubject.id ? "filter-chip filter-chip-active" : "filter-chip"}
                style={{ textAlign: "left" }}
              >
                {subject.title}
              </button>
            ))}
          </div>
        </aside>

        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8, borderLeft: `3px solid ${activeSubject.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <div style={{ color: activeSubject.color, fontSize: 12, fontWeight: 900, marginBottom: 8 }}>{activeSubject.weightage}</div>
              <h2 style={{ fontSize: 34, marginBottom: 10 }}>{activeSubject.title}</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 620 }}>
                Complete the steps in order, then use subject PYQs and practice mode to lock the topic.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={`/gate/pyq?subject=${activeSubject.id}`} className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
                PYQs
              </Link>
              <Link href={`/gate/practice?subject=${activeSubject.id}`} className="btn-primary" style={{ textDecoration: "none", borderRadius: 8 }}>
                Practice
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {activeSubject.topics.map((topic, index) => (
              <article
                key={topic}
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px minmax(0, 1fr) auto",
                  gap: 14,
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${activeSubject.color}1f`,
                    color: activeSubject.color,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 5 }}>{topic}</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, fontSize: 13 }}>
                    Learn concept, revise formulas, solve PYQs, then attempt a timed practice card.
                  </p>
                </div>
                <Link
                  href={`/gate/practice?subject=${activeSubject.id}&topic=${encodeURIComponent(topic)}`}
                  className="btn-secondary"
                  style={{ textDecoration: "none", borderRadius: 8, whiteSpace: "nowrap" }}
                >
                  Practice step
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function GateSyllabusPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: "var(--text-secondary)" }}>Loading syllabus...</div>}>
      <GateSyllabusContent />
    </Suspense>
  );
}
