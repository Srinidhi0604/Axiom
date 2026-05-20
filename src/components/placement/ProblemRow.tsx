"use client";

import type { PlacementProblem } from "@/data/placement/types";
import styles from "./placement.module.css";

const difficultyClass = {
  Easy: styles.easy,
  Medium: styles.medium,
  Hard: styles.hard,
};

export function ProblemRow({
  problem,
  index,
  solved,
  note,
  onSolved,
  onNote,
}: {
  problem: PlacementProblem;
  index: number;
  solved: boolean;
  note: string;
  onSolved: (slug: string, solved: boolean) => void;
  onNote: (slug: string, note: string) => void;
}) {
  return (
    <tr className={solved ? styles.solved : ""}>
      <td>{index + 1}</td>
      <td><a className={styles.problemLink} href={problem.url} target="_blank" rel="noreferrer">{problem.title}</a></td>
      <td><span className={`${styles.badge} ${difficultyClass[problem.difficulty]}`}>{problem.difficulty}</span></td>
      <td><span className={styles.badge}>{problem.topic}</span></td>
      <td>
        {problem.solutionUrl ? <a className={styles.iconButton} href={problem.solutionUrl} target="_blank" rel="noreferrer" title="Open solution">▶</a> : <span className={styles.muted}>Static</span>}
      </td>
      <td><input className={styles.noteInput} value={note} onChange={(event) => onNote(problem.slug, event.target.value)} placeholder="Add note" /></td>
      <td><input type="checkbox" checked={solved} onChange={(event) => onSolved(problem.slug, event.target.checked)} aria-label={`Mark ${problem.title} solved`} /></td>
    </tr>
  );
}
