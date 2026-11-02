import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display, Nunito, Baloo_Thambi_2 } from "next/font/google";
import "@/styles/globals.css";
import { LangProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThinaiTheme } from "@/components/providers/ThinaiTheme";
import { Motion } from "@/components/providers/Motion";
import { MODE_SCRIPT } from "@yazhi/bubble/mode-script";

/* Type system (Yazhi Bubble design system, Nov 2026). Playfair Display
   carries titles and the wordmark, as in the Brand Identity System v1.1.
   Body copy and Tamil text are rounded and readable, to match the bubbles:
   Nunito for Latin, Baloo Thambi 2 (the Tamil member of the Baloo family)
   for Tamil. This replaces v1.1's EB Garamond body. Tamil inside a
   Playfair heading still falls through to Noto Serif Tamil.
   IBM Plex Mono is unaddressed by the brand kit (code/label context, not
   prose) and stays as-is. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});
const balooThambi = Baloo_Thambi_2({
  subsets: ["tamil"],
  display: "swap",
});
// Self-hosted (Tamil subset, OFL): the Google-served stylesheet for Noto
// Serif Tamil stopped resolving under Turbopack's next/font/google loader
// in CI, so it loads from public/fonts like IBM Plex Mono.
const notoTamil = localFont({
  src: [
    { path: "../../public/fonts/NotoSerifTamil-Tamil-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/NotoSerifTamil-Tamil-SemiBold.woff2", weight: "600" },
  ],
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "../../public/fonts/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
});

// Wordmark and display headings share the Playfair register (weight is
// set per-use via font-weight utilities: 900 for the wordmark, 700 for
// section headings) and chain to Noto Serif Tamil. Body copy is Nunito,
// chained to Baloo Thambi 2 for Tamil glyphs.
const displayStack = `${playfair.style.fontFamily}, ${notoTamil.style.fontFamily}, serif`;
const bodyStack = `${nunito.style.fontFamily}, ${balooThambi.style.fontFamily}, system-ui, sans-serif`;

export const metadata: Metadata = {
  title: "யாழி — இறையாண்மைச் செயற்கை நுண்ணறிவும் மொழி முன்னெடுப்பும் • Yazhi — Sovereign AI & Language Initiative",
  description: "Reclaiming the agentic power of Thenmadurai. Sovereign Intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ta"
      // the Bubble theme script below may set data-mode before hydration
      suppressHydrationWarning
      className={mono.variable}
      style={
        {
          "--font-display": displayStack,
          "--font-serif": displayStack,
          "--font-body": bodyStack,
        } as React.CSSProperties
      }
    >
      <body>
        {/* a chosen light or dark theme applies before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
        <LangProvider>
          <ThinaiTheme />
          <Motion>
            <SmoothScroll>{children}</SmoothScroll>
          </Motion>
        </LangProvider>
      </body>
    </html>
  );
}
