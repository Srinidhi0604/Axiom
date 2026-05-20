import Link from "next/link";
import styles from "../../placement.module.css";

export default async function AptitudePage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const title = track.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
      <Link href="/placement" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>{"<- Back to PlacePrep"}</Link>
      <section style={{ marginTop: 58 }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 900 }}>{title}</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 760, lineHeight: 1.75, marginTop: 20 }}>
          Timed placement practice with explanation, bookmarked sets, sessions and progress tracking.
        </p>
      </section>
    </main>
  );
}
