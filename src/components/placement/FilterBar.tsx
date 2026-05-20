"use client";

import styles from "./placement.module.css";

export function FilterBar({
  topics,
  topic,
  difficulty,
  solved,
  onTopic,
  onDifficulty,
  onSolved,
}: {
  topics: { slug: string; name: string }[];
  topic: string;
  difficulty: string;
  solved: "all" | "solved" | "unsolved";
  onTopic: (value: string) => void;
  onDifficulty: (value: string) => void;
  onSolved: (value: "all" | "solved" | "unsolved") => void;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <select className={styles.select} value={difficulty} onChange={(event) => onDifficulty(event.target.value)}>
          <option value="all">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select className={styles.select} value={solved} onChange={(event) => onSolved(event.target.value as "all" | "solved" | "unsolved")}>
          <option value="all">All status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>
      <div className={styles.filters}>
        <button className={`${styles.chip} ${topic === "all" ? styles.chipActive : ""}`} onClick={() => onTopic("all")}>All</button>
        {topics.map((item) => (
          <button key={item.slug} className={`${styles.chip} ${topic === item.slug ? styles.chipActive : ""}`} onClick={() => onTopic(item.slug)}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
