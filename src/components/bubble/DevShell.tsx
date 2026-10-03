"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/LogoMark";
import { CircleProvider } from "@/components/circle/CircleProvider";
import { CircleButton } from "@/components/circle/CircleButton";

const NAV = [
  { href: "/bubble", en: "Bubble docs", ta: "குமிழ்" },
  { href: "/foundry", en: "Foundry", ta: "பட்டறை" },
  { href: "/chat", en: "Chat", ta: "அரட்டை" },
];

/** Chrome for the builder pages (/bubble, /foundry): logo, builder nav and
    the Circle account button, all under one Circle session. */
export function DevShell({ children, fullHeight = false }: { children: ReactNode; fullHeight?: boolean }) {
  const pathname = usePathname();
  return (
    <CircleProvider>
      <div className={fullHeight ? "flex h-dvh flex-col overflow-hidden bg-night" : "min-h-dvh bg-night"}>
        <header className="sticky top-0 z-40 shrink-0 border-b border-ivory/10 bg-night/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-3 px-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Yazhi home">
              <LogoMark size={26} />
              <span className="display font-display text-base font-semibold text-ivory">
                யாழி <span className="font-normal text-ivory-dim">Builders</span>
              </span>
            </Link>
            <nav aria-label="Builder pages" className="flex items-center gap-1 sm:gap-2">
              {NAV.map((n) => {
                const current = pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={current ? "page" : undefined}
                    className={`rounded-full px-2.5 py-1 text-xs transition sm:px-3 sm:text-sm ${
                      current ? "bg-gold/15 text-gold" : "text-ivory-dim hover:text-ivory"
                    }`}
                  >
                    <span lang="ta" className="hidden lg:inline">
                      {n.ta} ·{" "}
                    </span>
                    {n.en}
                  </Link>
                );
              })}
              <CircleButton size={34} className="ml-1" />
            </nav>
          </div>
        </header>
        {children}
      </div>
    </CircleProvider>
  );
}
