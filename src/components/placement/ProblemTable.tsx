"use client";

import { useMemo, useState } from "react";
import type { PlacementProblem } from "@/data/placement/types";
import styles from "./placement.module.css";
import { ProblemRow } from "./ProblemRow";

type SortKey = "topic" | "difficulty" | "solved";
const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };

export function ProblemTable({
  problems,
  solvedSet,
  notesMap,
  onSolved,
  onNote,
}: {
  problems: PlacementProblem[];
  solvedSet: Set<string>;
  notesMap: Record<string, string>;
  onSolved: (slug: string, solved: boolean) => void;
  onNote: (slug: string, note: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("topic");
  const sorted = useMemo(() => {
    return [...problems].sort((a, b) => {
      if (sort === "difficulty") return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      if (sort === "solved") return Number(solvedSet.has(b.slug)) - Number(solvedSet.has(a.slug));
      return a.topic.localeCompare(b.topic) || a.id - b.id;
    });
  }, [problems, solvedSet, sort]);

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar} style={{ marginBottom: 14 }}>
        <strong>{sorted.length} problems</strong>
        <select className={styles.select} value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
          <option value="topic">Sort by topic</option>
          <option value="difficulty">Sort by difficulty</option>
          <option value="solved">Sort by solved</option>
        </select>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>#</th><th>Problem Title</th><th>Difficulty</th><th>Topic</th><th>Solution</th><th>Notes</th><th>Solved</th></tr>
          </thead>
          <tbody>
            {sorted.map((problem, index) => (
              <ProblemRow key={`${problem.companySlug ?? "dsa"}-${problem.slug}-${index}`} problem={problem} index={index} solved={solvedSet.has(problem.slug)} note={notesMap[problem.slug] ?? ""} onSolved={onSolved} onNote={onNote} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
