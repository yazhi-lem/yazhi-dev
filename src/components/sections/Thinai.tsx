"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/ui/LogoMark";
import { THINAI_WORLD } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { playThinaiSound, isThinaiAudioMuted, toggleThinaiAudio } from "@/lib/thinaiAudio";

/** Detailed cultural, elemental shape, and aesthetic metadata for each of the five Thinai biomes */
interface ThinaiBiomeData {
  key: string;
  ta: string;
  en: string;
  moodTa: string;
  moodEn: string;
  bodyTa: string;
  bodyEn: string;
  icon: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  landscapeTa: string;
  landscapeEn: string;
  seasonTa: string;
  seasonEn: string;
  uriTa: string;
  uriEn: string;
  desktopCoords: { x: number; y: number };
  mobileCoords: { x: number; y: number };
  shapeType: "polygon" | "path";
  shapePoints?: string;
  shapePath?: string;
  shapeClipPath: string;
  shapeNameTa: string;
  shapeNameEn: string;
}

/**
 * Five Thinai Worlds Arranged in a Round Mandala with Sovereign Yazhi Core in the Centre:
 * - Center (50%, 52%): Sovereign Yazhi Core
 * - Kurinji (Top, -90°): Mountain Peak element shape
 * - Mullai (Upper-Right, -18°): Forest Leaf element shape
 * - Marutham (Lower-Right, +54°): Delta Diamond element shape
 * - Neytal (Lower-Left, +126°): Ocean Wave Droplet element shape
 * - Palai (Upper-Left, +198°): Nadukal Obelisk element shape
 * Each element retains its own iconic natural shape, positioned in a round circular orbit,
 * connected via celestial orbital rings and radial energy spokes to Yazhi at the center.
 */
const THINAI_BIOMES: ThinaiBiomeData[] = [
  {
    key: "kurinji",
    ta: "குறிஞ்சி",
    en: "Kurinji",
    moodTa: "மலை · முதல் சந்திப்பு",
    moodEn: "Mountains · first meetings",
    bodyTa: "கண்டுபிடிப்பும் புதுமையும் — ஒரு கதை தொடங்கும் இடம். மலை முகடுகள், அருவிகள், 12 ஆண்டுக்கு ஒருமுறை பூக்கும் குறிஞ்சி மலர்.",
    bodyEn: "Curiosity and discovery — where a story starts. Mountain peaks, cascading waterfalls, and the rare 12-year Kurinji bloom.",
    icon: "🏔️",
    color: "#8b7ae0",
    secondaryColor: "#22194d",
    glowColor: "rgba(139, 122, 224, 0.55)",
    landscapeTa: "மலையும் மலை சார்ந்த இடமும்",
    landscapeEn: "Mountains, peaks, waterfalls & springs",
    seasonTa: "கூதிர், முன்பனி · நள்ளிரவு",
    seasonEn: "Late autumn / winter mist · Midnight",
    uriTa: "புணர்தலும் புணர்தல் நிமித்தமும்",
    uriEn: "Union of lovers & wonder of discovery",
    desktopCoords: { x: 50, y: 24 },
    mobileCoords: { x: 50, y: 24 },
    shapeType: "polygon",
    shapePoints: "50,2 96,82 82,98 18,98 4,82",
    shapeClipPath: "polygon(50% 2%, 96% 82%, 82% 98%, 18% 98%, 4% 82%)",
    shapeNameTa: "மலை முகடு",
    shapeNameEn: "Mountain Peak",
  },
  {
    key: "mullai",
    ta: "முல்லை",
    en: "Mullai",
    moodTa: "காடு · காத்திருத்தல்",
    moodEn: "Forest · waiting",
    bodyTa: "விலங்குகள், அமைதி மற்றும் குழந்தைகள் அறிந்த நாட்டுப்புறக் கதைகள். அமைதியான மேய்ச்சல் மரங்கள், மாலை நேரத்து அடுப்பு, மின்மினிப் பூச்சிகள்.",
    bodyEn: "Animals, patience and the folk tales children know. Whispering pastoral trees, twilight hearths, and drifting fireflies.",
    icon: "🌳",
    color: "#4f9d6b",
    secondaryColor: "#133522",
    glowColor: "rgba(79, 157, 107, 0.55)",
    landscapeTa: "காடும் காடு சார்ந்த இடமும்",
    landscapeEn: "Forests, woodlands, meadows & pastures",
    seasonTa: "கார் காலம் · மாலை",
    seasonEn: "Monsoon rainy season · Dusk & twilight",
    uriTa: "இருத்தலும் இருத்தல் நிமித்தமும்",
    uriEn: "Patient waiting & tranquil anticipation",
    desktopCoords: { x: 79.5, y: 43.3 },
    mobileCoords: { x: 84, y: 42.5 },
    shapeType: "path",
    shapePath: "M 50,2 C 84,16 98,44 98,58 C 98,82 78,98 50,98 C 22,98 2,82 2,58 C 2,44 16,16 50,2 Z",
    shapeClipPath: "polygon(50% 2%, 84% 16%, 98% 50%, 84% 84%, 50% 98%, 16% 84%, 2% 50%, 16% 16%)",
    shapeNameTa: "காட்டு இலை",
    shapeNameEn: "Forest Leaf",
  },
  {
    key: "marutham",
    ta: "மருதம்",
    en: "Marutham",
    moodTa: "வயல் · வாழ்வியல்",
    moodEn: "Farmland · everyday life",
    bodyTa: "கணக்கு, உழைப்பு மற்றும் குடும்பம் — பாடங்கள் வாழும் பூமி. வளமான ஆற்றுப் படுகைகள், வயல் வரப்புகள், பொன் தானிய அறுவடை.",
    bodyEn: "Counting, work and family — where lessons live. Fertile river deltas, terraced paddy fields, and golden grain harvest.",
    icon: "🌾",
    color: "#b7a03c",
    secondaryColor: "#45370d",
    glowColor: "rgba(183, 160, 60, 0.55)",
    landscapeTa: "வயலும் வயல் சார்ந்த இடமும்",
    landscapeEn: "Alluvial plains, river basins & paddy fields",
    seasonTa: "ஆறு பருவம் · வைகறை (விடியல்)",
    seasonEn: "All seasons · Early morning dawn",
    uriTa: "ஊடலும் ஊடல் நிமித்தமும்",
    uriEn: "Domestic friction, wit & reconciliation",
    desktopCoords: { x: 68.2, y: 74.7 },
    mobileCoords: { x: 71, y: 72 },
    shapeType: "polygon",
    shapePoints: "50,2 98,50 50,98 2,50",
    shapeClipPath: "polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)",
    shapeNameTa: "மருத வைரம்",
    shapeNameEn: "Delta Diamond",
  },
  {
    key: "neytal",
    ta: "நெய்தல்",
    en: "Neytal",
    moodTa: "கடற்கரை · பிரிவு/ஏக்கம்",
    moodEn: "Coast · longing",
    bodyTa: "பயணங்களும் தொலைவும் — புலம்பெயர்ந்தோரின் நிலப்பரப்பு. கடல் அலைகள், ஒளிரும் கடல் நுரை, தொலைதூரக் கரையின் அழைப்பு.",
    bodyEn: "Voyages and distance — the diaspora's landscape. Oceanic horizons, bioluminescent tides, and the call of far shores.",
    icon: "🌊",
    color: "#4a8ab5",
    secondaryColor: "#10324d",
    glowColor: "rgba(74, 138, 181, 0.55)",
    landscapeTa: "கடலும் கடல் சார்ந்த இடமும்",
    landscapeEn: "Coastal shores, sandy dunes & ocean tides",
    seasonTa: "ஆறு பருவம் · எற்பாடு (பிற்பகல்)",
    seasonEn: "All seasons · Sunset over the waters",
    uriTa: "இரங்கலும் இரங்கல் நிமித்தமும்",
    uriEn: "Longing, separation & remembrance across waters",
    desktopCoords: { x: 31.8, y: 74.7 },
    mobileCoords: { x: 29, y: 72 },
    shapeType: "path",
    shapePath: "M 50,2 C 78,28 98,58 98,72 C 98,88 78,98 50,98 C 22,98 2,88 2,72 C 2,58 22,28 50,2 Z",
    shapeClipPath: "polygon(50% 2%, 84% 28%, 98% 68%, 82% 98%, 18% 98%, 2% 68%, 16% 28%)",
    shapeNameTa: "கடல் துளி",
    shapeNameEn: "Wave Droplet",
  },
  {
    key: "palai",
    ta: "பாலை",
    en: "Palai",
    moodTa: "பாலைவனம் · உறுதி/துணிவு",
    moodEn: "Drylands · endurance",
    bodyTa: "துணிவும் பிரிவும் — வாழ்வின் கடினமான கதைகள். மணல் திட்டுகள், பாறைப் பள்ளத்தாக்குகள், வீரர்களின் அஞ்சா நெஞ்சம்.",
    bodyEn: "Courage and separation — the harder stories. Sun-sculpted sand dunes, canyon rocks, and the traveler's unbreakable fortitude.",
    icon: "🏜️",
    color: "#c25b3c",
    secondaryColor: "#4a190c",
    glowColor: "rgba(194, 91, 60, 0.55)",
    landscapeTa: "மணலும் மணல் சார்ந்த வறண்ட நிலம்",
    landscapeEn: "Arid deserts, sun-baked canyons & hero trails",
    seasonTa: "இளவேனில், முதுவேனில் · நண்பகல்",
    seasonEn: "High summer / drought · Midday blaze",
    uriTa: "பிரிதலும் பிரிதல் நிமித்தமும்",
    uriEn: "Journey through adversity & fearless endurance",
    desktopCoords: { x: 20.5, y: 43.3 },
    mobileCoords: { x: 16, y: 42.5 },
    shapeType: "polygon",
    shapePoints: "28,2 72,2 98,38 82,98 18,98 2,38",
    shapeClipPath: "polygon(28% 2%, 72% 2%, 98% 38%, 82% 98%, 18% 98%, 2% 38%)",
    shapeNameTa: "நடுகல் தூண்",
    shapeNameEn: "Nadukal Obelisk",
  },
];

