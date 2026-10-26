"use client";
import { useEffect, useRef } from "react";
import type { ThinaiKey } from "@/lib/content";
import { ENV_BY_KEY } from "./environments";

/** The living background of a tinai: one canvas of hairlines that answers
    the pointer the way its landscape would.

      palai     dune contours bend away from the pointer, like heat haze
      mullai    fireflies drift toward the pointer and keep their distance
      kurinji   mist bands drift; they part where the pointer passes
      marutham  seedlings sway; the pointer is wind, a bow spreads from it
      neytal    tide lines breathe; the pointer drops rings that fade out

    Drawn in the scope's own ink (--env-*), so it cross-fades with the rest
    of the page. It never takes the pointer (pointer-events: none), sleeps
    while offscreen or the tab is hidden, and draws one still frame under
    reduced motion. Decorative: aria-hidden. */
export function TinaiAmbient({ tinai, className = "" }: { tinai: ThinaiKey; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const env = ENV_BY_KEY[tinai];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      scene.resize();
      if (reduced) paint(0);
    };

    // the pointer, in canvas px, eased so the field follows rather than snaps
    const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0, ton: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      ptr.tx = x;
      ptr.ty = y;
      ptr.ton = inside ? 1 : 0;
      if (inside && ptr.on < 0.01) { ptr.x = x; ptr.y = y; }
      scene.poke?.(x, y, inside);
      wake();
    };

    const ink = { hi: "#fff", edge: "#888", mid: "#444", lo: "#222", accent: "#888" };
    const readInk = () => {
      const cs = getComputedStyle(canvas);
      ink.hi = cs.getPropertyValue("--env-hi").trim() || ink.hi;
      ink.edge = cs.getPropertyValue("--env-edge").trim() || ink.edge;
      ink.mid = cs.getPropertyValue("--env-mid").trim() || ink.mid;
      ink.lo = cs.getPropertyValue("--env-lo").trim() || ink.lo;
      ink.accent = cs.getPropertyValue("--env-accent").trim() || ink.accent;
    };

    const scene = SCENES[tinai]();
    let raf = 0, last = 0, t = 0, visible = true, inkTick = 0;
    function paint(dt: number) {
      if (inkTick++ % 6 === 0) readInk();
      // the spring of this landscape drives the pointer's ease
      const k = env.spring.k * 0.02;
      const a = Math.min(1, dt * k * 4);
      ptr.x += (ptr.tx - ptr.x) * a;
      ptr.y += (ptr.ty - ptr.y) * a;
      ptr.on += (ptr.ton - ptr.on) * Math.min(1, dt * 3);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineWidth = 1;
      scene.draw(ctx!, { w, h, t, dt, ptr, ink });
    }
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt * env.pace;
      paint(dt);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    }
    function wake() {
      if (reduced) { paint(0.016); return; }
      if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }, { rootMargin: "120px" });
    io.observe(canvas);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    fit();
    wake();
    // the --env-* colours cross-fade over ~900ms after a switch; keep reading them meanwhile
    const settle = window.setTimeout(() => { readInk(); if (reduced) paint(0); }, 1000);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      visible = false;
      window.clearTimeout(settle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [tinai]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}

/* ------------------------------------------------------------------ */

type Ink = { hi: string; edge: string; mid: string; lo: string; accent: string };
type Ptr = { x: number; y: number; on: number };
type Frame = { w: number; h: number; t: number; dt: number; ptr: Ptr; ink: Ink };
type Scene = {
  resize: () => void;
  draw: (ctx: CanvasRenderingContext2D, f: Frame) => void;
  poke?: (x: number, y: number, inside: boolean) => void;
};

const gauss = (d2: number, s: number) => Math.exp(-d2 / (2 * s * s));

