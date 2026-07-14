"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload, Stars } from "@react-three/drei";
import { Terrain } from "./Terrain";
import { GlyphField } from "./GlyphField";
import { CameraRig } from "./CameraRig";
import { SangamObjects } from "./SangamObjects";

/** The full-viewport WebGL world behind the page.
    Adaptive on three levels:
    1. Mount gate — no WebGL or prefers-reduced-motion → never mounts; the
       DOM ambient-gradient system is the complete experience.
    2. Static heuristic — small screens / ≤4 cores start in "low".
    3. Live adaptation — drei PerformanceMonitor watches real FPS and
       demotes high→low at runtime (fewer lamps/glyphs, DPR 1, no AA,
       tighter fog); AdaptiveDpr additionally scales resolution under
       sustained load. Promotion back up is deliberately not done — no
       quality flicker. */
export default function ThinaiWorld() {
  const [mounted, setMounted] = useState(false);
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return;
      setLow(window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4);
      setMounted(true);
    } catch {
      /* stay unmounted — gradient fallback */
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={low ? 1 : [1, 1.5]}
        gl={{ antialias: !low, powerPreference: "high-performance" }}
        camera={{ position: [0, 9, 6], fov: 58, near: 0.1, far: 240 }}
        onCreated={(state) => {
          // debug handle for tooling (Playwright scene inspection)
          (window as unknown as Record<string, unknown>).__r3fState = state;
        }}
      >
        <PerformanceMonitor onDecline={() => setLow(true)}>
          <color attach="background" args={["#0b0e1a"]} />
          <fog attach="fog" args={["#0b0e1a", 40, low ? 150 : 210]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[30, 60, 20]} intensity={1.1} color="#e3b458" />
          <Stars radius={140} depth={60} count={low ? 600 : 1400} factor={3} saturation={0} fade speed={0.35} />
          <CameraRig />
          <Terrain detail={low ? 56 : 96} low={low} />
          <SangamObjects low={low} />
          <GlyphField density={low ? 0.5 : 1} />
          <AdaptiveDpr />
          <Preload all />
        </PerformanceMonitor>
      </Canvas>
      {/* legibility scrim: gentle vignette so the landscape stays visible
          (and its scroll motion legible) while DOM text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,14,26,0.32)_88%)]" />
      <div className="absolute inset-0 bg-night/15" />
    </div>
  );
}
