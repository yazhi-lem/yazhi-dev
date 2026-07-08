/** Shared Framer Motion presets — component-level UI animation only.
    Scroll set-pieces live in GSAP (lib/gsap.ts). */
import type { Variants, Transition } from "framer-motion";

export const easeOutSoft: Transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: easeOutSoft },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.25 } },
  whileTap: { scale: 0.985 },
};
