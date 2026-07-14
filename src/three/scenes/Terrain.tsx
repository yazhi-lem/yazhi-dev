"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ZONES, ZONE_LEN, mulberry32, type Zone } from "@/three/materials/zones";

const noise = createNoise2D(mulberry32(1337));

/* ---- low-poly compound props: several primitives merged into one
   vertex-colored geometry so each creature/plant is still a single
   instanced draw call, matching the rest of the terrain's style. ---- */

function coloredPart(geo: THREE.BufferGeometry, color: string, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  if (rx) geo.rotateX(rx);
  if (ry) geo.rotateY(ry);
  if (rz) geo.rotateZ(rz);
  geo.translate(x, y, z);
  const count = geo.attributes.position.count;
  const arr = new Float32Array(count * 3);
  const c = new THREE.Color(color);
  for (let i = 0; i < count; i++) c.toArray(arr, i * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

/** A standing/walking deer: boxy body, raised head, four legs staggered
    into a stride so a static instance still reads as mid-walk. */
function buildDeer() {
  const hide = "#9a6b3f";
  const leg = "#5c3d22";
  return mergeGeometries(
    [
      coloredPart(new THREE.BoxGeometry(0.55, 0.5, 1.3), hide, 0, 0.75, 0),
      coloredPart(new THREE.BoxGeometry(0.32, 0.34, 0.5), "#8a5c34", 0, 1.02, 0.78),
      coloredPart(new THREE.BoxGeometry(0.12, 0.55, 0.12), leg, 0.18, 0.28, 0.48),
      coloredPart(new THREE.BoxGeometry(0.12, 0.55, 0.12), leg, -0.18, 0.24, 0.55),
      coloredPart(new THREE.BoxGeometry(0.12, 0.55, 0.12), leg, 0.18, 0.24, -0.5),
      coloredPart(new THREE.BoxGeometry(0.12, 0.55, 0.12), leg, -0.18, 0.28, -0.45),
    ],
    false,
  )!;
}

/** A sleeping elephant: a low lying-down body, head, ear, and a trunk
    curled to rest on the ground — no legs, since they're tucked under. */
function buildSleepingElephant() {
  const skin = "#7d7d7d";
  const ear = "#6b6b6b";
  const body = new THREE.CapsuleGeometry(0.55, 1.1, 4, 8);
  body.rotateZ(Math.PI / 2); // lie the capsule down along local x
  return mergeGeometries(
    [
      coloredPart(body, skin, 0, 0.55, 0),
      coloredPart(new THREE.SphereGeometry(0.42, 8, 8), skin, 0.95, 0.55, 0),
      coloredPart(new THREE.SphereGeometry(0.32, 8, 6).scale(1, 1, 0.22), ear, 1.05, 0.62, 0.3),
      coloredPart(new THREE.ConeGeometry(0.12, 0.45, 6), ear, 1.28, 0.32, 0.1, 0, 0, Math.PI / 2.4),
    ],
    false,
  )!;
}

/** A palm tree: a trunk with a fan of drooping fronds radiating off the top. */
function buildPalm() {
  const parts = [coloredPart(new THREE.CylinderGeometry(0.12, 0.22, 5, 6), "#6b4a2e", 0, 2.5, 0)];
  const fronds = 7;
  for (let i = 0; i < fronds; i++) {
    const angle = (i / fronds) * Math.PI * 2;
    const blade = new THREE.BoxGeometry(0.14, 0.05, 2.4);
    blade.translate(0, 0, 1.2);
    blade.rotateX(-0.55);
    parts.push(coloredPart(blade, "#2f7a3d", 0, 5, 0, 0, angle, 0));
  }
  return mergeGeometries(parts, false)!;
}

/** Kundru — a small shrine-topped hillock, the one landmark unique to
    marutham. Abstract silhouette, in keeping with the rest of the site's
    low-poly marks rather than a literal temple illustration. */
function buildKundru() {
  return mergeGeometries(
    [
      coloredPart(new THREE.ConeGeometry(6, 3.2, 8), "#5c4a2a", 0, 1.6, 0),
      coloredPart(new THREE.BoxGeometry(1.6, 1.1, 1.6), "#e7ded0", 0, 3.75, 0),
      coloredPart(new THREE.ConeGeometry(1.3, 1.4, 4), "#c99a3f", 0, 5, 0, 0, Math.PI / 4, 0),
      coloredPart(new THREE.SphereGeometry(0.18, 6, 6), "#e7ded0", 0, 5.9, 0),
    ],
    false,
  )!;
}

/** A peacock: blue body and raised neck against a green tail-fan disc —
    kurinji's bird, dancing on the mid slopes. */
function buildPeacock() {
  const body = "#1d4e89";
  return mergeGeometries(
    [
      coloredPart(new THREE.SphereGeometry(0.28, 8, 6), body, 0, 0.42, 0),
      coloredPart(new THREE.CylinderGeometry(0.05, 0.08, 0.42, 5), body, 0, 0.72, 0.16, 0.4),
      coloredPart(new THREE.SphereGeometry(0.1, 6, 5), body, 0, 0.94, 0.26),
      coloredPart(new THREE.ConeGeometry(0.05, 0.16, 4), "#c9a03f", 0, 0.94, 0.38, Math.PI / 2),
      // the fan: two stacked vertical discs behind the body
      coloredPart(new THREE.CylinderGeometry(0.85, 0.85, 0.06, 14), "#1f6f50", 0, 0.95, -0.34, Math.PI / 2 - 0.28),
      coloredPart(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 12), "#2e8b6b", 0, 0.72, -0.3, Math.PI / 2 - 0.28),
    ],
    false,
  )!;
}

/** A bamboo clump: a few culms of varying height with leaf tufts on top. */
function buildBamboo() {
  const culms: [number, number, number][] = [
    [0, 0, 3.8],
    [0.35, 0.18, 4.6],
    [-0.32, 0.22, 3.1],
    [0.08, -0.3, 4.2],
  ];
  const parts: THREE.BufferGeometry[] = [];
  for (const [x, z, h] of culms) {
    parts.push(coloredPart(new THREE.CylinderGeometry(0.06, 0.09, h, 5), "#7fae5f", x, h / 2, z));
    parts.push(coloredPart(new THREE.ConeGeometry(0.5, 1.1, 5), "#4c8a44", x, h + 0.35, z));
  }
  return mergeGeometries(parts, false)!;
}

/** Standing bovine — cattle for mullai's herds, or (with horns and a dark
    hide) a water buffalo for the marutham pond. */
function buildBovine(hide: string, horns = false) {
  const parts = [
    coloredPart(new THREE.BoxGeometry(0.7, 0.6, 1.5), hide, 0, 0.85, 0),
    coloredPart(new THREE.BoxGeometry(0.4, 0.38, 0.55), hide, 0, 1.02, 0.95),
    coloredPart(new THREE.BoxGeometry(0.15, 0.6, 0.15), hide, 0.24, 0.3, 0.55),
    coloredPart(new THREE.BoxGeometry(0.15, 0.6, 0.15), hide, -0.24, 0.3, 0.55),
    coloredPart(new THREE.BoxGeometry(0.15, 0.6, 0.15), hide, 0.24, 0.3, -0.55),
    coloredPart(new THREE.BoxGeometry(0.15, 0.6, 0.15), hide, -0.24, 0.3, -0.55),
  ];
  if (horns) {
    parts.push(coloredPart(new THREE.ConeGeometry(0.06, 0.5, 4), "#d8d0c0", 0.3, 1.28, 0.95, 0, 0, -1.25));
    parts.push(coloredPart(new THREE.ConeGeometry(0.06, 0.5, 4), "#d8d0c0", -0.3, 1.28, 0.95, 0, 0, 1.25));
  }
  return mergeGeometries(parts, false)!;
}

/** Senkaal narai — the red-legged crane wading at the paddy pond. */
function buildCrane() {
  return mergeGeometries(
    [
      coloredPart(new THREE.SphereGeometry(0.22, 7, 5).scale(1, 0.8, 1.4), "#efe9dc", 0, 0.72, 0),
      coloredPart(new THREE.CylinderGeometry(0.035, 0.05, 0.5, 5), "#efe9dc", 0, 1.0, 0.24, 0.45),
      coloredPart(new THREE.SphereGeometry(0.08, 6, 5), "#efe9dc", 0, 1.2, 0.36),
      coloredPart(new THREE.ConeGeometry(0.03, 0.2, 4), "#c96a2a", 0, 1.2, 0.5, Math.PI / 2),
      coloredPart(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 4), "#b05030", 0.07, 0.28, 0.05),
      coloredPart(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 4), "#b05030", -0.07, 0.28, -0.06),
    ],
    false,
  )!;
}

