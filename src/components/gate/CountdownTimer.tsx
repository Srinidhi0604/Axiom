"use client";

import { useEffect, useMemo, useState } from "react";

export function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  const label = useMemo(() => {
    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [remaining]);

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: remaining < 300 ? "var(--accent-red)" : "var(--text-primary)", fontWeight: 900 }}>
      {label}
    </div>
  );
}
