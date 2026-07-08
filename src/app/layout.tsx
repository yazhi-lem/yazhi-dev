import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { LangProvider } from "@/lib/i18n";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThinaiTheme } from "@/components/providers/ThinaiTheme";
import { Motion } from "@/components/providers/Motion";

/* Type system — self-hosted woff2 via next/font/local (see README):
   — Anek Tamil (display, variable wght+wdth): part of the Anek superfamily
     spanning nine Indic scripts — one type family across scripts mirrors
     "one model, 22+ languages". A single variable file covers the whole
     display range.
   — Hind Madurai (body): designed for Tamil, literally named for Madurai —
     the same Madurai as "Thenmadurai" in the site's own meta description.
   — IBM Plex Mono: code block; wide coverage renders the multilingual
     Adhan sample cleanly. */
const display = localFont({
  src: "../../public/fonts/AnekTamil-Variable.woff2",
  variable: "--font-display",
  weight: "100 800",
  display: "swap",
});
const body = localFont({
  src: [
    { path: "../../public/fonts/HindMadurai-Light.woff2", weight: "300" },
    { path: "../../public/fonts/HindMadurai-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/HindMadurai-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/HindMadurai-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-body",
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

export const metadata: Metadata = {
  title: "யாழி • Yazhi — Sovereign AI & Language Initiative",
  description: "Reclaiming the agentic power of Thenmadurai. Sovereign Intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
