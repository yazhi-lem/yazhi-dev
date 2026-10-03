"use client";
import { useCallback, useEffect, useState } from "react";
import type { CircleAccount } from "@/lib/circle/types";
import { BUBBLE_SCHEMA, type BubbleManifest } from "./types";

/** Foundry drafts. They live in this browser only (localStorage) until a
    shared registry exists — see docs/PROPOSAL-YAZHI-DEV-V3.md. */

const STORAGE_KEY = "yazhi-foundry-drafts";

const rand = () => Math.random().toString(36).slice(2, 8);

export function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || rand()
  );
}

export function blankBubble(): BubbleManifest {
  const now = new Date().toISOString();
  return {
    schema: BUBBLE_SCHEMA,
    id: `draft.${rand()}`,
    version: "0.1.0",
    name: "New bubble",
    taName: "",
    description: "What this bubble does, in one sentence.",
    accent: "#4f9d6b",
    size: "m",
    agent: {
      systemPrompt:
        "You are a helpful assistant for Tamil speakers. Reply in the language the user writes in. Be concise and accurate.",
      greeting: "வணக்கம்! How can I help?",
      fivePosture: true,
    },
    runtime: { prefer: "device", model: "adhan", deviceModel: "adhan-kutty" },
    permissions: ["clipboard"],
    createdAt: now,
    updatedAt: now,
  };
}

/** Copy a bubble into a new draft the current builder owns. */
export function forkBubble(source: BubbleManifest): BubbleManifest {
  const now = new Date().toISOString();
  return {
    ...structuredClone(source),
    id: `draft.${rand()}`,
    name: `${source.name} (fork)`.slice(0, 60),
    author: undefined,
    createdAt: now,
    updatedAt: now,
  };
}

/** Sign a draft with the builder's Circle account: set the author and, for
    unsigned ids, give it a stable circle.<account>.<name> id. */
export function signBubble(m: BubbleManifest, account: CircleAccount): BubbleManifest {
  const prefix = `circle.${account.accountId.replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase()}`;
  return {
    ...m,
    id: m.id.startsWith("draft.") ? `${prefix}.${slug(m.name)}` : m.id,
    author: { circleAccountId: account.accountId, name: account.fullName || account.email },
  };
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<BubbleManifest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as BubbleManifest[]) : [];
        setDrafts(Array.isArray(parsed) && parsed.length ? parsed : [blankBubble()]);
      } catch {
        setDrafts([blankBubble()]);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      // storage full / private mode — drafts last for this tab only
    }
  }, [drafts, loaded]);

  const upsert = useCallback((m: BubbleManifest, replaceId = m.id) => {
    const next = { ...m, updatedAt: new Date().toISOString() };
    setDrafts((prev) => {
      const i = prev.findIndex((d) => d.id === replaceId);
      if (i === -1) return [next, ...prev];
      const copy = prev.slice();
      copy[i] = next;
      return copy;
    });
    return next;
  }, []);

  const remove = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next.length ? next : [blankBubble()];
    });
  }, []);

  return { drafts, loaded, upsert, remove };
}
