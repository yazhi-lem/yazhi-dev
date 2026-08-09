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
  positioning: "Sovereign AI for Indian languages",
  taglineTa: "தமிழ் செயற்கை நுண்ணறிவு",
  taglineEn: "Tamil Artificial Intelligence",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
  fullTa: "இந்திய மொழிகளுக்கான இறையாண்மை கொண்ட செயற்கை நுண்ணறிவு மாதிரி",
  fullEn: "A sovereign AI model for Indian languages",
  footerTa: "இறையாண்மை செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  // the plain-language layer: one sentence a ten-year-old can read,
  // sitting under the poetic/technical register — never replacing it
  plainTa: "கணினிகளுக்குத் தமிழும் எல்லா இந்திய மொழிகளும் கற்றுத் தருகிறோம்.",
  plainEn: "We teach computers to understand and speak Tamil — and every Indian language.",
  // from the founding deck: the one-line pitch under the wordmark
  heroLineTa: "படிக்கவோ தட்டச்சு செய்யவோ இன்னும் தெரியாத குழந்தைகளுக்கான குரல் நண்பனுடன் தொடங்குகிறோம்.",
  heroLineEn: "Starting with a voice friend for children who cannot yet read or type.",
  copyright: "© 2026 யாழி • Yazhi",
};

/** From the founding deck (Q3 2026, Hyderabad) — the current, honest state
    of the build. Kept separate from the poetic/marketing copy above so this
    can be updated quickly as milestones land without touching brand voice. */
export const ROADMAP = {
  titleTa: "வரைபடம்", titleEn: "Roadmap & runway",
  subEn: "Yazh launch — Q1 2027",
  milestones: [
    { period: "Q3 2026", titleEn: "Private beta", status: "Planned launch", bodyEn: "Initial Yazh conversations on WhatsApp with 30+ founding families around Hyderabad." },
    { period: "Q4 2026", titleEn: "Adhan & Indic corpus", status: "In progress", bodyEn: "Cultural and local data collection, embedding the corpus to train Adhan." },
    { period: "Q1 2027", titleEn: "Public launch", status: "Committed", bodyEn: "Yazh opens to families in Tamil and Telugu, with paid subscriptions live." },
    { period: "Q2–Q4 2027", titleEn: "API & Indian scale", status: "Bullseye", bodyEn: "Yazhi API opens to builders; Kannada and Malayalam enter the pipeline + Developer Community." },
  ],
};

/** Market context from the deck — used sparingly, as supporting stats
    rather than a full pitch-deck reproduction. */
export const MARKET_STATS = [
  { value: "600M+", en: "speakers of major Indian languages with no first-class AI of their own" },
  { value: "~96M", en: "Telugu speakers — the second-largest Dravidian language, and next on the roadmap" },
  { value: "500M+", en: "WhatsApp users in India — the delivery channel already in nearly every home" },
];

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
    "7B parameter sovereign AI model for 22+ Indian languages. One unified model from Tamil to Hindi, Bengali to Telugu — with a tokenizer designed for agglutinative grammar rather than retrofitted from English. Open weights on GitHub, served from our own inference node in Sivakasi.",
  tokenTax: {
    labelEn: "The token tax on Indian languages — tokens spent per word, same sentence",
    rows: [
      { lang: "English", multiplier: "1.0×" },
      { lang: "Hindi", multiplier: "2.5×" },
      { lang: "Telugu", multiplier: "4.0×" },
      { lang: "Tamil", multiplier: "4.5×" },
    ],
    sourceEn: "Petrov et al., NeurIPS 2023",
  },
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
  plainTa: "ஒரே கணினி மூளை இந்தியாவின் எல்லா மொழிகளையும் படிக்கவும் எழுதவும் கற்கிறது.",
  plainEn: "One computer brain learning to read and write all of India's languages.",
};