/** A kattumaram: three lashed hulls, a mast, and a small sail. */
function buildCatamaran() {
  return mergeGeometries(
    [
      coloredPart(new THREE.BoxGeometry(0.28, 0.16, 3.4), "#a97c50", -0.4, 0.08, 0),
      coloredPart(new THREE.BoxGeometry(0.28, 0.16, 3.4), "#9c7047", 0, 0.08, 0),
      coloredPart(new THREE.BoxGeometry(0.28, 0.16, 3.4), "#a97c50", 0.4, 0.08, 0),
      coloredPart(new THREE.CylinderGeometry(0.04, 0.05, 1.7, 5), "#6b4a2e", 0, 1.0, 0.3),
      coloredPart(new THREE.ConeGeometry(0.55, 1.2, 4), "#e8e0cc", 0, 1.15, 0.28),
    ],
    false,
  )!;
}

/** A parathavar palm-thatch hut on the shore. */
function buildHut() {
  return mergeGeometries(
    [
      coloredPart(new THREE.CylinderGeometry(1.1, 1.25, 0.95, 8), "#9b7752", 0, 0.48, 0),
      coloredPart(new THREE.ConeGeometry(1.7, 1.15, 8), "#7a5e3a", 0, 1.52, 0),
    ],
    false,
  )!;
}

