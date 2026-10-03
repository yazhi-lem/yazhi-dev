import type { Metadata } from "next";
import { DevShell } from "@/components/bubble/DevShell";
import { Foundry } from "@/components/foundry/Foundry";

export const metadata: Metadata = {
  title: "Foundry — build a Yazhi bubble",
  description:
    "Foundry is the agent builder for the Yazhi Bubble UI: write a persona, test it live on-device or on yazhi-api, and export a Circle-signed bubble manifest.",
};

export default function FoundryPage() {
  return (
    <DevShell fullHeight>
      <Foundry />
    </DevShell>
  );
}
