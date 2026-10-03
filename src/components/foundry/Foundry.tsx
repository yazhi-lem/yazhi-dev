"use client";
import { useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { BubbleUI } from "@/components/bubble/BubbleUI";
import { useCircleSession } from "@/components/circle/CircleProvider";
import { STARTER_BUBBLES } from "@/lib/bubble/starters";
import { blankBubble, forkBubble, signBubble, useDrafts } from "@/lib/bubble/drafts";
import {
  MAX_PROMPT_CHARS,
  validateManifest,
  type BubbleManifest,
  type BubblePermission,
} from "@/lib/bubble/types";

const SWATCHES = ["#8b7ae0", "#4f9d6b", "#b7a03c", "#4a8ab5", "#c25b3c", "#c49a38"];
const SWATCH_NAMES = ["Kurinji", "Mullai", "Marutham", "Neytal", "Palai", "Gold"];

const input =
  "w-full rounded-lg border border-ivory/15 bg-night px-3 py-2 text-sm text-ivory placeholder:text-ivory-dim/40 focus:border-gold/60 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2 text-xs font-semibold text-ivory">
        {label}
        {hint && <span className="font-normal text-ivory-dim/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

type Pane = "edit" | "preview";

/** Foundry — the agent builder. Edit a bubble on the left, talk to it in a
    live Bubble UI on the right, export the manifest when it's ready. */
export function Foundry() {
  const { state } = useCircleSession();
  const account = state.status === "signed-in" ? state.account : null;
  const { drafts, loaded, upsert, remove } = useDrafts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [pane, setPane] = useState<Pane>("edit");
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const draft = drafts.find((d) => d.id === selectedId) ?? drafts[0];
  const errors = useMemo(() => (draft ? validateManifest(draft) : []), [draft]);
  const trayBubbles = useMemo(() => (draft ? [draft, ...STARTER_BUBBLES] : STARTER_BUBBLES), [draft]);

  if (!loaded || !draft) {
    return <div className="grid flex-1 place-items-center text-sm text-ivory-dim">Opening Foundry…</div>;
  }

  const update = (patch: (m: BubbleManifest) => BubbleManifest) => upsert(patch(structuredClone(draft)), draft.id);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const signed = (): BubbleManifest => {
    if (!account) return draft;
    const s = signBubble(draft, account);
    const clash = drafts.some((d) => d.id === s.id && d.id !== draft.id);
    return clash ? { ...s, id: `${s.id}-${Math.random().toString(36).slice(2, 5)}` } : s;
  };

  const exportJson = () => {
    const m = signed();
    if (m.id !== draft.id || m.author !== draft.author) {
      upsert(m, draft.id);
      setSelectedId(m.id);
    }
    download(`${m.id}.bubble.json`, JSON.stringify(m, null, 2));
    flash(account ? "Exported, signed with your Circle account." : "Exported unsigned — sign in with Circle to sign it.");
  };

  const copyJson = () => {
    navigator.clipboard
      ?.writeText(JSON.stringify(signed(), null, 2))
      .then(() => flash("Manifest copied."))
      .catch(() => flash("Couldn't reach the clipboard."));
  };

  const importFile = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      const problems = validateManifest(parsed);
      if (problems.length) {
        flash(`Not a valid bubble: ${problems[0]}`);
        return;
      }
      // An import is always a fork: it becomes your draft, unsigned.
      const fork = forkBubble(parsed as BubbleManifest);
      upsert(fork);
      setSelectedId(fork.id);
      flash(`Imported "${(parsed as BubbleManifest).name}" as a new draft.`);
    } catch {
      flash("That file isn't JSON.");
    }
  };

  const select = (id: string) => {
    setSelectedId(id);
    setPreviewId(id);
  };

  const togglePermission = (p: BubblePermission) =>
    update((m) => ({
      ...m,
      permissions: m.permissions.includes(p) ? m.permissions.filter((x) => x !== p) : [...m.permissions, p],
    }));

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* drafts rail */}
      <aside className="shrink-0 border-ivory/10 max-lg:border-b lg:w-64 lg:border-r">
        <div className="chat-scroll flex gap-2 overflow-x-auto p-3 lg:h-full lg:flex-col lg:overflow-y-auto" data-lenis-prevent>
          <div className="flex shrink-0 gap-2 lg:mb-2">
            <button
              type="button"
              onClick={() => {
                const b = upsert(blankBubble());
                select(b.id);
              }}
              className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-night"
            >
              + New bubble
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-ivory/15 px-3 py-1.5 text-xs text-ivory-dim hover:text-ivory"
            >
              Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importFile(f);
                e.target.value = "";
              }}
            />
          </div>
          <p className="hidden px-1 font-mono text-[10px] uppercase tracking-widest text-ivory-dim/70 lg:block">Your drafts</p>
          {drafts.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => select(d.id)}
              aria-current={d.id === draft.id ? "true" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition lg:w-full ${
                d.id === draft.id ? "bg-ivory/10 text-ivory" : "text-ivory-dim hover:bg-ivory/5"
              }`}
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.accent }} aria-hidden />
              <span className="truncate">{d.name || "Untitled"}</span>
            </button>
          ))}
          <p className="mt-3 hidden px-1 font-mono text-[10px] uppercase tracking-widest text-ivory-dim/70 lg:block">Fork a starter</p>
          {STARTER_BUBBLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                const f = upsert(forkBubble(s));
                select(f.id);
                flash(`Forked ${s.name}.`);
              }}
              className="hidden shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ivory-dim hover:bg-ivory/5 lg:flex lg:w-full"
            >
              <span className="h-3 w-3 shrink-0 rounded-full border border-ivory/30" style={{ backgroundColor: s.accent }} aria-hidden />
              <span className="truncate">{s.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* phone: switch between editor and preview */}
      <div className="flex shrink-0 gap-1 border-b border-ivory/10 p-2 lg:hidden" role="tablist">
        {(["edit", "preview"] as Pane[]).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={pane === p}
            onClick={() => setPane(p)}
            className={`flex-1 rounded-md py-1.5 text-sm ${pane === p ? "bg-ivory/10 text-ivory" : "text-ivory-dim"}`}
          >
            {p === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      {/* editor */}
      <section
        aria-label="Bubble editor"
        className={`chat-scroll min-h-0 flex-1 overflow-y-auto p-4 lg:max-w-xl lg:border-r lg:border-ivory/10 ${pane === "edit" ? "" : "max-lg:hidden"}`}
        data-lenis-prevent
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-gold">
              <span className="font-mono uppercase tracking-widest">Foundry</span> ·{" "}
              {/* Tamil never takes letter-spacing — it splits grapheme clusters */}
              <span lang="ta">பட்டறை</span>
            </p>
            <h1 className="display font-display text-2xl font-bold text-ivory">{draft.name || "Untitled bubble"}</h1>
            <p className="mt-0.5 font-mono text-[11px] text-ivory-dim/70">{account ? signBubble(draft, account).id : draft.id}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${draft.name}"? This can't be undone.`)) remove(draft.id);
            }}
            className="rounded-lg border border-ivory/15 px-2.5 py-1 text-xs text-ivory-dim hover:border-palai/60 hover:text-ivory"
          >
            Delete
          </button>
        </div>

        <div className={`mt-4 rounded-lg border p-3 text-xs ${account ? "border-mullai/30 bg-mullai/5 text-ivory-dim" : "border-gold/30 bg-gold/5 text-ivory-dim"}`}>
          {account ? (
            <>
              Signing as <span className="text-ivory">{account.fullName || account.email}</span>. Exports carry your Circle account as author.
            </>
          ) : (
            <>
              You&apos;re building unsigned. Sign in with Circle (top right) to sign exports and to test on yazhi-api.
              On-device testing works without an account.
            </>
          )}
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" hint="≤60">
              <input className={input} value={draft.name} maxLength={60} onChange={(e) => update((m) => ({ ...m, name: e.target.value }))} />
            </Field>
            <Field label="Tamil name" hint="draft — native review">
              <input lang="ta" className={input} value={draft.taName ?? ""} maxLength={60} onChange={(e) => update((m) => ({ ...m, taName: e.target.value }))} />
            </Field>
          </div>
          <Field label="Description" hint={`${draft.description.length}/280`}>
            <input className={input} value={draft.description} maxLength={280} onChange={(e) => update((m) => ({ ...m, description: e.target.value }))} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-1 text-xs font-semibold text-ivory">Colour</legend>
              <div className="flex flex-wrap items-center gap-2">
                {SWATCHES.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update((m) => ({ ...m, accent: c }))}
                    aria-label={SWATCH_NAMES[i]}
                    aria-pressed={draft.accent.toLowerCase() === c}
                    className={`h-7 w-7 rounded-full ${draft.accent.toLowerCase() === c ? "ring-2 ring-ivory ring-offset-2 ring-offset-night" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={draft.accent}
                  onChange={(e) => update((m) => ({ ...m, accent: e.target.value }))}
                  aria-label="Custom colour"
                  className="h-7 w-9 cursor-pointer rounded border border-ivory/15 bg-transparent"
                />
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-xs font-semibold text-ivory">Size in tray</legend>
              <div className="flex gap-2">
                {(["s", "m", "l"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update((m) => ({ ...m, size: s }))}
                    aria-pressed={draft.size === s}
                    className={`rounded-lg border px-3 py-1 text-sm ${draft.size === s ? "border-gold/60 bg-gold/10 text-gold" : "border-ivory/15 text-ivory-dim"}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <Field label="Persona / system prompt" hint={`${draft.agent.systemPrompt.length}/${MAX_PROMPT_CHARS}`}>
            <textarea
              className={`${input} min-h-40 font-mono text-[12.5px] leading-relaxed`}
              value={draft.agent.systemPrompt}
              maxLength={MAX_PROMPT_CHARS}
              onChange={(e) => update((m) => ({ ...m, agent: { ...m.agent, systemPrompt: e.target.value } }))}
            />
          </Field>
          <Field label="Greeting" hint="first message in a new thread">
            <textarea
              className={`${input} min-h-20`}
              value={draft.agent.greeting}
              maxLength={1000}
              onChange={(e) => update((m) => ({ ...m, agent: { ...m.agent, greeting: e.target.value } }))}
            />
          </Field>
          <label className="flex items-start gap-2 text-sm text-ivory-dim">
            <input
              type="checkbox"
              checked={draft.agent.fivePosture}
              onChange={(e) => update((m) => ({ ...m, agent: { ...m.agent, fivePosture: e.target.checked } }))}
              className="mt-1 accent-[var(--gold)]"
            />
            <span>
              <span className="text-ivory">Five-Posture kernel</span> — context, reason, plan, respond, reflect. Adds the
              rule to say &quot;I don&apos;t know&quot; rather than guess.
            </span>
          </label>

          <fieldset className="rounded-xl border border-ivory/10 p-3">
            <legend className="px-1 text-xs font-semibold text-ivory">Runtime</legend>
            <div className="flex flex-wrap gap-4 text-sm text-ivory-dim">
              {(["device", "yazhi-api"] as const).map((r) => (
                <label key={r} className="inline-flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="prefer"
                    checked={draft.runtime.prefer === r}
                    onChange={() =>
                      update((m) => ({
                        ...m,
                        runtime: { ...m.runtime, prefer: r },
                        permissions:
                          r === "yazhi-api" && !m.permissions.includes("yazhi-api") ? [...m.permissions, "yazhi-api"] : m.permissions,
                      }))
                    }
                    className="accent-[var(--gold)]"
                  />
                  {r === "device" ? "Prefer on-device" : "Prefer yazhi-api"}
                </label>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="yazhi-api model">
                <select
                  className={input}
                  value={draft.runtime.model}
                  onChange={(e) => update((m) => ({ ...m, runtime: { ...m.runtime, model: e.target.value } }))}
                >
                  <option value="adhan">adhan</option>
                </select>
              </Field>
              <Field label="On-device model">
                <input
                  className={`${input} font-mono text-xs`}
                  value={draft.runtime.deviceModel}
                  maxLength={80}
                  spellCheck={false}
                  onChange={(e) => update((m) => ({ ...m, runtime: { ...m.runtime, deviceModel: e.target.value } }))}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-ivory/10 p-3">
            <legend className="px-1 text-xs font-semibold text-ivory">Permissions</legend>
            {(
              [
                ["yazhi-api", "Run on Adhan through yazhi-api (needs the user's Circle session)"],
                ["clipboard", "Let users copy replies"],
              ] as [BubblePermission, string][]
            ).map(([p, label]) => (
              <label key={p} className="mt-1 flex items-start gap-2 text-sm text-ivory-dim">
                <input type="checkbox" checked={draft.permissions.includes(p)} onChange={() => togglePermission(p)} className="mt-1 accent-[var(--gold)]" />
                <span>
                  <code className="font-mono text-xs text-ivory">{p}</code> — {label}
                </span>
              </label>
            ))}
          </fieldset>

          {errors.length > 0 && (
            <ul role="alert" className="list-disc space-y-1 rounded-lg border border-palai/40 bg-palai/10 py-2 pl-7 pr-3 text-xs text-ivory">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 pb-6">
            <button
              type="button"
              disabled={errors.length > 0}
              onClick={exportJson}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-night hover:bg-bronze hover:text-ivory disabled:opacity-40"
            >
              Export bubble.json
            </button>
            <button type="button" disabled={errors.length > 0} onClick={copyJson} className="rounded-lg border border-ivory/20 px-4 py-2 text-sm text-ivory hover:border-gold/60 disabled:opacity-40">
              Copy JSON
            </button>
            <button
              type="button"
              disabled
              title="The shared registry opens with Yazhi Dev v3"
              className="cursor-not-allowed rounded-lg border border-dashed border-ivory/20 px-4 py-2 text-sm text-ivory-dim/60"
            >
              Publish — v3
            </button>
          </div>
          <p className="-mt-4 pb-6 text-xs text-ivory-dim/70">
            Drafts save automatically in this browser. <Link href="/bubble#manifest" className="text-gold">Manifest reference</Link>
          </p>
        </div>
      </section>

      {/* live preview */}
      <section
        aria-label="Live preview"
        className={`flex min-h-0 flex-1 flex-col p-4 ${pane === "preview" ? "" : "max-lg:hidden"}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ivory-dim">Live preview</p>
          <button
            type="button"
            onClick={() => {
              setPreviewKey((k) => k + 1);
              setPreviewId(draft.id);
            }}
            className="rounded-md border border-ivory/15 px-2 py-0.5 text-xs text-ivory-dim hover:text-ivory"
          >
            Reset conversation
          </button>
        </div>
        <BubbleUI
          key={previewKey}
          bubbles={trayBubbles}
          activeId={previewId && trayBubbles.some((b) => b.id === previewId) ? previewId : draft.id}
          onActiveChange={setPreviewId}
          draftId={draft.id}
          className="min-h-[28rem] flex-1"
        />
      </section>

      {notice && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-ivory/15 bg-night-2 px-4 py-2 text-sm text-ivory shadow-xl">
          {notice}
        </div>
      )}
    </div>
  );
}
