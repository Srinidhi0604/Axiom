"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CollegeCourse, CollegeModule, CollegeTopic } from "@/lib/college";
import { slugifyCourse } from "@/lib/college";

type WorkspaceProps = {
  course: CollegeCourse & { department?: string; semester?: string };
  module: CollegeModule;
  topic: CollegeTopic;
};

function codeFor(course: CollegeCourse, module: CollegeModule, topic: CollegeTopic) {
  const source = `${course.code} ${course.title} ${module.title} ${topic.title}`.toLowerCase();
  if (source.includes("sql") || source.includes("database") || source.includes("normalization")) {
    return `CREATE TABLE concept_check (\n  id INTEGER PRIMARY KEY,\n  topic TEXT NOT NULL,\n  observation TEXT NOT NULL\n);\n\nINSERT INTO concept_check (topic, observation)\nVALUES ('${topic.title.replace(/'/g, "''")}', 'mapped to a working data model');\n\nSELECT * FROM concept_check;`;
  }
  return `const topic = ${JSON.stringify(topic.title)};\nconst moduleName = ${JSON.stringify(module.title)};\n\nfunction buildLearningPath(name) {\n  return [\n    "define the concept",\n    "trace one worked example",\n    "test the idea with a small case",\n  ].map((action, index) => ({ step: index + 1, name, action }));\n}\n\nconsole.log(buildLearningPath(topic));`;
}

