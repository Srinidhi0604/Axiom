"use client";

import { useState } from "react";

export function WorkspaceActions({ submitLabel = "Submit" }: { submitLabel?: string }) {
  const [status, setStatus] = useState("Ready");

  return (
    <>
      <span style={{ color: "var(--accent-green)", fontSize: 13 }}>Status: {status}</span>
      <button
        className="btn-secondary"
        style={{ borderRadius: 8, padding: "8px 14px" }}
        onClick={() => setStatus("Tests passed locally")}
      >
        Run
      </button>
      <button
        className="btn-primary"
        style={{ borderRadius: 8, padding: "8px 14px" }}
        onClick={() => setStatus("Submitted")}
      >
        {submitLabel}
      </button>
    </>
  );
}
