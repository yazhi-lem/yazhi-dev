/* ============================================================
   HOME COPY — single source of truth. Tamil first.

   The home page tells one story and asks one thing:
     1. the verse — Maduraikanchi's opening, as an experience;
     2. the problem — India's languages are at the back of the line in AI;
     3. the movement — who Yazhi is, how it works, its five rules;
     4. what it is building — quietly: three names, three demos;
     5. the 2026 roadmap — one fishbone, every launch clickable;
     6. the ask — build it with us.
   Project detail (and enquiries) live on /projects/[slug], read from
   src/lib/projects.ts.

   - Tamil is written first and natively; English is the gloss.
   - One register: standard written Tamil; button CTAs in the -க form.
   - "Sovereign" = தற்சார்பு. Latin names take hyphenated case endings
     (Discord-இல்).
   - Every factual claim names its source (Aram 1). The three "articles"
     are drafts and say so; the full pieces are still being written.
   - TAMIL IS A DRAFT until a native-speaker review signs it off.
   ============================================================ */

import type { BiText } from "@/lib/projects";

export type ThinaiKey = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";

/** Thinai that tint the page as each section scrolls into view
    (ThinaiTheme). Verse — neytal, the sea it opens on; problem — palai, the hard land; movement — kurinji, new
    beginnings; build — neytal, the sea Yazh is named for; roadmap —
    marutham, settled work; join — mullai, patience and community. */
export const THINAI: { key: ThinaiKey; ta: string; en: string; section: string }[] = [
  { key: "neytal", ta: "நெய்தல்", en: "Neytal", section: "verse" },
  { key: "palai", ta: "பாலை", en: "Palai", section: "problem" },
  { key: "kurinji", ta: "குறிஞ்சி", en: "Kurinji", section: "movement" },
  { key: "neytal", ta: "நெய்தல்", en: "Neytal", section: "build" },
  { key: "marutham", ta: "மருதம்", en: "Marutham", section: "roadmap" },
  { key: "mullai", ta: "முல்லை", en: "Mullai", section: "join" },
];

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  footerTa: "தற்சார்புச் செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  copyright: "© 2026 யாழி • Yazhi",
};

export const HERO = {
  eyebrowTa: "யாழி · இந்திய மொழிகளுக்கான தற்சார்புச் செயற்கை நுண்ணறிவு இயக்கம்",
  eyebrowEn: "Yazhi · a movement for sovereign AI in India's languages",
  titleTa: "இன்றைய செயற்கை நுண்ணறிவு ஆங்கிலத்தில் சிந்திக்கிறது.",
  titleEn: "Today's AI thinks in English.",
  leadTa: "நம் மொழிகளுக்கான செயற்கை நுண்ணறிவை நாமே உருவாக்குவோம் — தமிழில் தொடங்கி.",
  leadEn: "Let's build AI for our own languages, ourselves — starting with Tamil.",
  primaryTa: "சேர்ந்து உருவாக்குக",
  primaryEn: "Build with us",
  primaryHref: "#join",
  secondaryTa: "2026 வழித்தடம்",
  secondaryEn: "The 2026 roadmap",
  secondaryHref: "#roadmap",
};

/** The opening of Maduraikanchi, as an experience: three lines rise one
    by one as you scroll, over the land they describe — towering waves,
    the roaring sea as the boundary, peaks where honeycombs hang. The
    verse is the poem's own; the glosses are ours and are drafts until a
    scholar signs them off (the same gate as Open Sangam's 14 November
    release). Standard editions join some of these words
    (ஓங்குதிரை வியன்பரப்பின்); the spacing here eases reading and also
    awaits that review. */
