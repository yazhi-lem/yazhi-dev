import type { Bi } from "@yazhi/workspace/types";

/** Guru's demo fixtures, shaped after the Guru Book mockups. Synthetic:
    faculty and aspirants are placeholders, page numbers are illustrative,
    past papers are "[Sample]". The facts are the standard school-textbook
    ones; their Tamil and Tanglish are AI drafts (†) until Kabilar signs
    them off. */

/** A string an answer can be read in: Tamil, English or Tanglish. */
export interface Tri extends Bi {
  tg: string;
}
export type AnswerLang = "ta" | "en" | "tg";
export const ANSWER_LANGS: { value: AnswerLang; label: string; lang: string }[] = [
  { value: "ta", label: "தமிழ்", lang: "ta" },
  { value: "en", label: "English", lang: "en" },
  { value: "tg", label: "Tanglish", lang: "en" },
];

/* --------------------------------------------------------- notebooks */

export interface Notebook {
  id: string;
  code: string;
  title: Bi;
  faculty: string;
  /** CSS colour for the cover */
  cover: string;
  state: "ready" | "indexing";
}

export const NOTEBOOKS: Notebook[] = [
  { id: "g4", code: "G4", title: { ta: "TNPSC குரூப் IV — பொது அறிவு", en: "TNPSC Group IV — General Studies" }, faculty: "[Faculty A]", cover: "var(--mullai)", state: "ready" },
  { id: "g2", code: "G2", title: { ta: "குரூப் II/IIA — இந்திய அரசியலமைப்பு", en: "Group II/IIA — Indian Polity" }, faculty: "[Faculty B]", cover: "var(--neytal)", state: "ready" },
  { id: "tamil", code: "பொத", title: { ta: "பொதுத் தமிழ்", en: "General Tamil" }, faculty: "[Faculty C]", cover: "var(--kurinji)", state: "indexing" },
  { id: "apt", code: "APT", title: { ta: "திறனறிவும் மனக்கணக்கும்", en: "Aptitude and mental ability" }, faculty: "[Faculty D]", cover: "var(--palai)", state: "indexing" },
];

/* ----------------------------------------------------------- sources */

export interface SourceFile {
  id: string;
  notebooks: string[];
  name: string;
  type: "PDF" | "PPTX" | "DOCX" | "Image";
  pages: number;
  status: "searchable" | "indexing" | "scanned";
  pastPaper?: boolean;
  by: string;
  /** indexing progress, 0–1, and minutes left */
  progress?: number;
  eta?: number;
}

export const SOURCES: SourceFile[] = [
  { id: "s1", notebooks: ["g4", "g2"], name: "TNPSC Group IV syllabus 2026.pdf", type: "PDF", pages: 8, status: "searchable", by: "[Faculty A]" },
  { id: "s2", notebooks: ["g4"], name: "Unit 8 Notes — History of Tamil Nadu.pdf", type: "PDF", pages: 46, status: "searchable", by: "[Faculty A]" },
  { id: "s3", notebooks: ["g4", "g2"], name: "Unit 5 — Indian Polity.pptx", type: "PPTX", pages: 38, status: "searchable", by: "[Faculty B]" },
  { id: "s4", notebooks: ["g4"], name: "[Sample] Std 8 Social Science — local copy.pdf", type: "PDF", pages: 212, status: "indexing", by: "[Faculty A]", progress: 0.62, eta: 6 },
  { id: "s5", notebooks: ["g4", "g2"], name: "[Sample] Group IV question paper 2024.pdf", type: "PDF", pages: 3, status: "searchable", pastPaper: true, by: "[Faculty A]" },
  { id: "s6", notebooks: ["g4"], name: "Handwritten Tamil notes — Unit 8.pdf", type: "PDF", pages: 22, status: "scanned", by: "[Faculty A]" },
];

export const sourceById = (id: string) => SOURCES.find((s) => s.id === id)!;
export const sourcesFor = (nb: string) => SOURCES.filter((s) => s.notebooks.includes(nb));

