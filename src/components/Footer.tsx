"use client";

import { motion } from "framer-motion";

export default function Footer() {
  // ஐந்திணை - Five Landscapes of Sangam Literature
  const thinai = [
    { tamil: "குறிஞ்சி", eng: "Kurinji", desc: "Mountains • Union", icon: "🏔️" },
    { tamil: "முல்லை", eng: "Mullai", desc: "Forests • Waiting", icon: "🌳" },
    { tamil: "மருதம்", eng: "Marutham", desc: "Agriculture • Quarrel", icon: "🌾" },
    { tamil: "நெய்தல்", eng: "Neytal", desc: "Coastal • Separation", icon: "🌊" },
    { tamil: "பாலை", eng: "Palai", desc: "Desert • Elopement", icon: "🏜️" },
  ];

  const links = [
    {
      section: "திட்டங்கள்",
      sectionEng: "Projects",
      items: [
        { tamil: "அதன்", eng: "Adhan", href: "#adhan" },
        { tamil: "சங்கம்", eng: "Sangam", href: "#sangam" },
        { tamil: "யாழ்", eng: "Yazh", href: "#yazh" },
      ],
    },
    {
      section: "சேவைகள்",
      sectionEng: "Services",
      items: [
        { tamil: "முகவர்கள்", eng: "Agents", href: "#" },
        { tamil: "செயலிகள்", eng: "Applications", href: "#" },
        { tamil: "விளக்கங்கள்", eng: "Annotations", href: "#" },
      ],
    },
    {
      section: "சமூகம்",
      sectionEng: "Community",
      items: [
        { tamil: "Discord", eng: "Discord", href: "https://discord.gg/yazhi" },
        { tamil: "GitHub", eng: "GitHub", href: "https://github.com/yazhi-lem" },
      ],
    },
  ];

  return (
    <footer
      className="relative py-16 px-6 overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* ஐந்திணை - Five Landscapes */}
      <div className="relative z-10 max-w-7xl mx-auto mb-16">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="tamil-title text-5xl text-center mb-4"
          style={{ color: 'var(--text)' }}
        >
          ஐந்திணை
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-lg mb-12 font-semibold"
          style={{ color: 'var(--text-soft)' }}
        >
          Five Landscapes of Sangam Poetry
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {thinai.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-lg text-center transition-all hover:scale-105"
              style={{ background: 'var(--bg)' }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="tamil-body text-2xl mb-1" style={{ color: 'var(--text)' }}>
                {item.tamil}
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--accent)' }}>
                {item.eng}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-soft)' }}>
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Links & Info */}
      <div className="relative z-10 max-w-7xl mx-auto border-t pt-12 mb-12" style={{ borderColor: 'var(--accent)', opacity: 0.2 }}>
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Yazhi Logo */}
          <div>
            <svg width="80" height="80" viewBox="0 0 120 120" className="mb-4">
              <circle cx="60" cy="35" r="15" fill="var(--accent)" />
              <circle cx="35" cy="75" r="15" fill="var(--accent)" />
              <circle cx="85" cy="75" r="15" fill="var(--accent)" />
              <line x1="60" y1="35" x2="35" y2="75" stroke="var(--accent)" strokeWidth="4" />
              <line x1="60" y1="35" x2="85" y2="75" stroke="var(--accent)" strokeWidth="4" />
              <line x1="35" y1="75" x2="85" y2="75" stroke="var(--accent)" strokeWidth="4" />
            </svg>
            <h3 className="tamil-title text-3xl mb-2" style={{ color: 'var(--text)' }}>
              யாழி
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
              தமிழ் செயற்கை நுண்ணறிவு
              <br />
              Tamil AI Ecosystem
            </p>
          </div>

          {/* Links */}
          {links.map((section, i) => (
            <div key={i}>
              <h4 className="tamil-body text-xl mb-2" style={{ color: 'var(--text)' }}>
                {section.section}
              </h4>
              <p className="text-xs font-bold mb-4" style={{ color: 'var(--accent)' }}>
                {section.sectionEng}
              </p>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-soft)' }}
                    >
                      {item.tamil} • {item.eng}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t" style={{ borderColor: 'var(--accent)', opacity: 0.2 }}>
          <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
            © 2025 யாழி • Yazhi. இறையாண்மை செயற்கை நுண்ணறிவு • Sovereign AI
          </p>

          {/* Indian Gradient Sphere */}
          <motion.svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <radialGradient id="footerIndianSphere" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="70%" stopColor="#138808" stopOpacity="1" />
                <stop offset="100%" stopColor="#000080" stopOpacity="0.8" />
              </radialGradient>
            </defs>
            <circle cx="35" cy="35" r="32" fill="url(#footerIndianSphere)" opacity="0.9" />
            <circle cx="35" cy="35" r="32" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />
          </motion.svg>
        </div>
      </div>
    </footer>
  );
}
