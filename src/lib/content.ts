/* ============================================================
   ALL SITE COPY — single source of truth, verbatim from
   BRAND_AND_CONTENT.md. Do not paraphrase Tamil lines here.
   ============================================================ */

export type ThinaiKey = "palai" | "mullai" | "kurinji" | "marutham" | "neytal";

export const THINAI: {
  key: ThinaiKey;
  icon: string;
  ta: string;
  en: string;
  landscape: string;
  poetic: string;
  section: string; // DOM id of the section this thinai governs
}[] = [
  { key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", landscape: "Desert", poetic: "Elopement / hardship", section: "guardian" },
  { key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", landscape: "Forest", poetic: "Waiting", section: "adhan" },
  { key: "kurinji", icon: "🏔️", ta: "குறிஞ்சி", en: "Kurinji", landscape: "Mountains", poetic: "Union", section: "yazhi" },
  { key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", landscape: "Agriculture", poetic: "Union, quarrel, domestic happiness", section: "sangam" },
  { key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", landscape: "Coastal", poetic: "Separation", section: "community" },
];

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  positioning: "Sovereign AI for Indian languages",
  // the deck's own headline, verbatim — Yazhi is sovereign AI for Indian
  // languages first, and Tamil-first within that, not "Tamil AI" alone
  taglineTa: "இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு",
  taglineEn: "Sovereign AI for Indian languages",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
  footerTa: "இறையாண்மைச் செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  // the plain-language layer: one sentence a ten-year-old can read,
  // sitting under the poetic/technical register — never replacing it
  plainTa: "கணினிகள் தமிழையும் இந்திய மொழிகளையும் புரிந்துகொள்ளவும் பேசவும் கற்றுத் தருகிறோம்.",
  plainEn: "We teach computers to understand and speak Tamil — and the Indian languages after it.",
  // from the founding deck: the one-line pitch under the wordmark
  heroLineTa: "படிக்கவோ தட்டச்சு செய்யவோ இன்னும் அறியாத குழந்தைகளுக்கான குரல்வழி நண்பருடன் தொடங்குகிறோம்.",
  heroLineEn: "Starting with a voice friend for children who cannot yet read or type.",
  copyright: "© 2026 யாழி • Yazhi",
};

/** From the founding deck (Q3 2026, Hyderabad) — the current, honest state
    of the build. Kept separate from the poetic/marketing copy above so this
    can be updated quickly as milestones land without touching brand voice. */
export const ROADMAP = {
  titleTa: "வழித்திட்டமும் நிதிக்காலமும்", titleEn: "Roadmap & runway",
  subEn: "Yazh launch — Q1 2027",
  milestones: [
    { period: "Q3 2026", titleEn: "Private beta", status: "Planned launch", bodyEn: "Initial Yazh conversations on WhatsApp with 30+ founding families around Hyderabad." },
    { period: "Q4 2026", titleEn: "Adhan & Indic corpus", status: "In progress", bodyEn: "Cultural and local data collection, embedding the corpus to train Adhan." },
    { period: "Q1 2027", titleEn: "Public launch", status: "Committed", bodyEn: "Yazh opens to families in Tamil and Telugu, with paid subscriptions live." },
    { period: "Q2–Q4 2027", titleEn: "API & Indian scale", status: "Goal", bodyEn: "Yazhi API opens to builders; Kannada and Malayalam enter the pipeline + Developer Community." },
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
  // Wording narrowed 2026-11-05: the multi-language switch is the design, not
  // the shipped state. ITERATION-1 had it claiming "22+ / online / all languages".
  bodyEn:
    "Yazhi is sovereign AI for Indian languages — built here, owned here, and open. We are building one conversation that moves between Tamil, Telugu and Hindi with nothing lost in the switch, and reaches the tools a family already uses. Three products sit under it: Yazh, the voice friend families pay for; Adhan, the engine underneath; and Open Sangam, the memory we protect.",
  plainTa: "தமிழிலும் தெலுங்கிலும் இந்தியிலும் பேசுங்கள் — யாழி அதே மொழியில் பதிலளிக்கும்; நடுவில் மொழி மாறினாலும் தொடர்ந்து புரிந்துகொள்ளும். இதை உருவாக்கிக்கொண்டிருக்கிறோம்.",
  plainEn: "Talk in Tamil, Telugu or Hindi — Yazhi answers in the same one, and keeps up even when you switch mid-sentence. We are still building this.",
};

/** Adhan — deck p7, column 02 · "THE ENGINE UNDERNEATH". The open Indic
    foundation model, still actively being developed; the language roadmap
    below is deck p8 ("Tamil first, not Tamil only"). */
export const ADHAN = {
  nameTa: "ஆதன்",
  nameEn: "Adhan",
  eyebrowTa: "அடித்தளத்தில் இயங்கும் பொறி",
  eyebrowEn: "The engine underneath",
  subTa: "இந்திய மொழிகளுக்கான எங்கள் திறந்த அடிப்படை மாதிரி",
  subEn: "Our open Indic foundation model",
  // Wording narrowed 2026-11-05 (ITERATION-1): the 22+ language family is the
  // design goal. Today Tamil is the language in the pipeline (see
  // LANGUAGE_ROADMAP); do not claim served languages the repos cannot show.
  bodyEn:
    "Adhan is our open Indic foundation model, designed for 22+ Indian languages, with a tokenizer built for agglutinative grammar rather than retrofitted from English. Tamil comes first, then Telugu, Kannada and Malayalam. Training runs on our own machines in Sivakasi. It is not finished and is not meant to be — the model develops continuously, growing as the corpus grows and as each new language enters the pipeline.",
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
  ctaTa: "ஆதனை GitHub-இல் காண்க →",
  ctaHref: "https://github.com/yazhi-lem/adhan",
  plainTa: "இந்திய மொழிகளைப் படிக்கவும் பேசவும் கற்றுக்கொண்டே இருக்கும் கணினி மூளை — பணி இன்னும் முடியவில்லை, தொடர்ந்து வளர்கிறது.",
  plainEn: "A computer brain still learning to read and speak India's languages — the work isn't finished, it keeps growing.",
};

/** Deck p8 — "Tamil first, not Tamil only". */
export const LANGUAGE_ROADMAP = {
  titleTa: "தமிழ் முதலில், தமிழ் மட்டுமல்ல", titleEn: "Tamil first, not Tamil only",
  steps: [
    { stageEn: "Now", langEn: "Tamil", bodyEn: "Our home language and hardest test case. Corpus, tokenizer, voice and the first families all live here." },
    { stageEn: "Next", langEn: "Telugu", bodyEn: "~96M speakers, agglutinative like Tamil, the same tokenizer problem — the natural second language." },
    { stageEn: "Then", langEn: "Kannada, Malayalam", bodyEn: "The rest of the Dravidian family — shared morphology means shared tokenizer gains." },
    { stageEn: "Goal", langEn: "22+ languages", bodyEn: "One open model, one API, every scheduled language. That is the design goal, not a shipped result — today the pipeline holds Tamil, then Telugu, Kannada and Malayalam." },
  ],
  footEn:
    "Tamil and Telugu share a Dravidian grammar backbone and the same tokenizer problem. Solving Tamil properly is not a detour on the way to Telugu — it is most of the work.",
};

/** Deck p5 — "Yazh's world · திணை — Five landscapes, five moods". */
export const THINAI_WORLD = {
  eyebrowTa: "யாழின் உலகம் · திணை", eyebrowEn: "Yazh's world · Thinai",
  titleTa: "ஐந்து நிலம், ஐந்து உரிப்பொருள்", titleEn: "Five landscapes, five moods",
  landscapes: [
    { key: "palai", ta: "பாலை", en: "Palai", moodEn: "Drylands · endurance", bodyEn: "Courage and separation — the harder stories." },
    { key: "mullai", ta: "முல்லை", en: "Mullai", moodEn: "Forest · waiting", bodyEn: "Animals, patience and the folk tales children know." },
    { key: "kurinji", ta: "குறிஞ்சி", en: "Kurinji", moodEn: "Mountains · first meetings", bodyEn: "Curiosity and discovery — where a story starts." },
    { key: "marutham", ta: "மருதம்", en: "Marutham", moodEn: "Farmland · everyday life", bodyEn: "Counting, work and family — where lessons live." },
    { key: "neytal", ta: "நெய்தல்", en: "Neytal", moodEn: "Coast · longing", bodyEn: "Voyages and distance — the diaspora's landscape." },
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
  { from: "user", lang: "TA", text: "என் பாட்டி சொன்ன கதையைத் தேடுங்கள்", translationEn: "Find the story my grandmother told" },
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
  eyebrowTa: "குடும்பங்கள் கட்டணம் செலுத்துவது இதற்காக",
  eyebrowEn: "What families pay for",
  subTa: "4–8 வயதுக் குழந்தைகளுக்கான WhatsApp குரல் நண்பர்",
  subEn: "A voice AI friend for children aged 4–8, on WhatsApp",
  bodyEn:
    "Yazh is a guardian creature carved onto temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. Yazh is that guardian, drawn small enough for a four-year-old to talk to. He listens, answers in the child's mother tongue, and never asks them to read or type. Voice in, voice out — no app, no typing, on the phone families already own. Folk stories plus Maths, Science and English through conversation.",
  ctaTa: "தொடங்குக",
  ctaEn: "Get started",
  ctaHref: "/onboarding",
  whatsappCtaTa: "WhatsApp-இல் உரையாடுக",
  whatsappCtaEn: "Chat on WhatsApp",
  whatsappNoteTa: "தற்போது ஹைதராபாத் சுற்றுவட்டாரத்தில் உள்ள 30-க்கும் மேற்பட்ட முன்னோடிக் குடும்பங்களுடன் தனிப்பட்ட முன்னோட்டத்தில் இருக்கிறோம் — திறக்கும்போது அறிய WhatsApp சமூகத்தில் இணையுங்கள்.",
  whatsappNoteEn: "Currently in private beta with 30+ founding families around Hyderabad — join the WhatsApp community for updates as we open up.",
  plainTa: "இணையத்தில் தமிழ்க் கதைகளையும் பாடல்களையும் காக்கும் செயலி — கோயில் யாழியைப் போல.",
  plainEn: "An app that watches over Tamil stories and songs on the internet — like the temple guardian it's named after.",
};

/** Open Sangam — deck p7, column 03 · "THE MEMORY WE PROTECT". */
export const SANGAM = {
  nameTa: "திறந்த சங்கம்",
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
    { icon: "📖", ta: "மொழியியல் ஆய்வு", en: "Linguistic study" },
  ],
  ctaTa: "மேலும் அறிக →",
  ctaEn: "Learn more",
  ctaHref: "https://sangam.yazhi.dev",
  plainTa: "2,000 ஆண்டுகள் பழமையான தமிழ்ப் பாடல்களைப் படித்து, ஒவ்வொன்றும் எந்த நிலத்தைச் சேர்ந்தது என்று சொல்லும் கருவி — மாணவர்களுக்கும் ஆசிரியர்களுக்கும் கட்டணமின்றி.",
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
  poemTa: "மதுரைக்காஞ்சி", poemEn: "Maduraikkanci",
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
  { ta: "தரவுக் குறிப்பீடு", en: "Annotations" },
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
      { ta: "திறந்த சங்கம்", en: "Open Sangam", href: "#sangam" },
      { ta: "திணை", en: "Thinai", href: "#thinai" },
    ],
  },
  {
    ta: "சேவைகள்", en: "Services",
    items: [
      { ta: "முகவர்கள்", en: "Agents", href: "#services" },
      { ta: "செயலிகள்", en: "Applications", href: "#services" },
      { ta: "குறிப்புரைகள்", en: "Annotations", href: "#services" },
    ],
  },
  {
    ta: "சமூகம்", en: "Community",
    items: [
      { ta: "வலையமைப்பில் இணையுங்கள்", en: "Join the Network", href: "/onboarding" },
      { ta: "Discord", en: "Discord", href: LINKS.discord },
      { ta: "GitHub", en: "GitHub", href: LINKS.github },
      { ta: "களஞ்சியங்கள்", en: "Repositories", href: "/repos" }, // Tamil: DRAFT, native review pending
      { ta: "குமிழ் UI", en: "Bubble UI", href: "/bubble" },
      { ta: "எங்களைப் பற்றி", en: "About", href: "/about" },
      { ta: "தனியுரிமை", en: "Privacy", href: "/privacy" },
    ],
  },
];

/* ---- strict-language UI strings (short chrome labels; Tamil drafts
        pending Valav's editorial review gate — see README) ---- */
export const UI = {
  heroEyebrow: { ta: "குறிஞ்சி · மலை — 22+ எழுத்துமுறைகள், ஒரே மொழி மாதிரி", en: "Kurinji · Mountains — 22+ scripts, one model" },
  comingSoon: { ta: "விரைவில்", en: "Coming soon" },
  servicesLabel: { ta: "சேவைகள்", en: "Services" },
  scrollCue: { ta: "கீழே உருட்டி ஆராய்க", en: "scroll to explore" },
  adhanCtaEn: "View Adhan on GitHub →",
};

export const COMMUNITY = {
  titleTa: "மன்றம்", titleEn: "Community",
  subTa: "கடல் கடந்த தமிழ் — வலையமைப்பில் இணையுங்கள்", subEn: "Tamil across the seas — join the network",
  plainTa: "தமிழையும் கணினியையும் விரும்பும் நாங்கள் இணைந்து இதை உருவாக்குகிறோம் — நீங்களும் வரலாம்.",
  plainEn: "Real people who love Tamil and computers, building this together — you're welcome to join.",
  chatAgeTa: "உரையாடல் தளங்கள் (WhatsApp, Discord) 13 வயதும் அதற்கு மேலும் உள்ளவர்களுக்கு — குழந்தைகள் பெற்றோருடன் இணையுங்கள்.",
  chatAgeEn: "Chat platforms (WhatsApp, Discord) require age 13+ — kids, join with a parent.",
  cards: [
    { ta: "வலையமைப்பில் இணையுங்கள்", en: "Join the Network", bodyTa: "பங்களிப்பாளர்கள், விளக்கமிடுபவர்கள், உருவாக்குநர்களுக்கான நுழைவு.", bodyEn: "Onboarding for contributors, annotators, and builders.", href: "/onboarding", label: "/onboarding →", external: false },
    { ta: "Discord", en: "Discord", bodyTa: "அன்றாட உரையாடல் — தமிழ்ச் செயற்கை நுண்ணறிவு உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.", bodyEn: "The daily conversation — Tamil AI builders, researchers, and writers.", href: "https://discord.gg/yazhi", label: "discord.gg/yazhi →", external: true },
    { ta: "GitHub", en: "GitHub", bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.", bodyEn: "The open work — models, tooling, and evaluation suites.", href: "https://github.com/yazhi-lem", label: "github.com/yazhi-lem →", external: true },
  ],
};

/** New: a dedicated track for developers — distinct from the family/parent
    "Join the Network" card above. Same onboarding form, but routes toward
    Discord + a future Yazhi API (Circle) account rather than a child
    profile. See docs/community/PRD-DEVELOPER-COMMUNITY.md for the full flow. */
export const DEVELOPERS = {
  eyebrowTa: "உருவாக்குநர்களுக்காக", eyebrowEn: "For developers",
  titleTa: "உங்கள் தாய்மொழிக்காக உருவாக்குங்கள்", titleEn: "Build for your mother tongue",
  bodyEn:
    "A community of developers across India, building AI for the languages we grew up speaking. Start on Adhan's open weights or the Yazhi API, ship agents and tools in your own language, and land support from engineers who've done the same.",
  plainTa: "இந்தியா முழுவதும் உள்ள உருவாக்குநர்கள் தங்கள் தாய்மொழிகளுக்காகச் செயற்கை நுண்ணறிவுக் கருவிகளை உருவாக்குகிறார்கள் — நீங்களும் இணையலாம்.",
  plainEn: "Developers across India building AI tools for their own mother tongues — you're welcome to join in.",
  ctaTa: "உருவாக்குநராக இணையுங்கள்", ctaEn: "Join as a developer",
  ctaHref: "/onboarding?track=developer",
  discordCtaTa: "Discord-இல் இணையுங்கள்", discordCtaEn: "Join the Discord",
};

/* ---- Open-source repo index (/repos). Public repos only; descriptions
        and languages from `gh repo list yazhi-lem` (8 Oct 2026) and each
        README. Tamil strings below are DRAFTS pending the native-reviewer
        sign-off gate — never add letter-spacing to Tamil text. ---- */
export type RepoEntry = {
  name: string;
  what: string;
  lang: string;
  /** Reference forks are listed but not a place to start contributing. */
  reference?: boolean;
};

export const REPOS: readonly RepoEntry[] = [
  { name: "adhan", what: "Tamil language model work: Swaram tokenizer, corpus prep, training, evaluation, inference server", lang: "Python" },
  { name: "open-sangam", what: "Classical Tamil corpus and layered reader: Sangam Tamil, modern Tamil, English", lang: "Python, JavaScript" },
  { name: "illakiya", what: "Tamil mobile keyboard, Android first; nothing typed leaves the phone", lang: "TypeScript, Rust, Kotlin" },
  { name: "yazh-unity", what: "Yazh: bilingual learning pet app for children (Unity 6)", lang: "C#" },
  { name: "yazhi-dev", what: "The yazhi.dev website", lang: "TypeScript (Next.js)" },
  { name: "yazhi-skills", what: "Agent skills and learning content (SKILL.md format)", lang: "Markdown, Python" },
  { name: "styleguide", what: "Fork of Google's style guides (reference)", lang: "HTML", reference: true },
];

const GH_ORG = "https://github.com/yazhi-lem";

export const repoLinks = (name: string) => ({
  repo: `${GH_ORG}/${name}`,
  goodFirstIssues: `${GH_ORG}/${name}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`,
  issues: `${GH_ORG}/${name}/issues`,
  contributing: `${GH_ORG}/${name}/blob/main/CONTRIBUTING.md`,
});

export const REPO_INDEX = {
  titleTa: "திறந்த களஞ்சியங்கள்", // DRAFT: native review pending
  titleEn: "Open-source repositories",
  introEn:
    "Everything we build in the open lives on GitHub under yazhi-lem. Pick a repo, read its README, and start with an issue labelled good first issue. Every pull request gets a first review within 48 hours, and contributors are credited by name.",
  noteEn:
    "Good-first-issue lists are being filled in now. If a list is empty, browse the open issues or say hello on Discord.",
  linkTa: "களஞ்சியங்களைப் பாருங்கள்", // DRAFT: native review pending
  linkEn: "Browse our open-source repos",
};

/* ============================================================
   SITE CATALOGUE (additive, 2026-11-09) — the same copy as above,
   keyed `site.<section>.<field>`, so components can read it by key
   instead of importing each export. The exports above stay the
   source of truth for TA/EN pairs; this block is derived from them
   at module load and never re-typed, so a Tamil line cannot drift
   between the two. Hindi lives in `content.hi.ts` (machine drafts).
   Do NOT paraphrase Tamil lines here either.
   ============================================================ */

/** ⚠️ DRAFTS — Tamil strings added in this block for copy that had only
    English before (ROADMAP, LANGUAGE_ROADMAP steps, THINAI_WORLD moods and
    bodies, MARKET_STATS, YAZHI_SECTION.body, ADHAN.body, GUARDIAN.body,
    SANGAM.body, DEVELOPERS.body, REPOS `what`, YAZHI_SECTION chat preview,
    Family/Discord… chrome) are written here for the first time and are
    pending native review. Each is marked `// DRAFT: native review pending`
    on the line above it. Existing Tamil lines are copied verbatim from the
    exports above. */

export const TAMIL_DRAFT_NOTE =
  "Tamil strings marked DRAFT in src/lib/content.ts are pending native review.";

/** One catalogue value either way: plain TA/EN strings, or a machine draft. */
type Pair = [ta: string, en: string];

/** A key's TA/EN pair. `{placeholder}` holes are interpolated by `t()`. */
export type SitePair = Record<string, Pair>;

export const SITE_PAIRS: SitePair = {
  // ── Identity ──────────────────────────────────────────────────────────
  "site.identity.name": [IDENTITY.nameTa, IDENTITY.nameEn],
  "site.identity.tagline": [IDENTITY.taglineTa, IDENTITY.taglineEn],
  "site.identity.heroLine": [IDENTITY.heroLineTa, IDENTITY.heroLineEn],
  // DRAFT: native review pending
  "site.identity.positioning": ["இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு", IDENTITY.positioning],
  "site.identity.secondary": [IDENTITY.secondaryTa, IDENTITY.secondaryEn],
  "site.identity.footer": [IDENTITY.footerTa, IDENTITY.footerEn],
  "site.identity.copyright": [IDENTITY.copyright, IDENTITY.copyright],

  // ── Hero chrome ───────────────────────────────────────────────────────
  "site.hero.eyebrow": [UI.heroEyebrow.ta, UI.heroEyebrow.en],
  "site.hero.talkCta": [
    // DRAFT: native review pending
    "யாழியுடன் பேசுக",
    "Talk to Yazhi",
  ],
  "site.hero.openChatCta": [
    // DRAFT: native review pending
    "உரையாடலைத் திற",
    "Open the chat",
  ],
  // DRAFT: native review pending
  "site.hero.landscapesLabel": ["ஐந்திணை", "Five landscapes"],
  // DRAFT: native review pending (the scroll cue's Tamil is new)
  "site.hero.scrollCue": ["கீழே உருட்டிப் பாருங்கள்", UI.scrollCue.en],
  ...THINAI.reduce<SitePair>((acc, th) => {
    acc[`site.thinai.landscape.${THINAI.indexOf(th)}.name`] = [th.ta, th.en];
    return acc;
  }, {}),
  "site.hero.yazhCaption": [
    // DRAFT: native review pending
    "யாழை மீட்டுங்கள் — ஒவ்வொரு நரம்பும் அடுத்ததை எழுப்பும்",
    "Pluck the yazh — each string wakes the next",
  ],
  "site.hero.homeLabel": ["யாழி — முகப்புப் பக்கம்", "Yazhi home"], // DRAFT: native review pending
  "site.hero.skipIntro": ["தவிர் →", "Skip →"], // DRAFT: native review pending

  // ── Navigation ────────────────────────────────────────────────────────
  "site.nav.home": ["யாழி — முகப்புப் பக்கம்", "Yazhi home"], // DRAFT: native review pending
  "site.nav.menu": ["பட்டி", "Menu"], // DRAFT: native review pending
  "site.nav.label": ["யாழி", "Yazhi"],
  "site.nav.fiveLandscapes": ["ஐந்திணை / ஐந்து நிலங்கள்", "Five landscapes"], // DRAFT: native review pending
  "site.nav.thinaiItem": ["{ta} · {en} — {landscape}", "{ta} · {en} — {landscape}"],
  "site.nav.backToTop": ["மேலே செல்ல", "Back to top"], // DRAFT: native review pending
  ...[
    [GUARDIAN.nameTa, GUARDIAN.nameEn],
    [ADHAN.nameTa, ADHAN.nameEn],
    // DRAFT: native review pending
    ["சங்கம்", "Sangam"],
    // DRAFT: native review pending
    ["உருவாக்கு", "Build"],
  ].reduce<SitePair>((acc, pair, i) => ({ ...acc, [`site.nav.link.${i}`]: pair as Pair }), {}),

  // Group headings and items come from NAV_GROUPS, verbatim.
  ...NAV_GROUPS.reduce<SitePair>(
    (acc, g, gi) => {
      acc[`site.nav.groups.${gi}.label`] = [g.ta, g.en];
      g.items.forEach((it, ii) => {
        acc[`site.nav.groups.${gi}.items.${ii}`] = [it.ta, it.en];
      });
      return acc;
    },
    {}
  ),

  // ── Yazhi (the umbrella) ──────────────────────────────────────────────
  "site.yazhi.sub": [YAZHI_SECTION.subTa, YAZHI_SECTION.subEn],
  // DRAFT: native review pending
  "site.yazhi.body": [
    "யாழி இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு — இங்கேயே உருவாக்கப்பட்டது, நமக்கே சொந்தம், திறந்ததும். தமிழ், தெலுங்கு, இந்தி ஆகிய மொழிகளுக்கு இடையே மாறினாலும் எதையும் இழக்காமல் தொடரும் ஒரே உரையாடலை உருவாக்குகிறோம்; குடும்பங்கள் ஏற்கனவே பயன்படுத்தும் கருவிகளை நெருங்கச் செய்கிறோம். அதன் கீழ் மூன்று தயாரிப்புகள்: யாழ் — குடும்பங்கள் கட்டணம் செலுத்தும் குரல் நண்பர்; ஆதன் — அடித்தளத்தில் இயங்கும் பொறி; திறந்த சங்கம் — நாம் காக்கும் நினைவு.",
    YAZHI_SECTION.bodyEn,
  ],
  "site.yazhi.plain": [YAZHI_SECTION.plainTa, YAZHI_SECTION.plainEn],
  // DRAFT: native review pending
  "site.yazhi.preview": ["முன்னோட்டம் — தமிழ், தெலுங்கு, இந்தி", "preview — Tamil, Telugu, Hindi"],
  "site.yazhi.chatAlt": [
    // DRAFT: native review pending
    "யாழியுடன் ஒரு உரையாடல் — மீண்டும் தொடங்காமல் தமிழ், தெலுங்கு, இந்தி ஆகியவற்றுக்கு இடையே நகர்கிறது; ஒரு தொகுப்புத் தேடலும் ஒரு WhatsApp அனுப்புதலும் இதில் அடங்கும்",
    "A chat with Yazhi moving between Tamil, Telugu, and Hindi without restarting, including a corpus search and a WhatsApp send",
  ],

  // ── Adhan ─────────────────────────────────────────────────────────────
  "site.adhan.name": [ADHAN.nameTa, ADHAN.nameEn],
  "site.adhan.eyebrow": [ADHAN.eyebrowTa, ADHAN.eyebrowEn],
  "site.adhan.sub": [ADHAN.subTa, ADHAN.subEn],
  // DRAFT: native review pending
  "site.adhan.body": [
    "ஆதன் எங்கள் திறந்த இந்திய மொழி அடிப்படை மாதிரி — 22-க்கும் மேற்பட்ட இந்திய மொழிகளுக்காக வடிவமைக்கப்பட்டது; ஆங்கிலத்திலிருந்து மாற்றி அமைக்கப்படாமல், ஒட்டுமொழி இலக்கணத்திற்கேற்ப உருவாக்கப்பட்ட டோக்கனைசர் கொண்டது. முதலில் தமிழ், அடுத்து தெலுங்கு, கன்னடம், மலையாளம். பயிற்சி சிவகாசியில் உள்ள எங்கள் இயந்திரங்களிலேயே நடக்கிறது. இது முடிந்துவிடவில்லை, முடிவதும் நோக்கமல்ல — தொகுப்பு வளரும்போதும் புதிய மொழிகள் இணையும்போதும் மாதிரி தொடர்ந்து வளர்கிறது.",
    ADHAN.bodyEn,
  ],
  "site.adhan.plain": [ADHAN.plainTa, ADHAN.plainEn],
  "site.adhan.cta": [ADHAN.ctaTa, UI.adhanCtaEn],
  "site.adhan.tokenTax.label": [
    // DRAFT: native review pending
    "இந்திய மொழிகளுக்கான டோக்கன் வரி — ஒரே வாக்கியத்திற்கு சொல்லுக்கு எத்தனை டோக்கன்",
    ADHAN.tokenTax.labelEn,
  ],
  "site.adhan.tokenTax.source": [ADHAN.tokenTax.sourceEn, ADHAN.tokenTax.sourceEn],
  ...ADHAN.tokenTax.rows.reduce<SitePair>((acc, r, i) => {
    // the language names in a cited comparison table are labels, not prose:
    // each is shown in its own script in every locale.
    acc[`site.adhan.tokenTax.row.${i}`] = [r.lang, r.lang];
    return acc;
  }, {}),

  // ── Language roadmap ──────────────────────────────────────────────────
  "site.languageRoadmap.title": [LANGUAGE_ROADMAP.titleTa, LANGUAGE_ROADMAP.titleEn],
  ...LANGUAGE_ROADMAP.steps.reduce<SitePair>((acc, step, i) => {
    // DRAFT: native review pending — the stage/lang/body Tamil is new copy.
    const drafts: [string, string, string][] = [
      ["இப்போது", "தமிழ்", "எங்கள் வீட்டு மொழி, மிகக் கடினமான சோதனை. தொகுப்பு, டோக்கனைசர், குரல், முதல் குடும்பங்கள் — அனைத்தும் இங்கேயே."],
      ["அடுத்து", "தெலுங்கு", "~9.6 கோடி பேசுபவர்கள், தமிழைப் போலவே ஒட்டுமொழி; அதே டோக்கனைசர் சிக்கல் — இயல்பான இரண்டாம் மொழி."],
      ["பிறகு", "கன்னடம், மலையாளம்", "எஞ்சிய திராவிடக் குடும்பம் — பகிரப்பட்ட உருபனியல் என்பது பகிரப்பட்ட டோக்கனைசர் ஆதாயம்."],
      ["இலக்கு", "22+ மொழிகள்", "ஒரே திறந்த மாதிரி, ஒரே API, திட்டமிடப்பட்ட ஒவ்வொரு மொழியும். இது வடிவமைப்பு இலக்கு, வெளியிடப்பட்ட முடிவு அல்ல — இன்று குழாயில் தமிழ், பிறகு தெலுங்கு, கன்னடம், மலையாளம்."],
    ];
    const found = drafts[i];
    const [stageTa, langTa, bodyTa]: [string, string, string] = found ?? [step.stageEn, step.langEn, step.bodyEn];
    acc[`site.languageRoadmap.step.${i}.stage`] = [stageTa, step.stageEn];
    acc[`site.languageRoadmap.step.${i}.lang`] = [langTa, step.langEn];
    acc[`site.languageRoadmap.step.${i}.body`] = [bodyTa, step.bodyEn];
    return acc;
  }, {}),
  "site.languageRoadmap.foot": [
    // DRAFT: native review pending
    "தமிழும் தெலுங்கும் ஒரே திராவிட இலக்கண முதுகெலும்பையும் அதே டோக்கனைசர் சிக்கலையும் பகிர்ந்துகொள்கின்றன. தமிழைச் சரியாகத் தீர்ப்பது தெலுங்கை நோக்கிய வழியில் ஒரு திசைவிலகல் அல்ல — அதுவே பெரும்பகுதி வேலை.",
    LANGUAGE_ROADMAP.footEn,
  ],

  // ── Yazh (the guardian product) ───────────────────────────────────────
  "site.yazh.name": [GUARDIAN.nameTa, GUARDIAN.nameEn],
  "site.yazh.eyebrow": [GUARDIAN.eyebrowTa, GUARDIAN.eyebrowEn],
  "site.yazh.sub": [GUARDIAN.subTa, GUARDIAN.subEn],
  // DRAFT: native review pending
  "site.yazh.body": [
    "யாழ் என்பது தென்னிந்தியா முழுவதும் கோயில் தூண்களில் செதுக்கப்பட்ட காவல் விலங்கு — வாசலிலேயே நின்று உள்ளே இருப்பதைப் பாதுகாக்கிறது. யாழ் அதே காவலர்; நான்கு வயதுக் குழந்தை பேசக்கூடிய அளவுக்குச் சிறிதாக வரையப்பட்டவர். அவர் கேட்கிறார், குழந்தையின் தாய்மொழியில் பதிலளிக்கிறார், ஒருபோதும் படிக்கவோ தட்டச்சு செய்யவோ கேட்கமாட்டார். குரல் உள்ளே, குரல் வெளியே — செயலி இல்லை, தட்டச்சு இல்லை, குடும்பங்கள் ஏற்கனவே வைத்திருக்கும் அதே தொலைபேசியில். நாட்டுப்புறக் கதைகள் உடன் உரையாடல் வழியாகக் கணக்கு, அறிவியல், ஆங்கிலம்.",
    GUARDIAN.bodyEn,
  ],
  "site.yazh.plain": [GUARDIAN.plainTa, GUARDIAN.plainEn],
  "site.yazh.cta": [GUARDIAN.ctaTa, GUARDIAN.ctaEn],
  "site.yazh.whatsappCta": [GUARDIAN.whatsappCtaTa, GUARDIAN.whatsappCtaEn],
  "site.yazh.whatsappNote": [GUARDIAN.whatsappNoteTa, GUARDIAN.whatsappNoteEn],
  "site.yazh.caption": [IDENTITY.nameTa, "temple guardian"], // DRAFT: pair pending review
  "site.yazh.artAlt": ["யாழி — புராணக் காவலர்", "Yazhi — mythical guardian"], // DRAFT: native review pending
  "site.yazh.markAlt": ["யாழி காவலரின் குறியீட்டுச் சின்னம்", "Abstract yazhi guardian mark"], // DRAFT: native review pending

  // ── Open Sangam ───────────────────────────────────────────────────────
  "site.sangam.name": [SANGAM.nameTa, SANGAM.nameEn],
  "site.sangam.eyebrow": [SANGAM.eyebrowTa, SANGAM.eyebrowEn],
  "site.sangam.sub": [SANGAM.subTa, SANGAM.subEn],
  // DRAFT: native review pending
  "site.sangam.body": [
    "செம்மொழி இலக்கியத்திற்கான திறந்த தளம் — சங்கப் பாடல்களும் அதற்கு அப்பாலும்; பாடல் ஆய்வு, நில வகைப்பாடு, மொழியியல் ஆய்வு. மாணவர்கள், ஆசிரியர்கள், அறிஞர்களுக்கு இலவசம். உண்மையான மொழி எப்படி ஒலிக்கிறது என்பதை ஆதனுக்குக் கற்பிக்கும் தொகுப்பும் இதுவே.",
    SANGAM.bodyEn,
  ],
  "site.sangam.plain": [SANGAM.plainTa, SANGAM.plainEn],
  "site.sangam.cta": [SANGAM.ctaTa, `${SANGAM.ctaEn} →`],
  "site.sangam.source": [MADURAI_KANCHI.sourceEn, MADURAI_KANCHI.sourceEn],
  ...SANGAM.pillars.reduce<SitePair>((acc, p, i) => {
    acc[`site.sangam.pillar.${i}`] = [p.ta, p.en];
    return acc;
  }, {}),

  // ── Thinai world ──────────────────────────────────────────────────────
  "site.thinai.eyebrow": [THINAI_WORLD.eyebrowTa, THINAI_WORLD.eyebrowEn],
  "site.thinai.title": [THINAI_WORLD.titleTa, THINAI_WORLD.titleEn],
  ...THINAI_WORLD.landscapes.reduce<SitePair>((acc, l, i) => {
    const moodTa: string[] = [
      // DRAFTS: native review pending
      "வறண்ட நிலம் · தாங்கிக் கொள்ளுதல்",
      "காடு · காத்திருத்தல்",
      "மலை · முதல் சந்திப்புகள்",
      "வயல் · அன்றாட வாழ்வு",
      "கடற்கரை · ஏக்கம்",
    ];
    const bodyTa: string[] = [
      // DRAFTS: native review pending
      "துணிவும் பிரிவும் — கடினமான கதைகள்.",
      "விலங்குகளும் பொறுமையும் — குழந்தைகள் அறியும் நாட்டுப்புறக் கதைகள்.",
      "ஆர்வமும் கண்டுபிடிப்பும் — கதை தொடங்கும் இடம்.",
      "எண்ணுதலும் வேலையும் குடும்பமும் — பாடங்கள் அமையும் இடம்.",
      "பயணங்களும் தூரமும் — புலம்பெயர் மக்களின் நிலம்.",
    ];
    acc[`site.thinai.landscape.${i}.mood`] = [moodTa[i] ?? l.moodEn, l.moodEn];
    acc[`site.thinai.landscape.${i}.body`] = [bodyTa[i] ?? l.bodyEn, l.bodyEn];
    return acc;
  }, {}),
  "site.thinai.foot": [
    // DRAFT: native review pending
    "சங்கப் பாடல்கள் உலகை இந்த ஐந்து திணைகளாகப் பிரிக்கின்றன. யாழின் கதை நூலகமும் அதே வழியில் அமைந்துள்ளது — அந்த அமைப்பு தமிழில் வேரூன்றியது, மேலே சேர்க்கப்பட்ட அலங்காரம் அல்ல.",
    THINAI_WORLD.footEn,
  ],

  // ── Section chrome (the thinai eyebrow of every section heading) ───────
  // DRAFTS: native review pending — the landscape phrase under each thinai.
  "site.section.yazhi.landscape": ["மலை · கூடல்", "Mountains · first meetings"],
  "site.section.adhan.landscape": ["காடு · இருத்தல்", "Forest · waiting"],
  "site.section.guardian.landscape": ["பாலை நிலம் · பிரிதல்", "Desert · hardship endured"],
  "site.section.sangam.landscape": ["வயல் · ஊடல்", "Agriculture · fertile land"],
  "site.section.community.landscape": ["கடற்கரை · இரங்கல்", "Coastal · separation, pining"],
  ...THINAI.reduce<SitePair>((acc, t) => {
    acc[`site.section.${t.section}.thinai`] = [t.ta, t.en];
    return acc;
  }, {}),

  // ── Services ──────────────────────────────────────────────────────────
  "site.services.label": [UI.servicesLabel.ta, UI.servicesLabel.en],
  "site.services.comingSoon": [UI.comingSoon.ta, UI.comingSoon.en],
  "site.services.asideLabel": [
    // DRAFT: native review pending
    "சேவைகள் — விரைவில்",
    "Services — coming soon",
  ],
  ...SERVICES.reduce<SitePair>((acc, s, i) => {
    acc[`site.services.${i}`] = [s.ta, s.en];
    return acc;
  }, {}),

  // ── Community ─────────────────────────────────────────────────────────
  "site.community.title": [COMMUNITY.titleTa, COMMUNITY.titleEn],
  "site.community.sub": [COMMUNITY.subTa, COMMUNITY.subEn],
  "site.community.plain": [COMMUNITY.plainTa, COMMUNITY.plainEn],
  "site.community.chatAge": [COMMUNITY.chatAgeTa, COMMUNITY.chatAgeEn],
  ...COMMUNITY.cards.reduce<SitePair>((acc, c, i) => {
    acc[`site.community.card.${i}.title`] = [c.ta, c.en];
    acc[`site.community.card.${i}.body`] = [c.bodyTa, c.bodyEn];
    return acc;
  }, {}),

  // ── Developers ────────────────────────────────────────────────────────
  "site.developers.eyebrow": [DEVELOPERS.eyebrowTa, DEVELOPERS.eyebrowEn],
  "site.developers.title": [DEVELOPERS.titleTa, DEVELOPERS.titleEn],
  // DRAFT: native review pending
  "site.developers.body": [
    "இந்தியா முழுவதும் உள்ள உருவாக்குநர்களின் சமூகம் — நாம் வளர்ந்த மொழிகளுக்கான செயற்கை நுண்ணறிவை உருவாக்குகிறார்கள். ஆதனின் திறந்த எடைகளிலோ யாழி API-யிலோ தொடங்குங்கள், உங்கள் சொந்த மொழியில் முகவர்களையும் கருவிகளையும் வெளியிடுங்கள், ஏற்கனவே இதைச் செய்த பொறியாளர்களின் ஆதரவைப் பெறுங்கள்.",
    DEVELOPERS.bodyEn,
  ],
  "site.developers.plain": [DEVELOPERS.plainTa, DEVELOPERS.plainEn],
  "site.developers.cta": [DEVELOPERS.ctaTa, DEVELOPERS.ctaEn],
  "site.developers.discordCta": [DEVELOPERS.discordCtaTa, DEVELOPERS.discordCtaEn],

  // ── Repository index ──────────────────────────────────────────────────
  "site.repos.title": [REPO_INDEX.titleTa, REPO_INDEX.titleEn],
  // DRAFT: native review pending
  "site.repos.intro": [
    "நாம் திறந்த நிலையில் உருவாக்கும் அனைத்தும் GitHub-இல் yazhi-lem கீழ் உள்ளது. ஒரு களஞ்சியத்தைத் தேர்ந்தெடுங்கள், அதன் README-ஐப் படியுங்கள், good first issue என்று குறிக்கப்பட்ட சிக்கலில் தொடங்குங்கள். ஒவ்வொரு pull request-க்கும் 48 மணி நேரத்தில் முதல் மதிப்பாய்வு கிடைக்கும்; பங்களிப்பாளர்கள் பெயரால் குறிப்பிடப்படுவார்கள்.",
    REPO_INDEX.introEn,
  ],
  // DRAFT: native review pending
  "site.repos.note": [
    "good-first-issue பட்டியல்கள் இப்போது நிரப்பப்பட்டு வருகின்றன. ஏதேனும் பட்டியல் காலியாக இருந்தால், திறந்த சிக்கல்களைப் பாருங்கள் அல்லது Discord-இல் வணக்கம் சொல்லுங்கள்.",
    REPO_INDEX.noteEn,
  ],
  "site.repos.link": [REPO_INDEX.linkTa, REPO_INDEX.linkEn],
  "site.repos.goodFirst": ["தொடக்கச் சிக்கல்கள் →", "Good first issues →"], // DRAFT: native review pending
  "site.repos.allIssues": ["அனைத்துத் திறந்த சிக்கல்களும்", "All open issues"], // DRAFT: native review pending
  "site.repos.reference": ["குறிப்புக்கள்", "Reference"], // DRAFT: native review pending
  ...REPOS.reduce<SitePair>((acc, r, i) => {
    // DRAFT: native review pending
    const whatTa = [
      "தமிழ் மொழி மாதிரி வேலை: சுவரம் டோக்கனைசர், தொகுப்புத் தயாரிப்பு, பயிற்சி, மதிப்பீடு, அனுமானச் சேவையகம்",
      "செம்மொழித் தமிழ்த் தொகுப்பும் அடுக்குப் பாடல் வாசிப்பும்: சங்கத் தமிழ், தற்காலத் தமிழ், ஆங்கிலம்",
      "தமிழ் கைபேசி விசைப்பலகை, முதலில் Android; தட்டச்சிடும் எதுவும் தொலைபேசியை விட்டு வெளியேறாது",
      "யாழ்: குழந்தைகளுக்கான இருமொழி கற்றல் செல்லப் பிராணி செயலி (Unity 6)",
      "yazhi.dev இணையதளம்",
      "முகவர் திறன்களும் கற்றல் உள்ளடக்கமும் (SKILL.md வடிவம்)",
      "Google-இன் பாணி வழிகாட்டிகளின் கிளை (குறிப்பு)",
    ];
    acc[`site.repos.what.${i}`] = [whatTa[i] ?? r.what, r.what];
    return acc;
  }, {}),

  // ── About page ────────────────────────────────────────────────────────
  "site.about.title": ["யாழியைப் பற்றி", "About Yazhi"],
  "site.about.metadataTitle": ["எங்களைப் பற்றி — யாழி • About — Yazhi", "எங்களைப் பற்றி — யாழி • About — Yazhi"],
  "site.about.description": [
    // DRAFT: native review pending
    "யாழிக்குப் பின்னால் யார், நாம் என்ன உருவாக்குகிறோம், விழிப்பு எண்ணிக்கை எதைக் குறிக்கிறது.",
    "Who is behind Yazhi, what we're building, and what the Awakening countdown means.",
  ],
  "site.about.backLink": ["← யாழி · Yazhi", "← யாழி · Yazhi"],
  "site.about.what.q": ["யாழி என்றால் என்ன?", "What is Yazhi?"],
  "site.about.what.p1": [
    // DRAFT: native review pending
    "யாழி இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவை உருவாக்கும் சமூக முயற்சி — தமிழில் தொடங்குகிறது. எளிய சொற்களில்: தமிழையும் மற்ற எல்லா இந்திய மொழிகளையும் கணினிகள் புரிந்துகொள்ளவும் படிக்கவும் பேசவும் கற்றுத் தருகிறோம்; வேலை திறந்த நிலையில், சமூகத்தால், சமூகத்திற்காக.",
    "Yazhi (யாழி) is a community initiative building sovereign AI for Indian languages — starting from Tamil. In plain words: we teach computers to understand, read, and speak Tamil and every other Indian language, with the work done in the open, by the community, for the community.",
  ],
  "site.about.what.p2": [
    // DRAFT: native review pending
    "இந்தப் பெயர் யாழியிலிருந்து வந்தது — தமிழ்க் கோயில் தூண்களில் செதுக்கப்பட்ட புராணக் காவலர்; பாதி சிங்கம், பாதி யானை — வாசலின் காவலர்.",
    "The name comes from the yazhi, the mythical guardian carved on Tamil temple pillars — part lion, part elephant — the keeper at the threshold.",
  ],
  "site.about.building.q": ["நாம் என்ன உருவாக்குகிறோம்", "What we're building"],
  "site.about.building.adhan": [
    // DRAFT: native review pending
    "ஆதன் — எங்கள் திறந்த இந்திய மொழி அடிப்படை மாதிரி, 22-க்கும் மேற்பட்ட இந்திய மொழிகளுக்காக உருவாக்கப்பட்டது; முதலில் தமிழ், பின்னர் திராவிடக் குடும்பத்தின் ஏனையவை. இது இன்னும் பயிற்சியில் உள்ளது; மொழிகளின் எண்ணிக்கை இன்று நமது வழித்திட்டத்தில் உள்ளது, வெளியீட்டில் அல்ல.",
    "Adhan (அதன்) — our open Indic foundation model, built for 22+ Indian languages, starting with Tamil and then the rest of the Dravidian family. It is still in training; our roadmap, not a release, is where the language count lives today.",
  ],
  "site.about.building.sangam": [
    // DRAFT: native review pending
    "சங்கம் — சங்கப் பாடல்களின் ஐந்திணை வழியாகச் செம்மொழித் தமிழ் இலக்கிய ஆய்வு. இயங்குகிறது:",
    "Sangam (சங்கம்) — analysis of classical Tamil literature through the five landscapes (ஐந்திணை) of Sangam poetry. Live at",
  ],
  "site.about.building.yazh": [
    // DRAFT: native review pending
    "யாழ் காவலர் — தமிழ் எண்மப் பாரம்பரியத்தையும் சமூக அறிவையும் காக்கும் செயலி.",
    "Yazh Guardian (யாழ்) — an app protecting Tamil digital heritage and community knowledge.",
  ],
  "site.about.countdown.q": ["எண்ணிக்கை எதற்கு?", "What is the countdown?"],
  "site.about.countdown.bold": ["{date} — எங்கள் பொது வெளியீடு", "{date} — our public launch"],
  "site.about.countdown.date": ["யாழி விழிப்பு — 1 ஜனவரி 2027", "Yazhi Awakening — 1 January 2027"],
  "site.about.countdown.pre": ["முகப்புப் பக்கத்தில் உள்ள காலக்கணிப்பு", "The timer on the home page counts down to the"],
  "site.about.countdown.post": [
    // DRAFT: native review pending
    "வரை எண்ணிக்கொண்டே இருக்கும்: மாதிரிகள், கருவிகள், சமூகத் திட்டங்கள் முழுமையாகத் திறக்கும் நாள். மர்மமானது எதுவுமில்லை — நாம் நமக்கே வைத்துக்கொள்ளும் வெளியீட்டு நாள்.",
    ", our public launch: the day the models, tools, and community programs open fully. Nothing mysterious — just a launch date we hold ourselves to.",
  ],
  "site.about.landscapes.q": ["இந்தத் தளத்தில் ஐந்து நிலங்கள்", "The five landscapes on this site"],
  "site.about.landscapes.p": [
    // DRAFT: native review pending
    "நீங்கள் உருட்டிப்பார்க்கும் காட்சிகள் — மலை, காடு, வயல், பாலை, கடல் — 2,000 ஆண்டுகள் பழமையான சங்கப் பாடல்களின் ஐந்திணையைப் பின்பற்றுகின்றன. ஒவ்வொரு நிலமும் அதன் செம்மொழிக் கவிதைத் தலைப்புடன் இணைக்கப்பட்டுள்ளது, தமிழ் இலக்கியத்தில் கற்பிக்கப்படுவது போலவே. இது நம் வரைபடம்: பழைய நிலம், புதிய வேலை.",
    "The scenery you scroll through — mountain, forest, farmland, desert, sea — follows the ஐந்திணை, the five landscapes of 2,000-year-old Sangam poetry. Each landscape is paired with its classical poetic theme, exactly as taught in Tamil literature. It's our map: old land, new work.",
  ],
  "site.about.who.q": ["இதை நடத்துவது யார், எப்படித் தொடர்பு கொள்வது", "Who runs this & how to reach us"],
  "site.about.who.p1": [
    // DRAFT: native review pending
    "யாழியை உருவாக்கும் தன்னார்வலர்களே அதைத் திறந்த நிலையில் நடத்துகிறார்கள். எங்கள் வேலை முழுவதும் பொதுவில் உள்ளது",
    "Yazhi is run by the volunteers who build it, in the open. All our work is public at",
  ],
  "site.about.who.p2": [
    // DRAFT: native review pending
    "— கேள்விகள், சிக்கல்கள், வணக்கங்கள் அனைத்தும் வரவேற்கப்படுகின்றன. எங்கள்",
    "— questions, issues, and hellos all welcome there. Also see our",
  ],
  "site.about.who.p3": ["தனியுரிமைக் குறிப்பையும்", "privacy note"],
  "site.about.who.p4": ["பாருங்கள்.", "See"],

  // ── Privacy page ──────────────────────────────────────────────────────
  "site.privacy.title": ["தனியுரிமை", "Privacy"],
  "site.privacy.metadataTitle": ["தனியுரிமை — யாழி • Privacy — Yazhi", "தனியுரிமை — யாழி • Privacy — Yazhi"],
  "site.privacy.description": [
    // DRAFT: native review pending
    "யாழி எதைச் சேகரிக்கிறது, எது உங்கள் சாதனத்திலேயே இருக்கிறது, குடும்பங்கள் இந்தத் தளத்தை எப்படிப் பயன்படுத்த வேண்டும்.",
    "What Yazhi collects, what stays on your device, and how families should use the site.",
  ],
  "site.privacy.updated": ["கடைசியாகப் புதுப்பிக்கப்பட்டது: ஜூலை 2026", "Last updated: July 2026"],
  "site.privacy.collect.q": ["நாம் என்ன சேகரிக்கிறோம் — எங்கே இருக்கிறது", "What we collect — and where it lives"],
  "site.privacy.collect.p": [
    // DRAFT: native review pending
    "நீங்கள் வலையமைப்பில் இணையும்போது நீங்கள் உள்ளிடும் handle-ம் தொலைபேசி எண்ணும் உங்கள் சொந்த உலாவியில் (localStorage) மட்டுமே சேமிக்கப்படும். அவை எங்கள் சேவையகங்களுக்கு அனுப்பப்படுவதில்லை, சேமிக்கப்படுவதில்லை. உலாவித் தரவை அழித்தால் அவை முழுமையாக நீங்கும்.",
    "When you join the network, the handle and phone number you enter are saved only in your own browser (localStorage). They are not sent to or stored on our servers. Clearing your browser data removes them completely.",
  ],
  "site.privacy.location.q": ["இருப்பிடம்", "Location"],
  "site.privacy.location.p": [
    // DRAFT: native review pending
    "பதிவேற்றத்தின்போது தானாகக் கண்டறியப்பட்ட பிரதேச முத்திரையை (நகரப் பெயர் போல)க் காட்டுகிறோம். அது எங்கள் ஹோஸ்டிங் வழங்குநரின் வலையமைப்பு தலைப்புகளிலிருந்து வருகிறது, எங்கள் குறியீடு இயங்குவதற்கு முன்னரே தீர்மானிக்கப்படுகிறது. அந்தத் தோராயமான முத்திரையை மட்டுமே படிக்கிறோம் — உங்கள் IP முகவரியை நாங்கள் ஒருபோதும் படிக்கவோ சேமிக்கவோ முன்னனுப்பவோ மாட்டோம்; துல்லியமான இருப்பிடம் ஒருபோதும் சேகரிக்கப்படுவதில்லை.",
    "We show an auto-detected region label (like a city name) during onboarding. It comes from our hosting provider's network headers, resolved before our code runs. We read only that coarse label — your IP address is never read, stored, or forwarded by us, and no precise location is ever collected.",
  ],
  "site.privacy.links.q": ["இந்தத் தளத்தை விட்டு வெளியேறும் இணைப்புகள்", "Links that leave this site"],
  "site.privacy.links.p": [
    // DRAFT: native review pending
    "WhatsApp, Discord, GitHub இணைப்புகள் உங்களை அவற்றுக்கே உரிய விதிமுறைகளும் தனியுரிமைக் கொள்கைகளும் உள்ள மூன்றாம் தரப்புத் தளங்களுக்கு அழைத்துச் செல்லும். அத்தளங்கள் பொதுவாகப் பயனர்கள் 13 வயதுக்கு (சில பிரதேசங்களில் 16) மேற்பட்டவராக இருக்க வேண்டும் என்று எதிர்பார்க்கின்றன.",
    "The WhatsApp, Discord, and GitHub links take you to third-party platforms with their own terms and privacy policies. Those platforms generally require users to be 13 or older (16 in some regions).",
  ],
  "site.privacy.children.q": ["குழந்தைகள்", "Children"],
  "site.privacy.children.p": [
    // DRAFT: native review pending
    "குழந்தைகள் தளத்தைக் கண்டறிய வரவேற்கப்படுகிறார்கள் — இங்கு கணக்கு தேவைப்படும் எதுவும் இல்லை. நீங்கள் 13 வயதுக்குக் கீழ் இருந்தால், வலையமைப்பிலோ அரட்டைச் சமூகங்களிலோ பெற்றோர் அல்லது பாதுகாவலருடன் மட்டுமே இணையுங்கள்.",
    "Kids are welcome to explore the site — there is nothing here that requires an account. If you are under 13, please only join the network or the chat communities together with a parent or guardian.",
  ],
  "site.privacy.changes.q": ["இது மாறினால்", "If this changes"],
  "site.privacy.changes.p": [
    // DRAFT: native review pending
    "யாழி வெளியீட்டுக்கு முன்னரே உள்ளது. கணக்குகள் சேவையகத்திற்கு மாறினால், எதையும் சேகரிப்பதற்கு முன்பே இந்தப் பக்கத்தைப் புதுப்பித்து, எது எதற்காகச் சேமிக்கப்படுகிறது என்பதைத் துல்லியமாகச் சொல்வோம்.",
    "Yazhi is pre-launch. If accounts ever move to a server, we will update this page before collecting anything, and say exactly what is stored and why.",
  ],
  "site.privacy.contact.q": ["தொடர்பு", "Contact"],
  "site.privacy.contact.p": [
    // DRAFT: native review pending
    "கேள்விகளா? எங்களை அணுகுங்கள்:",
    "Questions? Reach us at",
  ],

  // ── Onboarding / profile chrome (page bodies are in the strings catalogue) ─
  "site.onboarding.nodeRegion": [
    // DRAFT: native review pending
    "Node பிரதேசம்: {region} — தானாகக் கண்டறியப்பட்டது, நகர அளவுக்கு மட்டும் அநாமதேயமாக்கப்பட்டது.",
    "Node region: {region} — auto-detected, anonymized to city level only.",
  ],
  "site.onboarding.detecting": [
    // DRAFT: native review pending
    "Node பிரதேசம் கண்டறியப்படுகிறது…",
    "Detecting node region…",
  ],
  "site.onboarding.developer.nextSteps.1": [
    // DRAFT: native review pending
    "இன்று உருவாக்குநர்கள் ஒருங்கிணைப்பது, கேள்வி கேட்பது, என்ன வெளியாகிறது என்பதைப் பார்ப்பது இங்கேதான்.",
    "That's where developers coordinate today, ask questions, and see what's shipping.",
  ],
  "site.onboarding.developer.nextSteps.2": [
    // DRAFT: native review pending
    "தன்னிச்சையான கணக்கு உருவாக்கம் இன்னும் உருவாகி வருவதால், இவற்றைக் கையால் உருவாக்குகிறோம் (docs/community/PRD-DEVELOPER-COMMUNITY.md). தயாரானதும் WhatsApp/Discord-இல் தொடர்பு கொள்வோம்.",
    "We provision these by hand while self-serve account creation is still being built (tracked in docs/community/PRD-DEVELOPER-COMMUNITY.md). We'll reach out on WhatsApp/Discord once it's ready.",
  ],
  "site.onboarding.developer.stepJoinDiscord": ["Discord-இல் இணைக", "Join the Discord"],
  "site.onboarding.developer.stepApiAccount": ["உங்கள் யாழி API கணக்கு", "Your Yazhi API account"],
  "site.onboarding.developer.stepTwo": [
    // DRAFT: native review pending
    "இங்கிருந்து இரண்டு விஷயங்கள் நடக்கின்றன:",
    "Two things happen from here:",
  ],
};
