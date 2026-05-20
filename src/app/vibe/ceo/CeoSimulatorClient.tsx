"use client";

import { useMemo, useState } from "react";

const simulation = {
  companyName: "Snip.io",
  projectName: "URL Shortener at Startup Scale",
  role: "Engineer #3",
  day: 5,
  users: 12000,
  equity: 0.86,
  sprintGoal: "Ship the core redirect flow before the launch spike breaks trust.",
  messages: [
    ["Arjun", "CEO", "Product Hunt copy promised custom slugs. Can we get this into the launch branch by Thursday?"],
    ["Priya", "Staff Engineer", "This works, but index strategy is part of the feature. Show me how it behaves at 10x."],
    ["Ravi", "DevOps", "We are close to the free tier ceiling. Any queue or cache plan needs a memory budget."],
    ["Neha", "Data", "Please log referrer and device on every redirect. Analytics is blocked without that."],
  ],
};

const tickets = [
  ["Design links schema", "Priya", "P1", "done", 200, "Model ownership, generated codes, custom slugs, click counts, and future indexes."],
  ["Implement redirect lookup", "Support", "P1", "progress", 800, "Resolve a short code, write click metadata, and return the destination without visible latency."],
  ["Custom slugs launch promise", "Arjun", "P2", "backlog", 1400, "Validate, reserve words, and handle collisions before launch."],
  ["Incident: Redirect P99 is 14 seconds", "PagerDuty", "P0", "backlog", 8000, "The links collection has millions of rows and short_code lookups are doing a full scan."],
  ["Architecture review: 10k users", "System", "P1", "review", 10000, "Pause and decide what breaks first if traffic grows 10x overnight."],
  ["Demo Day investor script", "Investor", "P1", "backlog", 120000, "Prepare the final technical story: what shipped, what scaled, and what you would rebuild."],
];

const columns = [
  ["backlog", "Sprint Backlog"],
  ["progress", "In Progress"],
  ["review", "In Review"],
  ["done", "Done"],
];

export function CeoSimulatorClient() {
  const [activeTitle, setActiveTitle] = useState(tickets[1][0]);
  const activeTicket = useMemo(() => tickets.find((ticket) => ticket[0] === activeTitle) ?? tickets[0], [activeTitle]);
  const [draft, setDraft] = useState("I will add a unique short_code index first, then move click logging off the hot path.");

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)", gap: 18 }}>
        <article className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <p style={{ color: "var(--accent-green)", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>CEO SIMULATOR</p>
          <h1 style={{ fontSize: 42, marginBottom: 12 }}>{simulation.projectName}</h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{simulation.sprintGoal}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            {[
              `${simulation.companyName}`,
              simulation.role,
              `Day ${simulation.day}`,
              `${simulation.users.toLocaleString()} users`,
              `${simulation.equity}% equity`,
            ].map((item) => (
              <span className="tag-pill" style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-green)" }} key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>
        <article className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Team messages</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {simulation.messages.map(([name, role, message]) => (
              <div key={name} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, background: "rgba(255,255,255,0.035)" }}>
                <strong>{name}</strong>
                <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 8 }}>{role}</span>
                <p style={{ color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.55 }}>{message}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(190px, 1fr))", gap: 14 }}>
        {columns.map(([status, label]) => (
          <div key={status} className="glass-card-static" style={{ padding: 14, borderRadius: 8, minHeight: 360 }}>
            <h2 style={{ fontSize: 15, marginBottom: 12 }}>{label}</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {tickets.filter((ticket) => ticket[3] === status).map((ticket) => (
                <button
                  key={ticket[0]}
                  type="button"
                  onClick={() => setActiveTitle(String(ticket[0]))}
                  style={{
                    textAlign: "left",
                    border: activeTitle === ticket[0] ? "1px solid rgba(6,182,212,0.55)" : "1px solid rgba(255,255,255,0.09)",
                    background: activeTitle === ticket[0] ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.04)",
                    color: "var(--text-primary)",
                    borderRadius: 8,
                    padding: 12,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <strong>{ticket[0]}</strong>
                    <span className="tag-pill" style={{ background: ticket[2] === "P0" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", color: ticket[2] === "P0" ? "var(--accent-red)" : "var(--text-secondary)" }}>{ticket[2]}</span>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.45 }}>{ticket[5]}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(360px, 1fr)", gap: 18 }}>
        <article className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>ACTIVE TICKET</p>
          <h2 style={{ fontSize: 28, marginBottom: 10 }}>{activeTicket[0]}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{activeTicket[5]}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            <span className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>Source: {activeTicket[1]}</span>
            <span className="tag-pill" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>Users impacted: {Number(activeTicket[4]).toLocaleString()}</span>
          </div>
        </article>
        <article className="glass-card-static" style={{ padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Engineering response</h2>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            style={{ width: "100%", minHeight: 160, resize: "vertical", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", padding: 14, lineHeight: 1.6 }}
          />
          <button className="btn-primary" style={{ marginTop: 12, borderRadius: 8 }} onClick={() => setDraft(`${draft}\n\nSubmitted for Priya review.`)}>
            Submit review note
          </button>
        </article>
      </section>
    </div>
  );
}
