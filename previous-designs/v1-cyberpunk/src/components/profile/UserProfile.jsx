import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_USERS, MOCK_FEED } from '../../data/mockFeed';
import FeedItem from '../feed/FeedItem';

export default function UserProfile() {
  const { id } = useParams();
  const user = MOCK_USERS.find(u => u.id === id);
  const userPosts = MOCK_FEED.filter(p => p.authorId === id);

  if (!user) {
    return <div className="p-20 text-white text-center font-mono">User not found in regional nodes.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 mt-12 animate-fade-in-up">
      <Link to="/" className="text-zinc-500 hover:text-white font-mono text-sm mb-8 inline-block transition-colors">
        ← Back to Network
      </Link>

      <div className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 relative z-10">
          <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-zinc-900 bg-zinc-800" />
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tighter">{user.name}</h1>
              <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 font-mono text-sm text-zinc-400 mb-4">
              <span>{user.handle}</span>
              <span>•</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> {user.city} Node</span>
            </div>
            
            <p className="text-zinc-300 leading-relaxed max-w-2xl">{user.bio}</p>
          </div>

          <div className="flex flex-col space-y-3 w-full md:w-auto">
            <button className="bg-white text-black font-bold py-2 px-6 hover:bg-zinc-200 transition-colors">
              Connect ⅄
            </button>
            <a href={`https://github.com/${user.github}`} target="_blank" rel="noreferrer" className="text-center font-mono text-sm text-zinc-400 border border-zinc-800 py-2 hover:text-white hover:border-zinc-600 transition-colors">
              github.com/{user.github}
            </a>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Recent Activity</h3>
        {userPosts.length === 0 ? (
          <p className="text-zinc-500 font-mono">No recent activity detected on the network.</p>
        ) : (
          userPosts.map(post => <FeedItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
