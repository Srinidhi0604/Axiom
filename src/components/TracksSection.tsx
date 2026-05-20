"use client";

import Link from "next/link";
import { axiomVerticals } from "@/data/axiom";

export default function TracksSection() {
  return (
    <section style={{ padding: "120px 24px", background: "#050505", borderTop: "1px solid #111", borderBottom: "1px solid #111", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "white", marginBottom: 16, letterSpacing: "-0.02em" }}>
          Explore by <span style={{ color: "#a855f7" }}>Vertical</span>
        </h2>
        <p style={{ color: "#9ca3af", fontSize: 18, maxWidth: 680, margin: "0 auto 64px", lineHeight: 1.6 }}>
          The same PaperLabs build-first learning experience, now split into five focused student paths.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, textAlign: "left" }}>
          {axiomVerticals.map((vertical) => (
            <Link href={vertical.href} key={vertical.slug} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #222",
                  borderRadius: 16,
                  padding: 32,
                  height: "100%",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = "rgba(6,182,212,0.55)";
                  event.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = "#222";
                  event.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ width: 42, height: 4, borderRadius: 999, background: vertical.accent, marginBottom: 18 }} />
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 4 }}>{vertical.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.6, flex: 1, marginTop: 16 }}>
                  {vertical.description}
                </p>
                <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {vertical.stats.map((stat) => (
                    <span key={stat} className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "#a1a1aa" }}>
                      {stat}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 32, display: "flex", alignItems: "center", color: "white", fontSize: 14, fontWeight: 500 }}>
                  Open {vertical.label} <span style={{ marginLeft: 8, color: "white" }}>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
