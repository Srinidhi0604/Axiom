import Link from "next/link";
import {
  blogs,
  competitiveProgramming,
  coreSubjects,
  dsaPlaylists,
  dsaSheets,
  aptitudeTracks,
  placementCategories,
  sqlTracks,
  systemDesignTracks,
} from "@/data/placement";
import styles from "./placement.module.css";

function TrackCard({
  item,
  tone,
}: {
  item: { title: string; description: string; href: string };
  tone?: "purple" | "green" | "pink";
}) {
  return (
    <div className={`${styles.trackCard} ${tone ? styles[tone] : ""}`}>
      <div>
        <strong>{item.title}</strong>
        <p>{item.description}</p>
      </div>
      <div className={styles.buttonRow}>
        <Link href={item.href}>Open</Link>
        <Link href="/placement/learn">Learn</Link>
      </div>
    </div>
  );
}

export default function PlacementPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.dashboard}>
        <section className={styles.mainPanel}>
          <section className={styles.section}>
            <h1 className={styles.sectionTitle}>Categories</h1>
            <div className={styles.taskTrack}>
              {placementCategories.map((category, index) => (
                <Link key={category.slug} href={category.href} className={styles.taskRow}>
                  <div className={styles.taskIndex}>
                    <span>Track</span>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </div>
                  <div className={styles.taskBody}>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                  <span className={styles.pill}>Open</span>
                  <div className="completion-circle" />
                </Link>
              ))}
            </div>
          </section>

          <section id="dsa" className={styles.section}>
            <h2 className={styles.sectionTitle}>DSA Sheets</h2>
            <div className={styles.cardGrid}>
              {dsaSheets.map((item) => <TrackCard key={item.title} item={item} />)}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>DSA Playlist</h2>
            <div className={styles.cardGrid}>
              {dsaPlaylists.map((item) => <TrackCard key={item.title} item={item} />)}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Competitive Programming</h2>
            <div className={styles.cardGrid}>
              {competitiveProgramming.map((item) => <TrackCard key={item.title} item={item} tone="green" />)}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SQL + Labs</h2>
            <div className={styles.cardGrid}>
              {sqlTracks.map((item) => <TrackCard key={item.title} item={item} tone="green" />)}
            </div>
          </section>

          <section id="core-cs" className={styles.section}>
            <h2 className={styles.sectionTitle}>Core CS Subjects</h2>
            <div className={styles.cardGrid}>
              {coreSubjects.map((item) => <TrackCard key={item.title} item={item} tone="purple" />)}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Blogs</h2>
            <div className={styles.cardGrid}>
              {blogs.map((item) => <TrackCard key={item.title} item={item} tone="pink" />)}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Aptitude + Mock Tests</h2>
            <div className={styles.cardGrid}>
              {aptitudeTracks.map((item) => <TrackCard key={item.title} item={item} tone="pink" />)}
            </div>
          </section>
        </section>

        <aside className={styles.sidePanel}>
          <div className={styles.progressPanel}>
            <div className={styles.progressRing}>0</div>
            <div className={styles.progressLegend}>
              <strong className={styles.pill}>DSA Progress</strong>
              <span><i className={styles.dot} style={{ background: "#10b981" }} />Easy 0/389</span>
              <span><i className={styles.dot} style={{ background: "#fde047" }} />Medium 0/506</span>
              <span><i className={styles.dot} style={{ background: "#ef4444" }} />Hard 0/287</span>
            </div>
          </div>
          {[
            ["Calendar + Roadmap", "/placement/roadmap"],
            ["Sessions", "/placement/learn"],
            ["Daily Planner", "/placement/roadmap"],
            ["Bookmarks", "/placement/dsa?sheet=bookmarks"],
            ["Mock Test History", "/placement/aptitude/mock-test"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className={styles.plannerPanel}>
              <strong>{label}</strong>
              <span className={styles.lock}>→</span>
            </Link>
          ))}
          <div className={styles.progressPanel} style={{ minHeight: 280, gridTemplateColumns: "1fr" }}>
            <strong>System Design Build Tracks</strong>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Start with {systemDesignTracks[0].title}, then move through caching, load balancing, and queues.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
