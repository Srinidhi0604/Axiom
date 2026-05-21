"use client";

import { useState } from "react";
import { ProductLanding } from "@/components/ProductLanding";

export function PapersWrapper({ children }: { children: React.ReactNode }) {
  const [launched, setLaunched] = useState(false);

  if (launched) return <>{children}</>;

  return (
    <ProductLanding
      subtitle="Axiom Research"
      title="Paper Labs"
      description="Don't just read the paper. Compile it. From Transformers to AlphaFold, interact with foundational research papers through executable PyScript sandboxes and implementation tasks."
      launchText="Explore the Labs"
      colorHex="#EC4899"
      features={[
        {
          title: "In-Browser Execution",
          desc: "Run Python and PyTorch directly in your browser. No local environment setup required.",
        },
        {
          title: "Guided Implementation",
          desc: "Step-by-step guides breaking down complex ML architectures into manageable coding blocks.",
        },
        {
          title: "Cross-Domain Research",
          desc: "Access state-of-the-art research across ML, Biology, Chemistry, and Electrical Engineering.",
        },
        {
          title: "Interactive Trees & Graphs",
          desc: "Visualize complex data architectures, neural networks, and phylogenetic trees instantly.",
        }
      ]}
      onLaunch={() => setLaunched(true)}
    />
  );
}