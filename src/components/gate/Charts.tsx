"use client";

import { useState, useEffect } from "react";

type ChartPoint = { label: string; value: number; color?: string };

export function BarChart({ data }: { data: ChartPoint[] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 12, marginBottom: 6 }}>
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ width: `${item.value}%`, height: "100%", background: item.color ?? "var(--accent-cyan)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data }: { data: ChartPoint[] }) {
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - item.value}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: 180, background: "rgba(255,255,255,0.025)", borderRadius: 8 }}>
      <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="3" />
      {data.map((item, index) => (
        <circle key={item.label} cx={(index / Math.max(data.length - 1, 1)) * 100} cy={100 - item.value} r="2.8" fill="#fff" />
      ))}
    </svg>
  );
}

export function PieChart({ data }: { data: ChartPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const gradient = data.reduce(
    (state, item) => {
      const start = state.cursor;
      const end = start + (item.value / total) * 100;
      return {
        cursor: end,
        parts: [...state.parts, `${item.color ?? "#38bdf8"} ${start}% ${end}%`],
      };
    },
    { cursor: 0, parts: [] as string[] },
  ).parts.join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <div style={{ width: 132, height: 132, borderRadius: "50%", background: `conic-gradient(${gradient})`, border: "1px solid rgba(255,255,255,0.1)" }} />
      <div style={{ display: "grid", gap: 8 }}>
        {data.map((item) => (
          <span key={item.label} style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: item.color, marginRight: 8 }} />
            {item.label}: {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RadarChart({ data }: { data: ChartPoint[] }) {
  const angle = (Math.PI * 2) / data.length;
  const points = data
    .map((item, index) => {
      const radius = item.value * 0.42;
      return `${50 + Math.cos(angle * index - Math.PI / 2) * radius},${50 + Math.sin(angle * index - Math.PI / 2) * radius}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: 230 }}>
      {[20, 32, 44].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      <polygon points={points} fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="1.5" />
    </svg>
  );
}

// Monthly question counts — 12 months
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  if (count <= 22) return 4;
  return 5;
}

export function Heatmap({ streamId }: { streamId?: string }) {
  const [data, setData] = useState<number[][]>(Array.from({ length: 12 }, () => [0, 0, 0, 0, 0]));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gate/heatmap?stream=${streamId || "cs"}`);
        if (res.ok) {
          const json = await res.json();
          if (json.months) {
            setData(json.months);
            setTotal(json.total || 0);
          }
        }
      } catch (e) {
        console.error("Failed to fetch heatmap data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [streamId]);

  return (
    <div style={{ overflowX: "auto", opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}>
      {/* Total solved badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: "var(--accent-green)" }}>{total}</span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>questions solved this year</span>
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 5, minWidth: 560 }}>
        {data.map((weeks, mIdx) => (
          <div key={mIdx} style={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textAlign: "center", marginBottom: 3, letterSpacing: "0.04em" }}>
              {MONTHS[mIdx]}
            </div>
            {weeks.map((count, wIdx) => (
              <div
                key={wIdx}
                className={`heatmap-cell heatmap-${getLevel(count)}`}
                title={count === 0 ? "No questions" : `${count} question${count > 1 ? "s" : ""} solved`}
                style={{ height: 22, borderRadius: 3, cursor: count > 0 ? "pointer" : "default" }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend + monthly totals */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, flexWrap: "wrap", gap: 12 }}>
        {/* Monthly totals */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {data.map((weeks, mIdx) => {
            const mTotal = weeks.reduce((s, v) => s + v, 0);
            return mTotal > 0 ? (
              <div key={mIdx} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-green)" }}>{mTotal}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{MONTHS[mIdx]}</div>
              </div>
            ) : null;
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Less</span>
          {[0,1,2,3,4,5].map((level) => (
            <div key={level} className={`heatmap-cell heatmap-${level}`} style={{ width: 13, height: 13, borderRadius: 2, flexShrink: 0 }} />
          ))}
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>More</span>
        </div>
      </div>
    </div>
  );
}
