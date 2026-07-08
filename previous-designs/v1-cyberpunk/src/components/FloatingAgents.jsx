import React, { useEffect, useState } from 'react';

const AGENTS = [
  { id: 'yazh', name: 'Yazh', role: 'Polymath Node', delay: '0s' },
  { id: 'adhan', name: 'Adhan', role: 'GLM Core', delay: '3s' },
  { id: 'sangam', name: 'Sangam', role: 'Corpus Index', delay: '6s' }
];

const FloatingAgents = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generate initial static positions so they don't jump around on re-renders,
    // but random enough that they appear organically placed on load.
    // They are kept to the left and right sides to avoid blocking the main centered content.
    setPositions([
      { top: '25%', left: '10%' },
      { top: '65%', left: '15%' },
      { top: '40%', left: '85%' }
    ]);
  }, []);

  if (positions.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {AGENTS.map((agent, idx) => (
        <div 
          key={agent.id}
          className="absolute flex items-center gap-3 bg-term-bg/60 backdrop-blur-md border border-term-accent/30 p-2 rounded-full shadow-[0_0_15px_var(--term-accent)] transition-colors duration-1000"
          style={{
            top: positions[idx]?.top,
            left: positions[idx]?.left,
            animation: `float-agent 15s ease-in-out infinite alternate`,
            animationDelay: agent.delay
          }}
        >
          <div className="w-3 h-3 rounded-full bg-term-accent animate-pulse shadow-[0_0_10px_var(--term-accent)] transition-colors duration-1000"></div>
          <div className="pr-3 flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-term-text leading-none">{agent.name}</span>
            <span className="text-[8px] font-mono text-term-accent uppercase opacity-80 leading-none mt-1 transition-colors duration-1000">{agent.role}</span>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes float-agent {
          0% { transform: translate(0, 0); }
          33% { transform: translate(30px, -40px); }
          66% { transform: translate(-20px, 20px); }
          100% { transform: translate(40px, 10px); }
        }
      `}</style>
    </div>
  );
};

export default FloatingAgents;
