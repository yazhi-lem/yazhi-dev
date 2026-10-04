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
  taglineTa: "இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு",
  taglineEn: "Sovereign AI for Indian languages",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
  footerTa: "இறையாண்மைச் செயற்கை நுண்ணறிவு",
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
  titleTa: "வழித்திட்டம்", titleEn: "Roadmap & runway",
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
  bodyTa:
    "யாழி என்பது இந்திய மொழிகளுக்கான இறையாண்மைச் செயற்கை நுண்ணறிவு — இங்கே உருவாக்கப்பட்டு, இங்கேயே உரிமைபெற்று, திறந்த நிலையில் உள்ளது. தமிழ், தெலுங்கு, இந்திக்கு இடையே உரையாடல் தடையின்றி நகரும்; குடும்பங்கள் ஏற்கனவே பயன்படுத்தும் கருவிகளை எளிதில் சென்றடையும். இதன் கீழ் மூன்று படைப்புகள் இயங்குகின்றன: குடும்பங்களுக்கான குரல் தோழன் யாழ்; உள்ளே இயங்கும் அடிப்படை மாதிரி அதன்; நாம் பாதுகாக்கும் அறிவுப் பெட்டகம் திறந்த சங்கம்.",
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
  bodyTa:
    "அதன் என்பது 22+ இந்திய மொழிகளை எட்டும் எமது திறந்த அடிப்படை மாதிரி; ஆங்கிலத்திலிருந்து திணிக்கப்படாமல், ஒட்டுநிலை இலக்கணத்திற்கென பிரத்யேகமாக வடிவமைக்கப்பட்ட டோக்கனைசரைக் கொண்டது. சிவகாசியில் உள்ள எமது சொந்தக் கணினி முனையத்திலிருந்து இயங்கும் திறந்த மூல மாதிரி. இது தொடர்ந்து வளரும் ஓர் உயிரோட்டமான முயற்சி — தரவு பெருகப் பெருக புதிய மொழிகளும் இதில் இணைகின்றன.",
  bodyEn:
    "Adhan is our open Indic foundation model, reaching 22+ Indian languages, with a tokenizer designed for agglutinative grammar rather than retrofitted from English. Open weights on GitHub, served from our own inference node in Sivakasi. It is not finished and is not meant to be — the model develops continuously, growing as the corpus grows and as each new language enters the pipeline.",
  sivakasiTa: {
    title: "சிவகாசி கணினி முனையம்",
    body: "இறையாண்மை கொண்ட இந்திய உள்கட்டமைப்பில் திறந்த மாதிரி. பயிற்சி என்பது ஆக்கிரமிப்பல்ல, பண்படுத்துதல்.",
  },
  sivakasiEn: {
    title: "Sivakasi Inference Node",
    body: "Open weights served on sovereign Indian infrastructure. Training as cultivation, not conquest.",
  },
  tokenTax: {
    labelTa: "இந்திய மொழிகளுக்கான டோக்கன் வரி — ஒரே வாக்கியத்திற்குச் செலவிடப்படும் டோக்கன்கள்",
    labelEn: "The token tax on Indian languages — tokens spent per word, same sentence",
    rows: [
      { lang: "English", langTa: "ஆங்கிலம்", multiplier: "1.0×" },
      { lang: "Hindi", langTa: "இந்தி", multiplier: "2.5×" },
      { lang: "Telugu", langTa: "தெலுங்கு", multiplier: "4.0×" },
      { lang: "Tamil", langTa: "தமிழ்", multiplier: "4.5×" },
    ],
    sourceTa: "பெட்ரோவ் மற்றும் பலர், NeurIPS 2023",
    sourceEn: "Petrov et al., NeurIPS 2023",
  },
  ctaTa: "GitHub இல் காண்க →",
  ctaHref: "https://github.com/yazhi-lem/adhan",
  plainTa: "இந்திய மொழிகளைப் படிக்கவும் பேசவும் கற்றுக்கொண்டே இருக்கும் கணினி மூளை — வேலை இன்னும் முடியவில்லை, தொடர்ந்து வளர்கிறது.",
  plainEn: "A computer brain still learning to read and speak India's languages — the work isn't finished, it keeps growing.",
};

