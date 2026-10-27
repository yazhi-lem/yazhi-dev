"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LangToggle } from "@/components/ui/LangToggle";
import { LogoMark } from "@/components/ui/LogoMark";
import { JoinCircle } from "@/components/circle/JoinCircle";
import { MissionMenu } from "@/components/mission/Mission";
import { useLang } from "@/lib/i18n";
import { ADHAN, GUARDIAN, IDENTITY } from "@/lib/content";

/** Four places, one word each, in the reader's language. */
const LINKS = [
  { ta: GUARDIAN.nameTa, en: GUARDIAN.nameEn, href: "#guardian" },
  { ta: ADHAN.nameTa, en: ADHAN.nameEn, href: "#adhan" },
  { ta: "சங்கம்", en: "Sangam", href: "#sangam" },
  { ta: "உருவாக்கு", en: "Build", href: "/bubble" },
];

/** The site bar: the mark, four short links, the language and one call to
    action — Join Circle, which becomes Mission Control once an account
    exists. Clear over the hero; once the page moves it gathers a soft
    shadow, a hairline and a blur so it reads over anything beneath. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang } = useLang();
  const word = (l: { ta: string; en: string }) => (lang === "en" ? l.en : l.ta);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex h-14 max-w-[var(--max-w)] items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled || open
            ? "border-ivory/10 bg-night/70 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.65),0_2px_10px_-4px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "border-transparent bg-transparent shadow-none"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Yazhi home">
          <LogoMark size={28} />
          <span lang={lang === "en" ? "en" : "ta"} className="font-serif text-lg font-black">
            {lang === "en" ? IDENTITY.nameEn : IDENTITY.nameTa}
          </span>
        </Link>

        <nav aria-label="Yazhi" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  lang={lang === "en" ? "en" : "ta"}
                  className="rounded-full px-3 py-2 text-sm text-ivory-dim transition-colors hover:bg-ivory/[0.06] hover:text-ivory"
                >
                  {word(l)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <LangToggle compact />
          <JoinCircle className="max-sm:hidden" signedIn={<MissionMenu size={34} />} />
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ivory-dim hover:bg-ivory/10 hover:text-ivory md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-menu"
            aria-label="Yazhi"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-[var(--max-w)] rounded-3xl border border-ivory/10 bg-night/85 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    lang={lang === "en" ? "en" : "ta"}
                    className="block rounded-2xl px-4 py-3 text-ivory-dim hover:bg-ivory/[0.06] hover:text-ivory"
                  >
                    {word(l)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t border-ivory/10 px-1 pt-3">
              <JoinCircle className="w-full justify-center" signedIn={null} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
