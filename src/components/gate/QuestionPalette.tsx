"use client";

import type { GateQuestion } from "@/data/gate";

export function QuestionPalette({
  questions,
  activeIndex,
  answered,
  onSelect,
}: {
  questions: GateQuestion[];
  activeIndex: number;
  answered: Record<string, boolean>;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="glass-card-static" style={{ padding: 16, borderRadius: 8 }}>
      <h2 style={{ fontSize: 16, marginBottom: 14 }}>Question palette</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {questions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            onClick={() => onSelect(index)}
            style={{
              height: 38,
              borderRadius: 7,
              border: index === activeIndex ? "1px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.1)",
              background: answered[question.id] ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </aside>
  );
}
