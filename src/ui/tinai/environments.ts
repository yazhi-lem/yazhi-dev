import type { CSSProperties } from "react";
import type { ThinaiKey } from "@/lib/content";

/** The five tinai as complete UI environments.

    Sangam poetry sorts the world into five landscapes, each with its own
    mood. The Bubble UI gives each one the same: a ground, a light, a way of
    moving and a living background, so a Yazhi app *feels* like the
    landscape it belongs to before a word is read.

    Every environment keeps the brand's spine — Ink ground, Cream text, one
    accent — and varies the temperature of the ink, the accent hue (the
    site's existing thinai tokens) and the motion. Order follows THINAI on
    the site: palai, mullai, kurinji, marutham, neytal. */

export interface Spring {
  /** stiffness */
  k: number;
  /** damping */
  c: number;
}

export interface Environment {
  key: ThinaiKey;
  ta: string;
  en: string;
  landscape: string;
  /** mood, from THINAI_WORLD on the site */
  mood: string;
  /** what this tinai frames, from the Aram harness's Tinai content system */
  useFor: string;
  /** the Yazhi apps that live here by default */
  apps: string[];
  /** the environment in one line */
  signature: string;
  /** what the light does */
  light: string;
  /** how things move here, in words */
  motionWords: string;
  /** the pointer answer of the ambient layer */
  pointerWords: string;
  /** spring for anything that follows the pointer */
  spring: Spring;
  /** ambient speed multiplier (1 = neutral) */
  pace: number;
  /** discrete-change duration, ms */
  settle: number;
  palette: {
    /** page ground */
    ground: string;
    /** raised surfaces */
    surface: string;
    /** bright stroke — the only highlight */
    hi: string;
    /** silhouettes */
    edge: string;
    /** ordinary strokes */
    mid: string;
    /** receding strokes */
    lo: string;
    /** the tinai hue (site token) */
    accent: string;
    text: string;
    textDim: string;
  };
}

