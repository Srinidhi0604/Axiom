import Link from "next/link";
import { gateMocks, getGateQuestion } from "@/data/gate";

export default function GateMockTestsPage() {
  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>MOCK TEST HUB</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Timed tests and sprints</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 720 }}>
          Launch a test engine with countdown timer, question palette, answer checking, and result review.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
        {gateMocks.map((mock) => {
          const marks = mock.questions.reduce((sum, id) => sum + (getGateQuestion(id)?.marks ?? 0), 0);
          return (
            <article key={mock.id} className="glass-card" style={{ padding: 24, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <h2 style={{ fontSize: 22 }}>{mock.title}</h2>
                <span className="badge-easy" style={{ borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 900 }}>{mock.status}</span>
              </div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{mock.focus}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, marginBottom: 18 }}>
                <span>{Math.round(mock.durationSeconds / 60)} min</span>
                <span>{mock.questions.length} questions</span>
                <span>{marks} marks</span>
              </div>
              <Link href={`/gate/mock-tests/${mock.id}`} className="btn-primary" style={{ textDecoration: "none", borderRadius: 8, display: "inline-block" }}>
                Start test
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