/** Deck p8 — "Tamil first, not Tamil only". */
export const LANGUAGE_ROADMAP = {
  titleTa: "தமிழ் முதலில், தமிழ் மட்டுமல்ல", titleEn: "Tamil first, not Tamil only",
  steps: [
    {
      stageTa: "இப்போது",
      stageEn: "Now",
      langTa: "தமிழ்",
      langEn: "Tamil",
      bodyTa: "எமது தாய்மொழி மற்றும் கடினமான களப்பரீட்சை. மொழித்தரவு, டோக்கனைசர், குரல் மற்றும் முன்னோடிக் குடும்பங்கள் அனைத்தும் இங்கே வாழ்கின்றன.",
      bodyEn: "Our home language and hardest test case. Corpus, tokenizer, voice and the first families all live here.",
    },
    {
      stageTa: "அடுத்து",
      stageEn: "Next",
      langTa: "தெலுங்கு",
      langEn: "Telugu",
      bodyTa: "~96M பேசுவோர், தமிழைப் போன்றே ஒட்டுநிலை இலக்கணம், அதே டோக்கனைசர் சவால் — இயற்கையான இரண்டாவது மொழி.",
      bodyEn: "~96M speakers, agglutinative like Tamil, the same tokenizer problem — the natural second language.",
    },
    {
      stageTa: "பின்னர்",
      stageEn: "Then",
      langTa: "கன்னடம், மலையாளம்",
      langEn: "Kannada, Malayalam",
      bodyTa: "திராவிட மொழிக் குடும்பத்தின் எஞ்சிய மொழிகள் — பகிரப்பட்ட சொல்லமைப்பால் பொதுவான டோக்கனைசர் பலன்கள்.",
      bodyEn: "The rest of the Dravidian family — shared morphology means shared tokenizer gains.",
    },
    {
      stageTa: "இலக்கு",
      stageEn: "Goal",
      langTa: "22+ மொழிகள்",
      langEn: "22+ languages",
      bodyTa: "ஒரே திறந்த மாதிரி, ஒரே நிரலாக்க இடைமுகம் (API), அனைத்து அட்டவணைப்படுத்தப்பட்ட மொழிகளும். அதன் தொடக்கத்திலிருந்தே இதற்கெனவே வடிவமைக்கப்பட்டது.",
      bodyEn: "One open model, one API, every scheduled language. Adhan is designed for this from day one.",
    },
  ],
  footTa:
    "தமிழும் தெலுங்கும் திராவிட இலக்கண அடித்தளத்தையும் அதே டோக்கனைசர் சவாலையும் பகிர்ந்துகொள்கின்றன. தமிழைச் சரியாகத் தீர்ப்பது தெலுங்கிற்கான திசைதிருப்பல் அல்ல — அதுவே பணியின் பெரும்பகுதி.",
  footEn:
    "Tamil and Telugu share a Dravidian grammar backbone and the same tokenizer problem. Solving Tamil properly is not a detour on the way to Telugu — it is most of the work.",
};

