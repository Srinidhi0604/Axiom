import { GateShell } from "@/components/gate/GateShell";

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return <GateShell>{children}</GateShell>;
}
