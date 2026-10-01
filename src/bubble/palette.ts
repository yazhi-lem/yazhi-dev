/** The Mugil palette, as data. Each colour is traced to the pixel region
    of the Yazhi mascot art (public/yazhi.png, 900×832) it was sampled
    from — an 6×6 average — then split into a pastel surface and a
    deepened tone. Values mirror the [data-ybi-theme="mugil"] block in
    src/styles/bubble.css; the /ybi gallery computes contrast from these
    so its printed ratios match what renders. */
import type { Thinai } from "./tone";

export interface MugilColour {
  key: Thinai | "gold";
  name: { ta: string; en: string };
  /** which part of Yazh it comes from */
  source: string;
  /** averaged pixel from the art */
  sampled: string;
  /** cloud / soft-fill surface (never a text colour) */
  pastel: string;
  /** the theme tone: marks, rings, mixed text, solid fills */
  tone: string;
}

export const MUGIL = {
  ground: "#f6f1ea", // fur cream
  body: "#fffdfa", // cloud white (bubble body)
  ink: "#2f2a3b", // plum ink
  dusk: "#625b70", // secondary text
  /** the bubble body as rendered: 84% body over the sky gradient's top */
  bubble: "#fcfbfa",
  toneMix: 0.65,
  glow: 0.13,
} as const;

export const MUGIL_PALETTE: MugilColour[] = [
  {
    key: "mullai",
    name: { ta: "இளம்பச்சை", en: "Mane sage" },
    source: "mane curls",
    sampled: "#9eb1a0",
    pastel: "#d6ebe0",
    tone: "#4a8a6e",
  },
  {
    key: "marutham",
    name: { ta: "பொன்", en: "Curl gold" },
    source: "crown curls",
    sampled: "#e8c375",
    pastel: "#f8ebc6",
    tone: "#9c7a22",
  },
  {
    key: "palai",
    name: { ta: "பவழம்", en: "Wing coral" },
    source: "the little wing",
    sampled: "#d76c46",
    pastel: "#fbdccb",
    tone: "#cc5f38",
  },
  {
    key: "neytal",
    name: { ta: "நீலம்", en: "Sapphire" },
    source: "irises",
    sampled: "#4b76b9",
    pastel: "#d8e5f5",
    tone: "#4b76b9",
  },
  {
    key: "kurinji",
    name: { ta: "அந்தி", en: "Dusk lilac" },
    source: "blush × sapphire (cheek #fbc3ac with iris)",
    sampled: "#a39cb2",
    pastel: "#e3ddf5",
    tone: "#7e6fc6",
  },
  {
    key: "gold",
    name: { ta: "பதக்கம்", en: "Medal gold" },
    source: "sun medallion",
    sampled: "#b38442",
    pastel: "#f8ebc6",
    tone: "#82621a",
  },
];

/** Extra pastels used only by the sky. */
export const MUGIL_CLOUDS = [
  { name: "Blush", hex: "#f8d7d9", source: "cheeks #fbc3ac" },
  { name: "Cream", hex: "#f6f1ea", source: "fur #e7d2b8" },
] as const;
