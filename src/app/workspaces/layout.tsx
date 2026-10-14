import type { Metadata } from "next";
import { Noto_Serif_Telugu } from "next/font/google";
import { WsLangProvider } from "@/lib/workspace/i18n";

/* Telugu face for the Hyderabad workspaces. The brand system is serif-only
   ("No sans-serif. Ever."), so Noto Serif Telugu — the Telugu sibling of the
   Noto Serif Tamil fallback in the root layout — is chained in front. */
const notoTelugu = Noto_Serif_Telugu({ subsets: ["telugu", "latin"], weight: ["400", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "Yazhi వర్క్‌స్పేస్ · Workspaces — న్యాయ & ఆరోగ్యం · Legal & Healthcare",
  description: "హైదరాబాద్ న్యాయ సంస్థలు, క్లినిక్‌ల కోసం Yazhi వర్క్‌స్పేస్‌లు · Yazhi workspaces for Hyderabad legal firms and clinics.",
};

export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="te" style={{ fontFamily: `${notoTelugu.style.fontFamily}, var(--font-body, serif)` }}>
      <WsLangProvider>{children}</WsLangProvider>
    </div>
  );
}
