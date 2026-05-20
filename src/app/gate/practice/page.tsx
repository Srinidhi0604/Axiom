"use client";

import { Suspense } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart } from "@/components/gate/Charts";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { gateQuestions, gateSubjects } from "@/data/gate";

function GatePracticeContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") ?? "all";
  const initialTopic = searchParams.get("topic") ?? "all";
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [mode, setMode] = useState("all");
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const topicOptions = useMemo(() => {
    if (subject === "all") {
      return Array.from(new Set(gateQuestions.map((question) => question.topic)));
    }
    return Array.from(new Set(gateQuestions.filter((question) => question.subjectId === subject).map((question) => question.topic)));
  }, [subject]);
  const questions = useMemo(
    () =>
      gateQuestions.filter(
        (question) =>
          (subject === "all" || question.subjectId === subject) &&
          (topic === "all" || question.topic === topic) &&
          (mode === "all" || question.type === mode),
      ),
    [subject, topic, mode],
  );
  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-cyan)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>PRACTICE MODE</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Run practice by subject and type</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          MCQ/MSQ/NAT questions check answers instantly. Code questions include an editable workspace and sample-test checker.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: 18 }}>
        <aside className="glass-card-static" style={{ padding: 18, borderRadius: 8, alignSelf: "start", position: "sticky", top: 90 }}>
          <h2 style={{ fontSize: 18, marginBottom: 14 }}>Practice controls</h2>
          <label style={{ display: "block", color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>Subject</label>
          <select
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setTopic("all");
            }}
            className="input-field"
            style={{ marginBottom: 14 }}
          >
            <option value="all">All subjects</option>
            {gateSubjects.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <label style={{ display: "block", color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>Topic</label>
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="input-field" style={{ marginBottom: 14 }}>
            <option value="all">All topics</option>
            {topicOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label style={{ display: "block", color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>Question type</label>
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="input-field" style={{ marginBottom: 18 }}>
            <option value="all">All types</option>
            <option value="MCQ">MCQ</option>
            <option value="MSQ">MSQ</option>
            <option value="NAT">NAT</option>
            <option value="CODE">Code</option>
          </select>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
            <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>SESSION</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginBottom: 6 }}>{solvedCount}/{questions.length}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55, marginBottom: 14 }}>Correct answers in this practice view.</p>
            <BarChart data={[
              { label: "Correct", value: questions.length ? Math.round((solvedCount / questions.length) * 100) : 0, color: "var(--accent-green)" },
              { label: "Remaining", value: questions.length ? Math.round(((questions.length - solvedCount) / questions.length) * 100) : 0, color: "var(--accent-amber)" },
            ]} />
          </div>
        </aside>
        <div style={{ display: "grid", gap: 14 }}>
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswered={(correct) => setSolved((current) => ({ ...current, [question.id]: correct }))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function GatePracticePage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: "var(--text-secondary)" }}>Loading practice...</div>}>
      <GatePracticeContent />
    </Suspense>
  );
}