/** One cited page: the source, the page, and the span the answer rests on. */
export interface Cite {
  id: string;
  source: string;
  page: number;
  heading: Bi;
  span: Bi;
}

export const CITES: Record<string, Cite> = {
  "chola-18": {
    id: "chola-18",
    source: "s2",
    page: 18,
    heading: { ta: "சோழர் நிர்வாகம்", en: "Chola administration" },
    span: {
      ta: "சோழப் பேரரசு மண்டலங்களாகப் பிரிக்கப்பட்டிருந்தது. மண்டலங்கள் வளநாடுகளாகவும், வளநாடுகள் நாடுகளாகவும் பிரிக்கப்பட்டன. நிர்வாகத்தின் அடிப்படை அலகு கிராமம்.",
      en: "The Chola empire was divided into mandalams. Mandalams were divided into valanadus, and valanadus into nadus. The village was the basic unit of administration.",
    },
  },
  "chola-19": {
    id: "chola-19",
    source: "s2",
    page: 19,
    heading: { ta: "கிராம சபைகள்", en: "Village assemblies" },
    span: {
      ta: "கிராம நிர்வாகத்தை ஊர், சபை ஆகிய அவைகள் நடத்தின. உத்திரமேரூர் கல்வெட்டுகள் குடவோலை முறையில் உறுப்பினர்கள் தேர்ந்தெடுக்கப்பட்டதை விவரிக்கின்றன.",
      en: "Village affairs were run by assemblies called the ur and the sabha. The Uttaramerur inscriptions describe members being chosen by kudavolai, a palm-leaf ballot.",
    },
  },
  "qp-2": {
    id: "qp-2",
    source: "s5",
    page: 2,
    heading: { ta: "வினா [37]", en: "Question [37]" },
    span: { ta: "[மாதிரி] சோழப் பேரரசின் மிகப் பெரிய நிர்வாகப் பிரிவு எது?", en: "[Sample] Which was the largest administrative division of the Chola empire?" },
  },
  "polity-12": {
    id: "polity-12",
    source: "s3",
    page: 12,
    heading: { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" },
    span: { ta: "அடிப்படை உரிமைகள் இந்திய அரசியலமைப்பின் பகுதி III-இல், உறுப்புகள் 12 முதல் 35 வரை உள்ளன.", en: "The fundamental rights are in Part III of the Constitution of India, Articles 12 to 35." },
  },
  "polity-13": {
    id: "polity-13",
    source: "s3",
    page: 13,
    heading: { ta: "அரசு வழிகாட்டு நெறிமுறைகள்", en: "Directive principles" },
    span: { ta: "அரசு வழிகாட்டு நெறிமுறைகள் பகுதி IV-இல், உறுப்புகள் 36 முதல் 51 வரை உள்ளன. அவை நீதிமன்றத்தால் நடைமுறைப்படுத்த முடியாதவை.", en: "The directive principles are in Part IV, Articles 36 to 51. They are not enforceable by a court." },
  },
  "polity-14": {
    id: "polity-14",
    source: "s3",
    page: 14,
    heading: { ta: "உறுப்பு 32", en: "Article 32" },
    span: { ta: "அடிப்படை உரிமைகளைக் காக்க உறுப்பு 32-இன் கீழ் உச்ச நீதிமன்றத்தை நேரடியாக அணுகலாம்.", en: "Article 32 lets a person go directly to the Supreme Court to protect fundamental rights." },
  },
  "pallava-20": {
    id: "pallava-20",
    source: "s2",
    page: 20,
    heading: { ta: "பல்லவர் கட்டடக் கலை", en: "Pallava architecture" },
    span: { ta: "[மாதிரி] பல்லவர் காலக் குடைவரைக் கோயில்களும் கட்டுமானக் கோயில்களும்.", en: "[Sample] Rock-cut and structural temples of the Pallava period." },
  },
};

/* ----------------------------------------------------------- answers */

export interface BankAnswer {
  id: string;
  topic: string;
  match: string[];
  /** each sentence carries its citation number (1-based into `cites`) */
  parts: { text: Tri; cite: number }[];
  cites: string[];
}

/** What the note agent would answer over the sample notebooks. In the
    product: retrieval over the notebook's index through yazhi-api, with
    the citation verifier checking every span before it is shown. */
export const BANK: BankAnswer[] = [
  {
    id: "chola",
    topic: "chola",
    match: ["சோழ", "chola", "cholar", "மண்டல", "mandalam", "aatchi"],
    cites: ["chola-18", "chola-19"],
    parts: [
      {
        text: {
          ta: "சோழப் பேரரசு மண்டலம், வளநாடு, நாடு, கிராமம் என அடுக்குகளாகப் பிரிக்கப்பட்டிருந்தது.",
          en: "The Chola empire was divided in tiers: mandalam, valanadu, nadu and the village.",
          tg: "Chola empire-a mandalam, valanadu, nadu, village-nu tier tier-a pirichu vechirundhaanga.",
        },
        cite: 1,
      },
      {
        text: {
          ta: "கிராம நிர்வாகத்தை ஊர், சபை ஆகிய அவைகள் நடத்தின.",
          en: "Village affairs were run by two assemblies, the ur and the sabha.",
          tg: "Village administration-a ur, sabha-nu rendu assemblies paathukittaanga.",
        },
        cite: 2,
      },
      {
        text: {
          ta: "உத்திரமேரூர் கல்வெட்டுகள் குடவோலைத் தேர்தல் முறையை விவரிக்கின்றன.",
          en: "The Uttaramerur inscriptions describe election by kudavolai.",
          tg: "Uttaramerur inscriptions-la kudavolai election murai pathi detail-a irukku.",
        },
        cite: 2,
      },
    ],
  },
  {
    id: "kudavolai",
    topic: "chola",
    match: ["குடவோலை", "kudavolai", "உத்திரமேரூர்", "uttaramerur"],
    cites: ["chola-19"],
    parts: [
      {
        text: {
          ta: "குடவோலை என்பது பனையோலைச் சீட்டு மூலம் உறுப்பினரைத் தேர்ந்தெடுக்கும் முறை; உத்திரமேரூர் கல்வெட்டுகள் அதை விவரிக்கின்றன.",
          en: "Kudavolai is choosing members by palm-leaf ballot; the Uttaramerur inscriptions describe it.",
          tg: "Kudavolai-na palm-leaf ballot vechu member-a select panra murai; Uttaramerur inscriptions-la idhu irukku.",
        },
        cite: 1,
      },
    ],
  },
  {
    id: "rights",
    topic: "rights",
    match: ["அடிப்படை உரிமை", "fundamental right", "part iii", "பகுதி iii", "urimai"],
    cites: ["polity-12", "polity-14"],
    parts: [
      {
        text: {
          ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் பகுதி III-இல், உறுப்புகள் 12–35-இல் உள்ளன.",
          en: "The fundamental rights are in Part III, Articles 12–35.",
          tg: "Fundamental rights ellaam Part III-la, Articles 12–35-la irukku.",
        },
        cite: 1,
      },
      {
        text: {
          ta: "அவற்றைக் காக்க உறுப்பு 32-இன் கீழ் உச்ச நீதிமன்றத்தை நேரடியாக அணுகலாம்.",
          en: "Article 32 lets a person go directly to the Supreme Court to protect them.",
          tg: "Adha protect panna Article 32 vechu direct-a Supreme Court-ku pogalaam.",
        },
        cite: 2,
      },
    ],
  },
  {
    id: "dpsp",
    topic: "rights",
    match: ["வழிகாட்டு", "directive", "dpsp"],
    cites: ["polity-13"],
    parts: [
      {
        text: {
          ta: "அரசு வழிகாட்டு நெறிமுறைகள் பகுதி IV-இல், உறுப்புகள் 36–51-இல் உள்ளன; அவை நீதிமன்றத்தால் நடைமுறைப்படுத்த முடியாதவை.",
          en: "The directive principles are in Part IV, Articles 36–51, and a court cannot enforce them.",
          tg: "Directive principles Part IV-la, Articles 36–51-la irukku; court-la adha enforce panna mudiyaadhu.",
        },
        cite: 1,
      },
    ],
  },
];

/** Topics the notes come close to without answering: the closest page is
    offered instead of a guess (mockup 03). */
export const NEAR: { match: string[]; cite: string; pages: string }[] = [{ match: ["பல்லவ", "pallava", "ஓவிய", "painting"], cite: "pallava-20", pages: "20–22" }];

export const SUGGESTIONS: Bi[] = [
  { ta: "சோழர் கால ஆட்சி முறை பற்றி விளக்குக", en: "Explain the Chola system of administration" },
  { ta: "Fundamental rights entha part-la irukku?", en: "Which part of the Constitution holds the fundamental rights?" },
  { ta: "பல்லவர் கால ஓவியக் கலை பற்றி விளக்குக", en: "Explain Pallava-period painting" },
];

export function findAnswer(q: string, notebook: string): BankAnswer | undefined {
  const s = q.toLowerCase();
  const inBook = new Set(sourcesFor(notebook).filter((x) => x.status === "searchable").map((x) => x.id));
  return BANK.find((a) => a.match.some((m) => s.includes(m.toLowerCase())) && a.cites.every((c) => inBook.has(CITES[c].source)));
}
export function findNear(q: string) {
  const s = q.toLowerCase();
  return NEAR.find((n) => n.match.some((m) => s.includes(m.toLowerCase())));
}

/* ------------------------------------------------------- past papers */

export interface PastQuestion {
  id: string;
  topic: string;
  paper: string;
  q: string;
  marks: Bi;
  text: Bi;
  source: string;
  page: number;
  outline: { text: Bi; cite: string }[];
}

export const PAST: PastQuestion[] = [
  {
    id: "pp1",
    topic: "chola",
    paper: "[SAMPLE] GROUP IV 2024",
    q: "Q.[37]",
    marks: { ta: "1 மதிப்பெண்", en: "1 mark" },
    text: { ta: "சோழப் பேரரசின் மிகப் பெரிய நிர்வாகப் பிரிவு எது?", en: "Which was the largest administrative division of the Chola empire?" },
    source: "s5",
    page: 2,
    outline: [{ text: { ta: "மண்டலம் — அதற்குக் கீழே வளநாடு, நாடு, கிராமம்.", en: "The mandalam — below it the valanadu, nadu and village." }, cite: "chola-18" }],
  },
  {
    id: "pp2",
    topic: "chola",
    paper: "[SAMPLE] GROUP II 2023",
    q: "Q.[12]",
    marks: { ta: "10 மதிப்பெண்", en: "10 marks" },
    text: { ta: "சோழர் கால கிராம நிர்வாகத்தை அதன் சான்றுகளுடன் விவரிக்க.", en: "Describe village administration under the Cholas, with its evidence." },
    source: "s5",
    page: 3,
    outline: [
      { text: { ta: "அடுக்கு நிர்வாகத்தில் கிராமத்தின் இடம்.", en: "Where the village sat in the tiers of administration." }, cite: "chola-18" },
      { text: { ta: "ஊர், சபை — இரு அவைகள்.", en: "The ur and the sabha — the two assemblies." }, cite: "chola-19" },
      { text: { ta: "குடவோலைத் தேர்தல்; உத்திரமேரூர் கல்வெட்டுச் சான்று.", en: "Kudavolai elections; the Uttaramerur inscriptions as evidence." }, cite: "chola-19" },
    ],
  },
  {
    id: "pp3",
    topic: "rights",
    paper: "[SAMPLE] GROUP IV 2024",
    q: "Q.[58]",
    marks: { ta: "1 மதிப்பெண்", en: "1 mark" },
    text: { ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் எந்தப் பகுதியில் உள்ளன?", en: "Which part of the Constitution contains the fundamental rights?" },
    source: "s5",
    page: 2,
    outline: [{ text: { ta: "பகுதி III, உறுப்புகள் 12–35.", en: "Part III, Articles 12–35." }, cite: "polity-12" }],
  },
  {
    id: "pp4",
    topic: "rights",
    paper: "[SAMPLE] GROUP II 2023",
    q: "Q.[15]",
    marks: { ta: "5 மதிப்பெண்", en: "5 marks" },
    text: { ta: "அடிப்படை உரிமைகளையும் வழிகாட்டு நெறிமுறைகளையும் வேறுபடுத்துக.", en: "Distinguish fundamental rights from directive principles." },
    source: "s5",
    page: 3,
    outline: [
      { text: { ta: "உரிமைகள்: பகுதி III, நீதிமன்றத்தில் நடைமுறைப்படுத்தலாம் (உறுப்பு 32).", en: "Rights: Part III, enforceable in court (Article 32)." }, cite: "polity-14" },
      { text: { ta: "நெறிமுறைகள்: பகுதி IV, நடைமுறைப்படுத்த முடியாதவை.", en: "Principles: Part IV, not enforceable." }, cite: "polity-13" },
    ],
  },
];

/* ------------------------------------------------------------- tiers */

export type Tier = "IV" | "II" | "I";

export interface Chapter {
  id: string;
  title: Bi;
  unit: Bi;
  tiers: Record<Tier, { draftId: string; note: Bi[]; items: { q: Bi; a?: Bi; cite: string }[] }>;
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
          { q: { ta: "குடவோலை முறையை விவரிப்பவை எந்தக் கல்வெட்டுகள்?", en: "Which inscriptions describe kudavolai?" }, a: { ta: "உத்திரமேரூர்", en: "Uttaramerur" }, cite: "chola-19" },
        ],
      },
      II: {
        draftId: "chola-II",
        note: [
          { ta: "1. அடுக்கு நிர்வாகம் — மண்டலம், வளநாடு, நாடு, கிராமம்.", en: "1. Tiered administration — mandalam, valanadu, nadu, village." },
          { ta: "2. உள்ளாட்சி — ஊர், சபை; அவற்றின் குழுக்கள்.", en: "2. Local self-government — the ur and the sabha, and their committees." },
          { ta: "3. தேர்தல் — குடவோலை; உத்திரமேரூர் கல்வெட்டுச் சான்று.", en: "3. Election — kudavolai; the Uttaramerur evidence." },
        ],
        items: [{ q: { ta: "சோழர் கால உள்ளாட்சியின் இரு அவைகளைக் குறிப்பிடுக. (2 மதிப்பெண்)", en: "Name the two Chola village assemblies. (2 marks)" }, a: { ta: "ஊர், சபை.", en: "The ur and the sabha." }, cite: "chola-19" }],
      },
      I: {
        draftId: "chola-I",
        note: [
          { ta: "முன்னுரை: மையப்படுத்தலும் உள்ளாட்சியும் இணைந்த அமைப்பு.", en: "Introduction: a strong centre with village self-government." },
          { ta: "உடல்: (அ) அடுக்கு நிர்வாகம் (ஆ) ஊர், சபை (இ) குடவோலைத் தேர்தல் — கல்வெட்டுச் சான்றுடன்.", en: "Body: (a) tiered administration (b) the ur and sabha (c) kudavolai — with the inscriptional evidence." },
          { ta: "முடிவுரை: இன்றைய பஞ்சாயத்து அமைப்புடன் ஒப்பீடு — உங்கள் சொற்களில்.", en: "Conclusion: compare with today's panchayats — in your own words." },
        ],
        items: [{ q: { ta: "“சோழர் கால உள்ளாட்சி ஒரு மக்களாட்சி முன்மாதிரி” — ஆராய்க. (15 மதிப்பெண்)", en: "“Chola local government was an early democracy” — examine. (15 marks)" }, cite: "chola-19" }],
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
        items: [{ q: { ta: "அடிப்படை உரிமைகள் எந்தப் பகுதியில்?", en: "Fundamental rights are in which part?" }, a: { ta: "பகுதி III", en: "Part III" }, cite: "polity-12" }],
      },
      II: {
        draftId: "rights-II",
        note: [
          { ta: "1. அடிப்படை உரிமைகள் (பகுதி III) — நீதிமன்றத்தில் நடைமுறைப்படுத்தக்கூடியவை.", en: "1. Fundamental rights (Part III) — enforceable in court." },
          { ta: "2. வழிகாட்டு நெறிமுறைகள் (பகுதி IV) — நடைமுறைப்படுத்த முடியாதவை.", en: "2. Directive principles (Part IV) — not enforceable." },
        ],
        items: [{ q: { ta: "இரண்டுக்கும் ஒரு வேறுபாடு கூறுக.", en: "Give one difference between the two." }, a: { ta: "முதலாவது நடைமுறைப்படுத்தக்கூடியது; இரண்டாவது அல்ல.", en: "The first is enforceable in court; the second is not." }, cite: "polity-13" }],
      },
      I: {
        draftId: "rights-I",
        note: [
          { ta: "முன்னுரை: உரிமைகளும் நெறிமுறைகளும் — அரசியலமைப்பின் இரு தூண்கள்.", en: "Introduction: rights and principles — two pillars of the Constitution." },
          { ta: "உடல்: பகுதி III, பகுதி IV, உறுப்பு 32 — உங்கள் சான்றுகளுடன்.", en: "Body: Part III, Part IV, Article 32 — with your own evidence." },
          { ta: "முடிவுரை: உங்கள் சொற்களில்.", en: "Conclusion: in your own words." },
        ],
        items: [{ q: { ta: "உறுப்பு 32 ஏன் “அரசியலமைப்பின் இதயம்” எனப்படுகிறது? ஆராய்க.", en: "Why is Article 32 called the heart of the Constitution? Examine." }, cite: "polity-14" }],
      },
    },
  },
];

