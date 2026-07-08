"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { ZONES, ZONE_LEN, mulberry32, type Zone } from "@/three/materials/zones";

const noise = createNoise2D(mulberry32(1337));

/** Heightfield for one zone. A soft valley is carved along x≈0 so the
    camera path always reads as a traversable corridor through the world. */
function zoneGeometry(zone: Zone, detail: number) {
  const width = 180;
  const g = new THREE.PlaneGeometry(width, ZONE_LEN + 24, detail, Math.round(detail * 0.6));
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const valley = Math.min(1, Math.pow(Math.abs(x) / 16, 1.4)); // clear corridor
    let h = noise(x * zone.freq, z * zone.freq) * zone.amp * valley;
    if (zone.props === "peaks") h += Math.max(0, noise(x * 0.02, z * 0.02)) * 26 * valley; // kurinji ridges
    if (zone.props === "dunes") h = Math.abs(h) * 1.4; // palai dune ripple
    if (zone.props === "sea") h -= Math.max(0, (z / (ZONE_LEN / 2)) * 6); // neytal slopes into water
    pos.setY(i, h - 1.5);
  }
  g.computeVertexNormals();
  return g;
}

/** Zone-specific instanced props — low-poly, one draw call each. */
function ZoneProps({ zone, zOffset }: { zone: Zone; zOffset: number }) {
  const rand = useMemo(() => mulberry32(zOffset * 7 + 11), [zOffset]);

  const { matrices, geom, color } = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    const tmp = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();

    const place = (count: number, fn: (i: number) => { x: number; z: number; scale: number; h: number }) => {
      for (let i = 0; i < count; i++) {
        const { x, z, scale, h } = fn(i);
        p.set(x, h, z);
        s.setScalar(scale);
        tmp.compose(p, q, s);
        m.push(tmp.clone());
      }
    };

    let geometry: THREE.BufferGeometry;
    let c = zone.glow;

    switch (zone.props) {
      case "trees": // mullai — cone forest either side of the corridor
        geometry = new THREE.ConeGeometry(1, 4, 5);
        place(90, () => {
          const side = rand() > 0.5 ? 1 : -1;
          const x = side * (14 + rand() * 55);
          const z = (rand() - 0.5) * ZONE_LEN;
          return { x, z, scale: 0.8 + rand() * 1.8, h: 1 };
        });
        c = "#2f6e4b";
        break;
      case "fields": // marutham — flat paddy strips in rows
        geometry = new THREE.BoxGeometry(10, 0.25, 4);
        place(60, (i) => ({
          x: (i % 2 === 0 ? 1 : -1) * (16 + (i % 5) * 11),
          z: -ZONE_LEN / 2 + (i / 60) * ZONE_LEN,
          scale: 0.9 + rand() * 0.4,
          h: 0.1,
        }));
        c = "#6e6420";
        break;
      case "peaks": // kurinji — shard monoliths on the ridgelines
        geometry = new THREE.TetrahedronGeometry(2.4);
        place(26, () => {
          const side = rand() > 0.5 ? 1 : -1;
          return { x: side * (24 + rand() * 50), z: (rand() - 0.5) * ZONE_LEN, scale: 1 + rand() * 2.4, h: 6 + rand() * 12 };
        });
        break;
      case "dunes": // palai — scattered stones
        geometry = new THREE.DodecahedronGeometry(0.9);
        place(40, () => ({
          x: (rand() - 0.5) * 130,
          z: (rand() - 0.5) * ZONE_LEN,
          scale: 0.5 + rand() * 1.4,
          h: 0.4,
        }));
        c = "#7a4530";
        break;
      case "sea": // neytal — light buoys marking the far shore
        geometry = new THREE.SphereGeometry(0.6, 8, 8);
        place(24, () => ({
          x: (rand() - 0.5) * 120,
          z: rand() * (ZONE_LEN / 2),
          scale: 0.6 + rand() * 0.8,
          h: -0.5 + rand() * 0.6,
        }));
        break;
    }
    return { matrices: m, geom: geometry, color: c };
  }, [zone, rand]);

  return (
    <instancedMesh
      args={[geom, undefined, matrices.length]}
      position={[0, 0, zOffset]}
      ref={(mesh) => {
        if (!mesh) return;
        matrices.forEach((mat, i) => mesh.setMatrixAt(i, mat));
        mesh.instanceMatrix.needsUpdate = true;
      }}
    >
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </instancedMesh>
  );
}

export function Terrain({ detail = 96 }: { detail?: number }) {
  return (
    <group>
      {ZONES.map((zone, i) => {
        const zOffset = -(i * ZONE_LEN) - ZONE_LEN / 2;
        return (
          <group key={zone.key}>
            <mesh geometry={zoneGeometry(zone, detail)} position={[0, 0, zOffset]} receiveShadow>
              <meshStandardMaterial color={zone.ground} flatShading roughness={1} />
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
