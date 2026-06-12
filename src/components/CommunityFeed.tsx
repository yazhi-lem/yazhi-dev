"use client";

import React from "react";
import { motion } from "framer-motion";

const ACTIVITIES = [
  {
    id: 1,
    user: "zrya",
    action: "pushed a new update to",
    target: "adhan-core",
    timestamp: "2 hours ago",
    content: "Integrated new Tamil dataset for SLM fine-tuning. Loss down to 1.8.",
    tags: ["SLM", "Tamil", "Adhan"],
  },
  {
    id: 2,
    user: "yazhi_lem",
    action: "started a discussion on",
    target: "Sovereign Proofs",
    timestamp: "5 hours ago",
    content: "How do we ensure script integrity in decentralized archives without overhead?",
    tags: ["Security", "Decentralization"],
  },
  {
    id: 3,
    user: "thenmadurai_dev",
    action: "released version 0.4 of",
    target: "kumari-kandam-ui",
    timestamp: "1 day ago",
    content: "New glassmorphism components inspired by ancient Dravidian geometry.",
    tags: ["UI", "Next.js"],
  },
  {
    id: 4,
    user: "agent_null",
    action: "automated a deploy for",
    target: "yazhi-nodes",
    timestamp: "2 days ago",
    content: "Scaling up native inference nodes across 40+ districts.",
    tags: ["Infrastructure", "Scaling"],
  },
];

export default function CommunityFeed() {
  return (
    <section id="feed" className="py-16 px-6 md:px-20 bg-night-soil/10 border-y border-palm-parchment/5">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-dm-serif mb-1">Dev Log</h2>
            <p className="text-[10px] opacity-50 uppercase tracking-widest text-palm-parchment">Recent collective activity</p>
          </div>
          <button className="text-[10px] text-turmeric border-b border-turmeric/30 pb-0.5 hover:border-turmeric transition-all font-bold uppercase tracking-widest">
            View All
          </button>
        </div>
 
        <div className="space-y-3">
          {ACTIVITIES.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-palm-parchment/5 border border-palm-parchment/5 hover:border-turmeric/30 transition-all rounded-sm group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-turmeric">{activity.user}</span>
                  <span className="opacity-50">{activity.action}</span>
                  <span className="font-semibold text-palm-parchment underline decoration-turmeric/20 underline-offset-4">{activity.target}</span>
                </div>
                <span className="text-[9px] opacity-30 uppercase tracking-tighter">{activity.timestamp}</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed mb-3">
                {activity.content}
              </p>
              <div className="flex gap-2">
                {activity.tags.map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-palm-parchment/10 rounded-full opacity-40 group-hover:opacity-60 transition-opacity">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