export const tierLabel: Record<Tier, Bi> = {
  IV: { ta: "குரூப் IV", en: "Group IV" },
  II: { ta: "குரூப் II/IIA", en: "Group II/IIA" },
  I: { ta: "குரூப் I", en: "Group I" },
};

/* -------------------------------------------------------------- quiz */

export interface QuizItem {
  id: string;
  topic: string;
  q: Bi;
  options: Bi[];
  answer: number;
  why: Bi;
  cite: string;
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
    cite: "chola-18",
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
    cite: "chola-19",
  },
  {
    id: "q3",
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
    cite: "polity-13",
  },
  {
    id: "q4",
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
    cite: "polity-14",
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

/* --------------------------------------------------- faculty insights */

/** Counts only: no aspirant is named on a faculty screen. */
export const SECTIONS_SHARED = [
  { id: "b1m", name: "Batch 1 · Morning", students: 24 },
  { id: "b1e", name: "Batch 1 · Evening", students: 18 },
];

export const TOP_QUESTIONS: { q: Bi; times: number; inNotes: boolean }[] = [
  { q: { ta: "சோழர் கால ஆட்சி முறை", en: "Chola system of administration" }, times: 31, inNotes: true },
  { q: { ta: "உறுப்பு 32 ஏன் முக்கியம்?", en: "Why does Article 32 matter?" }, times: 17, inNotes: true },
  { q: { ta: "பல்லவர் ஓவியக் கலை", en: "Pallava painting" }, times: 9, inNotes: false },
];

export const CLASS_TOPICS = [
  { id: "chola", label: { ta: "சோழர் நிர்வாகம்", en: "Chola administration" }, attempted: 21, correct: 0.62 },
  { id: "rights", label: { ta: "அடிப்படை உரிமைகள்", en: "Fundamental rights" }, attempted: 18, correct: 0.81 },
  { id: "pallava", label: { ta: "பல்லவர் கலை", en: "Pallava art" }, attempted: 9, correct: 0.44 },
];
