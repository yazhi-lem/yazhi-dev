"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  from: "user" | "agent";
  lang: string;
  text: string;
  translationEn: string;
  time: string;
  tool?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    from: "user",
    lang: "TA",
    text: "என் பாட்டி சொன்ன முல்லை நிலக் கதையைத் தேடு",
    translationEn: "Find the Mullai landscape story my grandmother told",
    time: "11:10 AM",
  },
  {
    id: "msg-2",
    from: "agent",
    lang: "TA",
    text: "சங்க இலக்கியத் தொகுப்பில் தேடுகிறேன்… 3 கதைகள் கிடைத்தன 📖",
    translationEn: "Searching the Sangam corpus… found 3 authentic stories",
    time: "11:10 AM",
    tool: "sangam_corpus",
  },
  {
    id: "msg-3",
    from: "user",
    lang: "TA",
    text: "அதில் ஒரு அழகிய சிறுகதையைச் சொல்",
    translationEn: "Tell me a short story from it",
    time: "11:11 AM",
  },
  {
    id: "msg-4",
    from: "agent",
    lang: "TA",
    text: "முல்லைக் காட்டில் மாலை நேரத்தில் ஒரு யாழி தன் குட்டியுடன் அமைதியாக நீர் அருந்த வந்தது… 🌿",
    translationEn: "In the Mullai forest at dusk, a Yazhi and its cub walked gently to the river…",
    time: "11:11 AM",
    tool: "adhan_v1",
  },
];

interface QuickPrompt {
  labelTa: string;
  labelEn: string;
  userTa: string;
  userEn: string;
  replyTa: string;
  replyEn: string;
  tool: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    labelTa: "கதை சொல் 📖",
    labelEn: "Tell Story 📖",
    userTa: "ஒரு புதிய சங்க சிறுகதை சொல்",
    userEn: "Tell me a fresh Sangam story",
    replyTa: "குறிஞ்சி மலையில் வேங்கை மரம் பூத்துக் குலுங்கிய நன்னாளில் ஒரு வீரன் தன் துணையைக் கண்டான்… ✨",
    replyEn: "On the Kurinji hills where the Vengai bloomed, a warrior met his beloved… ✨",
    tool: "story_engine",
  },
  {
    labelTa: "திருக்குறள் 📜",
    labelEn: "Thirukkural 📜",
    userTa: "அன்பு பற்றி ஒரு குறள் சொல்",
    userEn: "Share a Kural couplet on love",
    replyTa: "அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார்\nஎன்பும் உரியர் பிறர்க்கு. (குறள் 72)",
    replyEn: "Those without love want everything for themselves; the loving give even their bones for others. (Kural 72)",
    tool: "kural_db",
  },
  {
    labelTa: "மொழி மாதிரி 🌾",
    labelEn: "Indic Model 🌾",
    userTa: "அதன் மாதிரி பற்றிச் சொல்",
    userEn: "Tell me about the Adhan model",
    replyTa: "அதன் என்பது இந்திய மொழிகளுக்கான திறந்த அடிப்படை மாதிரி. 📜",
    replyEn: "Adhan is our open Indic foundation model, trained natively across 22+ scripts. 📜",
    tool: "indic_corpus",
  },
  {
    labelTa: "யாழி யார்? ✨",
    labelEn: "Who is Yazhi? ✨",
    userTa: "யாழி என்றால் என்ன?",
    userEn: "What is Yazhi?",
    replyTa: "நான் இந்திய இறையாண்மை மொழி மாதிரி. பண்பாட்டு நினைவகம். 🏛️",
    replyEn: "I am a sovereign Indian Indic intelligence initiative preserving cultural memory. 🏛️",
    tool: "sovereign_ai",
  },
];

