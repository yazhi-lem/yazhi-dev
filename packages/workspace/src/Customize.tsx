"use client";
import { useRef, useState } from "react";
import { useDialogFocus } from "./a11y";
import { ENVIRONMENTS, Segmented, TinaiMark, type ThinaiKey } from "@yazhi/bubble";
import type { useWorkspacePrefs } from "./prefs";
import type { Bi, ViewMeta, WorkspaceManifest } from "./types";

type Prefs = ReturnType<typeof useWorkspacePrefs>;
type Tab = "layout" | "landscape" | "workflows";

const L = {
  title: { ta: "தனிப்பயனாக்கு", en: "Customize", te: "అనుకూలీకరించు" },
  close: { ta: "மூடு", en: "Close", te: "మూసివేయి" },
  layout: { ta: "அமைப்பு", en: "Layout", te: "లేఅవుట్" },
  landscape: { ta: "திணை", en: "Landscape", te: "తిణై" },
  workflows: { ta: "பணிவழிகள்", en: "Workflows", te: "వర్క్‌ఫ్లోలు" },
  main: { ta: "முதன்மை", en: "Main", te: "ప్రధాన" },
  aside: { ta: "பக்கம்", en: "Side", te: "పక్క" },
  hidden: { ta: "மறைவு", en: "Hidden", te: "దాచినవి" },
  resetView: { ta: "இந்தப் பார்வையை மீட்டமை", en: "Reset this view", te: "ఈ వీక్షణను రీసెట్ చేయి" },
  resetAll: { ta: "அனைத்தையும் மீட்டமை", en: "Reset everything", te: "అన్నీ రీసెట్ చేయి" },
  own: { ta: "பணியிடத்தின் சொந்தத் திணை", en: "The workspace's own landscape", te: "వర్క్‌స్పేస్ సొంత తిణై" },
  newWf: { ta: "புதிய பணிவழி", en: "New workflow", te: "కొత్త వర్క్‌ఫ్లో" },
  wfName: { ta: "பணிவழியின் பெயர்", en: "Workflow name", te: "వర్క్‌ఫ్లో పేరు" },
  pick: { ta: "படிகளைத் தேர்ந்தெடுக்கும் வரிசையில் அவை சேரும்.", en: "Steps join in the order you tick them.", te: "మీరు ఎంచుకున్న క్రమంలో దశలు చేరతాయి." },
  save: { ta: "சேமி", en: "Save", te: "సేవ్" },
  remove: { ta: "நீக்கு", en: "Remove", te: "తొలగించు" },
  stored: {
    ta: "மாற்றங்கள் இந்த உலாவியில் மட்டும் சேமிக்கப்படும்.",
    en: "Changes are kept in this browser only.",
    te: "మార్పులు ఈ బ్రౌజర్‌లో మాత్రమే ఉంటాయి.",
  },
} satisfies Record<string, Bi>;

const iconBtn =
  "grid h-10 w-10 place-items-center rounded-full border border-ivory/15 text-xs text-ivory-dim hover:border-ivory/40 hover:text-ivory disabled:opacity-30";

/** The Customize drawer: which modules a view shows, in which column and
    order; the landscape; and the workflows — switch steps off, reorder
    them, or build a new workflow from the workspace's step library. */
export function CustomizeDrawer({
  manifest,
  view,
  prefs,
  t,
  onClose,
}: {
  manifest: WorkspaceManifest;
  view: ViewMeta;
  prefs: Prefs;
  t: (b: Bi | string) => string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("layout");
  const panel = useRef<HTMLDivElement>(null);

  useDialogFocus(panel, onClose);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="absolute inset-0 bg-night/60 backdrop-blur-[2px]" />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t(L.title)}
        className="relative flex h-full w-full max-w-md flex-col border-l border-ivory/10 bg-night-2 text-ivory focus:outline-none"
      >
        <header className="flex items-center justify-between gap-2 border-b border-ivory/10 px-4 py-3">
          <div>
            <p className="text-[11px] text-[color:var(--accent)]">{manifest.name}</p>
            <h2 className="text-base font-semibold">{t(L.title)}</h2>
          </div>
          <button type="button" data-autofocus onClick={onClose} className="min-h-11 rounded-full border border-ivory/20 px-4 text-sm text-ivory-dim hover:text-ivory">
            {t(L.close)}
          </button>
        </header>
        <div className="border-b border-ivory/10 px-4 py-2">
          <Segmented
            label={t(L.title)}
            value={tab}
            onChange={setTab}
            options={[
              { value: "layout", label: t(L.layout) },
              { value: "landscape", label: t(L.landscape) },
              { value: "workflows", label: t(L.workflows) },
            ]}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" data-lenis-prevent>
          {tab === "layout" && <LayoutTab manifest={manifest} view={view} prefs={prefs} t={t} />}
          {tab === "landscape" && <LandscapeTab manifest={manifest} prefs={prefs} t={t} />}
          {tab === "workflows" && <WorkflowsTab manifest={manifest} prefs={prefs} t={t} />}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-ivory/10 px-4 py-3 text-xs text-ivory-dim">
          <span>{t(L.stored)}</span>
          <button type="button" onClick={prefs.resetAll} className="min-h-9 rounded-full border border-ivory/20 px-3 hover:border-palai/60 hover:text-ivory">
            {t(L.resetAll)}
          </button>
        </footer>
      </div>
    </div>
  );
}

