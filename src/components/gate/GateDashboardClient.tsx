"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { SubjectCard } from "@/components/gate/SubjectCard";
import { gateQuestions, gateSubjects, GateStream } from "@/data/gate";

type PanelMode = "PYQs" | "Practice";

export function GateDashboardClient({ stream }: { stream?: GateStream }) {
  const subjects = stream?.subjects ?? gateSubjects;
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id ?? "");
  const [mode, setMode] = useState<PanelMode>("PYQs");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Reset when stream changes
  const firstSubjectId = subjects[0]?.id ?? "";
  const resolvedSubjectId = subjects.find((s) => s.id === activeSubjectId) ? activeSubjectId : firstSubjectId;

  const activeSubject = subjects.find((s) => s.id === resolvedSubjectId) ?? subjects[0];
  const subjectQuestions = useMemo(
    () => gateQuestions.filter((q) => q.subjectId === activeSubject?.id),
    [activeSubject?.id],
  );
  const activeQuestion = subjectQuestions[activeQuestionIndex] ?? subjectQuestions[0];

  const accentColor = stream?.accentColor ?? "var(--accent-green)";

  function openPanel(subjectId: string, nextMode: PanelMode) {
    setActiveSubjectId(subjectId);
    setMode(nextMode);
    setActiveQuestionIndex(0);
    window.setTimeout(
      () => document.getElementById("gate-subject-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }

  return (
    <section style={{ marginBottom: 34 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "end",
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ color: accentColor, fontSize: 12, fontWeight: 900, marginBottom: 8 }}>SUBJECT ROADMAP</div>
          <h2 style={{ fontSize: 30, lineHeight: 1.15, margin: 0 }}>
            All GATE {stream?.label ?? "CS"} subjects
          </h2>
        </div>
        <Link href="/gate/syllabus" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
          Open Syllabus
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 22 }}>
        {subjects.map((subject) => (
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
          borderLeft: `3px solid ${activeSubject?.color ?? accentColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ color: activeSubject?.color ?? accentColor, fontSize: 12, fontWeight: 900, marginBottom: 8 }}>
              {mode.toUpperCase()} PANEL
            </div>
            <h2 style={{ fontSize: 26, marginBottom: 6 }}>{activeSubject?.title} questions</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
              {subjectQuestions.length > 0
                ? "Click PYQs or Practice on any subject card. Questions appear here."
                : "Questions for this subject are being added — check back soon."}
            </p>
          </div>
          {subjectQuestions.length > 0 && (
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
          )}
        </div>

        {activeQuestion ? (
          <QuestionCard question={activeQuestion} />
        ) : (
          <div
            style={{
              color: "var(--text-secondary)",
              padding: 32,
              textAlign: "center",
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{stream?.emoji ?? "📚"}</div>
            <p>Practice questions for {activeSubject?.title} are being added.</p>
          </div>
        )}
      </div>
    </section>
  );
}
