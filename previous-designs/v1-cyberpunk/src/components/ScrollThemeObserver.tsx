"use client";

import { useEffect } from "react";

// Map sections to their Thinai themes - Dark to Light progression
const sectionThemes: Record<string, string> = {
  intro: "neytal",        // Transmission - Ocean blue (DARK)
  hero: "kurinji",        // Hero - Mountains purple (DARK)
  services: "palai",      // Services/Climate - Desert red (DARK)
  adhan: "neytal",        // Adhan - Coastal blue (DARK)
  yazh: "mullai",         // Yazh - Forest green (LIGHT)
  sangam: "marutham",     // Sangam - Agriculture earth (LIGHT)
  thinai: "marutham",     // Thinai footer - End light
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
