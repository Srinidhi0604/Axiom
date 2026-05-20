import Link from "next/link";
import { KaTeXRenderer } from "@/components/gate/KaTeXRenderer";
import { gateSubjects } from "@/data/gate";

export default function GateFormulasPage() {
  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-amber)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>FORMULA SHEETS</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Subject-wise recall sheets</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          Quick formulas, definitions, and traps for every GATE subject. Expressions render through a shared math component.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {gateSubjects.map((subject) => (
          <article key={subject.id} className="glass-card" style={{ padding: 22, borderRadius: 8 }}>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>{subject.title}</h2>
            <p style={{ color: subject.color, fontSize: 12, fontWeight: 900, marginBottom: 16 }}>{subject.weightage}</p>
            <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
              {subject.formulas.slice(0, 2).map((formula) => (
                <div key={formula.title}>
                  <strong style={{ display: "block", marginBottom: 6 }}>{formula.title}</strong>
                  <KaTeXRenderer expression={formula.expression} />
                </div>
              ))}
            </div>
            <Link href={`/gate/formulas/${subject.id}`} className="btn-secondary" style={{ textDecoration: "none", borderRadius: 8 }}>
              Open sheet
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
