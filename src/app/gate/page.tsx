"use client";

import { useState } from "react";
import { GateStreamSwitcher } from "@/components/gate/GateStreamSwitcher";
import { ProductLanding } from "@/components/ProductLanding";

export default function GatePage() {
  const [launched, setLaunched] = useState(false);

  if (launched) return <GateStreamSwitcher />;

  return (
    <ProductLanding
      subtitle="Axiom Exam Prep"
      title="Crack GATE with Command"
      description="The ultimate GATE preparation environment. Analyze PYQs, take mock tests, predict your rank, and practice with our implementation-first approach tailored for your specific engineering stream."
      launchText="Launch GATE Command"
      colorHex="#F59E0B"
      features={[
        {
          title: "Stream-Specific Workspaces",
          desc: "Tailored environments for CSE, EC, EE, ME, and more. Direct focus on what exactly comes in your stream.",
        },
        {
          title: "Intelligent PYQ Analysis",
          desc: "Full breakdown of Previous Year Questions, categorized by subject and topic with detailed analytics.",
        },
        {
          title: "Interactive Mock Engine",
          desc: "Simulate the actual GATE exam interface. Track your time, accuracy, and readiness score.",
        },
        {
          title: "Rank Predictor",
          desc: "Estimate your All India Rank based on your current performance and historical GATE data.",
        }
      ]}
      onLaunch={() => setLaunched(true)}
    />
  );
}
