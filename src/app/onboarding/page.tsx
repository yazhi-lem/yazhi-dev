"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/lib/users";
import { LINKS } from "@/lib/content";

type Geo = { cluster: string; country: string | null };

/** Minimal onboarding for launch: just a handle and a phone number. Role,
    avatar, bio, and tech stack all get sane defaults here and are filled in
    later via /profile/edit — see yazhi-dev issue: "extend onboarding while
    launching, don't block signup on it".

    `?track=developer` (linked from the Community section's developer card)
    tags the new user's role as Developer and, after submit, shows a
    developer-specific next-steps panel instead of jumping straight to
    /profile/edit — Discord today, a Yazhi API (Circle) account once
    self-serve provisioning ships. See docs/PRD-DEVELOPER-COMMUNITY.md. */
function OnboardingForm() {
  const router = useRouter();
  const isDeveloper = useSearchParams().get("track") === "developer";
  const [yazhName, setYazhName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [joinedDeveloper, setJoinedDeveloper] = useState<{ id: string } | null>(null);

  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: Geo) => setGeo(data))
      .catch(() => setGeo({ cluster: "Unknown region", country: null }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yazhName || !phone || !consent || submitting) return;
    setSubmitting(true);
    const user = createUser({
      yazhName,
      phone,
      city: geo?.cluster ?? "Unknown region",
      role: isDeveloper ? "Developer" : undefined,
    });
    if (isDeveloper) {
      setJoinedDeveloper({ id: user.id });
      setSubmitting(false);
    } else {
      router.push(`/profile/edit?id=${user.id}`);
    }
  };

  if (joinedDeveloper) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-20">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yazh/yazh-waving.png" alt="" aria-hidden className="mx-auto mb-6 h-24 w-24 object-contain" />
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-3">Welcome, builder</h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">
            You&apos;re on the list. Two things happen from here:
          </p>
          <ul className="text-left text-sm font-mono text-zinc-400 space-y-3 mb-8">
            <li>
              <span className="text-zinc-200">1. Join the Discord</span> — that&apos;s where developers coordinate
              today, ask questions, and see what&apos;s shipping.
            </li>
            <li>
              <span className="text-zinc-200">2. Your Yazhi API account</span> — we provision these by hand while
              self-serve account creation is still being built (tracked in
              docs/PRD-DEVELOPER-COMMUNITY.md). We&apos;ll reach out on WhatsApp/Discord once it&apos;s ready.
            </li>
          </ul>
          <a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-black font-bold py-4 hover:bg-zinc-200 transition-all mb-3"
          >
            Join the Discord →
          </a>
          <Link
            href={`/profile/edit?id=${joinedDeveloper.id}`}
            className="block w-full border border-zinc-800 text-zinc-300 font-bold py-4 hover:border-zinc-600 transition-all"
          >
            Continue to profile →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
            {isDeveloper ? "Join as a Developer" : "Join the Network"}
          </h1>
          <p className="text-zinc-500 font-mono text-sm">
            {isDeveloper ? "Building for your mother tongue? Start here." : "Identify your node."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Yazh Name</label>
            <input
              type="text"
              required
              placeholder="e.g. shadow_coder"
              value={yazhName}
              onChange={(e) => setYazhName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Phone Number</label>
            <input
              type="tel"
              required
              inputMode="tel"
              pattern="[+]?[0-9\s\-()]{7,16}"
              title="7–16 digits; +, spaces, dashes, and parentheses allowed"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
            <p className="text-xs font-mono text-zinc-500">
              Stays in your browser — never sent to a server.{" "}
              <Link href="/privacy" className="text-zinc-300 underline hover:text-white">
                Privacy note
              </Link>
            </p>
          </div>

          <label className="flex items-start gap-3 text-xs font-mono text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-white"
            />
            <span>
              {isDeveloper
                ? "I've read the privacy note."
                : "I'm 13 or older — or a parent/guardian is helping me — and I've read the privacy note."}
            </span>
          </label>

          <div className="flex items-start gap-2 text-xs font-mono text-zinc-500">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden />
            {geo ? (
              <span>
                Node region: <span className="text-zinc-300">{geo.cluster}</span> — auto-detected, anonymized to
                city level only.
              </span>
            ) : (
              <span>Detecting node region…</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!yazhName || !phone || !consent || submitting}
            className="w-full bg-white text-black font-bold py-4 disabled:opacity-50 hover:bg-zinc-200 transition-all"
          >
            {submitting ? "Joining…" : isDeveloper ? "Join as a Developer →" : "Join the Network →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingForm />
    </Suspense>
  );
}
