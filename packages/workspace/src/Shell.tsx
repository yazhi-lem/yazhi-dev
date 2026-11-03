"use client";
import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Bubble, DraftTag, ModeSwitch, RuntimeBadge, Segmented, TinaiScope } from "@yazhi/bubble";
import { firstGrapheme } from "@yazhi/bubble/text";
import { TEXT_SIZES, useDialogFocus, useSlashToAsk, useTextSize, type TextSize } from "./a11y";
import { CustomizeDrawer } from "./Customize";
import { Icon } from "./icons";
import { LangToggle, useWsLang } from "./lang";
import { appendAudit } from "./pettagam";
import { useWorkspacePrefs } from "./prefs";
import type { Bi, LinkLike, ModuleContext, WorkspaceManifest } from "./types";

const PlainLink: LinkLike = ({ href, className, children, ...rest }) => (
  <a href={href} className={className} {...rest}>
    {children}
  </a>
);

const L = {
  skip: { ta: "உள்ளடக்கத்துக்குச் செல்", en: "Skip to content", te: "విషయానికి వెళ్ళు" },
  views: { ta: "பார்வைகள்", en: "Views", te: "వీక్షణలు" },
  customize: { ta: "தனிப்பயனாக்கு", en: "Customize", te: "అనుకూలీకరించు" },
  display: { ta: "காட்சி", en: "Display", te: "ప్రదర్శన" },
  textSize: { ta: "எழுத்தின் அளவு", en: "Text size", te: "అక్షర పరిమాణం" },
  theme: { ta: "ஒளி / இருள்", en: "Light or dark", te: "వెలుగు / చీకటి" },
  slash: { ta: "/ அழுத்தினால் கேள்விப் பெட்டிக்குச் செல்லும்", en: "Press / to jump to the question box", te: "/ నొక్కితే ప్రశ్న పెట్టెకు వెళ్తుంది" },
  side: { ta: "பக்கத் தொகுதிகள்", en: "Side modules", te: "పక్క మాడ్యూల్స్" },
  empty: { ta: "இந்தப் பார்வையில் எதுவும் காட்டப்படவில்லை.", en: "Nothing is shown on this view.", te: "ఈ వీక్షణలో ఏమీ చూపబడలేదు." },
  add: { ta: "தொகுதிகளைச் சேர்", en: "Add modules", te: "మాడ్యూల్స్ జోడించు" },
  india: { ta: "தரவு இந்தியாவிலேயே இருக்கும்", en: "Data stays in India", te: "డేటా భారత్‌లోనే ఉంటుంది" },
  cited: { ta: "ஒவ்வொரு பதிலும் மூலத்துடன், அல்லது “தெரியவில்லை”", en: "Every answer cited, or it says it doesn't know", te: "ప్రతి సమాధానానికి మూలం, లేదా “తెలియదు”" },
  draft: { ta: "தமிழ், தெலுங்கு: தாய்மொழியாளர் மதிப்பாய்வுக்குக் காத்திருக்கும் வரைவு", en: "Tamil and Telugu are drafts awaiting native review", te: "తమిళం, తెలుగు: స్థానిక సమీక్ష కోసం వేచి ఉన్న ముసాయిదాలు" },
} satisfies Record<string, Bi>;

/** The shared bilingual shell every product workspace sits on (PRD
    "Shared foundation"): header, main pane, one footer line.

    Header: the workspace's bubble and names, its views as tabs (a bottom
    tab bar on phones), த | EN, Display (text size, light/dark), Customize
    and the account slot. A skip link leads past it; "/" jumps to the
    page's question box; dialogs keep focus inside and give it back. */