/** Kalli — the thorny cactus of the palai wasteland. */
function buildCactus() {
  return mergeGeometries(
    [
      coloredPart(new THREE.CylinderGeometry(0.22, 0.28, 2.2, 6), "#3f7d46", 0, 1.1, 0),
      coloredPart(new THREE.CylinderGeometry(0.11, 0.11, 0.42, 5), "#3f7d46", 0.3, 1.05, 0, 0, 0, Math.PI / 2),
      coloredPart(new THREE.CylinderGeometry(0.13, 0.13, 0.85, 5), "#468a4e", 0.48, 1.5, 0),
      coloredPart(new THREE.CylinderGeometry(0.11, 0.11, 0.36, 5), "#3f7d46", -0.27, 0.85, 0, 0, 0, Math.PI / 2),
      coloredPart(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 5), "#468a4e", -0.42, 1.22, 0),
    ],
    false,
  )!;
}

/** A leafless palai tree: bare trunk and forked dead branches. */
function buildDeadTree() {
  return mergeGeometries(
    [
      coloredPart(new THREE.CylinderGeometry(0.1, 0.19, 2.3, 5), "#5a4632", 0, 1.15, 0),
      coloredPart(new THREE.CylinderGeometry(0.05, 0.08, 1.2, 4), "#52402e", 0.35, 2.5, 0, 0, 0, -0.7),
      coloredPart(new THREE.CylinderGeometry(0.04, 0.07, 1.0, 4), "#52402e", -0.3, 2.4, 0.1, 0.2, 0, 0.8),
      coloredPart(new THREE.CylinderGeometry(0.03, 0.05, 0.7, 4), "#52402e", 0.1, 2.9, -0.15, -0.5, 0, 0.2),
    ],
    false,
  )!;
}

/** The neytal lighthouse: red-and-white banded tower, gallery, lamp room,
    conical cap. The lamp glow and rotating beam are added live in the
    Lighthouse component — geometry here is the static tower only. */
function buildLighthouse() {
  const white = "#e9e4d8";
  const red = "#c14b3a";
  return mergeGeometries(
    [
      coloredPart(new THREE.CylinderGeometry(0.62, 0.85, 1.6, 8), red, 0, 0.8, 0),
      coloredPart(new THREE.CylinderGeometry(0.52, 0.62, 1.6, 8), white, 0, 2.4, 0),
      coloredPart(new THREE.CylinderGeometry(0.44, 0.52, 1.6, 8), red, 0, 4.0, 0),
      coloredPart(new THREE.CylinderGeometry(0.8, 0.8, 0.16, 8), "#3a3630", 0, 4.9, 0), // gallery deck
      coloredPart(new THREE.CylinderGeometry(0.34, 0.34, 0.7, 8), "#ffe9a8", 0, 5.35, 0), // lamp room
      coloredPart(new THREE.ConeGeometry(0.5, 0.7, 8), red, 0, 6.05, 0),
    ],
    false,
  )!;
}

/** A gliding bird silhouette — a shallow V of wings and a sliver of body.
    Scaled up and darkened it's a palai eagle; small and pale, a neytal gull. */
function buildBird(color: string) {
  return mergeGeometries(
    [
      coloredPart(new THREE.BoxGeometry(0.62, 0.04, 0.16), color, -0.28, 0.06, 0, 0, 0, 0.42),
      coloredPart(new THREE.BoxGeometry(0.62, 0.04, 0.16), color, 0.28, 0.06, 0, 0, 0, -0.42),
      coloredPart(new THREE.BoxGeometry(0.14, 0.07, 0.34), color, 0, 0, 0),
    ],
    false,
  )!;
}

const OVERLAP = 24;
const FULL_LEN = ZONE_LEN + OVERLAP;

/** Raw terrain height for one zone at its own local (x, z). Shared by
    zoneGeometry both for the zone itself and for sampling a neighbor's
    surface when blending across a seam — and by prop placement below, so
    everything planted on the land actually sits on the land. */
