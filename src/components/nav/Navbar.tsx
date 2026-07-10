"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bi } from "@/components/ui/Bi";
import { LangToggle } from "@/components/ui/LangToggle";
import { LogoMark } from "@/components/ui/LogoMark";
import { IDENTITY, NAV_GROUPS, ADHAN, SANGAM, GUARDIAN, COMMUNITY } from "@/lib/content";

const LINKS_TOP = [
  { ta: ADHAN.nameTa, en: ADHAN.nameEn, href: "#adhan" },
  { ta: SANGAM.nameTa, en: SANGAM.nameEn, href: "#sangam" },
  { ta: GUARDIAN.nameTa, en: "Yazh", href: "#guardian" },
  { ta: COMMUNITY.titleTa, en: COMMUNITY.titleEn, href: "#community" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[var(--max-w)] items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Yazhi home">
          <LogoMark size={34} />
          <Bi
            ta={IDENTITY.nameTa}
            en={IDENTITY.nameEn}
            className="flex items-baseline gap-2 font-serif text-lg font-semibold tracking-wide"
            separator={<span aria-hidden className="text-ivory-dim">•</span>}
          />
        </Link>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-6 md:flex">
            {LINKS_TOP.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-ivory-dim transition-colors hover:text-ivory">
                  <Bi ta={l.ta} en={l.en} className="inline-flex gap-1.5" separator={<span aria-hidden className="text-ivory/30">·</span>} />
                </a>
              </li>
            ))}
          </ul>
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
            className="mx-5 rounded-2xl border border-ivory/10 bg-night-2/95 p-5 backdrop-blur md:hidden"
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
