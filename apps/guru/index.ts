import { SHARED_MODULES, type WorkspaceManifest } from "@yazhi/workspace";
import { GURU_META } from "./meta";
import { GURU_MODULES } from "./modules";
import { GURU_DEMO_MODULES } from "./demo";

export const GURU: WorkspaceManifest = { ...GURU_META, modules: { ...GURU_MODULES, ...GURU_DEMO_MODULES, ...SHARED_MODULES } };
export { GURU_META };
