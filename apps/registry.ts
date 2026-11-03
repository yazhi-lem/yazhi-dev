"use client";
import type { WorkspaceManifest } from "@yazhi/workspace";
import { GURU } from "./guru";
import { NYAYA } from "./nyaya";
import { KURAL } from "./kural";
import { KADAI } from "./kadai";

/** Client-side: every workspace with its module registry. */
export const MANIFESTS: Record<string, WorkspaceManifest> = { guru: GURU, nyaya: NYAYA, kural: KURAL, kadai: KADAI };
