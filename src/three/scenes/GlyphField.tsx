"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SCRIPTS } from "@/lib/content";
import { WORLD_LEN, mulberry32 } from "@/three/materials/zones";

/** Every Indic glyph from BRAND_AND_CONTENT §4 — all of them, exactly
    once — floating subtly along the whole journey. Textures are drawn
    with the site's own display font (resolved from --font-display), so
    3D and DOM typography match. Kept quiet: low opacity, slow drift,
    additive glow suppressed. */
function makeGlyphTexture(glyph: string, family: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `500 ${size * 0.62}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(242,235,221,0.5)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#e9e2d2";
  ctx.fillText(glyph, size / 2, size / 2 + size * 0.04);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type GlyphSprite = { tex: THREE.CanvasTexture; pos: THREE.Vector3; phase: number; speed: number; scale: number };

export function GlyphField({ density = 1 }: { density?: number }) {
  const [sprites, setSprites] = useState<GlyphSprite[]>([]);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    let disposed = false;
    const build = () => {
      if (disposed) return;
      const cs = getComputedStyle(document.documentElement);
      const displayVar = cs.getPropertyValue("--font-display").trim();
      const family = displayVar ? `${displayVar}, "Noto Sans Tamil", sans-serif` : `"Noto Sans Tamil", sans-serif`;

      // ALL glyphs, each exactly once (density < 1 thins evenly for low mode)
      const all = SCRIPTS.flatMap((s) => s.glyphs).filter((_, i) => density >= 1 || i % 2 === 0);
      const rand = mulberry32(2026);
      const list: GlyphSprite[] = all.map((glyph, i) => ({
        tex: makeGlyphTexture(glyph, family),
        // peripheral bands only: |x| ∈ [24, 62] — the central corridor
        // (where content and the camera path live) stays clear
        pos: new THREE.Vector3(
          (rand() > 0.5 ? 1 : -1) * (24 + rand() * 38),
          4 + rand() * 22,
          -((i + rand() * 0.8) / all.length) * WORLD_LEN
        ),
        phase: rand() * Math.PI * 2,
        speed: 0.25 + rand() * 0.25,
        scale: 1.1 + rand() * 1.4,
      }));
      setSprites(list);
    };
    if (document.fonts?.ready) document.fonts.ready.then(build);
    else build();
    return () => {
      disposed = true;
    };
  }, [density]);

  useEffect(() => () => sprites.forEach((s) => s.tex.dispose()), [sprites]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = sprites[i];
      if (!s) return;
      child.position.y = s.pos.y + Math.sin(t * s.speed + s.phase) * 0.5;
      child.position.x = s.pos.x + Math.cos(t * s.speed * 0.6 + s.phase) * 0.35;
    });
  });

  return (
    <group ref={group}>
      {sprites.map((s, i) => (
        <sprite key={i} position={s.pos} scale={[s.scale, s.scale, 1]}>
          <spriteMaterial map={s.tex} transparent opacity={0.18} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}
