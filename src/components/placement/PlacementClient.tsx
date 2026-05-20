"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PlacementData } from "@/data/placement/types";
import { systemDesignChapters } from "@/data/placement/system-design-chapters";
import { dsaTopics } from "@/data/placement/topics";
import { filterProblems, getPlacementData, slugify } from "@/lib/placement-data";
import styles from "./placement.module.css";
import { FilterBar } from "./FilterBar";
import { ProblemTable } from "./ProblemTable";
import { ProgressBar } from "./ProgressBar";
import { SearchBar } from "./SearchBar";

type Progress = { solvedProblems: string[]; notesMap: Record<string, string> };

function usePlacementData() {
  const [data, setData] = useState<PlacementData | null>(null);
  useEffect(() => {
    getPlacementData().then(setData).catch(() => setData({ generatedAt: "", questions: [], dsa: [], companies: [], topics: [] }));
  }, []);
  return data;
}

function useProgress() {
  const [progress, setProgress] = useState<Progress>({ solvedProblems: [], notesMap: {} });
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetch("/api/placement/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => body && setProgress({ solvedProblems: body.solvedProblems ?? [], notesMap: body.notesMap ?? {} }))
      .catch(() => undefined);
  }, []);

  const solvedSet = useMemo(() => new Set(progress.solvedProblems), [progress.solvedProblems]);

  function toggleSolved(slug: string, solved: boolean) {
    setProgress((current) => ({
      ...current,
      solvedProblems: solved ? Array.from(new Set([...current.solvedProblems, slug])) : current.solvedProblems.filter((item) => item !== slug),
    }));
    const token = localStorage.getItem("token");
    if (token) fetch("/api/placement/progress/solve", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ slug, solved }) });
  }

  function saveNote(slug: string, note: string) {
    setProgress((current) => ({ ...current, notesMap: { ...current.notesMap, [slug]: note } }));
    const token = localStorage.getItem("token");
    if (token) fetch("/api/placement/progress/note", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ slug, note }) });
  }

  return { progress, solvedSet, toggleSolved, saveNote };
}

export function PlacementProblemBrowser({ mode, companySlug, topicSlug }: { mode: "dsa" | "company"; companySlug?: string; topicSlug?: string }) {
  const params = useSearchParams();
  const data = usePlacementData();
  const { progress, solvedSet, toggleSolved, saveNote } = useProgress();
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(topicSlug ?? params.get("topic") ?? "all");
  const [difficulty, setDifficulty] = useState("all");
  const [solved, setSolved] = useState<"all" | "solved" | "unsolved">("all");

  const baseProblems = useMemo(() => {
    if (!data) return [];
    if (mode === "company") return data.questions.filter((problem) => problem.companySlug === companySlug);
    return data.dsa;
  }, [companySlug, data, mode]);

  const problems = useMemo(() => filterProblems(baseProblems, { search, topic, difficulty, solved, solvedSet }), [baseProblems, difficulty, search, solved, solvedSet, topic]);
  const topicOptions = dsaTopics.map((item) => ({ slug: item.slug, name: item.name }));
  const solvedCount = baseProblems.filter((problem) => solvedSet.has(problem.slug)).length;

  return (
    <main className={styles.shell}>
      <div className={styles.toolbar} style={{ marginBottom: 22 }}>
        <div>
          <p className={styles.eyebrow}>PlacePrep</p>
          <h1>{mode === "company" ? baseProblems[0]?.company ?? "Company Questions" : topicSlug ? dsaTopics.find((item) => item.slug === topicSlug)?.name : "DSA Sheet"}</h1>
        </div>
      </div>
      <ProgressBar solved={solvedCount} total={baseProblems.length || 450} />
      <SearchBar value={search} onChange={setSearch} />
      <div style={{ height: 14 }} />
      <FilterBar topics={topicOptions} topic={topic} difficulty={difficulty} solved={solved} onTopic={setTopic} onDifficulty={setDifficulty} onSolved={setSolved} />
      <ProblemTable problems={problems} solvedSet={solvedSet} notesMap={progress.notesMap} onSolved={toggleSolved} onNote={saveNote} />
    </main>
  );
}

