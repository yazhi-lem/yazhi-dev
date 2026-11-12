import "server-only";

/** The bubble registry — the server-side store behind /api/bubbles.

    Two implementations share one interface:
      InMemoryRegistry   a process-global Map. The default; deterministic,
                         needs no backend, and is what the demo and the tests
                         run on. It lives on `globalThis` so a Next dev server
                         that re-evaluates the module keeps its data.
      GrpcRegistry       registry-grpc.ts, the real yazhi-api `YazhiBubbles`
                         service. Selected only when BOTH YAZHI_GRPC_TARGET
                         and YAZHI_REGISTRY_GRPC=1 are set. Not wired yet:
                         every call answers 503 "grpc registry not wired".

    Semantics follow yazhi-api/services/yazhi/proto/bubbles.proto exactly:
      - the first publisher of a name owns it; later versions must come from
        the same account and be strictly greater than every earlier version
      - a new version starts IN_REVIEW
      - visibility: published+public ∪ the caller's own (any status) ∪ a
        maintainer's view of in_review (the review queue)
      - a version the caller may not see is NOT_FOUND, never FORBIDDEN, so a
        probe cannot enumerate private or unreviewed bubbles
      - rejected and withdrawn are terminal; a withdrawn version number is
        never reusable

    Storage is out of scope (ROUTE-CONTRACTS §B): this file defines the seam. */

import type {
  BubbleStatus,
  BubbleVersion,
  ListBubblesQuery,
  ListBubblesResponse,
  PublishInput,
  ReviewInput,
  Visibility,
  WithdrawInput,
} from "./types";
import type { AnyBubbleManifest } from "@yazhi/bubble/lib/manifest";

/* ── Identity ────────────────────────────────────────────────────────── */

/** Who is calling. `accountId` is the only identity the store trusts;
    `maintainer` decides whether the review queue is visible. */
export interface RegistryActor {
  accountId: string;
  /** display name stored as manifest.author.name (from the Circle account) */
  name?: string;
  /** true when the account is in YAZHI_MAINTAINERS (see maintainers.ts) */
  maintainer?: boolean;
}

/* ── Errors ──────────────────────────────────────────────────────────── */

/** A registry refusal with the HTTP status and error code the route must
    answer. The route layer adds no opinion of its own — it forwards
    `status`, `code` and `message`.

    Written with explicit field assignments (no TS parameter properties) so
    Node's strip-only TypeScript can import this module directly in
    `node --test`. */
export class RegistryError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "RegistryError";
    this.status = status;
    this.code = code;
  }
}

export const registryErrors = {
  notFound: (what = "bubble") => new RegistryError(`No such ${what}.`, 404, "not_found"),
  badRequest: (message: string) => new RegistryError(message, 400, "bad_request"),
  conflict: (message: string) => new RegistryError(message, 409, "version_conflict"),
  notOwner: (message = "Only the first publisher of this bubble may publish new versions.") =>
    new RegistryError(message, 403, "not_owner"),
  forbidden: (message: string, code = "forbidden") => new RegistryError(message, 403, code),
  tooLarge: (message: string) => new RegistryError(message, 413, "too_large"),
};

/* ── Payloads ────────────────────────────────────────────────────────── */

export interface PublishArgs {
  actor: RegistryActor;
  input: PublishInput;
}

export interface PublishResult {
  version: BubbleVersion;
  /** "unsigned" when the registry has no signing secret */
  warnings: string[];
}

export interface GetArgs {
  actor: RegistryActor | null;
  name: string;
  /** empty/absent = the latest version the caller may see */
  version?: string;
}

export interface ListArgs {
  actor: RegistryActor | null;
  query: ListBubblesQuery;
}

export interface ReviewArgs {
  actor: RegistryActor;
  name: string;
  input: ReviewInput;
}

export interface WithdrawArgs {
  actor: RegistryActor;
  name: string;
  input: WithdrawInput;
}

/* ── The seam ────────────────────────────────────────────────────────── */

export interface Registry {
  /** which store answered — reported nowhere publicly, but logged once */
  readonly kind: "memory" | "grpc";
  publish(args: PublishArgs): Promise<PublishResult>;
  get(args: GetArgs): Promise<BubbleVersion>;
  list(args: ListArgs): Promise<ListBubblesResponse>;
  review(args: ReviewArgs): Promise<BubbleVersion>;
  withdraw(args: WithdrawArgs): Promise<{ withdrawn: BubbleVersion[] }>;
}

/* ── Visibility ──────────────────────────────────────────────────────── */

/** May `actor` see this version? Direct implementation of proto's rule:
    published+public, or the author's own (any status), or a maintainer
    (who sees the in_review queue as well as published private versions). */
