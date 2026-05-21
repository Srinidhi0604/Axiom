"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { PlacementHome } from "@/components/placement/PlacementClient";
import { ProductLanding } from "@/components/ProductLanding";

export default function Page() {
  const [launched, setLaunched] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();



  if (launched) return <PlacementHome />;

  return (
    <ProductLanding
      subtitle="Axiom Careers"
      title="PlacePrep"
      description="Crack any interview systematically. Master Data Structures & Algorithms, tackle company-specific archives, dive into intricate System Design problems, and secure your dream offer."
      launchText="Enter PlacePrep"
      colorHex="#8B5CF6"
      features={[
        {
          title: "Comprehensive DSA Sheet",
          desc: "450+ curated algorithm problems with progress tracking, custom notes, and difficulty indicators.",
        },
        {
          title: "Company Question Archives",
          desc: "Browse 660+ company-specific interview experiences. See exactly what product companies ask.",
        },
        {
          title: "System Design Modules",
          desc: "Go beyond LeetCode. Master HLD and LLD through interactive architecture design challenges.",
        },
        {
          title: "Persistent Tracking",
          desc: "Your progress maps directly to your Axiom profile, ensuring you know what to study next.",
        }
      ]}
      onLaunch={() => setLaunched(true)}
    />
  );
}
