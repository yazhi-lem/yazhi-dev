"use client";
import { useMemo } from "react";
import * as THREE from "three";
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

const OVERLAP = 24;
const FULL_LEN = ZONE_LEN + OVERLAP;

/** Raw terrain height for one zone at its own local (x, z). Shared by
    zoneGeometry both for the zone itself and for sampling a neighbor's
    surface when blending across a seam. */
function zoneHeight(zone: Zone, x: number, z: number) {
  const valley = Math.min(1, Math.pow(Math.abs(x) / 16, 1.4)); // clear corridor
  let h = noise(x * zone.freq, z * zone.freq) * zone.amp * valley;
  if (zone.props === "peaks") h += Math.max(0, noise(x * 0.02, z * 0.02)) * 26 * valley; // kurinji ridges
  if (zone.props === "dunes") h = Math.abs(h) * 1.4; // palai dune ripple
  if (zone.props === "sea") h -= Math.max(0, (z / (ZONE_LEN / 2)) * 6); // neytal slopes into water
  return h - 1.5;
}

/** Heightfield for one zone. A soft valley is carved along x≈0 so the
    camera path always reads as a traversable corridor through the world.
    Each zone's plane overlaps its neighbors by OVERLAP units so there's no
    literal gap, but two independent noise fields crossing in that overlap
    used to read as a crack/seam; blending each zone's edge toward its
    neighbor's own height there makes it one continuous surface. */
function zoneGeometry(zone: Zone, detail: number, prev?: Zone, next?: Zone) {
  const width = 180;
  const g = new THREE.PlaneGeometry(width, FULL_LEN, detail, Math.round(detail * 0.6));
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const half = ZONE_LEN / 2;
  const feather = OVERLAP / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let h = zoneHeight(zone, x, z);
    if (next && z > half - feather) {
      const t = THREE.MathUtils.smoothstep(z, half - feather, half + feather);
      h = THREE.MathUtils.lerp(h, zoneHeight(next, x, z + ZONE_LEN), t);
    } else if (prev && z < -half + feather) {
      const t = THREE.MathUtils.smoothstep(z, -half - feather, -half + feather);
      h = THREE.MathUtils.lerp(zoneHeight(prev, x, z - ZONE_LEN), h, t);
    }
    pos.setY(i, h);
  }
  g.computeVertexNormals();
  return g;
}

