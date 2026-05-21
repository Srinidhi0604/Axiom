import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.matrixBg} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            Don't just study.<br />
            Build.
          </h1>
          <p className={styles.heroText}>
            Bridge the gap between curriculum and career. Master College, GATE, and Placements with targeted learning workspaces, from scratch, line by line.
          </p>

          <div className={styles.heroActions}>
            <Link href="/college" className={styles.btnPrimary}>
              Start Coding
            </Link>
            <Link href="/auth/signup" className={styles.btnSecondary}>
              Sign Up Free
            </Link>
          </div>
          
          <div className={styles.socialProof}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{ marginLeft: "8px" }}><b>4,250</b> people coding now</span>
          </div>
        </div>

        <div className={styles.heroArt}>
          <div className={styles.networkGraphic}>
            <svg viewBox="0 0 400 400" className={styles.svgNetwork}>
              {/* Edges */}
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
                // Add more crossing lines
                [100, 150, 300, 300],
                [200, 50, 400, 200],
                [100, 300, 300, 200],
              ].map(([x1, y1, x2, y2], index) => (
                <line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                />
              ))}

              {/* Red lines for accent */}
              {[
                [200, 150, 300, 200],
                [300, 80, 300, 200],
                [200, 250, 300, 300],
                [300, 200, 400, 350]
              ].map(([x1, y1, x2, y2], index) => (
                <line
                  key={`redline-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(239, 68, 68, 0.4)"
                  strokeWidth="1"
                />
              ))}

              {/* Green nodes */}
              {[
                [180, 80], [280, 150], [320, 250], [120, 280], [140, 180]
              ].map(([cx, cy], index) => (
                <circle key={`greennode-${index}`} cx={cx} cy={cy} r="4" fill="#10b981" />
              ))}

              {/* Red nodes */}
              {[
                [220, 120], [340, 120], [280, 180], [260, 280], [350, 260]
              ].map(([cx, cy], index) => (
                <circle key={`rednode-${index}`} cx={cx} cy={cy} r="3" fill="#ef4444" />
              ))}

              {/* White large nodes */}
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
                <circle key={`whitenode-${index}`} cx={cx} cy={cy} r="6" fill="white" />
              ))}
            </svg>

            {/* Floating binary */}
            <div className={styles.floatingBinary} style={{ top: "10%", left: "-10%", color: "#10b981" }}>1<br/>1<br/>1</div>
            <div className={styles.floatingBinary} style={{ top: "40%", left: "105%", color: "rgba(255,255,255,0.3)" }}>0</div>
            <div className={styles.floatingBinary} style={{ bottom: "20%", left: "-5%", color: "#10b981" }}>0</div>
            <div className={styles.floatingBinary} style={{ bottom: "5%", right: "20%", color: "#10b981" }}>1</div>
          </div>
        </div>
      </section>
      
      {/* Scroll indicator overlay */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollArrow}>← SCROLL</span>
      </div>
    </div>
  );
}
