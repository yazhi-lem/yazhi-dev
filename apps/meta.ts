import type { WorkspaceMeta } from "@yazhi/workspace/types";
import { GURU_META } from "./guru/meta";
import { NYAYA_META } from "./nyaya/meta";
import { KURAL_META } from "./kural/meta";
import { KADAI_META } from "./kadai/meta";

/** Every product workspace, as plain data — routes, metadata and the
    launcher read this. Order is the PRD's: Guru, Nyaya, Kural, then Kadai,
    the business interface Kural lives inside. */
export const WORKSPACES: WorkspaceMeta[] = [GURU_META, NYAYA_META, KURAL_META, KADAI_META];

export const WORKSPACE_BY_ID: Record<string, WorkspaceMeta> = Object.fromEntries(WORKSPACES.map((w) => [w.id, w]));
