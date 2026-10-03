/* ============================================================
   HOME COPY — single source of truth. Tamil first.

   The home page says four things, briefly: what Yazhi is, where it is
   going by 2030, the three paths its services take, and an invitation.
   Project detail lives on each project's own page, not here.

   Voice comes from the founder's Yazhi 2030 note: அத்துணை மொழிகள்,
   அத்துணை துறைகள், பொதுப் பணி, உலகத் தரம், சரியான பெருமை;
   குடும்பம் · தொழில் · சமூகம்.

   - Tamil is written first and natively; English is the gloss.
   - One register: standard written Tamil; button CTAs in the -க form.
   - "Sovereign" = தற்சார்பு. Latin names take hyphenated case endings
     (Discord-இல்).
   - The vision is stated as intent (-ப்போம், "we will"), never as done;
     Yazh says plainly that it is coming and needs a parent's consent
     (Aram rules 4, 5).
   - TAMIL IS A DRAFT until a native-speaker review signs it off.
   ============================================================ */

import type { Tone } from "@/bubble/tone";

export type ThinaiKey = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";

/** Thinai that tint the page as each section scrolls into view
    (ThinaiTheme). Vision — kurinji, new beginnings; paths — marutham,
    everyday work; community — mullai, patience and loyalty. */
export const THINAI: { key: ThinaiKey; ta: string; en: string; section: string }[] = [
  { key: "kurinji", ta: "குறிஞ்சி", en: "Kurinji", section: "vision" },
  { key: "marutham", ta: "மருதம்", en: "Marutham", section: "paths" },
  { key: "mullai", ta: "முல்லை", en: "Mullai", section: "community" },
];

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  footerTa: "தற்சார்புச் செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  copyright: "© 2026 யாழி • Yazhi",
};

export const HERO = {
  eyebrowTa: "யாழி 2030",
  eyebrowEn: "Yazhi 2030",
  titleTa: "இந்தியாவின் அத்துணை மொழிகளுக்குமான செயற்கை நுண்ணறிவுத் தளம்",
  titleEn: "An AI platform for every language of India",
  leadTa: "தமிழில் தொடங்குகிறோம்.",
  leadEn: "We begin with Tamil.",
  primaryTa: "எங்களுடன் சேருக",
  primaryEn: "Join us",
  primaryHref: "/onboarding",
  secondaryTa: "யாழியுடன் உரையாடுக",
  secondaryEn: "Talk to Yazhi",
  secondaryHref: "/chat",
};

/** Yazhi 2030 — three lines and a promise. */
export const VISION = {
  titleTa: "2030-க்குள்",
  titleEn: "By 2030",
  lines: [
    {
      headTa: "அத்துணை மொழிகளுக்கும்",
      headEn: "Every language",
      bodyTa: "தமிழில் தொடங்கி, இந்தியாவின் ஒவ்வொரு மொழிக்கும் அதற்கே உரிய செயற்கை நுண்ணறிவு.",
      bodyEn: "Starting with Tamil — AI that belongs to each of India's languages.",
    },
    {
      headTa: "அத்துணை துறைகளுக்கும்",
      headEn: "Every field",
      bodyTa: "கல்வி முதல் தொழில் வரை, யாழியை எல்லாத் துறைகளுக்கும் கொண்டு சேர்ப்போம்.",
      bodyEn: "From the classroom to industry — we'll carry Yazhi into every field.",
    },
    {
      headTa: "பொதுப் பணியாக, உலகத் தரத்தில்",
      headEn: "Public work, world standard",
      bodyTa: "தற்சார்புத் தொழில்நுட்பமாக, பொதுநலனுக்காக, உலகத் தரத்தில் கட்டமைப்போம்.",
      bodyEn: "Sovereign technology, built for the common good, to a world standard.",
    },
  ],
  closeTa: "சரியான பெருமையை ஈட்டுவோம்.",
  closeEn: "And earn the pride it deserves.",
};

/** Yazhi's services, along the three paths in the note. One line each. */
export const PATHS = {
  eyebrowTa: "யாழியின் சேவைகள்",
  eyebrowEn: "Yazhi's services",
  titleTa: "குடும்பம், தொழில், சமூகம்",
  titleEn: "Families, work, society",
  items: [
    {
      key: "family",
      tone: "neytal" as Tone,
      headTa: "குடும்பம்", headEn: "Families",
      nameTa: "யாழ்", nameEn: "Yazh",
      bodyTa: "குழந்தைகள் தாய்மொழியில் பேசிக் கற்கும் செல்லப்பிராணி. பெற்றோர் ஒப்புதலுடன் மட்டுமே.",
      bodyEn: "A learning pet children talk to in their mother tongue. Only with a parent's consent.",
      statusTa: "விரைவில்", statusEn: "Coming soon",
      ctaTa: "ஆர்வத்தைப் பதிவு செய்க", ctaEn: "Register interest", href: "/onboarding", external: false,
    },
    {
      key: "work",
      tone: "palai" as Tone,
      headTa: "தொழில்", headEn: "Work",
      nameTa: "ஆதன் · முகவர்கள்", nameEn: "Adhan · agents",
      bodyTa: "எங்கள் சொந்த மொழி மாதிரியான ஆதன் மேல், கல்விக்கும் தொழிலுக்கும் தமிழில் உதவும் முகவர்களை உருவாக்குகிறோம்.",
      bodyEn: "Agents we're building on Adhan, our own language model, to help with learning and work in Tamil.",
      statusTa: "உருவாக்கத்தில்", statusEn: "In the making",
      ctaTa: "முகவர்களுடன் உரையாடுக", ctaEn: "Talk to the agents", href: "/chat", external: false,
    },
    {
      key: "society",
      tone: "marutham" as Tone,
      headTa: "சமூகம்", headEn: "Society",
      nameTa: "Open Sangam", nameEn: "Open Sangam",
      bodyTa: "சங்க இலக்கியம் அனைவருக்கும் திறந்திருக்கும் — மாணவர்களுக்கும் ஆசிரியர்களுக்கும் கட்டணமில்லை.",
      bodyEn: "Sangam literature, open to everyone — free for students and teachers.",
      statusTa: "திறந்த தளம்", statusEn: "Open platform",
      ctaTa: "சங்கத்தைக் காண்க", ctaEn: "Visit Open Sangam", href: "https://sangam.yazhi.dev", external: true,
    },
  ],
};

