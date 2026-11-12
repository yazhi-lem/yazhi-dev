"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/lib/users";
import { LINKS } from "@/lib/content";
import { useUiT, useSiteT } from "@/lib/i18n";

type Geo = { cluster: string; country: string | null };

/** Minimal onboarding for launch: just a handle and a phone number. Role,
    avatar, bio, and tech stack all get sane defaults here and are filled in
    later via /profile/edit — see yazhi-dev issue: "extend onboarding while
    launching, don't block signup on it".

    `?track=developer` (linked from the Community section's developer card)
    tags the new user's role as Developer and, after submit, shows a
    developer-specific next-steps panel instead of jumping straight to
    /profile/edit — Discord today, a Yazhi API (Circle) account once
    self-serve provisioning ships. See docs/community/PRD-DEVELOPER-COMMUNITY.md. */
function OnboardingForm() {
  const t = useUiT();
  const site = useSiteT();
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
      .catch(() => setGeo({ cluster: t("onboarding.unknownRegion"), country: null }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yazhName || !phone || !consent || submitting) return;
    setSubmitting(true);
    const user = createUser({
      yazhName,
      phone,
      city: geo?.cluster ?? t("onboarding.unknownRegion"),
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
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-3">{t("onboarding.welcomeBuilder")}</h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">{site("site.onboarding.developer.stepTwo")}</p>
          <ul className="text-left text-sm font-mono text-zinc-400 space-y-3 mb-8">
            <li>
              <span className="text-zinc-200">
                {"1. "}
                {site("site.onboarding.developer.stepJoinDiscord")}
              </span>
              {" — "}
              {site("site.onboarding.developer.nextSteps.1")}
            </li>
            <li>
              <span className="text-zinc-200">
                {"2. "}
                {site("site.onboarding.developer.stepApiAccount")}
              </span>
              {" — "}
              {site("site.onboarding.developer.nextSteps.2")}
            </li>
          </ul>
          <a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-black font-bold py-4 hover:bg-zinc-200 transition-all mb-3"
          >
            {t("onboarding.joinDiscord")}
          </a>
          <Link
            href={`/profile/edit?id=${joinedDeveloper.id}`}
            className="block w-full border border-zinc-800 text-zinc-300 font-bold py-4 hover:border-zinc-600 transition-all"
          >
            {t("onboarding.continueProfile")}
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
            {isDeveloper ? t("onboarding.joinDeveloper") : t("onboarding.joinNetwork")}
          </h1>
          <p className="text-zinc-500 font-mono text-sm">
            {isDeveloper ? t("onboarding.subDeveloper") : t("onboarding.subNetwork")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">{t("onboarding.yazhName")}</label>
            <input
              type="text"
              required
              placeholder={t("onboarding.yazhNamePlaceholder")}
              value={yazhName}
              onChange={(e) => setYazhName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">{t("onboarding.phone")}</label>
            <input
              type="tel"
              required
              inputMode="tel"
              pattern="[+]?[0-9\s\-()]{7,16}"
              title={t("onboarding.phoneTitle")}
              placeholder={t("onboarding.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
            <p className="text-xs font-mono text-zinc-500">
              {t("onboarding.staysBrowser")}{" "}
              <Link href="/privacy" className="text-zinc-300 underline hover:text-white">
                {t("onboarding.privacyNote")}
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
              {isDeveloper ? t("onboarding.consentDeveloper") : t("onboarding.consentNetwork")}
            </span>
          </label>

          <div className="flex items-start gap-2 text-xs font-mono text-zinc-500">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden />
            {geo ? (
              <span>{site("site.onboarding.nodeRegion", { region: geo.cluster })}</span>
            ) : (
              <span>{site("site.onboarding.detecting")}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!yazhName || !phone || !consent || submitting}
            className="w-full bg-white text-black font-bold py-4 disabled:opacity-50 hover:bg-zinc-200 transition-all"
          >
            {submitting
              ? t("onboarding.joining")
              : isDeveloper
                ? t("onboarding.joinDeveloperCta")
                : t("onboarding.joinNetworkCta")}
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
