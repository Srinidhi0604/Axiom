"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { showToast } from "@/components/Toast";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatarUrl: string;
  referralCount: number;
  score: number;
  joinedAt: string;
}

interface ReferredUser {
  username: string;
  avatarUrl: string;
  score: number;
  joinedAt: string;
}

interface ReferralStats {
  username: string;
  referralCode: string;
  referralCount: number;
  referredBy: string | null;
  totalScore: number;
  bonusFromReferrals: number;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard
        const leaderboardRes = await fetch("/api/referrals/leaderboard?limit=100", {
          credentials: "include",
        });
        const leaderboardData = await leaderboardRes.json();

        if (leaderboardData.success) {
          setLeaderboard(leaderboardData.leaderboard);

          // Find user's rank
          const rank = leaderboardData.leaderboard.find(
            (u: LeaderboardUser) => u.username === user.username,
          );
          if (rank) {
            setUserRank(rank.rank);
          }
        }

        // Fetch user's referral stats
        const statsRes = await fetch("/api/referrals/stats", {
          credentials: "include",
        });
        const statsData = await statsRes.json();

        if (statsData.success) {
          setStats(statsData.referralStats);
          setReferredUsers(statsData.referredUsers);
        }
      } catch (error) {
        console.error("Failed to fetch referral data:", error);
        showToast("Failed to load referral data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const copyToClipboard = async () => {
    if (!stats?.referralCode) return;

    const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${stats.referralCode}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      showToast("Invite link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("Failed to copy link", "error");
    }
  };

  const generateReferralCode = async () => {
    try {
      setGenerating(true);
      const response = await fetch("/api/migrate/referral-codes", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        showToast("Failed to generate referral code", "error");
        return;
      }

      const data = await response.json();
      showToast("Referral ID generated successfully!", "success");

      // Refresh stats to get the new code
      const statsRes = await fetch("/api/referrals/stats", {
        credentials: "include",
      });
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats(statsData.referralStats);
        setReferredUsers(statsData.referredUsers);
      }
    } catch (error) {
      console.error("Failed to generate referral code:", error);
      showToast("Error generating referral code", "error");
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <p>Please log in to view referral information.</p>
        <Link href="/auth/login" style={{ color: "var(--accent-cyan)" }}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Referral Program
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
          Invite friends and earn 50 points for each signup. Build your network and climb the leaderboard.
        </p>
      </div>

      {/* Your Referral Stats */}
      {stats && (
        <div
          className="glass-card-static"
          style={{ padding: 32, marginBottom: 48 }}
        >
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 24,
                color: "var(--text-primary)",
              }}
            >
              Your Referral Stats
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  padding: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--accent-cyan)",
                    marginBottom: 4,
                  }}
                >
                  {stats.referralCount}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  People Invited
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--accent-green)",
                    marginBottom: 4,
                  }}
                >
                  +{stats.bonusFromReferrals}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Bonus Points
                </div>
              </div>

              {userRank && (
                <div
                  style={{
                    padding: 16,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: "var(--accent-purple)",
                      marginBottom: 4,
                    }}
                  >
                    #{userRank}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Leaderboard Rank
                  </div>
                </div>
              )}
            </div>
          </div>

          {stats && !stats.referralCode ? (
            /* Generate ID Section */
            <div
              style={{
                padding: 24,
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "var(--text-primary)",
                }}
              >
                Generate Your Referral ID
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
                Create a unique referral ID to start inviting friends and earning bonus points
              </p>
              <button
                onClick={generateReferralCode}
                disabled={generating}
                style={{
                  padding: "12px 28px",
                  background: "var(--accent-purple)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: generating ? "not-allowed" : "pointer",
                  opacity: generating ? 0.6 : 1,
                }}
              >
                {generating ? "Generating..." : "Generate Referral ID"}
              </button>
            </div>
          ) : (
            /* Invite Section */
            <div
              style={{
                padding: 16,
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: 12,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                  Your Referral ID
                </div>
                <code
                  style={{
                    display: "block",
                    padding: 12,
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--accent-cyan)",
                    marginBottom: 12,
                    wordBreak: "break-all",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stats?.referralCode}
                </code>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                  Invite Link
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${stats?.referralCode}`}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn-primary"
                    style={{
                    padding: "10px 20px",
                    fontSize: 12,
                    fontWeight: 600,
                    background: copied ? "var(--accent-green)" : "var(--accent-cyan)",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 48 }}>
        {/* People You've Referred */}
        {referredUsers.length > 0 && (
          <div className="glass-card-static" style={{ padding: 24 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                color: "var(--text-primary)",
              }}
            >
              Your Referrals ({referredUsers.length})
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              {referredUsers.map((referred, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {referred.avatarUrl ? (
                      <img
                        src={referred.avatarUrl}
                        alt={referred.username}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--gradient-brand)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {referred.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/profile/${referred.username}`}
                        style={{
                          color: "var(--text-primary)",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {referred.username}
                      </Link>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {new Date(referred.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--accent-green)",
                      }}
                    >
                      +50
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referral Info Box */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text-primary)",
            }}
          >
            How It Works
          </h2>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent-cyan)",
                  marginBottom: 4,
                }}
              >
                1. Share Your Code
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                Send your referral code or invite link to friends
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent-green)",
                  marginBottom: 4,
                }}
              >
                2. They Sign Up
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                Your friend creates an account with your referral code
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent-purple)",
                  marginBottom: 4,
                }}
              >
                3. Earn Points
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                You both get 50 bonus points immediately
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent-amber)",
                  marginBottom: 4,
                }}
              >
                4. Climb Leaderboard
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                Get recognized on the leaderboard for most referrals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card-static" style={{ padding: 32 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Top Referrers
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            Loading leaderboard...
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            No referrals yet. Be the first!
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    Referrals
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((u) => (
                  <tr
                    key={u.rank}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background:
                        u.username === user?.username
                          ? "rgba(34, 197, 94, 0.1)"
                          : undefined,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: u.username === user?.username ? 700 : 500,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "var(--gradient-brand)",
                          color: "white",
                          textAlign: "center",
                          lineHeight: "24px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {u.rank}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link
                        href={`/profile/${u.username}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textDecoration: "none",
                          color:
                            u.username === user?.username
                              ? "var(--accent-green)"
                              : "var(--text-primary)",
                          fontWeight: u.username === user?.username ? 700 : 500,
                        }}
                      >
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.username}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "var(--gradient-brand)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {u.username}
                      </Link>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "var(--accent-cyan)",
                      }}
                    >
                      {u.referralCount}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "var(--accent-green)",
                      }}
                    >
                      {u.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
