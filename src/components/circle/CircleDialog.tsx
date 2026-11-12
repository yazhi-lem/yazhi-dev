"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCircleSession } from "./CircleProvider";
import { useUiT } from "@/lib/i18n";

type Mode = "signin" | "signup";

const field =
  "w-full rounded-lg border border-ivory/15 bg-night px-3 py-2 text-sm text-ivory placeholder:text-ivory-dim/40 focus:border-gold/60 focus:outline-none";

/** Sign in / join / account panel for a Circle account on yazhi-api. */
export function CircleDialog({ onClose, initialMode = "signin" }: { onClose: () => void; /** "signup" opens straight on joining */ initialMode?: Mode }) {
  const t = useUiT();
  const { state, signIn, signUp, signOut } = useCircleSession();
  const [mode, setMode] = useState<Mode>(initialMode);
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
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-ivory/15 bg-night-2 p-0 text-ivory backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      aria-labelledby="circle-dialog-title"
      data-lenis-prevent
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold">{t("circle.eyebrow")}</p>
            <h2 id="circle-dialog-title" className="display font-display text-2xl font-bold">
              {state.status === "signed-in"
                ? t("circle.yourCircle")
                : mode === "signin"
                  ? t("circle.signIn")
                  : t("circle.joinBuilder")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 text-ivory-dim hover:text-ivory"
            aria-label={t("circle.close")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {state.status === "loading" && <p className="text-sm text-ivory-dim">{t("circle.checking")}</p>}

        {state.status === "error" && (
          <p className="rounded-lg border border-palai/40 bg-palai/10 p-3 text-sm text-ivory">{state.message}</p>
        )}

        {state.status === "signed-in" && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-[6rem_1fr] gap-y-2 rounded-xl border border-ivory/10 bg-night/60 p-4">
              <dt className="text-ivory-dim">{t("circle.name")}</dt>
              <dd>{state.account.fullName}</dd>
              <dt className="text-ivory-dim">{t("circle.email")}</dt>
              <dd className="break-all">{state.account.email}</dd>
              <dt className="text-ivory-dim">{t("circle.account")}</dt>
              <dd className="break-all font-mono text-xs">{state.account.accountId}</dd>
            </dl>
            <p className="text-ivory-dim">
              {t("circle.missionOn")}{" "}
              <Link href="/bubble#templates" className="text-gold underline-offset-4 hover:underline">
                {t("circle.uiLibrary")}
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-gold px-4 py-2 font-semibold text-night transition hover:bg-bronze hover:text-ivory"
            >
              {t("circle.done")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(signOut)}
              className="w-full rounded-lg border border-ivory/20 px-4 py-2 font-semibold text-ivory-dim transition hover:border-palai/60 hover:text-ivory disabled:opacity-50"
            >
              {t("circle.signOut")}
            </button>
          </div>
        )}

        {state.status === "signed-out" && !state.configured && (
          <p className="rounded-lg border border-ivory/10 bg-night/60 p-4 text-sm text-ivory-dim">
            {t("circle.notConnected")}{" "}
            <code className="font-mono text-xs text-ivory">YAZHI_GRPC_TARGET</code> {t("circle.notConnected2")}{" "}
            <Link href="/bubble#circle" className="text-gold">
              {t("circle.circleDocsLink")}
            </Link>
            . {t("circle.notConnected3")}
          </p>
        )}

        {state.status === "signed-out" && state.configured && (
          <p className="-mt-2 mb-4 text-sm text-ivory-dim">{t("circle.wakesAfter")}</p>
        )}

        {state.status === "signed-out" && state.configured && (
          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <label className="block text-sm">
                <span className="mb-1 block text-ivory-dim">{t("circle.name")}</span>
                <input name="fullName" required maxLength={120} autoComplete="name" className={field} />
              </label>
            )}
            <label className="block text-sm">
              <span className="mb-1 block text-ivory-dim">{t("circle.email")}</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ivory-dim">{t("circle.password")}</span>
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
                  <span>{t("circle.adult")}</span>
                </label>
                <label className="flex items-start gap-2">
                  <input name="conduct" type="checkbox" required className="mt-0.5 accent-[var(--gold)]" />
                  <span>
                    {t("circle.conductPre")}{" "}
                    <Link href="/bubble#conduct" className="text-gold">
                      {t("circle.conductLink")}
                    </Link>
                    {t("circle.conductPost")}
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
              {busy ? "…" : mode === "signin" ? t("circle.signIn") : t("circle.createAccount")}
            </button>

            {state.signupOpen ? (
              <p className="text-center text-xs text-ivory-dim">
                {mode === "signin" ? `${t("circle.newHere")} ` : `${t("circle.haveAccount")} `}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError(null);
                  }}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {mode === "signin" ? t("circle.joinBuilder") : t("circle.signIn")}
                </button>
              </p>
            ) : (
              <p className="text-center text-xs text-ivory-dim">{t("circle.inviteOnly")}</p>
            )}
          </form>
        )}
      </div>
    </dialog>
  );
}
