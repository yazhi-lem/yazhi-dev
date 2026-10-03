"use client";
import { useState } from "react";
import { useCircleSession } from "./CircleProvider";
import { CircleDialog } from "./CircleDialog";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  // Array.from keeps a Tamil grapheme's first code point intact enough for
  // a monogram; full names fall back to the email's first letter upstream.
  return parts
    .slice(0, 2)
    .map((p) => Array.from(p)[0] ?? "")
    .join("")
    .toUpperCase();
}

/** The ⓒ in the corner of the Bubble UI: your Circle account. Signed out it
    is an open ring; signed in it carries your initials. */
export function CircleButton({ size = 40, className = "" }: { size?: number; className?: string }) {
  const { state } = useCircleSession();
  const [open, setOpen] = useState(false);

  const signedIn = state.status === "signed-in";
  const label = signedIn
    ? `Circle account: ${state.account.fullName || state.account.email}`
    : "Sign in with Circle";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className={`relative grid shrink-0 place-items-center rounded-full border transition ${
          signedIn
            ? "border-gold/70 bg-gold/15 text-gold hover:bg-gold hover:text-night"
            : "border-ivory/30 text-ivory-dim hover:border-gold/70 hover:text-gold"
        } ${className}`}
        style={{ width: size, height: size }}
      >
        {signedIn ? (
          <span className="font-mono text-xs font-medium">
            {initials(state.account.fullName) || state.account.email[0]?.toUpperCase()}
          </span>
        ) : (
          <span className="font-display text-base font-bold leading-none" aria-hidden>
            C
          </span>
        )}
        {state.status === "loading" && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold/30" />
        )}
      </button>
      {open && <CircleDialog onClose={() => setOpen(false)} />}
    </>
  );
}