export const LINKS = {
  discord: "https://discord.gg/yazhi",
  github: "https://github.com/yazhi-lem",
  sangam: "https://sangam.yazhi.dev",
  whatsapp: "https://chat.whatsapp.com/G0sWRof4Z4cFXXY6Gmavmu",
  onboarding: "/onboarding",
};

/** The invitation. */
export const JOIN = {
  titleTa: "சேர்ந்து உருவாக்குவோம்",
  titleEn: "Build it with us",
  bodyTa: "யாழி ஒரு கூட்டு முயற்சி. தமிழையும் தொழில்நுட்பத்தையும் நேசிக்கும் எவரும் சேரலாம்.",
  bodyEn: "Yazhi is a collective. Anyone who loves Tamil and technology is welcome.",
  ctas: [
    { ta: "எங்களுடன் சேருக", en: "Join us", href: "/onboarding", external: false, primary: true },
    { ta: "Discord-இல் சேருக", en: "Join the Discord", href: LINKS.discord, external: true, primary: false },
    { ta: "GitHub-இல் காண்க", en: "See it on GitHub", href: LINKS.github, external: true, primary: false },
  ],
  ageTa: "WhatsApp, Discord உரையாடல்கள் 13 வயது நிரம்பியவர்களுக்கு மட்டும் — சிறுவர்கள் பெற்றோருடன் சேருக.",
  ageEn: "WhatsApp and Discord are for ages 13 and up — kids, join with a parent.",
};

/** Top bar links (in-page) and the grouped menu used by the mobile nav
    and the footer columns. */
export const NAV_TOP = [
  { ta: "யாழி 2030", en: "Yazhi 2030", href: "#vision" },
  { ta: "சேவைகள்", en: "Services", href: "#paths" },
  { ta: "மன்றம்", en: "Community", href: "#community" },
];

export const NAV_GROUPS = [
  {
    ta: "யாழி", en: "Yazhi",
    items: [
      { ta: "யாழி 2030", en: "Yazhi 2030", href: "/#vision" },
      { ta: "சேவைகள்", en: "Services", href: "/#paths" },
      { ta: "உரையாடல்", en: "Chat", href: "/chat" },
    ],
  },
  {
    ta: "மன்றம்", en: "Community",
    items: [
      { ta: "எங்களுடன் சேருக", en: "Join us", href: "/onboarding" },
      { ta: "Discord", en: "Discord", href: LINKS.discord },
      { ta: "GitHub", en: "GitHub", href: LINKS.github },
    ],
  },
  {
    ta: "மேலும்", en: "More",
    items: [
      { ta: "Open Sangam", en: "Open Sangam", href: LINKS.sangam },
      { ta: "எங்களைப் பற்றி", en: "About", href: "/about" },
      { ta: "தனியுரிமை", en: "Privacy", href: "/privacy" },
    ],
  },
];

export const UI = {
  chat: { ta: "உரையாடல்", en: "Chat" },
  scrollCue: { ta: "கீழே காண்க", en: "Scroll" },
};

/** Script samples for the 3D glyph field behind the page. */
export const SCRIPTS: { name: string; glyphs: string[] }[] = [
  { name: "Tamil", glyphs: "அ ஆ இ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன".split(" ") },
  { name: "Devanagari", glyphs: "अ आ इ क ख ग च ज ट ड त द न प ब म य र ल व".split(" ") },
  { name: "Bengali", glyphs: "অ আ ই ক খ গ চ জ ট ড ত দ ন প ব ম য র ল".split(" ") },
  { name: "Telugu", glyphs: "అ ఆ ఇ క గ చ జ ట డ త ద న ప బ మ య ర ల వ".split(" ") },
  { name: "Kannada", glyphs: "ಅ ಆ ಇ ಕ ಗ ಚ ಜ ಟ ಡ ತ ದ ನ ಪ ಬ ಮ ಯ ರ ಲ ವ".split(" ") },
  { name: "Malayalam", glyphs: "അ ആ ഇ ക ഗ ച ജ ട ഡ ത ദ ന പ ബ മ യ ര ല വ".split(" ") },
  { name: "Gujarati", glyphs: "અ આ ઇ".split(" ") },
];
