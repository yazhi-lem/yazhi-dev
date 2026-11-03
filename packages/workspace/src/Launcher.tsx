"use client";
import type { ReactNode } from "react";
import { Bubble, ModeSwitch, Pill, RuntimeBadge, TinaiScope } from "@yazhi/bubble";
import { firstGrapheme } from "@yazhi/bubble/text";
import { LangToggle, useWsLang } from "./lang";
import type { LinkLike, WorkspaceMeta } from "./types";

/** All the product workspaces on one page: what each is for, who owns it,
    where it stands, its views and its workflows. */
export function WorkspaceLauncher({ workspaces, Link, account, home }: { workspaces: WorkspaceMeta[]; Link: LinkLike; account?: ReactNode; home?: ReactNode }) {
  const { lang, setLang, t } = useWsLang(["ta", "en", "te"]);
  return (
    <TinaiScope tinai="kurinji" className="min-h-dvh">
      <div lang={lang} className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-ivory/10 bg-night/90 backdrop-blur">
          <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              {home}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ivory">{t({ ta: "பணியிடங்கள்", en: "Workspaces", te: "వర్క్‌స్పేస్‌లు" })}</p>
                <p className="truncate text-xs text-ivory-dim">
                  {t({ ta: "ஒரே தளம், ஒவ்வொரு தயாரிப்புக்கும் ஒரு பணியிடம்", en: "One shell, one workspace per product", te: "ఒకే షెల్, ప్రతి ఉత్పత్తికి ఒక వర్క్‌స్పేస్" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LangToggle available={["ta", "en", "te"]} lang={lang} onChange={setLang} />
              <ModeSwitch compact />
              {account}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6">
          <ul className="grid gap-4 md:grid-cols-2">
            {workspaces.map((w) => {
              const local = lang === "te" && w.teName ? w.teName : w.taName;
              return (
                <li key={w.id}>
                  <TinaiScope tinai={w.tinai} as="article" className="h-full rounded-2xl border border-ivory/10">
                    <div className="flex h-full flex-col gap-4 p-5" style={w.accent ? ({ "--accent": w.accent } as React.CSSProperties) : undefined}>
                      <header className="flex items-start gap-3">
                        <Bubble accent="var(--accent)" label={w.name} glyph={firstGrapheme(local)} size={48} />
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-semibold text-ivory">
                            {w.name} <span className="text-sm font-normal text-ivory-dim">{local}</span>
                          </h2>
                          <p className="text-sm text-ivory-dim">{t(w.tagline)}</p>
                        </div>
                        <RuntimeBadge runtime={w.runtime} />
                      </header>
                      <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1 text-xs">
                        <dt className="text-ivory-dim">{t({ ta: "உரிமையாளர்", en: "Owner", te: "యజమాని" })}</dt>
                        <dd className="text-ivory">{w.owner}</dd>
                        <dt className="text-ivory-dim">{t({ ta: "நிலை", en: "Status", te: "స్థితి" })}</dt>
                        <dd className="text-ivory">{t(w.status)}</dd>
                        <dt className="text-ivory-dim">{t({ ta: "முன்னோட்டம்", en: "Pilot", te: "పైలట్" })}</dt>
                        <dd className="text-ivory">{t(w.pilot)}</dd>
                      </dl>
                      <div>
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">Views</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {w.views.map((v, i) => (
                            <li key={v.id}>
                              <Link
                                href={i === 0 ? w.base : `${w.base}/${v.id}`}
                                className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--accent)]/40 px-3 text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
                              >
                                {t(v.label)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">Workflows</p>
                        <ul className="space-y-1 text-xs">
                          {w.workflows.map((f) => (
                            <li key={f.id} className="flex flex-wrap items-baseline gap-x-2 text-ivory">
                              {t(f.title)}
                              <span className="text-ivory-dim">
                                {t(f.who)} · {f.steps.length} {t({ ta: "படிகள்", en: "steps", te: "దశలు" })}
                                {f.length ? ` · ${f.length}` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                        <span className="flex flex-wrap gap-1">
                          {w.agents.map((a) => (
                            <Pill key={a} tone="accent">
                              {a}
                            </Pill>
                          ))}
                          {w.mountsIn && <Pill tone="info">inside {w.mountsIn}</Pill>}
                        </span>
                        <Link href={w.base} className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze">
                          {t({ ta: "திற", en: "Open", te: "తెరువు" })} {w.name}
                        </Link>
                      </div>
                    </div>
                  </TinaiScope>
                </li>
              );
            })}
          </ul>
        </main>
        <footer className="border-t border-ivory/10 px-4 py-3 text-center text-[11px] text-ivory-dim">
          {t({
            ta: "ஒவ்வொரு பணியிடமும் yazhi-api வழியாக மட்டுமே மாதிரியை அடையும். மாதிரித் தரவு மட்டும்.",
            en: "Every workspace reaches a model only through yazhi-api. Sample data only.",
            te: "ప్రతి వర్క్‌స్పేస్ yazhi-api ద్వారా మాత్రమే మోడల్‌ను చేరుతుంది. నమూనా డేటా మాత్రమే.",
          })}
        </footer>
      </div>
    </TinaiScope>
  );
}
