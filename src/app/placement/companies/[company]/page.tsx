import { Suspense } from "react";
import { PlacementProblemBrowser } from "@/components/placement/PlacementClient";
import styles from "@/components/placement/placement.module.css";

export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  return (
    <Suspense fallback={<main className={styles.shell}>Loading company...</main>}>
      <PlacementProblemBrowser mode="company" companySlug={company} />
    </Suspense>
  );
}
