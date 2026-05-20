import { BarChart, Heatmap, LineChart, PieChart, RadarChart } from "@/components/gate/Charts";
import { gateQuestions, gateSubjects } from "@/data/gate";

export default function GateAnalyticsPage() {
  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-purple)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>ANALYTICS</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Preparation analytics</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          Radar, line, bar, pie, and heatmap chart components ready for real user progress data.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ marginBottom: 16 }}>Subject mastery</h2><RadarChart data={gateSubjects.slice(0, 6).map((s) => ({ label: s.short, value: s.readiness }))} /></div>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ marginBottom: 16 }}>Mock trend</h2><LineChart data={[42, 48, 53, 61, 66, 71].map((value, i) => ({ label: `M${i + 1}`, value }))} /></div>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ marginBottom: 16 }}>Readiness</h2><BarChart data={gateSubjects.map((s) => ({ label: s.short, value: s.readiness, color: s.color }))} /></div>
        <div className="glass-card-static" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ marginBottom: 16 }}>Question mix</h2><PieChart data={["MCQ", "MSQ", "NAT", "CODE"].map((type, index) => ({ label: type, value: gateQuestions.filter((q) => q.type === type).length, color: ["#38bdf8", "#22c55e", "#f59e0b", "#ec4899"][index] }))} /></div>
      </section>
      <section className="glass-card-static" style={{ padding: 22, borderRadius: 8, marginTop: 16 }}>
        <h2 style={{ marginBottom: 16 }}>Daily practice heatmap</h2>
        <Heatmap />
      </section>
    </main>
  );
}
