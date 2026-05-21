import Link from "next/link";
import ResearchSection from "@/components/ResearchSection";
import TracksSection from "@/components/TracksSection";

const featureCards = [
  {
    title: "College Exam Prep",
    desc: "Semester, department, course, module, and concept workspaces from the College Prep vertical.",
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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "100px 0 80px",
          minHeight: "80vh",
          flexWrap: "wrap",
          gap: 40,
        }}
        className="animate-fade-in"
      >
        <div style={{ flex: "1 1 500px", maxWidth: 540 }}>
          <h1
            style={{
              fontSize: "clamp(48px, 5vw, 64px)",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Axiom
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            PaperLabs redefined as one multi-vertical education platform: college exams,
            GATE, research papers, placements, and repo-based learning, all inside the same
            implementation-first workspace.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/papers" className="btn-minimalist">
              Start Implementing
            </Link>
            <Link href="/placement" className="btn-secondary" style={{ textDecoration: "none" }}>
              Open PlacePrep
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: 400, height: 400 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ overflow: "visible" }}>
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

      <section style={{ padding: "80px 0 120px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, marginBottom: 16, letterSpacing: "-0.02em" }}>
          What Axiom <span style={{ color: "var(--accent-pink)" }}>actually offers</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 680, margin: "0 auto 64px", lineHeight: 1.6 }}>
          One integrated app, five complete verticals, one shared PaperLabs design language.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, textAlign: "left", marginBottom: 64 }}>
          {featureCards.map((feature) => (
            <Link key={feature.title} href={feature.href} style={{ textDecoration: "none" }}>
              <div style={{ padding: 32, borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", minHeight: 210, transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", borderRadius: 8, color: "var(--text-muted)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{feature.title}</h3>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
