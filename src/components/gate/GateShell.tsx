"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const gateLinks = [
  { href: "/gate", label: "Dashboard" },
  { href: "/gate/pyq", label: "PYQ Bank" },
  { href: "/gate/mock-tests", label: "Mock Tests" },
  { href: "/gate/formulas", label: "Formulas" },
  { href: "/gate/rank-predictor", label: "Rank Predictor" },
  { href: "/gate/analytics", label: "Analytics" },
  { href: "/gate/practice", label: "Practice" },
  { href: "/gate/syllabus", label: "Syllabus" },
  { href: "/gate/ai-explainer", label: "AI Explainer" },
];

export function GateShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="gate-shell">
      <aside className="gate-sidebar">
        <Link href="/gate" className="gate-sidebar-brand">
          <span>GATE</span>
          <strong>CS Command</strong>
        </Link>
        <nav className="gate-sidebar-nav">
          {gateLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/gate" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={active ? "active" : ""}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="gate-content">{children}</div>
    </div>
  );
}
