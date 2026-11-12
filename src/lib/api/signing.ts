import "server-only";

/** Manifest signing for the bubble registry — HMAC-SHA256 over the canonical
    JSON of a manifest, with YAZHI_REGISTRY_SECRET.

    What the signature buys: a consumer (another host, a mirror, yazhi-api)
    can tell that a manifest was stored by a registry holding the same secret
    and has not been edited since. What it does NOT buy: authorship. The
    author is `authorAccountId`, stamped from the Circle session; the
    signature is the registry's, not the builder's.

    Canonical JSON = object keys sorted by code unit at every level, no
    whitespace, arrays in order, numbers in JSON form. Two processes that
    agree on the manifest therefore agree on the bytes, whatever key order
    they received.

    No secret → no signature. Every entry point returns `signed:false` and
    the caller adds the "unsigned" warning; nothing throws. That keeps a
    laptop demo running with an empty .env, which is not an accident. */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { AnyBubbleManifest } from "@yazhi/bubble/lib/manifest";

/** Prefix that marks our signatures and leaves room for an algorithm
    change later ("v1:" now, "v2:" if the key handling changes). */
const SIGNATURE_PREFIX = "v1:";

export interface SignatureResult {
  /** base64url HMAC, prefixed "v1:"; absent when the registry is unsigned */
  signature?: string;
  /** true when YAZHI_REGISTRY_SECRET is set and the signature was computed */
  signed: boolean;
  /** "unsigned" when there is no secret — pass straight to the response */
  warnings: string[];
}

export function registrySecret(): string | null {
  const secret = process.env.YAZHI_REGISTRY_SECRET;
  return secret && secret.trim() ? secret : null;
}

/** JSON with keys sorted at every depth and no insignificant whitespace.
    Returns null for values that cannot be serialised (circular, BigInt) —
    a manifest that hits this is rejected before it is ever signed. */
export function canonicalJson(value: unknown): string | null {
  try {
    return canonicalise(value);
  } catch {
    return null;
  }
}

function canonicalise(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("non-finite number");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalise(item === undefined ? null : item)).join(",")}]`;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record)
      .filter((k) => record[k] !== undefined)
      .sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalise(record[k])}`).join(",")}}`;
  }
  throw new TypeError(`cannot serialise ${typeof value}`);
}

/** The bytes that get signed for a stored version. The signature covers the
    manifest only; the version row (status, reviewer, timestamps) changes as
    the bubble moves through review without invalidating the manifest. */
function signingPayload(manifest: AnyBubbleManifest): string | null {
  return canonicalJson(manifest);
}

/** Sign a manifest's canonical JSON. No secret → `{signed:false, warnings:
    ["unsigned"]}` and no signature; never throws. */
export function signManifest(manifest: AnyBubbleManifest, secret: string | null = registrySecret()): SignatureResult {
  if (!secret) return { signed: false, warnings: ["unsigned"] };
  const payload = signingPayload(manifest);
  if (payload === null) return { signed: false, warnings: ["unsigned", "manifest_not_serialisable"] };
  const mac = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  return { signature: `${SIGNATURE_PREFIX}${mac}`, signed: true, warnings: [] };
}

export type VerifyResult =
  | { valid: true; reason: "verified" }
  | { valid: false; reason: "unsigned" | "missing_signature" | "bad_format" | "mismatch" };

/** Verify a stored signature against a manifest. Never throws.
    - registry has no secret → `unsigned` (we cannot check, and the version
      is presumably one of those stored without a signature)
    - manifest carries no signature while the registry has a secret →
      `missing_signature`
    - otherwise a constant-time comparison of the MACs */
export function verifyManifest(
  manifest: AnyBubbleManifest,
  signature: string | undefined,
  secret: string | null = registrySecret()
): VerifyResult {
  if (!secret) return { valid: false, reason: "unsigned" };
  if (typeof signature !== "string" || !signature) return { valid: false, reason: "missing_signature" };
  if (!signature.startsWith(SIGNATURE_PREFIX)) return { valid: false, reason: "bad_format" };
  const payload = signingPayload(manifest);
  if (payload === null) return { valid: false, reason: "bad_format" };
  const expected = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  const given = signature.slice(SIGNATURE_PREFIX.length);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  if (a.length !== b.length) return { valid: false, reason: "mismatch" };
  return timingSafeEqual(a, b) ? { valid: true, reason: "verified" } : { valid: false, reason: "mismatch" };
}
