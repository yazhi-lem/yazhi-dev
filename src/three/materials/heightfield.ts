import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { ZONE_LEN, ZONES, mulberry32, type Zone } from "./zones";

/* Shared terrain heightfield math — used by Terrain.tsx (the actual mesh +
   props placement) and by anything else that needs to know "how tall is
   the ground here" without rendering it, e.g. Squirrels.tsx running along
   the corridor. Kept in one place so a creature or a prop can never sample
   a height the rendered terrain itself doesn't agree with. */

export const noise = createNoise2D(mulberry32(1337));

export const OVERLAP = 24;
export const FULL_LEN = ZONE_LEN + OVERLAP;

/** Raw terrain height for one zone at its own local (x, z) — no seam
    blending. See `blendedHeight` for the version that matches the actual
    rendered surface near a zone boundary. */
export function zoneHeight(zone: Zone, x: number, z: number) {
  const valley = Math.min(1, Math.pow(Math.abs(x) / 16, 1.4)); // clear corridor
  let h = noise(x * zone.freq, z * zone.freq) * zone.amp * valley;
  if (zone.props === "peaks") h += Math.max(0, noise(x * 0.02, z * 0.02)) * 26 * valley; // kurinji ridges
  if (zone.props === "dunes") h = Math.abs(h) * 1.4; // palai dune ripple
  if (zone.props === "fields") h *= 0.5; // paddy country is engineered flat
  if (zone.props === "sea") {
    h *= 0.3 + 0.7 * THREE.MathUtils.smoothstep(z, 4, 16); // beach strip
    h = THREE.MathUtils.lerp(h, -6, THREE.MathUtils.smoothstep(-z, 0, 13));
  }
  return h - 1.5;
}

const half = ZONE_LEN / 2;
const feather = OVERLAP / 2;

/** Terrain height at one zone's local (x, z), blended toward the
    neighboring zone across the overlap band — exactly what the rendered
    mesh does in `zoneGeometry`. Anything placed on the ground (trees,
    props, running creatures) must use this, not the raw `zoneHeight`,
    or it floats/sinks relative to the actual surface near a seam. */
export function blendedHeight(zone: Zone, x: number, z: number, prev?: Zone, next?: Zone) {
  let h = zoneHeight(zone, x, z);
  if (next && z < -half + feather) {
    const t = 1 - THREE.MathUtils.smoothstep(z, -half - feather, -half + feather);
    h = THREE.MathUtils.lerp(h, zoneHeight(next, x, z + ZONE_LEN), t);
  } else if (prev && z > half - feather) {
    const t = THREE.MathUtils.smoothstep(z, half - feather, half + feather);
    h = THREE.MathUtils.lerp(h, zoneHeight(prev, x, z - ZONE_LEN), t);
  }
  return h;
}

export const zOf = (i: number) => -(i * ZONE_LEN) - ZONE_LEN / 2;

/** Ground height at an absolute world (x, worldZ), resolving which zone
    that world position falls in and delegating to `blendedHeight`. For
    anything that travels across zone boundaries in world space — a
    creature running the length of the corridor — rather than being
    scattered within one zone's own local space. */
export function sampleWorldHeight(x: number, worldZ: number) {
  const i = THREE.MathUtils.clamp(Math.round((-worldZ - half) / ZONE_LEN), 0, ZONES.length - 1);
  const zOffset = zOf(i);
  return blendedHeight(ZONES[i], x, worldZ - zOffset, ZONES[i - 1], ZONES[i + 1]);
}
