"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CountdownTimer } from "@/components/gate/CountdownTimer";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { QuestionPalette } from "@/components/gate/QuestionPalette";
import type { GateMock, GateQuestion } from "@/data/gate";

export function MockTestClient({ mock, questions }: { mock: GateMock; questions: GateQuestion[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const activeQuestion = questions[activeIndex];
  const score = useMemo(() => questions.reduce((sum, question) => sum + (results[question.id] ? question.marks : 0), 0), [questions, results]);
  const total = questions.reduce((sum, question) => sum + question.marks, 0);

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "var(--accent-cyan)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>TEST ENGINE</div>
          <h1 style={{ fontSize: 36 }}>{mock.title}</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <CountdownTimer seconds={mock.durationSeconds} />
          <Link href={`/gate/mock-tests/${mock.id}/result?score=${score}&total=${total}`} className="btn-primary" style={{ textDecoration: "none", borderRadius: 8 }}>
            Submit
          </Link>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: 18 }}>
        <QuestionCard
          question={activeQuestion}
          onAnswered={(correct) => setResults((current) => ({ ...current, [activeQuestion.id]: correct }))}
        />
        <div style={{ display: "grid", gap: 14, alignSelf: "start" }}>
          <QuestionPalette questions={questions} activeIndex={activeIndex} answered={results} onSelect={setActiveIndex} />
          <div className="glass-card-static" style={{ padding: 16, borderRadius: 8 }}>
            <strong>Live score</strong>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{score}/{total}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
