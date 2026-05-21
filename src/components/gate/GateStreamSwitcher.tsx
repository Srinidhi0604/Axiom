"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart, Heatmap, PieChart } from "@/components/gate/Charts";
import { GateDashboardClient } from "@/components/gate/GateDashboardClient";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { gateMocks, gateQuestions, gateStreams, GateStream } from "@/data/gate";

function StatCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
      <div style={{ color: accent, fontSize: 11, fontWeight: 900, marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>{value}</div>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55 }}>{detail}</p>
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

  // Only CS has questions & mocks in demo data
  const streamQuestions = gateQuestions.filter((q) =>
    stream.subjects.some((s) => s.id === q.subjectId),
  );
  const hasMocks = stream.id === "cs";

  return (
    <main>
      {/* ── Stream Switcher Tabs ─────────────────────────────────────── */}
      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          flexWrap: "wrap",
          padding: "4px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.07)",
          width: "fit-content",
        }}
      >
        {gateStreams.map((s) => {
          const isActive = s.id === activeStreamId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStreamId(s.id)}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.03em",
                display: "flex",
                alignItems: "center",
                gap: 7,
                transition: "all 0.2s ease",
                background: isActive ? s.accentColor : "transparent",
                color: isActive ? "#000" : "var(--text-secondary)",
                boxShadow: isActive ? `0 2px 12px ${s.accentColor}55` : "none",
              }}
            >
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ── Hero + Stat Cards ────────────────────────────────────────── */}
      <section
        className="animate-fade-in"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)",
          gap: 24,
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <div style={{ color: stream.accentColor, fontSize: 12, fontWeight: 900, marginBottom: 12, letterSpacing: "0.08em" }}>
            GATE {stream.label} VERTICAL
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 58px)", lineHeight: 1.05, fontWeight: 900, letterSpacing: 0, marginBottom: 16, maxWidth: 760 }}>
            {stream.fullName}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7, maxWidth: 680, marginBottom: 22 }}>
            {stream.description}. Practice MCQ, MSQ, NAT questions across every major subject — then convert results into a revision plan.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/gate/practice" className="btn-primary" style={{ textDecoration: "none", borderRadius: 8 }}>
              Start Practice
            </Link>
            {hasMocks && (
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
            padding: 18,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <StatCard label="PYQ BANK" value={`${totalPyqs}+`} detail="Subject-tagged question pool." accent={stream.accentColor} />
            <StatCard label="READINESS" value={`${averageReadiness}%`} detail="Current roadmap baseline." accent={stream.accentColor} />
            <StatCard label="SUBJECTS" value={`${stream.subjects.length}`} detail="Topics in this stream." accent={stream.accentColor} />
            <StatCard
              label="PRACTICE TYPES"
              value="MCQ MSQ NAT"
              detail="All GATE question formats."
              accent={stream.accentColor}
            />
          </div>
        </div>
      </section>

      {/* ── Today's Plan + Quick Question ───────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(360px, 1.1fr)", gap: 18, marginBottom: 34 }}>
        <div
          className="glass-card-static"
          style={{
            padding: 24,
            borderRadius: 8,
            background: "linear-gradient(180deg, rgba(16,185,129,0.08), rgba(255,255,255,0.025))",
          }}
        >
          <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>TODAY&apos;S PLAN</div>
          <h2 style={{ fontSize: 28, lineHeight: 1.15, marginBottom: 16 }}>Solve 12 questions, review 3 formulas, take 1 sprint.</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              `2 ${stream.subjects[0]?.short ?? ""} questions`,
              `2 ${stream.subjects[1]?.short ?? ""} problems`,
              "1 NAT speed drill",
              "Review formulas sheet",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: stream.accentColor, flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        {streamQuestions[0] ? (
          <QuestionCard question={streamQuestions[0]} compact />
        ) : (
          <div className="glass-card-static" style={{ padding: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{stream.emoji}</div>
              <p>Practice questions for {stream.label} coming soon.</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Charts ──────────────────────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 360px)", gap: 18, marginBottom: 34 }}>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>Readiness by subject</h2>
          <BarChart
            data={stream.subjects.map((s) => ({ label: s.short, value: s.readiness, color: s.color }))}
          />
        </div>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>PYQ distribution</h2>
          <PieChart
            data={stream.subjects.slice(0, 6).map((s) => ({
              label: s.short,
              value: s.pyqs,
              color: s.color,
            }))}
          />
        </div>
      </section>

      {/* ── Subject Dashboard ────────────────────────────────────────── */}
      <GateDashboardClient stream={stream} />

      {/* ── Heatmap ─────────────────────────────────────────────────── */}
      <section className="glass-card-static" style={{ padding: 22, borderRadius: 8, marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Questions solved — monthly</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Stream:</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: stream.accentColor,
                background: `${stream.accentColor}18`,
                padding: "3px 10px",
                borderRadius: 6,
                border: `1px solid ${stream.accentColor}44`,
              }}
            >
              {stream.label}
            </span>
          </div>
        </div>
        <Heatmap streamId={stream.id} />
      </section>
    </main>
  );
}