export const ENVIRONMENTS: Environment[] = [
  {
    key: "palai",
    ta: "பாலை",
    en: "Palai",
    landscape: "Drylands",
    mood: "Endurance — courage and separation, the harder stories",
    useFor: "Security, infrastructure and hard engineering",
    apps: ["Kural Desk", "yazhi-api console"],
    signature: "Heat over sand",
    light: "Low sun from the west; warm ink, contours instead of surfaces",
    motionWords: "Heavy and unhurried. Things travel far and settle late.",
    pointerWords: "Dune contours bend away from the pointer like heat haze.",
    spring: { k: 70, c: 17 },
    pace: 0.35,
    settle: 900,
    palette: {
      ground: "#0e0a07",
      surface: "#18110c",
      hi: "#f3d2ab",
      edge: "#8a6447",
      mid: "#4d3828",
      lo: "#2a1f17",
      accent: "#c25b3c",
      text: "#f6ece0",
      textDim: "#c9b8a6",
    },
  },
  {
    key: "mullai",
    ta: "முல்லை",
    en: "Mullai",
    landscape: "Forest",
    mood: "Waiting — patience, animals and the folk tales children know",
    useFor: "Community, Dev Spaces and Yazhi Academy",
    apps: ["Guru", "Dev Spaces"],
    signature: "Fireflies under the canopy",
    light: "Dappled; green-black ink, small lights that come and go",
    motionWords: "Gentle and patient. Nothing hurries; everything arrives.",
    pointerWords: "Fireflies drift toward the pointer, slowly, and keep their distance.",
    spring: { k: 85, c: 18 },
    pace: 0.5,
    settle: 760,
    palette: {
      ground: "#070d09",
      surface: "#0f1a13",
      hi: "#d4ecd9",
      edge: "#5f8a6c",
      mid: "#2f4a38",
      lo: "#1a2a20",
      accent: "#4f9d6b",
      text: "#eef5ef",
      textDim: "#b9cbbd",
    },
  },
  {
    key: "kurinji",
    ta: "குறிஞ்சி",
    en: "Kurinji",
    landscape: "Mountains",
    mood: "First meetings — curiosity and discovery, where a story starts",
    useFor: "Launches and first releases",
    apps: ["Avai", "onboarding"],
    signature: "Mist on the ridge",
    light: "High, cool and clear; violet ink, ridgelines layered into distance",
    motionWords: "Buoyant. A little lift, a small overshoot, then still.",
    pointerWords: "The mist parts where the pointer passes and closes behind it.",
    spring: { k: 120, c: 15 },
    pace: 0.7,
    settle: 700,
    palette: {
      ground: "#0a0912",
      surface: "#14121f",
      hi: "#e6e1fb",
      edge: "#7a70b3",
      mid: "#3d3760",
      lo: "#221f36",
      accent: "#8b7ae0",
      text: "#f2f0fb",
      textDim: "#c4bfdc",
    },
  },
  {
    key: "marutham",
    ta: "மருதம்",
    en: "Marutham",
    landscape: "Farmland",
    mood: "Everyday life — counting, work and family; quarrel and reconciliation",
    useFor: "Civic and legal: Nyaya, Sezhi; everyday commerce",
    apps: ["Nyaya", "Kadai"],
    signature: "Wind over paddy",
    light: "Even daylight; olive ink, rows and plots, nothing hidden",
    motionWords: "Precise and fair. Critically damped: it arrives exactly, never bounces.",
    pointerWords: "The pointer is the wind; seedlings bow in a wave that spreads from it.",
    spring: { k: 100, c: 20 },
    pace: 0.6,
    settle: 700,
    palette: {
      ground: "#0c0b06",
      surface: "#17150c",
      hi: "#efe6bd",
      edge: "#8e7f3e",
      mid: "#4a4222",
      lo: "#2a2614",
      accent: "#b7a03c",
      text: "#f7f3e3",
      textDim: "#cdc6a6",
    },
  },
  {
    key: "neytal",
    ta: "நெய்தல்",
    en: "Neytal",
    landscape: "Coast",
    mood: "Longing — voyages and distance, the diaspora's landscape",
    useFor: "Diaspora, Yazh, and language loss",
    apps: ["Open Sangam", "Yazh (parents)"],
    signature: "Tide lines",
    light: "Moonlit; blue-black ink, long horizontal lines that breathe",
    motionWords: "Tidal. Long follow-through, a slow sway before it rests.",
    pointerWords: "The pointer drops a ripple; rings spread and fade into the tide.",
    spring: { k: 55, c: 10 },
    pace: 0.45,
    settle: 850,
    palette: {
      ground: "#050a11",
      surface: "#0c1623",
      hi: "#d6e8f6",
      edge: "#5a87ac",
      mid: "#2b4762",
      lo: "#172738",
      accent: "#4a8ab5",
      text: "#edf4fa",
      textDim: "#b7c8d6",
    },
  },
];

export const ENV_BY_KEY = Object.fromEntries(ENVIRONMENTS.map((e) => [e.key, e])) as Record<ThinaiKey, Environment>;

/** The CSS custom properties one environment sets. The --env-* colours are
    registered with @property (globals.css), so switching environments
    animates every surface and stroke instead of snapping. The Hairline
    figures read --hairline-*, mapped onto the same values. */
export function envVars(key: ThinaiKey): CSSProperties {
  const p = ENV_BY_KEY[key].palette;
  return {
    "--env-ground": p.ground,
    "--env-surface": p.surface,
    "--env-hi": p.hi,
    "--env-edge": p.edge,
    "--env-mid": p.mid,
    "--env-lo": p.lo,
    "--env-accent": p.accent,
    "--env-text": p.text,
    "--env-text-dim": p.textDim,
    "--accent": "var(--env-accent)",
    "--hairline-plate": "var(--env-ground)",
    "--hairline-hi": "var(--env-hi)",
    "--hairline-edge": "var(--env-edge)",
    "--hairline-mid": "var(--env-mid)",
    "--hairline-lo": "var(--env-lo)",
  } as CSSProperties;
}