/** Deck p5 — "Yazh's world · திணை — Five landscapes, five moods". */
export const THINAI_WORLD = {
  eyebrowTa: "யாழின் உலகம் · திணை", eyebrowEn: "Yazh's world · Thinai",
  titleTa: "ஐந்து நிலம், ஐந்து உரிப்பொருள்", titleEn: "Five landscapes, five moods",
  landscapes: [
    {
      key: "kurinji",
      ta: "குறிஞ்சி",
      en: "Kurinji",
      moodTa: "மலை · முதல் சந்திப்பு",
      moodEn: "Mountains · first meetings",
      bodyTa: "கண்டுபிடிப்பும் புதுமையும் — ஒரு கதை தொடங்கும் இடம். மலை முகடுகள், அருவிகள், 12 ஆண்டுக்கு ஒருமுறை பூக்கும் குறிஞ்சி மலர்.",
      bodyEn: "Curiosity and discovery — where a story starts. Mountain peaks, cascading waterfalls, and the rare 12-year Kurinji bloom.",
    },
    {
      key: "mullai",
      ta: "முல்லை",
      en: "Mullai",
      moodTa: "காடு · காத்திருத்தல்",
      moodEn: "Forest · waiting",
      bodyTa: "விலங்குகள், அமைதி மற்றும் குழந்தைகள் அறிந்த நாட்டுப்புறக் கதைகள். அமைதியான மேய்ச்சல் மரங்கள், மாலை நேரத்து அடுப்பு, மின்மினிப் பூச்சிகள்.",
      bodyEn: "Animals, patience and the folk tales children know. Whispering pastoral trees, twilight hearths, and drifting fireflies.",
    },
    {
      key: "marutham",
      ta: "மருதம்",
      en: "Marutham",
      moodTa: "வயல் · அன்றாட வாழ்வு",
      moodEn: "Farmland · everyday life",
      bodyTa: "கணக்கு, உழைப்பு மற்றும் குடும்பம் — பாடங்கள் வாழும் பூமி. வளமான ஆற்றுப் படுகைகள், வயல் வரப்புகள், பொன் தானிய அறுவடை.",
      bodyEn: "Counting, work and family — where lessons live. Fertile river deltas, terraced paddy fields, and golden grain harvest.",
    },
    {
      key: "neytal",
      ta: "நெய்தல்",
      en: "Neytal",
      moodTa: "கடற்கரை · பிரிவு/ஏக்கம்",
      moodEn: "Coast · longing",
      bodyTa: "பயணங்களும் தொலைவும் — புலம்பெயர்ந்தோரின் நிலப்பரப்பு. கடல் அலைகள், ஒளிரும் கடல் நுரை, தொலைதூரக் கரையின் அழைப்பு.",
      bodyEn: "Voyages and distance — the diaspora's landscape. Oceanic horizons, bioluminescent tides, and the call of far shores.",
    },
    {
      key: "palai",
      ta: "பாலை",
      en: "Palai",
      moodTa: "பாலைவனம் · உறுதி/துணிவு",
      moodEn: "Drylands · endurance",
      bodyTa: "துணிவும் பிரிவும் — வாழ்வின் கடினமான கதைகள். மணல் திட்டுகள், பாறைப் பள்ளத்தாக்குகள், வீரர்களின் அஞ்சா நெஞ்சம்.",
      bodyEn: "Courage and separation — the harder stories. Sun-sculpted sand dunes, canyon rocks, and the traveler's unbreakable fortitude.",
    },
  ],
  footTa:
    "சங்க இலக்கியம் உலகை இந்த ஐந்திணைகளாகப் பிரிக்கிறது. யாழின் கதைக் களமும் இதே மரபில் கட்டமைக்கப்பட்டுள்ளது — இது மேலோட்டமான அலங்காரமல்ல, வேரிலேயே தமிழாக வேரூன்றிய வடிவம்.",
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
  eyebrowTa: "இல்லங்கள் பயன்படுத்துவது",
  eyebrowEn: "What families pay for",
  subTa: "குழந்தைகளுக்கான குரல் நண்பன் — WhatsApp இல்",
  subEn: "A voice AI friend for children aged 4–8, on WhatsApp",
  bodyTa:
    "தென்னகக் கோவில் தூண்களில் செதுக்கப்பட்டுள்ள காவல் உயிரினம் யாழ் — வாயிலில் நின்று உள்ளே இருப்பவற்றைப் பாதுகாக்கும். நான்கு வயதுக் குழந்தை பேசும் அளவுக்கு எளிமையாக வரையப்பட்ட காவலாளி தான் இந்த யாழ். குழந்தைகளின் பேச்சைக் கேட்டு தாய்மொழியிலேயே பதிலளிக்கும்; படிக்கவோ தட்டச்சு செய்யவோ கேட்காது. குடும்பங்கள் ஏற்கனவே வைத்திருக்கும் போனில் WhatsApp வழியாகக் குரல் வழி உரையாடல். நாட்டுப்புறக் கதைகளுடன் கணிதம், அறிவியல், ஆங்கிலம் அனைத்தும் பேச்சினூடே கற்பிக்கப்படும்.",
  bodyEn:
    "Yazh is a guardian creature carved onto temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. Yazh is that guardian, drawn small enough for a four-year-old to talk to. He listens, answers in the child's mother tongue, and never asks them to read or type. Voice in, voice out — no app, no typing, on the phone families already own. Folk stories plus Maths, Science and English through conversation.",
  ctaTa: "தொடங்குக",
  ctaEn: "Get started",
  ctaHref: "/onboarding",
  whatsappCtaTa: "WhatsApp இல் உரையாடுக",
  whatsappCtaEn: "Chat on WhatsApp",
  whatsappNoteTa: "தற்போது ஹைதராபாத்தைச் சுற்றியுள்ள 30+ முன்னோடி இல்லங்களுடன் தனி முன்னோட்டத்தில் — இணைந்து புதுப்பிப்புகளைப் பெறுக.",
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
  bodyTa:
    "செம்மொழி இலக்கியத்திற்கான திறந்த தளம் — சங்கப் பாடல்கள், செய்யுள் ஆய்வு, திணை வகைப்பாடு மற்றும் மொழியியல் ஆய்வுடன். மாணாக்கர்க்கும் ஆசிரியர்க்கும் ஆய்வாளர்க்கும் இலவசம். இதுவே அதன் மாதிரிக்கு உண்மையான மொழி எவ்வாறு ஒலிக்கும் என்பதைக் கற்பிக்கும் மூலத் தரவுத்தொகுப்பு.",
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
  plainTa: "2,000 ஆண்டு பழைய தமிழ்ப் பாடல்களைப் படித்து, ஒவ்வொன்றும் எந்த நிலத்தைச் சேர்ந்தது என்று சொல்லும் கருவி — மாணாக்கர்க்கும் ஆசிரியர்க்கும் கட்டணமின்றி.",
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
  verseEn: `Surging waves bound the wide expanse,
Resounding seas set the earth's shore.
Honeycombs hang high upon towering peaks,
Mountains rise tall in the vast cosmos.
Strong winds whirl across cosmic directions,
Bright stars traverse their destined paths.
The crimson sun brings forth the day,
The pale moon commands the night.
Free of haze, their brilliance shines forth,
Rains descend and nurture the earth.
For one seed sown, a thousand yield,
Land and groves flourish with abundance,
Free of illness, clear vision prevails.`,
  uraiTa:
    "ஓங்கி எழும் அலைகளைக் கொண்ட பரந்த கடலை எல்லையாகக் கொண்ட இவ்வுலகில், தேன்கூடுகள் தொங்கும் உயர்ந்த சிகரங்களையுடைய மலைகள் ஓங்கி நிற்கின்றன. பரந்த வானில் காற்று சுழன்று வீச, விண்மீன்கள் தத்தம் வழியில் ஒழுங்காக இயங்குகின்றன. பகலைச் செய்யும் செம்பரிதியும், இரவைச் செய்யும் வெண்மதியும் தவறாது தோன்றி ஒளிர்கின்றன. மழை பொழிந்து வளம் சேர்க்க, விதைத்த ஒரு விதை ஆயிரம் விளைச்சலைத் தருகிறது. நிலமும் மரங்களும் நற்பயனைத் தருகின்றன. இயற்கையின் இத்துணையால் மக்கள் மனதில் துன்பமே இன்றி எவரும் தீங்கு செய்யாது வாழ்கின்றனர்.",
  translationEn:
    "The sea holds a surging, wave-tossed expanse. Within the world it bounds, mountains rise with high peaks hung with honeycombs. Across the vast sky the wind circles with force, and the stars — vaster than anything else — travel each in its own path. Both the sun that lights the day and the moon that lights the night appear without fail and shine. The rain has fallen and the land has grown rich: sow one seed and it yields a thousand, and both the sown earth and the unsown trees bear good fruit. Because nature helps in this way, no suffering is to be seen even in people's minds — no one does harm.",
  sourceTa: "தொடக்கப் பாடல் · திறந்த சங்கத் தரவுத்தொகுப்பு",
  sourceEn: "Opening passage · open-sangam corpus",
};

