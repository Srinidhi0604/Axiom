import Link from "next/link";
import styles from "../../axiom.module.css";
import { CeoSimulatorClient } from "./CeoSimulatorClient";

export default function VibeCeoPage() {
  return (
    <main className={styles.shell}>
      <Link href="/vibe" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Back to Vibe Lab</Link>
      <div style={{ marginTop: 28 }}>
        <CeoSimulatorClient />
      </div>
    </main>
  );
}
