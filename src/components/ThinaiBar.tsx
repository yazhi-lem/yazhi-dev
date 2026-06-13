"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Theme = "kurinji" | "mullai" | "marutham";

const thinaiThemes = [
  {
    id: "kurinji" as const,
    tamil: "குறிஞ்சி",
    english: "Mountains",
    icon: "🏔️",
    theme: "agam", // Dark mountains
    color: "#C17B3D",
  },
  {
    id: "mullai" as const,
    tamil: "முல்லை",
    english: "Forest",
    icon: "🌳",
    theme: "puram", // Light forest
    color: "#B8651B",
  },
  {
    id: "marutham" as const,
    tamil: "மருதம்",
    english: "Agriculture",
    icon: "🌾",
    theme: "ocean", // Water/farmland
    color: "#4A9ECC",
  },
];

export default function ThinaiBar() {
  const [activeTheme, setActiveTheme] = useState<Theme>("mullai");

  useEffect(() => {
    // Get theme from DOM
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const thinai = thinaiThemes.find((t) => t.theme === currentTheme);
    if (thinai) setActiveTheme(thinai.id);
  }, []);

  const handleThemeClick = (thinai: typeof thinaiThemes[0]) => {
    setActiveTheme(thinai.id);
    document.documentElement.setAttribute("data-theme", thinai.theme);
    localStorage.setItem("theme", thinai.theme);
    console.log(`🎨 Theme changed to ${thinai.tamil} (${thinai.theme})`);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {thinaiThemes.map((thinai, index) => (
        <motion.button
          key={thinai.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          onClick={() => handleThemeClick(thinai)}
          className="group relative"
          whileHover={{ scale: 1.1, x: -10 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Thinai Card */}
          <div
            className="px-4 py-3 rounded-l-xl backdrop-blur-sm transition-all duration-300"
            style={{
              background: activeTheme === thinai.id ? 'var(--surface)' : 'transparent',
              borderTop: `2px solid ${activeTheme === thinai.id ? thinai.color : 'transparent'}`,
              borderBottom: `2px solid ${activeTheme === thinai.id ? thinai.color : 'transparent'}`,
              borderLeft: `2px solid ${activeTheme === thinai.id ? thinai.color : 'transparent'}`,
              borderRight: `4px solid ${thinai.color}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{thinai.icon}</span>
              <div className="text-left">
                <div
                  className="tamil-body text-sm font-bold"
                  style={{ color: activeTheme === thinai.id ? 'var(--text)' : 'var(--text-soft)' }}
                >
                  {thinai.tamil}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'var(--text-soft)', opacity: 0.7 }}
                >
                  {thinai.english}
                </div>
              </div>
            </div>
          </div>

          {/* Active Indicator */}
          {activeTheme === thinai.id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full"
              style={{ background: thinai.color }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
