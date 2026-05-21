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

// Monthly question counts per stream — 12 months × 5 week-buckets each
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STREAM_DATA: Record<string, number[][]> = {
  cs:  [[0,2,0,3,4],[1,0,5,3,2],[4,6,3,0,5],[2,8,10,6,4],[0,3,7,12,9],[5,4,2,0,6],[8,11,7,5,3],[12,9,14,10,8],[6,13,18,15,11],[10,16,20,14,12],[18,22,17,25,20],[15,0,0,0,0]],
  ece: [[0,0,2,1,3],[2,4,0,3,1],[3,5,2,0,4],[1,6,8,5,3],[4,2,6,10,7],[3,5,1,0,4],[7,9,5,4,2],[10,7,12,8,6],[5,11,15,12,9],[8,14,18,11,10],[15,19,14,22,17],[12,0,0,0,0]],
  ee:  [[0,1,0,2,3],[1,3,0,2,1],[2,4,3,0,3],[1,5,7,4,2],[3,2,5,9,6],[4,3,1,0,5],[6,8,6,3,2],[9,6,11,7,5],[4,10,13,10,8],[7,12,16,9,8],[13,17,12,20,15],[10,0,0,0,0]],
  me:  [[0,0,1,2,2],[1,2,0,1,1],[2,3,2,0,2],[1,4,6,3,2],[2,1,4,7,5],[3,2,1,0,3],[5,7,5,2,1],[8,5,9,6,4],[3,8,11,8,6],[6,10,14,8,7],[11,15,10,18,13],[8,0,0,0,0]],
  ce:  [[0,1,0,1,2],[0,2,1,2,0],[2,3,1,0,2],[1,4,5,3,1],[2,1,3,6,4],[3,2,1,0,2],[4,6,4,2,1],[7,4,8,5,3],[2,7,10,7,5],[5,9,12,7,6],[10,13,9,16,11],[7,0,0,0,0]],
  in:  [[0,0,1,1,2],[1,1,0,2,1],[1,3,2,0,2],[1,3,5,2,1],[1,2,3,5,4],[2,2,1,0,3],[4,5,3,2,1],[7,4,8,5,3],[3,6,9,6,4],[5,8,11,6,5],[9,12,8,14,10],[6,0,0,0,0]],
};

function getMonthlyData(streamId?: string): number[][] {
  return STREAM_DATA[streamId ?? "cs"] ?? STREAM_DATA.cs;
}

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  if (count <= 22) return 4;
  return 5;
}

export function Heatmap({ streamId }: { streamId?: string }) {
  const data = getMonthlyData(streamId);
  const grandTotal = data.flat().reduce((s, v) => s + v, 0);

  return (
    <div style={{ overflowX: "auto" }}>
      {/* Total solved badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: "var(--accent-green)" }}>{grandTotal}</span>
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
            const total = weeks.reduce((s, v) => s + v, 0);
            return total > 0 ? (
              <div key={mIdx} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-green)" }}>{total}</div>
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
