import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import styles from "../placement.module.css";

type CompanySummary = {
  slug: string;
  name: string;
  count: number;
  easy: number;
  medium: number;
  hard: number;
};

async function loadCompanies() {
  const file = await fs.readFile(path.join(process.cwd(), "public", "data", "placement", "companies-index.json"), "utf8");
  return JSON.parse(file) as { totalQuestions: number; companies: CompanySummary[] };
}

export default async function CompaniesPage() {
  const { totalQuestions, companies } = await loadCompanies();

  return (
    <main className={styles.shell}>
      <section className={styles.mainPanel}>
        <h1 className={styles.sectionTitle}>Interview Experience</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
          {companies.length} companies · {totalQuestions.toLocaleString()} company-tagged questions from CodeJeet CSVs.
        </p>
        <div className={styles.cardGrid}>
          {companies.map((company) => (
            <Link key={company.slug} href={`/placement/companies/${company.slug}`} className={styles.trackCard}>
              <div>
                <strong>{company.name}</strong>
                <p>{company.count} questions · Easy {company.easy} · Medium {company.medium} · Hard {company.hard}</p>
              </div>
              <span className={styles.startButton}>View Questions</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
