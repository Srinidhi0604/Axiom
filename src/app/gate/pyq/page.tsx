"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart } from "@/components/gate/Charts";
import { FilterSidebar } from "@/components/gate/FilterSidebar";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { gateQuestions } from "@/data/gate";

function GatePyqContent() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") ?? undefined;
  const questions = subject ? gateQuestions.filter((question) => question.subjectId === subject) : gateQuestions;
  const typeCounts = ["MCQ", "MSQ", "NAT", "CODE"].map((type) => ({
    label: type,
    value: questions.length ? Math.round((questions.filter((question) => question.type === type).length / questions.length) * 100) : 0,
    color: type === "MCQ" ? "#38bdf8" : type === "MSQ" ? "#22c55e" : type === "NAT" ? "#f59e0b" : "#ec4899",
  }));

  return (
    <main>
      <div style={{ marginBottom: 22 }}>
        <div style={{ color: "var(--accent-cyan)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>PYQ BANK</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Previous year questions</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          Filter by subject and practice GATE-style MCQ, MSQ, NAT, and code-backed questions in the same surface.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", gap: 18 }}>
        <div style={{ display: "grid", gap: 14, alignSelf: "start", position: "sticky", top: 90 }}>
          <FilterSidebar activeSubject={subject} />
          <aside className="glass-card-static" style={{ padding: 16, borderRadius: 8 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12 }}>Question mix</h2>
            <BarChart data={typeCounts} />
          </aside>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {questions.map((question) => <QuestionCard key={question.id} question={question} compact />)}
        </div>
      </div>
    </main>
  );
}

export default function GatePyqPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: "var(--text-secondary)" }}>Loading PYQs...</div>}>
      <GatePyqContent />
    </Suspense>
  );
}
