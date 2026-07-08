"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/users";

const CITIES = [
  { id: "Madurai", icon: "🏛️", label: "Madurai", focus: "AI Focus" },
  { id: "Kochi", icon: "🌴", label: "Kochi", focus: "Mobile Focus" },
  { id: "Hyderabad", icon: "💻", label: "Hyderabad", focus: "Backend" },
  { id: "Bangalore", icon: "🛡️", label: "Bangalore", focus: "Security" },
  { id: "Remote", icon: "🌍", label: "Remote", focus: "Global" },
];

const ROLES = [
  { id: "Builder", icon: "⚡", label: "Builder" },
  { id: "Designer", icon: "✨", label: "Designer" },
  { id: "Business", icon: "💼", label: "Business" },
];

const AASI_AVATARS = [
  "/avatars/aasi_1.png",
  "/avatars/aasi_2.png",
  "/avatars/aasi_3.png",
  "/avatars/aasi_4.png",
];

type FormData = {
  github: string;
  phone: string;
  yazhName: string;
  role: string;
  cities: string[];
  avatar: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    github: "",
    phone: "",
    yazhName: "",
    role: "",
    cities: [],
    avatar: "",
  });

  const handleNext = () => setStep(step + 1);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || formData.cities.length === 0 || !formData.yazhName || !formData.avatar) return;
    const user = createUser({
      yazhName: formData.yazhName,
      role: formData.role,
      cities: formData.cities,
      avatar: formData.avatar,
      github: formData.github,
    });
    router.push(`/profile/edit?id=${user.id}`);
  };

  const toggleCity = (cityId: string) => {
    setFormData((prev) => {
      if (prev.cities.includes(cityId)) {
        return { ...prev, cities: prev.cities.filter((c) => c !== cityId) };
      }
      return { ...prev, cities: [...prev.cities, cityId] };
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
            Join the Network
          </h1>
          <p className="text-zinc-500 font-mono text-sm">
            {step === 1 && "Identify your node."}
            {step === 2 && "Configure your local nodes and role."}
            {step === 3 && "Select your AASI cyber-identity."}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4 max-w-md mx-auto">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
              GitHub Username (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. torvalds"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />

            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block pt-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
            <button
              onClick={handleNext}
              disabled={!formData.phone}
              className="w-full bg-white text-black font-bold py-4 disabled:opacity-50 hover:bg-zinc-200 transition-all"
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Yazh Name (Gen-Z Anon Handle)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. shadow_coder, cyber_yazh"
                value={formData.yazhName}
                onChange={(e) => setFormData({ ...formData, yazhName: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Primary Role
              </label>
              <div className="grid grid-cols-3 gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`p-4 border text-center transition-all flex flex-col items-center justify-center space-y-2 hover:border-zinc-500
                      ${formData.role === role.id ? "bg-white text-black border-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span className="font-bold text-sm">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Local Nodes (Select Multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => toggleCity(city.id)}
                    className={`p-4 border text-left transition-all hover:border-zinc-500
                      ${formData.cities.includes(city.id) ? "bg-white text-black border-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                  >
                    <div className="text-2xl mb-2">{city.icon}</div>
                    <div className="font-bold">{city.label}</div>
                    <div className="text-xs mt-1 text-zinc-600">{city.focus}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.role || formData.cities.length === 0 || !formData.yazhName}
                className="flex-1 bg-white text-black font-black py-4 uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-200 transition-all"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-8 text-center max-w-lg mx-auto">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Select your Avatar
              </label>
              <div className="grid grid-cols-2 gap-4">
                {AASI_AVATARS.map((avatarPath) => (
                  <button
                    key={avatarPath}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: avatarPath })}
                    className={`relative w-full aspect-square border-4 transition-all overflow-hidden rounded-xl hover:border-white
                      ${formData.avatar === avatarPath ? "border-white" : "border-zinc-800 bg-zinc-900"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarPath} alt="AASI avatar option" className="w-full h-full object-cover" />
                    {formData.avatar === avatarPath && (
                      <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                        <span className="text-3xl">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{formData.yazhName}</h2>
              <div className="text-sm font-mono text-zinc-500 mt-2">
                {formData.role} • {formData.cities.join(", ")}
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4 border-t border-zinc-800 mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!formData.avatar}
                className="flex-1 bg-white text-black font-black py-4 uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-200 transition-all"
              >
                Complete Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
