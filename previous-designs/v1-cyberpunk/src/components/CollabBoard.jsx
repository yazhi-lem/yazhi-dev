import React, { useState, useEffect } from 'react';

const MOCK_EVENTS = [
  { time: 'Just now', from: 'Madurai', to: 'Hyderabad', action: 'Merged PR #12: Adhan dataset update' },
  { time: '2m ago', from: 'Kochi', action: 'Deployed Illakiya v2.1.0 to staging' },
  { time: '5m ago', from: 'Bangalore', action: 'Security audit passed on Capitol backend' },
  { time: '12m ago', from: 'Hyderabad', to: 'Madurai', action: 'API integration tests green for Sangam' },
  { time: '18m ago', from: 'Kochi', to: 'Bangalore', action: 'Requested review on Yazh mobile Auth flow' }
];

export default function CollabBoard() {
  const [events, setEvents] = useState([]);

  // Simulate incoming events
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < MOCK_EVENTS.length) {
        setEvents(prev => [MOCK_EVENTS[index], ...prev].slice(0, 4));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-6 border-b border-zinc-800 pb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="text-xl font-bold font-mono tracking-wider text-white">LIVE ACTIVITY</h2>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-zinc-600 font-mono text-sm animate-pulse">Connecting to regional nodes...</div>
        ) : (
          events.map((ev, i) => (
            <div key={i} className="flex flex-col space-y-1 animate-fade-in-up">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{ev.time}</span>
                <span className="uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {ev.from} {ev.to ? `→ ${ev.to}` : ''}
                </span>
              </div>
              <div className="text-sm text-zinc-300 font-medium bg-zinc-900 bg-opacity-50 p-2 rounded border-l-2 border-primary">
                {ev.action}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Grid overlay styling */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
    </div>
  );
}