export const VERSE = {
  lines: [
    {
      ta: "ஓங்கு திரை வியன் பரப்பின்",
      glossTa: "உயர்ந்தெழும் அலைகளையுடைய அகன்ற பரப்பின்",
      glossEn: "of the wide expanse of towering waves",
    },
    {
      ta: "ஒலி முந்நீர் வரம் பாகத்",
      glossTa: "முழங்கும் கடலே எல்லையாக",
      glossEn: "with the roaring sea as its boundary",
    },
    {
      ta: "தேன் தூங்கும் உயர் சிமைய",
      glossTa: "தேனடைகள் தொங்கும் உயர்ந்த சிகரங்களையுடைய",
      glossEn: "with lofty peaks where honeycombs hang",
    },
  ],
  sourceTa: "மதுரைக்காஞ்சி 1–3 · மாங்குடி மருதனார் · பத்துப்பாட்டு · பொருள் விளக்கம்: வரைவு",
  sourceEn: "Maduraikanchi 1–3 · Mangudi Marudanar · Pattuppattu · glosses: draft",
  bridgeTa: "சங்க காலத்திலேயே இப்படி எழுதிய மொழி இது. இன்றைய செயற்கை நுண்ணறிவு இதைப் புரிந்துகொள்ள வேண்டும்.",
  bridgeEn: "A language that wrote like this in the Sangam age. Today's AI should understand it.",
  readTa: "Open Sangam-இல் முழுப் பாடலையும் படிக்க",
  readEn: "Read the whole poem on Open Sangam",
  readHref: "/projects/open-sangam",
};

export type Article = {
  key: string;
  title: BiText;
  body: BiText;
  /** the one source the article's claim rests on */
  source: { label: string; href: string };
  /** what we are doing about it */
  answer: BiText & { href: string };
};

/** The problem, as three short draft articles. */
export const PROBLEM = {
  eyebrowTa: "சிக்கல்", eyebrowEn: "The problem",
  titleTa: "செயற்கை நுண்ணறிவில் நம் மொழிகள் வரிசையின் கடைசியில்",
  titleEn: "In AI, our languages are at the back of the line",
  leadTa: "இந்திய மொழிகள் பேசும் கோடிக்கணக்கானோருக்கு இது மூன்று வகையில் விலை கேட்கிறது.",
  leadEn: "For the hundreds of millions who speak India's languages, that costs us in three ways.",
  draftTa: "கட்டுரை வரைவு", draftEn: "Draft article",
  sourceTa: "ஆதாரம்", sourceEn: "Source",
  answerTa: "நம் பதில்", answerEn: "Our answer",
  articles: [
    {
      key: "token-tax",
      title: { ta: "டோக்கன் வரி", en: "The token tax" },
      body: {
        ta: "செயற்கை நுண்ணறிவுச் சேவைகள் டோக்கன் கணக்கில் கட்டணம் வசூலிக்கின்றன. அதே பொருளைச் சொல்லப் பல இந்திய மொழிகளுக்கு ஆங்கிலத்தைவிடப் பல மடங்கு அதிக டோக்கன்கள் தேவைப்படுகின்றன — அதனால் அதிகச் செலவு, மெதுவான பதில், ஒரே நேரத்தில் குறைவான உரை.",
        en: "AI services charge by the token. Saying the same thing takes many Indian languages several times more tokens than English — so it costs more, answers more slowly, and less text fits at once.",
      },
      source: {
        label: "Petrov et al., “Language Model Tokenizers Introduce Unfairness Between Languages”, NeurIPS 2023",
        href: "https://arxiv.org/abs/2305.15425",
      },
      answer: { ta: "ஆதன் — தமிழ் எழுத்தை அலகாகக் கொண்ட டோக்கனைசர்", en: "Adhan — a tokenizer built on Tamil letters", href: "/projects/adhan" },
    },
    {
      key: "data-gap",
      title: { ta: "தரவு இடைவெளி", en: "The data gap" },
      body: {
        ta: "செயற்கை நுண்ணறிவுக்கான தரவும் ஆய்வும் ஒரு சில மொழிகளிலேயே குவிந்துள்ளன; இந்தியாவின் பெரும்பாலான மொழிகள் வெகுவாகப் பின்தங்கியுள்ளன. குறைந்த தரவில் பயின்ற மாதிரிகள் நம் இலக்கணத்தையும் மரபுத் தொடர்களையும் தவறவிடுகின்றன.",
        en: "The data and research behind AI are concentrated in a handful of languages; most of India's languages are left far behind. Models trained on so little miss our grammar and our idioms.",
      },
      source: {
        label: "Joshi et al., “The State and Fate of Linguistic Diversity and Inclusion in the NLP World”, ACL 2020",
        href: "https://aclanthology.org/2020.acl-main.560/",
      },
      answer: { ta: "Open Sangam — சரிபார்த்த, திறந்த உரைத் தொகுப்பு", en: "Open Sangam — a verified, open corpus", href: "/projects/open-sangam" },
    },
    {
      key: "whose-data",
      title: { ta: "தரவு யாருடையது?", en: "Whose data is it?" },
      body: {
        ta: "நம் உரையாடல்களும் ஆவணங்களும் வெளிநாட்டுச் சேவையகங்களுக்குச் சென்றால், அவற்றின் மீதான கட்டுப்பாடு நம் கையை விட்டுப் போகிறது. தனிநபர் தரவைக் கையாள்வோரை இந்தியச் சட்டம் இப்போது பொறுப்பாளிகளாக்குகிறது — பள்ளிகளும் மருத்துவமனைகளும் நீதிமன்றங்களும் தங்கள் தரவைத் தங்களிடமே வைத்திருக்கும் வழி வேண்டும்.",
        en: "When our conversations and documents go to servers abroad, control over them leaves our hands. Indian law now holds whoever processes personal data accountable — schools, hospitals and courts need a way to keep their data with them.",
      },
      source: {
        label: "Digital Personal Data Protection Act, 2023 — Ministry of Electronics and IT",
        href: "https://www.meity.gov.in/",
      },
      answer: { ta: "குரு — நிறுவனத்தின் கணினியிலேயே இயங்கும்", en: "Guru — runs on the institution's own machine", href: "/projects/guru" },
    },
  ] satisfies Article[],
};

