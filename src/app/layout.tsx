import type { Metadata } from "next";
import { DM_Serif_Display, Jost } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const jost = Jost({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Yazhi — Sovereign AI & Language Initiative",
  description: "Reclaiming the agentic power of Thenmadurai. Sovereign Intelligence.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import WebGLBackground from "@/components/WebGLBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${dmSerifDisplay.variable} ${jost.variable}`} data-theme="neytal">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;900&family=Mukta+Malar:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="overflow-x-hidden antialiased">
        <LanguageProvider>
          <ThemeProvider>
            <WebGLBackground />
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
