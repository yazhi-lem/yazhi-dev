import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CITIES = [
  { id: 'Madurai', icon: '🏛️', label: 'Madurai', focus: 'AI Focus' },
  { id: 'Kochi', icon: '🌴', label: 'Kochi', focus: 'Mobile Focus' },
  { id: 'Hyderabad', icon: '💻', label: 'Hyderabad', focus: 'Backend' },
  { id: 'Bangalore', icon: '🛡️', label: 'Bangalore', focus: 'Security' },
  { id: 'Remote', icon: '🌍', label: 'Remote', focus: 'Global' }
];

const ROLES = [
  { id: 'Builder', icon: '⚡', label: 'Builder' },
  { id: 'Designer', icon: '✨', label: 'Designer' },
  { id: 'Business', icon: '💼', label: 'Business' }
];

const AASI_AVATARS = [
  '/avatars/aasi_1.png',
  '/avatars/aasi_2.png',
  '/avatars/aasi_3.png',
  '/avatars/aasi_4.png'
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    github: '',
    phone: '',
    yazhName: '',
    role: '',
    cities: [], // multi-select
    avatar: '' // selected avatar path
  });

  const handleNext = () => setStep(step + 1);
  const handleFinish = (e) => {
    e.preventDefault();
    if (!formData.role || formData.cities.length === 0 || !formData.yazhName || !formData.avatar) return;
    // In a real app, save to backend context here
    navigate('/profile/edit');
  };

  const toggleCity = (cityId) => {
    setFormData(prev => {
      if (prev.cities.includes(cityId)) {
        return { ...prev, cities: prev.cities.filter(c => c !== cityId) };
      } else {
        return { ...prev, cities: [...prev.cities, cityId] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-primary selection:text-white pb-20">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
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
            {step === 1 && 'Authenticate your identity.'}
            {step === 2 && 'Configure your local nodes and role.'}
            {step === 3 && 'Select your AASI cyber-identity.'}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-fade-in-up max-w-md mx-auto">
            <button 
              onClick={handleNext}
              className="w-full flex items-center justify-center space-x-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white p-4 transition-all group hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">Continue with GitHub</span>
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-600 font-mono">Or Setup with Phone</span>
              </div>
            </div>

            <div className="space-y-4">
              <input 
                type="tel" 
                placeholder="Enter Phone Number" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-4 text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
              <button 
                onClick={handleNext}
                disabled={!formData.phone}
                className="w-full bg-white text-black font-bold py-4 disabled:opacity-50 hover:bg-zinc-200 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Yazh Name (Gen-Z Anon Handle)</label>
              <input 
                type="text" 
                required
                placeholder="e.g. shadow_coder, cyber_yazh" 
                value={formData.yazhName}
                onChange={e => setFormData({...formData, yazhName: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Primary Role</label>
              <div className="grid grid-cols-3 gap-4">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({...formData, role: role.id})}
                    className={`p-4 border text-center transition-all flex flex-col items-center justify-center space-y-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:border-zinc-500
                      ${formData.role === role.id ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span className="font-bold text-sm">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Local Nodes (Select Multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CITIES.map(city => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => toggleCity(city.id)}
                    className={`p-4 border text-left transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:border-zinc-500
                      ${formData.cities.includes(city.id) ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                  >
                    <div className="text-2xl mb-2">{city.icon}</div>
                    <div className="font-bold">{city.label}</div>
                    <div className={`text-xs mt-1 ${formData.cities.includes(city.id) ? 'text-zinc-600' : 'text-zinc-600'}`}>{city.focus}</div>
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
                className="flex-1 bg-white text-black font-black py-4 uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-200 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-8 animate-fade-in-up text-center max-w-lg mx-auto">
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select your Avatar</label>
              <div className="grid grid-cols-2 gap-4">
                {AASI_AVATARS.map((avatarPath, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({...formData, avatar: avatarPath})}
                    className={`relative w-full aspect-square border-4 transition-all overflow-hidden rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:border-white
                      ${formData.avatar === avatarPath ? 'border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.5)]' : 'border-zinc-800 bg-zinc-900'}`}
                  >
                    <img src={avatarPath} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                    {formData.avatar === avatarPath && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
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
                {formData.role} • {formData.cities.join(', ')}
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
                className="flex-1 bg-white text-black font-black py-4 uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
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
