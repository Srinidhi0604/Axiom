"use client";

import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

type ScanResult = {
  repo: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  fileCount: number;
  stack: string[];
  folders: { name: string; count: number }[];
  importantFiles: string[];
  brief: string;
  architectureNotes: string[];
  tasks: { title: string; kind: string; difficulty: string; description: string }[];
  aiEnabled: boolean;
  mermaidFlowchart?: string;
  securityVulnerabilities?: { id: string; description: string; severity: string }[];
};

function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "dark" });
    if (ref.current && chart) {
      mermaid.render("mermaid-svg-" + Math.random().toString(36).substring(7), chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.maxWidth = 'none';
            svgEl.style.height = 'auto';
          }
        }
      }).catch(err => console.error(err));
    }
  }, [chart]);

  return <div ref={ref} style={{ width: "100%", overflow: "auto", padding: "10px 0" }} />;
}

export function VibeScanner({ onScanComplete }: { onScanComplete?: (hasScan: boolean) => void }) {
  const [repoUrl, setRepoUrl] = useState("https://github.com/vercel/next.js");
  const [status, setStatus] = useState("Ready to scan");
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  async function runScan() {
    setLoading(true);
    setError("");
    setStatus("Scanning GitHub repository...");
    setScan(null);

    try {
      const response = await fetch("/api/vibe/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Repo scan failed");
      }

      setScan(data.scan);
      onScanComplete?.(true);
      setStatus(data.scan.aiEnabled ? "Scan complete with AI plan" : "Scan complete");
    } catch (scanError) {
      const message = scanError instanceof Error ? scanError.message : "Repo scan failed";
      setError(message);
      setStatus("Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await runScan();
      }}
      style={{ display: "grid", gap: 12 }}
    >
      <input
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        placeholder="Paste a GitHub repository URL"
        className="input-field"
        aria-label="GitHub repository URL"
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button className="btn-primary" type="submit" style={{ borderRadius: 8 }} disabled={loading}>
          {loading ? "Scanning..." : "Scan Repo"}
        </button>
        <span style={{ color: error ? "var(--accent-red)" : "var(--accent-green)", fontSize: 13 }}>{error || status}</span>
      </div>
      {scan ? (
        <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
          <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{scan.repo}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>{scan.brief}</p>
              </div>
              <a href={scan.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: "none", height: "fit-content" }}>
                GitHub
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {[`${scan.fileCount} files`, `${scan.stars.toLocaleString()} stars`, `${scan.forks.toLocaleString()} forks`, ...scan.stack].map((item) => (
                <span key={item} style={{ borderRadius: 999, padding: "2px 10px", fontSize: 12, color: "var(--accent-cyan)", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 14 }}>
              <strong style={{ fontSize: 13 }}>Top folders</strong>
              <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                {scan.folders.slice(0, 5).map((folder) => (
                  <div key={folder.name} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 12 }}>
                    <span>{folder.name}/</span>
                    <span>{folder.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 14 }}>
              <strong style={{ fontSize: 13 }}>Architecture notes</strong>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.6 }}>
                {scan.architectureNotes.slice(0, 4).map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          </div>

          {scan.securityVulnerabilities && scan.securityVulnerabilities.length > 0 && (
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 14 }}>
              <strong style={{ fontSize: 13, color: "var(--accent-red)" }}>Security Vulnerabilities</strong>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {scan.securityVulnerabilities.map(v => (
                  <div key={v.id} style={{ display: "flex", flexDirection: "column", color: "var(--text-secondary)", fontSize: 12, padding: "10px", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, background: "rgba(239,68,68,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--accent-red)" }}>{v.id}</strong>
                      <span style={{ color: "var(--accent-red)", fontWeight: "bold" }}>{v.severity.toUpperCase()}</span>
                    </div>
                    <span>{v.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scan.mermaidFlowchart && (
            <div style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 14 }}>
              <strong style={{ fontSize: 13 }}>Architecture Flowchart</strong>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
                <MermaidChart chart={scan.mermaidFlowchart} />
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 8 }}>
            <strong style={{ fontSize: 13 }}>Generated implementation tasks</strong>
            {scan.tasks.slice(0, 5).map((task, index) => (
              <div key={`${task.title}-${index}`} style={{ border: "1px solid #2a2a2a", borderRadius: 8, background: "#111", padding: 14, display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <strong>{String(index + 1).padStart(2, "0")}. {task.title}</strong>
                  <span style={{ borderRadius: 999, padding: "2px 10px", fontSize: 12, color: "var(--accent-purple)", background: "rgba(139,92,246,0.15)" }}>{task.difficulty}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{task.description}</p>
                <span style={{ color: "var(--accent-green)", fontSize: 12 }}>{task.kind}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