function zoneHeight(zone: Zone, x: number, z: number) {
  const valley = Math.min(1, Math.pow(Math.abs(x) / 16, 1.4)); // clear corridor
  let h = noise(x * zone.freq, z * zone.freq) * zone.amp * valley;
  if (zone.props === "peaks") h += Math.max(0, noise(x * 0.02, z * 0.02)) * 26 * valley; // kurinji ridges
  if (zone.props === "dunes") h = Math.abs(h) * 1.4; // palai dune ripple
  // neytal, on the FAR side (local -z, the direction of travel): the noise
  // first damps into a flat sand beach approaching the shoreline, then the
  // land dives smoothly below the water plane and STAYS there — an open
  // ocean with no half-submerged noise lumps reading as ice floes. The +z
  // edge is untouched, keeping the palai seam blend clean.
  if (zone.props === "sea") {
    const flat = 0.3 + 0.7 * THREE.MathUtils.smoothstep(z, 4, 16); // beach strip
    h = (h + 1.5) * flat - 1.5;
    const dive = THREE.MathUtils.smoothstep(-z, 2, 22);
    h = THREE.MathUtils.lerp(h, -7.5, dive);
  }
  return h - 1.5;
}

/* per-vertex terrain tints, from the thinai design brief:
   snow + neelakurinji bloom on the mountain, moss in the forest, wet/dry
   paddy bands, sun-cracked earth, wet sand at the waterline — plus one
   faint walking path worn along the corridor through every land. */
const WHITE = new THREE.Color("#ffffff");
const BLACK = new THREE.Color("#000000");
const SNOW = new THREE.Color("#d9dcef");
const BLOOM = new THREE.Color("#7b6bd0"); // neelakurinji violet
const MOSS = new THREE.Color("#2e5d38");
const PADDY = new THREE.Color("#4a5c1e");
const SCORCH = new THREE.Color("#8a4a26"); // noon heat on palai sand
const SAND = new THREE.Color("#cfae7e"); // dry neytal beach sand
const WETSAND = new THREE.Color("#1b3a50");
const PATH = new THREE.Color("#6b5a3a");

function zoneVertexColor(zone: Zone, x: number, z: number, h: number, out: THREE.Color) {
  out.set(zone.ground);
  // height shading — high ground catches light, hollows fall into shadow
  const l = THREE.MathUtils.clamp(h * 0.022, -0.12, 0.3);
  if (l > 0) out.lerp(WHITE, l);
  else out.lerp(BLACK, -l);
  switch (zone.props) {
    case "peaks": {
      const snow = THREE.MathUtils.smoothstep(h, 13, 22);
      if (snow > 0) out.lerp(SNOW, snow * 0.85);
      const bloom = noise(x * 0.11 + 40, z * 0.11);
      if (h > 1 && h < 13 && bloom > 0.35) out.lerp(BLOOM, (bloom - 0.35) * 0.55);
      break;
    }
    case "trees": {
      const moss = noise(x * 0.07 + 9, z * 0.07);
      if (moss > 0) out.lerp(MOSS, moss * 0.35);
      break;
    }
    case "fields": {
      const band = Math.sin(z * 0.55) * 0.5 + 0.5; // alternating wet/dry paddy strips
      out.lerp(PADDY, band * 0.3);
      break;
    }
    case "dunes": {
      const crack = noise(x * 0.32, z * 0.32);
      if (crack > 0.42) out.lerp(BLACK, (crack - 0.42) * 0.55); // cracked earth
      else out.lerp(SCORCH, 0.12);
      break;
    }
    case "sea": {
      // pale dry sand across the beach strip, darker wet sand dipping to
      // the waterline, deep blue-green below the swell
      const beach = 1 - THREE.MathUtils.smoothstep(Math.abs(z - 8), 6, 22);
      if (h > -2.0 && beach > 0) out.lerp(SAND, beach * 0.65);
      const wet = THREE.MathUtils.smoothstep(-h, 1.4, 2.6);
      out.lerp(WETSAND, wet * 0.7);
      break;
    }
  }
  const path = 1 - THREE.MathUtils.smoothstep(Math.abs(x), 1.2, 4);
  if (path > 0) out.lerp(PATH, path * 0.18);
}

/** Heightfield for one zone. A soft valley is carved along x≈0 so the
    camera path always reads as a traversable corridor through the world.
    Each zone's plane overlaps its neighbors by OVERLAP units so there's no
    literal gap, but two independent noise fields crossing in that overlap
    used to read as a crack/seam; blending each zone's edge toward its
    neighbor's own height (and color) there makes it one continuous surface. */
