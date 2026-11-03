import type { ReactNode } from "react";
import { CircleProvider } from "@/components/circle/CircleProvider";

/** The product workspaces (/workspaces, /guru, /nyaya, /kural, /kadai)
    share one Circle session. Each draws its own shell; .bubble-root gives
    them the light theme as well as the dark. */
export default function WorkspacesLayout({ children }: { children: ReactNode }) {
  return (
    <CircleProvider>
      <div className="bubble-root min-h-dvh">{children}</div>
    </CircleProvider>
  );
}
