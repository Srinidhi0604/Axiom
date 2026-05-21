import Link from "next/link";
import ResearchSection from "@/components/ResearchSection";
import { axiomVerticals } from "@/data/axiom";
import styles from "./axiom.module.css";

export default function HomePage() {
  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Axiom</p>
          <h1>One PaperLabs-style app for all five student verticals.</h1>
          <p>
            Keep the same dark PaperLabs shell, but move across research papers, placement prep,
            college exam maps, GATE practice, and Vibe Lab repo workflows without leaving the app.
          </p>
          <div className={styles.heroActions}>
            <Link href="/papers" className="btn-primary" style={{ textDecoration: "none" }}>
              Open Paper Labs
            </Link>
            <Link href="/placement" className="btn-secondary" style={{ textDecoration: "none" }}>
              Open PlacePrep
            </Link>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.miniGrid}>
            <div className={styles.metric}>
              <div>
                <span className={styles.eyebrow} style={{ marginBottom: 6, display: "block" }}>Verticals</span>
                <strong>5</strong>
              </div>
              <span className={styles.pill}>Unified shell</span>
            </div>
            <div className={styles.metric}>
              <div>
                <span className={styles.eyebrow} style={{ marginBottom: 6, display: "block" }}>Placement</span>
                <strong>17,931</strong>
              </div>
              <span className={styles.pill}>Questions</span>
            </div>
            <div className={styles.metric}>
              <div>
                <span className={styles.eyebrow} style={{ marginBottom: 6, display: "block" }}>Learning</span>
                <strong>One app</strong>
              </div>
              <span className={styles.pill}>Axiom</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Verticals</p>
            <h2>Everything accessible from the landing page</h2>
          </div>
        </div>

        <div className={styles.grid}>
          {axiomVerticals.map((vertical) => (
            <Link key={vertical.slug} href={vertical.href} className={styles.card}>
              <div>
                <div className={styles.cardStripe} style={{ background: vertical.accent }} />
                <h3>{vertical.title}</h3>
                <p className={styles.muted}>{vertical.description}</p>
              </div>
              <div>
                <div className={styles.stats}>
                  {vertical.stats.map((stat) => (
                    <span key={stat} className={styles.pill}>{stat}</span>
                  ))}
                </div>
                <div className={styles.actions}>
                  {vertical.actions.map((action) => (
                    <span key={action.href} className={styles.action}>{action.label}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ResearchSection />
    </div>
  );
}
