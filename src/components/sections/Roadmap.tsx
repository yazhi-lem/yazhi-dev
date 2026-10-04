"use client";
import { useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { Section } from "@/components/ui/Section";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BUILD, ROADMAP_COPY } from "@/lib/content";
import { MONTHS, ROADMAP, formatDate, getProject, type RoadmapNode } from "@/lib/projects";
import { toneStyle } from "@/bubble/tone";
import { useLang } from "@/lib/i18n";

/* ------------------------------------------------------------------
   Fishbone geometry (desktop, lg and up). Everything is a percentage
   of the chart box so the SVG bones (viewBox 0 0 100 100, stretched)
   and the HTML labels share one coordinate system.

     x: 10 Oct → 31 Dec maps to X0 → X1; the tail sits left of X0 and
        the head right of X1, swimming towards 2027.
     y: the spine runs at 50%. Nodes take four lanes in turn (index % 4):
        up-long, down-long, up-short, down-short, so launches a few days
        apart (28 Nov, 30 Nov, 1 Dec) never share a lane. Bones slant
        back towards the tail by SLANT, as fish bones do; each label's
        corner sits on its bone's tip.
   ------------------------------------------------------------------ */
const START = Date.UTC(2026, 9, 10);
const END = Date.UTC(2026, 11, 31);
const X0 = 6;
const X1 = 90;
const SPINE = 50;
const LONG = 30;
const SHORT = 13;
const SLANT = 1.4;

const xOf = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return X0 + ((Date.UTC(y, m - 1, d) - START) / (END - START)) * (X1 - X0);
};

const LANES = [
  { up: true, len: LONG },
  { up: false, len: LONG },
  { up: true, len: SHORT },
  { up: false, len: SHORT },
] as const;

function geometry(n: RoadmapNode) {
  const lane = LANES[n.index % 4];
  const x = xOf(n.date);
  const tipX = x - SLANT;
  const tipY = lane.up ? SPINE - lane.len : SPINE + lane.len;
  return { x, tipX, tipY, up: lane.up };
}