/** a cheap, smooth 1-D noise: three detuned sines */
const wave = (x: number, t: number, seed: number) =>
  Math.sin(x * 0.011 + t * 0.9 + seed) * 0.5 + Math.sin(x * 0.023 - t * 0.6 + seed * 2.1) * 0.3 + Math.sin(x * 0.041 + t * 1.3 + seed * 3.7) * 0.2;

const SCENES: Record<ThinaiKey, () => Scene> = {
  /* Palai: dune contours, the heat lifting them away from the pointer */
  palai: () => ({
    resize() {},
    draw(ctx, { w, h, t, ptr, ink }) {
      const gap = 26, rows = Math.ceil(h / gap) + 2;
      for (let r = 0; r < rows; r++) {
        const y0 = r * gap - gap / 2;
        ctx.strokeStyle = r % 4 === 0 ? ink.mid : ink.lo;
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 8) {
          let y = y0 + wave(x, t * 0.6, r * 0.7) * 9 + Math.sin(x * 0.006 + r * 0.4) * 6;
          const dx = x - ptr.x, dy = y - ptr.y;
          const f = gauss(dx * dx + dy * dy, 70) * ptr.on;
          y += Math.sign(dy || 1) * f * 22;
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
  }),

  /* Mullai: fireflies that wander, drift toward the pointer, keep a ring of distance */
  mullai: () => {
    type Fly = { x: number; y: number; vx: number; vy: number; ph: number; sp: number };
    let flies: Fly[] = [];
    let W = 0, H = 0;
    return {
      resize() { flies = []; },
      draw(ctx, { w, h, t, dt, ptr, ink }) {
        if (!flies.length || W !== w || H !== h) {
          W = w; H = h;
          const n = Math.round(Math.min(70, Math.max(18, (w * h) / 16000)));
          flies = Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0, vy: 0,
            ph: Math.random() * 6.28,
            sp: 0.6 + Math.random() * 0.8,
          }));
        }
        for (const f of flies) {
          // wander
          f.vx += Math.cos(t * f.sp + f.ph) * 6 * dt;
          f.vy += Math.sin(t * f.sp * 1.3 + f.ph * 1.7) * 6 * dt;
          // drift toward the pointer, but hold a ring ~70px out
          if (ptr.on > 0.05) {
            const dx = ptr.x - f.x, dy = ptr.y - f.y, d = Math.hypot(dx, dy) || 1;
            if (d < 360) {
              const pull = (d - 70) / d;
              f.vx += dx * pull * 0.9 * dt * ptr.on;
              f.vy += dy * pull * 0.9 * dt * ptr.on;
            }
          }
          f.vx *= 0.97; f.vy *= 0.97;
          f.x += f.vx * dt * 10; f.y += f.vy * dt * 10;
          if (f.x < -20) f.x = w + 20; if (f.x > w + 20) f.x = -20;
          if (f.y < -20) f.y = h + 20; if (f.y > h + 20) f.y = -20;
          const glow = 0.5 + 0.5 * Math.sin(t * 3 * f.sp + f.ph);
          ctx.globalAlpha = 0.15 + glow * 0.75;
          ctx.fillStyle = glow > 0.8 ? ink.hi : ink.accent;
          ctx.beginPath();
          ctx.arc(f.x, f.y, 1.1 + glow * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        // a canopy line along the top, so the lights are under something
        ctx.strokeStyle = ink.lo;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const y = 18 + wave(x, t * 0.3, 4) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      },
    };
  },

  /* Kurinji: layered ridgelines under drifting dashed mist that parts at the pointer */
  kurinji: () => ({
    resize() {},
    draw(ctx, { w, h, t, ptr, ink }) {
      // three ridges, far to near
      const ridges = [0.55, 0.68, 0.82];
      ridges.forEach((base, r) => {
        ctx.strokeStyle = r === 2 ? ink.mid : ink.lo;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = h * base - Math.abs(wave(x * 0.6, r * 3, r * 5)) * (60 - r * 12) - Math.sin(x * 0.004 + r) * 18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      // mist: dashed bands drifting sideways, thinning around the pointer
      const bands = Math.ceil(h / 18);
      for (let b = 0; b < bands; b++) {
        const y = b * 18 + 9 + Math.sin(t * 0.7 + b) * 3;
        const drift = (t * (8 + (b % 3) * 5)) % 40;
        for (let x = -40 + drift; x < w; x += 40) {
          const len = 14 + 10 * Math.sin(b * 1.7 + x * 0.01);
          const cx = x + len / 2, dx = cx - ptr.x, dy = y - ptr.y;
          const part = gauss(dx * dx + dy * dy * 2.5, 80) * ptr.on;
          const a = (0.35 + 0.3 * Math.sin(b * 0.9 + x * 0.013 + t)) * (1 - part);
          if (a < 0.04) continue;
          ctx.globalAlpha = a;
          ctx.strokeStyle = ink.edge;
          ctx.beginPath();
          const push = Math.sign(dy || 1) * part * 16;
          ctx.moveTo(x, y + push);
          ctx.lineTo(x + len, y + push);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    },
  }),

  /* Marutham: a planted grid of seedlings; the pointer is wind and the bow spreads out as a wave */
  marutham: () => ({
    resize() {},
    draw(ctx, { w, h, t, ptr, ink }) {
      const gx = 22, gy = 20, len = 9;
      for (let y = gy; y < h + gy; y += gy) {
        const row = Math.round(y / gy);
        for (let x = (row % 2) * (gx / 2) + 6; x < w; x += gx) {
          const dx = x - ptr.x, dy = y - ptr.y, d = Math.hypot(dx, dy);
          // ambient sway: a slow wave running across the field
          let a = Math.sin(t * 1.6 - x * 0.02 - y * 0.01) * 0.12;
          // the wind: bow away from the pointer, a ring that travels outward
          const near = Math.exp(-d / 150) * ptr.on;
          a += near * (Math.sign(dx || 1) * 0.7 + Math.sin(t * 5 - d * 0.05) * 0.25);
          ctx.strokeStyle = near > 0.45 ? ink.hi : near > 0.15 ? ink.edge : ink.mid;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.sin(a) * len, y - Math.cos(a) * len);
          ctx.stroke();
        }
      }
    },
  }),

  /* Neytal: long tide lines that breathe; the pointer drops rings that spread and fade */
  neytal: () => {
    type Ring = { x: number; y: number; r: number; life: number };
    const rings: Ring[] = [];
    let lastDrop = 0, clock = 0;
    return {
      resize() {},
      poke(x, y, inside) {
        if (!inside || clock - lastDrop < 0.35) return;
        lastDrop = clock;
        rings.push({ x, y, r: 2, life: 1 });
        if (rings.length > 8) rings.shift();
      },
      draw(ctx, { w, h, t, dt, ink }) {
        clock += dt;
        const gap = 22, rows = Math.ceil(h / gap) + 1;
        for (let r = 0; r < rows; r++) {
          const y0 = r * gap + 8;
          ctx.strokeStyle = r % 5 === 2 ? ink.mid : ink.lo;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            let y = y0 + Math.sin(x * 0.008 + t * 1.2 + r * 0.6) * 4 + Math.sin(x * 0.019 - t * 0.7 + r) * 2;
            for (const g of rings) {
              const d = Math.hypot(x - g.x, y0 - g.y);
              y += Math.sin((d - g.r) * 0.12) * gauss((d - g.r) ** 2, 14) * 5 * g.life;
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        for (let i = rings.length - 1; i >= 0; i--) {
          const g = rings[i];
          g.r += dt * 70;
          g.life -= dt * 0.45;
          if (g.life <= 0) { rings.splice(i, 1); continue; }
          ctx.globalAlpha = g.life * 0.8;
          ctx.strokeStyle = ink.hi;
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, g.r, g.r * 0.42, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      },
    };
  },
};
