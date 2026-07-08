// Centralized content and translations for the entire site

export const content = {
  // Hero Section
  hero: {
    title: {
      ta: "யாழி",
      en: "YAZHI"
    },
    subtitle: {
      ta: "தமிழ் செயற்கை நுண்ணறிவு",
      en: "Tamil Artificial Intelligence"
    },
    tagline: {
      ta: "அகமும் புறமும்",
      en: "Sovereign AI Model"
    },
    philosophy: {
      ta: "இந்திய மொழிகளுக்கான இறையாண்மை கொண்ட செயற்கை நுண்ணறிவு மாதிரி",
      en: "Sovereign AI Model for Indian Languages"
    },
    cta: {
      explore: { ta: "ஆராய்க", en: "Explore" },
      join: { ta: "இணையுங்கள்", en: "Join Us" }
    },
    stats: {
      parameters: { ta: "அளவுருக்கள்", en: "Parameters" },
      languages: { ta: "இந்திய மொழிகள்", en: "Indian Languages" },
      projects: { ta: "திட்டங்கள்", en: "Projects" }
    },
    quote: {
      ta: "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்",
      en: "Of all the languages we know, none is as sweet as Tamil",
      author: { ta: "பாரதியார்", en: "Bharathiyar" }
    }
  },

  // Adhan Showcase
  adhan: {
    title: { ta: "அதன்", en: "Adhan" },
    subtitle: { ta: "இந்திய மொழிகளுக்கான இறையாண்மை செயற்கை நுண்ணறிவு", en: "Sovereign AI for Indian Languages" },
    description: { ta: "7B parameter sovereign AI model for 22+ Indian languages. One unified model from Tamil to Hindi, Bengali to Telugu.", en: "7B parameter sovereign AI model for 22+ Indian languages" },
    cta: { ta: "GitHub இல் காண்க", en: "View on GitHub" }
  },

  // Sangam Showcase
  sangam: {
    title: { ta: "சங்கம்", en: "Sangam" },
    landscape: { ta: "மருதம் - விளை நிலம்", en: "Marutham - Agricultural Lands" },
    description: { ta: "Classical Tamil literature analysis through the five landscapes. Marutham represents agricultural fertile lands, union, and domestic happiness.", en: "Classical Tamil literature analysis through five landscapes" },
    features: {
      analysis: { ta: "செய்யுள் ஆய்வு", en: "Poem Analysis" },
      classification: { ta: "திணை வகைப்பாடு", en: "Thinai Classification" },
      linguistic: { ta: "மொழி ஆய்வு", en: "Linguistic Study" }
    },
    cta: { ta: "மேலும் அறிக", en: "Learn More" }
  },

  // Yazh App Showcase
  yazh: {
    title: { ta: "யாழ்", en: "Yazh Guardian" },
    subtitle: { ta: "யாழி • புராண காவலன்", en: "Mythical Guardian" },
    description: { ta: "Guardian application inspired by the mythical Yazhi creature. Protecting Tamil digital heritage and community wisdom.", en: "Guardian application protecting Tamil digital heritage" },
    cta: { ta: "தொடங்குக", en: "Get Started" }
  },

  // Services Grid
  services: {
    title: { ta: "எங்கள் சேவைகள்", en: "Our Services" },
    subtitle: { ta: "Our Services • தமிழ் செயற்கை நுண்ணறிவு சூழல்", en: "Tamil AI Ecosystem" },
    items: {
      agents: {
        tamil: "முகவர்கள்",
        english: "Agents",
        description: "AI agents for Tamil tasks"
      },
      applications: {
        tamil: "செயலிகள்",
        english: "Applications",
        description: "Tamil applications"
      },
      annotations: {
        tamil: "விளக்கங்கள்",
        english: "Annotations",
        description: "Quality datasets"
      }
    },
    cta: { ta: "எங்கள் சமூகத்தில் சேருங்கள்", en: "Join Our Community" }
  },

  // Footer
  footer: {
    title: { ta: "ஐந்திணை", en: "Five Landscapes" },
    subtitle: { ta: "Five Landscapes of Sangam Poetry", en: "Five Landscapes of Sangam Poetry" },
    thinai: {
      kurinji: { ta: "குறிஞ்சி", en: "Kurinji", desc: "Mountains • Union" },
      mullai: { ta: "முல்லை", en: "Mullai", desc: "Forests • Waiting" },
      marutham: { ta: "மருதம்", en: "Marutham", desc: "Agriculture • Quarrel" },
      neytal: { ta: "நெய்தல்", en: "Neytal", desc: "Coastal • Separation" },
      palai: { ta: "பாலை", en: "Palai", desc: "Desert • Elopement" }
    },
    branding: {
      tagline: { ta: "தமிழ் செயற்கை நுண்ணறிவு", en: "Tamil AI Ecosystem" }
    },
    links: {
      projects: { ta: "திட்டங்கள்", en: "Projects" },
      services: { ta: "சேவைகள்", en: "Services" },
      community: { ta: "சமூகம்", en: "Community" }
    },
    copyright: { ta: "© 2025 யாழி • Yazhi. இறையாண்மை செயற்கை நுண்ணறிவு • Sovereign AI", en: "© 2025 Yazhi. Sovereign AI" }
  },

  // Thinai Bar
  thinaiBar: {
    kurinji: { ta: "குறிஞ்சி", en: "Mountains" },
    mullai: { ta: "முல்லை", en: "Forest" },
    marutham: { ta: "மருதம்", en: "Agriculture" }
  },

  // Language Toggle
  languageToggle: {
    tamil: "த",
    english: "EN",
    both: "த+EN"
  },

  // Theme Names
  themes: {
    agam: "அகம்",
    puram: "புறம்",
    ocean: "கடல்"
  }
};

// Helper to get nested content with fallback
export function getContent(path: string, lang: "ta" | "en" | "both" = "ta") {
  const keys = path.split(".");
  let value: any = content;

  for (const key of keys) {
    value = value?.[key];
    if (!value) return path; // Return path if not found
  }

  if (typeof value === "object" && value.ta && value.en) {
    if (lang === "ta") return value.ta;
    if (lang === "en") return value.en;
    return `${value.ta} • ${value.en}`;
  }

  return value;
}
