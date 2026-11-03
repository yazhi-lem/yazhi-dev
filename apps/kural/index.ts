import { SHARED_MODULES, type WorkspaceManifest } from "@yazhi/workspace";
import { KURAL_META } from "./meta";
import { KURAL_MODULES } from "./modules";

export const KURAL: WorkspaceManifest = { ...KURAL_META, modules: { ...KURAL_MODULES, ...SHARED_MODULES } };
export { KURAL_META, KURAL_MODULES };
