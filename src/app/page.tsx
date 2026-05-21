import Link from "next/link";
import ResearchSection from "@/components/ResearchSection";
import TracksSection from "@/components/TracksSection";
import styles from "./home.module.css";

const featureCards = [
  {
    title: "College Exam Prep",
    desc: "Semester, department, course, module, and concept workspaces structured for engineering students.",
    href: "/college",
  },
  {
    title: "GATE Command",
    desc: "PYQs, mocks, formulas, syllabus, analytics, rank predictor, and practice mode.",
    href: "/gate",
  },
  {
    title: "Paper Labs",
    desc: "Research paper readers and implementation tracks with runnable code tasks.",
    href: "/papers",
  },
  {
    title: "PlacePrep",
    desc: "DSA, company questions, system design, LLD, SQL, aptitude, and interview prep.",
    href: "/placement",
  },
  {
    title: "Vibe Lab",
    desc: "Repo analysis, generated implementation tasks, security labs, scaling drills, and simulator flows.",
    href: "/vibe",
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={`${styles.hero} animate-fade-in`}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>Axiom</h1>
          <p className={styles.heroText}>
            The ultimate multi-vertical education platform: master your college exams, 
            crack GATE, dissect research papers, secure top placements, and practice real-world repo building.
            All integrated into one unified workspace.
          </p>

          <div className={styles.heroActions}>
            <Link href="/college" className="btn-minimalist">
              College Prep
            </Link>
            <Link href="/gate" className="btn-minimalist">
              GATE Command
            </Link>
            <Link href="/papers" className="btn-minimalist">
              Paper Labs
            </Link>
            <Link href="/placement" className="btn-minimalist">
              PlacePrep
            </Link>
            <Link href="/vibe" className="btn-minimalist">
              Vibe Lab
            </Link>
          </div>
        </div>

        <div className={styles.heroArt}>
          <div className={styles.networkFrame} aria-hidden="true">
            <svg viewBox="0 0 400 400">
              {[
                [200, 50, 300, 80],
                [200, 50, 100, 150],
                [300, 80, 400, 200],
                [100, 150, 200, 250],
                [200, 250, 300, 200],
                [300, 200, 400, 200],
                [100, 150, 100, 300],
                [100, 300, 200, 350],
                [200, 250, 200, 350],
                [200, 250, 300, 300],
                [300, 300, 400, 350],
                [400, 200, 400, 350],
                [200, 50, 200, 150],
                [300, 80, 200, 150],
                [300, 200, 300, 300],
                [200, 150, 300, 200],
                [200, 150, 100, 300],
              ].map(([x1, y1, x2, y2], index) => (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
              ))}
              {[
                [200, 50],
                [300, 80],
                [100, 150],
                [200, 150],
                [400, 200],
                [100, 300],
                [200, 250],
                [300, 200],
                [200, 350],
                [300, 300],
                [400, 350],
              ].map(([cx, cy], index) => (
                <circle key={index} cx={cx} cy={cy} r="7" fill="white" />
              ))}
              <circle r="3" fill="#ef4444">
                <animateMotion dur="3s" repeatCount="indefinite" path="M191.5,58.5 L108.5,141.5 L191.5,58.5" />
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="4s" repeatCount="indefinite" path="M211.5,53.5 L288.5,76.5 L211.5,53.5" />
              </circle>
              <circle r="3" fill="#10b981">
                <animateMotion dur="3.6s" repeatCount="indefinite" path="M200,262 L200,338 L200,262" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      <ResearchSection />
      <TracksSection />

      <section className={styles.offerSection}>
        <h2 className={styles.sectionTitle}>
          What Axiom <span style={{ color: "var(--accent-pink)" }}>actually offers</span>
        </h2>
        <p className={styles.sectionIntro}>
          One integrated app, five complete verticals, and a beautifully unified design language.
        </p>

        <div className={styles.featureGrid}>
          {featureCards.map((feature) => (
            <Link key={feature.title} href={feature.href} className={styles.featureLink}>
              <div className={styles.featureCard}>
                <div className={styles.featureHeader}>
                  <div className={styles.featureIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3>{feature.title}</h3>
                </div>
                <p style={{ marginBottom: "20px" }}>{feature.desc}</p>
                <div style={{ marginTop: "auto" }}>
                  <span className="btn-secondary" style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
                    Open {feature.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
