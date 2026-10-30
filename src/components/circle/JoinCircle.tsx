"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { useCircleSession } from "./CircleProvider";
import { CircleDialog } from "./CircleDialog";

// Tamil: DRAFT, native review pending
const LABEL = { ta: "வட்டத்தில் இணைக", en: "Join Circle" };

/** The one call to action on the home page: create a Circle account. Opens
    straight on joining when sign-up is open, else on sign-in. `signedIn`
    renders instead once an account exists (usually Mission Control). */
export function JoinCircle({ className = "", signedIn = null }: { className?: string; signedIn?: React.ReactNode }) {
  const { state } = useCircleSession();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  if (state.status === "signed-in") return <>{signedIn}</>;
  const signup = state.status === "signed-out" && state.signupOpen;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full bg-gold px-4 text-sm font-semibold text-night shadow-[0_6px_20px_-8px_rgba(211,179,106,0.55)] transition-[background-color,transform] duration-300 hover:bg-ivory active:scale-[0.97] ${className}`}
      >
        <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full border-[1.5px] border-current" />
        <span lang={lang === "en" ? "en" : "ta"}>{lang === "en" ? LABEL.en : LABEL.ta}</span>
      </button>
      {open && <CircleDialog initialMode={signup ? "signup" : "signin"} onClose={() => setOpen(false)} />}
    </>
  );
}
