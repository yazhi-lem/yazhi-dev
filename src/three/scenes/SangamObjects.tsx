"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ZONE_LEN, WORLD_LEN, mulberry32 } from "@/three/materials/zones";

/* ============================================================
   Sangam-era set dressing — the holistic-utopia layer.
   Everything procedural, low-poly, warm-lit:
   · thinai gateway pillars between zones (the journey has thresholds)
   · kurinji bloom scatter on the mountain slopes
   · mullai shepherd huts at the forest edge
   · marutham granaries (kalanjiyam) + palmyra among the fields
   · palai nadukal — hero stones — standing in the crossing
   · neytal catamarans bobbing beside a shore beacon
   · karthigai lamp-points drifting through the whole world
   ============================================================ */

const zOf = (i: number) => -(i * ZONE_LEN) - ZONE_LEN / 2;

/* ---- temple stone pillars at each zone threshold ----
   Free-standing South-Indian temple pillars (kal thoon): a stepped plinth,
   a square granite shaft with carved bands, and a flared corbel capital.
   No lintel — each threshold is a pair of standing stones, not a gateway. */
function Pillar({ hue }: { hue: string }) {
  const stone = "#8b8279"; // weathered granite
  // fresh material each call; faint zone-hue emissive keeps the thinai tint
  const mat = (ei = 0.06) => (
    <meshStandardMaterial color={stone} flatShading roughness={1} emissive={hue} emissiveIntensity={ei} />
  );
  return (
    <group>
      {/* two-step plinth (adhisthana) */}
      <mesh position={[0, 0.5, 0]}><boxGeometry args={[3.6, 1, 3.6]} />{mat()}</mesh>
      <mesh position={[0, 1.4, 0]}><boxGeometry args={[2.9, 0.9, 2.9]} />{mat()}</mesh>
      {/* square shaft */}
      <mesh position={[0, 6.4, 0]}><boxGeometry args={[1.9, 9, 1.9]} />{mat(0.08)}</mesh>
      {/* carved bands */}
      <mesh position={[0, 3.7, 0]}><boxGeometry args={[2.2, 0.5, 2.2]} />{mat()}</mesh>
      <mesh position={[0, 9.1, 0]}><boxGeometry args={[2.2, 0.5, 2.2]} />{mat()}</mesh>
      {/* flared corbel capital (potikai) */}
      <mesh position={[0, 11.1, 0]}><boxGeometry args={[3, 1.2, 3]} />{mat(0.12)}</mesh>
      <mesh position={[0, 12, 0]}><boxGeometry args={[2.2, 0.6, 2.2]} />{mat(0.08)}</mesh>
    </group>
  );
}

function Gates() {
  const hues = ["#5fb37e", "#b7a03c", "#d97a58", "#5f9fc9"]; // hue of the zone being entered
  return (
    <group>
      {hues.map((hue, i) => {
        const z = -((i + 1) * ZONE_LEN);
        return (
          <group key={i} position={[0, 0, z]}>
            {[-11, 11].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <Pillar hue={hue} />
              </group>
            ))}
            <pointLight position={[0, 9, 0]} color={hue} intensity={70} distance={34} decay={1.9} />
          </group>
        );
      })}
    </group>
  );
}

/* ---- kurinji blooms — the violet flowering, instanced ---- */
function KurinjiBlooms() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const matrices = useMemo(() => {
    const rand = mulberry32(41);
    const tmp = new THREE.Object3D();
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i < 130; i++) {
      const side = rand() > 0.5 ? 1 : -1;
      tmp.position.set(side * (18 + rand() * 55), 0.4 + rand() * 7, zOf(0) + (rand() - 0.5) * ZONE_LEN);
      tmp.scale.setScalar(0.5 + rand() * 0.8);
      tmp.updateMatrix();
      list.push(tmp.matrix.clone());
    }
    return list;
  }, []);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, matrices.length]}
      onUpdate={(m) => {
        matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
        m.instanceMatrix.needsUpdate = true;
      }}
    >
      <icosahedronGeometry args={[0.26]} />
      <meshStandardMaterial color="#8b7ae0" emissive="#8b7ae0" emissiveIntensity={0.55} roughness={0.6} />
    </instancedMesh>
  );
}

/* ---- mullai shepherd huts ---- */
function Huts() {
  const spots = useMemo(() => {
    const rand = mulberry32(52);
    return Array.from({ length: 7 }, () => ({
      x: (rand() > 0.5 ? 1 : -1) * (22 + rand() * 30),
      z: zOf(1) + (rand() - 0.5) * (ZONE_LEN - 14),
      r: rand() * Math.PI * 2,
      s: 0.85 + rand() * 0.5,
    }));
  }, []);
  return (
    <group>
      {spots.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation-y={p.r} scale={p.s}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[2.1, 2.4, 2.2, 8]} />
            <meshStandardMaterial color="#4a3f2c" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <coneGeometry args={[3, 2.3, 8]} />
            <meshStandardMaterial color="#6b5a34" flatShading roughness={1} />
          </mesh>
          {/* hearth-light at the door */}
          <pointLight position={[0, 1.2, 2.6]} color="#e3b458" intensity={9} distance={9} decay={2} />
        </group>
      ))}
    </group>
  );
}

