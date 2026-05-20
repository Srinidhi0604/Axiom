"use client";

import { useMemo, useState } from "react";
import { getGateSubject, type GateQuestion } from "@/data/gate";

export function QuestionCard({
  question,
  onAnswered,
  compact = false,
}: {
  question: GateQuestion;
  onAnswered?: (correct: boolean) => void;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [natAnswer, setNatAnswer] = useState("");
  const [code, setCode] = useState(question.codeStarter ?? "");
  const [result, setResult] = useState<null | { correct: boolean; message: string }>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const expected = useMemo(() => (Array.isArray(question.answer) ? question.answer : [question.answer]), [question.answer]);
  const subject = getGateSubject(question.subjectId);

  function toggleOption(option: string) {
    if (question.type === "MSQ") {
      setSelected((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
      return;
    }
    setSelected([option]);
  }

  function checkAnswer() {
    let correct = false;
    if (question.type === "NAT") {
      correct = natAnswer.trim().toLowerCase() === String(question.answer).toLowerCase();
    } else if (question.type === "CODE") {
      correct = expected.every((token) => code.toLowerCase().includes(token.toLowerCase()));
    } else {
      correct = expected.length === selected.length && expected.every((answer) => selected.includes(answer));
    }
    setResult({ correct, message: correct ? "Correct. Keep moving." : "Not there yet. Review the explanation and try again." });
    onAnswered?.(correct);
  }

  function resetQuestion() {
    setSelected([]);
    setNatAnswer("");
    setCode(question.codeStarter ?? "");
    setResult(null);
    setShowAnswer(false);
  }

  return (
    <article
      className="glass-card-static"
      style={{
        padding: compact ? 18 : 24,
        borderRadius: 8,
        borderLeft: subject ? `3px solid ${subject.color}` : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "start", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="year-badge">{question.year}</span>
          {subject && (
            <span className="tag-pill" style={{ background: `${subject.color}18`, color: subject.color }}>
              {subject.short}
            </span>
          )}
          <span className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
            {question.topic}
          </span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
          {question.timeLimit}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <span className={question.difficulty === "Easy" ? "badge-easy" : question.difficulty === "Medium" ? "badge-medium" : "badge-hard"} style={{ borderRadius: 999, padding: "3px 9px", fontSize: 11, fontWeight: 900 }}>
          {question.difficulty}
        </span>
        <span className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
          {question.type}
        </span>
        <span className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
          {question.marks} marks
        </span>
      </div>

      <h2 style={{ fontSize: compact ? 18 : 24, marginBottom: 12 }}>{question.title}</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 18 }}>{question.prompt}</p>

      {(question.type === "MCQ" || question.type === "MSQ") && (
        <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
          {question.options?.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px minmax(0, 1fr)",
                  gap: 10,
                  alignItems: "center",
                  textAlign: "left",
                  padding: 14,
                  borderRadius: 8,
                  border: active ? "1px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: active ? "var(--accent-cyan)" : "rgba(255,255,255,0.07)",
                    color: active ? "#000" : "var(--text-muted)",
                    fontWeight: 900,
                  }}
                >
                  {String.fromCharCode(65 + (question.options?.indexOf(option) ?? 0))}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "NAT" && (
        <input
          value={natAnswer}
          onChange={(event) => setNatAnswer(event.target.value)}
          className="input-field"
          placeholder="Enter numeric answer"
          style={{ marginBottom: 18 }}
        />
      )}

      {question.type === "CODE" && (
        <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="code-editor-textarea"
            style={{ minHeight: 220, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "#0d1117" }}
          />
          <div className="code-block">
            {question.sampleTests?.map((test) => (
              <div key={test.input}>input: {test.input} =&gt; output: {test.output}</div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={checkAnswer} className="btn-primary" style={{ borderRadius: 8 }}>
          {question.type === "CODE" ? "Run sample check" : "Check answer"}
        </button>
        <button type="button" onClick={() => setShowAnswer((value) => !value)} className="btn-secondary" style={{ borderRadius: 8 }}>
          {showAnswer ? "Hide answer" : "Reveal answer"}
        </button>
        <button type="button" onClick={resetQuestion} className="btn-secondary" style={{ borderRadius: 8 }}>
          Reset
        </button>
        {result && <span style={{ color: result.correct ? "var(--accent-green)" : "var(--accent-amber)", fontWeight: 800 }}>{result.message}</span>}
      </div>

      {(result || showAnswer) && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {showAnswer && (
            <p style={{ color: "var(--text-primary)", lineHeight: 1.65, marginBottom: 10 }}>
              <strong>Answer:</strong> {expected.join(", ")}
            </p>
          )}
          <strong style={{ display: "block", marginBottom: 6 }}>Explanation</strong>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>{question.explanation}</p>
        </div>
      )}
    </article>
  );
}
