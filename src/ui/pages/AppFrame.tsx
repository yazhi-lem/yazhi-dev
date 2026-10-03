import type { CSSProperties, ReactNode } from "react";
import { Bubble } from "../components/Bubble";
import { Disclaimer } from "../components/Guardrails";
import { RuntimeBadge } from "../components/Pill";
import { firstGrapheme } from "../text";

export interface AppIdentity {
  name: string;
  taName: string;
  tagline: string;
  /** CSS colour, usually a thinai token like var(--marutham) */
  accent: string;
  runtime: "device" | "yazhi-api";
}

/** The shell every Yazhi app page shares: identity header (bubble, names,
    runtime, account slot), optional sample-data notice, a main column and
    an optional side column. Sets --accent for everything inside. */
export function AppFrame({
  app,
  account,
  sample = true,
  aside,
  children,
}: {
  app: AppIdentity;
  /** right side of the header — usually the CircleButton */
  account?: ReactNode;
  /** show the sample-data notice (template previews) */
  sample?: boolean;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-night text-ivory" style={{ "--accent": app.accent } as CSSProperties}>
      <header className="flex items-center justify-between gap-3 border-b border-ivory/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Bubble accent={app.accent} label={app.name} glyph={firstGrapheme(app.taName)} size={36} />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">
              <span lang="ta">{app.taName}</span> · {app.name}
            </p>
            <p className="truncate text-xs text-ivory-dim">{app.tagline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RuntimeBadge runtime={app.runtime} />
          {account}
        </div>
      </header>
      {sample && (
        <div className="px-4 pt-3">
          <Disclaimer kind="sample" />
        </div>
      )}
      <div className={`grid flex-1 gap-4 p-4 ${aside ? "lg:grid-cols-[1fr_20rem]" : ""}`}>
        <main className="min-w-0 space-y-4">{children}</main>
        {aside && <aside className="min-w-0 space-y-4">{aside}</aside>}
      </div>
    </div>
  );
}