function zoneGeometry(zone: Zone, detail: number, prev?: Zone, next?: Zone) {
  const width = 180;
  const g = new THREE.PlaneGeometry(width, FULL_LEN, detail, Math.round(detail * 0.6));
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const cSelf = new THREE.Color();
  const cOther = new THREE.Color();
  const half = ZONE_LEN / 2;
  const feather = OVERLAP / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let h = zoneHeight(zone, x, z);
    let t = 0;
    let other: Zone | undefined;
    let otherZ = 0;
    if (next && z > half - feather) {
      t = THREE.MathUtils.smoothstep(z, half - feather, half + feather);
      other = next;
      otherZ = z + ZONE_LEN;
      h = THREE.MathUtils.lerp(h, zoneHeight(next, x, otherZ), t);
    } else if (prev && z < -half + feather) {
      t = 1 - THREE.MathUtils.smoothstep(z, -half - feather, -half + feather);
      other = prev;
      otherZ = z - ZONE_LEN;
      h = THREE.MathUtils.lerp(h, zoneHeight(prev, x, otherZ), t);
    }
    pos.setY(i, h);
    zoneVertexColor(zone, x, z, h, cSelf);
    if (other && t > 0) {
      zoneVertexColor(other, x, otherZ, h, cOther);
      cSelf.lerp(cOther, t);
    }
    cSelf.toArray(colors, i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

type PropLayer = {
  geometry: THREE.BufferGeometry;
  matrices: THREE.Matrix4[];
  color: string; // "#ffffff" for vertex-colored compound geometries
  vertexColors?: boolean;
  emissive?: string; // self-lit props (kurinji bloom at midnight)
  emissiveIntensity?: number;
};

/** Matrix builder shared by every layer below: places `count` instances of
    one geometry via a placement function returning position + uniform
    scale (+ optional yaw so creatures/plants don't all face one way). */
function place(count: number, fn: (i: number) => { x: number; z: number; scale: number; h: number; yaw?: number }) {
  const m: THREE.Matrix4[] = [];
  const tmp = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const { x, z, scale, h, yaw = 0 } = fn(i);
    p.set(x, h, z);
    q.setFromAxisAngle(UP, yaw);
    s.setScalar(scale);
    tmp.compose(p, q, s);
    m.push(tmp.clone());
  }
  return m;
}
const UP = new THREE.Vector3(0, 1, 0);

/** Zone-specific instanced props — low-poly, one draw call per layer.
    Populated per the thinai design brief: each landscape carries its own
    flora, fauna, and human traces. Everything samples zoneHeight so it
    stands on the actual ground, and `density` thins the scatter layers on
    low-power devices (creatures and landmarks always survive the cut). */
function ZoneProps({ zone, zOffset, density = 1 }: { zone: Zone; zOffset: number; density?: number }) {
  const layers = useMemo<PropLayer[]>(() => {
    // seeded inside the memo so a runtime density change (live low-mode
    // demotion) replays the exact same placement sequence, only shorter —
    // the world never visibly re-scatters
    const rand = mulberry32(zOffset * 7 + 11);
    const n = (c: number) => Math.max(1, Math.round(c * density));
    const ground = (x: number, z: number) => zoneHeight(zone, x, z);

    switch (zone.props) {
      case "peaks": { // kurinji — monoliths, neelakurinji bloom, bamboo, peacocks
        const monoliths: PropLayer = {
          geometry: new THREE.TetrahedronGeometry(2.4),
          color: zone.glow,
          matrices: place(n(30), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (24 + rand() * 50);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 1 + rand() * 2.4, h: ground(x, z) + 0.6, yaw: rand() * Math.PI };
          }),
        };
        const bloom: PropLayer = {
          geometry: new THREE.OctahedronGeometry(0.16),
          color: "#8b7ae0",
          emissive: "#7b6bd0",
          emissiveIntensity: 0.7, // the once-in-twelve-years bloom, glowing at midnight
          matrices: place(n(140), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (17 + rand() * 46);
            const z = (rand() - 0.5) * FULL_LEN;
            const h = ground(x, z);
            // bloom only on the mid slopes — not the valley, not the snowline
            return { x, z, scale: h > 0 && h < 13 ? 0.7 + rand() * 0.9 : 0, h: h + 0.15 };
          }),
        };
        const bamboo: PropLayer = {
          geometry: buildBamboo(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(n(18), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (20 + rand() * 34);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.8 + rand() * 0.7, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const peacocks: PropLayer = {
          geometry: buildPeacock(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(3, () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (16 + rand() * 8);
            const z = (rand() - 0.5) * ZONE_LEN;
            return { x, z, scale: 1.1 + rand() * 0.4, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        return [monoliths, bloom, bamboo, peacocks];
      }

      case "trees": { // mullai — forest, jasmine speckle, deer, grazing cattle
        const forest: PropLayer = {
          geometry: new THREE.ConeGeometry(1, 4, 5),
          color: "#2f6e4b",
          // spans the full FULL_LEN (zone + overlap on both edges) so the
          // treeline doesn't thin out into bald patches at the zone seams
          matrices: place(n(104), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (14 + rand() * 55);
            const z = (rand() - 0.5) * FULL_LEN;
            const scale = 0.8 + rand() * 1.8;
            // cone origin is its center: lift by half height so the base
            // sits on the sampled ground instead of a constant y
            return { x, z, scale, h: ground(x, z) + 2 * scale };
          }),
        };
        const jasmine: PropLayer = {
          geometry: new THREE.SphereGeometry(0.13, 5, 4),
          color: "#f2f0e4",
          emissive: "#e8e4d0",
          emissiveIntensity: 0.35, // mullai buds pale in the evening light
          matrices: place(n(90), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (14 + rand() * 50);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.7 + rand() * 0.8, h: ground(x, z) + 0.5 + rand() * 2.4 };
          }),
        };
        const deer: PropLayer = {
          geometry: buildDeer(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(5, () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (15 + rand() * 18);
            const z = (rand() - 0.5) * ZONE_LEN;
            return { x, z, scale: 0.85 + rand() * 0.3, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const cattle: PropLayer = {
          geometry: buildBovine("#c9b8a0"),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(5, () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (16 + rand() * 14);
            const z = (rand() - 0.5) * ZONE_LEN * 0.8;
            return { x, z, scale: 0.9 + rand() * 0.25, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        return [forest, jasmine, deer, cattle];
      }

      case "fields": { // marutham — paddies, palms, pond life, deer, elephants, kundru
        const paddy: PropLayer = {
          geometry: new THREE.BoxGeometry(10, 0.25, 4),
          color: "#6e6420",
          matrices: place(n(70), (i) => {
            const x = (i % 2 === 0 ? 1 : -1) * (16 + (i % 5) * 11);
            const z = -FULL_LEN / 2 + (i / n(70)) * FULL_LEN;
            return { x, z, scale: 0.9 + rand() * 0.4, h: ground(x, z) + 0.35 };
          }),
        };
        const palms: PropLayer = {
          geometry: buildPalm(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(n(22), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (28 + rand() * 48);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.85 + rand() * 0.5, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const deer: PropLayer = {
          geometry: buildDeer(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(6, () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (18 + rand() * 20);
            const z = (rand() - 0.5) * ZONE_LEN;
            return { x, z, scale: 0.9 + rand() * 0.3, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const elephants: PropLayer = {
          geometry: buildSleepingElephant(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(2, (i) => {
            const side = i === 0 ? 1 : -1;
            const x = side * (38 + rand() * 18);
            const z = (rand() - 0.5) * ZONE_LEN * 0.7;
            return { x, z, scale: 1 + rand() * 0.3, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const buffalo: PropLayer = {
          geometry: buildBovine("#3d3d3d", true),
          color: "#ffffff",
          vertexColors: true,
          // wallowing around the lotus pond (see the pond mesh in Terrain)
          matrices: place(3, () => {
            const x = 27 + rand() * 14;
            const z = 1 + rand() * 12;
            return { x, z, scale: 0.95 + rand() * 0.3, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const cranes: PropLayer = {
          geometry: buildCrane(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(4, () => {
            const a = rand() * Math.PI * 2;
            const r = 8.5 + rand() * 2.5;
            const x = 34 + Math.cos(a) * r;
            const z = 6 + Math.sin(a) * r;
            return { x, z, scale: 1 + rand() * 0.3, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const lotus: PropLayer = {
          geometry: new THREE.OctahedronGeometry(0.16),
          color: "#d98aa8",
          emissive: "#b06080",
          emissiveIntensity: 0.3,
          matrices: place(14, () => {
            const a = rand() * Math.PI * 2;
            const r = rand() * 7;
            return { x: 34 + Math.cos(a) * r, z: 6 + Math.sin(a) * r, scale: 0.8 + rand() * 0.6, h: -0.35 };
          }),
        };
        const kundru: PropLayer = {
          geometry: buildKundru(),
          color: "#ffffff",
          vertexColors: true,
          // one fixed landmark, off to one side so it never blocks the camera path
          matrices: place(1, () => ({ x: -62, z: 4, scale: 1, h: ground(-62, 4) + 0.3, yaw: 0.4 })),
        };
        return [paddy, palms, deer, elephants, buffalo, cranes, lotus, kundru];
      }

      case "dunes": { // palai — stones, kalli cactus, leafless trees
        const stones: PropLayer = {
          geometry: new THREE.DodecahedronGeometry(0.9),
          color: "#7a4530",
          matrices: place(n(46), () => {
            const x = (rand() - 0.5) * 130;
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.5 + rand() * 1.4, h: ground(x, z) + 0.3, yaw: rand() * Math.PI };
          }),
        };
        const cacti: PropLayer = {
          geometry: buildCactus(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(n(16), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (12 + rand() * 52);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.75 + rand() * 0.7, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        const deadTrees: PropLayer = {
          geometry: buildDeadTree(),
          color: "#ffffff",
          vertexColors: true,
          matrices: place(n(9), () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (16 + rand() * 44);
            const z = (rand() - 0.5) * FULL_LEN;
            return { x, z, scale: 0.9 + rand() * 0.8, h: ground(x, z), yaw: rand() * Math.PI * 2 };
          }),
        };
        return [stones, cacti, deadTrees];
      }

      case "sea": { // neytal — the peaceful ocean the journey ends on
        const lanterns: PropLayer = {
          // fishermen's lanterns drifting far out on the swell — warm, dim,
          // sparse; they replace the old bright buoys so the sea reads as
          // rest, not activity
          geometry: new THREE.SphereGeometry(0.45, 8, 8),
          color: "#e8c87a",
          emissive: "#d9a84e",
          emissiveIntensity: 0.55,
          matrices: place(n(14), () => ({
            x: (rand() - 0.5) * 140,
            z: -4 - rand() * (FULL_LEN / 2 + 14), // trailing out toward the horizon
            scale: 0.5 + rand() * 0.5,
            h: -1.85,
          })),
        };
        // (boats are no longer a static layer — they sail live in
        // DriftingBoats, rendered alongside NeytalOcean below)
        const huts: PropLayer = {
          geometry: buildHut(),
          color: "#ffffff",
          vertexColors: true,
          // up on the arrival shore (+z, the palai side), watching the water
          matrices: place(3, () => {
            const side = rand() > 0.5 ? 1 : -1;
            const x = side * (20 + rand() * 26);
            const z = 8 + rand() * 14; // clear of the palai seam-blend band
            return { x, z, scale: 0.9 + rand() * 0.4, h: ground(x, z) + 0.15, yaw: rand() * Math.PI * 2 };
          }),
        };
        return [lanterns, huts];
      }

      default:
        return [];
    }
  }, [zone, zOffset, density]);

  return (
    <group position={[0, 0, zOffset]}>
      {layers.map((layer, li) => (
        <instancedMesh
          key={li}
          args={[layer.geometry, undefined, layer.matrices.length]}
          ref={(mesh) => {
            if (!mesh) return;
            layer.matrices.forEach((mat, i) => mesh.setMatrixAt(i, mat));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        >
          <meshStandardMaterial
            color={layer.color}
            vertexColors={layer.vertexColors}
            emissive={layer.emissive ?? "#000000"}
            emissiveIntensity={layer.emissiveIntensity ?? 0}
            flatShading
            roughness={0.9}
          />
        </instancedMesh>
      ))}
    </group>
  );
}

/** Birds wheeling slowly over a zone — eagles over palai's noon heat,
    gulls over the neytal surf. One rotating group; the only animated
    element in the terrain, and deliberately cheap (≤ a handful of meshes). */
function CirclingBirds({
  zOffset,
  y,
  radius,
  count,
  color,
  speed,
  size = 1,
}: {
  zOffset: number;
  y: number;
  radius: number;
  count: number;
  color: string;
  speed: number;
  size?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const geom = useMemo(() => buildBird(color), [color]);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * speed;
  });
  return (
    <group ref={group} position={[0, y, zOffset]}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            geometry={geom}
            position={[Math.cos(a) * radius, (i % 3) * 1.4, Math.sin(a) * radius]}
            rotation={[0, -a, 0.18]}
            scale={size}
          >
            <meshStandardMaterial vertexColors flatShading roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/** The lighthouse on the neytal headland: static banded tower, a warm
    always-on lamp, and a slow rotating double beam sweeping the water. */
function Lighthouse({ position }: { position: [number, number, number] }) {
  const beam = useRef<THREE.Group>(null);
  const geom = useMemo(() => buildLighthouse(), []);
  useFrame((_, delta) => {
    if (beam.current) beam.current.rotation.y += delta * 0.45;
  });
  return (
    <group position={position} scale={2.1}>
      <mesh geometry={geom}>
        <meshStandardMaterial vertexColors flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, 5.35, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#ffe9a8" emissive="#ffd76a" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 5.35, 0]} color="#ffd98c" intensity={60} distance={70} decay={1.7} />
      {/* two opposed translucent cones, apexes at the lamp, sweeping slowly */}
      <group ref={beam} position={[0, 5.35, 0]}>
        {[1, -1].map((dir) => (
          <mesh key={dir} position={[dir * 5, 0, 0]} rotation={[0, 0, (dir * Math.PI) / 2]}>
            <coneGeometry args={[0.55, 10, 8, 1, true]} />
            <meshBasicMaterial color="#ffe9a8" transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Catamarans under sail on the open water — each drifts a slow loop,
    bow following the path, with a gentle bob and roll from the swell. */
function DriftingBoats({ count = 3 }: { count?: number }) {
  const geom = useMemo(() => buildCatamaran(), []);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const boats = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: -30 + i * 28,
        z: -16 - (i % 2) * 14,
        r: 5 + i * 2,
        phase: i * 2.1,
        speed: 0.05 + i * 0.012,
      })),
    [count],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    boats.forEach((b, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = t * b.speed + b.phase;
      g.position.set(
        b.x + Math.cos(a) * b.r,
        -2.05 + Math.sin(t * 0.6 + b.phase) * 0.07,
        b.z + Math.sin(a) * b.r * 0.7,
      );
      g.rotation.y = -a + Math.PI / 2; // bow follows the drift loop
      g.rotation.z = Math.sin(t * 0.5 + b.phase) * 0.04; // gentle roll
    });
  });
  return (
    <>
      {boats.map((b, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[b.x, -2.05, b.z]}
        >
          <mesh geometry={geom}>
            <meshStandardMaterial vertexColors flatShading roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** The neytal sea — the peaceful open water the whole journey ends on.
    The plane runs well past the last zone so the camera never finds an
    edge, only water dissolving into fog. A moonlight glint path lies along
    the corridor's line of travel, pointing the way out; the entire surface
    breathes with one slow swell (a single-mesh y-bob — no vertex work). */
function NeytalOcean({ zOffset }: { zOffset: number }) {
  const water = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (water.current) water.current.position.y = Math.sin(clock.elapsedTime * 0.28) * 0.09;
  });
  return (
    <group ref={water}>
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.2, zOffset - 20]}>
        <planeGeometry args={[260, ZONE_LEN + 140]} />
        <meshStandardMaterial color="#123047" transparent opacity={0.85} roughness={0.25} metalness={0.4} />
      </mesh>
      {/* the moon's glint path, fading out toward the horizon with the fog */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.14, zOffset - 30]}>
        <planeGeometry args={[3.4, 90]} />
        <meshStandardMaterial
          color="#9fc4e0"
          emissive="#bcd8ee"
          emissiveIntensity={0.5}
          transparent
          opacity={0.28}
          roughness={0.4}
        />
      </mesh>
      {/* a cool low moon-glow over the far water */}
      <pointLight position={[0, 8, zOffset - 45]} color="#a8c8e8" intensity={90} distance={80} decay={1.9} />
    </group>
  );
}

export function Terrain({ detail = 96, low = false }: { detail?: number; low?: boolean }) {
  const density = low ? 0.6 : 1;
  return (
    <group>
      {ZONES.map((zone, i) => {
        const zOffset = -(i * ZONE_LEN) - ZONE_LEN / 2;
        return (
          <group key={zone.key}>
            <mesh geometry={zoneGeometry(zone, detail, ZONES[i - 1], ZONES[i + 1])} position={[0, 0, zOffset]} receiveShadow>
              {/* ground color now lives in the vertex colors (material color
                  stays white); the subtle self-glow in the thinai hue keeps
                  the land reading before the zone's point light reaches it */}
              <meshStandardMaterial color="#ffffff" vertexColors emissive={zone.glow} emissiveIntensity={0.16} flatShading roughness={1} />
            </mesh>
            {/* the thinai's light — each zone is lit in its own hue */}
            <pointLight position={[0, 18, zOffset]} color={zone.glow} intensity={260} distance={95} decay={1.8} />
            <ZoneProps zone={zone} zOffset={zOffset} density={density} />
            {zone.props === "fields" && (
              /* the lotus pond — buffalo wallow at its edge, cranes wade its rim */
              <mesh rotation-x={-Math.PI / 2} position={[34, -0.55, zOffset + 6]}>
                <circleGeometry args={[9.5, 24]} />
                <meshStandardMaterial color="#1d4a5e" transparent opacity={0.9} roughness={0.3} metalness={0.2} />
              </mesh>
            )}
            {zone.props === "dunes" && (
              <CirclingBirds zOffset={zOffset} y={19} radius={26} count={low ? 2 : 3} color="#2b2118" speed={0.14} size={3.2} />
            )}
            {zone.props === "sea" && (
              <>
                {/* gulls wheeling slowly over the open water */}
                <CirclingBirds zOffset={zOffset - 15} y={10} radius={32} count={low ? 2 : 4} color="#e8e4da" speed={0.12} size={1.3} />
                <NeytalOcean zOffset={zOffset} />
                {/* headland lighthouse right on the shoreline, beam sweeping the sea */}
                <Lighthouse position={[-28, zoneHeight(zone, -28, -2), zOffset - 2]} />
                <group position={[0, 0, zOffset]}>
                  <DriftingBoats count={low ? 2 : 3} />
                </group>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}