const MONTH_SPANS = [
  { m: 9, from: "2026-10-10", to: "2026-11-01" },
  { m: 10, from: "2026-11-01", to: "2026-12-01" },
  { m: 11, from: "2026-12-01", to: "2026-12-31" },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The 2026 launch line as one fishbone. Every launch is a button; it
    opens a circle that grows out of the point you pressed, with what
    the project is, its launch gate, a demo link where one exists, and
    the way to its full page. Below lg the fish turns on its side into
    a vertical list. Marutham governs it. */
export function Roadmap() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<RoadmapNode | null>(null);

  function open(n: RoadmapNode, from: HTMLElement) {
    const dialog = dialogRef.current;
    if (!dialog) return;
    flushSync(() => setActive(n));
    dialog.showModal();
    // start on the close button, not the first link
    closeRef.current?.focus();
    const circle = circleRef.current;
    if (!circle || reducedMotion()) return;
    // grow out of the node that was pressed
    const r = from.getBoundingClientRect();
    const dx = r.left + r.width / 2 - window.innerWidth / 2;
    const dy = r.top + r.height / 2 - window.innerHeight / 2;
    circle.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.2 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }

  function close() {
    const dialog = dialogRef.current;
    const circle = circleRef.current;
    if (!dialog) return;
    if (!circle || reducedMotion()) return dialog.close();
    circle
      .animate([{ transform: "none", opacity: 1 }, { transform: "scale(0.6)", opacity: 0 }], { duration: 180, easing: "ease-in" })
      .finished.then(() => dialog.close(), () => dialog.close());
  }

  const p = active ? getProject(active.slug) : undefined;
  const d = active ? formatDate(active.date) : undefined;

  return (
    <Section id="roadmap">
      <SectionTitle
        eyebrow={{ ta: ROADMAP_COPY.eyebrowTa, en: ROADMAP_COPY.eyebrowEn }}
        title={{ ta: ROADMAP_COPY.titleTa, en: ROADMAP_COPY.titleEn }}
        lead={{ ta: ROADMAP_COPY.leadTa, en: ROADMAP_COPY.leadEn }}
      />

      {/* ---------- desktop: the fish ---------- */}
      <div className="relative mt-12 hidden h-[46rem] lg:block">
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {/* tail */}
          <path d={`M ${X0 - 4} ${SPINE - 9} L ${X0 - 0.5} ${SPINE} L ${X0 - 4} ${SPINE + 9}`} fill="none" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {/* spine */}
          <line x1={X0 - 0.5} y1={SPINE} x2={X1 + 2} y2={SPINE} stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          {/* head */}
          <path d={`M ${X1 + 2} ${SPINE - 11} Q ${X1 + 9} ${SPINE - 9} ${X1 + 10} ${SPINE} Q ${X1 + 9} ${SPINE + 9} ${X1 + 2} ${SPINE + 11} Z`} fill="color-mix(in srgb, var(--accent) 14%, transparent)" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {/* bones */}
          {ROADMAP.map((n) => {
            const g = geometry(n);
            return (
              <line key={`${n.slug}-${n.date}`} x1={g.x} y1={SPINE} x2={g.tipX} y2={g.tipY} stroke={`var(--${n.tone})`} strokeOpacity="0.75" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>

        {/* the head's eye, and the year it swims towards */}
        <span aria-hidden className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)]" style={{ left: `${X1 + 6.5}%`, top: `${SPINE - 3}%` }} />
        <span aria-hidden className="absolute -translate-x-1/2 font-display text-xs text-ivory-dim" style={{ left: `${X1 + 5.5}%`, top: `${SPINE + 1.5}%` }}>2027</span>

        {/* spine dots */}
        {ROADMAP.map((n) => (
          <span
            key={`dot-${n.slug}-${n.date}`}
            aria-hidden
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-night bg-[color:var(--tone)]"
            style={toneStyle(n.tone, { left: `${xOf(n.date)}%`, top: `${SPINE}%` })}
          />
        ))}

        {/* labels */}
        <ol className="contents">
          {ROADMAP.map((n) => {
            const g = geometry(n);
            const pos: CSSProperties = g.up
              ? { left: `${g.tipX}%`, bottom: `${100 - g.tipY}%` }
              : { left: `${g.tipX}%`, top: `${g.tipY}%` };
            return (
              <li key={`label-${n.slug}-${n.date}`} className="absolute w-[8.75rem]" style={toneStyle(n.tone, pos)}>
                <NodeButton n={n} onOpen={open} className={g.up ? "rounded-bl-sm" : "rounded-tl-sm"} />
              </li>
            );
          })}
        </ol>

        {/* month axis */}
        <ol aria-hidden className="absolute inset-x-0 bottom-0 h-6">
          {MONTH_SPANS.map((s) => (
            <li
              key={s.m}
              className="absolute top-0 border-l border-ivory/20 pl-2 text-xs text-ivory-dim"
              style={{ left: `${xOf(s.from)}%`, width: `${xOf(s.to) - xOf(s.from)}%` }}
            >
              <Bi ta={MONTHS.ta[s.m]} en={MONTHS.en[s.m]} className="inline-flex gap-1.5" separator="·" />
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- below lg: the fish on its side ---------- */}
      <ol className="relative mt-10 ml-2 flex flex-col gap-4 border-l-2 border-[color:var(--accent)]/50 pl-6 lg:hidden">
        {ROADMAP.map((n) => (
          <li key={`m-${n.slug}-${n.date}`} className="relative" style={toneStyle(n.tone)}>
            <span aria-hidden className="absolute -left-[1.94rem] top-4 h-3 w-3 rounded-full border-2 border-night bg-[color:var(--tone)]" />
            <NodeButton n={n} onOpen={open} withTier className="w-full" />
          </li>
        ))}
      </ol>

      {/* ---------- the circle ---------- */}
      <dialog
        ref={dialogRef}
        aria-labelledby="roadmap-dialog-title"
        data-lenis-prevent
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        onClose={() => setActive(null)}
        className="m-auto max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 text-ivory backdrop:bg-night/75 backdrop:backdrop-blur-sm"
      >
        {active && p && d && (
          <div
            ref={circleRef}
            style={toneStyle(p.tone, {
              background: "radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--tone) 22%, var(--night-2)), var(--night-2) 70%)",
            })}
            // a full circle from sm up; on a phone the same bubble stretched
            // into a capsule, so nothing is clipped at 320px
            className="relative grid max-h-[88vh] w-[min(94vw,36rem)] place-items-center overflow-y-auto rounded-[2.5rem] border border-[color:var(--tone)]/50 px-6 pb-8 pt-14 text-center shadow-[0_0_80px_-20px_var(--tone)] sm:aspect-square sm:max-h-none sm:overflow-visible sm:rounded-full sm:p-[11%]"
          >
            <div className="flex flex-col items-center gap-3 px-1">
              <Bi
                as="p" ta={`${d.ta} · ${p.kind.ta}`} en={`${d.en} · ${p.kind.en}`}
                className="ybi-tone-text flex flex-col text-xs sm:text-sm"
              />
              <h3 id="roadmap-dialog-title">
                <Bi
                  ta={p.name.ta} en={p.name.en}
                  className="flex flex-wrap items-baseline justify-center gap-x-2"
                  taClass="font-display text-[length:var(--text-2xl)] font-semibold sm:text-[length:var(--text-3xl)]"
                  enClass="font-display text-base text-ivory-dim"
                />
              </h3>
              <Bi
                as="p"
                ta={active.label.en === p.name.en ? active.tier.ta : `${active.label.ta} — ${active.tier.ta}`}
                en={active.label.en === p.name.en ? active.tier.en : `${active.label.en} — ${active.tier.en}`}
                className="flex flex-col text-xs text-ivory-dim sm:text-sm"
              />
              <Bi as="p" ta={p.what.ta} en={p.what.en} className="flex flex-col gap-1 text-sm text-ivory" enClass="text-ivory-dim" />
              <div className="text-xs text-ivory-dim">
                <Bi ta={ROADMAP_COPY.gateTa} en={ROADMAP_COPY.gateEn} className="ybi-tone-text inline-flex gap-1" separator="/" />
                <Bi as="p" ta={p.gate.ta} en={p.gate.en} className="mt-0.5 flex flex-col" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {p.demo && (
                  <Button href={p.demo.href} external={p.demo.external}>
                    <Bi ta={p.demo.ta} en={p.demo.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
                  </Button>
                )}
                <Button href={`/projects/${p.slug}`} variant="ghost">
                  <Bi ta={BUILD.detailsTa} en={BUILD.detailsEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
                </Button>
              </div>
              {p.demo?.note && <Bi as="p" ta={p.demo.note.ta} en={p.demo.note.en} className="flex flex-col text-xs text-ivory-dim" />}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={`${ROADMAP_COPY.closeEn} · ${ROADMAP_COPY.closeTa}`}
              className="absolute right-4 top-4 grid h-10 w-10 sm:right-[14%] sm:top-[14%] place-items-center rounded-full border border-ivory/20 bg-night/60 text-ivory transition-colors hover:border-[color:var(--tone)]"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>
        )}
      </dialog>
    </Section>
  );
}

function NodeButton({
  n,
  onOpen,
  withTier = false,
  className = "",
}: {
  n: RoadmapNode;
  onOpen: (n: RoadmapNode, from: HTMLElement) => void;
  withTier?: boolean;
  className?: string;
}) {
  const { lang } = useLang();
  const d = formatDate(n.date, true);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(e) => onOpen(n, e.currentTarget)}
      className={`flex flex-col gap-0.5 rounded-2xl border border-[color:var(--tone)]/40 bg-night-2/85 px-3 py-2 text-left backdrop-blur transition-colors hover:border-[color:var(--tone)] hover:bg-night-2 ${className}`}
    >
      <Bi ta={d.ta} en={d.en} className="ybi-tone-text inline-flex gap-1.5 text-xs" separator="·" />
      <Bi
        ta={n.label.ta} en={n.label.en}
        className="flex flex-col"
        taClass="font-display text-sm font-semibold leading-snug text-ivory"
        enClass={lang === "en" ? "font-display text-sm font-semibold leading-snug text-ivory" : "text-xs text-ivory-dim"}
      />
      {withTier && <Bi ta={n.tier.ta} en={n.tier.en} className="inline-flex flex-wrap gap-1.5 text-xs text-ivory-dim" separator="·" />}
    </button>
  );
}
