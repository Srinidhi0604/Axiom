"use client";

import { useState } from "react";

export function VibeScanner() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/vercel/next.js");
  const [status, setStatus] = useState("Ready to scan");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus(`Scan queued for ${repoUrl.replace(/^https?:\/\//, "")}`);
      }}
      style={{ display: "grid", gap: 12 }}
    >
      <input
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        placeholder="Paste a GitHub repository URL"
        className="input-field"
        aria-label="GitHub repository URL"
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button className="btn-primary" type="submit" style={{ borderRadius: 8 }}>
          Scan Repo
        </button>
        <span style={{ color: "var(--accent-green)", fontSize: 13 }}>{status}</span>
      </div>
    </form>
  );
}
