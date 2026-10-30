"use client";
import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { HairlineHorizon } from "@/components/ui/HairlineHorizon";
import { IDENTITY, NAV_GROUPS } from "@/lib/content";
import { useLang } from "@/lib/i18n";

/** The footer as a hairline drawing: the five landscapes run along its top
    edge as one line, then a grid of plain columns divided by hairlines —
    the mark, three link groups, and a last rule with the copyright. */
export function Footer() {
  const { lang } = useLang();
  const say = (l: { ta: string; en: string }) => (lang === "en" ? l.en : l.ta);
  const tongue = lang === "en" ? "en" : "ta";
  return (
    <footer className="relative isolate bg-[linear-gradient(to_bottom,transparent,var(--night)_7rem)] pb-20 lg:pb-6">
      <HairlineHorizon className="pointer-events-none block h-24 w-full sm:h-32" />

      <div className="mx-auto max-w-[var(--max-w)] px-6 sm:px-8">
        <div className="grid md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="py-10 md:pr-8">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Yazhi home">
              <LogoMark size={26} />
              <span lang={tongue} className="font-serif text-lg font-black">
                {lang === "en" ? IDENTITY.nameEn : IDENTITY.nameTa}
              </span>
            </Link>
            <p lang={tongue} className="mt-3 max-w-[22rem] text-sm text-ivory-dim">
              {lang === "en" ? IDENTITY.footerEn : IDENTITY.footerTa}
            </p>
          </div>

          {NAV_GROUPS.map((g) => (
            <nav key={g.en} aria-label={g.en} className="border-t border-ivory/10 py-10 md:border-l md:border-t-0 md:pl-8">
              <p lang={tongue} className={`text-ivory-dim/80 ${lang === "en" ? "font-mono text-[11px] uppercase tracking-widest" : "text-xs font-semibold"}`}>
                {say(g)}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {g.items.map((it) => {
                  const ext = it.href.startsWith("http");
                  return (
                    <li key={`${g.en}-${it.en}`}>
                      <Link
                        href={it.href}
                        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        lang={tongue}
                        className="text-sm text-ivory-dim underline-offset-4 transition-colors hover:text-ivory hover:underline"
                      >
                        {say(it)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ivory/10 py-6 text-xs text-ivory-dim">
          <p className="font-serif">{IDENTITY.copyright}</p>
          <a href="#hero" lang={tongue} className="inline-flex items-center gap-1.5 hover:text-ivory">
            <span aria-hidden>↑</span> {lang === "en" ? "Back to top" : "மேலே செல்ல"}
          </a>
        </div>
      </div>
    </footer>
  );
}
