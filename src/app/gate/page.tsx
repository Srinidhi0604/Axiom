import Link from "next/link";
import { BarChart, Heatmap, PieChart } from "@/components/gate/Charts";
import { GateDashboardClient } from "@/components/gate/GateDashboardClient";
import { QuestionCard } from "@/components/gate/QuestionCard";
import { gateMocks, gateQuestions, gateSubjects } from "@/data/gate";

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
      <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>{value}</div>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55 }}>{detail}</p>
    </div>
  );
}

export default function GatePage() {
  const totalPyqs = gateSubjects.reduce((sum, subject) => sum + subject.pyqs, 0);
  const averageReadiness = Math.round(gateSubjects.reduce((sum, subject) => sum + subject.readiness, 0) / gateSubjects.length);

  return (
    <main>
      <section className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)", gap: 24, alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ color: "var(--accent-cyan)", fontSize: 12, fontWeight: 900, marginBottom: 12 }}>GATE CS VERTICAL</div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 68px)", lineHeight: 1.02, fontWeight: 900, letterSpacing: 0, marginBottom: 20, maxWidth: 820 }}>
            One workspace for GATE PYQs, mocks, formulas, analytics, and practice.
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.7, maxWidth: 720, marginBottom: 26 }}>
            Practice MCQ, MSQ, NAT, and code-style questions across every major GATE CS subject, then convert results into a revision plan.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/gate/practice" className="btn-primary" style={{ textDecoration: "none", borderRadius: 8 }}>Start Practice</Link>
            <Link href="/gate/mock-tests" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>Take Mock</Link>
            <Link href="/gate/pyq" className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>Browse PYQs</Link>
          </div>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "linear-gradient(180deg, rgba(6,182,212,0.12), rgba(255,255,255,0.025))", padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <StatCard label="PYQ BANK" value={`${totalPyqs}+`} detail="Subject-tagged question pool." />
            <StatCard label="READINESS" value={`${averageReadiness}%`} detail="Current roadmap baseline." />
            <StatCard label="MOCKS" value={`${gateMocks.length}`} detail="Diagnostic, full, and sprint tests." />
            <StatCard label="PRACTICE TYPES" value="MCQ MSQ NAT CODE" detail="QuestionCard supports all modes." />
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(360px, 1.1fr)", gap: 18, marginBottom: 34 }}>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8, background: "linear-gradient(180deg, rgba(16,185,129,0.08), rgba(255,255,255,0.025))" }}>
          <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>TODAY&apos;S PLAN</div>
          <h2 style={{ fontSize: 30, lineHeight: 1.15, marginBottom: 16 }}>Solve 12 questions, review 3 formulas, take 1 sprint.</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {["2 Algorithms PYQs", "2 DBMS normalization questions", "1 NAT speed drill", "1 code implementation problem"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <QuestionCard question={gateQuestions[0]} compact />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 360px)", gap: 18, marginBottom: 34 }}>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
          <h2 style={{ fontSize: 24, marginBottom: 18 }}>Readiness by subject</h2>
          <BarChart data={gateSubjects.map((subject) => ({ label: subject.short, value: subject.readiness, color: subject.color }))} />
        </div>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
          <h2 style={{ fontSize: 24, marginBottom: 18 }}>Question mix</h2>
          <PieChart data={[
            { label: "MCQ", value: gateQuestions.filter((q) => q.type === "MCQ").length, color: "#38bdf8" },
            { label: "MSQ", value: gateQuestions.filter((q) => q.type === "MSQ").length, color: "#22c55e" },
            { label: "NAT", value: gateQuestions.filter((q) => q.type === "NAT").length, color: "#f59e0b" },
            { label: "Code", value: gateQuestions.filter((q) => q.type === "CODE").length, color: "#ec4899" },
          ]} />
        </div>
      </section>

      <GateDashboardClient />

      <section className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}>
        <h2 style={{ fontSize: 24, marginBottom: 18 }}>Study heatmap</h2>
        <Heatmap />
      </section>
    </main>
  );
}
