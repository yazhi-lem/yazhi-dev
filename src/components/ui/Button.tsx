"use client";
import Link from "next/link";
import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all";
  const styles =
    variant === "primary"
      ? "bg-gold text-night hover:bg-bronze hover:text-ivory"
      : "border border-ivory/25 text-ivory hover:border-gold hover:text-gold";
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link href={href} className={`${base} ${styles}`} {...props}>
      {children}
    </Link>
  );
}
