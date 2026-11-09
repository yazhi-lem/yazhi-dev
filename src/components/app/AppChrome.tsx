"use client";
/** The chrome around `/app`: the wordmark, three places, the theme and
    Mission Control — the same header as `/bubble`'s DevShell, minus the
    builder-specific copy. One Circle session for the whole host, so Mission
    Control knows who is signed in and a run's 401 can be explained rather
    than guessed at.

    Why this is a client component wrapping the route group instead of
    `layout.tsx`: `src/app/app/**` is this task's scope and the Lead owns the
    root layout; `(workspaces)` already owns the `CircleProvider` for the
    other routes. `/app` gets its own wrapper, and the server page inside it
    stays a server component. */

import Link from "next/link";
import type { ReactNode } from "react";
import { ModeSwitch } from "@yazhi/bubble";
import { CircleProvider } from "@/components/circle/CircleProvider";
import { MissionMenu } from "@/components/mission/Mission";
import { LogoMark } from "@/components/ui/LogoMark";
import { useAppText } from "./useAppText";

export function AppChrome({ children }: { children: ReactNode }) {
  const t = useAppText();
  return (
    <CircleProvider>
      <div className="bubble-root min-h-dvh">
        <header className="print-hide sticky top-0 z-40 border-b border-ivory/10 bg-night/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[96rem] items-center justify-between gap-3 px-4">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={t("app.homeLabel")}>
              <LogoMark size={26} />
              <span className="hidden font-display text-base font-semibold text-ivory sm:inline">
                {t("app.brand")} <span className="font-normal text-ivory-dim">{t("app.brandSuffix")}</span>
              </span>
            </Link>
            <nav aria-label={t("app.navLabel")} className="flex min-w-0 items-center gap-1 sm:gap-2">
              <Link
                href="/app"
                aria-current="page"
                className="shrink-0 whitespace-nowrap rounded-full bg-gold/15 px-3 py-1.5 text-sm text-gold"
              >
                {t("app.brandSuffix")}
              </Link>
              <Link href="/bubble" className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-ivory-dim transition hover:text-ivory">
                {t("app.navDocs")}
              </Link>
              <Link href="/chat" className="hidden shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-ivory-dim transition hover:text-ivory sm:inline">
                {t("app.navChat")}
              </Link>
              <Link
                href="/workspaces"
                className="hidden shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-ivory-dim transition hover:text-ivory sm:inline"
              >
                {t("app.navWorkspaces")}
              </Link>
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
