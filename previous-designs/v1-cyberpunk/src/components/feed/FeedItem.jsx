import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../../data/mockFeed';

export default function FeedItem({ post }) {
  const author = MOCK_USERS.find(u => u.id === post.authorId);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-600 transition-colors cursor-pointer group">
      <div className="flex items-start space-x-4">
        <Link to={`/profile/${author?.id}`}>
          <img src={author?.avatar} alt={author?.name} className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-800 hover:ring-2 ring-primary transition-all" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${author?.id}`} className="font-bold text-white group-hover:text-primary transition-colors hover:underline">
                {author?.name}
              </Link>
              <span className="text-sm text-zinc-500">{author?.handle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{author?.role}</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">{post.timestamp}</span>
          </div>
          
          <h3 className="text-xl font-bold text-zinc-100 mt-2 mb-3">{post.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{post.content}</p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-zinc-500 font-mono">
              <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                <span>▲</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-white transition-colors">
                <span>💬</span>
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
