"use client";
import { useCallback, useMemo } from "react";
import type { ThinaiKey } from "@yazhi/bubble";
import { useStored } from "./store";
import type { Column, Layout, WorkflowDef, WorkspaceManifest } from "./types";

/** What a person has changed about a workspace. Stored per viewer; the
    manifest stays the default, so "Reset" always gets back to it. */
export interface WorkspacePrefs {
  /** per view: the modules shown, in order, per column */
  layouts: Record<string, Layout>;
  /** a landscape other than the workspace's own */
  tinai?: ThinaiKey;
  /** per shipped workflow: step ids switched off, and a custom order */
  steps: Record<string, { off: string[]; order?: string[] }>;
  /** workflows the person put together from the step library */
  custom: WorkflowDef[];
}

const EMPTY: WorkspacePrefs = { layouts: {}, steps: {}, custom: [] };
export const prefsKey = (ws: string) => `yazhi-ws:${ws}:prefs`;

/** A saved layout, reconciled with the manifest: modules that no longer
    exist are dropped; modules the manifest added since stay hidden until
    switched on. */
function reconcile(saved: Layout | undefined, fallback: Layout, known: Record<string, unknown>): Layout {
  if (!saved) return fallback;
  const keep = (ids: string[]) => ids.filter((id) => id in known);
  return { main: keep(saved.main), aside: keep(saved.aside) };
}

export function useWorkspacePrefs(m: WorkspaceManifest) {
  const [prefs, setPrefs, resetAll] = useStored<WorkspacePrefs>(prefsKey(m.id), EMPTY);

  const layoutFor = useCallback(
    (viewId: string): Layout => {
      const view = m.views.find((v) => v.id === viewId) ?? m.views[0];
      return reconcile(prefs.layouts?.[view.id], view.layout, m.modules);
    },
    [m, prefs.layouts],
  );

  const setLayout = useCallback(
    (viewId: string, next: (l: Layout) => Layout) =>
      setPrefs((p) => {
        const view = m.views.find((v) => v.id === viewId) ?? m.views[0];
        const cur = reconcile(p.layouts?.[view.id], view.layout, m.modules);
        return { ...EMPTY, ...p, layouts: { ...p.layouts, [view.id]: next(cur) } };
      }),
    [m, setPrefs],
  );

  const layoutActions = useMemo(
    () => ({
      show: (viewId: string, id: string, col: Column) =>
        setLayout(viewId, (l) => ({ ...l, [col]: l[col].includes(id) ? l[col] : [...l[col], id] })),
      hide: (viewId: string, id: string) => setLayout(viewId, (l) => ({ main: l.main.filter((x) => x !== id), aside: l.aside.filter((x) => x !== id) })),
      move: (viewId: string, id: string, by: -1 | 1) =>
        setLayout(viewId, (l) => {
          const col: Column = l.main.includes(id) ? "main" : "aside";
          const list = [...l[col]];
          const i = list.indexOf(id);
          const j = i + by;
          if (i < 0 || j < 0 || j >= list.length) return l;
          [list[i], list[j]] = [list[j], list[i]];
          return { ...l, [col]: list };
        }),
      swapColumn: (viewId: string, id: string) =>
        setLayout(viewId, (l) =>
          l.main.includes(id) ? { main: l.main.filter((x) => x !== id), aside: [...l.aside, id] } : { aside: l.aside.filter((x) => x !== id), main: [...l.main, id] },
        ),
      resetView: (viewId: string) =>
        setPrefs((p) => {
          const layouts = { ...p.layouts };
          delete layouts[viewId];
          return { ...EMPTY, ...p, layouts };
        }),
    }),
    [setLayout, setPrefs],
  );

  const setTinai = useCallback((tinai: ThinaiKey | undefined) => setPrefs((p) => ({ ...EMPTY, ...p, tinai })), [setPrefs]);

  /* ----------------------------------------------------- workflows */

  const workflows = useMemo<WorkflowDef[]>(() => {
    const shipped = m.workflows.map((w) => {
      const s = prefs.steps?.[w.id];
      if (!s) return w;
      const byId = new Map(w.steps.map((x) => [x.id, x]));
      const order = s.order?.filter((id) => byId.has(id)) ?? [];
      const ordered = [...order.map((id) => byId.get(id)!), ...w.steps.filter((x) => !order.includes(x.id))];
      return { ...w, steps: ordered.filter((x) => !s.off.includes(x.id)) };
    });
    return [...shipped, ...(prefs.custom ?? [])];
  }, [m.workflows, prefs.steps, prefs.custom]);

  /** every step any shipped workflow has — the palette for new workflows */
  const stepLibrary = useMemo(() => {
    const seen = new Map<string, WorkflowDef["steps"][number]>();
    for (const w of m.workflows) for (const s of w.steps) if (!seen.has(s.id)) seen.set(s.id, s);
    return [...seen.values()];
  }, [m.workflows]);

  const workflowActions = useMemo(
    () => ({
      toggleStep: (wf: string, step: string) =>
        setPrefs((p) => {
          const cur = p.steps?.[wf] ?? { off: [] };
          const off = cur.off.includes(step) ? cur.off.filter((x) => x !== step) : [...cur.off, step];
          return { ...EMPTY, ...p, steps: { ...p.steps, [wf]: { ...cur, off } } };
        }),
      moveStep: (wf: string, step: string, by: -1 | 1) =>
        setPrefs((p) => {
          const def = m.workflows.find((w) => w.id === wf);
          if (!def) return p;
          const cur = p.steps?.[wf] ?? { off: [] };
          const ids = def.steps.map((s) => s.id);
          const order = [...(cur.order?.filter((id) => ids.includes(id)) ?? []), ...ids.filter((id) => !cur.order?.includes(id))];
          const i = order.indexOf(step);
          const j = i + by;
          if (i < 0 || j < 0 || j >= order.length) return p;
          [order[i], order[j]] = [order[j], order[i]];
          return { ...EMPTY, ...p, steps: { ...p.steps, [wf]: { ...cur, order } } };
        }),
      addCustom: (title: string, stepIds: string[]) =>
        setPrefs((p) => {
          const steps = stepIds.map((id) => stepLibrary.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
          if (!title.trim() || !steps.length) return p;
          const wf: WorkflowDef = {
            id: `custom-${Date.now().toString(36)}`,
            title: { ta: title, en: title, te: title },
            who: { ta: "நீங்கள்", en: "You", te: "మీరు" },
            summary: { ta: "நீங்கள் அமைத்த பணிவழி", en: "A workflow you put together", te: "మీరు రూపొందించిన వర్క్‌ఫ్లో" },
            steps,
            custom: true,
          };
          return { ...EMPTY, ...p, custom: [...(p.custom ?? []), wf] };
        }),
      removeCustom: (id: string) => setPrefs((p) => ({ ...EMPTY, ...p, custom: (p.custom ?? []).filter((w) => w.id !== id) })),
    }),
    [m.workflows, setPrefs, stepLibrary],
  );

  return { prefs, layoutFor, layoutActions, setTinai, workflows, stepLibrary, workflowActions, resetAll };
}
