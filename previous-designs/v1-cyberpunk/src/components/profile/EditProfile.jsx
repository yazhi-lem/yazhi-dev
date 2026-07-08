import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mt-12 mb-20 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Profile Configuration</h1>
        <p className="text-zinc-500 font-mono text-sm">Flesh out your identity across the network nodes.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bio / Objective</label>
            <textarea 
              rows="4"
              placeholder="Building the next generation of decentralised compute..." 
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono resize-none"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Primary Tech Stack (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Rust, React, Python, Postgres" 
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Availability</label>
            <select className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
              <option value="open">Open to Collab & Gigs</option>
              <option value="employed">Currently Employed (Casual Hacking Only)</option>
              <option value="closed">Not Looking</option>
            </select>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono"
            >
              Skip for now
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="bg-white text-black font-black py-3 px-8 uppercase tracking-widest hover:bg-zinc-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Save Profile'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
