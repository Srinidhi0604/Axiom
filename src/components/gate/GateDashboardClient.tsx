"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { SubjectCard } from "@/components/gate/SubjectCard";
import { gateQuestions, gateSubjects } from "@/data/gate";

type PanelMode = "PYQs" | "Practice";

export function GateDashboardClient() {
  const [activeSubjectId, setActiveSubjectId] = useState(gateSubjects[0]?.id ?? "");
  const [mode, setMode] = useState<PanelMode>("PYQs");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const activeSubject = gateSubjects.find((subject) => subject.id === activeSubjectId) ?? gateSubjects[0];
  const subjectQuestions = useMemo(
    () => gateQuestions.filter((question) => question.subjectId === activeSubject.id),
    [activeSubject.id],
  );
  const activeQuestion = subjectQuestions[activeQuestionIndex] ?? subjectQuestions[0];

  function openPanel(subjectId: string, nextMode: PanelMode) {
    setActiveSubjectId(subjectId);
    setMode(nextMode);
    setActiveQuestionIndex(0);
    window.setTimeout(() => document.getElementById("gate-subject-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <section style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>SUBJECT ROADMAP</div>
          <h2 style={{ fontSize: 32, lineHeight: 1.15, margin: 0 }}>All GATE CS subjects</h2>
        </div>
        <Link href="/gate/syllabus" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
          Open Syllabus
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 22 }}>
        {gateSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onOpenPyq={(subjectId) => openPanel(subjectId, "PYQs")}
            onOpenPractice={(subjectId) => openPanel(subjectId, "Practice")}
          />
        ))}
      </div>

      <div
        id="gate-subject-panel"
        className="glass-card-static"
        style={{
          padding: 22,
          borderRadius: 8,
          borderLeft: `3px solid ${activeSubject.color}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <div style={{ color: activeSubject.color, fontSize: 12, fontWeight: 900, marginBottom: 8 }}>
              {mode.toUpperCase()} PANEL
            </div>
            <h2 style={{ fontSize: 28, marginBottom: 6 }}>{activeSubject.title} questions</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
              Click PYQs or Practice on any subject card. Questions for that subject appear here immediately.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {subjectQuestions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setActiveQuestionIndex(index)}
                className={index === activeQuestionIndex ? "filter-chip filter-chip-active" : "filter-chip"}
              >
                Q{index + 1}
              </button>
            ))}
          </div>
        </div>
        {activeQuestion ? (
          <QuestionCard question={activeQuestion} />
        ) : (
          <div style={{ color: "var(--text-secondary)", padding: 24 }}>Questions for this subject are being added.</div>
        )}
      </div>
    </section>
  );
}
