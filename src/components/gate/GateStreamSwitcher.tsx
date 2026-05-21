"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart, Heatmap, PieChart } from "@/components/gate/Charts";
import { GateDashboardClient } from "@/components/gate/GateDashboardClient";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { gateMocks, gateQuestions, gateStreams, GateStream } from "@/data/gate";

function StatCard({ label, value, detail, accent }: { label: string; value: React.ReactNode; detail: string; accent: string }) {
  return (
    <div className="glass-card-static gate-stat-card">
      <div style={{ color: accent, fontSize: 11, fontWeight: 900, marginBottom: 8, letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{value}</div>
      <p style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5 }}>{detail}</p>
    </div>
  );
}

export function GateStreamSwitcher() {
  const [activeStreamId, setActiveStreamId] = useState("cs");
  const stream: GateStream = gateStreams.find((s) => s.id === activeStreamId) ?? gateStreams[0];

  const totalPyqs = stream.subjects.reduce((sum, s) => sum + s.pyqs, 0);
  const averageReadiness = Math.round(
    stream.subjects.reduce((sum, s) => sum + s.readiness, 0) / stream.subjects.length,
  );

  const streamQuestions = gateQuestions.filter((q) =>
    stream.subjects.some((s) => s.id === q.subjectId),
  );

  return (
    <>
      <main>
        {/* ── Stream Tabs ──────────────────────────────────────────── */}
        <div className="animate-fade-in gate-stream-tabs" style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 12,
          padding: 6,
          display: "flex",
          gap: 6,
          width: "fit-content",
          marginBottom: 32
        }}>
          {gateStreams.map((s) => {
            const isActive = s.id === activeStreamId;
            return (
              <button
                key={s.id}
                type="button"
                className="gate-tab-btn"
                onClick={() => setActiveStreamId(s.id)}
                style={{
                  background: isActive ? s.accentColor : "transparent",
                  color: isActive ? "#000" : "var(--text-secondary)",
                  boxShadow: isActive ? `0 4px 16px ${s.accentColor}55` : "none",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: 15 }}>{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* ── Hero + Stat Cards ─────────────────────────────────────── */}
        <section className="animate-fade-in gate-hero-grid">
          <div>
            <div style={{ color: stream.accentColor, fontSize: 11, fontWeight: 900, marginBottom: 12, letterSpacing: "0.08em" }}>
              GATE {stream.label} VERTICAL
            </div>
            <h1 className="gate-hero-headline">{stream.fullName}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 680, marginBottom: 22 }}>
              {stream.description}. Practice MCQ, MSQ, NAT questions across every major subject.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/gate/practice" className="btn-primary" style={{ textDecoration: "none", borderRadius: 8 }}>
                Start Practice
              </Link>
              {stream.id === "cs" && (
                <Link href="/gate/mock-tests" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
                  Take Mock
                </Link>
              )}
              <Link href="/gate/pyq" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
                Browse PYQs
              </Link>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${stream.accentColor}33`,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${stream.accentColor}18, rgba(255,255,255,0.02))`,
              padding: 16,
            }}
          >
            <div className="gate-stat-grid">
              <StatCard label="PYQ BANK" value={`${totalPyqs}+`} detail="Subject-tagged question pool." accent={stream.accentColor} />
              <StatCard label="READINESS" value={`${averageReadiness}%`} detail="Current roadmap baseline." accent={stream.accentColor} />
              <StatCard label="SUBJECTS" value={`${stream.subjects.length}`} detail="Topics in this stream." accent={stream.accentColor} />
              <StatCard
                label="PRACTICE TYPES"
                value={
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, lineHeight: 1.1, fontSize: 32, letterSpacing: -1 }}>
                    <span>MCQ</span>
                    <span>MSQ</span>
                    <span>NAT</span>
                  </div>
                }
                detail="All GATE question formats."
                accent={stream.accentColor}
              />
            </div>
          </div>
        </section>

        {/* ── Today's Plan + Quick Question ────────────────────────── */}
        <section className="gate-plan-grid">
          <div
            className="glass-card-static"
            style={{ padding: 22, borderRadius: 8, background: "linear-gradient(180deg,rgba(16,185,129,0.08),rgba(255,255,255,0.025))" }}
          >
            <div style={{ color: "var(--accent-green)", fontSize: 11, fontWeight: 900, marginBottom: 10, letterSpacing: "0.06em" }}>
              TODAY&apos;S PLAN
            </div>
            <h2 style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 16 }}>
              Solve 12 questions, review 3 formulas, take 1 sprint.
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                `2 ${stream.subjects[0]?.short ?? ""} questions`,
                `2 ${stream.subjects[1]?.short ?? ""} problems`,
                "1 NAT speed drill",
                "Review formulas sheet",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: stream.accentColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {streamQuestions[0] ? (
            <QuestionCard question={streamQuestions[0]} compact />
          ) : (
            <div className="glass-card-static" style={{ padding: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 180 }}>
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{stream.emoji}</div>
                <p style={{ fontSize: 14 }}>Practice questions for {stream.label} coming soon.</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Charts ───────────────────────────────────────────────── */}
        <section className="gate-charts-grid">
          <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Readiness by subject</h2>
            <BarChart data={stream.subjects.map((s) => ({ label: s.short, value: s.readiness, color: s.color }))} />
          </div>
          <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>PYQ distribution</h2>
            <PieChart
              data={stream.subjects.slice(0, 6).map((s) => ({ label: s.short, value: s.pyqs, color: s.color }))}
            />
          </div>
        </section>

        {/* ── Subject Dashboard ─────────────────────────────────────── */}
        <GateDashboardClient stream={stream} />

        {/* ── Heatmap ──────────────────────────────────────────────── */}
        <section className="glass-card-static" style={{ padding: 22, borderRadius: 8, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Questions solved — monthly</h2>
            <span
              style={{
                fontSize: 12, fontWeight: 800, color: stream.accentColor,
                background: `${stream.accentColor}18`, padding: "3px 10px",
                borderRadius: 6, border: `1px solid ${stream.accentColor}44`,
              }}
            >
              {stream.label}
            </span>
          </div>
          <Heatmap streamId={stream.id} />
        </section>
      </main>
    </>
  );
}
