import Link from "next/link";
import { dsaPlaylists } from "@/data/placement";
import styles from "../placement.module.css";

export default function RoadmapPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.mainPanel}>
        <h1 className={styles.sectionTitle}>Roadmap</h1>
        <div className={styles.cardGrid}>
          {dsaPlaylists.map((item) => (
            <Link key={item.title} href={item.href} className={styles.trackCard}>
              <div><strong>{item.title}</strong><p>{item.description}</p></div>
              <span className={styles.startButton}>Start Learning</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
