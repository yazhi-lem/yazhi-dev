/** Bubble version strings (semver, MAJOR.MINOR.PATCH) and the small amount
    of metadata the registry needs before a version is stored.

    Plain data and pure functions only — no Node built-ins, no React — so the
    same file runs in the browser, in a Route Handler and in `node --test`.
    The registry (src/lib/api/registry.ts, server-only) is the only consumer
    that matters, but a builder can import these to pick the next version. */

/** A published version number. Build metadata (`+…`) is not allowed: two
    versions of one bubble must be totally ordered. Prereleases are not
    supported yet either, so `1.0.0-rc.1` is rejected rather than sorted in
    some way nobody expected. */
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

/** Parse "MAJOR.MINOR.PATCH" → numbers, or null when it is not one. */
export function parseVersion(version: unknown): ParsedVersion | null {
  if (typeof version !== "string") return null;
  const m = SEMVER.exec(version.trim());
  if (!m) return null;
  const [major, minor, patch] = [Number(m[1]), Number(m[2]), Number(m[3])];
  // the regex allows 0 but not a leading 0, so these are exact
  return Number.isSafeInteger(major) && Number.isSafeInteger(minor) && Number.isSafeInteger(patch)
    ? { major, minor, patch }
    : null;
}

export function isVersion(version: unknown): boolean {
  return parseVersion(version) !== null;
}

/** Compare two versions: <0 when a sorts before b, 0 when equal, >0 when
    a sorts after b. A malformed version sorts before every valid one and
    compares equal to itself (so `sort` stays total and never throws). */
export function compareVersion(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) {
    if (pa) return 1;
    if (pb) return -1;
    return a === b ? 0 : a < b ? -1 : 1;
  }
  return pa.major - pb.major || pa.minor - pb.minor || pa.patch - pb.patch;
}

export type BumpKind = "major" | "minor" | "patch";

/** The next version after `version`.
    - patch: 1.2.3 → 1.2.4
    - minor: 1.2.3 → 1.3.0
    - major: 1.2.3 → 2.0.0
    An unparseable version yields the first version, "0.1.0". */
export function bumpVersion(version: string, kind: BumpKind = "patch"): string {
  const p = parseVersion(version);
  if (!p) return "0.1.0";
  switch (kind) {
    case "major":
      return `${p.major + 1}.0.0`;
    case "minor":
      return `${p.major}.${p.minor + 1}.0`;
    default:
      return `${p.major}.${p.minor}.${p.patch + 1}`;
  }
}

/** The highest version in a list (malformed entries are ignored). */
export function latestVersion(versions: string[]): string | null {
  let best: string | null = null;
  for (const v of versions) {
    if (!parseVersion(v)) continue;
    if (best === null || compareVersion(v, best) > 0) best = v;
  }
  return best;
}

/** Which part changed, as a builder would describe it:
    "1.0.0" vs "1.0.1" → "patch". Returns null on equal or invalid input. */
export function versionDelta(from: string, to: string): BumpKind | null {
  const a = parseVersion(from);
  const b = parseVersion(to);
  if (!a || !b) return null;
  if (!compareVersion(from, to)) return null;
  if (a.major !== b.major) return "major";
  if (a.minor !== b.minor) return "minor";
  return "patch";
}

/** A bubble name: the manifest `id`, unique registry-wide. Lowercase
    letters, digits, dots and dashes — the same rule validateManifest
    applies, exported so the registry and the docs agree. */
const NAME = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

export function isValidBubbleName(name: unknown): name is string {
  return typeof name === "string" && name.length > 0 && name.length <= 120 && NAME.test(name);
}

/** A bubble's manifest must be JSON a store can hold as one document
    (the yazhi-api registry caps it at 64 KiB). */
export const MAX_MANIFEST_BYTES = 64 * 1024;

export function manifestSizeBytes(manifest: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(manifest) ?? "").length;
  } catch {
    // circular or a BigInt — cannot be stored either way
    return Number.POSITIVE_INFINITY;
  }
}

/** A short, human label for a version in lists: "tamil-tutor@1.2.0". */
export function versionLabel(name: string, version: string): string {
  return `${name}@${version}`;
}
