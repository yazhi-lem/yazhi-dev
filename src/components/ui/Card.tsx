"use client";
import { motion } from "framer-motion";
import { fadeUp, cardHover } from "@/lib/motionPresets";
import type { ReactNode } from "react";

/** The single reusable card primitive. Every raised surface on the site
    derives from this: night-2 ground, hairline ivory border, thinai
    accent edge on hover. */
export function Card({
  children,
  className = "",
  accent = false,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  interactive?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      {...(interactive ? cardHover : {})}
      className={`relative rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/80 p-6 backdrop-blur transition-colors hover:border-[color:var(--accent)]/50 ${
        accent ? "border-l-2 border-l-[color:var(--accent)]" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
