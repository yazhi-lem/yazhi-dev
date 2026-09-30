import type { ReactNode } from "react";
import { BubbleShell, type ShellNavItem } from "@/bubble";
import { FOUNDRY_PROJECTS } from "@/lib/foundry/projects";

const NAV: ShellNavItem[] = [
  { href: "/foundry", label: "Overview", tone: "gold" },
  ...FOUNDRY_PROJECTS.map((p) => ({ href: `/foundry/${p.id}`, label: p.name.en, tone: p.tone })),
];

export default function FoundryLayout({ children }: { children: ReactNode }) {
  return (
    <BubbleShell product="Foundry" productHref="/foundry" nav={NAV}>
      {children}
    </BubbleShell>
  );
}