export function Thinai() {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgAuraRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGSVGElement>(null);
  const worldsRef = useRef<HTMLDivElement>(null);
  const centerCoreRef = useRef<HTMLDivElement>(null);

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Responsive layout detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard accessibility: Escape closes modal/detail view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedKey) {
        setSelectedKey(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedKey]);

  // Center coordinate: Sovereign Yazhi Core in the exact centre of the five round stations
  const centerCoord = useMemo(
    () => (isMobile ? { x: 50, y: 50 } : { x: 50, y: 52 }),
    [isMobile]
  );

  // Audio mute/unmute state tracking
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    setIsAudioMuted(isThinaiAudioMuted());
  }, []);

  const handleToggleAudio = useCallback(() => {
    const muted = toggleThinaiAudio();
    setIsAudioMuted(muted);
    if (!muted) {
      playThinaiSound("core");
    }
  }, []);

  // Active or hovered biome
  const activeBiome = useMemo(
    () => THINAI_BIOMES.find((b) => b.key === (selectedKey || hoveredKey)),
    [selectedKey, hoveredKey]
  );

  const selectedBiome = useMemo(
    () => THINAI_BIOMES.find((b) => b.key === selectedKey),
    [selectedKey]
  );

  // Center core glow color calculation
  const coreAuraColor = useMemo(() => {
    if (activeBiome) return activeBiome.color;
    return "#e3b458"; // default sacred warm gold
  }, [activeBiome]);

  // Handle clicking on the central Yazhi mark: play core harmony & reset focus
  const handleCenterClick = useCallback(() => {
    playThinaiSound("core");
    setSelectedKey(null);
    setHoveredKey(null);
  }, []);

  // Handle clicking a biome: play authentic landscape sound & toggle focus
  const handleBiomeClick = useCallback((key: string) => {
    playThinaiSound(key);
    setSelectedKey((prev) => (prev === key ? null : key));
  }, []);

  // Dynamic Thinai theme synchronization: adapts --accent when exploring biomes
  useEffect(() => {
    const root = document.documentElement;
    if (activeBiome) {
      root.style.setProperty("--accent", activeBiome.color);
    } else if (root.dataset.thinai === "thinai") {
      root.style.setProperty("--accent", "var(--thinai)");
    }
  }, [activeBiome]);

  // High-performance cursor parallax with requestAnimationFrame (zero React state re-renders)
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 24; // Subtle max displacement ~12px
      targetY = y * 18; // Subtle max displacement ~9px
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (bgAuraRef.current) {
        bgAuraRef.current.style.transform = `translate3d(${currentX * 0.25}px, ${currentY * 0.25}px, 0)`;
      }
      if (pathsRef.current) {
        pathsRef.current.style.transform = `translate3d(${currentX * 0.45}px, ${currentY * 0.45}px, 0)`;
      }
      if (worldsRef.current) {
        worldsRef.current.style.transform = `translate3d(${currentX * 0.8}px, ${currentY * 0.8}px, 0)`;
      }
      if (centerCoreRef.current) {
        centerCoreRef.current.style.transform = `translate3d(${currentX * 0.15}px, ${currentY * 0.15}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion, isMobile]);

  // Strict language text calculations
  const headerPillText = lang === "en" ? "THINAI" : "திணை";

  const headerTitle =
    lang === "en"
      ? THINAI_WORLD.titleEn
      : lang === "ta"
        ? THINAI_WORLD.titleTa
        : `${THINAI_WORLD.titleTa} · ${THINAI_WORLD.titleEn}`;

  const headerSubline =
    lang === "en"
      ? "Five Landscapes, One Sovereign Core"
      : lang === "ta"
        ? "ஐந்து நிலங்கள், ஓர் இறையாண்மை மையம்"
        : "Five Landscapes, One Sovereign Core";

  const coreLabel =
    lang === "en"
      ? "Yazhi Core"
      : lang === "ta"
        ? "யாழ் மையம்"
        : "யாழ் மையம் · Core";

  return (
    <section
      id="thinai"
      data-thinai="thinai"
      className="relative mx-auto max-w-[var(--max-w)] h-[100svh] max-h-[100svh] min-h-[100svh] box-border scroll-mt-0 pt-16 sm:pt-18 md:pt-20 pb-2 px-3 sm:px-6 md:px-8 lg:px-10 flex flex-col justify-between select-none overflow-hidden"
    >
      {/* 1. Section Hero: Single-line Thinai Header themed to the five Sangam landscapes */}
      <header className="w-full z-20 relative shrink-0 flex items-center justify-between gap-2 sm:gap-4 pb-2 border-b border-white/10 transition-colors duration-500">
        {/* Left: Thinai Identity & Single-Line Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Five Thinai spectrum indicator pill */}
          <div
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full border border-white/15 bg-[#090d18]/80 backdrop-blur-md transition-all duration-500 shrink-0"
            style={{
              borderColor: activeBiome ? `${activeBiome.color}88` : "rgba(227, 180, 88, 0.4)",
              boxShadow: activeBiome
                ? `0 0 14px ${activeBiome.color}35`
                : "0 0 10px rgba(227, 180, 88, 0.15)",
            }}
          >
            {/* 5 Thinai colored landscape orbit dots */}
            <div className="flex items-center gap-1" aria-hidden>
              {THINAI_BIOMES.map((b) => {
                const isCurrent = activeBiome?.key === b.key;
                return (
                  <span
                    key={`hero-dot-${b.key}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: b.color,
                      width: isCurrent ? "7px" : "4.5px",
                      height: isCurrent ? "7px" : "4.5px",
                      boxShadow: isCurrent ? `0 0 6px ${b.color}` : "none",
                      transform: isCurrent ? "scale(1.2)" : "scale(1)",
                    }}
                    title={lang === "en" ? b.en : b.ta}
                  />
                );
              })}
            </div>
            <span
              className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors duration-300"
              style={{ color: activeBiome ? activeBiome.color : "#d3b36a" }}
            >
              {headerPillText}
            </span>
          </div>

          {/* Unified Single-Line Heading */}
          <h2 className="flex items-center gap-1.5 sm:gap-2.5 font-display tracking-tight min-w-0 truncate leading-none">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-ivory whitespace-nowrap">
              {headerTitle}
            </span>
            <span aria-hidden className="hidden lg:inline text-white/20 text-xs select-none">
              —
            </span>
            <span className="hidden lg:inline text-[10px] xl:text-xs font-mono text-ivory-dim/60 whitespace-nowrap truncate">
              {headerSubline}
            </span>
          </h2>
        </div>

        {/* Right: Thinai Interactive Landscape Controls & Active Status */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {activeBiome ? (
            /* Active Biome Context Pill: strictly respects active language */
            <div
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-mono transition-all duration-300"
              style={{
                borderColor: `${activeBiome.color}88`,
                backgroundColor: `${activeBiome.color}1f`,
                color: activeBiome.color,
                boxShadow: `0 0 12px ${activeBiome.color}33`,
              }}
            >
              <span className="text-xs" aria-hidden>{activeBiome.icon}</span>
              <span className="font-semibold text-ivory">
                {lang === "en" ? activeBiome.en : activeBiome.ta}
              </span>
              {lang === "both" && (
                <span className="hidden sm:inline text-ivory-dim/80">({activeBiome.en})</span>
              )}
              <span className="hidden md:inline text-white/30">·</span>
              <span className="hidden md:inline text-[9px] text-ivory-dim/70 truncate max-w-[140px]">
                {lang === "en" ? activeBiome.landscapeEn : activeBiome.landscapeTa}
              </span>
              <button
                type="button"
                onClick={handleCenterClick}
                className="ml-1 text-[10px] hover:text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                title={lang === "en" ? "Reset focus to Yazhi Core" : "யாழ் மையத்திற்குத் திரும்பு"}
                aria-label={lang === "en" ? "Reset selection" : "தேர்வை மீட்டமை"}
              >
                ✕
              </button>
            </div>
          ) : (
            /* 5 Biome Quick Interactive Landscape Selector */
            <div className="flex items-center gap-1">
              <span className="hidden xl:inline text-[9px] font-mono text-ivory-dim/60 uppercase tracking-wider mr-1">
                {lang === "en" ? "Thinai:" : "ஐந்திணை:"}
              </span>
              {THINAI_BIOMES.map((b) => {
                const isHovered = hoveredKey === b.key;
                return (
                  <button
                    key={`hero-pill-${b.key}`}
                    type="button"
                    onClick={() => handleBiomeClick(b.key)}
                    onMouseEnter={() => setHoveredKey(b.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full border border-white/10 hover:border-white/30 bg-[#090d18]/60 backdrop-blur-sm text-[10px] transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: isHovered ? b.color : "rgba(255, 255, 255, 0.12)",
                      backgroundColor: isHovered ? `${b.color}22` : undefined,
                      boxShadow: isHovered ? `0 0 10px ${b.color}44` : undefined,
                    }}
                    title={
                      lang === "en"
                        ? `${b.en} — ${b.moodEn}`
                        : `${b.ta} — ${b.moodTa}`
                    }
                    aria-label={`View ${b.en} landscape`}
                  >
                    <span className="text-[10px] sm:text-xs" aria-hidden>{b.icon}</span>
                    <span
                      className="hidden sm:inline font-display text-[10px] transition-colors"
                      style={{ color: isHovered ? b.color : "var(--ivory-dim)" }}
                    >
                      {lang === "en" ? b.en : b.ta}
                    </span>
                  </button>
                );
              })}

              {/* Audio Ambient Mute/Unmute Indicator */}
              <button
                type="button"
                onClick={handleToggleAudio}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 hover:border-gold/50 bg-[#090d18]/60 backdrop-blur-sm text-[10px] text-ivory-dim transition-all cursor-pointer ml-0.5"
                title={
                  isAudioMuted
                    ? lang === "en"
                      ? "Unmute Thinai soundscapes"
                      : "ஒலியை இயக்கு"
                    : lang === "en"
                    ? "Mute Thinai soundscapes"
                    : "ஒலியை முடக்கு"
                }
                aria-label={
                  isAudioMuted
                    ? lang === "en"
                      ? "Unmute Thinai soundscapes"
                      : "ஒலியை இயக்கு"
                    : lang === "en"
                    ? "Mute Thinai soundscapes"
                    : "ஒலியை முடக்கு"
                }
              >
                <span aria-hidden>{isAudioMuted ? "🔇" : "🔊"}</span>
                <span className="hidden lg:inline font-mono text-[9px]">
                  {lang === "en"
                    ? isAudioMuted
                      ? "Muted"
                      : "Sound"
                    : isAudioMuted
                    ? "முடக்கம்"
                    : "ஒலி"}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. Interactive Living Thinai Cosmos: 5 stations in a round mandala with Yazhi at centre */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-visible"
        aria-label="Yazhi Living Thinai World"
      >
        {/* Layer A: Ambient Atmospheric Background Glows (Parallax Depth Layer 1) */}
        <div ref={bgAuraRef} className="absolute inset-0 pointer-events-none -z-10 overflow-hidden will-change-transform">
          {/* Central golden core breathing nebula */}
          <div
            className="absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[85px] transition-colors duration-700 pointer-events-none"
            style={{
              width: isMobile ? "220px" : "340px",
              height: isMobile ? "220px" : "340px",
              backgroundColor: `${coreAuraColor}22`,
            }}
          />

          {/* Biome atmospheric ambient halos */}
          {THINAI_BIOMES.map((b) => {
            const pos = isMobile ? b.mobileCoords : b.desktopCoords;
            const isTarget = hoveredKey === b.key || selectedKey === b.key;
            return (
              <div
                key={`halo-${b.key}`}
                className="absolute rounded-full blur-[65px] transition-all duration-700 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: isTarget ? (isMobile ? "180px" : "260px") : (isMobile ? "110px" : "160px"),
                  height: isTarget ? (isMobile ? "180px" : "260px") : (isMobile ? "110px" : "160px"),
                  backgroundColor: isTarget ? `${b.color}45` : `${b.color}1c`,
                }}
              />
            );
          })}
        </div>

        {/* Layer B: Radiant Flowing Bezier Streams Connecting Yazhi Core to 5 Stations */}
        <svg
          ref={pathsRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 will-change-transform"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <filter id="glow-energy-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="0.9" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {THINAI_BIOMES.map((b) => (
              <linearGradient
                key={`stream-grad-${b.key}`}
                id={`stream-grad-${b.key}`}
                x1={`${centerCoord.x}%`}
                y1={`${centerCoord.y}%`}
                x2={`${(isMobile ? b.mobileCoords : b.desktopCoords).x}%`}
                y2={`${(isMobile ? b.mobileCoords : b.desktopCoords).y}%`}
              >
                <stop offset="0%" stopColor="#e3b458" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#f8f5ef" stopOpacity="0.6" />
                <stop offset="100%" stopColor={b.color} stopOpacity="0.9" />
              </linearGradient>
            ))}
          </defs>

          {/* 1. Sacred Celestial Mandala Orbital Ring connecting the 5 round stations */}
          <ellipse
            cx={centerCoord.x}
            cy={centerCoord.y}
            rx={isMobile ? 36 : 31}
            ry={isMobile ? 26 : 28}
            fill="none"
            stroke="rgba(227, 180, 88, 0.22)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            className={prefersReducedMotion ? "" : "animate-spin-celestial"}
            style={{
              transformOrigin: `${centerCoord.x}% ${centerCoord.y}%`,
            }}
          />
          <ellipse
            cx={centerCoord.x}
            cy={centerCoord.y}
            rx={isMobile ? 36 : 31}
            ry={isMobile ? 26 : 28}
            fill="none"
            stroke="rgba(248, 245, 239, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="1 10"
            style={{
              filter: "drop-shadow(0 0 8px rgba(227, 180, 88, 0.35))",
            }}
          />
          {/* Subtle outer cosmic guide ring */}
          <ellipse
            cx={centerCoord.x}
            cy={centerCoord.y}
            rx={isMobile ? 39 : 34}
            ry={isMobile ? 28.5 : 30.5}
            fill="none"
            stroke="rgba(227, 180, 88, 0.08)"
            strokeWidth="0.3"
            strokeDasharray="2 8"
          />

          {/* 2. Radial Energy Conduits from Central Yazhi to Each Station */}
          {THINAI_BIOMES.map((b) => {
            const dest = isMobile ? b.mobileCoords : b.desktopCoords;
            const cx = centerCoord.x;
            const cy = centerCoord.y;

            const pathData = `M ${cx} ${cy} L ${dest.x} ${dest.y}`;

            const isHovered = hoveredKey === b.key;
            const isSelected = selectedKey === b.key;
            const isActive = isHovered || isSelected;

            return (
              <g key={`path-group-${b.key}`}>
                {/* Soft ambient guide spoke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isActive ? b.color : "rgba(227, 180, 88, 0.2)"}
                  strokeWidth={isActive ? "0.9" : "0.35"}
                  strokeOpacity={isActive ? "0.9" : "0.3"}
                  className="transition-all duration-500"
                />

                {/* Flowing soft energy thread */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={`url(#stream-grad-${b.key})`}
                  strokeWidth={isActive ? "1.2" : "0.55"}
                  strokeDasharray={isActive ? "3 5" : "2 6"}
                  className="thinai-energy-flow"
                  style={{
                    filter: isActive ? "url(#glow-energy-soft)" : "none",
                    opacity: isActive ? 1 : 0.45,
                  }}
                />

                {/* Traveling Light Pulse Particle outward from Yazhi Core to station */}
                {!prefersReducedMotion && (
                  <circle
                    r={isActive ? "1" : "0.6"}
                    fill={isActive ? "#ffffff" : "#f8f5ef"}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 3px ${b.color})` : "none",
                    }}
                  >
                    <animateMotion
                      dur={isActive ? "2.2s" : "4s"}
                      repeatCount="indefinite"
                      path={pathData}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Layer C: Central Sovereign Yazhi Core (In the Centre of the 5 Stations) */}
        <div
          ref={centerCoreRef}
          className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group will-change-transform"
          style={{
            left: `${centerCoord.x}%`,
            top: `${centerCoord.y}%`,
          }}
          onClick={handleCenterClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleCenterClick();
          }}
          aria-label={
            lang === "en"
              ? "Central Yazhi Core — click to reset focus"
              : "மைய யாழ் திருமுத்திரை — பார்வையை மீட்டமைக்க அழுத்தவும்"
          }
          title={lang === "en" ? "Click to reset world focus" : "பார்வையை மீட்டமைக்க அழுத்தவும்"}
        >
          {/* Concentric Rotating Sacred Rings & Halo */}
          <div className="relative flex items-center justify-center">
            {/* Outer Sacred Cardinal Energy Ring with 4 Coordinates */}
            <div
              className={`absolute rounded-full border pointer-events-none transition-all duration-700 thinai-core-ring-outer ${
                prefersReducedMotion ? "" : "animate-spin-celestial"
              }`}
              style={{
                borderColor: `${coreAuraColor}35`,
              }}
            >
              {/* Cardinal Orbit Marks */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/70" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/70" />
              <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/70" />
              <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/70" />
            </div>

            {/* Middle Dashed Ring (Counter-rotating) */}
            <div
              className={`absolute rounded-full border border-dashed pointer-events-none transition-all duration-700 thinai-core-ring-mid ${
                prefersReducedMotion ? "" : "animate-reverse-celestial"
              }`}
              style={{
                borderColor: `${coreAuraColor}28`,
              }}
            />

            {/* Orbiting Sacred Sparks */}
            {!prefersReducedMotion && (
              <div className="absolute pointer-events-none animate-orbit-fast thinai-core-ring-mid">
                <div
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#d3b36a]"
                  style={{ backgroundColor: coreAuraColor }}
                />
              </div>
            )}

            {/* Inner Core Sacred Portal Disc */}
            <div
              className="relative rounded-full flex items-center justify-center p-1.5 sm:p-2 backdrop-blur-xl transition-all duration-500 group-hover:scale-105 thinai-core-disc"
              style={{
                background: `radial-gradient(circle at 35% 35%, rgba(24, 20, 14, 0.98) 0%, rgba(8, 10, 18, 0.99) 100%)`,
                border: `1.5px solid ${coreAuraColor}`,
                boxShadow: `0 0 24px ${coreAuraColor}55, inset 0 0 12px ${coreAuraColor}33`,
              }}
            >
              {/* Central Three-Dot Logo Mark */}
              <LogoMark
                size={isMobile ? 20 : 26}
                className="relative z-10 drop-shadow-[0_0_10px_rgba(248,245,239,0.85)]"
              />
            </div>
          </div>

          {/* Core Sacred Indicator Label */}
          <div className="mt-1 text-center pointer-events-none">
            <span
              key={`core-label-${lang}`}
              className="px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[9px] tracking-wider uppercase border border-gold/30 bg-black/60 backdrop-blur-md transition-all duration-300 bi-fade-in inline-block"
              style={{ color: coreAuraColor }}
            >
              {coreLabel}
            </span>
          </div>
        </div>

        {/* Layer D: Five Equally Spaced Worlds — Each With Its Own Iconic Natural Element Shape */}
        <div ref={worldsRef} className="absolute inset-0 pointer-events-none z-10 will-change-transform">
          {THINAI_BIOMES.map((b) => {
            const coords = isMobile ? b.mobileCoords : b.desktopCoords;
            const isSelected = selectedKey === b.key;
            const isHovered = hoveredKey === b.key;
            const isDimmed = (selectedKey && !isSelected) || (hoveredKey && !isHovered && !selectedKey);

            return (
              <div
                key={b.key}
                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-500 z-10 ${
                  isSelected
                    ? "z-30 scale-110 sm:scale-115"
                    : isHovered
                    ? "z-20 scale-105 sm:scale-108"
                    : "scale-100"
                }`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  opacity: isDimmed ? 0.35 : 1,
                  filter: isDimmed ? "saturate(60%)" : "none",
                }}
                onMouseEnter={() => setHoveredKey(b.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div className="relative flex flex-col items-center">
                  {/* Living Landscape World in its OWN Iconic Natural Element Shape */}
                  <button
                    type="button"
                    onClick={() => handleBiomeClick(b.key)}
                    className="relative group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-500"
                    style={{
                      filter: isSelected
                        ? `drop-shadow(0 0 24px ${b.color}) drop-shadow(0 0 45px ${b.color}88)`
                        : isHovered
                        ? `drop-shadow(0 0 18px ${b.color}cc) drop-shadow(0 0 30px ${b.color}55)`
                        : `drop-shadow(0 8px 18px rgba(0,0,0,0.8)) drop-shadow(0 0 10px ${b.color}35)`,
                    }}
                    aria-label={
                      lang === "en"
                        ? `Explore ${b.en} (${b.shapeNameEn}) living landscape`
                        : `ஆராய்க: ${b.ta} (${b.shapeNameTa}) நிலப்பரப்பு`
                    }
                    aria-expanded={isSelected}
                  >
                    {/* SVG Container holding the element's unique shape, clipped living landscape, and glowing border */}
                    <svg
                      viewBox="0 0 100 100"
                      className="thinai-disc-lens relative overflow-visible transition-transform duration-500 group-hover:scale-105"
                    >
                      <defs>
                        {/* Unique Element Vector Clip Path */}
                        <clipPath id={`element-shape-${b.key}`}>
                          {b.shapeType === "polygon" ? (
                            <polygon points={b.shapePoints} />
                          ) : (
                            <path d={b.shapePath} />
                          )}
                        </clipPath>
                        <linearGradient id={`shape-bg-${b.key}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#090d18" />
                          <stop offset="100%" stopColor={b.secondaryColor} />
                        </linearGradient>
                        <linearGradient id={`shape-sheen-${b.key}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* 1. Base Element Fill & Clipped Living Procedural Landscape Artwork */}
                      <g clipPath={`url(#element-shape-${b.key})`}>
                        {/* Background tint */}
                        <rect width="100" height="100" fill={`url(#shape-bg-${b.key})`} />

                        {/* Procedural Living Miniature Landscape Artwork */}
                        {b.key === "kurinji" && (
                          <KurinjiLandscapeSVG isHovered={isHovered || isSelected} isSelected={isSelected} />
                        )}
                        {b.key === "mullai" && (
                          <MullaiLandscapeSVG isHovered={isHovered || isSelected} isSelected={isSelected} />
                        )}
                        {b.key === "marutham" && (
                          <MaruthamLandscapeSVG isHovered={isHovered || isSelected} isSelected={isSelected} />
                        )}
                        {b.key === "neytal" && (
                          <NeytalLandscapeSVG isHovered={isHovered || isSelected} isSelected={isSelected} />
                        )}
                        {b.key === "palai" && (
                          <PalaiLandscapeSVG isHovered={isHovered || isSelected} isSelected={isSelected} />
                        )}

                        {/* Optical Glass Reflection Highlight */}
                        <rect width="100" height="100" fill={`url(#shape-sheen-${b.key})`} pointerEvents="none" />
                      </g>

                      {/* 2. Outer Glowing Silhouette Border Trace Matching Element Geometry */}
                      {b.shapeType === "polygon" ? (
                        <polygon
                          points={b.shapePoints}
                          fill="none"
                          stroke={isSelected ? "#ffffff" : isHovered ? b.color : `${b.color}d0`}
                          strokeWidth={isSelected ? "2.6" : isHovered ? "2.2" : "1.6"}
                          className="transition-all duration-300"
                          style={{
                            filter: isSelected ? `drop-shadow(0 0 6px ${b.color})` : "none",
                          }}
                        />
                      ) : (
                        <path
                          d={b.shapePath}
                          fill="none"
                          stroke={isSelected ? "#ffffff" : isHovered ? b.color : `${b.color}d0`}
                          strokeWidth={isSelected ? "2.6" : isHovered ? "2.2" : "1.6"}
                          className="transition-all duration-300"
                          style={{
                            filter: isSelected ? `drop-shadow(0 0 6px ${b.color})` : "none",
                          }}
                        />
                      )}
                    </svg>
                  </button>

                  {/* Contextual Floating Glass Label: Strictly adheres to active language mode */}
                  <div
                    onClick={() => handleBiomeClick(b.key)}
                    className={`mt-1.5 flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full cursor-pointer border backdrop-blur-xl transition-all duration-300 animate-float ${
                      isSelected
                        ? "bg-[#0b0f1e]/95 border-gold shadow-[0_0_16px_rgba(227,180,88,0.5)]"
                        : isHovered
                        ? "bg-[#0b0f1e]/90 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        : "bg-[#080b16]/80 border-white/15 hover:border-white/30"
                    }`}
                    style={{
                      borderLeftColor: b.color,
                      borderLeftWidth: "2.5px",
                      animationDelay: `${THINAI_BIOMES.indexOf(b) * 0.4}s`,
                    }}
                  >
                    <span className="text-[9px] sm:text-xs" aria-hidden>{b.icon}</span>
                    <div key={`st-label-${b.key}-${lang}`} className="flex flex-col text-left leading-none bi-fade-in">
                      <span className="font-display font-semibold text-ivory text-[9px] sm:text-[10.5px]">
                        {lang === "en" ? b.en : lang === "ta" ? b.ta : `${b.ta} · ${b.en}`}
                      </span>
                      <span className="font-mono text-[7px] sm:text-[8px] text-ivory-dim/80 mt-0.5 whitespace-nowrap">
                        {lang === "en"
                          ? b.moodEn.split("·")[0].trim()
                          : b.moodTa.split("·")[0].trim()}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer E: Cinematic Selected Biome Information Panel (Framer Motion) */}
        <AnimatePresence>
          {selectedBiome && (
            <>
              {/* Dimmed atmospheric backdrop inside section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedKey(null)}
                className="absolute inset-0 bg-black/65 backdrop-blur-sm z-30 cursor-pointer"
              />

              {/* Centered Celestial Glass Lore Tablet: Strictly respects active language mode */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[520px] md:w-[580px] max-h-[82vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#090d18]/95 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl"
                style={{
                  boxShadow: `0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 32px ${selectedBiome.color}55`,
                  borderTopColor: selectedBiome.color,
                  borderTopWidth: "3px",
                }}
              >
                {/* Header Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-3xl p-2 rounded-xl bg-white/[0.04] border border-white/10"
                      aria-hidden
                    >
                      {selectedBiome.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-ivory">
                          {lang === "en" ? selectedBiome.en : selectedBiome.ta}
                        </h3>
                        {lang === "both" && (
                          <span className="font-display text-sm font-medium text-ivory-dim">
                            ({selectedBiome.en})
                          </span>
                        )}
                        <span
                          className="px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${selectedBiome.color}22`,
                            color: selectedBiome.color,
                            border: `1px solid ${selectedBiome.color}55`,
                          }}
                        >
                          {lang === "en" ? selectedBiome.moodEn : selectedBiome.moodTa}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-ivory-dim/75 font-mono mt-0.5">
                        {lang === "en"
                          ? selectedBiome.landscapeEn
                          : lang === "ta"
                            ? selectedBiome.landscapeTa
                            : `${selectedBiome.landscapeTa} · ${selectedBiome.landscapeEn}`}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedKey(null)}
                    className="rounded-full w-8 h-8 flex items-center justify-center text-ivory-dim hover:text-ivory bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-sm"
                    aria-label={lang === "en" ? "Close landscape view" : "நிலப்பரப்புக் காட்சியை மூடுக"}
                  >
                    ✕
                  </button>
                </div>

                {/* Sangam Lore & Core Yazh Integration */}
                <div className="mt-3.5 grid gap-3 sm:grid-cols-2 text-xs">
                  {/* Left: Core Story Role */}
                  <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[color:var(--accent)] font-semibold">
                        {lang === "en"
                          ? "Story World"
                          : lang === "ta"
                            ? "யாழின் கதைக் களம்"
                            : "யாழின் கதைக் களம் · Story World"}
                      </span>
                      <p className="mt-1.5 text-ivory/90 leading-relaxed text-xs">
                        {lang === "en" ? selectedBiome.bodyEn : selectedBiome.bodyTa}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-ivory-dim/60">
                      <span>{lang === "en" ? "Theme:" : "உரிப்பொருள்:"}</span>
                      <span className="text-ivory/80 font-medium">
                        {lang === "en" ? selectedBiome.uriEn : selectedBiome.uriTa}
                      </span>
                    </div>
                  </div>

                  {/* Right: Sangam Coordinates */}
                  <div className="rounded-xl bg-white/[0.03] p-3 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-gold font-semibold">
                        {lang === "en"
                          ? "Season & Time"
                          : lang === "ta"
                            ? "சங்க இலக்கியக் கூறு"
                            : "சங்க இலக்கியக் கூறு · Season & Time"}
                      </span>
                      <p className="mt-1.5 text-ivory/80 text-xs">
                        {lang === "en" ? selectedBiome.seasonEn : selectedBiome.seasonTa}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-ivory-dim/60">
                      <span>{lang === "en" ? "Emotion:" : "உணர்ச்சி:"}</span>
                      <span className="text-ivory/80">
                        {lang === "en" ? selectedBiome.uriEn : selectedBiome.uriTa}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Hint & Replay Sound Button */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/10 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => playThinaiSound(selectedBiome.key)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/40 bg-gold/15 text-gold hover:bg-gold/25 transition-all cursor-pointer"
                    title={lang === "en" ? "Play landscape soundscape" : "நிலத்தின் ஒலியை மீண்டும் கேட்க"}
                  >
                    <span>🔊</span>
                    <span>{lang === "en" ? "Play Soundscape" : "ஒலி கேட்க"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedKey(null)}
                    className="px-3 py-1 rounded-full text-ivory bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {lang === "en" ? "Return to Cosmos" : "முழு உலகம்"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Footnote & Cultural Grounding: Strictly adheres to active language mode */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="shrink-0 flex items-center justify-between gap-3 border-t border-white/10 pt-1 pb-1 z-10 pr-24 sm:pr-32 md:pr-40"
      >
        <p className="text-[9px] sm:text-[10px] text-ivory-dim/75 truncate max-w-md lg:max-w-xl leading-normal">
          {lang === "en"
            ? THINAI_WORLD.footEn
            : THINAI_WORLD.footTa}
        </p>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] text-ivory-dim/60 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full border border-gold/40 bg-gold/20" />
          <span>
            {lang === "en"
              ? "Interactive Sangam Biomes"
              : lang === "ta"
                ? "ஊடாடும் சங்க நிலங்கள்"
                : "ஊடாடும் சங்க நிலங்கள் · Interactive Biomes"}
          </span>
        </div>
      </motion.div>

      {/* Embedded High-Performance Living World & Celestial CSS Animations */}
      <style jsx global>{`
        @keyframes spinCelestial {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes reverseCelestial {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes orbitFast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes energyFlow {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes mistDrift {
          0% {
            transform: translateX(-15%);
            opacity: 0.35;
          }
          50% {
            opacity: 0.75;
          }
          100% {
            transform: translateX(15%);
            opacity: 0.35;
          }
        }
        @keyframes mistDriftReverse {
          0% {
            transform: translateX(12%);
            opacity: 0.3;
          }
          50% {
            opacity: 0.65;
          }
          100% {
            transform: translateX(-12%);
            opacity: 0.3;
          }
        }
        @keyframes fireflyPulse1 {
          0%, 100% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0.3;
          }
          40% {
            transform: translate(4px, -6px) scale(1.3);
            opacity: 1;
          }
          75% {
            transform: translate(-3px, -8px) scale(0.9);
            opacity: 0.5;
          }
        }
        @keyframes fireflyPulse2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-6px, 5px) scale(0.6);
            opacity: 0.2;
          }
          85% {
            transform: translate(5px, -4px) scale(1.4);
            opacity: 1;
          }
        }
        @keyframes beaconSweep {
          0% {
            transform: rotate(-24deg);
            opacity: 0.25;
          }
          50% {
            transform: rotate(20deg);
            opacity: 0.6;
          }
          100% {
            transform: rotate(-24deg);
            opacity: 0.25;
          }
        }
        @keyframes waterShimmer {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes labelFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-spin-celestial {
          animation: spinCelestial 60s linear infinite;
        }
        .animate-reverse-celestial {
          animation: reverseCelestial 45s linear infinite;
        }
        .animate-orbit-fast {
          animation: orbitFast 12s linear infinite;
        }
        .thinai-energy-flow {
          animation: energyFlow 2.8s linear infinite;
        }
        .animate-mist {
          animation: mistDrift 14s ease-in-out infinite alternate;
        }
        .animate-mist-rev {
          animation: mistDriftReverse 18s ease-in-out infinite alternate;
        }
        .animate-firefly-a {
          animation: fireflyPulse1 3.5s ease-in-out infinite;
        }
        .animate-firefly-b {
          animation: fireflyPulse2 4.2s ease-in-out infinite;
        }
        .animate-beacon-cone {
          animation: beaconSweep 8s ease-in-out infinite alternate;
          transform-origin: 20px 45px;
        }
        .animate-water-shimmer {
          animation: waterShimmer 3s linear infinite;
        }
        .animate-float {
          animation: labelFloat 4s ease-in-out infinite;
        }
        .thinai-disc-lens {
          width: clamp(52px, min(11.5vw, 13vh), 108px);
          height: clamp(52px, min(11.5vw, 13vh), 108px);
        }
        @media (max-width: 640px) {
          .thinai-disc-lens {
            width: clamp(46px, 14.5vw, 62px);
            height: clamp(46px, 14.5vw, 62px);
          }
        }
        @media (max-height: 720px) {
          .thinai-disc-lens {
            width: clamp(48px, 12vh, 84px);
            height: clamp(48px, 12vh, 84px);
          }
        }
        .thinai-core-disc {
          width: clamp(42px, min(7.5vw, 8vh), 60px);
          height: clamp(42px, min(7.5vw, 8vh), 60px);
        }
        .thinai-core-ring-outer {
          width: clamp(66px, min(11vw, 12vh), 86px);
          height: clamp(66px, min(11vw, 12vh), 86px);
        }
        .thinai-core-ring-mid {
          width: clamp(52px, min(9vw, 10vh), 70px);
          height: clamp(52px, min(9vw, 10vh), 70px);
        }
      `}</style>
    </section>
  );
}

/* =========================================================================
   INDIVIDUAL PROCEDURAL LIVING MINIATURE LANDSCAPE ARTWORKS
   Authentic Sangam scenery with rich depth, animated elements, and distinct
   environmental cues for each of the five landscapes.
   ========================================================================= */

/**
 * 1. KURINJI (Mountain World)
 * - Layered mountain ridges (4 depth tiers)
 * - Shimmering cascading waterfall down ravine
 * - Drifting mountain mist layers
 * - Starry celestial midnight sky with crescent moon
 * - Clusters of violet Kurinji blooms
 */
function KurinjiLandscapeSVG({
  isHovered,
  isSelected,
}: {
  isHovered: boolean;
  isSelected: boolean;
}) {
  const active = isHovered || isSelected;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="kj-sky" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#0d0b24" />
          <stop offset="60%" stopColor="#1e1645" />
          <stop offset="100%" stopColor="#2c225a" />
        </linearGradient>
        <linearGradient id="kj-peak-distant" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#3d2f6f" />
          <stop offset="100%" stopColor="#161230" />
        </linearGradient>
        <linearGradient id="kj-peak-mid" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#554199" />
          <stop offset="100%" stopColor="#1f1842" />
        </linearGradient>
        <linearGradient id="kj-peak-fore" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#755dc4" />
          <stop offset="100%" stopColor="#100d26" />
        </linearGradient>
        <linearGradient id="kj-waterfall-grad" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#e8f3ff" />
          <stop offset="50%" stopColor="#9ec0ff" />
          <stop offset="100%" stopColor="#8b7ae0" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="100" height="100" fill="url(#kj-sky)" />

      {/* Mountain Stars & Crescent Moon */}
      <circle cx="78" cy="20" r="5" fill="#f8f5ef" opacity={active ? 0.95 : 0.75} />
      <circle cx="80.5" cy="19" r="4.2" fill="#151136" />
      <circle cx="26" cy="18" r="0.8" fill="#f8f5ef" opacity="0.85" />
      <circle cx="42" cy="14" r="0.7" fill="#f8f5ef" opacity="0.7" />
      <circle cx="62" cy="12" r="0.9" fill="#f8f5ef" opacity="0.8" />

      {/* Layer 1: Distant mountain ridge */}
      <path d="M-5 72 L22 34 L48 64 L68 40 L105 78 L105 105 L-5 105 Z" fill="url(#kj-peak-distant)" />

      {/* Drifting background mist layer */}
      <path
        d="M-10 60 Q25 50 60 58 Q85 64 110 56 L110 68 Q75 74 35 66 L-10 70 Z"
        fill="#9b8fe0"
        opacity={active ? 0.35 : 0.22}
        className="animate-mist"
      />

      {/* Layer 2: Mid-ground rugged crags */}
      <path d="M10 105 L35 44 L58 78 L80 50 L108 105 Z" fill="url(#kj-peak-mid)" />

      {/* Layer 3: Foreground steep cliff face */}
      <path d="M-5 105 L18 62 L42 88 L52 105 Z" fill="url(#kj-peak-fore)" />
      <path d="M68 105 L86 68 L108 105 Z" fill="url(#kj-peak-fore)" />

      {/* Shimmering Animated Waterfall cascading down central ravine */}
      <path
        d="M35 46 Q34 62 37 76 Q35 88 38 105"
        stroke="url(#kj-waterfall-grad)"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 2"
        className="animate-water-shimmer"
        opacity={active ? 1 : 0.85}
      />
      {/* Waterfall spray pool mist */}
      <ellipse
        cx="38"
        cy="96"
        rx="9"
        ry="3.5"
        fill="#d2e3ff"
        opacity={active ? 0.6 : 0.35}
        className="blur-[1px]"
      />

      {/* Drifting foreground mist band */}
      <path
        d="M-5 82 Q35 74 75 80 Q95 85 105 78 L105 87 Q65 92 20 86 Z"
        fill="#b8b0f0"
        opacity={active ? 0.4 : 0.25}
        className="animate-mist-rev"
      />

      {/* Neelakurinji Violet Flower Blooms dotting the crags */}
      <circle cx="22" cy="78" r="1.4" fill="#d2aeff" />
      <circle cx="26" cy="82" r="1.2" fill="#b98aff" />
      <circle cx="74" cy="84" r="1.5" fill="#d2aeff" />
      <circle cx="78" cy="89" r="1.3" fill="#b98aff" />
      <circle cx="50" cy="92" r="1.3" fill="#d2aeff" />
    </svg>
  );
}

/**
 * 2. MULLAI (Pastoral Forest World)
 * - Layered woodland canopies
 * - Ancient banyan & teak trees
 * - Drifting animated golden-emerald fireflies
 * - Twilight hearth glow in clearing
 */
function MullaiLandscapeSVG({
  isHovered,
  isSelected,
}: {
  isHovered: boolean;
  isSelected: boolean;
}) {
  const active = isHovered || isSelected;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="ml-sky" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#0a1d13" />
          <stop offset="60%" stopColor="#153b27" />
          <stop offset="100%" stopColor="#255a3d" />
        </linearGradient>
        <linearGradient id="ml-tree-distant" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#1f4e34" />
          <stop offset="100%" stopColor="#0b1e14" />
        </linearGradient>
        <linearGradient id="ml-tree-mid" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#337851" />
          <stop offset="100%" stopColor="#0e261a" />
        </linearGradient>
        <linearGradient id="ml-tree-fore" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#4c9c69" />
          <stop offset="100%" stopColor="#08160f" />
        </linearGradient>
      </defs>

      {/* Twilight emerald forest sky */}
      <rect width="100" height="100" fill="url(#ml-sky)" />

      {/* Layer 1: Background forest canopy silhouette */}
      <path
        d="M-5 105 L-5 65 Q15 48 35 62 Q55 42 75 60 Q90 50 105 66 L105 105 Z"
        fill="url(#ml-tree-distant)"
      />

      {/* Layer 2: Mid-ground woodland trees */}
      <path
        d="M-5 105 L-5 78 Q20 58 45 74 Q70 54 95 72 L105 80 L105 105 Z"
        fill="url(#ml-tree-mid)"
      />

      {/* Pastoral clearing hearth / shepherd cottage warm glow */}
      <circle cx="50" cy="84" r="8" fill="#ffb443" opacity={active ? 0.5 : 0.3} className="blur-[3px]" />
      <circle cx="50" cy="84" r="2.5" fill="#ffe082" opacity="0.9" />

      {/* Layer 3: Foreground magnificent banyan & teak trunks */}
      <path
        d="M8 105 Q12 74 7 58 Q-4 38 20 34 Q36 30 44 52 Q48 76 50 105 Z"
        fill="url(#ml-tree-fore)"
      />
      <path
        d="M58 105 Q62 74 68 56 Q55 36 78 28 Q98 26 96 48 Q94 74 96 105 Z"
        fill="url(#ml-tree-fore)"
      />

      {/* Foreground hanging lianas & moss roots */}
      <path d="M24 45 Q26 62 25 78" stroke="#255a3d" strokeWidth="1.2" fill="none" />
      <path d="M78 40 Q76 58 79 74" stroke="#255a3d" strokeWidth="1.2" fill="none" />

      {/* Animated Golden & Emerald Fireflies */}
      <g className="animate-firefly-a">
        <circle
          cx="34"
          cy="48"
          r="2"
          fill="#c6ff70"
          style={{ filter: "drop-shadow(0 0 4px #b8ff4f)" }}
        />
        <circle cx="68" cy="62" r="1.6" fill="#afff5c" />
      </g>
      <g className="animate-firefly-b">
        <circle
          cx="72"
          cy="42"
          r="1.8"
          fill="#ffea78"
          style={{ filter: "drop-shadow(0 0 4px #ffd94f)" }}
        />
        <circle cx="28" cy="74" r="1.4" fill="#afff5c" />
        <circle cx="54" cy="56" r="1.5" fill="#c6ff70" />
      </g>
    </svg>
  );
}

/**
 * 3. MARUTHAM (Alluvial Farmland World)
 * - Terraced emerald & golden paddy fields
 * - Shimmering river irrigation canals reflecting dawn
 * - Village granary (Kalanjiyam) & palmyra palms
 * - Morning sun with golden grain shimmer
 */
function MaruthamLandscapeSVG({
  isHovered,
  isSelected,
}: {
  isHovered: boolean;
  isSelected: boolean;
}) {
  const active = isHovered || isSelected;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="mr-sky" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#2c220a" />
          <stop offset="50%" stopColor="#574312" />
          <stop offset="100%" stopColor="#82661d" />
        </linearGradient>
        <linearGradient id="mr-paddy-far" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#7a671d" />
          <stop offset="100%" stopColor="#2c2409" />
        </linearGradient>
        <linearGradient id="mr-paddy-mid" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#a38927" />
          <stop offset="100%" stopColor="#3d320c" />
        </linearGradient>
        <linearGradient id="mr-paddy-near" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#c7a835" />
          <stop offset="100%" stopColor="#4f4010" />
        </linearGradient>
        <linearGradient id="mr-water" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#ffe699" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffd466" />
        </linearGradient>
      </defs>

      {/* Golden dawn sky */}
      <rect width="100" height="100" fill="url(#mr-sky)" />

      {/* Radiating Morning Sun Disk */}
      <circle cx="50" cy="28" r="14" fill="#ffd778" opacity={active ? 0.9 : 0.7} />
      <circle cx="50" cy="28" r="24" fill="#ffd778" opacity={active ? 0.35 : 0.2} className="blur-[4px]" />

      {/* Palmyra Palm Tree Silhouettes along the horizon */}
      <path d="M18 52 L19 40 M19 40 L16 37 M19 40 L22 37 M19 40 L17 42 M19 40 L21 42" stroke="#261e06" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M84 48 L85 36 M85 36 L82 33 M85 36 L88 33 M85 36 L83 38 M85 36 L87 38" stroke="#261e06" strokeWidth="1.2" strokeLinecap="round" />

      {/* Layer 1: Terraced Farmland Bunds */}
      <path d="M-5 56 Q45 46 105 54 L105 105 L-5 105 Z" fill="url(#mr-paddy-far)" />

      {/* Canal 1: Sinuous irrigation stream */}
      <path
        d="M8 60 Q48 52 96 61"
        stroke="url(#mr-water)"
        strokeWidth="2.2"
        fill="none"
        strokeDasharray="4 2"
        className="animate-water-shimmer"
        opacity={active ? 0.95 : 0.75}
      />

      {/* Layer 2: Mid-ground ripe paddy field */}
      <path d="M-5 70 Q52 60 105 72 L105 105 L-5 105 Z" fill="url(#mr-paddy-mid)" />

      {/* Canal 2: Main river delta feeder channel */}
      <path
        d="M-2 80 Q48 70 105 81"
        stroke="url(#mr-water)"
        strokeWidth="2.6"
        fill="none"
        strokeDasharray="5 2"
        className="animate-water-shimmer"
        opacity={active ? 1 : 0.85}
      />

      {/* Layer 3: Foreground golden harvest field */}
      <path d="M-5 88 Q45 78 105 89 L105 105 L-5 105 Z" fill="url(#mr-paddy-near)" />

      {/* Traditional Thatched Granary (Kalanjiyam) */}
      <path d="M68 60 L78 50 L88 60 Z" fill="#241a06" />
      <rect x="71" y="60" width="14" height="8" fill="#181103" />

      {/* Golden wheat / rice chaff sparkles */}
      <circle cx="32" cy="74" r="1.2" fill="#fff5cc" />
      <circle cx="58" cy="85" r="1.4" fill="#fff5cc" />
      <circle cx="82" cy="92" r="1.3" fill="#fff5cc" />
    </svg>
  );
}

/**
 * 4. NEYTAL (Ocean Shoreline & Coastal World)
 * - Multi-tiered rolling ocean breakers & wave crests
 * - Sweeping coastal beacon lighthouse
 * - Bioluminescent cyan foam sparks
 * - Coastal sands & ocean horizon
 */
function NeytalLandscapeSVG({
  isHovered,
  isSelected,
}: {
  isHovered: boolean;
  isSelected: boolean;
}) {
  const active = isHovered || isSelected;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="nt-sky" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#081726" />
          <stop offset="60%" stopColor="#153856" />
          <stop offset="100%" stopColor="#255a82" />
        </linearGradient>
        <linearGradient id="nt-sea-far" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#20537d" />
          <stop offset="100%" stopColor="#0b2033" />
        </linearGradient>
        <linearGradient id="nt-sea-near" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#307aa8" />
          <stop offset="100%" stopColor="#091b2c" />
        </linearGradient>
        <linearGradient id="nt-beacon-beam" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#e0f5ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7ad3ff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Marine horizon sky */}
      <rect width="100" height="100" fill="url(#nt-sky)" />

      {/* Coastal lighthouse beacon tower on headland */}
      <path d="M17 56 L20 38 L23 56 Z" fill="#091824" />
      <circle cx="20" cy="38" r="2.5" fill="#f0fbff" />

      {/* Sweeping animated beacon light beam */}
      <g className="animate-beacon-cone">
        <path d="M20 38 L95 18 L95 48 Z" fill="url(#nt-beacon-beam)" />
      </g>

      {/* Distant catamaran sail silhouette */}
      <path d="M68 50 L72 44 L72 50 Z" fill="#0c2336" />
      <line x1="66" y1="51" x2="74" y2="51" stroke="#0c2336" strokeWidth="1" />

      {/* Ocean Swell Layer 1 */}
      <path
        d="M-5 56 C20 52, 30 60, 55 54 C80 48, 90 58, 105 55 L105 105 L-5 105 Z"
        fill="url(#nt-sea-far)"
      />
      <path
        d="M-5 56 C20 52, 30 60, 55 54 C80 48, 90 58, 105 55"
        stroke="#85d7ff"
        strokeWidth="1.4"
        fill="none"
        opacity="0.85"
      />

      {/* Rolling Breaker Layer 2 with white foam crest */}
      <path
        d="M-5 72 C18 66, 38 76, 62 68 C86 62, 96 72, 105 70 L105 105 L-5 105 Z"
        fill="url(#nt-sea-near)"
      />
      <path
        d="M-5 72 C18 66, 38 76, 62 68 C86 62, 96 72, 105 70"
        stroke="#c4f0ff"
        strokeWidth="2.2"
        fill="none"
        opacity={active ? 1 : 0.85}
      />

      {/* Shoreline Surf Surge Layer 3 */}
      <path
        d="M-5 88 C25 82, 45 92, 75 85 C90 82, 100 88, 105 86 L105 105 L-5 105 Z"
        fill="#0d2b42"
      />
      <path
        d="M-5 88 C25 82, 45 92, 75 85 C90 82, 100 88, 105 86"
        stroke="#e8f8ff"
        strokeWidth="2.8"
        fill="none"
        strokeDasharray="6 2"
        className="animate-water-shimmer"
        opacity={active ? 1 : 0.9}
      />

      {/* Bioluminescent cyan plankton sparks */}
      <circle cx="36" cy="74" r="1.3" fill="#6be5ff" />
      <circle cx="68" cy="72" r="1.5" fill="#6be5ff" />
      <circle cx="85" cy="88" r="1.6" fill="#88edff" />
    </svg>
  );
}

/**
 * 5. PALAI (Arid Drylands & Sun-Baked Dunes)
 * - Sinuous razor-sharp sand dunes
 * - Weathered Sangam Hero Stone (Nadukal)
 * - Rugged canyon rock spires
 * - Blazing solar blaze & drifting dust
 */
function PalaiLandscapeSVG({
  isHovered,
  isSelected,
}: {
  isHovered: boolean;
  isSelected: boolean;
}) {
  const active = isHovered || isSelected;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#381308" />
          <stop offset="50%" stopColor="#692813" />
          <stop offset="100%" stopColor="#9e3e1f" />
        </linearGradient>
        <linearGradient id="pl-dune-far" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#943d22" />
          <stop offset="100%" stopColor="#3d1408" />
        </linearGradient>
        <linearGradient id="pl-dune-mid" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#b8522e" />
          <stop offset="100%" stopColor="#521b0b" />
        </linearGradient>
        <linearGradient id="pl-dune-near" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#db683d" />
          <stop offset="100%" stopColor="#63220e" />
        </linearGradient>
      </defs>

      {/* Arid copper sunset sky */}
      <rect width="100" height="100" fill="url(#pl-sky)" />

      {/* Blazing desert sun with heat haze corona */}
      <circle cx="50" cy="24" r="12" fill="#ffb07b" opacity={active ? 0.95 : 0.8} />
      <circle cx="50" cy="24" r="22" fill="#ff8c52" opacity={active ? 0.35 : 0.2} className="blur-[4px]" />

      {/* Canyon Rock Spire */}
      <path d="M20 58 L28 34 L36 58 Z" fill="#4d1a0d" />
      <path d="M74 54 L80 40 L86 54 Z" fill="#4d1a0d" />

      {/* Sinuous Sand Dune Layer 1 */}
      <path d="M-5 62 Q32 44 72 66 Q88 72 105 64 L105 105 L-5 105 Z" fill="url(#pl-dune-far)" />

      {/* Sinuous Sand Dune Layer 2 */}
      <path d="M-5 76 Q42 56 105 74 L105 105 L-5 105 Z" fill="url(#pl-dune-mid)" />
      <path
        d="M-5 76 Q42 56 105 74"
        stroke="#ffa57d"
        strokeWidth="1.8"
        fill="none"
        opacity={active ? 1 : 0.8}
      />

      {/* Foreground Sharp Dune Ridge Layer 3 */}
      <path d="M-5 90 Q38 78 105 88 L105 105 L-5 105 Z" fill="url(#pl-dune-near)" />
      <path
        d="M-5 90 Q38 78 105 88"
        stroke="#ffd2b8"
        strokeWidth="2.2"
        fill="none"
        opacity={active ? 1 : 0.85}
      />

      {/* Ancient Sangam Hero Stone (Nadukal) standing in the pass */}
      <path d="M62 82 L62 70 Q64 68 66 70 L66 82 Z" fill="#2b0f07" />
      <circle cx="64" cy="73" r="1" fill="#ffa773" />

      {/* Drifting amber dust specks */}
      <circle cx="38" cy="68" r="1.3" fill="#ffc29e" />
      <circle cx="78" cy="80" r="1.5" fill="#ffc29e" />
      <circle cx="22" cy="84" r="1.2" fill="#ffc29e" />
    </svg>
  );
}