export function canSee(version: Pick<BubbleVersion, "authorAccountId" | "status" | "visibility">, actor: RegistryActor | null): boolean {
  if (!actor) return version.status === "published" && version.visibility === "public";
  if (version.authorAccountId === actor.accountId) return true;
  if (actor.maintainer) return true;
  return version.status === "published" && version.visibility === "public";
}

/* ── Defaults, shared by every implementation ────────────────────────── */

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;
export const MAX_NOTE_CHARS = 2000;

export function clampPageSize(size: number | undefined): number {
  if (!size || !Number.isFinite(size) || size <= 0) return DEFAULT_PAGE_SIZE;
  return Math.min(Math.floor(size), MAX_PAGE_SIZE);
}

/* ── In-memory implementation ────────────────────────────────────────── */

/** Storage key: "<name>\u0000<version>". One Map of rows, plus a name index
    so listing never scans the whole store. */
type Rows = Map<string, BubbleVersion>;
type Names = Set<string>;

interface MemoryStore {
  rows: Rows;
  names: Names;
}

/** `globalThis` so Next's dev server (which re-evaluates modules on edit) and
    a production serverless instance keep one store per process. */
const GLOBAL_KEY = Symbol.for("yazhi.api.registry.memory");

function memoryStore(): MemoryStore {
  const holder = globalThis as unknown as Record<symbol, MemoryStore | undefined>;
  let store = holder[GLOBAL_KEY];
  if (!store) {
    store = { rows: new Map(), names: new Set() };
    holder[GLOBAL_KEY] = store;
  }
  return store;
}

/** Test hook: drop every published version. Exported for `node --test` and
    for a dev-only reset; never called by a route. */
export function __resetMemoryRegistry(): void {
  const store = memoryStore();
  store.rows.clear();
  store.names.clear();
}

const rowKey = (name: string, version: string) => `${name}\u0000${version}`;
const nowIso = () => new Date().toISOString();

export class InMemoryRegistry implements Registry {
  readonly kind = "memory" as const;

  async publish({ actor, input }: PublishArgs): Promise<PublishResult> {
    const store = memoryStore();
    // validation lives in handlers/publish.ts (it owns the warnings); by the
    // time we get here the manifest is a BubbleManifestV1 with a fresh version
    const manifest = input.manifest as AnyBubbleManifest;
    const name = (manifest as { id?: unknown }).id;
    const version = (manifest as { version?: unknown }).version;
    if (typeof name !== "string" || typeof version !== "string") {
      throw registryErrors.badRequest("manifest.id and manifest.version are required.");
    }
    const versions = this.versionsOf(store, name);
    if (versions.length) {
      const owner = store.rows.get(rowKey(name, versions[0]))!.authorAccountId;
      if (owner !== actor.accountId) throw registryErrors.notOwner();
      // strictly greater than every version already stored
      const highest = versions.reduce((a, b) => (compareSemver(a, b) >= 0 ? a : b));
      if (compareSemver(version, highest) <= 0) {
        throw registryErrors.conflict(
          `version ${version} must be greater than ${highest}, the highest version of "${name}" already stored.`
        );
      }
    }
    if (store.rows.has(rowKey(name, version))) {
      throw registryErrors.conflict(`version ${version} of "${name}" is already stored.`);
    }

    const { signature } = await importSigning(manifest);
    const stamp = nowIso();
    const row: BubbleVersion = {
      id: rowKey(name, version).replace("\u0000", "@"),
      name,
      version,
      authorAccountId: actor.accountId,
      visibility: (input.visibility ?? "public") as Visibility,
      status: "in_review",
      manifest: {
        ...manifest,
        author: { circleAccountId: actor.accountId, name: actor.name ?? "" },
      } as AnyBubbleManifest,
      ...(signature ? { signature } : {}),
      createdAt: stamp,
      updatedAt: stamp,
    };
    store.rows.set(rowKey(name, version), row);
    store.names.add(name);
    return { version: structuredClone(row), warnings: signature ? [] : ["unsigned"] };
  }

  async get({ actor, name, version }: GetArgs): Promise<BubbleVersion> {
    const store = memoryStore();
    if (version) {
      const row = store.rows.get(rowKey(name, version));
      if (!row || !canSee(row, actor)) throw registryErrors.notFound();
      return structuredClone(row);
    }
    // latest the caller may see
    const visible = this.versionsOf(store, name)
      .map((v) => store.rows.get(rowKey(name, v))!)
      .filter((row) => canSee(row, actor))
      .sort((a, b) => compareSemver(b.version, a.version));
    const latest = visible[0];
    if (!latest) throw registryErrors.notFound();
    return structuredClone(latest);
  }

