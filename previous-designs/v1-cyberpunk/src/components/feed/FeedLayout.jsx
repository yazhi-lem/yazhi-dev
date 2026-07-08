import React from 'react';
import { Link } from 'react-router-dom';
import FeedItem from './FeedItem';
import { MOCK_FEED, MOCK_USERS } from '../../data/mockFeed';

export default function FeedLayout({ activeLocation }) {
  // Filter feed based on location if activeLocation is provided
  const feed = activeLocation 
    ? MOCK_FEED.filter(p => p.location.toLowerCase() === activeLocation.toLowerCase())
    : MOCK_FEED;

  const topHackers = MOCK_USERS.sort((a, b) => b.reputation - a.reputation).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4 mt-8 animate-fade-in-up">
      {/* Left Column: Feed */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h2 className="text-2xl font-black text-white">
            {activeLocation ? `${activeLocation} Hub Feed` : 'Global Feed'}
          </h2>
          <div className="flex space-x-4 text-sm font-mono text-zinc-400">
            <button className="text-white border-b-2 border-white pb-1">Top</button>
            <button className="hover:text-white transition-colors">New</button>
            <button className="hover:text-white transition-colors">Gigs</button>
          </div>
        </div>

        {feed.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-mono">No activity in this node yet. Be the first!</div>
        ) : (
          feed.map(post => <FeedItem key={post.id} post={post} />)
        )}
      </div>

      {/* Right Column: Sidebar */}
      <div className="space-y-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-4">Top Hackers</h3>
          <div className="space-y-4">
            {topHackers.map(hacker => (
              <div key={hacker.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link to={`/profile/${hacker.id}`}>
                    <img src={hacker.avatar} alt={hacker.name} className="w-8 h-8 rounded bg-zinc-800 hover:ring-1 ring-primary transition-all" />
                  </Link>
                  <div>
                    <Link to={`/profile/${hacker.id}`} className="text-sm font-bold text-white hover:underline cursor-pointer">
                      {hacker.name}
                    </Link>
                    <div className="text-xs text-zinc-500">{hacker.handle}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-primary font-bold">{hacker.reputation}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-4">Active Projects</h3>
          <ul className="space-y-2 text-sm text-zinc-300 font-mono">
            <li className="hover:text-white cursor-pointer transition-colors">→ Adhan LLM Core</li>
            <li className="hover:text-white cursor-pointer transition-colors">→ Illakiya v3 Design</li>
            <li className="hover:text-white cursor-pointer transition-colors">→ Yazhi Auth Migration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