/** The movement: who Yazhi is, how it works, and the five rules (அறம்)
    it holds itself to. Yazhi 2030 is one line, at the end. */
export const MOVEMENT = {
  eyebrowTa: "இயக்கம்", eyebrowEn: "The movement",
  titleTa: "யாழி ஒரு மக்கள் இயக்கம்",
  titleEn: "Yazhi is a people's movement",
  leadTa: "நம் மொழிகளுக்கான செயற்கை நுண்ணறிவை, நாமே, சேர்ந்து, திறந்த முறையில் கட்டும் இயக்கம். தன்னார்வலர்களால் நடத்தப்படுகிறது; தமிழில் தொடங்குகிறது; இந்தியாவின் அத்துணை மொழிகளையும் நோக்கிச் செல்கிறது.",
  leadEn: "A movement to build AI for our languages ourselves — together, and in the open. Run by volunteers; beginning in Tamil; headed for every language of India.",
  howTa: "எப்படி இயங்குகிறோம்", howEn: "How we work",
  pillars: [
    {
      headTa: "தற்சார்பு", headEn: "Sovereign",
      bodyTa: "நம் மொழி, நம் தரவு, நம் சேவையகங்கள். தரவு நாட்டை விட்டு வெளியேறாது.",
      bodyEn: "Our language, our data, our servers. Data does not leave the country.",
    },
    {
      headTa: "உருவாக்கும் பண்பாடு", headEn: "A builder culture",
      bodyTa: "பயன்படுத்துபவர்களாக மட்டும் இல்லாமல், உருவாக்குபவர்களாக. மாணவர், ஆசிரியர், மொழியறிஞர், உருவாக்குநர், பெற்றோர் — ஒவ்வொருவரும் ஒரு பகுதியைக் கட்டுகிறோம்.",
      bodyEn: "Builders, not only users. Students, teachers, linguists, developers and parents — each of us builds a piece.",
    },
    {
      headTa: "திறந்த பணி", headEn: "Work in the open",
      bodyTa: "குறியீடு GitHub-இல் அனைவருக்கும் திறந்திருக்கிறது; அறிஞர்களும் ஆசிரியர்களும் சரிபார்க்கிறார்கள்; முடிவுகள் வெளிப்படையாக.",
      bodyEn: "Code open to all on GitHub; checked by scholars and teachers; decisions made in public.",
    },
  ],
  aramTa: "எங்கள் அறம் — ஐந்து விதிகள்", aramEn: "Our code — five rules",
  aram: [
    {
      nameTa: "மெய்ப்பொருள்", nameEn: "Truth",
      ruleTa: "ஆதாரம் இல்லாமல் எதையும் சொல்வதில்லை; தெரியாவிட்டால் «தெரியவில்லை» என்கிறோம்.",
      ruleEn: "No claim without a source; when we don't know, we say so.",
    },
    {
      nameTa: "தற்சார்பு", nameEn: "Sovereignty",
      ruleTa: "தரவு நாட்டை விட்டு வெளியேறுவதை மீறும் எதிலும் யாழியின் பெயர் இருக்காது.",
      ruleEn: "Nothing that sends data out of the country carries Yazhi's name.",
    },
    {
      nameTa: "எண்ணித் துணிக", nameEn: "Think, then act",
      ruleTa: "செயல்முறை ஏடும் மனித ஒப்புதலும் இன்றி எந்த அமைப்பையும் மாற்றுவதில்லை.",
      ruleEn: "No system is changed without a runbook and a person's confirmation.",
    },
    {
      nameTa: "குழந்தை காப்பு", nameEn: "Children first",
      ruleTa: "சட்ட ஒப்புதலும் சரிபார்த்த பெற்றோர் ஒப்புதலும் இன்றி எந்தக் குழந்தையும் யாழைப் பயன்படுத்தாது.",
      ruleEn: "No child uses Yazh before legal sign-off and a verified parent's consent.",
    },
    {
      nameTa: "சொல்லிய வண்ணம் செயல்", nameEn: "Do as we say",
      ruleTa: "திட்டத்தை முடிந்ததாகச் சொல்வதில்லை; வரைவு என்றால் வரைவு என்றே குறிக்கிறோம்.",
      ruleEn: "We never present a plan as done; a draft is marked as a draft.",
    },
  ],
  visionTa: "யாழி 2030: தமிழில் தொடங்கி, இந்தியாவின் அத்துணை மொழிகளுக்கும்.",
  visionEn: "Yazhi 2030: starting with Tamil, for every language of India.",
};

