"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ta" | "en" | "both";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ta: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ta");

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Translation helper
  const t = (ta: string, en: string) => {
    if (language === "ta") return ta;
    if (language === "en") return en;
    return `${ta} • ${en}`; // both
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