export function WorkspaceShell({
  manifest,
  viewId,
  Link = PlainLink,
  navigate,
  account,
  home,
  embeddedIn,
}: {
  manifest: WorkspaceManifest;
  viewId?: string;
  /** the host router's link (Next's Link); plain <a> by default */
  Link?: LinkLike;
  /** the host router's push; a full page load by default */
  navigate?: (href: string) => void;
  /** right end of the header — Mission Control */
  account?: ReactNode;
  /** left end of the header — usually a link back to all workspaces */
  home?: ReactNode;
  /** shown when this workspace is mounted inside another (Kural in Kadai) */
  embeddedIn?: string;
}) {
  const view = manifest.views.find((v) => v.id === viewId) ?? manifest.views[0];
  const { lang, setLang, t } = useWsLang(manifest.languages);
  const prefs = useWorkspacePrefs(manifest);
  const { size, setSize } = useTextSize();
  const [panel, setPanel] = useState<"customize" | "display" | null>(null);
  const close = useCallback(() => setPanel(null), []);
  const page = useRef<HTMLDivElement>(null);
  useSlashToAsk(page);

  const href = useCallback((id: string) => (id === manifest.views[0].id ? manifest.base : `${manifest.base}/${id}`), [manifest]);
  const go = useCallback((id: string) => (navigate ?? ((h: string) => window.location.assign(h)))(href(id)), [navigate, href]);
  const log = useCallback((what: string, sources?: string[]) => appendAudit(manifest.id, what, sources), [manifest.id]);
  const ctx: ModuleContext = useMemo(
    () => ({ meta: manifest, view, lang, t, log, href, go, Link, workflows: prefs.workflows }),
    [manifest, view, lang, t, log, href, go, Link, prefs.workflows],
  );

  const layout = prefs.layoutFor(view.id);
  const tinai = prefs.prefs.tinai ?? manifest.tinai;
  // a workspace accent (Kadai's gold) holds only in its own landscape
  const accent = !prefs.prefs.tinai && manifest.accent ? ({ "--accent": manifest.accent } as CSSProperties) : undefined;
  const localName = lang === "te" && manifest.teName ? manifest.teName : manifest.taName;

  const render = (id: string) => {
    const m = manifest.modules[id];
    if (!m) return null;
    const C = m.component;
    return (
      <div key={id} data-module={id}>
        <C ctx={ctx} />
      </div>
    );
  };

  const pill =
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:border-[color:var(--accent)] hover:text-ivory sm:min-h-9 sm:min-w-9";

  return (
    <TinaiScope tinai={tinai} className="min-h-dvh">
      <div ref={page} lang={lang} style={accent} className="flex min-h-dvh flex-col">
        <a
          href="#ws-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-night"
        >
          {t(L.skip)}
        </a>
        <header className="sticky top-0 z-40 border-b border-ivory/10 bg-night/90 backdrop-blur">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              {home}
              <Bubble accent="var(--accent)" label={manifest.name} glyph={firstGrapheme(localName)} size={36} />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ivory">
                  {lang === "en" ? manifest.name : localName}
                  <span className="ml-2 text-sm font-normal text-ivory-dim">{lang === "en" ? localName : manifest.name}</span>
                </p>
                <p className="hidden truncate text-xs text-ivory-dim sm:block">
                  {t(manifest.tagline)}
                  {embeddedIn && <span className="ml-1 text-[color:var(--accent)]">· {embeddedIn}</span>}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-2 xl:flex">
                <RuntimeBadge runtime={manifest.runtime} />
                {lang !== "en" && <DraftTag what={lang === "te" ? "Telugu copy" : "Tamil copy"} />}
              </span>
              <span className="hidden sm:block">
                <LangToggle available={manifest.languages} lang={lang} onChange={setLang} />
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPanel(panel === "display" ? null : "display")}
                  aria-haspopup="dialog"
                  aria-expanded={panel === "display"}
                  aria-label={t(L.display)}
                  title={t(L.display)}
                  className={pill}
                >
                  <Icon name="type" />
                </button>
                {panel === "display" && (
                  <DisplayPanel t={t} onClose={close} size={size} setSize={setSize} lang={<LangToggle available={manifest.languages} lang={lang} onChange={setLang} />} />
                )}
              </div>
              <button type="button" onClick={() => setPanel("customize")} aria-haspopup="dialog" title={t(L.customize)} className={pill}>
                <Icon name="sliders" size={16} />
                <span className="sr-only md:not-sr-only">{t(L.customize)}</span>
              </button>
              {account}
            </div>
          </div>
          <nav aria-label={`${manifest.name} · ${t(L.views)}`} className="mx-auto hidden max-w-[90rem] overflow-x-auto px-4 sm:block">
            <ul className="flex gap-1 pb-2">
              {manifest.views.map((v) => {
                const on = v.id === view.id;
                return (
                  <li key={v.id} className="shrink-0">
                    <Link
                      href={href(v.id)}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm transition ${
                        on ? "bg-[color:var(--accent)] font-semibold text-night" : "text-ivory-dim hover:text-ivory"
                      }`}
                    >
                      {v.icon && <Icon name={v.icon} size={16} />}
                      {t(v.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        <main id="ws-main" tabIndex={-1} className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-4 focus:outline-none">
          <h1 className="sr-only">
            {manifest.name} — {t(view.label)}
          </h1>
          <p className="mb-4 text-sm text-ivory-dim">{t(view.purpose)}</p>
          {layout.main.length + layout.aside.length === 0 ? (
            <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-ivory/15 px-6 py-16 text-center">
              <p className="text-sm text-ivory">{t(L.empty)}</p>
              <button type="button" onClick={() => setPanel("customize")} className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze">
                {t(L.add)}
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${layout.aside.length && layout.main.length ? "lg:grid-cols-[minmax(0,1fr)_22rem]" : ""}`}>
              {layout.main.length > 0 && (
                <div className="min-w-0 space-y-4">
                  <h2 className="sr-only">{t(view.label)}</h2>
                  {layout.main.map(render)}
                </div>
              )}
              {layout.aside.length > 0 && (
                <aside aria-label={t(L.side)} className="min-w-0 space-y-4">
                  <h2 className="sr-only">{t(L.side)}</h2>
                  {layout.aside.map(render)}
                </aside>
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-ivory/10 px-4 pb-24 pt-3 text-center text-[11px] leading-relaxed text-ivory-dim sm:pb-3">
          <span lang="ta">மாதிரித் தரவு</span> · Sample data · {t(L.india)} · {t(L.cited)} · † {t(L.draft)}
          <span className="hidden sm:inline"> · {t(L.slash)}</span>
          <span className="xl:hidden"> · {manifest.runtime === "device" ? "on-device" : "yazhi-api"}</span>
        </footer>

        {/* phones: the views as a bottom tab bar, within thumb reach */}
        <nav
          aria-label={`${manifest.name} · ${t(L.views)}`}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        >
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${manifest.views.length}, minmax(0, 1fr))` }}>
            {manifest.views.map((v) => {
              const on = v.id === view.id;
              return (
                <li key={v.id}>
                  <Link
                    href={href(v.id)}
                    aria-current={on ? "page" : undefined}
                    className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] leading-tight ${on ? "font-semibold text-[color:var(--accent)]" : "text-ivory-dim"}`}
                  >
                    {v.icon && <Icon name={v.icon} size={20} />}
                    <span className="block max-w-full truncate text-center">{t(v.label)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {panel === "customize" && <CustomizeDrawer manifest={manifest} view={view} prefs={prefs} t={t} onClose={close} />}
      </div>
    </TinaiScope>
  );
}

/** Display: language (on phones, where the header has no room for it),
    reading size and light/dark — one press from anywhere. */
function DisplayPanel({
  t,
  onClose,
  size,
  setSize,
  lang,
}: {
  t: (b: Bi | string) => string;
  onClose: () => void;
  size: TextSize;
  setSize: (s: TextSize) => void;
  lang: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);
  return (
    <>
      <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
      <div
        ref={ref}
        role="dialog"
        aria-label={t(L.display)}
        tabIndex={-1}
        className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] space-y-4 rounded-2xl border border-ivory/15 bg-night-2 p-4 text-ivory focus:outline-none"
      >
        <div className="sm:hidden">
          <p className="mb-1.5 text-xs font-semibold text-ivory-dim">த | EN</p>
          {lang}
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-ivory-dim">{t(L.textSize)}</p>
          <Segmented
            label={t(L.textSize)}
            value={String(size)}
            onChange={(v) => setSize(Number(v) as TextSize)}
            options={TEXT_SIZES.map((s, i) => ({
              value: String(s),
              label: <span style={{ fontSize: `${0.75 + i * 0.15}rem` }}>{["A", "A+", "A++"][i]}</span>,
            }))}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-ivory-dim">{t(L.theme)}</p>
          <ModeSwitch />
        </div>
      </div>
    </>
  );
}
