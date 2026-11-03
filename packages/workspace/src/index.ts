/** @yazhi/workspace — the shared shell the product workspaces sit on.

    A workspace is plain data (WorkspaceMeta: views, default layouts,
    workflows) plus a registry of modules (ModuleDef). The shell lays a
    view out from the person's saved layout, else the manifest's; the
    Customize drawer changes layouts, the landscape and workflows; every
    approval, edit and upload goes to Pettagam, the audit log.

    The workspaces themselves live in /apps (guru, nyaya, kural, kadai).
    See README.md. */

export type { Bi, Column, Layout, LinkLike, ModuleContext, ModuleDef, ViewMeta, WorkflowDef, WorkflowStep, WorkspaceManifest, WorkspaceMeta, WsLang } from "./types";
export { WorkspaceShell } from "./Shell";
export { WorkspaceLauncher } from "./Launcher";
export { CustomizeDrawer } from "./Customize";
export { SHARED_MODULES } from "./modules";
export { WorkflowPanel, useWorkflowProgress } from "./workflow";
export { AuditPanel, appendAudit, useAudit, verifyChain, IST, type AuditEntry } from "./pettagam";
export { useWorkspacePrefs, type WorkspacePrefs } from "./prefs";
export { useWsLang, LangToggle, pick, LANG_KEY, LANG_NAMES } from "./lang";
export { useStored, useShared, getShared, setShared, readStored, writeStored, uid } from "./store";
