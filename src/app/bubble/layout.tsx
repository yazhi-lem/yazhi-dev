import type { ReactNode } from "react";
import { DevShell } from "@/components/bubble/DevShell";

/** Every page under /bubble — the Bubble UI docs and the UI library —
    shares the builder header and one Circle session. */
export default function BubbleLayout({ children }: { children: ReactNode }) {
  return <DevShell>{children}</DevShell>;
}
