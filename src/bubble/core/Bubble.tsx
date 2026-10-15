import Link from "next/link";
import type { ReactNode } from "react";
import { toneStyle, type Tone } from "../tone";

const PAD = { sm: "p-3", md: "p-5", lg: "p-7" } as const;

/** The one surface primitive. Cards, stat tiles, pills and orbs are all
    Bubbles with a different `shape`; pass `href` and it becomes a link
    with hover lift and a tone-coloured focus ring. Server-renderable. */
export function Bubble({
  children,
  tone = "neutral",
  shape = "card",
  size = "md",
  href,
  as: Tag = "div",
  className = "",
  label,
}: {
  children: ReactNode;
  tone?: Tone;
  shape?: "card" | "pill" | "orb";
  size?: keyof typeof PAD;
  href?: string;
  as?: "div" | "section" | "article" | "li";
  className?: string;
  /** accessible name, for bubbles whose content is mostly visual */
  label?: string;
}) {
  const cls = `ybi-bubble ${shape === "pill" ? "px-4 py-2" : PAD[size]} ${className}`.trim();
  if (href) {
    return (
      <Link
        href={href}
        data-shape={shape}
        data-interactive=""
        aria-label={label}
        className={`block ${cls}`}
        style={toneStyle(tone)}
      >
        {children}
      </Link>
    );
  }
  return (
    <Tag data-shape={shape} aria-label={label} className={cls} style={toneStyle(tone)}>
      {children}
    </Tag>
  );
}
