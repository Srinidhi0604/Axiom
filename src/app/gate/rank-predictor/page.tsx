"use client";

import { useMemo, useState } from "react";

export default function GateRankPredictorPage() {
  const [marks, setMarks] = useState(55);
  const prediction = useMemo(() => {
    const rank = Math.max(1, Math.round(85000 / Math.max(marks, 1)));
    const band = rank < 500 ? "Top IIT/NIT range" : rank < 2000 ? "Strong PSU/NIT range" : rank < 8000 ? "Good qualifying range" : "Needs focused revision";
    return { rank, band, percentile: Math.min(99.9, Math.round((marks / 100) * 1000) / 10) };
  }, [marks]);

  return (
    <main>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>RANK PREDICTOR</div>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>Estimate rank from mock marks</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 760 }}>
          A frontend predictor shell that can later be connected to real GATE normalization and category cutoffs.
        </p>
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 420px)", gap: 18 }}>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: 12, fontWeight: 800 }}>Mock marks: {marks}</label>
          <input type="range" min="1" max="100" value={marks} onChange={(event) => setMarks(Number(event.target.value))} style={{ width: "100%" }} />
        </div>
        <div className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>EXPECTED AIR</div>
          <div style={{ fontSize: 56, fontWeight: 900, marginBottom: 8 }}>{prediction.rank}</div>
          <p style={{ color: "var(--accent-cyan)", fontWeight: 900, marginBottom: 10 }}>{prediction.band}</p>
          <p style={{ color: "var(--text-secondary)" }}>Estimated percentile: {prediction.percentile}</p>
        </div>
      </section>
    </main>
  );
}
