"use client";
import { useLang } from "@/lib/i18n";
import type { BiString } from "@/lib/chat/types";

/** Every string the chat UI shows, in one place for native review.
    TAMIL IS A DRAFT pending native-speaker review (Aram review gate). */
export const S = {
  app: { ta: "யாழி உரையாடல்", en: "Yazhi Chat" },
  newChat: { ta: "புதிய உரையாடல்", en: "New conversation" },
  conversations: { ta: "உரையாடல்கள்", en: "Conversations" },
  hideConversations: { ta: "உரையாடல்களை மறை", en: "Hide conversations" },
  showConversations: { ta: "உரையாடல்களைக் காட்டு", en: "Show conversations" },
  searchConversations: { ta: "உரையாடல்களில் தேடு", en: "Search conversations" },
  noConversations: { ta: "இன்னும் உரையாடல் இல்லை.", en: "No conversations yet." },
  noMatches: { ta: "பொருத்தம் இல்லை.", en: "Nothing matches." },
  delete: { ta: "நீக்கு", en: "Delete" },
  confirmDelete: { ta: "நீக்கவா?", en: "Delete this conversation?" },
  keep: { ta: "வேண்டாம்", en: "Keep" },
  agents: { ta: "முகவர்கள்", en: "Agents" },
  chooseAgent: { ta: "யாரிடம் கேட்கலாம்?", en: "Who would you like to ask?" },
  chooseAgentLede: {
    ta: "ஒவ்வொரு முகவருக்கும் ஒரு வேலை, ஒரு விதி. கேட்கும் முன் இரண்டையும் பாருங்கள்.",
    en: "Each agent has one job and one rule. Both are shown before you ask.",
  },
  start: { ta: "தொடங்கு", en: "Start" },
  tryAsking: { ta: "இப்படிக் கேட்கலாம்", en: "Try asking" },
  rule: { ta: "விதி", en: "Rule" },
  message: { ta: "செய்தி", en: "Message" },
  messageTo: { ta: "இவரிடம் கேளுங்கள்:", en: "Message" },
  send: { ta: "அனுப்பு", en: "Send" },
  stop: { ta: "காத்திருப்பதை நிறுத்து", en: "Stop waiting" },
  hint: { ta: "Enter அனுப்பும் · Shift+Enter புதிய வரி", en: "Enter to send · Shift+Enter for a new line" },
  thinking: { ta: "பதில் தேடுகிறது…", en: "is looking for an answer…" },
  replied: { ta: "பதில் வந்தது", en: "replied" },
  stopped: { ta: "நிறுத்தப்பட்டது.", en: "Stopped." },
  you: { ta: "நீங்கள்", en: "You" },
  copy: { ta: "நகலெடு", en: "Copy" },
  copied: { ta: "நகலெடுத்தது.", en: "Copied." },
  retry: { ta: "மீண்டும் முயல்", en: "Try again" },
  menu: { ta: "யாழி பட்டி", en: "Yazhi menu" },
  theme: { ta: "தோற்றம்", en: "Theme" },
  language: { ta: "மொழி", en: "Language" },
  about: { ta: "இந்த உரையாடல் பற்றி", en: "About this chat" },
  home: { ta: "யாழி முகப்பு", en: "Yazhi home" },
  close: { ta: "மூடு", en: "Close" },
  skipToComposer: { ta: "செய்திப் பெட்டிக்குச் செல்", en: "Skip to message box" },
  sovereign: { ta: "தற்சார்பு", en: "Sovereign" },
  paused: { ta: "நிறுத்தப்பட்டுள்ளது", en: "Paused" },
  notConnected: { ta: "இணைக்கப்படவில்லை", en: "Not connected" },
  checking: { ta: "சரிபார்க்கிறது", en: "Checking" },
  keptHere: {
    ta: "உரையாடல்கள் இந்த உலாவியில் மட்டுமே இருக்கும்.",
    en: "Conversations are kept only in this browser.",
  },
  tamilDraft: {
    ta: "இந்த இடைமுகத்தின் தமிழ் உரை வரைவு — தமிழறிஞர் மதிப்பாய்வு நிலுவையில்.",
    en: "The Tamil text in this interface is a draft awaiting native-speaker review.",
  },
} satisfies Record<string, BiString>;

/** Plain-string form for attributes and announcements: Tamil in TAM
    mode, English otherwise (BOTH shows both visibly via <T>, but a
    screen reader gets one language, not two). */
export function useBi() {
  const { lang } = useLang();
  return (t: BiString) => (lang === "ta" ? t.ta : t.en);
}
