/** Server-only fixed-window rate limit per session id (in-process). For a
    multi-instance deploy, move to a shared store. */
const WINDOW_MS = 60_000;
export const MAX_PER_WINDOW = Number(process.env.WORKSPACE_RATE_LIMIT_PER_MIN ?? 30);
const hits = new Map<string, { start: number; n: number }>();

export function allow(key: string, now = Date.now()): boolean {
  const h = hits.get(key);
  if (!h || now - h.start >= WINDOW_MS) {
    hits.set(key, { start: now, n: 1 });
    if (hits.size > 10_000) for (const [k, v] of hits) if (now - v.start >= WINDOW_MS) hits.delete(k);
    return true;
  }
  h.n += 1;
  return h.n <= MAX_PER_WINDOW;
}