  async list({ actor, query }: ListArgs): Promise<ListBubblesResponse> {
    const store = memoryStore();
    const pageSize = clampPageSize(query.pageSize);

    // latest visible version of each bubble, then filter, then order by name
    const latest = new Map<string, BubbleVersion>();
    for (const name of store.names) {
      const rows = this.versionsOf(store, name)
        .map((v) => store.rows.get(rowKey(name, v))!)
        .filter((row) => canSee(row, actor));
      if (!rows.length) continue;
      rows.sort((a, b) => compareSemver(b.version, a.version));
      latest.set(name, rows[0]);
    }

    let rows = [...latest.values()];
    if (query.mine) {
      if (!actor) return { bubbles: [] };
      rows = rows.filter((row) => row.authorAccountId === actor.accountId);
    }
    if (query.status) rows = rows.filter((row) => row.status === query.status);
    if (query.domain) {
      const domain = query.domain.toLowerCase();
      rows = rows.filter((row) => manifestDomain(row.manifest) === domain);
    }
    if (query.lang) {
      const lang = query.lang;
      rows = rows.filter((row) => manifestLanguages(row.manifest).some((tag) => languageMatchesLoose(tag, lang)));
    }
    if (query.q) {
      const q = query.q.toLowerCase();
      rows = rows.filter((row) => {
        const text = `${row.name} ${row.manifest.name} ${row.manifest.description} ${manifestDomain(row.manifest)}`.toLowerCase();
        const taName = (row.manifest as { taName?: string }).taName;
        return text.includes(q) || (typeof taName === "string" && taName.toLowerCase().includes(q));
      });
    }

    rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    let offset = 0;
    if (query.pageToken) offset = decodePageToken(query.pageToken);
    const page = rows.slice(offset, offset + pageSize).map((row) => structuredClone(row));
    const next = offset + pageSize < rows.length ? encodePageToken(offset + pageSize) : undefined;
    return next ? { bubbles: page, nextPageToken: next } : { bubbles: page };
  }

  async review({ actor, name, input }: ReviewArgs): Promise<BubbleVersion> {
    const store = memoryStore();
    const row = store.rows.get(rowKey(name, input.version));
    // an invisible version is not found even for the author here: you can only
    // review what you can see, and only maintainers see the queue
    if (!row) throw registryErrors.notFound();
    if (row.authorAccountId === actor.accountId) {
      throw registryErrors.forbidden("Nobody reviews their own bubble.", "self_review");
    }
    if (!actor.maintainer) {
      throw registryErrors.forbidden("Only a community maintainer may review bubbles.", "not_maintainer");
    }
    if (row.status !== "in_review") {
      throw registryErrors.conflict(`version ${input.version} is ${row.status}; only in_review versions can be reviewed.`);
    }
    const note = input.note?.trim();
    if (input.decision === "reject" && !note) {
      throw registryErrors.badRequest("A rejection needs a note so the author learns why.");
    }
    if (note && note.length > MAX_NOTE_CHARS) {
      throw registryErrors.badRequest(`note must be at most ${MAX_NOTE_CHARS} characters.`);
    }
    const updated: BubbleVersion = {
      ...row,
      status: input.decision === "approve" ? "published" : "rejected",
      reviewedByAccountId: actor.accountId,
      reviewDecision: input.decision,
      ...(note ? { reviewNote: note } : {}),
      updatedAt: nowIso(),
    };
    store.rows.set(rowKey(name, input.version), updated);
    return structuredClone(updated);
  }

  async withdraw({ actor, name, input }: WithdrawArgs): Promise<{ withdrawn: BubbleVersion[] }> {
    const store = memoryStore();
    const versions = input.version ? [input.version] : this.versionsOf(store, name);
    if (!versions.length) throw registryErrors.notFound();
    const reason = input.reason?.trim();
    if (reason && reason.length > MAX_NOTE_CHARS) {
      throw registryErrors.badRequest(`reason must be at most ${MAX_NOTE_CHARS} characters.`);
    }
    const withdrawn: BubbleVersion[] = [];
    for (const version of versions) {
      const row = store.rows.get(rowKey(name, version));
      // invisible versions stay invisible: withdraw the rest, never leak this one
      if (!row || !canSee(row, actor)) continue;
      const isAuthor = row.authorAccountId === actor.accountId;
      if (!isAuthor && !actor.maintainer) {
        throw registryErrors.forbidden("Only the author or a maintainer may withdraw a bubble.");
      }
      if (row.status === "withdrawn") continue; // terminal; already done
      // a published version disappears without a trace for everyone who could
      // not see it anyway — withdrawing it is allowed, but reviewed versions
      // keep their review record (proto: WITHDRAWN is terminal)
      const updated: BubbleVersion = {
        ...row,
        status: "withdrawn",
        ...(reason ? { reviewNote: row.reviewNote ?? reason } : {}),
        updatedAt: nowIso(),
      };
      store.rows.set(rowKey(name, version), updated);
      withdrawn.push(structuredClone(updated));
    }
    return { withdrawn };
  }

