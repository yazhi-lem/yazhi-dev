import { SHARED_MODULES, type WorkspaceManifest } from "@yazhi/workspace";
import { NYAYA_META } from "./meta";
import { NYAYA_MODULES } from "./modules";

export const NYAYA: WorkspaceManifest = { ...NYAYA_META, modules: { ...NYAYA_MODULES, ...SHARED_MODULES } };
export { NYAYA_META };
