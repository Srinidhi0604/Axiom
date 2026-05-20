import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import styles from "../../placement.module.css";

type CompanyQuestion = {
  id: number;
  slug: string;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  acceptance: string;
  frequency: string;
};

async function loadCompany(slug: string) {
  try {
    const file = await fs.readFile(path.join(process.cwd(), "public", "data", "placement", "companies", `${slug}.json`), "utf8");
    return JSON.parse(file) as { slug: string; name: string; questions: CompanyQuestion[] };
  } catch {
    notFound();
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const { name, questions } = await loadCompany(company);
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement/companies" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
        {"<- Back to Companies"}
      </Link>
      <section style={{ marginTop: 58 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900 }}>{name} Interview Track</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 760, lineHeight: 1.75, marginTop: 20 }}>
          {questions.length} CodeJeet company-tagged questions with links, difficulty, acceptance and frequency.
        </p>
      </section>
      <section className={styles.taskTrack} style={{ marginTop: 42 }}>
        {questions.map((question, index) => (
          <Link key={question.title} href={question.url} className={styles.taskRow}>
            <div className={styles.taskIndex}><span>Q</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
            <div className={styles.taskBody}>
              <h3>{question.title}</h3>
              <p>{question.topic} · Acceptance {question.acceptance || "N/A"} · Frequency {question.frequency || "N/A"}</p>
            </div>
            <span className={`badge-${question.difficulty.toLowerCase()}`} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 800 }}>{question.difficulty}</span>
            <div className="completion-circle" />
          </Link>
        ))}
      </section>
    </main>
  );
}
