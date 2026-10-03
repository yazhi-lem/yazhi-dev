"use client";
import { useCallback, useEffect, useState } from "react";
import type { CircleAccount, CircleSessionResponse } from "./types";

export type CircleState =
  | { status: "loading" }
  | { status: "signed-in"; account: CircleAccount }
  | { status: "signed-out"; configured: boolean; signupOpen: boolean }
  | { status: "error"; message: string };

async function post(path: string, body?: unknown): Promise<{ account?: CircleAccount; error?: string }> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/** Browser-side view of the Circle session. Tokens never reach this code —
    they live in httpOnly cookies; this hook only ever sees the account. */
export function useCircle() {
  const [state, setState] = useState<CircleState>({ status: "loading" });

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/circle/session", { cache: "no-store" });
      const json = (await res.json()) as CircleSessionResponse | { error: string };
      if ("error" in json) {
        setState({ status: "error", message: json.error });
      } else if (json.signedIn) {
        setState({ status: "signed-in", account: json.account });
      } else {
        setState({ status: "signed-out", configured: json.configured, signupOpen: json.signupOpen });
      }
    } catch {
      setState({ status: "error", message: "Couldn't reach yazhi.dev." });
    }
  }, []);

  useEffect(() => {
    // deferred a tick so the first client render matches the server HTML
    queueMicrotask(() => void reload());
  }, [reload]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { account } = await post("/api/circle/signin", { email, password });
    if (account) setState({ status: "signed-in", account });
  }, []);

  const signUp = useCallback(
    async (input: { fullName: string; email: string; password: string; adult: boolean; conduct: boolean }) => {
      const { account } = await post("/api/circle/signup", input);
      if (account) setState({ status: "signed-in", account });
    },
    []
  );

  const signOut = useCallback(async () => {
    await post("/api/circle/signout");
    await reload();
  }, [reload]);

  return { state, signIn, signUp, signOut, reload };
}
