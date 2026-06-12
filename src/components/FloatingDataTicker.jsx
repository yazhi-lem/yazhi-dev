import React, { useState, useEffect } from 'react';

const METRICS = [
  "SOVEREIGN API: ACTIVE",
  "FOREIGN CALLS: 0",
  "SANGAM CORPUS: 2.1 TB",
  "YAZH PETS: ONLINE",
  "ADHAN LOSS: 1.84",
  "NETWORK LAYER: SECURE"
];

const FloatingDataTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % METRICS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-term-bg/60 backdrop-blur-md border border-term-accent/50 px-6 py-2 flex items-center gap-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-1000 rounded">
        <div className="w-2 h-2 bg-term-accent rounded-full animate-pulse shadow-[0_0_8px_var(--term-accent)] transition-colors duration-1000"></div>
        <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-term-accent transition-colors duration-1000 min-w-[250px] text-center">
          {METRICS[index]}
        </div>
      </div>
    </div>
  );
};

export default FloatingDataTicker;