export function CompanyGrid() {
  const data = usePlacementData();
  const [search, setSearch] = useState("");
  const companies = (data?.companies ?? []).filter((company) => company.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className={styles.shell}>
      <h1>Company Questions</h1>
      <p className={styles.subtitle}>Browse 660+ company archives generated from CodeJeet CSVs.</p>
      <div style={{ height: 20 }} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search company name" />
      <div className={styles.grid} style={{ marginTop: 22 }}>
        {companies.map((company) => <CompanyCard key={company.slug} company={company} />)}
      </div>
    </main>
  );
}

export function CompanyCard({ company }: { company: NonNullable<PlacementData["companies"]>[number] }) {
  const total = Math.max(company.count, 1);
  return (
    <Link className={styles.companyCard} href={`/placement/companies/${company.slug}`}>
      <div className={styles.companyHeader}>
        <strong>{company.name}</strong>
        <span className={styles.badge}>{company.count}</span>
      </div>
      <div className={styles.bars} style={{ "--easy": `${company.easy / total}fr`, "--medium": `${company.medium / total}fr`, "--hard": `${company.hard / total}fr` } as React.CSSProperties}>
        <span /><span /><span />
      </div>
      <p className={styles.meta} style={{ marginTop: 12 }}>View Questions</p>
    </Link>
  );
}

