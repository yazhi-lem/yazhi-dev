"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/lib/users";

type Geo = { cluster: string; country: string | null };

/** Minimal onboarding for launch: just a handle and a phone number. Role,
    avatar, bio, and tech stack all get sane defaults here and are filled in
    later via /profile/edit — see yazhi-dev issue: "extend onboarding while
    launching, don't block signup on it". */
export default function OnboardingPage() {
  const router = useRouter();
  const [yazhName, setYazhName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    const user = createUser({ yazhName, phone, city: geo?.cluster ?? "Unknown region" });
    router.push(`/profile/edit?id=${user.id}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">Join the Network</h1>
          <p className="text-zinc-500 font-mono text-sm">Identify your node.</p>
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
            <span>I&apos;m 13 or older — or a parent/guardian is helping me — and I&apos;ve read the privacy note.</span>
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
            {submitting ? "Joining…" : "Join the Network →"}
          </button>
        </form>
      </div>
    </div>
  );
}
