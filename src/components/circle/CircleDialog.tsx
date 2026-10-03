"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCircleSession } from "./CircleProvider";

type Mode = "signin" | "signup";

const field =
  "w-full rounded-lg border border-ivory/15 bg-night px-3 py-2 text-sm text-ivory placeholder:text-ivory-dim/40 focus:border-gold/60 focus:outline-none";

/** Sign in / join / account panel for a Circle account on yazhi-api. */
export function CircleDialog({ onClose }: { onClose: () => void }) {
  const { state, signIn, signUp, signOut } = useCircleSession();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    if (mode === "signin") {
      void run(() => signIn(email, password));
    } else {
      void run(() =>
        signUp({
          fullName: String(f.get("fullName") ?? ""),
          email,
          password,
          adult: f.get("adult") === "on",
          conduct: f.get("conduct") === "on",
        })
      );
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-ivory/15 bg-night-2 p-0 text-ivory backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      aria-labelledby="circle-dialog-title"
      data-lenis-prevent
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold">Circle · yazhi-api</p>
            <h2 id="circle-dialog-title" className="display font-display text-2xl font-bold">
              {state.status === "signed-in" ? "Your Circle" : mode === "signin" ? "Sign in" : "Join as a builder"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-ivory/15 text-ivory-dim hover:text-ivory"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {state.status === "loading" && <p className="text-sm text-ivory-dim">Checking your session…</p>}

        {state.status === "error" && (
          <p className="rounded-lg border border-palai/40 bg-palai/10 p-3 text-sm text-ivory">{state.message}</p>
        )}

        {state.status === "signed-in" && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-[6rem_1fr] gap-y-2 rounded-xl border border-ivory/10 bg-night/60 p-4">
              <dt className="text-ivory-dim">Name</dt>
              <dd>{state.account.fullName}</dd>
              <dt className="text-ivory-dim">Email</dt>
              <dd className="break-all">{state.account.email}</dd>
              <dt className="text-ivory-dim">Account</dt>
              <dd className="break-all font-mono text-xs">{state.account.accountId}</dd>
            </dl>
            <p className="text-ivory-dim">
              Bubbles you publish are signed with this account. Build them from the{" "}
              <Link href="/bubble/pages" className="text-gold underline-offset-4 hover:underline">
                UI library
              </Link>
              .
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(signOut)}
              className="w-full rounded-lg border border-ivory/20 px-4 py-2 font-semibold text-ivory-dim transition hover:border-palai/60 hover:text-ivory disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        )}

        {state.status === "signed-out" && !state.configured && (
          <p className="rounded-lg border border-ivory/10 bg-night/60 p-4 text-sm text-ivory-dim">
            Circle sign-in isn&apos;t connected on this deployment yet. Set <code className="font-mono text-xs text-ivory">YAZHI_GRPC_TARGET</code>{" "}
            to reach yazhi-api — see <Link href="/bubble#circle" className="text-gold">Bubble docs → Circle</Link>.
            The Bubble UI and the UI library still work locally.
          </p>
        )}

        {state.status === "signed-out" && state.configured && (
          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <label className="block text-sm">
                <span className="mb-1 block text-ivory-dim">Name</span>
                <input name="fullName" required maxLength={120} autoComplete="name" className={field} />
              </label>
            )}
            <label className="block text-sm">
              <span className="mb-1 block text-ivory-dim">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ivory-dim">Password</span>
              <input
                name="password"
                type="password"
                required
                minLength={mode === "signup" ? 10 : 1}
                maxLength={72}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className={field}
              />
            </label>
            {mode === "signup" && (
              <div className="space-y-2 pt-1 text-xs text-ivory-dim">
                <label className="flex items-start gap-2">
                  <input name="adult" type="checkbox" required className="mt-0.5 accent-[var(--gold)]" />
                  <span>I am 18 or older. (Children use Yazh through the family flow, with a parent.)</span>
                </label>
                <label className="flex items-start gap-2">
                  <input name="conduct" type="checkbox" required className="mt-0.5 accent-[var(--gold)]" />
                  <span>
                    I&apos;ll follow the{" "}
                    <Link href="/bubble#conduct" className="text-gold">
                      builder code of conduct
                    </Link>
                    .
                  </span>
                </label>
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-lg border border-palai/40 bg-palai/10 p-2.5 text-sm text-ivory">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-gold px-4 py-2 font-semibold text-night transition hover:bg-bronze hover:text-ivory disabled:opacity-50"
            >
              {busy ? "…" : mode === "signin" ? "Sign in" : "Create Circle account"}
            </button>

            {state.signupOpen ? (
              <p className="text-center text-xs text-ivory-dim">
                {mode === "signin" ? "New here? " : "Already have a Circle account? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError(null);
                  }}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {mode === "signin" ? "Join as a builder" : "Sign in"}
                </button>
              </p>
            ) : (
              <p className="text-center text-xs text-ivory-dim">
                Builder sign-up is invite-only during the pilot — ask in Discord.
              </p>
            )}
          </form>
        )}
      </div>
    </dialog>
  );
}
