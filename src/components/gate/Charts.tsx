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

export function Heatmap() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 5 }}>
      {Array.from({ length: 70 }).map((_, index) => {
        const level = index % 5;
        return <div key={index} className={`heatmap-cell heatmap-${level}`} style={{ aspectRatio: "1", borderRadius: 3 }} />;
      })}
    </div>
  );
}
