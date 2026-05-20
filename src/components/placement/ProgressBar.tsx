"use client";

import styles from "./placement.module.css";

export function ProgressBar({ solved, total }: { solved: number; total: number }) {
  const percent = total ? Math.round((solved / total) * 100) : 0;
  return (
    <div className={styles.panel}>
      <div className={styles.progressLabel}>
        <strong>{solved} / {total} solved</strong>
        <span className={styles.muted}>{percent}% complete</span>
      </div>
      <div className={styles.progressTrack} style={{ marginTop: 12 }}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
