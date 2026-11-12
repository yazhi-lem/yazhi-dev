"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUserId, updateUser, useUser, type YazhiUser } from "@/lib/users";
import { useUiT } from "@/lib/i18n";

function EditProfileResolver() {
  const t = useUiT();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") ?? getCurrentUserId();
  const user = useUser(userId);

  if (user === undefined) return null;

  if (!userId || !user) {
    return (
      <div className="max-w-3xl mx-auto px-6 mt-12 mb-20 text-center">
        <p className="text-zinc-400 font-mono">
          {t("profile.noNodePre")}{" "}
          <Link href="/onboarding" className="text-white underline">
            {t("onboarding.joinNetwork")}
          </Link>{" "}
          {t("profile.noNodePost")}
        </p>
      </div>
    );
  }

  return <EditProfileForm key={userId} userId={userId} user={user} />;
}

function EditProfileForm({ userId, user }: { userId: string; user: YazhiUser }) {
  const t = useUiT();
  const router = useRouter();
  const [bio, setBio] = useState(user.bio ?? "");
  const [stack, setStack] = useState(user.techStack ?? "");
  const [availability, setAvailability] = useState<"open" | "employed" | "closed">(
    user.availability ?? "open"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateUser(userId, { bio, techStack: stack, availability });
    setTimeout(() => {
      setSaving(false);
      router.push(`/profile/${userId}`);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mt-12 mb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">{t("profile.configTitle")}</h1>
        <p className="text-zinc-500 font-mono text-sm">{t("profile.configSub")}</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("profile.bio")}</label>
            <textarea
              rows={4}
              placeholder={t("profile.bioPlaceholder")}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono resize-none"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              {t("profile.stack")}
            </label>
            <input
              type="text"
              placeholder={t("profile.stackPlaceholder")}
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("profile.availability")}</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as typeof availability)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
            >
              <option value="open">{t("profile.availOpen")}</option>
              <option value="employed">{t("profile.availEmployed")}</option>
              <option value="closed">{t("profile.availClosed")}</option>
            </select>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/profile/${userId}`)}
              className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono"
            >
              {t("profile.skipForNow")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black font-black py-3 px-8 uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {saving ? t("profile.syncing") : t("profile.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={null}>
      <EditProfileResolver />
    </Suspense>
  );
}