/* ---- marutham granaries + palmyra ---- */
function Granaries() {
  const rand = useMemo(() => mulberry32(63), []);
  const granaries = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        x: (rand() > 0.5 ? 1 : -1) * (20 + rand() * 26),
        z: zOf(2) + (rand() - 0.5) * (ZONE_LEN - 16),
        s: 0.9 + rand() * 0.5,
      })),
    [rand]
  );
  const palms = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        x: (rand() > 0.5 ? 1 : -1) * (30 + rand() * 42),
        z: zOf(2) + (rand() - 0.5) * ZONE_LEN,
        s: 0.8 + rand() * 0.7,
        lean: (rand() - 0.5) * 0.12,
      })),
    [rand]
  );
  return (
    <group>
      {granaries.map((p, i) => (
        <group key={`g${i}`} position={[p.x, 0, p.z]} scale={p.s}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 2.6, 8]} />
            <meshStandardMaterial color="#7a6a3a" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 3.3, 0]}>
            <coneGeometry args={[2.1, 1.7, 8]} />
            <meshStandardMaterial color="#5d4d2a" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
      {palms.map((p, i) => (
        <group key={`p${i}`} position={[p.x, 0, p.z]} scale={p.s} rotation-z={p.lean}>
          <mesh position={[0, 3.4, 0]}>
            <cylinderGeometry args={[0.24, 0.42, 6.8, 6]} />
            <meshStandardMaterial color="#4a3626" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 7, 0]} scale={[1, 0.55, 1]}>
            <icosahedronGeometry args={[1.9, 0]} />
            <meshStandardMaterial color="#3d7a52" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---- palai nadukal — hero stones ---- */
function Nadukal() {
  const stones = useMemo(() => {
    const rand = mulberry32(74);
    return Array.from({ length: 8 }, () => ({
      x: (rand() > 0.5 ? 1 : -1) * (16 + rand() * 34),
      z: zOf(3) + (rand() - 0.5) * (ZONE_LEN - 12),
      tilt: (rand() - 0.5) * 0.14,
      s: 0.8 + rand() * 0.8,
    }));
  }, []);
  return (
    <group>
      {stones.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation-z={p.tilt} scale={p.s}>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[1.7, 3.6, 0.55]} />
            <meshStandardMaterial color="#5b4638" flatShading roughness={1} emissive="#d97a58" emissiveIntensity={0.06} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[2.4, 0.35, 1.2]} />
            <meshStandardMaterial color="#4a382c" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---- neytal catamarans + shore beacon ---- */
function Shore() {
  const boats = useRef<THREE.Group>(null!);
  const spots = useMemo(() => {
    const rand = mulberry32(85);
    return Array.from({ length: 5 }, () => ({
      x: (rand() - 0.5) * 70,
      // the open water is on the FAR side of the zone (local -z) since the
      // neytal shoreline flip in Terrain — boats float there, not on the beach
      z: zOf(4) - 4 - rand() * (ZONE_LEN / 2 - 6),
      r: rand() * Math.PI * 2,
      phase: rand() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!boats.current) return;
    const t = clock.elapsedTime;
    boats.current.children.forEach((b, i) => {
      const p = spots[i];
      if (!p) return;
      b.position.y = -1.7 + Math.sin(t * 0.7 + p.phase) * 0.16;
      b.rotation.z = Math.sin(t * 0.5 + p.phase) * 0.045;
    });
  });

  return (
    <group>
      <group ref={boats}>
        {spots.map((p, i) => (
          <group key={i} position={[p.x, -1.7, p.z]} rotation-y={p.r}>
            {/* hull */}
            <mesh rotation-z={Math.PI / 2} scale={[1, 1, 0.55]}>
              <cylinderGeometry args={[0.75, 0.75, 5.2, 8]} />
              <meshStandardMaterial color="#3a2b1e" flatShading roughness={1} />
            </mesh>
            {/* mast + sail */}
            <mesh position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 3.4, 5]} />
              <meshStandardMaterial color="#4a3626" roughness={1} />
            </mesh>
            <mesh position={[0.75, 2.1, 0]} rotation-y={Math.PI / 2}>
              <planeGeometry args={[1.7, 2.1]} />
              <meshStandardMaterial color="#e9e2d2" side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
      {/* kalangarai vilakkam — the shore beacon, footed below the swell */}
      <group position={[26, -2.5, zOf(4) - 10]}>
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.9, 1.4, 8, 8]} />
          <meshStandardMaterial color="#243244" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 8.4, 0]}>
          <sphereGeometry args={[0.7, 10, 10]} />
          <meshStandardMaterial color="#e3b458" emissive="#e3b458" emissiveIntensity={1.6} />
        </mesh>
        <pointLight position={[0, 8.4, 0]} color="#e3b458" intensity={120} distance={55} decay={1.8} />
      </group>
    </group>
  );
}

/* ---- karthigai lamps — warm points drifting through the whole world ---- */
function Lamps({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, base, phases } = useMemo(() => {
    const rand = mulberry32(96);
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 110;
      pos[i * 3 + 1] = 1.5 + rand() * 14;
      pos[i * 3 + 2] = -rand() * WORLD_LEN;
      ph[i] = rand() * Math.PI * 2;
    }
    return { positions: pos, base: pos.slice(), phases: ph };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.35 + phases[i]) * 0.6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e3b458" size={0.34} transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function SangamObjects({ low = false }: { low?: boolean }) {
  return (
    <group>
      <Gates />
      <KurinjiBlooms />
      <Huts />
      <Granaries />
      <Nadukal />
      <Shore />
      <Lamps count={low ? 70 : 150} />
    </group>
  );
}
