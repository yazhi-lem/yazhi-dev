import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { toneStyle, type Tone } from "../tone";

const SIZE = { sm: "px-3.5 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-base" } as const;

const VARIANT = {
  // tone→text mix fill with the page ground as label: AA in every theme
  solid: "ybi-solid hover:brightness-110",
  // 18% tint, primary text colour
  soft: "ybi-soft hover:brightness-105",
  // outline only
  ghost: "border border-[color:var(--tone)]/40 text-ivory hover:bg-[color:var(--tone)]/10",
} as const;

/** Pill-shaped action. `href` renders a Link; otherwise a <button> that
    passes native props through (onClick works from client parents). */
export function Button({
  children,
  tone = "gold",
  variant = "solid",
  size = "md",
  href,
  className = "",
  ...rest
}: {
  children: ReactNode;
  tone?: Tone;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[filter,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tone)] disabled:cursor-not-allowed disabled:opacity-50 ${SIZE[size]} ${VARIANT[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} style={toneStyle(tone)}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={toneStyle(tone)} {...rest}>
      {children}
    </button>
  );
}
