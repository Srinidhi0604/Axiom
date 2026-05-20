import Link from "next/link";
import { BarChart, RadarChart } from "@/components/gate/Charts";
import { gateSubjects, getGateMock } from "@/data/gate";

export default async function GateMockResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  const { testId } = await params;
  const query = await searchParams;
  const mock = getGateMock(testId);
  const score = Number(query.score ?? 0);
  const total = Number(query.total ?? 1);
  const percent = Math.round((score / Math.max(total, 1)) * 100);

  return (
    <main>
      <div style={{ marginBottom: 22 }}>
        <div style={{ color: "var(--accent-cyan)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>TEST RESULTS</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>{mock?.title ?? "Mock test"} result</h1>
        <p style={{ color: "var(--text-secondary)" }}>Score: {score}/{total} marks</p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 380px)", gap: 18 }}>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Performance summary</h2>
          <div style={{ fontSize: 64, fontWeight: 900, color: percent >= 60 ? "var(--accent-green)" : "var(--accent-amber)", marginBottom: 16 }}>{percent}%</div>
          <BarChart data={gateSubjects.slice(0, 6).map((subject, index) => ({ label: subject.short, value: Math.max(22, percent - index * 4), color: subject.color }))} />
        </div>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Subject radar</h2>
          <RadarChart data={gateSubjects.slice(0, 6).map((subject, index) => ({ label: subject.short, value: Math.max(30, percent - index * 3) }))} />
          <Link href="/gate/practice" className="btn-primary" style={{ textDecoration: "none", borderRadius: 8, display: "inline-block" }}>
            Practice weak areas
          </Link>
        </div>
      </section>
    </main>
  );
}
