import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display, EB_Garamond, Noto_Serif_Tamil } from "next/font/google";
import "@/styles/globals.css";
import { LangProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThinaiTheme } from "@/components/providers/ThinaiTheme";
import { Motion } from "@/components/providers/Motion";

/* Type system, per the Brand Identity System (v1.1): "Two typefaces, one
   system. Playfair Display carries titles and the wordmark. EB Garamond
   carries all body copy and captions. No sans-serif. Ever." Neither has
   Tamil glyph coverage, so Noto Serif Tamil — the spec's own named
   "Tamil face" — is chained in as the fallback in both stacks; Tamil
   text (e.g. யாழி) falls through to it automatically per-character.
   IBM Plex Mono is unaddressed by the brand kit (code/label context, not
   prose) and stays as-is. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const notoTamil = Noto_Serif_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "600"],
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
// section headings); body copy uses EB Garamond. Both chain to Noto
// Serif Tamil for glyphs neither Latin serif covers.
const displayStack = `${playfair.style.fontFamily}, ${notoTamil.style.fontFamily}, serif`;
const bodyStack = `${ebGaramond.style.fontFamily}, ${notoTamil.style.fontFamily}, serif`;

export const metadata: Metadata = {
  title: "யாழி • Yazhi — Sovereign AI & Language Initiative",
  description: "Reclaiming the agentic power of Thenmadurai. Sovereign Intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ta"
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
