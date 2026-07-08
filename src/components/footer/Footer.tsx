"use client";
import Link from "next/link";
import { Bi } from "@/components/ui/Bi";
import { LogoMark } from "@/components/ui/LogoMark";
import { IDENTITY, NAV_GROUPS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-ivory/10">
      <div className="mx-auto grid max-w-[var(--max-w)] gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <Bi
              ta={IDENTITY.nameTa}
              en={IDENTITY.nameEn}
              className="flex items-baseline gap-2 font-display text-xl font-semibold"
              separator={<span aria-hidden className="text-ivory-dim">•</span>}
            />
          </div>
          <Bi
            as="p"
            ta={IDENTITY.footerTa}
            en={IDENTITY.footerEn}
            className="mt-2 flex flex-col gap-0.5 text-sm text-ivory-dim"
          />
          <p className="mt-6 text-xs text-ivory-dim">{IDENTITY.copyright}</p>
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
