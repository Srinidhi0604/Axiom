"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

function HeatmapCalendar({ data = {} }: { data: Record<string, number> }) {
  const today = new Date();
  const weeks: { date: string; count: number }[][] = [];

  // Build 52 weeks of data
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 364);
  // Align to Sunday
  startDay.setDate(startDay.getDate() - startDay.getDay());

  let currentWeek: { date: string; count: number }[] = [];
  const d = new Date(startDay);

  while (d <= today) {
    const key = d.toISOString().split("T")[0];
    currentWeek.push({ date: key, count: data[key] || 0 });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    d.setDate(d.getDate() + 1);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", gap: 3, minWidth: "fit-content" }}>
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {wi % 4 === 0 && week[0] ? (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  height: 14,
                  marginBottom: 2,
                }}
              >
                {months[new Date(week[0].date).getMonth()]}
              </div>
            ) : (
              <div style={{ height: 14, marginBottom: 2 }} />
            )}
            {week.map((day, di) => {
              const level = Math.min(day.count, 5);
              return (
                <div
                  key={di}
                  className={`heatmap-cell heatmap-${level}`}
                  style={{ width: 12, height: 12, position: "relative" }}
                  title={`${day.date}: ${day.count} submissions`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 12,
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{ fontSize: 10, color: "var(--text-muted)", marginRight: 4 }}
        >
          Less
        </span>
        {[0, 1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className={`heatmap-cell heatmap-${l}`}
            style={{ width: 12, height: 12 }}
          />
        ))}
        <span
          style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}
        >
          More
        </span>
      </div>
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedUsername = decodeURIComponent(username);
        const res = await fetch(
          `/api/users/${encodeURIComponent(decodedUsername)}`,
        );
        const data = await res.json();
        console.log("Profile fetch returned:", data);
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        User not found
      </div>
    );
  }

  const totalActivity = user.problemsSolved || 0; // fallback if no heatmap actual data

  return (
    <div
      style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}
    >
      {/* Profile Header */}
      <div
        className="glass-card-static animate-fade-in"
        style={{ padding: 32, marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `hsl(${(user.username.charCodeAt(0) * 47) % 360}, 60%, 40%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              flexShrink: 0,
            }}
          >
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                {user.username}
              </h1>
              {user.plan === "pro" && (
                <span
                  style={{
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.2))",
                    color: "var(--accent-purple)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  PRO
                </span>
              )}
            </div>
            <p
              style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}
            >
              Joined{" "}
              {new Date(
                user.createdAt || user.joinDate || Date.now(),
              ).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
        className="stagger-children"
      >
        {[
          {
            label: "Problems Solved",
            value: user.problemsSolved || 0,
            color: "var(--accent-cyan)",
          },
          {
            label: "Current Streak",
            value: `0d`,
            color: "var(--accent-amber)",
          },
          {
            label: "Rank",
            value: `Top`,
            color: "var(--accent-purple)",
          },
          {
            label: "Score",
            value: user.score || 0,
            color: "var(--accent-green)",
          },
          {
            label: "Referrals",
            value: user.referralCount || 0,
            color: "var(--accent-purple)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card-static"
            style={{ padding: 24, textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: stat.color,
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        className="glass-card-static"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 12,
            color: "var(--text-secondary)",
          }}
        >
          Referral
        </h3>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Code</span>
            <code style={{ color: user.referralCode ? "var(--accent-cyan)" : "var(--text-muted)", fontSize: 13 }}>
              {user.referralCode ? user.referralCode : "Not generated yet"}
            </code>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Invite link</span>
            {typeof window !== "undefined" && user.referralCode ? (
              <code style={{ color: "var(--accent-green)", fontSize: 12, wordBreak: "break-all", maxWidth: 300, textOverflow: "ellipsis" }}>
                {`${window.location.origin}/auth/signup?ref=${user.referralCode}`}
              </code>
            ) : (
              <span style={{ color: "var(--accent-amber)", fontSize: 12 }}>
                Visit <strong>/referrals</strong> to generate your code
              </span>
            )}
          </div>
          {user.referredBy ? (
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Referred by <span style={{ color: "var(--accent-green)" }}>{user.referredBy}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div
        className="glass-card-static"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-secondary)",
          }}
        >
          Difficulty Breakdown
        </h3>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            {
              label: "Easy",
              count: user.easySolved || 0,
              color: "#10b981",
              total: 4,
            },
            {
              label: "Medium",
              count: user.mediumSolved || 0,
              color: "#f59e0b",
              total: 4,
            },
            {
              label: "Hard",
              count: user.hardSolved || 0,
              color: "#ef4444",
              total: 2,
            },
          ].map((d) => (
            <div key={d.label} style={{ flex: 1, minWidth: 120 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: d.color }}>
                  {d.label}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {d.count}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    background: d.color,
                    width: `${Math.min((d.count / 30) * 100, 100)}%`,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div
        className="glass-card-static animate-slide-up"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            Activity
          </h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {totalActivity} submissions total
          </span>
        </div>
        <HeatmapCalendar data={user.heatmapData || {}} />
      </div>

      {/* Badges */}
      <div
        className="glass-card-static"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-secondary)",
          }}
        >
          Badges ({(user.badges || []).length})
        </h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(user.badges || []).map((badge: any) => (
            <div
              key={badge.id}
              className="glass-card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 200,
              }}
            >
              <span style={{ fontSize: 28 }}>{badge.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
          {/* Locked badges */}
          {["first_blood", "on_a_roll", "paper_master"]
            .filter((t) => !(user.badges || []).some((b: any) => b.type === t))
            .map((type) => (
              <div
                key={type}
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  minWidth: 200,
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  opacity: 0.5,
                }}
              >
                <span style={{ fontSize: 28 }}>🔒</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>
                    {type === "first_blood"
                      ? "First Blood"
                      : type === "on_a_roll"
                        ? "On a Roll"
                        : "Paper Master"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Not yet earned
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Submissions */}
      {(user.submissions || []).length > 0 && (
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text-secondary)",
            }}
          >
            Recent Submissions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(user.submissions || []).map((sub: any) => (
              <Link
                key={sub.id}
                href={`/problems/${sub.problemSlug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          sub.status === "passed"
                            ? "var(--accent-green)"
                            : "var(--accent-red)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                      {sub.problemTitle}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 10,
                        background:
                          sub.status === "passed"
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          sub.status === "passed"
                            ? "var(--accent-green)"
                            : "var(--accent-red)",
                      }}
                    >
                      {sub.status === "passed" ? "Passed" : "Failed"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {sub.submittedAt}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