type PropLayer = {
  geometry: THREE.BufferGeometry;
  matrices: THREE.Matrix4[];
  color: string; // "#ffffff" for vertex-colored compound geometries
  vertexColors?: boolean;
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
    Every zone but marutham has a single layer; marutham (rice fields) is
    the one landscape rendered as a scene rather than a scatter — paddies,
    a palm treeline, grazing deer, sleeping elephants, and one kundru. */
function ZoneProps({ zone, zOffset }: { zone: Zone; zOffset: number }) {
  const rand = useMemo(() => mulberry32(zOffset * 7 + 11), [zOffset]);

  const layers = useMemo<PropLayer[]>(() => {
    switch (zone.props) {
      case "trees": // mullai — cone forest either side of the corridor
        return [
          {
            geometry: new THREE.ConeGeometry(1, 4, 5),
            color: "#2f6e4b",
            // spans the full FULL_LEN (zone + overlap on both edges) so the
            // treeline doesn't thin out into bald patches at the zone seams
            matrices: place(104, () => {
              const side = rand() > 0.5 ? 1 : -1;
              const x = side * (14 + rand() * 55);
              const z = (rand() - 0.5) * FULL_LEN;
              return { x, z, scale: 0.8 + rand() * 1.8, h: 1 };
            }),
          },
        ];

      case "fields": { // marutham — rice paddies, palms, deer, elephants, a kundru
        const paddy: PropLayer = {
          geometry: new THREE.BoxGeometry(10, 0.25, 4),
          color: "#6e6420",
          matrices: place(70, (i) => ({
            x: (i % 2 === 0 ? 1 : -1) * (16 + (i % 5) * 11),
            z: -FULL_LEN / 2 + (i / 70) * FULL_LEN,
            scale: 0.9 + rand() * 0.4,
            h: 0.1,
          })),
        };
        const palms: PropLayer = {
          geometry: buildPalm(),
          color: "#ffffff",
          vertexColors: true,
          // lining the paddy strips like a field boundary, clear of the
          // corridor (|x| > 26) and thinned so they read as a treeline
          matrices: place(22, () => {
            const side = rand() > 0.5 ? 1 : -1;
            return { x: side * (28 + rand() * 48), z: (rand() - 0.5) * FULL_LEN, scale: 0.85 + rand() * 0.5, h: 0, yaw: rand() * Math.PI * 2 };
          }),
        };
        const deer: PropLayer = {
          geometry: buildDeer(),
          color: "#ffffff",
          vertexColors: true,
          // a small herd grazing near the corridor's edge, each on its own heading
          matrices: place(6, () => {
            const side = rand() > 0.5 ? 1 : -1;
            return { x: side * (18 + rand() * 20), z: (rand() - 0.5) * ZONE_LEN, scale: 0.9 + rand() * 0.3, h: 0, yaw: rand() * Math.PI * 2 };
          }),
        };
        const elephants: PropLayer = {
          geometry: buildSleepingElephant(),
          color: "#ffffff",
          vertexColors: true,
          // just two, tucked further out — sleeping elephants are a rare sight, not a herd
          matrices: place(2, (i) => {
            const side = i === 0 ? 1 : -1;
            return { x: side * (38 + rand() * 18), z: (rand() - 0.5) * ZONE_LEN * 0.7, scale: 1 + rand() * 0.3, h: 0, yaw: rand() * Math.PI * 2 };
          }),
        };
        const kundru: PropLayer = {
          geometry: buildKundru(),
          color: "#ffffff",
          vertexColors: true,
          // one fixed landmark, off to one side so it never blocks the camera path
          matrices: place(1, () => ({ x: -62, z: 4, scale: 1, h: 0, yaw: 0.4 })),
        };
        return [paddy, palms, deer, elephants, kundru];
      }

      case "peaks": // kurinji — shard monoliths on the ridgelines
        return [
          {
            geometry: new THREE.TetrahedronGeometry(2.4),
            color: zone.glow,
            matrices: place(30, () => {
              const side = rand() > 0.5 ? 1 : -1;
              return { x: side * (24 + rand() * 50), z: (rand() - 0.5) * FULL_LEN, scale: 1 + rand() * 2.4, h: 6 + rand() * 12 };
            }),
          },
        ];

      case "dunes": // palai — scattered stones
        return [
          {
            geometry: new THREE.DodecahedronGeometry(0.9),
            color: "#7a4530",
            matrices: place(46, () => ({
              x: (rand() - 0.5) * 130,
              z: (rand() - 0.5) * FULL_LEN,
              scale: 0.5 + rand() * 1.4,
              h: 0.4,
            })),
          },
        ];

      case "sea": // neytal — light buoys marking the far shore
        return [
          {
            geometry: new THREE.SphereGeometry(0.6, 8, 8),
            color: zone.glow,
            matrices: place(24, () => ({
              x: (rand() - 0.5) * 120,
              z: rand() * (FULL_LEN / 2),
              scale: 0.6 + rand() * 0.8,
              h: -0.5 + rand() * 0.6,
            })),
          },
        ];

      default:
        return [];
    }
  }, [zone, rand]);

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
          <meshStandardMaterial color={layer.color} vertexColors={layer.vertexColors} flatShading roughness={0.9} />
        </instancedMesh>
      ))}
    </group>
  );
}

export function Terrain({ detail = 96 }: { detail?: number }) {
  return (
    <group>
      {ZONES.map((zone, i) => {
        const zOffset = -(i * ZONE_LEN) - ZONE_LEN / 2;
        return (
          <group key={zone.key}>
            <mesh geometry={zoneGeometry(zone, detail, ZONES[i - 1], ZONES[i + 1])} position={[0, 0, zOffset]} receiveShadow>
              {/* subtle self-glow in the thinai hue so the land always reads,
                  even before the zone's point light reaches it */}
              <meshStandardMaterial color={zone.ground} emissive={zone.glow} emissiveIntensity={0.16} flatShading roughness={1} />
            </mesh>
            {/* the thinai's light — each zone is lit in its own hue */}
            <pointLight position={[0, 18, zOffset]} color={zone.glow} intensity={260} distance={95} decay={1.8} />
            <ZoneProps zone={zone} zOffset={zOffset} />
            {zone.props === "sea" && (
              <mesh rotation-x={-Math.PI / 2} position={[0, -2.2, zOffset + 8]}>
                <planeGeometry args={[220, ZONE_LEN + 40]} />
                <meshStandardMaterial color="#123047" transparent opacity={0.85} roughness={0.25} metalness={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