export function InteractiveDevice() {
  const { lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(11); // Live timer starting at 11s (11:11 vibe)
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Voice timer live counter
  useEffect(() => {
    if (activeTab !== "voice") return;
    const interval = setInterval(() => {
      setVoiceSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSendMessage = (prompt?: QuickPrompt) => {
    const textToSend = prompt
      ? lang === "en" ? prompt.userEn : prompt.userTa
      : inputText.trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      lang: "TA",
      text: prompt ? prompt.userTa : textToSend,
      translationEn: prompt ? prompt.userEn : textToSend,
      time: "11:11 AM",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Realistic live agent response delay
    setTimeout(() => {
      let replyText = "உங்கள் கேள்வியைப் பெற்றேன். அதற்கான விளக்கத்தை தமிழ் மரபின்படி தொகுக்கிறேன்… ✨";
      let replyEn = "Received your query. Compiling insights according to Tamil tradition…";
      let toolName = "adhan_v1";

      if (prompt) {
        replyText = prompt.replyTa;
        replyEn = prompt.replyEn;
        toolName = prompt.tool;
      } else if (textToSend.includes("வணக்கம்") || textToSend.toLowerCase().includes("hello") || textToSend.toLowerCase().includes("hi")) {
        replyText = "வணக்கம்! நான் யாழி. உங்கள் தாய்மொழியில் எதை அறிய விரும்புகிறீர்கள்?";
        replyEn = "Greetings! I am Yazhi. What would you like to explore in your language?";
      } else if (textToSend.includes("குறள்") || textToSend.toLowerCase().includes("kural")) {
        replyText = "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு. (குறள் 1)";
        replyEn = "'A' is the beginning of all letters, so is God the beginning of the universe.";
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        from: "agent",
        lang: "TA",
        text: replyText,
        translationEn: replyEn,
        time: "11:11 AM",
        tool: toolName,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 850);
  };


  const formatVoiceTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[285px] sm:max-w-[305px] md:max-w-[315px] select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient background glow behind device */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[64px] opacity-35 blur-3xl transition-opacity duration-700"
        style={{
          background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      {/* Hardware Buttons on Outer Frame (iPhone 17 Pro Layout) */}
      {/* Left side: Action Button & Volume Rockers */}
      <div aria-hidden className="absolute -left-[3px] top-20 h-6 w-[3px] rounded-l-xs bg-[#4a4a52] opacity-80" />
      <div aria-hidden className="absolute -left-[3px] top-30 h-11 w-[3px] rounded-l-xs bg-[#4a4a52] opacity-80" />
      <div aria-hidden className="absolute -left-[3px] top-44 h-11 w-[3px] rounded-l-xs bg-[#4a4a52] opacity-80" />
      {/* Right side: Power Button & iPhone Camera Control Button */}
      <div aria-hidden className="absolute -right-[3px] top-28 h-15 w-[3px] rounded-r-xs bg-[#4a4a52] opacity-80" />
      <div aria-hidden className="absolute -right-[2.5px] bottom-24 h-13 w-[2.5px] rounded-r-xs bg-[#3a3a42] opacity-90 ring-1 ring-white/10" title="Camera Control" />

      {/* Outer Titanium Chassis Frame (iPhone 17 Pro Ultra-thin BRS Bezel) */}
      <motion.div
        whileHover={{ rotateY: -2, rotateX: 1.5, scale: 1.01 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[52px] border border-white/20 bg-gradient-to-b from-[#2f2f34] via-[#18181b] to-[#0c0c0e] p-[7.5px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.12)]"
      >
        {/* Chassis inner bezel highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[51px] border border-white/[0.08]"
        />

        {/* Screen OLED Surface: Authentic iPhone 17 Pro 19.5:9 Aspect Ratio */}
        <div
          className="relative flex w-full flex-col overflow-hidden rounded-[45px] bg-gradient-to-b from-[#0b0c10] via-[#08080a] to-[#050507] aspect-[9/19.5] shadow-inner"
          style={{ aspectRatio: "9 / 19.5" }}
        >
          {/* Subtle curved diagonal screen sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 h-52 w-72 rotate-12 bg-gradient-to-br from-white/[0.06] via-white/[0.015] to-transparent"
          />

          {/* Top Status Bar & Dynamic Island */}
          <div className="relative z-30 flex items-center justify-between px-5 pt-3 shrink-0">
            {/* Clock: Mark timing as 11:11 */}
            <span className="font-mono text-[11px] font-semibold tracking-tight text-ivory">
              11:11
            </span>

            {/* Dynamic Island pill */}
            <div className="flex h-[21px] w-[94px] items-center justify-between rounded-full bg-black px-2 shadow-inner border border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#181822] shadow-sm ring-1 ring-white/10" />
                {activeTab === "voice" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="h-2 w-2 rounded-full bg-[#142032] ring-1 ring-white/10" />
            </div>

            {/* Network, 5G & Battery status */}
            <div className="flex items-center gap-1.5 text-ivory/80">
              <span className="font-mono text-[9px] font-semibold text-ivory/70">5G</span>
              <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.5c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.25 19.67 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
              </svg>
              <div className="flex h-2.5 w-5 items-center rounded-[3px] border border-ivory/60 px-0.5">
                <div className="h-1.5 w-full rounded-2xs bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* In-App Header */}
          <div className="relative z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#111216]/90 px-3.5 py-2.5 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gold/50 bg-night-2 shadow-sm">
                <Image
                  src="/images/mascot/yazhidp.png"
                  alt="Yazhi DP"
                  width={32}
                  height={32}
                  priority
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
              </div>
              <div>
                <p className="font-display text-xs font-semibold tracking-wide text-ivory">
                  {lang === "en" ? "Yazhi AI" : lang === "ta" ? "யாழி" : "யாழி · Yazhi AI"}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-ivory-dim/75 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                  {lang === "en" ? "Online · 11:11 AM" : lang === "ta" ? "இணைப்பில் உள்ளது · 11:11" : "இணைப்பில் உள்ளது · 11:11 AM"}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-full border border-white/10 bg-black/50 p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                  activeTab === "chat"
                    ? "bg-[color:var(--accent)]/30 text-ivory font-semibold ring-1 ring-[color:var(--accent)]/50"
                    : "text-ivory-dim/60 hover:text-ivory"
                }`}
              >
                {lang === "en" ? "Chat" : "உரையாடல்"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("voice")}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                  activeTab === "voice"
                    ? "bg-[color:var(--accent)]/30 text-ivory font-semibold ring-1 ring-[color:var(--accent)]/50"
                    : "text-ivory-dim/60 hover:text-ivory"
                }`}
              >
                {lang === "en" ? "Voice" : "குரல்"}
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          {activeTab === "chat" ? (
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Messages Viewport */}
              <div
                ref={chatScrollRef}
                data-lenis-prevent
                className="chat-scroll flex-1 min-h-0 space-y-2.5 overflow-y-auto px-3.5 py-3"
              >
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                        m.from === "user"
                          ? "rounded-tr-xs bg-[color:var(--accent)]/25 text-ivory border border-[color:var(--accent)]/35"
                          : "rounded-tl-xs bg-white/[0.07] text-ivory border border-white/[0.09]"
                      }`}
                    >
                      <p className="leading-relaxed font-sans">
                        {lang === "en" ? m.translationEn : m.text}
                      </p>
                      {lang === "both" && m.translationEn && (
                        <p className="mt-1 text-[10px] leading-snug text-ivory-dim/75 italic">
                          {m.translationEn}
                        </p>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 px-1 font-mono text-[9px] text-ivory-dim/60">
                      <span>{m.time}</span>
                      {m.from === "user" && (
                        <span className="text-[color:var(--accent)] font-semibold">✓✓</span>
                      )}
                      {m.tool && (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.2 text-[8px] text-gold/85">
                          {m.tool}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Live Typing Status */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs bg-white/[0.06] border border-white/[0.08] px-3.5 py-2">
                      <span className="text-[10px] text-ivory-dim/80 font-mono">
                        {lang === "en" ? "Yazhi is thinking" : "யாழி யோசிக்கிறது"}
                      </span>
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1 w-1 animate-bounce rounded-full bg-[color:var(--accent)]"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Prompts Bar */}
              <div className="shrink-0 border-t border-white/[0.06] bg-[#0c0d10]/95 px-3 py-1.5">
                <div
                  className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.labelTa}
                      type="button"
                      onClick={() => handleSendMessage(qp)}
                      className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-ivory-dim transition-colors hover:border-gold/50 hover:bg-gold/10 hover:text-ivory active:scale-95"
                    >
                      {lang === "en" ? qp.labelEn : qp.labelTa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real Working Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="shrink-0 flex items-center gap-2 border-t border-white/[0.08] bg-[#0f1014] px-3 py-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    lang === "en"
                      ? "Ask Yazhi anything…"
                      : lang === "ta"
                      ? "யாழியிடம் கேளுங்கள்…"
                      : "யாழியிடம் கேளுங்கள்… Ask anything"
                  }
                  className="flex-1 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 text-xs text-ivory placeholder:text-ivory-dim/40 focus:border-[color:var(--accent)]/60 focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]/40"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  aria-label="Send message"
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    inputText.trim() && !isTyping
                      ? "bg-[color:var(--accent)] text-ivory shadow-md scale-105"
                      : "bg-white/10 text-ivory-dim/40 cursor-not-allowed"
                  }`}
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            /* Voice Mode Viewport (Living Sovereign Audio Interface) */
            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-between p-4 text-center overflow-y-auto">
              {/* Call Active Timer */}
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono text-ivory">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {lang === "en" ? "Voice Call" : "குரல் உரையாடல்"} · {formatVoiceTime(voiceSeconds)}
                </span>
              </div>

              {/* Animated Mascot Pedestal */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 0.98, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/60 bg-night-2 shadow-2xl overflow-hidden p-1"
                >
                  <Image
                    src="/images/mascot/yazhidp.png"
                    alt="Yazhi Voice Avatar"
                    width={96}
                    height={96}
                    priority
                    className="h-full w-full rounded-full object-cover drop-shadow-[0_4px_16px_rgba(211,179,106,0.3)]"
                  />
                  <span className="absolute -inset-3 rounded-full border border-[color:var(--accent)]/40 animate-ping opacity-50 pointer-events-none" />
                </motion.div>

                <p className="mt-3 font-display text-sm font-semibold text-ivory">
                  {lang === "en" ? "Listening… Speak now" : "கேட்கிறேன்… பேசுங்கள்"}
                </p>
                <p className="mt-0.5 text-[10px] text-ivory-dim/75 font-sans">
                  {lang === "en"
                    ? "Listening in English, Indic languages…"
                    : "தமிழ், தெலுங்கு, இந்தி மொழிகளில் கேட்கிறது…"}
                </p>

                {/* Animated Waveform Visualizer */}
                <div className="mt-3 flex h-8 items-center gap-1">
                  {[10, 22, 16, 28, 22, 30, 18, 24, 12, 18].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [8, h, 6] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7 + (i % 4) * 0.15,
                        ease: "easeInOut",
                      }}
                      className="w-1 rounded-full bg-[color:var(--accent)]/85"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Transcript Bubble */}
              <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 text-left">
                <div className="flex items-center justify-between text-[10px] font-mono text-gold/80">
                  <span>{lang === "en" ? "Live Transcript" : "நேரலை டிரான்ஸ்கிரிப்ஷன்"}</span>
                  <span>11:11 AM</span>
                </div>
                <p className="mt-1 text-xs text-ivory leading-snug">
                  {lang === "en"
                    ? '"Tell me about the twilight hours of the Mullai forest…"'
                    : '"முல்லை நிலத்தின் மாலைப் பொழுதைப் பற்றி சொல்லுங்கள்…"'}
                </p>
              </div>

              {/* End / Switch back to Chat */}
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 text-xs text-ivory-dim hover:text-ivory transition-colors"
              >
                <span>
                  {lang === "en"
                    ? "Return to Chat"
                    : lang === "ta"
                    ? "உரையாடலுக்குத் திரும்பு"
                    : "உரையாடலுக்குத் திரும்பு (Chat)"}
                </span>
              </button>
            </div>
          )}

          {/* Bottom Home Indicator Bar */}
          <div className="shrink-0 flex justify-center pb-2 pt-1">
            <div className="h-1 w-28 rounded-full bg-white/25" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
