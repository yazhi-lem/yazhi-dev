"use client";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { VERSE } from "@/lib/content";

/* ------------------------------------------------------------------
   மதுரைக்காஞ்சி 1–3 as an experience.

   The section is 320svh tall; its inner frame is sticky, so scrolling
   through it plays one progress value, p ∈ [0, 1]:

     0.04–0.26  line 1  ஓங்கு திரை…   waves swell and tower
     0.30–0.52  line 2  ஒலி முந்நீர்…  the sea settles into a horizon — the boundary
     0.56–0.78  line 3  தேன் தூங்கும்… peaks rise; honeycombs hang from them
     0.82–0.96  source, gloss note, and the bridge into the problem

   Every word is in the DOM from the start (only opacity and position
   move), so screen readers and search read the whole verse. Under
   prefers-reduced-motion the section is one screen tall and shows the
   finished scene with all three lines; so does a screen under 700px
   tall, where the three lines would not fit one sticky frame.
   ------------------------------------------------------------------ */

const LINE_AT = [0.04, 0.3, 0.56];
const LINE_SPAN = 0.22;
const OUTRO = [0.82, 0.96];

// reduced motion, or a screen too short to hold all three lines in one
// sticky frame: show the finished verse in the page flow instead
const mq = () => window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 700px)");
function useStill() {
  return useSyncExternalStore(
    (cb) => {
      const m = mq();
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => mq().matches,
    () => false,
  );
}

function Word({ text, p, from, to, still }: { text: string; p: MotionValue<number>; from: number; to: number; still: boolean }) {
  const opacity = useTransform(p, [from, to], [0.08, 1]);
  const y = useTransform(p, [from, to], ["0.45em", "0em"]);
  const blur = useTransform(p, [from, to], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span className="inline-block" style={still ? { opacity: 1, y: 0, filter: "none" } : { opacity, y, filter: blur }}>
      {text}
    </motion.span>
  );
}

function Line({ i, p, still }: { i: number; p: MotionValue<number>; still: boolean }) {
  const line = VERSE.lines[i];
  const words = line.ta.split(" ");
  const start = LINE_AT[i];
  const step = (LINE_SPAN * 0.6) / words.length;
  const glossOpacity = useTransform(p, [start + LINE_SPAN * 0.55, start + LINE_SPAN], [0, 1]);
  return (
    <li className="flex flex-col gap-1">
      <span className="flex flex-wrap gap-x-[0.3em] font-display text-[length:calc((100vw_-_3rem)/11)] font-semibold leading-tight text-ivory sm:text-[length:min(var(--text-4xl),calc((100vw_-_3rem)/7.5))]">
        {words.map((w, j) => (
          <Word key={j} text={w} p={p} from={start + j * step} to={start + j * step + LINE_SPAN * 0.4} still={still} />
        ))}
      </span>
      <motion.span style={{ opacity: still ? 1 : glossOpacity }}>
        <Bi ta={line.glossTa} en={line.glossEn} className="flex flex-col text-xs text-ivory-dim sm:text-base" enClass="sm:text-sm" />
      </motion.span>
    </li>
  );
}

function Scene({ p, still }: { p: MotionValue<number>; still: boolean }) {
  // 1 · waves tower, then 2 · settle into the horizon
  const waveScale = useTransform(p, [0, 0.2, 0.42, 1], [0.5, 1.5, 0.7, 0.7]);
  // 3 · the mountains rise; honey hangs once they are up
  const mountainY = useTransform(p, [0.5, 0.74], ["70%", "0%"]);
  const honey = useTransform(p, [0.66, 0.8], [0, 1]);
  // sea night → kurinji dusk
  const dusk = useTransform(p, [0.5, 0.8], [0, 1]);
  const horizon = useTransform(p, [0.28, 0.46], [0, 1]);


  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #050912, color-mix(in srgb, var(--neytal) 30%, #050912))" }} />
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0b0716, color-mix(in srgb, var(--kurinji) 28%, #0b0716))", opacity: still ? 1 : dusk }}
      />
      <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="verse-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--neytal)" stopOpacity="0.55" />
            <stop offset="1" stopColor="#03101c" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="verse-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="color-mix(in srgb, var(--kurinji) 55%, #120c22)" />
            <stop offset="1" stopColor="#07050d" />
          </linearGradient>
        </defs>

        {/* the mountains, behind the sea */}
        <motion.g style={{ y: still ? "0%" : mountainY }}>
          {/* set low, so the peaks stay below the words */}
          <g transform="translate(0 150)">
          <path
            d="M0 640 L120 520 L210 560 L360 330 L470 450 L560 400 L700 210 L820 380 L900 340 L1040 470 L1150 300 L1260 430 L1440 360 L1440 800 L0 800 Z"
            fill="url(#verse-hill)"
          />
          {/* honeycombs hanging under the high ledges */}
          <motion.g style={{ opacity: still ? 1 : honey }} fill="var(--marutham)" stroke="#2a1e05" strokeWidth="1.5">
            {[
              [700, 228],
              [360, 348],
              [1150, 318],
            ].map(([x, y]) => (
              <g key={`${x}`} transform={`translate(${x} ${y})`}>
                <line x1="0" y1="0" x2="0" y2="16" stroke="var(--marutham)" strokeWidth="1.5" />
                <path d="M-14 16 Q0 8 14 16 L14 40 Q0 58 -14 40 Z" opacity="0.95" />
                <path d="M-7 24 l7 -4 l7 4 v8 l-7 4 l-7 -4 Z M0 36 l7 -4" fill="none" stroke="#2a1e05" />
                <circle cx="0" cy="62" r="2.5" />
              </g>
            ))}
          </motion.g>
          </g>
        </motion.g>

        {/* the horizon line — the sea as boundary */}
        <motion.line x1="0" y1="610" x2="1440" y2="610" stroke="var(--neytal)" strokeWidth="2" strokeOpacity="0.8" style={{ opacity: still ? 1 : horizon }} />

        {/* the sea */}
        <motion.g style={{ scaleY: still ? 0.7 : waveScale, originY: 1 }}>
          {[0, 1, 2].map((k) => (
            <motion.path
              key={k}
              d={wave(610 + k * 40, 26 - k * 6)}
              fill="url(#verse-sea)"
              opacity={0.55 + k * 0.2}
              animate={still ? undefined : { x: [0, -720] }}
              transition={{ duration: 14 + k * 5, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </motion.g>
      </svg>
      {/* keep the words readable over the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_30%_40%,rgba(5,7,13,0.78),transparent)]" />
    </div>
  );
}

/** A wave strip twice the viewBox width so a -720 shift loops seamlessly. */
function wave(y: number, amp: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x < 2880; x += 360) d += ` Q ${x + 90} ${y - amp} ${x + 180} ${y} T ${x + 360} ${y}`;
  return `${d} L2880 800 L0 800 Z`;
}

/** The Maduraikanchi opening, experienced: three lines rise one by one
    over the land they describe. Neytal (the sea) governs it. */
export function Verse() {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Derived through a function on purpose: framer-motion otherwise hands
  // opacity/filter straight to a native ScrollTimeline that ignores the
  // section's offsets and tracks the whole page instead.
  const progress = useTransform(scrollYProgress, (v) => v);
  const outro = useTransform(progress, OUTRO, [0, 1]);

  return (
    <section ref={ref} id="verse" aria-labelledby="verse-title" className={`relative ${still ? "" : "h-[320svh]"}`}>
      <div className={`${still ? "relative min-h-svh" : "sticky top-0 h-svh"} overflow-hidden`}>
        <Scene p={progress} still={still} />
        <figure className="relative z-10 mx-auto flex h-full min-h-svh max-w-[var(--max-w)] flex-col justify-center px-6 pb-6 pt-16 sm:px-8 sm:pt-20 sm:pb-[14svh] lg:px-10">
          <h2 id="verse-title" className="sr-only">
            மதுரைக்காஞ்சி · Maduraikanchi
          </h2>
          <blockquote lang="ta">
            <ol className="flex flex-col gap-3 sm:gap-6">
              {VERSE.lines.map((_, i) => (
                <Line key={i} i={i} p={progress} still={still} />
              ))}
            </ol>
          </blockquote>
          <motion.figcaption style={{ opacity: still ? 1 : outro }} className="mt-5 flex max-w-2xl flex-col gap-2 sm:mt-8 sm:gap-3">
            <Bi as="p" ta={VERSE.sourceTa} en={VERSE.sourceEn} className="flex flex-col gap-0.5 text-sm text-[color:var(--accent)]" enClass="text-xs" />
            <Bi
              as="p" ta={VERSE.bridgeTa} en={VERSE.bridgeEn}
              className="flex flex-col gap-1 text-base text-ivory sm:text-[length:var(--text-lg)]"
              enClass="text-sm text-ivory-dim sm:text-base"
            />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link href={VERSE.readHref} className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory">
                <Bi ta={VERSE.readTa} en={VERSE.readEn} className="inline-flex gap-1.5" separator="·" />
              </Link>
            </div>
          </motion.figcaption>
        </figure>
      </div>
    </section>
  );
}
