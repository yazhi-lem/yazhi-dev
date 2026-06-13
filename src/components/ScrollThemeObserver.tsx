"use client";

import { useEffect } from "react";

// Map sections to their Thinai themes
const sectionThemes: Record<string, string> = {
  hero: "kurinji",        // Mountains - Purple dark
  adhan: "mullai",        // Forest - Green light
  sangam: "marutham",     // Agriculture - Earth brown
  yazh: "neytal",         // Coastal - Ocean blue
  services: "palai",      // Desert - Red/orange
  footer: "kurinji",      // Back to mountains
};

export default function ScrollThemeObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section[data-thinai]");

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px", // Trigger when section is 20% from top/bottom
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const thinai = entry.target.getAttribute("data-thinai");
          if (thinai) {
            const theme = sectionThemes[thinai];
            if (theme) {
              console.log(`🎨 Scroll: Changing theme to ${thinai} (${theme})`);
              document.documentElement.setAttribute("data-theme", theme);
              localStorage.setItem("theme", theme);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}
