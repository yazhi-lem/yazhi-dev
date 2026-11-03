import type { Bi } from "@yazhi/workspace/types";

/** Guru's demo fixtures. Synthetic: the GuruBooks are "[Sample]" local
    copies, page numbers are illustrative, aspirants are counts not people.
    The facts are the standard school-textbook ones; their Tamil is an AI
    draft (†) until Kabilar signs it off. */

export interface GuruBook {
  id: string;
  title: Bi;
  sources: Bi;
  pages: number;
  state: "indexed" | "reading";
}

export const BOOKS: GuruBook[] = [
  {
    id: "g4",
    title: { ta: "TNPSC குரூப் IV — பொது அறிவு", en: "TNPSC Group IV — General Studies" },
    sources: { ta: "உள்ளூர் நகல்: [மாதிரி] 6–10 சமூக அறிவியல் · நிறுவனக் குறிப்புகள்", en: "Local copies: [Sample] Std 6–10 Social Science · institute notes" },
    pages: 312,
    state: "indexed",
  },
  {
    id: "g2",
    title: { ta: "TNPSC குரூப் II/IIA — இந்திய அரசியலமைப்பு", en: "TNPSC Group II/IIA — Indian Polity" },
    sources: { ta: "உள்ளூர் நகல்: [மாதிரி] 11–12 அரசியல் அறிவியல்", en: "Local copies: [Sample] Std 11–12 Political Science" },
    pages: 248,
    state: "indexed",
  },
  {
    id: "notes",
    title: { ta: "நிறுவனக் குறிப்புகள் — அலகு 8", en: "Institute notes — Unit 8" },
    sources: { ta: "ஆசிரியர் பதிவேற்றியவை", en: "Uploaded by a teacher" },
    pages: 36,
    state: "reading",
  },
];

export interface BookPage {
  id: string;
  book: string;
  page: number;
  heading: Bi;
  text: Bi;
}

