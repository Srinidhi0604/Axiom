import { Suspense } from "react";
import { PlacementProblemBrowser } from "@/components/placement/PlacementClient";
import styles from "@/components/placement/placement.module.css";

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  return (
    <Suspense fallback={<main className={styles.shell}>Loading topic...</main>}>
      <PlacementProblemBrowser mode="dsa" topicSlug={topic} />
    </Suspense>
  );
}