/** What the movement is building — kept quiet on home: a name, a line
    and a demo each. The detail lives on /projects. */
export const BUILD = {
  eyebrowTa: "இயக்கம் உருவாக்குபவை", eyebrowEn: "What the movement is building",
  order: ["adhan", "yazh", "open-sangam"],
  allTa: "எல்லாத் திட்டங்களும்", allEn: "All projects",
  detailsTa: "முழு விவரம்", detailsEn: "Full details",
};

/** The 2026 launch line — one fishbone; nodes come from PROJECTS. */
export const ROADMAP_COPY = {
  eyebrowTa: "வழித்தடம்", eyebrowEn: "Roadmap",
  titleTa: "2026: பன்னிரண்டு வெளியீடுகள்",
  titleEn: "2026: twelve launches",
  leadTa: "ஒவ்வொரு புள்ளியையும் தொட்டுப் பாருங்கள் — என்ன, எப்போது, எந்த நிபந்தனையில்.",
  leadEn: "Tap any point — what it is, when, and the condition it must meet first.",
  gateTa: "வெளியீட்டு நிபந்தனை", gateEn: "Launch gate",
  closeTa: "மூடுக", closeEn: "Close",
};

export const LINKS = {
  discord: "https://discord.gg/yazhi",
  github: "https://github.com/yazhi-lem",
  sangam: "https://sangam.yazhi.dev",
  whatsapp: "https://chat.whatsapp.com/G0sWRof4Z4cFXXY6Gmavmu",
  onboarding: "/onboarding",
};

