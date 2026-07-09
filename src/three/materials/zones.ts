/* The five thinai as world zones along the camera's -Z journey.
   Hues match styles/tokens.css so the WebGL world and the DOM accent
   system stay in the same register. */
export const ZONE_LEN = 70;
export const WORLD_LEN = ZONE_LEN * 5;

export type Zone = {
  key: string;
  ground: string;   // terrain base color
  glow: string;     // zone light color (thinai accent)
  amp: number;      // terrain height amplitude
  freq: number;     // noise frequency
  props: "peaks" | "trees" | "fields" | "dunes" | "sea";
};

export const ZONES: Zone[] = [
  { key: "kurinji",  ground: "#302a5c", glow: "#8b7ae0", amp: 22, freq: 0.045, props: "peaks"  },
  { key: "mullai",   ground: "#1c4029", glow: "#5fb37e", amp: 6,  freq: 0.06,  props: "trees"  },
  { key: "marutham", ground: "#3d371b", glow: "#b7a03c", amp: 2,  freq: 0.05,  props: "fields" },
  { key: "palai",    ground: "#48281a", glow: "#d97a58", amp: 9,  freq: 0.03,  props: "dunes"  },
  { key: "neytal",   ground: "#163044", glow: "#5f9fc9", amp: 3,  freq: 0.05,  props: "sea"    },
];

/* deterministic PRNG so the world is identical on every visit */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
