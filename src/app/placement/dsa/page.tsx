import { Suspense } from "react";
import { PlacementProblemBrowser, TopicCards } from "@/components/placement/PlacementClient";
import styles from "@/components/placement/placement.module.css";

export default function Page() {
  return (
    <Suspense fallback={<main className={styles.shell}>Loading DSA sheet...</main>}>
      <PlacementProblemBrowser mode="dsa" />
      <section className={styles.shell} style={{ paddingTop: 0 }}>
        <TopicCards />
      </section>
    </Suspense>
  );
}
