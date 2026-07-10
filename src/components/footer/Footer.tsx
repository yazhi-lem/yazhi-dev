"use client";
import Link from "next/link";
import { Bi } from "@/components/ui/Bi";
import { LogoMark } from "@/components/ui/LogoMark";
import { YazhCreature } from "@/components/ui/YazhCreature";
import { IDENTITY, NAV_GROUPS } from "@/lib/content";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{
        // deep ocean: neytal shallows at the surface sinking into the trench
        background:
          "linear-gradient(to bottom, var(--ocean-shallow), var(--ocean-mid) 42%, var(--ocean-deep))",
      }}
    >
      {/* Thinai rock-sediment strata — the layered geological band the ocean
          rests on, forming the divider from the section above */}
      <div
        aria-hidden
        className="h-7 w-full"
        style={{
          background:
            "linear-gradient(to bottom," +
            " var(--sediment-1) 0 6px," +
            " var(--sediment-2) 6px 13px," +
            " var(--sediment-3) 13px 19px," +
            " var(--sediment-4) 19px 28px)",
          boxShadow: "0 1px 0 rgba(242,235,221,0.08) inset",
        }}
      />

      {/* neytal glow rising off the sea floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, color-mix(in oklab, var(--neytal) 22%, transparent), transparent 70%)",
        }}
      />

      {/* Yazh guardian-beasts — abstract outlines standing on the sediment at
          either edge, framing the deep-ocean ground between them */}
      <YazhCreature
        flip
        className="pointer-events-none absolute -left-4 bottom-0 -z-10 text-neytal/40 sm:left-2 lg:left-6"
      />
      <YazhCreature
        className="pointer-events-none absolute -right-4 bottom-0 -z-10 text-neytal/40 sm:right-2 lg:right-8"
      />

      <div className="mx-auto grid max-w-[var(--max-w)] gap-10 px-6 py-14 sm:px-8 lg:pl-28 lg:pr-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
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
