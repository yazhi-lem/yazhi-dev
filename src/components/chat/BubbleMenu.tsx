"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { THEME_OPTIONS, useYbiTheme } from "@/bubble";
import { useLang, type Lang } from "@/lib/i18n";
import { S, useBi } from "./strings";

const LANGS: { value: Lang; label: string }[] = [
  { value: "ta", label: "தமிழ்" },
  { value: "en", label: "English" },
  { value: "both", label: "இரண்டும் · Both" },
];

type ActionId = "new" | "conv" | "about" | "home";

/** Menu entries are plain data; one click handler (select) dispatches. */
type Item =
  | { kind: "action"; id: ActionId; label: string }
  | { kind: "radio"; id: string; label: string; checked: boolean; set: () => void }
  | { kind: "sep"; id: string; label?: string };

/** The Yazhi mark as a floating action button that opens the app menu —
    WAI-ARIA menu button pattern: Enter/Space/↓ opens and focuses the first
    item, ↑ opens on the last; ↑/↓ move, Home/End jump, Esc closes and
    returns focus to the button, Tab closes. Radio items (theme, language)
    keep the menu open so a choice can be compared in place. Items rise
    as a stack of bubbles; motion is dropped under reduced motion. */
export function BubbleMenu({
  bottom,
  conversationsLabel,
  onNew,
  onConversations,
  onAbout,
}: {
  /** px from the viewport bottom — sits above the composer */
  bottom: number;
  conversationsLabel: string;
  onNew: () => void;
  onConversations: () => void;
  onAbout: () => void;
}) {
  const t = useBi();
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [theme, setTheme] = useYbiTheme();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const focusOnOpen = useRef<"first" | "last">("first");

  const items: Item[] = [
    { kind: "action", id: "new", label: t(S.newChat) },
    { kind: "action", id: "conv", label: conversationsLabel },
    { kind: "sep", id: "s-theme", label: t(S.theme) },
    ...THEME_OPTIONS.map<Item>((o) => ({
      kind: "radio",
      id: `theme-${o.value}`,
      label: `${o.label} · ${o.value === "mugil" ? "Mugil" : "Ink"}`,
      checked: theme === o.value,
      set: () => setTheme(o.value),
    })),
    { kind: "sep", id: "s-lang", label: t(S.language) },
    ...LANGS.map<Item>((l) => ({
      kind: "radio",
      id: `lang-${l.value}`,
      label: l.label,
      checked: lang === l.value,
      set: () => setLang(l.value),
    })),
    { kind: "sep", id: "s-end" },
    { kind: "action", id: "about", label: t(S.about) },
    { kind: "action", id: "home", label: t(S.home) },
  ];
  // position of each item among the focusable ones, for the ref array
  const focusIds = items.filter((i) => i.kind !== "sep").map((i) => i.id);

  function close(refocus = true) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function select(it: Item) {
    if (it.kind === "radio") return it.set(); // radios keep the menu open
    if (it.kind !== "action") return;
    close(false);
    const actions: Record<ActionId, () => void> = {
      new: onNew,
      conv: onConversations,
      about: onAbout,
      home: () => router.push("/"),
    };
    actions[it.id]();
  }

  // focus the first/last item when the menu opens
  useEffect(() => {
    if (!open) return;
    const idx = focusOnOpen.current === "first" ? 0 : focusIds.length - 1;
    itemRefs.current[idx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // click outside closes without stealing focus back
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function onButtonKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last";
      setOpen(true);
    }
  }

  function onMenuKey(e: KeyboardEvent) {
    const els = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => {
      e.preventDefault();
      els[(n + els.length) % els.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(els.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") setOpen(false);
  }

  return (
    <nav ref={wrapRef} aria-label={t(S.menu)} className="fixed right-4 z-50 flex flex-col items-end gap-3 sm:right-6" style={{ bottom }}>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t(S.menu)}
          onKeyDown={onMenuKey}
          className="ybi-menu flex max-h-[min(70dvh,32rem)] w-64 flex-col gap-1 overflow-y-auto rounded-3xl p-2"
        >
          {items.map((it, idx) => {
            if (it.kind === "sep") {
              return it.label ? (
                <p key={it.id} role="presentation" className="px-3 pb-0.5 pt-2 text-[11px] text-ivory-dim">
                  {it.label}
                </p>
              ) : (
                <hr key={it.id} role="separator" className="mx-3 my-1 border-ivory/10" />
              );
            }
            const myIndex = focusIds.indexOf(it.id);
            return (
              <button
                key={it.id}
                ref={(el) => {
                  itemRefs.current[myIndex] = el;
                }}
                type="button"
                role={it.kind === "radio" ? "menuitemradio" : "menuitem"}
                aria-checked={it.kind === "radio" ? it.checked : undefined}
                tabIndex={-1}
                onClick={() => select(it)}
                style={{ transitionDelay: `${Math.min(idx, 10) * 18}ms` }}
                className="ybi-menu-item flex min-h-11 items-center justify-between gap-3 rounded-full px-4 text-left text-sm text-ivory"
              >
                <span>{it.label}</span>
                {it.kind === "radio" && (
                  <span
                    aria-hidden
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      it.checked ? "border-gold bg-gold" : "border-ivory/30"
                    }`}
                  >
                    {it.checked && <span className="h-1.5 w-1.5 rounded-full bg-night" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        data-ybi-fab=""
        aria-label={t(S.menu)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          focusOnOpen.current = "first";
          setOpen((v) => !v);
        }}
        onKeyDown={onButtonKey}
        className="ybi-fab grid h-14 w-14 place-items-center rounded-full"
      >
        <span className={`transition-transform duration-300 ${open ? "rotate-[-20deg] scale-95" : ""}`}>
          <LogoMark size={30} />
        </span>
      </button>
    </nav>
  );
}
