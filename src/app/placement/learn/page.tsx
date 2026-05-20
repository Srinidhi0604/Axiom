import Link from "next/link";
import { dsaCourseSections } from "@/data/placement";
import styles from "../placement.module.css";

export default function PlacementLearnPage() {
  return (
    <main className={styles.learnShell}>
      <aside className={styles.lessonSidebar}>
        <div className={styles.lessonLogoRow}>
          <Link href="/placement" className={styles.lessonLogo}>P</Link>
          <span style={{ color: "var(--text-muted)" }}>⌕</span>
        </div>

        <div className={styles.basicTabs}>
          <span>Basic</span>
          <span>Advanced</span>
          <strong>0/435</strong>
        </div>

        <div className={styles.lessonList}>
          {dsaCourseSections.map((section, sectionIndex) => (
            <section key={section.title} className={styles.lessonGroup}>
              <div className={styles.lessonGroupHeader}>
                <span>▱ {section.title}</span>
                <span>⌄</span>
              </div>
              {section.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson}
                  className={`${styles.lessonItem} ${sectionIndex === 0 && lessonIndex === 1 ? styles.lessonItemActive : ""}`}
                >
                  <span>{lesson}</span>
                  <span>♡</span>
                </div>
              ))}
            </section>
          ))}
        </div>

        <div className={styles.bottomDock}>
          <span>▦</span>
          <span>▤ Track</span>
          <span>⌁</span>
          <span>♧</span>
        </div>
      </aside>

      <section className={styles.videoPane}>
        <div className={styles.roadmapBanner}>
          <span>Set your roadmap and track your progress <Link href="/placement/roadmap">here</Link></span>
          <span>◷ ✧</span>
        </div>
        <div>
          <div className={styles.paneTitle}>Flowcharts and Logical Thinking</div>
          <div className={styles.videoBox}>Flowchart lesson video placeholder</div>
        </div>
        <div className={styles.draggableHint}>This video section is draggable - study as you like ×</div>
      </section>

      <section className={styles.theoryPane}>
        <div className={styles.theoryTabs}>
          <div>
            <span>▣ Theory</span>
            <span>▱ Discussion</span>
          </div>
          <label className={styles.studyToggle}>◯ Study view</label>
        </div>
        <p style={{ color: "var(--text-secondary)", fontWeight: 800 }}>
          Theory, discussion, bookmarks and study mode are available for every PlacePrep lesson.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {["Brute", "Better", "Optimal"].map((item) => <span key={item} className={styles.pill}>{item}</span>)}
        </div>
        <div className={styles.lockedTheory}>Flowchart → Pseudocode → Dry Run → Code</div>
        <article className={styles.theoryArticle}>
          <h2>Intuition:</h2>
          <p>
            Flowcharts and logical thinking train you to convert a statement into deterministic steps before writing code.
            In PlacePrep, every DSA, LLD and system design topic follows the same rhythm: intuition, brute force,
            better approach, optimal approach, implementation, tests and interview follow-up.
          </p>
        </article>
      </section>
    </main>
  );
}
