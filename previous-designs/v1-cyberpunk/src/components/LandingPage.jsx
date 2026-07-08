import React, { useState, useEffect } from 'react';
import YazhiLogo from './YazhiLogo';
import AbstractBackground from './AbstractBackground';
import FloatingAgents from './FloatingAgents';
import FloatingDataTicker from './FloatingDataTicker';

const THEMES = [
  { 
    id: 'kurinji', 
    name: 'குறிஞ்சி',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="21,18 13,6 8,14 5,10 0,18" /></svg>
  },
  { 
    id: 'mullai', 
    name: 'முல்லை',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L4 12h4v8h8v-8h4z"/></svg>
  },
  { 
    id: 'marutham', 
    name: 'மருதம்',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2v20M7 8c2.5-3 7.5-3 10 0M7 14c2.5-3 7.5-3 10 0" /></svg>
  },
  { 
    id: 'neithal', 
    name: 'நெய்தல்',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 12c3-3 5-3 8 0s5 3 8 0 5-3 8 0" /><path d="M2 18c3-3 5-3 8 0s5 3 8 0 5-3 8 0" /></svg>
  },
  { 
    id: 'palai', 
    name: 'பாலை',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" /></svg>
  }
];

const LandingPage = () => {
  const [activeTheme, setActiveTheme] = useState('kurinji');
  const [isTamilTitle, setIsTamilTitle] = useState(true);

  // Toggle title every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTamilTitle(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`theme-${activeTheme} min-h-screen bg-term-bg text-term-text font-sans selection:bg-term-accent selection:text-black transition-colors duration-1000 relative overflow-hidden`}>
      <AbstractBackground activeTheme={activeTheme} />
      <FloatingAgents />
      <FloatingDataTicker />

      {/* Floating Theme Sidebar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme.id)}
            className={`p-3 border border-term-border rounded flex items-center justify-center transition-all duration-300 hover:-translate-x-2 ${
              activeTheme === theme.id ? 'bg-term-accent text-term-bg scale-110 shadow-[-4px_4px_0px_var(--term-border)]' : 'bg-term-bg text-term-text hover:bg-term-border hover:text-term-bg'
            }`}
            title={`${theme.id} - ${theme.name}`}
          >
            <theme.Icon />
          </button>
        ))}
      </div>

      {/* Navbar overlay */}
      <nav className="fixed w-full border-b-2 border-term-border bg-term-bg/90 backdrop-blur-sm z-40 transition-colors duration-1000">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <YazhiLogo />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase bilingual-wrapper w-16">
               <span className={`bilingual-text ${isTamilTitle ? 'bilingual-visible' : 'bilingual-hidden'}`}>யாழி</span>
               <span className={`bilingual-text ${!isTamilTitle ? 'bilingual-visible' : 'bilingual-hidden'}`}>YAZHI</span>
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-bold uppercase pr-12">
            <a href="#about" className="hover:text-term-accent transition-colors">Vision</a>
            <a href="#initiatives" className="hover:text-term-accent transition-colors">Initiatives</a>
            <a href="#connect" className="bg-term-border text-term-bg px-4 py-1.5 hover:bg-term-accent hover:text-black transition-colors">
              Build With Us
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full pt-20">
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-12">
          
          {/* Giant Floating Logo in the background/center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[35vw] text-term-accent opacity-20 pointer-events-none z-0 transition-colors duration-1000">
            <YazhiLogo />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center w-full px-6 max-w-5xl">
            <div className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-term-text/50 mb-12 border-b border-term-accent pb-4">
              Sovereign Technologies · Tamil-Rooted
            </div>
            
            <h1 className="text-[5rem] sm:text-[7rem] md:text-[12rem] font-serif font-black tracking-tighter uppercase leading-[0.8] mb-8 flex flex-col items-center bilingual-wrapper w-full h-[1em] text-term-text">
               <span className={`bilingual-text w-full flex justify-center ${isTamilTitle ? 'bilingual-visible' : 'bilingual-hidden'}`}>
                 <span className="block transition-colors duration-1000 drop-shadow-2xl">யாழி</span>
               </span>
               <span className={`bilingual-text w-full flex justify-center ${!isTamilTitle ? 'bilingual-visible' : 'bilingual-hidden'}`}>
                 <span className="block transition-colors duration-1000 drop-shadow-2xl">YAZHI</span>
               </span>
            </h1>

            <h2 className="text-sm md:text-xl font-bold mb-10 flex gap-4 md:gap-16 flex-wrap justify-center uppercase tracking-[0.3em] text-term-accent">
              <span>Security</span>
              <span>Sovereign</span>
              <span>Societal</span>
            </h2>

            <p className="font-mono text-base md:text-xl font-medium max-w-2xl text-center leading-relaxed mb-12 text-term-text/70 bg-term-bg/40 backdrop-blur-md p-6 border border-term-border/50 rounded-lg">
              India's first Tamil-rooted, open-source sovereign AI movement — building digital infrastructure that India truly owns, in the languages its people actually speak.
            </p>

            <div className="flex gap-6">
              <a href="#initiatives" className="border-2 border-term-accent text-term-accent hover:bg-term-accent hover:text-term-bg px-12 py-4 font-bold uppercase tracking-[0.2em] transition-all text-sm shadow-[0_0_15px_var(--term-accent)] hover:shadow-[0_0_30px_var(--term-accent)] bg-term-bg/80 backdrop-blur-md rounded">
                Explore Initiatives
              </a>
            </div>
          </div>
        </section>

        {/* Quote Banner */}
        <section className="border-y-4 border-term-border bg-term-accent text-black my-12 transition-colors duration-1000 relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <blockquote className="text-2xl md:text-4xl font-bold leading-tight max-w-4xl mx-auto text-center">
              "We are not building a startup. We are building a movement with a business model — bootstrapped, sustainable, and owned by the people who build it."
              <footer className="mt-6 text-sm font-mono font-bold uppercase tracking-widest">
                — Yazhi Founding Collective
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Pillars Section */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-20 relative z-10 pr-16 md:pr-6">
          <div className="flex items-center mb-12">
            <h2 className="text-4xl font-black uppercase">Core Pillars</h2>
            <div className="h-1 flex-1 bg-term-border ml-6 transition-colors duration-1000"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="brutalist-card group hover:bg-term-border hover:text-term-bg bg-term-bg/80 backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 group-hover:text-term-accent transition-colors">01</div>
              <h3 className="text-2xl font-bold mb-4 uppercase">Sovereign by design</h3>
              <p className="font-mono text-sm leading-relaxed">
                No foreign API calls in production. Indian data stays on Indian soil. Sovereignty is a hard architectural constraint, not a marketing line.
              </p>
            </div>
            <div className="brutalist-card group hover:bg-term-border hover:text-term-bg bg-term-bg/80 backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 group-hover:text-term-accent transition-colors">02</div>
              <h3 className="text-2xl font-bold mb-4 uppercase">Tamil first, Indic next</h3>
              <p className="font-mono text-sm leading-relaxed">
                Native language AI — not translation. Built for the registers real people use: government, conversational, and classical Tamil, with Indic languages to follow.
              </p>
            </div>
            <div className="brutalist-card group hover:bg-term-border hover:text-term-bg bg-term-bg/80 backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 group-hover:text-term-accent transition-colors">03</div>
              <h3 className="text-2xl font-bold mb-4 uppercase">A commune, not a corp</h3>
              <p className="font-mono text-sm leading-relaxed">
                Built with workers and volunteers in the open. Contributors become co-owners. From open source to enterprise — value circulates inward.
              </p>
            </div>
          </div>
        </section>

        {/* What We Are Building */}
        <section id="initiatives" className="border-t border-term-border bg-term-border text-term-bg py-20 transition-colors duration-1000 relative z-10">
          <div className="max-w-7xl mx-auto px-6 pr-16 md:pr-6">
            <h2 className="text-4xl font-black uppercase mb-16 text-center">What We Are Building</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-term-bg text-term-text border-2 border-term-bg p-8 hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_var(--term-accent)]">
                <h3 className="text-2xl font-black uppercase mb-2">YAZH</h3>
                <div className="text-xs font-mono font-bold text-term-accent mb-4 uppercase tracking-wider transition-colors duration-1000">Product</div>
                <p className="font-mono text-sm">
                  A Tamil-first multi-agent architecture, learning from age 6 and upskilling as a polymath (life, news, tutor, culture), running entirely on sovereign infrastructure.
                </p>
              </div>
              
              <div className="bg-term-bg text-term-text border-2 border-term-bg p-8 hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_var(--term-accent)]">
                <h3 className="text-2xl font-black uppercase mb-2">ADHAN</h3>
                <div className="text-xs font-mono font-bold text-term-accent mb-4 uppercase tracking-wider transition-colors duration-1000">Research</div>
                <p className="font-mono text-sm">
                  A sovereign Tamil GLM (Grammatical Language Model), served from our own infrastructure — depth in classical, colloquial, and domain Tamil with Tholkappiyam's Grammar.
                </p>
              </div>

              <div className="bg-term-bg text-term-text border-2 border-term-bg p-8 hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_var(--term-accent)]">
                <h3 className="text-2xl font-black uppercase mb-2">SANGAM</h3>
                <div className="text-xs font-mono font-bold text-term-accent mb-4 uppercase tracking-wider transition-colors duration-1000">Heritage</div>
                <p className="font-mono text-sm">
                  A classical Tamil corpus and tool — making 2,000 years of literature accessible and conversational. Seeding Tamil language data for all LLMs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline / Roadmap */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 bg-term-bg/80 backdrop-blur-sm transition-colors duration-1000 pr-16 md:pr-6">
          <h2 className="text-4xl font-black uppercase mb-12">Where we are today</h2>
          <div className="font-mono text-sm mb-12 border-l-2 border-term-accent pl-4 max-w-2xl transition-colors duration-1000">
            An honest snapshot — June 2026. We share what is built, what is in motion, and what is on the near horizon. No inflated claims; the work speaks for itself.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm border-collapse border-2 border-term-border">
              <thead>
                <tr className="bg-term-border text-term-bg transition-colors duration-1000">
                  <th className="p-4 border-2 border-term-border uppercase">Status</th>
                  <th className="p-4 border-2 border-term-border uppercase">Initiatives</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-term-border">
                  <td className="p-4 border-r-2 border-term-border font-bold bg-term-bg/80">Built & Documented</td>
                  <td className="p-4 bg-term-bg/80">Yazh PRD v1.0 • Project Sangam spec • FDE curriculum • Brand & manifesto</td>
                </tr>
                <tr className="border-b-2 border-term-border">
                  <td className="p-4 border-r-2 border-term-border font-bold bg-term-bg/80">In Motion</td>
                  <td className="p-4 bg-term-bg/80">FDE intern cohort 0626 • Yazh prototype (three pets) • Base model benchmark • Phase-0 funding</td>
                </tr>
                <tr>
                  <td className="p-4 border-r-2 border-term-border font-bold bg-term-bg/80">Next 6 Months</td>
                  <td className="p-4 bg-term-bg/80">Closed beta • Govt pilot talks • Adhan API • Voice & corpus ingestion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Rules */}
        <section className="bg-term-border/5 py-16 border-y border-term-border relative z-10 backdrop-blur-sm transition-colors duration-1000 pr-16 md:pr-6">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xl font-black uppercase mb-4 text-term-accent transition-colors duration-1000">The Sovereignty Rule</h3>
                  <p className="font-mono text-sm border-l-4 border-term-border pl-4">
                    Zero foreign API calls in production — enforced at the network layer, audited monthly.
                  </p>
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase mb-4 text-term-accent transition-colors duration-1000">The Commune Rule</h3>
                  <p className="font-mono text-sm border-l-4 border-term-border pl-4">
                    Those who build it, own it. Contribution creates value; labour owns value.
                  </p>
               </div>
             </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="connect" className="bg-term-border text-term-bg py-16 border-t-8 border-term-accent relative z-10 transition-colors duration-1000">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 pr-16 md:pr-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 opacity-90 invert">
                <YazhiLogo />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">யாழி</span>
            </div>
            <p className="font-mono text-sm max-w-sm mb-6 opacity-80">
              Whether you are a government partner, an engineer, a Tamil scholar, or a believer in sovereign technology — there is a place for you in the commune.
            </p>
            <div className="flex gap-4 font-mono text-sm font-bold">
              <a href="mailto:hello@yazhi.tech" className="hover:text-term-accent transition-colors underline">hello@yazhi.tech</a>
              <a href="https://github.com/yazhi" className="hover:text-term-accent transition-colors underline">github.com/yazhi</a>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
             <div className="text-xl font-bold mb-2">யந்திரம் மனிதர்க்கே — மனிதர் யந்திரத்திற்கேன்று</div>
             <div className="font-mono text-xs opacity-70 mb-8 max-w-xs">
               The machine is for the human — not the human for the machine.
             </div>
             
             <div className="text-xs font-mono font-bold uppercase tracking-widest text-term-accent transition-colors duration-1000">
               Hyderabad · Madurai
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
