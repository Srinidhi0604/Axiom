"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { showToast } from "@/components/Toast";

export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const copyToClipboard = async () => {
    if (!user?.referralCode) return;
    const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${user.referralCode}`;

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
      const token = localStorage.getItem("axiom_token") || localStorage.getItem("pullgame_token");

      if (!token) {
        showToast("Please log in to generate a referral code", "error");
        return;
      }

      const response = await fetch("/api/migrate/referral-codes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        showToast("Failed to generate referral code", "error");
        return;
      }

      showToast("Referral ID generated. Please refresh the page.", "success");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Failed to generate referral code:", error);
      showToast("Error generating referral code", "error");
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Referral Program</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Please log in to view and share your unique referral code.
        </p>
        <Link href="/auth/login" className="btn-primary" style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "white",
            color: "black",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold"
        }}>
          Log in to continue
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
        Share Axiom, Earn Points
      </h1>
      <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 48, maxWidth: "600px", margin: "0 auto 48px" }}>
        Invite your friends to Axiom. You both get 50 bonus points when they sign up using your unique referral code.
      </p>

      <div style={{ padding: 48, borderRadius: 16, background: "rgba(26,26,26,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {user.referralCode ? (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 24, color: "var(--text-primary)" }}>
              Your Unique Referral Code
            </h2>
            <div style={{ 
              fontSize: 32, 
              fontWeight: "bold", 
              letterSpacing: 2, 
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "16px 32px",
              borderRadius: 8,
              display: "inline-block",
              marginBottom: 32,
              border: "1px dashed rgba(255, 255, 255, 0.3)"
            }}>
              {user.referralCode}
            </div>
            
            <div>
              <button 
                onClick={copyToClipboard} 
                style={{
                    padding: "12px 24px",
                    background: copied ? "#10b981" : "white",
                    color: copied ? "white" : "black",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
              >
                {copied ? "Copied to clipboard!" : "Copy Invite Link"}
              </button>
            </div>
          </>
        ) : (
           <>
            <h2 style={{ fontSize: 20, marginBottom: 16, color: "var(--text-primary)" }}>
              Generate Your Code
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
              You don't have a referral code yet. Generate one now to start inviting friends.
            </p>
            <button 
              onClick={generateReferralCode} 
              disabled={generating}
              style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  opacity: generating ? 0.7 : 1
              }}
            >
              {generating ? "Generating..." : "Generate Code"}
            </button>
           </>
        )}
      </div>
    </div>
  );
}
