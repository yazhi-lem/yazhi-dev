import { useSyncExternalStore } from "react";
import { MOCK_USERS } from "@/data/mockFeed";

export type YazhiUser = {
  id: string;
  name: string;
  handle: string;
  role: string;
  city: string;
  bio: string;
  avatar: string;
  reputation: number;
  github: string;
  phone?: string;
  techStack?: string;
  availability?: "open" | "employed" | "closed";
};

const USERS_KEY = "yazhi_users";
const CURRENT_USER_KEY = "yazhi_current_user_id";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || `node_${Date.now()}`;
}

function readStoredUsers(): Record<string, YazhiUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStoredUsers(users: Record<string, YazhiUser>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// useSyncExternalStore requires getSnapshot to return a stable reference when
// the underlying data hasn't changed; readStoredUsers/getUser parse JSON fresh
// each call, so cache by id and only recompute after a write invalidates it.
const userSnapshotCache = new Map<string, YazhiUser | null>();

function invalidateUserSnapshot(id: string) {
  userSnapshotCache.delete(id);
}

/** Minimal onboarding: just a handle and a phone number. Everything else
    (role, bio, tech stack) is left for the profile-edit flow to fill in
    later — see yazhi-dev issue: "extend onboarding while launching". City
    is expected to already be an anonymized cluster label (see
    /api/geo), never a raw IP or precise coordinate. */
export function createUser(input: {
  yazhName: string;
  phone: string;
  city: string;
  role?: string;
  avatar?: string;
  github?: string;
}): YazhiUser {
  const users = readStoredUsers();
  const id = slugify(input.yazhName);
  const user: YazhiUser = {
    id,
    name: input.yazhName,
    handle: `@${id}`,
    role: input.role ?? "Member",
    city: input.city,
    bio: "",
    avatar: input.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    reputation: 0,
    github: input.github ?? "",
    phone: input.phone,
  };
  users[id] = user;
  writeStoredUsers(users);
  window.localStorage.setItem(CURRENT_USER_KEY, id);
  invalidateUserSnapshot(id);
  return user;
}

export function updateUser(id: string, patch: Partial<YazhiUser>): YazhiUser | null {
  const users = readStoredUsers();
  const existing = users[id] ?? MOCK_USERS.find((u) => u.id === id);
  if (!existing) return null;
  const updated = { ...existing, ...patch } as YazhiUser;
  users[id] = updated;
  writeStoredUsers(users);
  invalidateUserSnapshot(id);
  return updated;
}

export function getUser(id: string): YazhiUser | undefined {
  const users = readStoredUsers();
  return users[id] ?? MOCK_USERS.find((u) => u.id === id);
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

function noopSubscribe() {
  return () => {};
}

// Reads external (localStorage-backed) user state without the setState-in-effect
// anti-pattern; getServerSnapshot returns undefined so SSR/client hydration agree,
// then the real snapshot resolves on the client without a hydration mismatch.
export function useUser(id: string | null): YazhiUser | null | undefined {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!id) return null;
      if (!userSnapshotCache.has(id)) {
        userSnapshotCache.set(id, getUser(id) ?? null);
      }
      return userSnapshotCache.get(id)!;
    },
    () => undefined
  );
}