function LayoutTab({ manifest, view, prefs, t }: { manifest: WorkspaceManifest; view: ViewMeta; prefs: Prefs; t: (b: Bi | string) => string }) {
  const layout = prefs.layoutFor(view.id);
  const a = prefs.layoutActions;
  const hidden = Object.keys(manifest.modules).filter((id) => !layout.main.includes(id) && !layout.aside.includes(id));
  const group = (title: Bi, ids: string[], col?: "main" | "aside") => (
    <section className="mb-5">
      <h3 className="mb-2 text-[11px] font-semibold text-ivory-dim">{t(title)}</h3>
      {ids.length === 0 ? (
        <p className="text-xs text-ivory-dim">—</p>
      ) : (
        <ul className="space-y-2">
          {ids.map((id, i) => {
            const m = manifest.modules[id];
            return (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-ivory/10 bg-night/60 px-3 py-2">
                <input
                  type="checkbox"
                  checked={!!col}
                  onChange={(e) => (e.target.checked ? a.show(view.id, id, "aside") : a.hide(view.id, id))}
                  aria-label={t(m.title)}
                  className="accent-[var(--gold)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{t(m.title)}</p>
                  <p className="truncate text-[11px] text-ivory-dim">{t(m.about)}</p>
                </div>
                {col && (
                  <span className="flex shrink-0 gap-1">
                    <button type="button" className={iconBtn} disabled={i === 0} onClick={() => a.move(view.id, id, -1)} aria-label={`Move ${t(m.title)} up`}>
                      ↑
                    </button>
                    <button type="button" className={iconBtn} disabled={i === ids.length - 1} onClick={() => a.move(view.id, id, 1)} aria-label={`Move ${t(m.title)} down`}>
                      ↓
                    </button>
                    <button
                      type="button"
                      className={iconBtn}
                      onClick={() => a.swapColumn(view.id, id)}
                      aria-label={`Move ${t(m.title)} to the ${col === "main" ? "side" : "main"} column`}
                      title={col === "main" ? t(L.aside) : t(L.main)}
                    >
                      ⇄
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
  return (
    <>
      <p className="mb-4 text-sm text-ivory-dim">
        <span className="text-ivory">{t(view.label)}</span> — {t(view.purpose)}
      </p>
      {group(L.main, layout.main, "main")}
      {group(L.aside, layout.aside, "aside")}
      {group(L.hidden, hidden)}
      <button type="button" onClick={() => a.resetView(view.id)} className="min-h-9 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:text-ivory">
        {t(L.resetView)}
      </button>
    </>
  );
}

function LandscapeTab({ manifest, prefs, t }: { manifest: WorkspaceManifest; prefs: Prefs; t: (b: Bi | string) => string }) {
  const current: ThinaiKey = prefs.prefs.tinai ?? manifest.tinai;
  return (
    <ul className="space-y-2">
      {ENVIRONMENTS.map((env) => {
        const on = env.key === current;
        return (
          <li key={env.key}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => prefs.setTinai(env.key === manifest.tinai ? undefined : env.key)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${on ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10" : "border-ivory/10 hover:border-ivory/30"}`}
            >
              <span style={{ color: `var(--${env.key})` }}>
                <TinaiMark tinai={env.key} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm">
                  <span lang="ta">{env.ta}</span> · {env.en}
                </span>
                <span className="block truncate text-[11px] text-ivory-dim">{env.useFor}</span>
              </span>
              {env.key === manifest.tinai && <span className="shrink-0 text-[11px] text-ivory-dim">{t(L.own)}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function WorkflowsTab({ manifest, prefs, t }: { manifest: WorkspaceManifest; prefs: Prefs; t: (b: Bi | string) => string }) {
  const a = prefs.workflowActions;
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const viewName = (id: string) => t(manifest.views.find((v) => v.id === id)?.label ?? id);
  return (
    <>
      {manifest.workflows.map((w) => {
        const s = prefs.prefs.steps?.[w.id];
        const ids = w.steps.map((x) => x.id);
        const order = [...(s?.order?.filter((id) => ids.includes(id)) ?? []), ...ids.filter((id) => !s?.order?.includes(id))];
        return (
          <section key={w.id} className="mb-5">
            <h3 className="text-sm font-semibold">{t(w.title)}</h3>
            <p className="mb-2 text-[11px] text-ivory-dim">
              {t(w.who)}
              {w.length ? ` · ${w.length}` : ""}
            </p>
            <ul className="space-y-1.5">
              {order.map((id, i) => {
                const step = w.steps.find((x) => x.id === id)!;
                const on = !s?.off.includes(id);
                return (
                  <li key={id} className="flex items-center gap-2 rounded-lg border border-ivory/10 bg-night/60 px-3 py-1.5">
                    <input type="checkbox" checked={on} onChange={() => a.toggleStep(w.id, id)} aria-label={t(step.title)} className="accent-[var(--gold)]" />
                    <span className={`min-w-0 flex-1 truncate text-xs ${on ? "text-ivory" : "text-ivory-dim line-through"}`}>
                      {t(step.title)} <span className="text-ivory-dim">· {viewName(step.view)}</span>
                    </span>
                    <button type="button" className={iconBtn} disabled={i === 0} onClick={() => a.moveStep(w.id, id, -1)} aria-label={`Move ${t(step.title)} up`}>
                      ↑
                    </button>
                    <button type="button" className={iconBtn} disabled={i === order.length - 1} onClick={() => a.moveStep(w.id, id, 1)} aria-label={`Move ${t(step.title)} down`}>
                      ↓
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {(prefs.prefs.custom ?? []).map((w) => (
        <section key={w.id} className="mb-5 rounded-xl border border-[color:var(--accent)]/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{t(w.title)}</h3>
            <button type="button" onClick={() => a.removeCustom(w.id)} className="min-h-8 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:border-palai/60 hover:text-ivory">
              {t(L.remove)}
            </button>
          </div>
          <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-xs text-ivory-dim">
            {w.steps.map((s, i) => (
              <li key={`${s.id}-${i}`}>
                {t(s.title)} · {viewName(s.view)}
              </li>
            ))}
          </ol>
        </section>
      ))}
      <section className="rounded-xl border border-dashed border-ivory/20 p-3">
        <h3 className="text-sm font-semibold">{t(L.newWf)}</h3>
        <p className="mb-2 text-[11px] text-ivory-dim">{t(L.pick)}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(L.wfName)}
          aria-label={t(L.wfName)}
          className="mb-2 min-h-10 w-full rounded-lg border border-ivory/15 bg-night px-3 text-sm text-ivory focus:border-gold/60 focus:outline-none"
        />
        <ul className="max-h-64 space-y-1 overflow-y-auto" data-lenis-prevent>
          {prefs.stepLibrary.map((s) => {
            const at = picked.indexOf(s.id);
            return (
              <li key={s.id}>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={at >= 0}
                    onChange={(e) => setPicked((p) => (e.target.checked ? [...p, s.id] : p.filter((x) => x !== s.id)))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="w-5 font-mono text-[10px] text-[color:var(--accent)]">{at >= 0 ? at + 1 : ""}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {t(s.title)} <span className="text-ivory-dim">· {viewName(s.view)}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          disabled={!name.trim() || !picked.length}
          onClick={() => {
            a.addCustom(name, picked);
            setName("");
            setPicked([]);
          }}
          className="mt-3 min-h-10 rounded-full bg-gold px-4 text-sm font-semibold text-night hover:bg-bronze disabled:opacity-40"
        >
          {t(L.save)}
        </button>
      </section>
    </>
  );
}
