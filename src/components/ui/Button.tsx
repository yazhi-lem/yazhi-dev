"use client";
import Link from "next/link";
import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all [text-shadow:none]";
  const styles =
    variant === "primary"
      ? "bg-gold text-night hover:bg-bronze hover:text-ivory"
      : "border border-ivory/25 text-ivory hover:border-gold hover:text-gold";
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link href={href} className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </Link>
  );
}
