import type { Metadata } from "next";
import { Noto_Serif_Telugu } from "next/font/google";

/* Telugu face for the Hyderabad workspaces. The brand system is serif-only
   ("No sans-serif. Ever."), so Noto Serif Telugu — the Telugu sibling of the
   Noto Serif Tamil fallback in the root layout — is chained in front. */
const notoTelugu = Noto_Serif_Telugu({ subsets: ["telugu", "latin"], weight: ["400", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "యాళి Workspaces — Telugu Legal & Healthcare · Yazhi",
  description: "Sovereign Telugu AI workspaces for Hyderabad legal firms and clinics. Data stays in India.",
};

export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="te" style={{ fontFamily: `${notoTelugu.style.fontFamily}, var(--font-body, serif)` }}>
      {children}
    </div>
  );
}
