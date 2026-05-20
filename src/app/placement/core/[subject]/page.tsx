import Link from "next/link";
import styles from "../../placement.module.css";

export default async function CoreSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const title = subject.toUpperCase();
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to PlacePrep"}
      </Link>
      <section style={{ marginTop: 58 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900 }}>{title} Sheet</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 760, lineHeight: 1.75, marginTop: 20 }}>
          Core CS interview notes and implementation-oriented checkpoints.
        </p>
      </section>
    </main>
  );
}
