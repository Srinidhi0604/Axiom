"use client";

import Link from "next/link";
import { useState } from "react";
import { KaTeXRenderer } from "@/components/gate/KaTeXRenderer";
import { gateSubjects } from "@/data/gate";

const subjectColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
];

function getSubjectColor(index: number) {
  return subjectColors[index % subjectColors.length];
}

export default function GateFormulasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("all");

  const filteredSubjects = gateSubjects.filter((subject) => {
    const query = searchQuery.toLowerCase();
    const matchesSubject = activeSubject === "all" || subject.id === activeSubject;
    const matchesSearch =
      subject.title.toLowerCase().includes(query) ||
      subject.weightage.toLowerCase().includes(query) ||
      subject.formulas.some((formula) =>
        `${formula.title} ${formula.expression}`.toLowerCase().includes(query)
      );

    return matchesSubject && matchesSearch;
  });

  return (
    <main className="animate-fade-in" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Formulas</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Select a subject to revise formulas.
          </p>
        </div>
      </div>

      <div className="gate-formula-subject-tabs" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <button
          onClick={() => setActiveSubject("all")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            background: activeSubject === "all" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
            color: activeSubject === "all" ? "var(--text-primary)" : "var(--text-secondary)",
            border: activeSubject === "all" ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
            transition: "all 0.2s",
          }}
        >
          All Subjects
          <span style={{ color: "var(--text-muted)", marginLeft: 6, fontWeight: 500 }}>{gateSubjects.length}</span>
        </button>
        {gateSubjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setActiveSubject(subject.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: activeSubject === subject.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
              color: activeSubject === subject.id ? "var(--text-primary)" : "var(--text-secondary)",
              border: activeSubject === subject.id ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.2s",
            }}
          >
            {subject.title}
            <span style={{ color: "var(--text-muted)", marginLeft: 6, fontWeight: 500 }}>{subject.formulas.length}</span>
          </button>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: 40 }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search formulas, subjects..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          style={{
            width: "100%",
            padding: "16px 16px 16px 48px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "var(--text-primary)",
            fontSize: 15,
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(event) => {
            event.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onBlur={(event) => {
            event.target.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        />
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }} className="stagger-children">
        {filteredSubjects.map((subject, index) => {
          const color = subject.color || getSubjectColor(index);
          return (
            <Link key={subject.id} href={`/gate/formulas/${subject.id}`} style={{ textDecoration: "none" }}>
              <article
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: 24,
                  minHeight: 330,
                  height: "100%",
                  color: "var(--text-primary)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-2px)";
                  event.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 12, background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: 11, fontWeight: 600 }}>
                    {subject.weightage}
                  </span>
                  <span className="year-badge" style={{ padding: "2px 8px", borderRadius: 12, background: "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 600 }}>
                    {subject.formulas.length} formulas
                  </span>
                  <div style={{ marginLeft: "auto", color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5V6a2 2 0 0 1 2-2h12v16H6a2 2 0 0 1 0-4h12"></path>
                    </svg>
                  </div>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 18, lineHeight: 1.3 }}>
                  {subject.title}
                </h2>

                <div style={{ display: "grid", gap: 12, marginTop: "auto", marginBottom: 18 }}>
                  {subject.formulas.slice(0, 2).map((formula) => (
                    <div key={formula.title} style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <strong style={{ display: "block", marginBottom: 8, fontSize: 13, color: "var(--text-primary)" }}>{formula.title}</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: 13, overflowX: "auto" }}>
                        <KaTeXRenderer expression={formula.expression} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Quick revision sheet
                  </span>
                  <span style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 600 }}>
                    Open sheet
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {filteredSubjects.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p>No formula sheets found matching your search.</p>
        </div>
      )}
    </main>
  );
}
