"use client";

import { useLang } from "@/lib/i18n";

/**
 * BrandWordmark renders the official brand-kit vector wordmarks:
 * - English: yazhi-wordmark-dark (Playfair Display Black 900, -3px letter-spacing)
 * - Tamil: yazhi-wordmark-tamil-dark (Noto Serif Tamil SemiBold 600, யாழி)
 * - Both: Tamil wordmark + separator + English wordmark
 */
export function BrandWordmark({
  height = 40,
  className = "",
  svgClassName = "",
}: {
  height?: number;
  className?: string;
  svgClassName?: string;
}) {
  const { lang } = useLang();

  // Width is derived from native viewBox aspect ratios:
  // Tamil: 200x90 (~2.22 ratio)
  // English: 320x90 (~3.55 ratio)
  const tamilWidth = Math.round(height * (200 / 90));
  const englishWidth = Math.round(height * (320 / 90));

  const tamilSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={tamilWidth}
      height={height}
      viewBox="0 0 200 90"
      role="img"
      aria-label="Yazhi Tamil wordmark, யாழி"
      className={`shrink-0 ${svgClassName}`}
    >
      <text
        x="0"
        y="64"
        lang="ta"
        fontFamily="var(--font-serif), 'Noto Serif Tamil', Latha, serif"
        fontSize="60"
        fontWeight="600"
        fill="#f8f5ef"
      >
        யாழி
      </text>
    </svg>
  );

  const englishSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={englishWidth}
      height={height}
      viewBox="0 0 320 90"
      role="img"
      aria-label="Yazhi wordmark"
      className={`shrink-0 ${svgClassName}`}
    >
      <text
        x="0"
        y="64"
        fontFamily="var(--font-serif), 'Playfair Display', Georgia, 'Times New Roman', serif"
        fontSize="64"
        fontWeight="900"
        letterSpacing="-3"
        fill="#f8f5ef"
      >
        Yazhi
      </text>
    </svg>
  );

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      {lang !== "en" && (
        <span key={`ta-${lang}`} className="bi-fade-in inline-flex">
          {tamilSvg}
        </span>
      )}
      {lang === "both" && (
        <span aria-hidden className="text-base sm:text-lg font-serif text-ivory-dim/60 leading-none bi-fade-in">
          •
        </span>
      )}
      {lang !== "ta" && (
        <span key={`en-${lang}`} className="bi-fade-in inline-flex">
          {englishSvg}
        </span>
      )}
    </span>
  );
}
