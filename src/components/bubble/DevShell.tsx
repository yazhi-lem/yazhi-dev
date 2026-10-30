"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ModeSwitch } from "@yazhi/bubble";
import { LogoMark } from "@/components/ui/LogoMark";
import { CircleProvider } from "@/components/circle/CircleProvider";
import { MissionMenu } from "@/components/mission/Mission";

const NAV = [
  { href: "/bubble", name: "UI library" },
  { href: "/chat", name: "Chat" },
];

/** Chrome for the Bubble UI library: logo, two places, the theme and
    Mission Control, all under one Circle session. .bubble-root gives
    everything inside the light theme as well as the dark. */
export function DevShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <CircleProvider>
      <div className="bubble-root min-h-dvh">
        <header className="print-hide sticky top-0 z-40 border-b border-ivory/10 bg-night/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-3 px-4">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Yazhi home">
              <LogoMark size={26} />
              <span className="hidden font-display text-base font-semibold text-ivory sm:inline">
                Yazhi <span className="font-normal text-ivory-dim">Bubble UI</span>
              </span>
            </Link>
            <nav aria-label="Bubble" className="flex min-w-0 items-center gap-1 sm:gap-2">
              {NAV.map((n) => {
                const current = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={current ? "page" : undefined}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                      current ? "bg-gold/15 text-gold" : "text-ivory-dim hover:text-ivory"
                    }`}
                  >
                    {n.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex shrink-0 items-center gap-1">
              <ModeSwitch compact />
              <MissionMenu size={34} />
            </div>
          </div>
        </header>
        {children}
      </div>
    </CircleProvider>
  );
}
