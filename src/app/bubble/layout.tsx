import type { ReactNode } from "react";
import { DevShell } from "@/components/bubble/DevShell";

/** /bubble — the Bubble UI library — shares the shell, one Circle session
    and Mission Control. */
export default function BubbleLayout({ children }: { children: ReactNode }) {
  return <DevShell>{children}</DevShell>;
}
