"use client";
import { useCallback, useSyncExternalStore } from "react";

/* Two tiny stores, both safe to render on the server:

   useStored — kept in localStorage (per viewer, per browser): layouts,
     language, workflow progress, the demo audit log. Falls back to memory
     when storage is blocked (private windows), so nothing ever throws.
   useShared — kept in memory for the tab's life, shared by every module
     and every workspace on the page: the open page chip, the ticket
     queue, the orders Kadai takes and Kural answers from.

   During hydration both return the initial value; the stored value
   follows on the next render, so server and client markup agree. */

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const subscribe = (key: string, fn: Listener) => {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(fn);
  return () => set.delete(fn);
};
const notify = (key: string) => listeners.get(key)?.forEach((fn) => fn());

/* ---------------------------------------------------------- persisted */

const memory = new Map<string, string>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function getRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}
function setRaw(key: string, raw: string) {
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    memory.set(key, raw);
  }
}
function removeRaw(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    memory.delete(key);
  }
}

function read<T>(key: string, initial: T): T {
  const raw = getRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = initial;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

let storageWired = false;
function wireStorageEvents() {
  if (storageWired || typeof window === "undefined") return;
  storageWired = true;
  window.addEventListener("storage", (e) => {
    if (e.key && listeners.has(e.key)) notify(e.key);
  });
}

export function writeStored<T>(key: string, value: T | undefined) {
  if (value === undefined) removeRaw(key);
  else setRaw(key, JSON.stringify(value));
  notify(key);
}

export function readStored<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  return read(key, initial);
}

export function useStored<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  wireStorageEvents();
  const value = useSyncExternalStore(
    (fn) => subscribe(key, fn),
    () => read(key, initial),
    () => initial,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, initial);
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeStored(key, v);
    },
    // initial is a default, not a dependency: callers pass literals
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  const reset = useCallback(() => writeStored(key, undefined), [key]);
  return [value, set, reset];
}

/* ---------------------------------------------------------- in memory */

const shared = new Map<string, unknown>();

export function getShared<T>(key: string, initial: T): T {
  if (!shared.has(key)) shared.set(key, initial);
  return shared.get(key) as T;
}

export function setShared<T>(key: string, next: T | ((prev: T) => T), initial?: T) {
  const prev = (shared.has(key) ? shared.get(key) : initial) as T;
  shared.set(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
  notify(`shared:${key}`);
}

export function useShared<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (fn) => subscribe(`shared:${key}`, fn),
    () => getShared(key, initial),
    () => initial,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => setShared(key, next, initial),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

/** A unique id for a turn, ticket or upload — call from event handlers. */
let seq = 0;
export const uid = (prefix = "") => `${prefix}${Date.now().toString(36)}${(seq += 1).toString(36)}`;
