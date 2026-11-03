import { SHARED_MODULES, type WorkspaceManifest } from "@yazhi/workspace";
import { GURU_META } from "./meta";
import { GURU_MODULES } from "./modules";

export const GURU: WorkspaceManifest = { ...GURU_META, modules: { ...GURU_MODULES, ...SHARED_MODULES } };
export { GURU_META };
