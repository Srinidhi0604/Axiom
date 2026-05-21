"use client";

import React from "react";
import styles from "@/app/axiom.module.css";
import Link from "next/link";

interface Feature {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

interface ProductLandingProps {
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  launchText: string;
  onLaunch: () => void;
  colorHex?: string;
}

export function ProductLanding({
  title,
  subtitle,
  description,
  features,
  launchText,
  onLaunch,
  colorHex = "var(--accent-cyan)",
}: ProductLandingProps) {
  return (
    <div className={styles.shell}>
      <section className={styles.hero} style={{ minHeight: "45vh", alignItems: "center" }}>
        <div style={{ maxWidth: 800 }}>
          <p className={styles.eyebrow} style={{ color: colorHex }}>{subtitle}</p>
          <h1 style={{ fontSize: "clamp(46px, 6vw, 78px)", fontWeight: 950, marginBottom: "22px", lineHeight: 1 }}>{title}</h1>
          <p className={styles.muted} style={{ fontSize: 18, marginBottom: 32, maxWidth: 640 }}>
            {description}
          </p>

          <button onClick={onLaunch} className="btn-secondary" style={{ padding: "14px 28px", fontSize: 16 }}>
            {launchText}
            <svg style={{ marginLeft: 8 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      <section className={styles.section} style={{ marginTop: 24 }}>
        <div className={styles.sectionHead}>
          <div>
            <h2 style={{ fontSize: 24 }}>Features</h2>
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginTop: "16px"
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card-static" style={{ padding: 24 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                color: colorHex
              }}>
                {f.icon || (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                )}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p className={styles.muted} style={{ fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}