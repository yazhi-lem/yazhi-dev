import React from 'react';

export default function CityCard({ location }) {
  const statusColor = location.status === 'online' ? 'bg-green-400' : 'bg-yellow-400';

  return (
    <div className={`p-6 border border-zinc-800 ${location.color} ${location.hoverColor} transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm bg-opacity-40`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:scale-105 transition-transform origin-left">
          {location.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400">{location.devCount} DEVS</span>
          <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></span>
        </div>
      </div>
      
      <p className="text-sm text-zinc-300 font-mono mb-6 h-16 leading-relaxed">
        {location.description}
      </p>

      <div className="border-t border-zinc-700 pt-4 mt-auto">
        <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-semibold">
          Domain: {location.focus}
        </div>
        <div className="flex flex-wrap gap-2">
          {location.projects.map(proj => (
            <span key={proj} className="px-2 py-1 text-xs bg-black bg-opacity-50 border border-zinc-600 rounded text-zinc-200 shadow-sm">
              {proj}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-10 transition-opacity"></div>
    </div>
  );
}
