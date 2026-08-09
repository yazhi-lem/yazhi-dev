"use client";
import Link from "next/link";
import { Bi } from "@/components/ui/Bi";
import { LogoMark } from "@/components/ui/LogoMark";
import { SunkenRuins } from "@/components/ui/SunkenRuins";
import { Bubbles } from "@/components/ui/Bubbles";
import { IDENTITY, NAV_GROUPS } from "@/lib/content";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{
        // a steep dive: a brief transparent gap eases the neytal section
        // above into the water, then it drops fast through the shallow and
        // mid bands so most of the footer's height reads as genuinely deep
        // ocean — dark, near-black — rather than lingering in the paler
        // surface blue
        background:
          "linear-gradient(to bottom," +
          " transparent 0%," +
          " color-mix(in oklab, var(--neytal) 32%, var(--ocean-shallow)) 8%," +
          " var(--ocean-shallow) 16%," +
          " color-mix(in oklab, var(--ocean-shallow), var(--ocean-mid)) 26%," +
          " var(--ocean-mid) 38%," +
          " color-mix(in oklab, var(--ocean-mid), var(--ocean-deep)) 52%," +
          " var(--ocean-deep) 66%," +
          " color-mix(in oklab, var(--ocean-deep), #000000 40%) 100%)",
      }}
    >
      {/* neytal glow rising off the sea floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, color-mix(in oklab, var(--neytal) 18%, transparent), transparent 70%)",
        }}
      />

      {/* smooth layered rocks + the drowned city on the trench floor —
          taller than before so more of the footer's depth reads as seabed */}
      <SunkenRuins className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 w-full" />

      {/* sparkling bubbles rising through the water, in front of the scene */}
      <Bubbles className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

      <div className="mx-auto grid max-w-[var(--max-w)] gap-10 px-6 pb-24 pt-24 sm:px-8 lg:pl-28 lg:pr-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <Bi
              ta={IDENTITY.nameTa}
              en={IDENTITY.nameEn}
              className="flex items-baseline gap-2 font-serif text-xl font-semibold tracking-wide"
              separator={<span aria-hidden className="text-ivory-dim">•</span>}
            />
          </div>
          <Bi
            as="p"
            ta={IDENTITY.footerTa}
            en={IDENTITY.footerEn}
            className="mt-2 flex flex-col gap-0.5 text-sm text-ivory-dim"
          />
          <p className="mt-6 font-serif text-xs text-ivory-dim">{IDENTITY.copyright}</p>
        </div>

        {NAV_GROUPS.map((g) => (
          <nav key={g.en} aria-label={g.en}>
            <Bi as="p" ta={g.ta} en={g.en} className="mb-3 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
            <ul className="flex flex-col gap-2">
              {g.items.map((it) => {
                const ext = it.href.startsWith("http");
                return (
                  <li key={`${g.en}-${it.en}`}>
                    <Link
                      href={it.href}
                      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm text-ivory-dim transition-colors hover:text-ivory"
                    >
                      <Bi ta={it.ta} en={it.en} className="inline-flex gap-1.5" separator={<span aria-hidden className="text-ivory/30">·</span>} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