export const SERVICES = [
  { ta: "முகவர்கள்", en: "Agents" },
  { ta: "செயலிகள்", en: "Applications" },
  { ta: "உரைகள்", en: "Annotations" },
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
    ta: "பணிகள்", en: "Services",
    items: [
      { ta: "முகவர்கள்", en: "Agents", href: "#services" },
      { ta: "செயலிகள்", en: "Applications", href: "#services" },
      { ta: "உரைகள்", en: "Annotations", href: "#services" },
    ],
  },
  {
    ta: "மன்றம்", en: "Community",
    items: [
      { ta: "வலையில் சேருக", en: "Join the Network", href: "/onboarding" },
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
  heroEyebrow: { ta: "குறிஞ்சி · மலை — 22+ எழுத்துமுறைகள், ஒற்றை மாதிரி", en: "Kurinji · Mountains — 22+ scripts, one model" },
  comingSoon: { ta: "விரைவில்", en: "Coming soon" },
  servicesLabel: { ta: "பணிகள்", en: "Services" },
  scrollCue: { ta: "கீழே உருட்டி ஆராய்க", en: "scroll to explore" },
  adhanCtaEn: "View Adhan on GitHub →",
};

export const COMMUNITY = {
  titleTa: "மன்றம்", titleEn: "Community",
  subTa: "கடல் கடந்த தமிழ் — வலையில் சேருக", subEn: "Tamil across the seas — join the network",
  plainTa: "தமிழையும் கணினியையும் விரும்பும் நாங்கள் இணைந்து இதை உருவாக்குகிறோம் — நீங்களும் வரலாம்.",
  plainEn: "Real people who love Tamil and computers, building this together — you're welcome to join.",
  chatAgeTa: "மன்றத் தளங்கள் (Discord) 13+ வயதினருக்கு — குழந்தைகள் பெற்றோருடன் சேருக.",
  chatAgeEn: "Chat platforms (Discord) require age 13+ — kids, join with a parent.",
  discord: {
    titleTa: "Discord · நேரலை மன்றம்",
    titleEn: "Discord · Town Square",
    bodyTa: "அன்றாட நேரலை உரையாடல் — தமிழ்ச் செயற்கை நுண்ணறிவு உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.",
    bodyEn: "The daily live conversation — Tamil AI builders, researchers, translators, and writers.",
    href: "https://discord.gg/yazhi",
    label: "discord.gg/yazhi →",
  },
  github: {
    titleTa: "GitHub · திறந்த மூலக் களஞ்சியம்",
    titleEn: "GitHub · Open Repositories",
    bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.",
    bodyEn: "The open work — model weights, evaluation suites, Indic tokenizers, and benchmark tooling.",
    href: "https://github.com/yazhi-lem",
    label: "github.com/yazhi-lem →",
  },
  cards: [
    { ta: "வலையில் சேருக", en: "Join the Network", bodyTa: "பங்களிப்பாளர்கள், விளக்கமிடுபவர்கள், உருவாக்குநர்களுக்கான நுழைவு.", bodyEn: "Onboarding for contributors, annotators, and builders.", href: "/onboarding", label: "/onboarding →", external: false },
    { ta: "Discord", en: "Discord", bodyTa: "அன்றாட உரையாடல் — தமிழ்ச் செயற்கை நுண்ணறிவு உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.", bodyEn: "The daily conversation — Tamil AI builders, researchers, and writers.", href: "https://discord.gg/yazhi", label: "discord.gg/yazhi →", external: true },
    { ta: "GitHub", en: "GitHub", bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.", bodyEn: "The open work — models, tooling, and evaluation suites.", href: "https://github.com/yazhi-lem", label: "github.com/yazhi-lem →", external: true },
  ],
};

/** Unified Contributor & Developer Track: combines the previous redundant
    "Join the Network" card with the "Build for your mother tongue" developer track. */
export const DEVELOPERS = {
  eyebrowTa: "வலையமைப்பு & உருவாக்குநர்கள்",
  eyebrowEn: "Builder & Developer Network",
  titleTa: "உங்கள் தாய்மொழிக்காக உருவாக்குங்கள்",
  titleEn: "Build for your mother tongue",
  subTa: "பங்களிப்பாளர்கள், மொழி விளக்கமிடுபவர்கள், உருவாக்குநர்களுக்கான ஒருங்கிணைந்த தளம்",
  subEn: "Unified onboarding for contributors, annotators, and builders across India",
  bodyTa:
    "நாங்கள் பேச வளர்ந்த தாய்மொழிகளுக்கான செயற்கை நுண்ணறிவை உருவாக்கும் மென்பொருள் உருவாக்குநர்கள், மொழியியலாளர்கள் மற்றும் ஆய்வாளர்களின் இறையாண்மை வாய்ந்த சமூகம். அதன் மாதிரியின் திறந்த எடைகள் அல்லது யாழி ஏபிஐ (API) மூலம் தொடங்குங்கள், சங்கத் தரவுகளை முறைப்படுத்துங்கள், தாய்மொழி முகவர்களை உருவாக்குங்கள்.",
  bodyEn:
    "A sovereign community of developers, annotators, linguists, and researchers across India building AI for the languages we grew up speaking. Start on Adhan's open weights or the Yazhi API, curate Sangam datasets, ship native language agents, and build alongside engineers who've done the same.",
  plainTa: "இந்தியா முழுவதும் உள்ள உருவாக்குநர்கள் தங்கள் தாய்மொழிக்காகச் செயற்கை நுண்ணறிவுக் கருவிகளை வடிவமைக்கிறார்கள் — நீங்களும் இணையலாம்.",
  plainEn: "Developers and annotators across India building AI tools for their own mother tongues — you're welcome to join in.",
  ctaTa: "வலையமைப்பில் இணைக",
  ctaEn: "Join the Network & Builder Track →",
  ctaHref: "/onboarding?track=developer",
};
