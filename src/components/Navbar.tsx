"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/papers", label: "Papers" },
  { href: "/college", label: "College" },
  { href: "/gate", label: "GATE" },
  { href: "/placement", label: "PlacePrep" },
  { href: "/vibe", label: "Vibe Lab" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 20, color: "var(--text-muted)", letterSpacing: "-0.05em" }}>
            &gt;_
          </span>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
            Axiom
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="nav-links-desktop">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isLoading && user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
              </button>

              {dropdownOpen ? (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "rgba(17, 24, 39, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 180,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    My Profile
                  </Link>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      router.push("/");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "var(--accent-red)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : !isLoading ? (
            <>
              <Link
                href="/auth/login"
                className="btn-secondary"
                style={{ textDecoration: "none", padding: "8px 20px", fontSize: 13 }}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary"
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                Sign up
              </Link>
            </>
          ) : null}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "X" : "="}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                background: pathname === link.href ? "rgba(255,255,255,0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}

      <style jsx global>{`
        @media (max-width: 920px) {
          .nav-links-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
