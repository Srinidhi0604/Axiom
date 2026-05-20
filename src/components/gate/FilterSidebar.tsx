import Link from "next/link";
import { gateSubjects } from "@/data/gate";

export function FilterSidebar({ activeSubject }: { activeSubject?: string }) {
  return (
    <aside className="glass-card-static" style={{ padding: 16, borderRadius: 8 }}>
      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Subjects</h2>
      <div style={{ display: "grid", gap: 8 }}>
        <Link href="/gate/pyq" className="filter-chip" style={{ textDecoration: "none" }}>
          All subjects
        </Link>
        {gateSubjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/gate/pyq?subject=${subject.id}`}
            className={activeSubject === subject.id ? "filter-chip filter-chip-active" : "filter-chip"}
            style={{ textDecoration: "none" }}
          >
            {subject.short}
          </Link>
        ))}
      </div>
    </aside>
  );
}
