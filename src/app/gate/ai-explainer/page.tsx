"use client";

import { useState } from "react";
import { gateSubjects } from "@/data/gate";

export default function GateAiExplainerPage() {
  const [concept, setConcept] = useState("Deadlock avoidance");
  const [level, setLevel] = useState("GATE revision");
  const explanation = `${concept} explained for ${level}: start with the formal definition, identify the standard GATE trap, solve one numerical or proof-style example, then convert the mistake pattern into a formula card.`;

  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-pink)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>AI CONCEPT EXPLAINER</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Concept explanations for revision</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          Frontend-ready explainer page. Later this can stream responses from Claude or any AI endpoint.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)", gap: 18 }}>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontWeight: 800 }}>Concept</label>
          <input value={concept} onChange={(event) => setConcept(event.target.value)} className="input-field" style={{ marginBottom: 14 }} />
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontWeight: 800 }}>Level</label>
          <select value={level} onChange={(event) => setLevel(event.target.value)} className="input-field" style={{ marginBottom: 14 }}>
            <option>GATE revision</option>
            <option>Beginner</option>
            <option>Numerical focused</option>
            <option>Proof focused</option>
          </select>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {gateSubjects.slice(0, 5).map((subject) => (
              <button key={subject.id} type="button" onClick={() => setConcept(subject.topics[0])} className="filter-chip">
                {subject.short}
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 24, marginBottom: 14 }}>Generated explanation</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{explanation}</p>
          <div className="code-block" style={{ marginTop: 18 }}>
            1. Definition{"\n"}2. GATE trap{"\n"}3. Example{"\n"}4. Revision card
          </div>
        </div>
      </section>
    </main>
  );
}
