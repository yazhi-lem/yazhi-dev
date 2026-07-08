"use client";
import { useEffect } from "react";
import { THINAI } from "@/lib/content";

/** The signature system: as each thinai-governed section enters the
    viewport, the global --accent variable migrates to that landscape's
    hue and the body's ambient gradient follows. IntersectionObserver
    (not GSAP) so it also works with reduced motion / no Lenis. */
export function ThinaiTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.thinai;
          if (key) {
            root.style.setProperty("--accent", `var(--${key})`);
            root.dataset.thinai = key;
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    THINAI.forEach((t) => {
      const el = document.getElementById(t.section);
      if (el) {
        el.dataset.thinai = t.key;
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
