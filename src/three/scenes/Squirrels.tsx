"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sampleWorldHeight } from "@/three/materials/heightfield";

/* A handful of squirrels running the length of the corridor — through
   kurinji, mullai, marutham, palai — and leaping into the neytal sea at
   the far end. Purely decorative wildlife: not instanced (only a few of
   them, each independently animated, unlike the hundreds of static trees),
   ground-following via the same `sampleWorldHeight` the terrain and prop
   placement use, so a squirrel's feet always match the land beneath it. */

const RUN_START_Z = 22; // emerges near the hero, before kurinji begins
const JUMP_START_Z = -300; // the beach, just short of open water
const JUMP_END_Z = -332; // out over the swell — the splash point
const RUN_LEN = RUN_START_Z - JUMP_START_Z;
const JUMP_LEN = JUMP_START_Z - JUMP_END_Z;
const LOOP_LEN = RUN_LEN + JUMP_LEN;
const RESPAWN_PAUSE = 4; // seconds hidden after a splash before it runs again

type SquirrelDef = {
  x: number; // lane offset from the corridor centerline
  wander: number; // lateral wander amplitude
  speed: number; // world units per second
  phase: number; // stagger so squirrels aren't all mid-run at once
};

const FUR = "#a9713f";
const FUR_LIGHT = "#c98f56";
const FUR_DARK = "#7d5430";

function Squirrel({ def }: { def: SquirrelDef }) {
  const group = useRef<THREE.Group>(null);
  const legFL = useRef<THREE.Mesh>(null);
  const legFR = useRef<THREE.Mesh>(null);
  const legBL = useRef<THREE.Mesh>(null);
  const legBR = useRef<THREE.Mesh>(null);
  const splash = useRef<THREE.Group>(null);
  const period = LOOP_LEN / def.speed + RESPAWN_PAUSE;

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = (clock.elapsedTime + def.phase) % period;
    const runDuration = LOOP_LEN / def.speed;

    if (t >= runDuration) {
      g.visible = false;
      if (splash.current) splash.current.visible = false;
      return;
    }

    const dist = t * def.speed;
    const x = def.x + Math.sin(t * 2.4) * def.wander;
    g.visible = true;

    if (dist < RUN_LEN) {
      const z = RUN_START_Z - dist;
      const groundY = sampleWorldHeight(x, z);
      const bob = Math.abs(Math.sin(t * 9)) * 0.18;
      g.position.set(x, groundY + 0.26 + bob, z);
      g.rotation.x = 0;
      if (splash.current) splash.current.visible = false;
      const swing = Math.sin(t * 16) * 0.6;
      if (legFL.current) legFL.current.rotation.x = swing;
      if (legBR.current) legBR.current.rotation.x = swing;
      if (legFR.current) legFR.current.rotation.x = -swing;
      if (legBL.current) legBL.current.rotation.x = -swing;
    } else {
      // the leap: a parabolic arc off the beach, diving into open water
      const jt = (dist - RUN_LEN) / JUMP_LEN;
      const z = JUMP_START_Z - jt * JUMP_LEN;
      const groundStart = sampleWorldHeight(def.x, 12);
      const arc = Math.sin(Math.min(1, jt) * Math.PI) * 4.5;
      g.position.set(x, groundStart + 0.5 + arc - jt * 1.2, z);
      g.rotation.x = -jt * 0.7;
      if (splash.current) {
        const showing = jt > 0.9;
        splash.current.visible = showing;
        if (showing) {
          splash.current.position.set(x, groundStart - 1.35, JUMP_END_Z);
          splash.current.scale.setScalar(Math.max(0.01, ((jt - 0.9) / 0.1) * 2.4));
        }
      }
    }
  });

  return (
    <>
      <group ref={group}>
        <group rotation-y={Math.PI}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.24, 0.2, 0.42]} />
            <meshStandardMaterial color={FUR} flatShading roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.26, 0.26]}>
            <sphereGeometry args={[0.13, 7, 6]} />
            <meshStandardMaterial color={FUR_LIGHT} flatShading roughness={0.95} />
          </mesh>
          <mesh position={[0.06, 0.36, 0.28]} rotation-z={-0.2}>
            <coneGeometry args={[0.04, 0.09, 5]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
          <mesh position={[-0.06, 0.36, 0.28]} rotation-z={0.2}>
            <coneGeometry args={[0.04, 0.09, 5]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
          {/* the bushy tail — three shrinking spheres arching up over the back */}
          <mesh position={[0, 0.4, -0.22]} scale={[0.9, 1, 0.9]}>
            <sphereGeometry args={[0.15, 7, 6]} />
            <meshStandardMaterial color={FUR_LIGHT} flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 0.56, -0.1]} scale={[0.75, 0.9, 0.75]}>
            <sphereGeometry args={[0.13, 7, 6]} />
            <meshStandardMaterial color={FUR_LIGHT} flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 0.62, 0.06]} scale={[0.55, 0.7, 0.55]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color={FUR_LIGHT} flatShading roughness={1} />
          </mesh>
          {/* legs, opposite pairs swinging together for a running gait */}
          <mesh ref={legFL} position={[0.08, 0, 0.15]}>
            <boxGeometry args={[0.045, 0.2, 0.045]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
          <mesh ref={legFR} position={[-0.08, 0, 0.15]}>
            <boxGeometry args={[0.045, 0.2, 0.045]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
          <mesh ref={legBL} position={[0.08, 0, -0.14]}>
            <boxGeometry args={[0.045, 0.2, 0.045]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
          <mesh ref={legBR} position={[-0.08, 0, -0.14]}>
            <boxGeometry args={[0.045, 0.2, 0.045]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
        </group>
      </group>
      {/* the splash where the leap meets the water */}
      <group ref={splash} visible={false}>
        <mesh rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.08, 0.5, 12]} />
          <meshBasicMaterial color="#bfe6f2" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

export function Squirrels({ low = false }: { low?: boolean }) {
  const defs = useMemo<SquirrelDef[]>(() => {
    const all: SquirrelDef[] = [
      { x: 6, wander: 2.5, speed: 9, phase: 0 },
      { x: -8, wander: 3, speed: 7.5, phase: 34 },
      { x: 4, wander: 2, speed: 10.5, phase: 68 },
    ];
    return low ? all.slice(0, 1) : all;
  }, [low]);

  return (
    <group>
      {defs.map((d, i) => (
        <Squirrel key={i} def={d} />
      ))}
    </group>
  );
}
