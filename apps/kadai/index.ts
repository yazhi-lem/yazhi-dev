import { SHARED_MODULES, type WorkspaceManifest } from "@yazhi/workspace";
import { KURAL_MODULES } from "../kural";
import { KADAI_META } from "./meta";
import { KADAI_MODULES } from "./modules";

/** Kadai mounts Kural's modules as they are — the same customer desk,
    queue, returns and knowledge base — next to its own counter and orders.
    That is the whole of "Kural lives inside Kadai". */
export const KADAI: WorkspaceManifest = { ...KADAI_META, modules: { ...KADAI_MODULES, ...KURAL_MODULES, ...SHARED_MODULES } };
export { KADAI_META };