export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh",
  subTa: "யாழி • புராணக் காவலன்",
  subEn: "A voice AI friend for children, on WhatsApp",
  bodyEn:
    "Yazh is a guardian creature carved onto temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. Yazh is that guardian, drawn small enough for a four-year-old to talk to. He listens, answers in the child's mother tongue, and never asks them to read or type. Voice in, voice out — no app, no typing, on the phone families already own.",
  ctaTa: "தொடங்குக",
  ctaEn: "Get started",
  ctaHref: "/onboarding",
  whatsappCtaTa: "WhatsApp இல் அரட்டையடிக்க",
  whatsappCtaEn: "Chat on WhatsApp",
  whatsappNoteTa: "தற்போது ஹைதராபாத்தைச் சுற்றியுள்ள 30+ முன்னோடிக் குடும்பங்களுடன் தனியார் பீட்டாவில் — இணைந்து புதுப்பிப்புகளைப் பெறுங்கள்.",
  whatsappNoteEn: "Currently in private beta with 30+ founding families around Hyderabad — join the WhatsApp community for updates as we open up.",
  plainTa: "இணையத்தில் தமிழ்க் கதைகளையும் பாடல்களையும் காக்கும் செயலி — கோவில் யாழியைப் போல.",
  plainEn: "An app that watches over Tamil stories and songs on the internet — like the temple guardian it's named after.",
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
  plainTa: "2,000 ஆண்டு பழைய தமிழ்ப் பாடல்களைப் படித்து, ஒவ்வொன்றும் எந்த நிலத்தைச் சேர்ந்தது என்று சொல்லும் கருவி.",
  plainEn: "A tool that reads 2,000-year-old Tamil poems and tells you which of the five landscapes each belongs to.",
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
      { ta: "எங்களைப் பற்றி", en: "About", href: "/about" },
      { ta: "தனியுரிமை", en: "Privacy", href: "/privacy" },
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
  plainTa: "தமிழையும் கணினியையும் நேசிக்கும் மக்கள் இதை இணைந்து உருவாக்குகிறோம் — நீங்களும் வரலாம்.",
  plainEn: "Real people who love Tamil and computers, building this together — you're welcome to join.",
  chatAgeTa: "அரட்டை தளங்கள் (WhatsApp, Discord) 13+ வயதினருக்கு — குழந்தைகள் பெற்றோருடன் இணையுங்கள்.",
  chatAgeEn: "Chat platforms (WhatsApp, Discord) require age 13+ — kids, join with a parent.",
  cards: [
    { ta: "வலையில் இணை", en: "Join the Network", bodyTa: "பங்களிப்பாளர்கள், விளக்கமிடுபவர்கள், உருவாக்குநர்களுக்கான நுழைவு.", bodyEn: "Onboarding for contributors, annotators, and builders.", href: "/onboarding", label: "/onboarding →", external: false },
    { ta: "Discord", en: "Discord", bodyTa: "அன்றாட உரையாடல் — தமிழ் AI உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.", bodyEn: "The daily conversation — Tamil AI builders, researchers, and writers.", href: "https://discord.gg/yazhi", label: "discord.gg/yazhi →", external: true },
    { ta: "GitHub", en: "GitHub", bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.", bodyEn: "The open work — models, tooling, and evaluation suites.", href: "https://github.com/yazhi-lem", label: "github.com/yazhi-lem →", external: true },
  ],
};

/** New: a dedicated track for developers — distinct from the family/parent
    "Join the Network" card above. Same onboarding form, but routes toward
    Discord + a future Yazhi API (Circle) account rather than a child
    profile. See docs/PRD-DEVELOPER-COMMUNITY.md for the full flow. */
export const DEVELOPERS = {
  eyebrowTa: "உருவாக்குநர்கள்", eyebrowEn: "For developers",
  titleTa: "உங்கள் தாய்மொழிக்காக உருவாக்குங்கள்", titleEn: "Build for your mother tongue",
  bodyEn:
    "A community of developers across India, building AI for the languages we grew up speaking. Start on Adhan's open weights or the Yazhi API, ship agents and tools in your own language, and land support from engineers who've done the same.",
  plainTa: "இந்தியா முழுவதும் உள்ள உருவாக்குநர்கள் தங்கள் தாய்மொழிக்காக AI கருவிகளை உருவாக்குகிறார்கள் — நீங்களும் இணையலாம்.",
  plainEn: "Developers across India building AI tools for their own mother tongues — you're welcome to join in.",
  ctaTa: "உருவாக்குநராக இணையுங்கள்", ctaEn: "Join as a developer",
  ctaHref: "/onboarding?track=developer",
  discordCtaTa: "Discord இல் இணையுங்கள்", discordCtaEn: "Join the Discord",
};