  /** Every stored version number for a name, unordered. */
  private versionsOf(store: MemoryStore, name: string): string[] {
    const prefix = `${name}\u0000`;
    const out: string[] = [];
    for (const key of store.rows.keys()) {
      if (key.startsWith(prefix)) out.push(key.slice(prefix.length));
    }
    return out;
  }
}

/* ── helpers the in-memory store shares with the handlers ────────────── */

export function compareSemver(a: string, b: string): number {
  const parse = (v: string) => v.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const [a1, a2, a3] = parse(a);
  const [b1, b2, b3] = parse(b);
  return (a1 ?? 0) - (b1 ?? 0) || (a2 ?? 0) - (b2 ?? 0) || (a3 ?? 0) - (b3 ?? 0);
}

function manifestDomain(manifest: AnyBubbleManifest): string {
  const domain = (manifest as { domain?: unknown }).domain;
  return typeof domain === "string" ? domain.toLowerCase() : "";
}

function manifestLanguages(manifest: AnyBubbleManifest): string[] {
  const languages = (manifest as { languages?: unknown }).languages;
  return Array.isArray(languages) ? languages.filter((t): t is string => typeof t === "string") : [];
}

/** Same rule as languageMatches in @yazhi/bubble/lib/manifest, kept local so
    the store has no dependency the client bundle would inherit. */
function languageMatchesLoose(tag: string, query: string): boolean {
  const a = tag.toLowerCase();
  const b = query.toLowerCase();
  return a === b || a.startsWith(`${b}-`) || b.startsWith(`${a}-`);
}

/** Page tokens are an opaque cursor over a stable ordering. It carries the
    offset only — the filter set is the client's job to keep identical between
    pages, as the contract requires. */
export function encodePageToken(offset: number): string {
  return Buffer.from(`o:${offset}`, "utf8").toString("base64url");
}

export function decodePageToken(token: string): number {
  let text = "";
  try {
    text = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    throw registryErrors.badRequest("pageToken is not valid.");
  }
  const m = /^o:(\d{1,9})$/.exec(text);
  if (!m) throw registryErrors.badRequest("pageToken is not valid.");
  return Number(m[1]);
}

/* ── Signing, kept lazy so this module stays importable without node:crypto
         being loaded until a publish happens ─────────────────────────── */

async function importSigning(manifest: AnyBubbleManifest): Promise<{ signature?: string }> {
  const { signManifest } = await import("./signing");
  const result = signManifest(manifest);
  return result.signature ? { signature: result.signature } : {};
}

/* ── Selection ───────────────────────────────────────────────────────── */

let chosen: Registry | null = null;

/** The registry the API uses. In-memory by default; the gRPC-backed
    yazhi-api `YazhiBubbles` service only when YAZHI_GRPC_TARGET and
    YAZHI_REGISTRY_GRPC=1 are both set (registry-grpc.ts, not wired yet). */
export async function getRegistry(): Promise<Registry> {
  if (chosen) return chosen;
  const grpcTarget = process.env.YAZHI_GRPC_TARGET;
  const grpcEnabled = process.env.YAZHI_REGISTRY_GRPC === "1";
  if (grpcTarget && grpcEnabled) {
    const { grpcRegistry } = await import("./registry-grpc");
    chosen = grpcRegistry();
    console.warn("[api] bubble registry: grpc selected via YAZHI_GRPC_TARGET (not wired yet — calls answer 503).");
  } else {
    chosen = new InMemoryRegistry();
    if (grpcTarget && !grpcEnabled) {
      console.warn("[api] bubble registry: YAZHI_GRPC_TARGET set but YAZHI_REGISTRY_GRPC!=1 — using the in-memory store.");
    }
  }
  return chosen;
}

/** The in-memory store, for `node --test` and any server code that needs a
    deterministic store regardless of env. Production code uses
    getRegistry(). */
export function memoryRegistry(): InMemoryRegistry {
  return new InMemoryRegistry();
}

/** Test hook: forget the selection (the next getRegistry() re-reads env). */
export function __resetRegistrySelection(): void {
  chosen = null;
}
