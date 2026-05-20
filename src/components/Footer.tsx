"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const allowedPaths = ["/", "/college", "/gate", "/papers", "/placement", "/vibe", "/leaderboard"];

  if (!allowedPaths.includes(pathname)) return null;

  const links = [
    { href: "/college", label: "College" },
    { href: "/gate", label: "GATE" },
    { href: "/papers", label: "Papers" },
    { href: "/placement", label: "PlacePrep" },
    { href: "/vibe", label: "Vibe Lab" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid #222",
        padding: "40px 24px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: "var(--text-muted)", letterSpacing: "-0.05em" }}>
            &gt;_
          </span>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
            Axiom
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: 13,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(event) => (event.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(event) => (event.currentTarget.style.color = "var(--text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{ color: "#666", fontSize: 12, margin: 0 }}>
          (c) {new Date().getFullYear()} Axiom.
        </p>
      </div>
    </footer>
  );
}
