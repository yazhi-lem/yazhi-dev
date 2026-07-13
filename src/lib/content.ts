/* ============================================================
   ALL SITE COPY — single source of truth, verbatim from
   BRAND_AND_CONTENT.md. Do not paraphrase Tamil lines here.
   ============================================================ */

export type ThinaiKey = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";

export const THINAI: {
  key: ThinaiKey;
  icon: string;
  ta: string;
  en: string;
  landscape: string;
  poetic: string;
  section: string; // DOM id of the section this thinai governs
}[] = [
  { key: "kurinji", icon: "🏔️", ta: "குறிஞ்சி", en: "Kurinji", landscape: "Mountains", poetic: "Union", section: "hero" },
  { key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", landscape: "Forest", poetic: "Waiting", section: "adhan" },
  { key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", landscape: "Agriculture", poetic: "Union, quarrel, domestic happiness", section: "sangam" },
  { key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", landscape: "Desert", poetic: "Elopement / hardship", section: "guardian" },
  { key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", landscape: "Coastal", poetic: "Separation", section: "community" },
];

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  positioning: "Sovereign AI & Language Initiative",
  taglineTa: "தமிழ் செயற்கை நுண்ணறிவு",
  taglineEn: "Tamil Artificial Intelligence",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
  fullTa: "இந்திய மொழிகளுக்கான இறையாண்மை கொண்ட செயற்கை நுண்ணறிவு மாதிரி",
  fullEn: "A sovereign AI model for Indian languages",
  footerTa: "இறையாண்மை செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  copyright: "© 2026 யாழி • Yazhi",
};

export const HERO_QUOTE = {
  ta: "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்",
  en: "Of all the languages we know, none is as sweet as Tamil",
  attributionTa: "பாரதியார்",
  attributionEn: "Bharathiyar",
  scrollCue: "scroll to explore",
};

export const SCRIPTS: { name: string; glyphs: string[] }[] = [
  { name: "Tamil", glyphs: "அ ஆ இ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன".split(" ") },
  { name: "Devanagari", glyphs: "अ आ इ क ख ग च ज ट ड त द न प ब म य र ल व".split(" ") },
  { name: "Bengali", glyphs: "অ আ ই ক খ গ চ জ ট ড ত দ ন প ব ম য র ল".split(" ") },
  { name: "Telugu", glyphs: "అ ఆ ఇ క గ చ జ ట డ త ద న ప బ మ య ర ల వ".split(" ") },
  { name: "Kannada", glyphs: "ಅ ಆ ಇ ಕ ಗ ಚ ಜ ಟ ಡ ತ ದ ನ ಪ ಬ ಮ ಯ ರ ಲ ವ".split(" ") },
  { name: "Malayalam", glyphs: "അ ആ ഇ ക ഗ ച ജ ട ഡ ത ദ ന പ ബ മ യ ര ല വ".split(" ") },
  { name: "Gujarati", glyphs: "અ આ ઇ".split(" ") },
];

export const STATS = [
  { value: "7B", ta: "அளவுருக்கள்", en: "Parameters" },
  { value: "22+", ta: "இந்திய மொழிகள்", en: "Indian languages" },
  { value: "3", ta: "திட்டங்கள்", en: "Projects" },
];

export const ADHAN = {
  nameTa: "அதன்",
  nameEn: "Adhan",
  subTa: "இந்திய மொழிகளுக்கான இறையாண்மை கொண்ட செயற்கை நுண்ணறிவு",
  subEn: "Sovereign AI for Indian languages",
  bodyEn:
    "7B parameter sovereign AI model for 22+ Indian languages. One unified model from Tamil to Hindi, Bengali to Telugu.",
  stats: [
    { value: "7B", ta: "அளவுருக்கள்", en: "parameters" },
    { value: "22+", ta: "மொழிகள்", en: "languages" },
    { value: "100%", ta: "இந்திய", en: "Indian" },
  ],
  code: `from adhan import Model

model = Model.load("adhan-7b")
response = model.generate(
    "தமிழின் வரலாறு என்ன?"
    "भारत का इतिहास क्या है?"
    "ಭಾರತದ ಇತಿಹಾಸವೇನು?"
)`,
  ctaTa: "GitHub இல் காண்க →",
  ctaHref: "https://github.com/yazhi-lem/adhan",
};

export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh Guardian",
  subTa: "யாழி • புராணக் காவலன்",
  subEn: "Yazhi • mythic guardian",
  bodyEn:
    "Guardian application inspired by the mythical Yazhi creature. Protecting Tamil digital heritage and community wisdom.",
  ctaTa: "தொடங்குக",
  ctaEn: "Get started",
  ctaHref: "/onboarding",
};

export const SANGAM = {
  nameTa: "சங்கம்",
  nameEn: "Sangam",
  subTa: "மருதம் - விளை நிலம்",
  subEn: "Marutham — fertile agricultural land",
  bodyEn:
    "Classical Tamil literature analysis through the five landscapes. Marutham represents agricultural fertile lands, union, and domestic happiness.",
  pillars: [
    { icon: "📜", ta: "செய்யுள் ஆய்வு", en: "Poem Analysis" },
    { icon: "🏞️", ta: "திணை வகைப்பாடு", en: "Thinai Classification" },
    { icon: "📖", ta: "மொழி ஆய்வு", en: "Linguistic Study" },
  ],
  ctaTa: "மேலும் அறிக →",
  ctaEn: "Learn more",
  ctaHref: "https://sangam.yazhi.dev",
};

export const SERVICES = [
  { ta: "முகவர்கள்", en: "Agents" },
  { ta: "செயலிகள்", en: "Applications" },
  { ta: "விளக்கங்கள்", en: "Annotations" },
];

export const LINKS = {
  discord: "https://discord.gg/yazhi",
  github: "https://github.com/yazhi-lem",
  adhanRepo: "https://github.com/yazhi-lem/adhan",
  whatsapp: "https://chat.whatsapp.com/G0sWRof4Z4cFXXY6Gmavmu",
  onboarding: "/onboarding",
};

export const NAV_GROUPS = [
  {
    ta: "திட்டங்கள்", en: "Projects",
    items: [
      { ta: "அதன்", en: "Adhan", href: "#adhan" },
      { ta: "சங்கம்", en: "Sangam", href: "#sangam" },
      { ta: "யாழ்", en: "Yazh", href: "#guardian" },
    ],
  },
  {
    ta: "சேவைகள்", en: "Services",
    items: [
      { ta: "முகவர்கள்", en: "Agents", href: "#services" },
      { ta: "செயலிகள்", en: "Applications", href: "#services" },
      { ta: "விளக்கங்கள்", en: "Annotations", href: "#services" },
    ],
  },
  {
    ta: "சமூகம்", en: "Community",
    items: [
      { ta: "வலையில் இணை", en: "Join the Network", href: "/onboarding" },
      { ta: "Discord", en: "Discord", href: LINKS.discord },
      { ta: "GitHub", en: "GitHub", href: LINKS.github },
    ],
  },
];

/* ---- strict-language UI strings (short chrome labels; Tamil drafts
        pending Valav's editorial review gate — see README) ---- */
export const UI = {
  heroEyebrow: { ta: "குறிஞ்சி · மலை — 22+ எழுத்துமுறைகள், ஒரே மாதிரி", en: "Kurinji · Mountains — 22+ scripts, one model" },
  oneModel: { ta: "ஒரே மாதிரி", en: "One model" },
  comingSoon: { ta: "விரைவில்", en: "Coming soon" },
  servicesLabel: { ta: "சேவைகள்", en: "Services" },
  scrollCue: { ta: "கீழே உருட்டி ஆராயுங்கள்", en: "scroll to explore" },
  adhanCtaEn: "View on GitHub →",
  thinaiCol: { ta: "திணை", en: "Thinai" },
  landscapeCol: { ta: "நிலம்", en: "Landscape" },
  poeticCol: { ta: "உரிப்பொருள்", en: "Poetic association" },
};

export const THINAI_TA_LANDSCAPE: Record<string, string> = {
  kurinji: "மலை", mullai: "காடு", marutham: "வயல்", neytal: "கடற்கரை", palai: "பாலைவனம்",
};

export const THINAI_TA_POETIC: Record<string, string> = {
  kurinji: "புணர்தல்", mullai: "இருத்தல்", marutham: "ஊடல்", neytal: "இரங்கல்", palai: "பிரிதல்",
};

export const COMMUNITY = {
  titleTa: "சமூகம்", titleEn: "Community",
  subTa: "கடல் கடந்த தமிழ் — வலையில் இணை", subEn: "Tamil across the seas — join the network",
  cards: [
    { ta: "வலையில் இணை", en: "Join the Network", bodyTa: "பங்களிப்பாளர்கள், விளக்கமிடுபவர்கள், உருவாக்குநர்களுக்கான நுழைவு.", bodyEn: "Onboarding for contributors, annotators, and builders.", href: "/onboarding", label: "/onboarding →", external: false },
    { ta: "Discord", en: "Discord", bodyTa: "அன்றாட உரையாடல் — தமிழ் AI உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.", bodyEn: "The daily conversation — Tamil AI builders, researchers, and writers.", href: "https://discord.gg/yazhi", label: "discord.gg/yazhi →", external: true },
    { ta: "GitHub", en: "GitHub", bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.", bodyEn: "The open work — models, tooling, and evaluation suites.", href: "https://github.com/yazhi-lem", label: "github.com/yazhi-lem →", external: true },
  ],
};