/** The ask: everyone has a piece to build. */
export const JOIN = {
  titleTa: "சேர்ந்து உருவாக்குவோம்",
  titleEn: "Build it with us",
  bodyTa: "யாழி ஒரு கூட்டு முயற்சி. உங்களுக்கும் இங்கே ஒரு பணி காத்திருக்கிறது.",
  bodyEn: "Yazhi is a collective. There is a piece of it waiting for you.",
  roles: [
    {
      ta: "உருவாக்குநர்", en: "Developer",
      doTa: "குறியீடு எழுதுக — ஆதன், Open Sangam, இலக்கியா மூன்றும் GitHub-இல் திறந்திருக்கின்றன.",
      doEn: "Write code — Adhan, Open Sangam and Illakiya are all open on GitHub.",
      href: "/onboarding?track=developer",
    },
    {
      ta: "மொழியறிஞர்", en: "Linguist",
      doTa: "பாடல்களையும் உரைகளையும் சரிபார்க்க உதவுக.",
      doEn: "Help verify verses and their prose renderings.",
      href: "/projects/open-sangam#enquiry",
    },
    {
      ta: "ஆசிரியர்", en: "Teacher",
      doTa: "உங்கள் வகுப்பறையில் சோதித்து, எது பயன்படுகிறது என்று சொல்லுக.",
      doEn: "Try it in your classroom and tell us what works.",
      href: "/projects/guru#enquiry",
    },
    {
      ta: "எழுத்தாளர்", en: "Writer",
      doTa: "தெளிவான, சரியான தமிழில் உள்ளடக்கம் எழுதுக.",
      doEn: "Write clear, correct Tamil content.",
      href: "/onboarding",
    },
    {
      ta: "பெற்றோர்", en: "Parent",
      doTa: "யாழ் முன்னோட்டத்துக்கு உங்கள் குடும்பத்தைப் பதிவு செய்க.",
      doEn: "Sign your family up for the Yazh closed beta.",
      href: "/projects/yazh#enquiry",
    },
  ],
  ctas: [
    { ta: "எங்களுடன் சேருக", en: "Join us", href: "/onboarding", external: false, primary: true },
    { ta: "Discord-இல் சேருக", en: "Join the Discord", href: LINKS.discord, external: true, primary: false },
    { ta: "GitHub-இல் காண்க", en: "See it on GitHub", href: LINKS.github, external: true, primary: false },
  ],
  ageTa: "WhatsApp, Discord உரையாடல்கள் 13 வயது நிரம்பியவர்களுக்கு மட்டும் — சிறுவர்கள் பெற்றோருடன் சேருக.",
  ageEn: "WhatsApp and Discord are for ages 13 and up — kids, join with a parent.",
};

/** Top bar links and the grouped menu used by the mobile nav and the
    footer columns. Home anchors are written "/#…" so they also work
    from the project pages. */
export const NAV_TOP = [
  { ta: "சிக்கல்", en: "Problem", href: "/#problem" },
  { ta: "இயக்கம்", en: "Movement", href: "/#movement" },
  { ta: "வழித்தடம்", en: "Roadmap", href: "/#roadmap" },
  { ta: "சேருக", en: "Join", href: "/#join" },
];

export const NAV_GROUPS = [
  {
    ta: "யாழி", en: "Yazhi",
    items: [
      { ta: "சிக்கல்", en: "The problem", href: "/#problem" },
      { ta: "இயக்கம்", en: "The movement", href: "/#movement" },
      { ta: "வழித்தடம்", en: "Roadmap", href: "/#roadmap" },
      { ta: "எல்லாத் திட்டங்களும்", en: "All projects", href: "/projects" },
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
