"use client";
import { Panel, Pill } from "@yazhi/bubble";
import { appendAudit } from "./pettagam";
import { useStored } from "./store";
import type { ModuleContext, WorkflowDef } from "./types";

/** Progress through the workspace's workflows, per viewer. */
interface Progress {
  active?: string;
  done: Record<string, string[]>;
}
const KEY = (ws: string) => `yazhi-ws:${ws}:workflow`;

export function useWorkflowProgress(ws: string, workflows: WorkflowDef[]) {
  const [p, setP] = useStored<Progress>(KEY(ws), { done: {} });
  const active = workflows.find((w) => w.id === p.active) ?? workflows[0];
  const done = (active && p.done?.[active.id]) ?? [];
  return {
    active,
    done,
    choose: (id: string) => setP((x) => ({ ...x, active: id })),
    mark: (wf: string, step: string, on: boolean) =>
      setP((x) => {
        const cur = x.done?.[wf] ?? [];
        const next = on ? (cur.includes(step) ? cur : [...cur, step]) : cur.filter((s) => s !== step);
        return { ...x, done: { ...x.done, [wf]: next } };
      }),
    restart: (wf: string) => setP((x) => ({ ...x, done: { ...x.done, [wf]: [] } })),
  };
}

/** The guided path through a workspace: pick a workflow, see every step
    with where it happens, open that view, mark it done. Steps that change
    data are marked — a person confirms them in the module itself; this
    runner only records that they were walked. Completions go to Pettagam. */
export function WorkflowPanel({ ctx }: { ctx: ModuleContext }) {
  const { t, meta, workflows, Link, href, view } = ctx;
  const { active, done, choose, mark, restart } = useWorkflowProgress(meta.id, workflows);
  if (!active) return null;
  const next = active.steps.find((s) => !done.includes(s.id));
  const count = active.steps.filter((s) => done.includes(s.id)).length;

  return (
    <Panel
      eyebrow={t({ ta: "பணிவழி", en: "Workflow", te: "వర్క్‌ఫ్లో" })}
      title={t(active.title)}
      actions={<Pill tone={count === active.steps.length ? "ok" : "accent"}>{count}/{active.steps.length}</Pill>}
    >
      {workflows.length > 1 && (
        <label className="mb-3 block text-xs text-ivory-dim">
          <span className="sr-only">{t({ ta: "பணிவழியைத் தேர்க", en: "Choose a workflow", te: "వర్క్‌ఫ్లో ఎంచుకోండి" })}</span>
          <select
            value={active.id}
            onChange={(e) => choose(e.target.value)}
            className="min-h-10 w-full rounded-lg border border-ivory/15 bg-night px-2 text-sm text-ivory focus:border-gold/60 focus:outline-none"
          >
            {workflows.map((w) => (
              <option key={w.id} value={w.id}>
                {t(w.title)} · {t(w.who)}
                {w.length ? ` · ${w.length}` : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      <p className="mb-3 text-xs text-ivory-dim">{t(active.summary)}</p>
      <ol className="space-y-2">
        {active.steps.map((s, i) => {
          const isDone = done.includes(s.id);
          const isNext = next?.id === s.id;
          const here = s.view === view.id;
          return (
            <li
              key={`${s.id}-${i}`}
              aria-current={isNext ? "step" : undefined}
              className={`rounded-lg border px-3 py-2 text-sm ${isNext ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/5" : "border-ivory/10"}`}
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => {
                    mark(active.id, s.id, !isDone);
                    if (!isDone) appendAudit(meta.id, `Workflow step done: ${pick(s.title)} (${pick(active.title)})`);
                  }}
                  aria-pressed={isDone}
                  aria-label={isDone ? `Mark "${t(s.title)}" not done` : `Mark "${t(s.title)}" done`}
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[10px] ${
                    isDone ? "bg-mullai text-night" : isNext ? "bg-[color:var(--accent)] text-night" : "border border-ivory/25 text-ivory-dim"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={isDone ? "text-ivory-dim line-through" : "text-ivory"}>{t(s.title)}</p>
                  {isNext && <p className="mt-0.5 text-xs text-ivory-dim">{t(s.hint)}</p>}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {s.gate && <Pill tone="risk" title="Changes data — a person confirms in the module">needs a person</Pill>}
                    {!here && (
                      <Link href={href(s.view)} className="text-xs text-[color:var(--accent)] hover:underline">
                        {t({ ta: "இங்கே செல்", en: "Go there", te: "అక్కడికి వెళ్ళు" })} →{" "}
                        {t(meta.views.find((v) => v.id === s.view)?.label ?? s.view)}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {count > 0 && (
        <button type="button" onClick={() => restart(active.id)} className="mt-3 min-h-9 rounded-full border border-ivory/20 px-3 text-xs text-ivory-dim hover:text-ivory">
          {t({ ta: "மீண்டும் தொடங்கு", en: "Start again", te: "మళ్ళీ మొదలు" })}
        </button>
      )}
    </Panel>
  );
}

/* audit entries are written in English so every reviewer can read them */
const pick = (b: { en: string }) => b.en;
