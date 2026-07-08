"use client";
import { MotionConfig } from "framer-motion";

/** Makes every Framer Motion animation on the site respect the user's
    prefers-reduced-motion setting (transforms/opacity reduced to instant). */
export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
