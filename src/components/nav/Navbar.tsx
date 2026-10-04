"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { LangToggle } from "@/components/ui/LangToggle";
import { LogoMark } from "@/components/ui/LogoMark";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { IDENTITY, NAV_GROUPS, ADHAN, SANGAM, GUARDIAN, COMMUNITY } from "@/lib/content";

const LINKS_TOP = [
  { ta: IDENTITY.nameTa, en: IDENTITY.nameEn, href: "#yazhi" },
  { ta: ADHAN.nameTa, en: ADHAN.nameEn, href: "#adhan" },
  { ta: GUARDIAN.nameTa, en: GUARDIAN.nameEn, href: "#guardian" },
  { ta: SANGAM.nameTa, en: SANGAM.nameEn, href: "#sangam" },
  { ta: COMMUNITY.titleTa, en: COMMUNITY.titleEn, href: "#community" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(top > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isGlass = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isGlass ? "navbar-glass" : "bg-transparent backdrop-blur-none"
      }`}
    >
      {/* Ambient scrim at the top; only active when at scrollY=0, fades out on scroll */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 transition-opacity duration-300 ${
          isGlass ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "linear-gradient(to bottom, rgba(5,7,13,0.5), transparent)" }}
      />

      {/* Subtle liquid fluid light caustic */}
      {isGlass && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60">
          <div className="liquid-glass-caustic" />
        </div>
      )}
      <div
        className="mx-auto flex max-w-[var(--max-w)] items-center justify-between px-4 py-3.5 pt-[calc(0.9rem+env(safe-area-inset-top,0px))] sm:px-6 md:px-8 lg:px-10 pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))]"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 sm:gap-3.5 md:gap-4 transition-opacity hover:opacity-90"
          aria-label="Yazhi home"
        >
          <LogoMark size={56} className="h-10 w-10 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] lg:h-[58px] lg:w-[58px]" />
          <BrandWordmark height={42} svgClassName="h-[30px] sm:h-[35px] md:h-[40px] lg:h-[44px] w-auto" />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ul className="hidden items-center gap-6 md:flex">
            {LINKS_TOP.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-ivory-dim transition-colors hover:text-ivory">
                  <Bi ta={l.ta} en={l.en} className="inline-flex gap-1.5" separator={<span aria-hidden className="text-ivory/30">·</span>} />
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/chat"
            className="rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-night [text-shadow:none]"
          >
            <Bi ta="அரட்டை" en="Chat" className="inline-flex gap-1.5 [text-shadow:none]" separator={<span aria-hidden className="text-gold/40">·</span>} />
          </Link>
          <LangToggle />
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-ivory/15 md:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-lg leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 sm:mx-5 max-h-[calc(100dvh-5.5rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] overflow-y-auto rounded-2xl border border-ivory/10 bg-gradient-to-b from-night-2/95 via-night-2/90 to-night-2/75 p-5 backdrop-blur md:hidden"
          >
            {NAV_GROUPS.map((g) => (
              <div key={g.en} className="mb-4 last:mb-0">
                <Bi as="p" ta={g.ta} en={g.en} className="mb-2 flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
                <ul className="flex flex-col gap-2">
                  {g.items.map((it) => (
                    <li key={`${g.en}-${it.en}`}>
                      <a href={it.href} onClick={() => setOpen(false)} className="text-ivory-dim hover:text-ivory">
                        <Bi ta={it.ta} en={it.en} className="inline-flex gap-1.5" separator={<span aria-hidden className="text-ivory/30">·</span>} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
