"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUserId, updateUser, useUser, type YazhiUser } from "@/lib/users";

function EditProfileResolver() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") ?? getCurrentUserId();
  const user = useUser(userId);

  if (user === undefined) return null;

  if (!userId || !user) {
    return (
      <div className="max-w-3xl mx-auto px-6 mt-12 mb-20 text-center">
        <p className="text-zinc-400 font-mono">
          No node found to edit.{" "}
          <Link href="/onboarding" className="text-white underline">
            Join the network
          </Link>{" "}
          first.
        </p>
      </div>
    );
  }

  return <EditProfileForm key={userId} userId={userId} user={user} />;
}

function EditProfileForm({ userId, user }: { userId: string; user: YazhiUser }) {
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
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Profile Configuration</h1>
        <p className="text-zinc-500 font-mono text-sm">Flesh out your identity across the network nodes.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bio / Objective</label>
            <textarea
              rows={4}
              placeholder="Building the next generation of decentralised compute..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono resize-none"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Primary Tech Stack (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Rust, React, Python, Postgres"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as typeof availability)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
            >
              <option value="open">Open to Collab & Gigs</option>
              <option value="employed">Currently Employed (Casual Hacking Only)</option>
              <option value="closed">Not Looking</option>
            </select>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/profile/${userId}`)}
              className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black font-black py-3 px-8 uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {saving ? "Syncing..." : "Save Profile"}
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
