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
  { key: "kurinji", icon: "🏔️", ta: "குறிஞ்சி", en: "Kurinji", landscape: "Mountains", poetic: "Union", section: "yazhi" },
  { key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", landscape: "Forest", poetic: "Waiting", section: "adhan" },
  { key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", landscape: "Desert", poetic: "Elopement / hardship", section: "guardian" },
  { key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", landscape: "Agriculture", poetic: "Union, quarrel, domestic happiness", section: "sangam" },
  { key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", landscape: "Coastal", poetic: "Separation", section: "community" },
];

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  positioning: "Sovereign AI for Indian languages",
  // the deck's own headline, verbatim — Yazhi is sovereign AI for Indian
  // languages first, and Tamil-first within that, not "Tamil AI" alone
  taglineTa: "இந்திய மொழிகளுக்கான இறையாண்மை செயற்கை நுண்ணறிவு",
  taglineEn: "Sovereign AI for Indian languages",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
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

export const SCRIPTS: { name: string; glyphs: string[] }[] = [
  { name: "Tamil", glyphs: "அ ஆ இ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன".split(" ") },
  { name: "Devanagari", glyphs: "अ आ इ क ख ग च ज ट ड त द न प ब म य र ल व".split(" ") },
  { name: "Bengali", glyphs: "অ আ ই ক খ গ চ জ ট ড ত দ ন প ব ম য র ল".split(" ") },
  { name: "Telugu", glyphs: "అ ఆ ఇ క గ చ జ ట డ త ద న ప బ మ య ర ల వ".split(" ") },
  { name: "Kannada", glyphs: "ಅ ಆ ಇ ಕ ಗ ಚ ಜ ಟ ಡ ತ ದ ನ ಪ ಬ ಮ ಯ ರ ಲ ವ".split(" ") },
  { name: "Malayalam", glyphs: "അ ആ ഇ ക ഗ ച ജ ട ഡ ത ദ ന പ ബ മ യ ര ല വ".split(" ") },
  { name: "Gujarati", glyphs: "અ આ ઇ".split(" ") },
];

/** The Yazhi section: the umbrella the three products sit under, shown as
    a live conversation. Deck p1 — "Sovereign AI for Indian languages". */
export const YAZHI_SECTION = {
  subTa: "ஒரே உரையாடல் — எல்லா மொழிகளும்",
  subEn: "One conversation, every language",
  bodyEn:
    "Yazhi is sovereign AI for Indian languages — built here, owned here, and open. One conversation moves between Tamil, Telugu and Hindi with nothing lost in the switch, and reaches the tools a family already uses. Three products sit under it: Yazh, the voice friend families pay for; Adhan, the engine underneath; and Open Sangam, the memory we protect.",
  plainTa: "நீங்கள் எந்த இந்திய மொழியிலும் பேசலாம் — யாழி அதே மொழியில் பதில் சொல்லும், இடையில் மொழி மாறினாலும் தொடர்ந்து புரிந்துகொள்ளும்.",
  plainEn: "Talk in any Indian language — Yazhi answers in the same one, and keeps up even when you switch mid-sentence.",
};

/** Adhan — deck p7, column 02 · "THE ENGINE UNDERNEATH". The open Indic
    foundation model, still actively being developed; the language roadmap
    below is deck p8 ("Tamil first, not Tamil only"). */
export const ADHAN = {
  nameTa: "அதன்",
  nameEn: "Adhan",
  eyebrowTa: "உள்ளே இயங்கும் பொறி",
  eyebrowEn: "The engine underneath",
  subTa: "திறந்த இந்திய அடிப்படை மாதிரி",
  subEn: "Our open Indic foundation model",
  bodyEn:
    "Adhan is our open Indic foundation model, reaching 22+ Indian languages, with a tokenizer designed for agglutinative grammar rather than retrofitted from English. Open weights on GitHub, served from our own inference node in Sivakasi. It is not finished and is not meant to be — the model develops continuously, growing as the corpus grows and as each new language enters the pipeline.",
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
  ctaTa: "அதனை GitHub இல் காண்க →",
  ctaHref: "https://github.com/yazhi-lem/adhan",
  plainTa: "இந்திய மொழிகளைப் படிக்கவும் பேசவும் கற்றுக்கொண்டே இருக்கும் கணினி மூளை — வேலை இன்னும் முடியவில்லை, தொடர்ந்து வளர்கிறது.",
  plainEn: "A computer brain still learning to read and speak India's languages — the work isn't finished, it keeps growing.",
};

/** Deck p8 — "Tamil first, not Tamil only". */
export const LANGUAGE_ROADMAP = {
  titleTa: "தமிழ் முதலில், தமிழ் மட்டுமல்ல", titleEn: "Tamil first, not Tamil only",
  steps: [
    { stageEn: "Now", langEn: "Tamil", bodyEn: "Our home language and hardest test case. Corpus, tokenizer, voice and the first families all live here." },
    { stageEn: "Next", langEn: "Telugu", bodyEn: "~96M speakers, agglutinative like Tamil, the same tokenizer problem — the natural second language." },
    { stageEn: "Then", langEn: "Kannada, Malayalam", bodyEn: "The rest of the Dravidian family — shared morphology means shared tokenizer gains." },
    { stageEn: "Goal", langEn: "22+ languages", bodyEn: "One open model, one API, every scheduled language. Adhan is designed for this from day one." },
  ],
  footEn:
    "Tamil and Telugu share a Dravidian grammar backbone and the same tokenizer problem. Solving Tamil properly is not a detour on the way to Telugu — it is most of the work.",
};

/** Deck p5 — "Yazh's world · திணை — Five landscapes, five moods". */
export const THINAI_WORLD = {
  eyebrowTa: "யாழின் உலகம் · திணை", eyebrowEn: "Yazh's world · Thinai",
  titleTa: "ஐந்து நிலங்கள், ஐந்து உணர்வுகள்", titleEn: "Five landscapes, five moods",
  landscapes: [
    { key: "kurinji", ta: "குறிஞ்சி", en: "Kurinji", moodEn: "Mountains · first meetings", bodyEn: "Curiosity and discovery — where a story starts." },
    { key: "mullai", ta: "முல்லை", en: "Mullai", moodEn: "Forest · waiting", bodyEn: "Animals, patience and the folk tales children know." },
    { key: "marutham", ta: "மருதம்", en: "Marutham", moodEn: "Farmland · everyday life", bodyEn: "Counting, work and family — where lessons live." },
    { key: "neytal", ta: "நெய்தல்", en: "Neytal", moodEn: "Coast · longing", bodyEn: "Voyages and distance — the diaspora's landscape." },
    { key: "palai", ta: "பாலை", en: "Palai", moodEn: "Drylands · endurance", bodyEn: "Courage and separation — the harder stories." },
  ],
  footEn:
    "Sangam poetry sorts the world into these five tinai. Yazh's story library is organised the same way — the structure is Tamil at its root, not ornament laid on top.",
};

/** One conversation, three languages, no restart in between — the point
    isn't the trick, it's that switching costs nothing. `tool` renders as a
    small chip under an agent reply, standing in for the WhatsApp/corpus
    connections an agent built on Adhan actually has. */
export const ADHAN_CHAT: {
  from: "user" | "agent";
  lang: string;
  text: string;
  translationEn: string;
  tool?: string;
}[] = [
  { from: "user", lang: "TA", text: "என் பாட்டி சொன்ன கதையைத் தேடு", translationEn: "Find the story my grandmother told" },
  { from: "agent", lang: "TA", text: "தொகுப்பில் தேடுகிறேன்… 3 கதைகள் கிடைத்தன 📖", translationEn: "Searching the corpus… found 3 stories", tool: "corpus_search" },
  { from: "user", lang: "TE", text: "మా అమ్మమ్మ కథ వాట్సాప్‌లో పంపు", translationEn: "Send grandma's story on WhatsApp" },
  { from: "agent", lang: "TE", text: "పంపాను ✅", translationEn: "Sent", tool: "whatsapp" },
  { from: "user", lang: "HI", text: "अब हिंदी में भी सुनाओ", translationEn: "Now tell it in Hindi too" },
  { from: "agent", lang: "HI", text: "बिलकुल — वही कहानी हिंदी में…", translationEn: "Of course — the same story in Hindi…" },
];

/** Yazh — deck p7, column 01 · "WHAT FAMILIES PAY FOR", with the
    character description from deck p4. */
export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh",
  eyebrowTa: "குடும்பங்கள் பயன்படுத்துவது",
  eyebrowEn: "What families pay for",
  subTa: "குழந்தைகளுக்கான குரல் நண்பன் — WhatsApp இல்",
  subEn: "A voice AI friend for children aged 4–8, on WhatsApp",
  bodyEn:
    "Yazh is a guardian creature carved onto temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. Yazh is that guardian, drawn small enough for a four-year-old to talk to. He listens, answers in the child's mother tongue, and never asks them to read or type. Voice in, voice out — no app, no typing, on the phone families already own. Folk stories plus Maths, Science and English through conversation.",
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

/** Open Sangam — deck p7, column 03 · "THE MEMORY WE PROTECT". */
export const SANGAM = {
  nameTa: "சங்கம்",
  nameEn: "Open Sangam",
  eyebrowTa: "நாம் காக்கும் நினைவு",
  eyebrowEn: "The memory we protect",
  subTa: "செம்மொழி இலக்கியத்திற்கான திறந்த தளம்",
  subEn: "An open platform for classical literature",
  bodyEn:
    "An open platform for classical literature — Sangam poetry and beyond, with poem analysis, landscape classification and linguistic study. Free for students, teachers and scholars. It is also the corpus that teaches Adhan what real language sounds like.",
  pillars: [
    { icon: "📜", ta: "செய்யுள் ஆய்வு", en: "Poem analysis" },
    { icon: "🏞️", ta: "திணை வகைப்பாடு", en: "Landscape classification" },
    { icon: "📖", ta: "மொழி ஆய்வு", en: "Linguistic study" },
  ],
  ctaTa: "மேலும் அறிக →",
  ctaEn: "Learn more",
  ctaHref: "https://sangam.yazhi.dev",
  plainTa: "2,000 ஆண்டு பழைய தமிழ்ப் பாடல்களைப் படித்து, ஒவ்வொன்றும் எந்த நிலத்தைச் சேர்ந்தது என்று சொல்லும் கருவி — மாணவர்களுக்கும் ஆசிரியர்களுக்கும் இலவசம்.",
  plainEn: "A tool that reads 2,000-year-old Tamil poems and tells you which of the five landscapes each belongs to — free for students and teachers.",
};

/** The opening passage of Maduraikkanci ("Madurai, a guide/warning"), one
    of the Pattuppattu — an idealised natural order, before the poem turns
    to praise the Pandya king and his city. Tamil text is verbatim from the
    open-sangam corpus (data/texts/maduraikanchi/maduraikanchi.json, block
    01). translationEn renders that block's own `urai` (a plain-Tamil
    paraphrase already in the corpus) into English, rather than translating
    the dense classical verse directly — the urai exists precisely so this
    kind of rendering has solid ground under it. */
export const MADURAI_KANCHI = {
  poemTa: "மதுரைக் காஞ்சி", poemEn: "Maduraikkanci",
  authorTa: "மாங்குடி மருதனார்", authorEn: "Mankudi Maruthanaar",
  verseTa: `ஓங்கு திரை வியன் பரப்பின்
ஒலி முந்நீர் வரம் பாகத்
தேன் தூங்கும் உயர் சிமைய
மலை நாறிய வியன் ஞாலத்து
வல மாதிரத்தான் வளி கொட்ப
விய னாண்மீ னெறி யொழுகப்
பகற் செய்யும் செஞ் ஞாயிறும்
இரவுச் செய்யும் வெண் திங்களும்
மை தீர்ந்து கிளர்ந்து விளங்க
மழைதொழில் உதவ மாதிரங் கொழுக்கத்
தொடுப்பின் ஆயிரம் வித்தியது விளைய
நிலனு மரனும் பயன்எதிர்பு நந்த
நோ யிகந்து நோக்கு விளங்க`,
  translationEn:
    "The sea holds a surging, wave-tossed expanse. Within the world it bounds, mountains rise with high peaks hung with honeycombs. Across the vast sky the wind circles with force, and the stars — vaster than anything else — travel each in its own path. Both the sun that lights the day and the moon that lights the night appear without fail and shine. The rain has fallen and the land has grown rich: sow one seed and it yields a thousand, and both the sown earth and the unsown trees bear good fruit. Because nature helps in this way, no suffering is to be seen even in people's minds — no one does harm.",
  sourceEn: "Opening passage · open-sangam corpus",
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
      { ta: "யாழ்", en: "Yazh", href: "#guardian" },
      { ta: "அதன்", en: "Adhan", href: "#adhan" },
      { ta: "சங்கம்", en: "Open Sangam", href: "#sangam" },
      { ta: "திணை", en: "Thinai", href: "#thinai" },
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
  comingSoon: { ta: "விரைவில்", en: "Coming soon" },
  servicesLabel: { ta: "சேவைகள்", en: "Services" },
  scrollCue: { ta: "கீழே உருட்டி ஆராயுங்கள்", en: "scroll to explore" },
  adhanCtaEn: "View Adhan on GitHub →",
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
