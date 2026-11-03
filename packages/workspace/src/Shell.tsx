"use client";
import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Bubble, DraftTag, ModeSwitch, RuntimeBadge, TinaiScope } from "@yazhi/bubble";
import { firstGrapheme } from "@yazhi/bubble/text";
import { CustomizeDrawer } from "./Customize";
import { LangToggle, useWsLang } from "./lang";
import { appendAudit } from "./pettagam";
import { useWorkspacePrefs } from "./prefs";
import type { LinkLike, ModuleContext, WorkspaceManifest } from "./types";

const PlainLink: LinkLike = ({ href, className, children, ...rest }) => (
  <a href={href} className={className} {...rest}>
    {children}
  </a>
);

/** The shared bilingual shell every product workspace sits on (PRD
    "Shared foundation"): header, main pane, one footer line. The header
    carries the workspace's bubble, its views as tabs, the த | EN toggle,
    light/dark, Customize and the account slot (Mission Control). The view
    is laid out from the person's saved layout, else the manifest's. */
export function WorkspaceShell({
  manifest,
  viewId,
  Link = PlainLink,
  account,
  home,
  embeddedIn,
}: {
  manifest: WorkspaceManifest;
  viewId?: string;
  /** the host router's link (Next's Link); plain <a> by default */
  Link?: LinkLike;
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
  const [customizing, setCustomizing] = useState(false);
  const close = useCallback(() => setCustomizing(false), []);

  const href = useCallback((id: string) => (id === manifest.views[0].id ? manifest.base : `${manifest.base}/${id}`), [manifest]);
  const log = useCallback((what: string, sources?: string[]) => appendAudit(manifest.id, what, sources), [manifest.id]);
  const ctx: ModuleContext = useMemo(
    () => ({ meta: manifest, view, lang, t, log, href, Link, workflows: prefs.workflows }),
    [manifest, view, lang, t, log, href, Link, prefs.workflows],
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

  return (
    <TinaiScope tinai={tinai} className="min-h-dvh">
      <div lang={lang} style={accent} className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-ivory/10 bg-night/90 backdrop-blur">
          <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              {home}
              <Bubble accent="var(--accent)" label={manifest.name} glyph={firstGrapheme(localName)} size={36} />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ivory">
                  {lang === "en" ? manifest.name : localName}
                  <span className="ml-2 text-sm font-normal text-ivory-dim">{lang === "en" ? localName : manifest.name}</span>
                </p>
                <p className="truncate text-xs text-ivory-dim">
                  {t(manifest.tagline)}
                  {embeddedIn && <span className="ml-1 text-[color:var(--accent)]">· {embeddedIn}</span>}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <RuntimeBadge runtime={manifest.runtime} />
              {lang !== "en" && <DraftTag what={lang === "te" ? "Telugu copy" : "Tamil copy"} />}
              <LangToggle available={manifest.languages} lang={lang} onChange={setLang} />
              <ModeSwitch compact />
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                aria-haspopup="dialog"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:border-[color:var(--accent)] hover:text-ivory"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
                  <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                  <circle cx="16" cy="7" r="2" />
                  <circle cx="10" cy="17" r="2" />
                </svg>
                <span className="sr-only sm:not-sr-only">{t({ ta: "தனிப்பயனாக்கு", en: "Customize", te: "అనుకూలీకరించు" })}</span>
              </button>
              {account}
            </div>
          </div>
          <nav aria-label={`${manifest.name} views`} className="mx-auto max-w-[90rem] overflow-x-auto px-4">
            <ul className="flex gap-1 pb-2">
              {manifest.views.map((v) => {
                const on = v.id === view.id;
                return (
                  <li key={v.id} className="shrink-0">
                    <Link
                      href={href(v.id)}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex min-h-9 items-center whitespace-nowrap rounded-full px-3 text-sm transition ${
                        on ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]" : "text-ivory-dim hover:text-ivory"
                      }`}
                    >
                      {t(v.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-4">
          <p className="mb-4 text-sm text-ivory-dim">{t(view.purpose)}</p>
          {layout.main.length + layout.aside.length === 0 ? (
            <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-ivory/15 px-6 py-16 text-center">
              <p className="text-sm text-ivory">{t({ ta: "இந்தப் பார்வையில் எதுவும் காட்டப்படவில்லை.", en: "Nothing is shown on this view.", te: "ఈ వీక్షణలో ఏమీ చూపబడలేదు." })}</p>
              <button type="button" onClick={() => setCustomizing(true)} className="min-h-10 rounded-full bg-gold px-4 text-sm font-semibold text-night hover:bg-bronze">
                {t({ ta: "தொகுதிகளைச் சேர்", en: "Add modules", te: "మాడ్యూల్స్ జోడించు" })}
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${layout.aside.length && layout.main.length ? "lg:grid-cols-[minmax(0,1fr)_22rem]" : ""}`}>
              {layout.main.length > 0 && <div className="min-w-0 space-y-4">{layout.main.map(render)}</div>}
              {layout.aside.length > 0 && (
                <aside aria-label={t({ ta: "பக்கத் தொகுதிகள்", en: "Side modules", te: "పక్క మాడ్యూల్స్" })} className="min-w-0 space-y-4">
                  {layout.aside.map(render)}
                </aside>
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-ivory/10 px-4 py-3 text-center text-[11px] text-ivory-dim">
          <span lang="ta">மாதிரித் தரவு</span> · Sample data · {t({ ta: "தரவு இந்தியாவிலேயே இருக்கும்", en: "Data stays in India", te: "డేటా భారత్‌లోనే ఉంటుంది" })} ·{" "}
          {t({ ta: "ஒவ்வொரு பதிலும் மூலத்துடன், அல்லது “தெரியவில்லை”", en: "Every answer cited, or it says it doesn't know", te: "ప్రతి సమాధానానికి మూలం, లేదా “తెలియదు”" })} · † {t({ ta: "தமிழ், தெலுங்கு: தாய்மொழியாளர் மதிப்பாய்வுக்குக் காத்திருக்கும் வரைவு", en: "Tamil and Telugu are drafts awaiting native review", te: "తమిళం, తెలుగు: స్థానిక సమీక్ష కోసం వేచి ఉన్న ముసాయిదాలు" })}
        </footer>
        {customizing && <CustomizeDrawer manifest={manifest} view={view} prefs={prefs} t={t} onClose={close} />}
      </div>
    </TinaiScope>
  );
}
