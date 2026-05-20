import Link from "next/link";
import { notFound } from "next/navigation";
import { KaTeXRenderer } from "@/components/gate/KaTeXRenderer";
import { getGateSubject } from "@/data/gate";

export default async function GateFormulaSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = getGateSubject(subjectId);
  if (!subject) notFound();

  return (
    <main>
      <Link href="/gate/formulas" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 800 }}>Back to formula hub</Link>
      <div style={{ margin: "18px 0 24px" }}>
        <div style={{ color: subject.color, fontSize: 12, fontWeight: 900, marginBottom: 8 }}>FORMULA SHEET</div>
        <h1 style={{ fontSize: 42 }}>{subject.title}</h1>
      </div>
      <section style={{ display: "grid", gap: 14 }}>
        {subject.formulas.map((formula) => (
          <article key={formula.title} className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>{formula.title}</h2>
            <KaTeXRenderer expression={formula.expression} />
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, marginTop: 12 }}>{formula.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
