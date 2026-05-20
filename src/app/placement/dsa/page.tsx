import Link from "next/link";
import { dsaPlaylists, dsaSheets } from "@/data/placement";
import styles from "../placement.module.css";

export default function DsaPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.mainPanel}>
        <h1 className={styles.sectionTitle}>DSA Sheet</h1>
        <div className={styles.cardGrid}>
          {[...dsaSheets, ...dsaPlaylists].map((item) => (
            <Link key={item.title} href={item.href} className={styles.trackCard}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span className={styles.startButton}>Start Learning</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
