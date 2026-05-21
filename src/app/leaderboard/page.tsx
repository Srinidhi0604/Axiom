"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

type FilterType = "all" | "week" | "month";

interface LeaderboardUser {
  _id: string;
  username: string;
  score: number;
  problemsSolved: number;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const { user: currentUser, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/auth/login?redirect=/leaderboard");
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const sortedUsers = [...users].sort((a, b) => b.score - a.score);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>
          Sign in to view the leaderboard and compete with other learners.
        </p>
        <Link
          href="/auth/login?redirect=/leaderboard"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 8,
            background: "var(--accent-cyan)",
            color: "black",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}
    >
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Leaderboard
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Top implementers ranked by score. Score = Σ(difficulty_weight ×
          problems_solved)
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {(
          [
            { key: "all", label: "All Time" },
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
          ] as const
        ).map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "7px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#000" : "var(--text-muted)",
                border: isActive ? "1px solid #fff" : "1px solid #333",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="animate-slide-up"
        style={{
          overflow: "hidden",
          background: "#050505",
          border: "1px solid #222",
          borderRadius: 16,
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 140px 100px 100px",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <span>Rank</span>
          <span>User</span>
          <span style={{ textAlign: "center" }}>Problems Solved</span>
          <span style={{ textAlign: "center" }}>Streak</span>
          <span style={{ textAlign: "right" }}>Score</span>
        </div>

        {/* Rows — plain divs, no navigation on click */}
        {sortedUsers.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser =
            currentUser && user.username === currentUser.username;

          return (
            <div
              key={user._id}
              className={isCurrentUser ? "highlight-row" : ""}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 140px 100px 100px",
                padding: "16px 24px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isCurrentUser) {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(255,255,255,0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentUser) {
                  (e.currentTarget as HTMLDivElement).style.background = "";
                }
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color:
                    rank === 1
                      ? "#f59e0b"
                      : rank === 2
                        ? "#94a3b8"
                        : rank === 3
                          ? "#cd7f32"
                          : "white",
                }}
              >
                {`#${rank}`}
              </span>

              {/* User */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#111",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {user.username}
                    {isCurrentUser && (
                      <span
                        style={{
                          fontSize: 10,
                          marginLeft: 8,
                          padding: "2px 8px",
                          borderRadius: 10,
                          background: "#222",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Problems Solved */}
              <span
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                {user.problemsSolved}
              </span>

              {/* Streak */}
              <span
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "white",
                }}
              >
                0
              </span>

              {/* Score */}
              <span
                style={{
                  textAlign: "right",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "white",
                }}
              >
                {user.score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score explanation */}
      <div
        style={{
          padding: 20,
          marginTop: 24,
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: 13,
          color: "var(--text-muted)",
          border: "1px solid #222",
          borderRadius: 16,
          background: "#050505",
        }}
      >
        {[
          { label: "Easy", pts: "×1 point" },
          { label: "Medium", pts: "×2 points" },
          { label: "Hard", pts: "×3 points" },
        ].map(({ label, pts }) => (
          <span key={label}>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 11,
                marginRight: 6,
                border: "1px solid #333",
                color: "white",
              }}
            >
              {label}
            </span>
            {pts}
          </span>
        ))}
      </div>
    </div>
  );
}
