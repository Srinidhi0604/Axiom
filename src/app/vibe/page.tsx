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
  const taskCount = vibeTracks.reduce((count, track) => count + track.tasks.length, 0);

  return (
    <main className={styles.shell}>
      <div className={styles.hero} style={{ minHeight: "auto" }}>
        <div>
          <p className={styles.eyebrow}>Vibe Lab</p>
          <h1>Turn any GitHub repo into a learning lab.</h1>
          <p>
            Repo analysis, generated tasks, security drills, and scaling plans from the Vibe Lab reference repo,
            rebuilt inside the Axiom interface.
          </p>
          <div className={styles.heroActions}>
            <Link href="/vibe/tasks/repo-learning" className="btn-minimalist">Open Tasks</Link>
            <Link href="/vibe/tasks/security-lab" className="btn-secondary" style={{ textDecoration: "none" }}>Security Lab</Link>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Repo scanner</p>
          <VibeScanner />
        </div>
      </div>

      <section className={styles.wideGrid}>
        {[
          ["Tracks", vibeTracks.length, "/vibe/tasks/repo-learning"],
          ["Implementation Tasks", taskCount, "/vibe/tasks/repo-learning"],
          ["Modes", 6, "/vibe/map"],
        ].map(([label, value, href]) => (
          <Link className={styles.metric} href={String(href)} key={label} style={{ textDecoration: "none", color: "inherit" }}>
            <span className={styles.muted}>{label}</span>
            <strong>{Number(value).toLocaleString()}</strong>
          </Link>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>Original Vibe Lab navigation</p><h2>Repo workflow</h2></div>
        </div>
        <div className={styles.grid}>
          {[
            ["Principles Map", "Architecture map and first-principles breakdown.", "/vibe/map"],
            ["Repo Tasks", "Generated learning tasks from a scan.", "/vibe/tasks/repo-learning"],
            ["Security Sandbox", "Vulnerabilities parsed as lab exercises.", "/vibe/security"],
            ["Scaling Simulator", "Scale from 1K to 10M users via tasks.", "/vibe/scale"],
            ["CEO Mode", "Read high-level project summaries.", "/vibe/ceo"],
            ["Founder Mode", "Deep-dive operational metrics.", "/vibe/founder"],
          ].map(([title, desc, href]) => (
            <Link className={styles.card} href={String(href)} key={title} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ height: 4, width: 32, background: "var(--accent-pink)", marginBottom: 16, borderRadius: 4 }} />
                <h3 style={{ fontSize: 16 }}>{title}</h3>
                <p className={styles.muted} style={{ fontSize: 13, marginTop: 8 }}>{desc}</p>
              </div>
              <span className={styles.action} style={{ color: "var(--accent-pink)", fontSize: 13, fontWeight: 600 }}>Enter &rarr;</span>
            </Link>
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?redirect=/vibe");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

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