export const PAGES: Record<string, BookPage> = {
  p118: {
    id: "p118",
    book: "g4",
    page: 118,
    heading: { ta: "சோழர் நிர்வாகம்", en: "Chola administration" },
    text: {
      ta: "சோழப் பேரரசு மண்டலங்களாகப் பிரிக்கப்பட்டிருந்தது. மண்டலங்கள் வளநாடுகளாகவும், வளநாடுகள் நாடுகளாகவும் பிரிக்கப்பட்டன. நிர்வாகத்தின் அடிப்படை அலகு கிராமம்.",
      en: "The Chola empire was divided into mandalams. Mandalams were divided into valanadus, and valanadus into nadus. The village was the basic unit of administration.",
    },
  },
  p119: {
    id: "p119",
    book: "g4",
    page: 119,
    heading: { ta: "கிராம சபைகள்", en: "Village assemblies" },
    text: {
      ta: "கிராம நிர்வாகத்தை ஊர், சபை ஆகிய அவைகள் நடத்தின. உத்திரமேரூர் கல்வெட்டுகள் குடவோலை முறையில் உறுப்பினர்கள் தேர்ந்தெடுக்கப்பட்டதை விவரிக்கின்றன.",
      en: "Village affairs were run by assemblies called the ur and the sabha. The Uttaramerur inscriptions describe members being chosen by kudavolai, a palm-leaf ballot.",
    },
  },
  p204: {
    id: "p204",
    book: "g4",
    page: 204,
    heading: { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" },
    text: {
      ta: "அடிப்படை உரிமைகள் இந்திய அரசியலமைப்பின் பகுதி III-இல், உறுப்புகள் 12 முதல் 35 வரை உள்ளன.",
      en: "The fundamental rights are in Part III of the Constitution of India, Articles 12 to 35.",
    },
  },
  p205: {
    id: "p205",
    book: "g4",
    page: 205,
    heading: { ta: "அரசு வழிகாட்டு நெறிமுறைகள்", en: "Directive principles of state policy" },
    text: {
      ta: "அரசு வழிகாட்டு நெறிமுறைகள் பகுதி IV-இல், உறுப்புகள் 36 முதல் 51 வரை உள்ளன. அவை நீதிமன்றத்தால் நடைமுறைப்படுத்த முடியாதவை.",
      en: "The directive principles are in Part IV, Articles 36 to 51. They are not enforceable by a court.",
    },
  },
  p206: {
    id: "p206",
    book: "g4",
    page: 206,
    heading: { ta: "உச்ச நீதிமன்றம்", en: "The Supreme Court" },
    text: {
      ta: "உச்ச நீதிமன்றம் அரசியலமைப்பின் பாதுகாவலர் எனப்படுகிறது; அடிப்படை உரிமைகளைக் காக்க உறுப்பு 32-இன் கீழ் நேரடியாக அணுகலாம்.",
      en: "The Supreme Court is called the guardian of the Constitution; it can be approached directly under Article 32 to protect fundamental rights.",
    },
  },
};

export interface AnswerPart {
  text: Bi;
  page: string;
}
export interface BankAnswer {
  id: string;
  match: string[];
  parts: AnswerPart[];
}

/** The answers the note agent would give over the sample GuruBook. In the
    product these come from retrieval over the GuruBook's index, through
    yazhi-api, with the citation verifier checking every span. */
export const BANK: BankAnswer[] = [
  {
    id: "chola",
    match: ["சோழ", "chola", "மண்டல", "mandalam"],
    parts: [
      { text: { ta: "சோழப் பேரரசு மண்டலம், வளநாடு, நாடு, கிராமம் என அடுக்குகளாகப் பிரிக்கப்பட்டிருந்தது.", en: "The Chola empire was divided in tiers: mandalam, valanadu, nadu and the village." }, page: "p118" },
      { text: { ta: "கிராம நிர்வாகத்தை ஊர், சபை ஆகிய அவைகள் நடத்தின.", en: "Village affairs were run by the ur and the sabha." }, page: "p119" },
      { text: { ta: "உத்திரமேரூர் கல்வெட்டுகள் குடவோலைத் தேர்தல் முறையை விவரிக்கின்றன.", en: "The Uttaramerur inscriptions describe election by kudavolai." }, page: "p119" },
    ],
  },
  {
    id: "kudavolai",
    match: ["குடவோலை", "kudavolai", "உத்திரமேரூர்", "uttaramerur"],
    parts: [{ text: { ta: "குடவோலை என்பது பனையோலைச் சீட்டு மூலம் உறுப்பினரைத் தேர்ந்தெடுக்கும் முறை; உத்திரமேரூர் கல்வெட்டுகள் அதை விவரிக்கின்றன.", en: "Kudavolai is choosing members by palm-leaf ballot; the Uttaramerur inscriptions describe it." }, page: "p119" }],
  },
  {
    id: "rights",
    match: ["அடிப்படை உரிமை", "fundamental right", "part iii", "பகுதி iii"],
    parts: [
      { text: { ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் பகுதி III-இல், உறுப்புகள் 12–35-இல் உள்ளன.", en: "The fundamental rights are in Part III, Articles 12–35." }, page: "p204" },
      { text: { ta: "அவற்றைக் காக்க உறுப்பு 32-இன் கீழ் உச்ச நீதிமன்றத்தை நேரடியாக அணுகலாம்.", en: "Article 32 lets a person go directly to the Supreme Court to protect them." }, page: "p206" },
    ],
  },
  {
    id: "dpsp",
    match: ["வழிகாட்டு", "directive", "dpsp"],
    parts: [{ text: { ta: "அரசு வழிகாட்டு நெறிமுறைகள் பகுதி IV-இல், உறுப்புகள் 36–51-இல் உள்ளன; அவை நீதிமன்றத்தால் நடைமுறைப்படுத்த முடியாதவை.", en: "The directive principles are in Part IV, Articles 36–51, and are not enforceable by a court." }, page: "p205" }],
  },
];

export const SUGGESTIONS: Bi[] = [
  { ta: "சோழர் கால ஆட்சி முறை பற்றி விளக்குக", en: "Explain the Chola system of administration" },
  { ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் எந்தப் பகுதியில் உள்ளன?", en: "Which part of the Constitution holds the fundamental rights?" },
  { ta: "2026 ஐபிஎல் கோப்பையை வென்றது யார்?", en: "Who won the 2026 IPL?" },
];

export function findAnswer(q: string): BankAnswer | undefined {
  const s = q.toLowerCase();
  return BANK.find((a) => a.match.some((m) => s.includes(m.toLowerCase())));
}

/* ------------------------------------------------------------- tiers */

export type Tier = "IV" | "II" | "I";

export interface Chapter {
  id: string;
  title: Bi;
  unit: Bi;
  tiers: Record<Tier, { draftId: string; note: Bi[]; items: { q: Bi; a?: Bi; page: string }[] }>;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "chola",
    title: { ta: "சோழர் நிர்வாகம்", en: "Chola administration" },
    unit: { ta: "அலகு 8 · தமிழ்நாட்டின் வரலாறு", en: "Unit 8 · History of Tamil Nadu" },
    tiers: {
      IV: {
        draftId: "chola-IV",
        note: [
          { ta: "பேரரசு → மண்டலம் → வளநாடு → நாடு → கிராமம்.", en: "Empire → mandalam → valanadu → nadu → village." },
          { ta: "கிராம அவைகள்: ஊர், சபை.", en: "Village assemblies: the ur and the sabha." },
          { ta: "குடவோலை: பனையோலைச் சீட்டுத் தேர்தல் (உத்திரமேரூர்).", en: "Kudavolai: palm-leaf ballot (Uttaramerur)." },
        ],
        items: [
          { q: { ta: "சோழரின் மிகப் பெரிய நிர்வாகப் பிரிவு எது? (அ) நாடு (ஆ) மண்டலம் (இ) ஊர் (ஈ) கூற்றம்", en: "The largest Chola administrative division? (a) nadu (b) mandalam (c) ur (d) kurram" }, a: { ta: "(ஆ) மண்டலம்", en: "(b) mandalam" }, page: "p118" },
          { q: { ta: "குடவோலை முறையை விவரிப்பவை எந்தக் கல்வெட்டுகள்?", en: "Which inscriptions describe kudavolai?" }, a: { ta: "உத்திரமேரூர்", en: "Uttaramerur" }, page: "p119" },
        ],
      },
      II: {
        draftId: "chola-II",
        note: [
          { ta: "1. அடுக்கு நிர்வாகம் — மண்டலம், வளநாடு, நாடு, கிராமம்; ஒவ்வொன்றின் பொறுப்பு.", en: "1. Tiered administration — mandalam, valanadu, nadu, village; who answered for what." },
          { ta: "2. உள்ளாட்சி — ஊர், சபை; அவற்றின் குழுக்கள்.", en: "2. Local self-government — the ur and the sabha, and their committees." },
          { ta: "3. தேர்தல் — குடவோலை; உத்திரமேரூர் கல்வெட்டுச் சான்று.", en: "3. Election — kudavolai; the Uttaramerur inscriptional evidence." },
        ],
        items: [
          { q: { ta: "சோழர் கால உள்ளாட்சியின் இரு அவைகளைக் குறிப்பிடுக. (2 மதிப்பெண்)", en: "Name the two Chola village assemblies. (2 marks)" }, a: { ta: "ஊர், சபை — பக்கம் 119.", en: "The ur and the sabha — page 119." }, page: "p119" },
        ],
      },
      I: {
        draftId: "chola-I",
        note: [
          { ta: "முன்னுரை: சோழர் நிர்வாகம் — மையப்படுத்தலும் உள்ளாட்சியும் இணைந்த அமைப்பு.", en: "Introduction: Chola rule combined a strong centre with village self-government." },
          { ta: "உடல்: (அ) அடுக்கு நிர்வாகம் (ஆ) ஊர், சபை (இ) குடவோலைத் தேர்தல் — கல்வெட்டுச் சான்றுடன்.", en: "Body: (a) tiered administration (b) the ur and sabha (c) kudavolai elections — with the inscriptional evidence." },
          { ta: "முடிவுரை: இன்றைய பஞ்சாயத்து அமைப்புடன் ஒப்பீடு — உங்கள் சொற்களில்.", en: "Conclusion: compare with today's panchayats — in your own words." },
        ],
        items: [
          { q: { ta: "“சோழர் கால உள்ளாட்சி ஒரு மக்களாட்சி முன்மாதிரி” — ஆராய்க. (15 மதிப்பெண்)", en: "“Chola local government was an early democracy” — examine. (15 marks)" }, page: "p119" },
        ],
      },
    },
  },
  {
    id: "rights",
    title: { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" },
    unit: { ta: "அலகு 5 · இந்திய அரசியலமைப்பு", en: "Unit 5 · Indian Polity" },
    tiers: {
      IV: {
        draftId: "rights-IV",
        note: [
          { ta: "பகுதி III, உறுப்புகள் 12–35.", en: "Part III, Articles 12–35." },
          { ta: "உறுப்பு 32: உச்ச நீதிமன்றத்தை நேரடியாக அணுகும் உரிமை.", en: "Article 32: the right to go directly to the Supreme Court." },
        ],
        items: [{ q: { ta: "அடிப்படை உரிமைகள் எந்தப் பகுதியில்? (அ) II (ஆ) III (இ) IV (ஈ) V", en: "Fundamental rights are in which part? (a) II (b) III (c) IV (d) V" }, a: { ta: "(ஆ) III", en: "(b) III" }, page: "p204" }],
      },
      II: {
        draftId: "rights-II",
        note: [
          { ta: "1. அடிப்படை உரிமைகள் (பகுதி III) — நீதிமன்றத்தில் நடைமுறைப்படுத்தக்கூடியவை.", en: "1. Fundamental rights (Part III) — enforceable in court." },
          { ta: "2. வழிகாட்டு நெறிமுறைகள் (பகுதி IV) — நடைமுறைப்படுத்த முடியாதவை.", en: "2. Directive principles (Part IV) — not enforceable." },
        ],
        items: [{ q: { ta: "அடிப்படை உரிமைகளுக்கும் வழிகாட்டு நெறிமுறைகளுக்கும் ஒரு வேறுபாடு கூறுக.", en: "Give one difference between fundamental rights and directive principles." }, a: { ta: "முதலாவது நடைமுறைப்படுத்தக்கூடியது; இரண்டாவது அல்ல — பக்கம் 205.", en: "The first is enforceable in court; the second is not — page 205." }, page: "p205" }],
      },
      I: {
        draftId: "rights-I",
        note: [
          { ta: "முன்னுரை: உரிமைகளும் நெறிமுறைகளும் — அரசியலமைப்பின் இரு தூண்கள்.", en: "Introduction: rights and principles — two pillars of the Constitution." },
          { ta: "உடல்: பகுதி III, பகுதி IV, உறுப்பு 32 — உங்கள் சான்றுகளுடன்.", en: "Body: Part III, Part IV, Article 32 — with your own evidence." },
          { ta: "முடிவுரை: உங்கள் சொற்களில்.", en: "Conclusion: in your own words." },
        ],
        items: [{ q: { ta: "உறுப்பு 32 ஏன் “அரசியலமைப்பின் இதயம்” எனப்படுகிறது? ஆராய்க.", en: "Why is Article 32 called the heart of the Constitution? Examine." }, page: "p206" }],
      },
    },
  },
];

/* -------------------------------------------------------------- quiz */

export interface QuizItem {
  id: string;
  topic: string;
  q: Bi;
  options: Bi[];
  answer: number;
  why: Bi;
  page: string;
}

export const QUIZ: QuizItem[] = [
  {
    id: "q1",
    topic: "chola",
    q: { ta: "சோழப் பேரரசின் மிகப் பெரிய நிர்வாகப் பிரிவு எது?", en: "Which was the largest administrative division of the Chola empire?" },
    options: [
      { ta: "நாடு", en: "Nadu" },
      { ta: "மண்டலம்", en: "Mandalam" },
      { ta: "கூற்றம்", en: "Kurram" },
      { ta: "ஊர்", en: "Ur" },
    ],
    answer: 1,
    why: { ta: "பேரரசு முதலில் மண்டலங்களாகப் பிரிக்கப்பட்டது; நாடு அதற்குக் கீழே.", en: "The empire was first divided into mandalams; the nadu sat below them." },
    page: "p118",
  },
  {
    id: "q2",
    topic: "chola",
    q: { ta: "குடவோலைத் தேர்தல் முறையை விவரிக்கும் கல்வெட்டுகள் எங்குள்ளன?", en: "Where are the inscriptions that describe kudavolai elections?" },
    options: [
      { ta: "தாராசுரம்", en: "Darasuram" },
      { ta: "கங்கைகொண்ட சோழபுரம்", en: "Gangaikonda Cholapuram" },
      { ta: "உத்திரமேரூர்", en: "Uttaramerur" },
      { ta: "மாமல்லபுரம்", en: "Mamallapuram" },
    ],
    answer: 2,
    why: { ta: "உத்திரமேரூர் கல்வெட்டுகளே குடவோலை முறையை விவரிக்கின்றன.", en: "It is the Uttaramerur inscriptions that describe kudavolai." },
    page: "p119",
  },
  {
    id: "q3",
    topic: "rights",
    q: { ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் எந்தப் பகுதியில் உள்ளன?", en: "Which part of the Constitution holds the fundamental rights?" },
    options: [
      { ta: "பகுதி II", en: "Part II" },
      { ta: "பகுதி III", en: "Part III" },
      { ta: "பகுதி IV", en: "Part IV" },
      { ta: "பகுதி V", en: "Part V" },
    ],
    answer: 1,
    why: { ta: "பகுதி III, உறுப்புகள் 12–35. பகுதி IV வழிகாட்டு நெறிமுறைகள்.", en: "Part III, Articles 12–35. Part IV is the directive principles." },
    page: "p204",
  },
  {
    id: "q4",
    topic: "rights",
    q: { ta: "நீதிமன்றத்தால் நடைமுறைப்படுத்த முடியாதவை எவை?", en: "Which of these cannot be enforced by a court?" },
    options: [
      { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" },
      { ta: "உறுப்பு 32", en: "Article 32" },
      { ta: "அரசு வழிகாட்டு நெறிமுறைகள்", en: "Directive principles" },
      { ta: "சமத்துவ உரிமை", en: "The right to equality" },
    ],
    answer: 2,
    why: { ta: "வழிகாட்டு நெறிமுறைகள் (பகுதி IV) அரசுக்கு வழிகாட்டுபவை; நீதிமன்றத்தில் நடைமுறைப்படுத்த முடியாது.", en: "The directive principles (Part IV) guide the state; a court cannot enforce them." },
    page: "p205",
  },
  {
    id: "q5",
    topic: "rights",
    q: { ta: "அடிப்படை உரிமைகளைக் காக்க உச்ச நீதிமன்றத்தை நேரடியாக அணுக உதவும் உறுப்பு எது?", en: "Which Article lets a person go directly to the Supreme Court to protect fundamental rights?" },
    options: [
      { ta: "உறுப்பு 14", en: "Article 14" },
      { ta: "உறுப்பு 21", en: "Article 21" },
      { ta: "உறுப்பு 32", en: "Article 32" },
      { ta: "உறுப்பு 51", en: "Article 51" },
    ],
    answer: 2,
    why: { ta: "உறுப்பு 32 — அரசியலமைப்புத் தீர்வுகளுக்கான உரிமை.", en: "Article 32 — the right to constitutional remedies." },
    page: "p206",
  },
];

export const GLOSSARY: { ta: string; en: string }[] = [
  { ta: "மண்டலம்", en: "Mandalam — province" },
  { ta: "வளநாடு", en: "Valanadu — division of a mandalam" },
  { ta: "குடவோலை", en: "Kudavolai — palm-leaf ballot" },
  { ta: "ஊர் · சபை", en: "Ur · sabha — village assemblies" },
  { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" },
  { ta: "வழிகாட்டு நெறிமுறைகள்", en: "Directive principles of state policy" },
  { ta: "அரசியலமைப்புத் தீர்வுகள்", en: "Constitutional remedies" },
];

/** Batch-1 class view: counts only — no aspirant is named on screen. */
export const CLASS = {
  aspirants: 24,
  topics: [
    { id: "chola", label: { ta: "சோழர் நிர்வாகம்", en: "Chola administration" }, attempted: 21, correct: 0.62 },
    { id: "rights", label: { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" }, attempted: 18, correct: 0.81 },
    { id: "pallava", label: { ta: "பல்லவர் கலை", en: "Pallava art" }, attempted: 9, correct: 0.44 },
  ],
};

export const tierLabel: Record<Tier, Bi> = {
  IV: { ta: "குரூப் IV", en: "Group IV" },
  II: { ta: "குரூப் II/IIA", en: "Group II/IIA" },
  I: { ta: "குரூப் I", en: "Group I" },
};
