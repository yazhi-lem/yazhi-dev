"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_FEED } from "@/data/mockFeed";
import { useUser } from "@/lib/users";

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const user = useUser(params.id);

  if (user === undefined) return null;

  if (!user) {
    return <div className="p-20 text-white text-center font-mono">User not found in regional nodes.</div>;
  }

  const userPosts = MOCK_FEED.filter((p) => p.authorId === user.id);

  return (
    <div className="max-w-4xl mx-auto px-6 mt-12 mb-20">
      <Link href="/" className="text-zinc-500 hover:text-white font-mono text-sm mb-8 inline-block transition-colors">
        ← Back to Network
      </Link>

      <div className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-zinc-900 bg-zinc-800 object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tighter">{user.name}</h1>
              <span className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                {user.role}
              </span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-sm text-zinc-400 mb-4">
              <span>{user.handle}</span>
              <span>•</span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> {user.city} Node
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed max-w-2xl">
              {user.bio || "No bio yet — this node hasn't configured their profile."}
            </p>
            {user.techStack && (
              <p className="text-zinc-500 font-mono text-sm mt-3">Stack: {user.techStack}</p>
            )}
          </div>

          <div className="flex flex-col space-y-3 w-full md:w-auto">
            <button className="bg-white text-black font-bold py-2 px-6 hover:bg-zinc-200 transition-colors">
              Connect ⅄
            </button>
            {user.github && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-center font-mono text-sm text-zinc-400 border border-zinc-800 py-2 hover:text-white hover:border-zinc-600 transition-colors"
              >
                github.com/{user.github}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Recent Activity</h3>
        {userPosts.length === 0 ? (
          <p className="text-zinc-500 font-mono">No recent activity detected on the network.</p>
        ) : (
          userPosts.map((post) => (
            <div key={post.id} className="bg-zinc-950 border border-zinc-800 p-6">
              <h4 className="text-white font-bold mb-2">{post.title}</h4>
              <p className="text-zinc-400 text-sm">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