export function PlacementHome() {
  const data = usePlacementData();
  const { solvedSet } = useProgress();
  const categories = [
    { href: "/placement/dsa", title: "DSA Sheets", meta: "A2Z, Blind 75, SDE, Striver 79", count: "450" },
    { href: "/placement/companies", title: "Interview Experience", meta: "Company-wise asked questions", count: `${data?.companies.length ?? 660}+` },
    { href: "/placement/roadmap", title: "Core CS Subjects", meta: "CN, DBMS, OS style prep", count: "3" },
    { href: "/placement/system-design", title: "System Design", meta: "Primer-backed implementation tracks", count: "16" },
  ];
  const dsaSheets = [
    ["A2Z Sheet", "Master DSA from basics to advanced", "/placement/dsa"],
    ["Blind 75 Sheet", "Interview problems with video solutions", "/placement/dsa?topic=arrays"],
    ["SDE Sheet", "Most frequently asked interview questions", "/placement/dsa?topic=dynamic-programming"],
    ["Striver 79 Sheet", "Last minute preparation", "/placement/roadmap"],
  ] as const;
  const coreSubjects = [
    ["CN Sheet", "Most asked computer networks interview questions", "/placement/system-design/api-design"],
    ["DBMS Sheet", "Most asked database interview questions", "/placement/system-design/sql-vs-nosql"],
    ["OS Sheet", "Most asked operating system interview questions", "/placement/system-design/queues-and-streams"],
  ] as const;
  const progress = Math.round((Math.min(solvedSet.size, 450) / 450) * 100);

  return (
    <main className={styles.paperShell}>
      <Link href="/" className={styles.backLink}>{"<- Back to PaperLabs"}</Link>

      <section className={styles.paperHero}>
        <div>
          <h1>PlacePrep</h1>
          <div className={styles.heroMeta}>
            <span>450 DSA</span>
            <span>{data?.companies.length ?? 660}+ Companies</span>
            <span>16 System Design</span>
            <span>{data?.questions.length ?? 17000}+ Questions</span>
          </div>
          <p>Crack any interview systematically with PaperLabs-style implementation tracks for DSA, company prep, core CS, and system design.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className="btn-primary" href="/placement/dsa">Open DSA Sheet</Link>
          <Link className="btn-secondary" href="/placement/system-design">System Design</Link>
        </div>
      </section>

      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>Categories</h2>
          <span>{progress}% DSA progress</span>
        </div>
        <div className={styles.paperCategoryGrid}>
          {categories.map((category, index) => (
            <Link key={category.title} href={category.href} className="task-card">
              <div className={styles.taskIndex}>
                <span>Track</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className={styles.taskBody}>
                <h3>{category.title}</h3>
                <p>{category.meta}</p>
              </div>
              <span className={styles.countBadge}>{category.count}</span>
              <div className="completion-circle" />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>DSA Sheets</h2>
          <span>4 Sheets</span>
        </div>
        <div className={styles.paperCardGrid}>
          {dsaSheets.map(([title, desc, href]) => (
            <div key={title} className={styles.paperMiniCard}>
              <strong>{title}</strong>
              <p>{desc}</p>
              <div className={styles.actionRow}>
                <Link href={href}>Sheet</Link>
                <Link href="/placement/roadmap">Track</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>Core CS Subjects</h2>
          <span>3 Subjects</span>
        </div>
        <div className={styles.paperCardGrid}>
          {coreSubjects.map(([title, desc, href]) => (
            <div key={title} className={styles.paperMiniCard}>
              <strong>{title}</strong>
              <p>{desc}</p>
              <Link className={styles.fullButton} href={href}>Start Learning</Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.implementationBlock}>
        <div className={styles.sectionTitleRow}>
          <h2>System Design Implementation Track</h2>
          <span>{systemDesignChapters.length} Tasks</span>
        </div>
        <div className={styles.paperCategoryGrid}>
          {systemDesignChapters.slice(0, 6).map((chapter, index) => (
            <Link key={chapter.slug} href={`/placement/system-design/${chapter.slug}`} className="task-card">
              <div className={styles.taskIndex}>
                <span>Task</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className={styles.taskBody}>
                <h3>{chapter.title}</h3>
                <p>{chapter.build}</p>
              </div>
              <span className={styles.countBadge}>Build</span>
              <div className="completion-circle" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function DeprecatedTufHome() {
  return (
    <main className={styles.tufShell}>
      <div className={styles.tufLayout}>
        <section className={styles.tufContent}>
          <section className={styles.trackSection}>
            <h2>DSA Sheets</h2>
            <div className={styles.sheetGrid}>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export function Roadmap() {
  const columns = [
    ["Fundamentals", ["arrays", "strings", "math", "recursion"]],
    ["Core DSA", ["linked-list", "stack-queue", "binary-search", "trees"]],
    ["Advanced DSA", ["graphs", "dynamic-programming", "tries", "heaps"]],
    ["Interview Ready", ["sliding-window", "two-pointers", "greedy", "backtracking"]],
  ];
  return (
    <main className={styles.shell}>
      <h1>DSA Roadmap</h1>
      <p className={styles.subtitle}>Move left to right. Every node opens the matching DSA topic list.</p>
      <div className={styles.roadmap} style={{ marginTop: 28 }}>
        {columns.map(([title, nodes]) => (
          <section key={title as string} className={styles.column}>
            <h2>{title as string}</h2>
            {(nodes as string[]).map((slug) => {
              const topic = dsaTopics.find((item) => item.slug === slug);
              return topic ? <RoadmapNode key={slug} topic={topic} /> : null;
            })}
          </section>
        ))}
      </div>
    </main>
  );
}

export function RoadmapNode({ topic }: { topic: (typeof dsaTopics)[number] }) {
  return (
    <Link className={styles.node} href={`/placement/dsa?topic=${topic.slug}`}>
      <strong>{topic.name}</strong>
      <p className={styles.meta}>{topic.problemCount} problems</p>
    </Link>
  );
}

export function TopicCards() {
  return (
    <div className={styles.grid}>
      {dsaTopics.map((topic) => (
        <Link className={styles.card} key={topic.slug} href={`/placement/dsa/${topic.slug}`}>
          <strong>{topic.name}</strong>
          <p className={styles.meta}>{topic.problemCount} problems</p>
        </Link>
      ))}
    </div>
  );
}

export { styles, slugify };
