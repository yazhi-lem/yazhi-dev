# @yazhi/workspace — the shared workspace shell

The PRD's "Shared foundation", built once: the bilingual shell every product
workspace sits on. Built on [`@yazhi/bubble`](../bubble/README.md); the
workspaces themselves live in [`/apps`](../../apps/README.md).

## Pieces

| File | What |
|---|---|
| `types.ts` | `Bi` strings (ta / en / te), `WorkspaceMeta`, `ViewMeta`, `Layout`, `ModuleDef`, `WorkflowDef`, `ModuleContext` |
| `Shell.tsx` | `WorkspaceShell` — header (bubble, views as tabs, த \| EN, light/dark, Customize, Mission Control slot), main pane laid out from the layout, one footer line |
| `Customize.tsx` | The drawer: modules per view (show / hide / ↑ ↓ / ⇄ column), landscape, workflow steps, new workflows |
| `prefs.ts` | `useWorkspacePrefs` — the person's layout, landscape and workflow changes, reconciled with the manifest |
| `workflow.tsx` | `WorkflowPanel` and `useWorkflowProgress` |
| `pettagam.tsx` | Pettagam, the audit log: `appendAudit`, `useAudit`, `AuditPanel`; hash-chained entries, IST, JSON export |
| `modules.tsx` | `SHARED_MODULES`: `workflow`, `audit`, `about` |
| `Launcher.tsx` | `WorkspaceLauncher` — `/workspaces` |
| `lang.tsx` | `useWsLang`, `LangToggle`, `pick` — one language choice for every workspace |
| `store.ts` | `useStored` (per viewer, localStorage, memory fallback) and `useShared` (in memory, across modules and workspaces); both hydration-safe |

## A new workspace

```ts
// apps/avai/meta.ts — plain data
export const AVAI_META: WorkspaceMeta = {
  id: "avai", name: "Avai", taName: "அவை", base: "/avai", tinai: "kurinji",
  runtime: "yazhi-api", languages: ["ta", "en"], /* … */
  views: [{ id: "ask", label: {…}, purpose: {…}, layout: { main: ["avai.ask"], aside: ["workflow"] } }],
  workflows: [/* … */],
};
// apps/avai/index.ts
export const AVAI = { ...AVAI_META, modules: { ...AVAI_MODULES, ...SHARED_MODULES } };
```

Add it to `apps/meta.ts` and `apps/registry.ts`, and give it two route files
under `src/app/(workspaces)/avai/` (copy Guru's). Each module is a component
taking `{ ctx }`: `ctx.t` picks the language, `ctx.log` writes to Pettagam,
`ctx.href` / `ctx.Link` move between views.

## What is stored where

Layouts, the landscape, workflow progress, the language and the demo audit
log are kept **in the viewer's browser** — conveniences, not records. In
production Pettagam is written by yazhi-api, per tenant, in India; the panel
only reads it.
