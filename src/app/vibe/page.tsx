"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { vibeTracks } from "@/data/vibe";
import styles from "../axiom.module.css";
import { VibeScanner } from "./VibeScanner";
import { ProductLanding } from "@/components/ProductLanding";

function VibeHome() {
  const [hasScan, setHasScan] = useState(false);

  const diffColor: Record<string, string> = {
    Easy: "var(--accent-green)",
    Medium: "var(--accent-cyan)",
    Hard: "var(--accent-red)",
  };
  const diffBg: Record<string, string> = {
    Easy: "rgba(16,185,129,0.12)",
    Medium: "rgba(6,182,212,0.12)",
    Hard: "rgba(239,68,68,0.12)",
  };
  const trackColors = ["var(--accent-cyan)", "var(--accent-red)", "var(--accent-purple)"];

  return (
    <main className={styles.shell}>
      <div className={styles.hero} style={{ minHeight: "auto" }}>
        {!hasScan && (
          <div>
            <p className={styles.eyebrow}>Vibe Lab</p>
            <h1>Turn any GitHub repo into a learning lab.</h1>
            <p>
              Repo analysis, generated tasks, security drills, and scaling plans from the Vibe Lab reference repo,
              rebuilt inside the Axiom interface.
            </p>
          </div>
        )}
        <div className={styles.panel} style={hasScan ? { gridColumn: "1 / -1", maxWidth: "100%" } : {}}>
          <p className={styles.eyebrow}>Repo scanner</p>
          <VibeScanner onScanComplete={setHasScan} />
        </div>
      </div>

      {/* Always-visible task tracks */}
      <section className={styles.section} style={{ marginTop: 32 }}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Lab Tracks</p>
            <h2>Tasks</h2>
          </div>
        </div>
        <div style={{ display: "grid", gap: 32 }}>
          {vibeTracks.map((track, trackIndex) => (
            <div key={track.slug} style={{ border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden" }}>
              {/* Track header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e1e", background: "#0d0d0d", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ height: 10, width: 10, borderRadius: "50%", background: trackColors[trackIndex % trackColors.length], flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: 15 }}>{track.title}</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2 }}>{track.description}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ borderRadius: 999, padding: "2px 10px", fontSize: 11, color: trackColors[trackIndex % trackColors.length], background: "rgba(255,255,255,0.05)", border: `1px solid ${trackColors[trackIndex % trackColors.length]}44`, whiteSpace: "nowrap" }}>
                    {track.badge}
                  </span>
                  <Link
                    href={`/vibe/tasks/${track.slug}`}
                    style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", whiteSpace: "nowrap" }}
                  >
                    View all →
                  </Link>
                </div>
              </div>
              {/* Task rows */}
              <div>
                {track.tasks.map((task, index) => (
                  <Link
                    key={task.slug}
                    href={`/vibe/tasks/${track.slug}/${task.slug}`}
                    style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 14, padding: "14px 20px", borderBottom: index < track.tasks.length - 1 ? "1px solid #181818" : "none", textDecoration: "none", color: "inherit", alignItems: "center", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace", fontWeight: 700 }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div style={{ display: "grid", gap: 3 }}>
                      <strong style={{ fontSize: 13 }}>{task.title}</strong>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>{task.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
                        {task.kind}
                      </span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: diffBg[task.difficulty], color: diffColor[task.difficulty] }}>
                        {task.difficulty}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


export default function VibePage() {
  const [launched, setLaunched] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();



  if (launched) return <VibeHome />;

  return (
    <ProductLanding
      subtitle="Axiom Labs"
      title="Vibe Lab"
      description="Turn any GitHub repository into an interactive learning environment. Generate tasks, analyze architecture, and simulate scaling challenges dynamically."
      launchText="Enter Vibe Lab"
      colorHex="#10b981"
      features={[
        {
          title: "Intelligent Repo Scanner",
          desc: "Input any GitHub URL and Vibe Lab breaks down its architecture into foundational concepts.",
        },
        {
          title: "Security & Scaling Drills",
          desc: "Practice patching vulnerabilities or scaling a project from 1K to 10M concurrent users.",
        },
        {
          title: "Multi-Perspective Modes",
          desc: "Switch between Developer, Architect, Founder, and CEO modes for tailored insights.",
        },
        {
          title: "Generated Tasks",
          desc: "Get personalized, interactive implementation tasks generated directly from the codebase.",
        }
      ]}
      onLaunch={() => setLaunched(true)}
    />
  );
}
