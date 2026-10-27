"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MissionControl, MissionHeader, MissionSection, ModeSwitch } from "@yazhi/bubble";
import { useCircleSession } from "@/components/circle/CircleProvider";
import { CircleDialog } from "@/components/circle/CircleDialog";

/** Mission Control wired to Circle: asleep until an account is signed in,
    when pressing it opens sign-in / join instead. `onOpen` runs once it is
    awake; the host shows the panel wherever suits the screen. */
export function MissionButton({ size = 40, open = false, controls, onOpen }: { size?: number; open?: boolean; controls?: string; onOpen: () => void }) {
  const { state } = useCircleSession();
  const [asking, setAsking] = useState(false);
  const active = state.status === "signed-in";
  return (
    <>
      <MissionControl
        active={active}
        busy={state.status === "loading"}
        open={open}
        controls={controls}
        who={active ? state.account.fullName || state.account.email : undefined}
        size={size}
        onPress={() => (active ? onOpen() : setAsking(true))}
      />
      {asking && <CircleDialog onClose={() => setAsking(false)} />}
    </>
  );
}

/** Who is signed in, and the way out. */
export function MissionAccount() {
  const { state, signOut } = useCircleSession();
  const [busy, setBusy] = useState(false);
  if (state.status !== "signed-in") return null;
  const a = state.account;
  return (
    <MissionSection title="Circle account">
      <p className="text-sm font-semibold text-ivory">{a.fullName || a.email}</p>
      {a.fullName && <p className="break-all text-xs text-ivory-dim">{a.email}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void signOut().finally(() => setBusy(false));
        }}
        className="mt-3 min-h-11 w-full rounded-full border border-ivory/20 px-4 text-sm text-ivory-dim transition-colors hover:border-palai/60 hover:text-ivory disabled:opacity-50"
      >
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </MissionSection>
  );
}

const PLACES = [
  { href: "/chat", name: "Yazhi Chat", note: "Talk to Yazhi's agents" },
  { href: "/bubble", name: "Bubble UI", note: "The UI library and design system" },
];

/** Where Mission Control can take you. */
export function MissionPlaces() {
  const pathname = usePathname();
  return (
    <MissionSection title="Go to">
      <ul className="grid gap-1">
        {PLACES.map((p) => {
          const here = pathname === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={here ? "page" : undefined}
                className={`block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-ivory/10 ${here ? "bg-ivory/10" : ""}`}
              >
                <span className="block text-ivory">{p.name}</span>
                <span className="block text-xs text-ivory-dim">{p.note}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </MissionSection>
  );
}

/** Mission Control as a drop-down under a header: account, theme, places,
    and whatever the page adds as `children`. */
export function MissionMenu({ children, size = 36, up = false }: { children?: ReactNode; size?: number; /** open above the button, e.g. from a composer */ up?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    wrap.current?.querySelector<HTMLButtonElement>("button")?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      wrap.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <MissionButton size={size} open={open} controls={id} onOpen={() => setOpen((o) => !o)} />
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label="Mission Control"
          className={`absolute z-50 w-[min(20rem,calc(100vw-2rem))] ${up ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"} overflow-hidden rounded-2xl border border-ivory/15 bg-night-2 text-ivory shadow-2xl shadow-black/30`}
          data-lenis-prevent
        >
          <MissionHeader onClose={close} />
          <div className="max-h-[70dvh] overflow-y-auto border-t border-ivory/10">
            <MissionAccount />
            <MissionSection title="Theme">
              <ModeSwitch />
            </MissionSection>
            {children}
            <MissionPlaces />
          </div>
        </div>
      )}
    </div>
  );
}
