/**
 * Calibrated relative coordinate system for the Yazhi mascot component layers.
 * All positions and dimensions are expressed as percentages of the parent bounding container
 * to ensure responsive scaling across desktop, tablet, and mobile screens without layer drift.
 */

export interface MascotLayerConfig {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  height: string;
  zIndex: number;
  transformOrigin?: string;
}

/** Normalized bounding container aspect ratio (width / height) = 1200 / 1000 */
export const MASCOT_ASPECT_RATIO = 1200 / 1000; // 1.2 : 1

/** Full multi-layer character rig configuration */
export const MASCOT_LAYERS = {
  wings: {
    src: "/images/mascot/yazhi-wings.png",
    alt: "Yazhi wings",
    left: "22.0%",
    top: "0.0%",
    width: "76.0%",
    height: "71.0%",
    zIndex: 1,
    transformOrigin: "40% 75%",
  },
  tail: {
    src: "/images/mascot/yazhi-tail.png",
    alt: "Yazhi tail",
    left: "63.0%",
    top: "38.0%",
    width: "33.0%",
    height: "38.0%",
    zIndex: 2,
    transformOrigin: "25% 85%",
  },
  body: {
    src: "/images/mascot/yazhi-body.png",
    alt: "Yazhi body",
    left: "18.0%",
    top: "41.0%",
    width: "70.0%",
    height: "64.0%",
    zIndex: 3,
    transformOrigin: "50% 95%",
  },
  pendant: {
    src: "/images/mascot/yazhi-pendant.png",
    alt: "Yazhi medallion pendant",
    left: "27.5%",
    top: "67.0%",
    width: "9.5%",
    height: "14.5%",
    zIndex: 4,
    transformOrigin: "50% 12%",
  },
  head: {
    src: "/images/mascot/yazhi-head.png",
    alt: "Yazhi head",
    left: "8.5%",
    top: "10.0%",
    width: "55.0%",
    height: "60.0%",
    zIndex: 5,
    transformOrigin: "55% 88%",
  },
  eyes: {
    src: "/images/mascot/yazhi-eyes.png",
    alt: "Yazhi eyes",
    left: "16.5%",
    top: "37.5%",
    width: "30.5%",
    height: "16.5%",
    zIndex: 6,
    transformOrigin: "50% 50%",
  },
} as const;

/** Head-relative coordinates for eyes to guarantee permanent physical attachment */
export const EYES_RELATIVE_TO_HEAD = {
  left: "14.5%",
  top: "46.2%",
  width: "55.5%",
  height: "27.2%",
  transformOrigin: "50% 50%",
} as const;

/** Avatar mode configuration (head + eyes cropped in a 1:1 circular/square container) */
export const AVATAR_CONFIG = {
  aspectRatio: 1,
  head: {
    src: "/images/mascot/yazhi-head.png",
    alt: "Yazhi head",
    left: "4.1%",
    top: "9.2%",
    width: "91.8%",
    height: "81.6%",
    zIndex: 1,
    transformOrigin: "50% 50%",
  },
  eyes: {
    src: "/images/mascot/yazhi-eyes.png",
    alt: "Yazhi eyes",
    left: "14.5%",
    top: "46.2%",
    width: "55.5%",
    height: "27.2%",
    zIndex: 2,
    transformOrigin: "50% 50%",
  },
} as const;

/** Predefined responsive sizes */
export const MASCOT_SIZES = {
  xs: "w-8 h-8",
  sm: "w-10 h-10 sm:w-12 sm:h-12",
  md: "w-20 h-20 sm:w-24 sm:h-24",
  lg: "w-64 sm:w-80 md:w-96",
  xl: "w-80 sm:w-96 md:w-[28rem]",
  custom: "",
} as const;

/** Complete, clean, unified high-resolution mascot asset */
export const MASCOT_FULL_ASSET = {
  src: "/images/mascot/yazhi-full.png",
  src2x: "/images/mascot/yazhi-full-2x.png",
  alt: "Yazhi — sovereign mythical guardian mascot",
  aspectRatio: 1024 / 910,
  width: 1024,
  height: 910,
} as const;

/** Transparent VP9 WebM animation configuration */
export const MASCOT_VIDEO_CONFIG = {
  src: "/videos/yazhi-guardian.webm",
  poster: "/videos/yazhi-guardian-poster.png",
  alt: "Yazhi — sovereign mythical temple guardian animation",
  aspectRatio: 16 / 9,
  width: 1920,
  height: 1080,
} as const;