export function CollegeWorkspace({ course, module, topic }: WorkspaceProps) {
  const [leftTab, setLeftTab] = useState<"description" | "explanation" | "output">("description");
  const [rightTab, setRightTab] = useState<"walkthrough" | "visual" | "practice">("walkthrough");
  const starter = useMemo(() => codeFor(course, module, topic), [course, module, topic]);
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const frames = [
    `Problem: ${module.title} feels broad`,
    `Concept: ${topic.title} makes it smaller`,
    "Break it into definition, parts, and behavior",
    "Use one example to prove you understood it",
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#050505", color: "white" }}>
      <header style={{ minHeight: 88, borderBottom: "1px solid #111", background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "16px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link href={`/college/courses/${slugifyCourse(course.code, course.title)}/${module.slug}`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 900 }}>
            Back
          </Link>
          <div>
            <h1 style={{ fontSize: 18, lineHeight: 1.35 }}>{topic.title}</h1>
            <p style={{ marginTop: 4, color: "var(--text-muted)", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{course.code} / {module.title}</p>
          </div>
          <span className="badge-easy" style={{ borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 900 }}>
            Concept
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["description", "explanation", "output"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setLeftTab(tab)} className={leftTab === tab ? "concept-tab-active" : "concept-tab"}>
              {tab === "description" ? "Description" : tab === "explanation" ? "Topic Explanation" : "Output"}
            </button>
          ))}
        </div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "minmax(380px, 43%) minmax(520px, 57%)", minHeight: "calc(100vh - 152px)" }}>
        <section style={{ borderRight: "1px solid #111", background: "#070707", padding: "44px 34px", overflow: "auto" }}>
          {leftTab === "description" ? (
            <>
              <h2 style={{ fontSize: 32, marginBottom: 22 }}>{topic.title}</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 17 }}>
                {topic.title} is a focused concept inside {module.title}. Learn it by defining the idea, tracing a worked example,
                and running one small implementation check.
              </p>
              <div style={{ marginTop: 28, border: "1px solid rgba(16,185,129,0.28)", background: "rgba(16,185,129,0.08)", borderRadius: 8, padding: 18 }}>
                <strong style={{ color: "var(--accent-green)" }}>Why this matters</strong>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 10 }}>{module.realWorldUse ?? module.summary}</p>
              </div>
              <h3 style={{ marginTop: 34, paddingBottom: 12, borderBottom: "1px solid #222" }}>Step by Step</h3>
              <ol style={{ marginTop: 18, color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 22 }}>
                <li>Define the concept in one sentence.</li>
                <li>Identify the input or situation where it appears.</li>
                <li>Trace what changes step by step.</li>
                <li>Connect the result to one lab, exam, or project use case.</li>
              </ol>
            </>
          ) : leftTab === "explanation" ? (
            <>
              <h2 style={{ fontSize: 30, marginBottom: 18 }}>Plain explanation</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                This workspace converts a syllabus bullet into a practical study unit. First understand the concept,
                then inspect the visual flow, then run the code/check only when the idea is clear.
              </p>
              <h3 style={{ marginTop: 30 }}>Common mistake</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: 10 }}>
                Do not jump straight to syntax or formulas. First know what problem the concept solves.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 30, marginBottom: 18 }}>Execution Output</h2>
              {output.length ? output.map((line) => (
                <pre key={line} style={{ whiteSpace: "pre-wrap", background: "#000", border: "1px solid #222", borderRadius: 8, padding: 14, color: "#d1fae5", marginBottom: 10 }}>{line}</pre>
              )) : <p style={{ color: "var(--text-muted)" }}>Click Run inside Practice to execute your concept check.</p>}
            </>
          )}
        </section>

        <section style={{ background: "#1f1f1f", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ minHeight: 64, borderBottom: "1px solid #000", background: "#0a0a0a", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["walkthrough", "visual", "practice"] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setRightTab(tab)} className={rightTab === tab ? "concept-tab-active" : "concept-tab"}>
                  {tab === "walkthrough" ? "Concept walkthrough" : tab === "visual" ? "Visual explanation" : "Practice"}
                </button>
              ))}
            </div>
            <button className="btn-primary" style={{ borderRadius: 8 }} onClick={() => setCompleted(true)} disabled={completed}>
              {completed ? "Completed" : "Complete"}
            </button>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 24, background: "#111" }}>
            {rightTab === "walkthrough" ? (
              <div style={{ display: "grid", gap: 14 }}>
                {frames.map((frame, index) => (
                  <article key={frame} style={{ position: "relative", overflow: "hidden", border: "1px solid #222", background: "#000", borderRadius: 8, padding: 22 }}>
                    <div style={{ position: "absolute", inset: "0 auto 0 0", width: 3, background: "var(--accent-cyan)" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 900 }}>Frame {index + 1}</p>
                    <h3 style={{ marginTop: 10, fontSize: 24 }}>{frame}</h3>
                    <p style={{ marginTop: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{index === 0 ? module.summary : index === 1 ? topic.title : "Trace it slowly, then test it with the practice panel."}</p>
                  </article>
                ))}
              </div>
            ) : rightTab === "visual" ? (
              <div className="concept-visual-card concept-visual-source">
                <p style={{ color: "var(--accent-cyan)", fontWeight: 900, fontSize: 12 }}>Visual explanation</p>
                <h2 style={{ marginTop: 18, fontSize: 30 }}>{topic.title}</h2>
                <p style={{ marginTop: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  Start with the syllabus item, split it into definition, parts, and behavior, then finish with one exam-style or lab-style check.
                </p>
              </div>
            ) : (
              <div style={{ border: "1px solid #222", borderRadius: 8, overflow: "hidden", background: "#1b1b1b" }}>
                <div style={{ minHeight: 60, background: "#0a0a0a", borderBottom: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px" }}>
                  <div>
                    <strong>Practice after learning</strong>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>concept-check.js</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" style={{ borderRadius: 8 }} onClick={() => setCode(starter)}>Reset</button>
                    <button className="btn-primary" style={{ borderRadius: 8 }} onClick={() => { setOutput([`Concept loaded: ${topic.title}`, "Trace ready", "Workspace prepared"]); setLeftTab("output"); }}>Run</button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  style={{ width: "100%", minHeight: 360, border: 0, outline: 0, resize: "vertical", background: "#1f1f1f", color: "#f8fafc", padding: 18, fontFamily: "JetBrains Mono, Fira Code, monospace", lineHeight: 1.65 }}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
