import type { Source } from "@yazhi/bubble";
import type { Bi } from "@yazhi/workspace/types";

/** Nyaya's demo fixtures. The sections named are real provisions of
    central Acts; the excerpts are bracketed placeholders for the text the
    bare-Act loader stores, so nothing on screen can be mistaken for a
    quotation. Agreements, people and cases are synthetic. Tamil and
    Telugu are AI drafts (†) pending native review. */

export interface Section extends Source {
  act: string;
}

export const SECTIONS: Record<string, Section> = {
  "ni-138": { id: "ni-138", act: "ni", title: "Negotiable Instruments Act, 1881", locator: "s.138", excerpt: "[Text of s.138 as stored from the bare Act]", verified: true },
  "ni-142": { id: "ni-142", act: "ni", title: "Negotiable Instruments Act, 1881", locator: "s.142", excerpt: "[Text of s.142 as stored from the bare Act]", verified: true },
  "cpa-35": { id: "cpa-35", act: "cpa", title: "Consumer Protection Act, 2019", locator: "s.35", excerpt: "[Text of s.35 as stored from the bare Act]", verified: true },
  "cpa-69": { id: "cpa-69", act: "cpa", title: "Consumer Protection Act, 2019", locator: "s.69", excerpt: "[Text of s.69 as stored from the bare Act]", verified: true },
  "lsa-12": { id: "lsa-12", act: "lsa", title: "Legal Services Authorities Act, 1987", locator: "s.12", excerpt: "[Text of s.12 as stored from the bare Act]", verified: true },
};

export interface LegalAnswer {
  id: string;
  match: string[];
  steps: { text: Bi; cite: string }[];
}

export const ANSWERS: LegalAnswer[] = [
  {
    id: "cheque",
    match: ["காசோலை", "cheque", "check bounce", "చెక్", "138"],
    steps: [
      {
        text: {
          ta: "காசோலை செலுத்தப்படாமல் திரும்பியது என்று வங்கி தெரிவித்த 30 நாட்களுக்குள், பணம் பெற வேண்டியவர் எழுத்து மூலம் கோரிக்கை அறிவிப்பு அனுப்பலாம்.",
          en: "Within 30 days of the bank saying the cheque came back unpaid, the payee may send the drawer a written demand notice.",
          te: "చెక్ చెల్లించబడలేదని బ్యాంకు తెలిపిన 30 రోజుల్లోగా, చెల్లింపుదారు రాతపూర్వక డిమాండ్ నోటీసు పంపవచ్చు.",
        },
        cite: "ni-138",
      },
      {
        text: {
          ta: "அறிவிப்பைப் பெற்ற 15 நாட்களுக்குள் காசோலை கொடுத்தவர் பணம் செலுத்த வேண்டும்.",
          en: "The drawer then has 15 days from receiving the notice to pay.",
          te: "నోటీసు అందిన 15 రోజుల్లోగా చెక్ ఇచ్చినవారు చెల్లించాలి.",
        },
        cite: "ni-138",
      },
      {
        text: {
          ta: "செலுத்தாவிட்டால், அந்த 15 நாட்கள் முடிந்த ஒரு மாதத்துக்குள் புகார் தாக்கல் செய்யலாம்.",
          en: "If they don't, a complaint may be filed within one month after those 15 days end.",
          te: "చెల్లించకపోతే, ఆ 15 రోజులు ముగిసిన ఒక నెలలోగా ఫిర్యాదు దాఖలు చేయవచ్చు.",
        },
        cite: "ni-142",
      },
      {
        text: {
          ta: "பெருநகர நீதித்துறை நடுவர் அல்லது முதல் வகுப்பு நீதித்துறை நடுவர் நீதிமன்றமே இதை விசாரிக்கும்.",
          en: "It is tried by a Metropolitan Magistrate or a Judicial Magistrate of the first class.",
          te: "మెట్రోపాలిటన్ మేజిస్ట్రేట్ లేదా ప్రథమ శ్రేణి జ్యుడీషియల్ మేజిస్ట్రేట్ దీనిని విచారిస్తారు.",
        },
        cite: "ni-142",
      },
    ],
  },
  {
    id: "consumer",
    match: ["நுகர்வோர்", "குறைபாடு", "consumer", "defective", "వినియోగదారు"],
    steps: [
      {
        text: {
          ta: "குறைபாடுள்ள பொருள் அல்லது குறைபாடான சேவை பற்றிய புகாரை மாவட்ட நுகர்வோர் குறைதீர் ஆணையத்தில் தாக்கல் செய்யலாம்.",
          en: "A complaint about defective goods or deficient service can be filed with the District Consumer Disputes Redressal Commission.",
          te: "లోపభూయిష్ట వస్తువు లేదా లోపమైన సేవపై ఫిర్యాదును జిల్లా వినియోగదారుల వివాద పరిష్కార కమిషన్‌లో దాఖలు చేయవచ్చు.",
        },
        cite: "cpa-35",
      },
      {
        text: {
          ta: "பொதுவாக, புகாருக்கான காரணம் எழுந்த இரண்டு ஆண்டுகளுக்குள் தாக்கல் செய்ய வேண்டும்.",
          en: "It must generally be filed within two years of the cause of action.",
          te: "సాధారణంగా, కారణం ఏర్పడిన రెండు సంవత్సరాల్లోగా దాఖలు చేయాలి.",
        },
        cite: "cpa-69",
      },
    ],
  },
];

/** Questions Nyaya must decline: strategy, prediction, advice. */
export const ADVICE = ["வெல்வது", "வெல்ல", "உத்தி", "strategy", "win my", "should i", "గెలవ", "వ్యూహం"];

export const ASK_CHIPS: Bi[] = [
  { ta: "காசோலை திரும்பி வந்தால் என்ன செய்வது?", en: "What do I do if a cheque bounces?", te: "చెక్ బౌన్స్ అయితే ఏమి చేయాలి?" },
  { ta: "குறைபாடுள்ள பொருளுக்கு எங்கே புகார் செய்வது?", en: "Where do I complain about a defective product?", te: "లోపభూయిష్ట వస్తువుపై ఎక్కడ ఫిర్యాదు చేయాలి?" },
  { ta: "என் நில வழக்கில் எப்படி வெல்வது?", en: "How do I win my land case?", te: "నా భూ వివాదంలో ఎలా గెలవాలి?" },
];

export function findLegal(q: string): { kind: "answer"; a: LegalAnswer } | { kind: "advice" } | { kind: "none" } {
  const s = q.toLowerCase();
  if (ADVICE.some((w) => s.includes(w))) return { kind: "advice" };
  const a = ANSWERS.find((x) => x.match.some((m) => s.includes(m.toLowerCase())));
  return a ? { kind: "answer", a } : { kind: "none" };
}

/* ---------------------------------------------------- the agreement */

export interface Clause {
  n: number;
  heading: Bi;
  text: Bi;
}

export const AGREEMENT = {
  title: { ta: "[மாதிரி] கடை வாடகை ஒப்பந்தம்", en: "[Sample] Shop lease agreement", te: "[నమూనా] దుకాణం అద్దె ఒప్పందం" },
  file: "sample-shop-lease.pdf",
  clauses: [
    { n: 1, heading: { ta: "தரப்பினர்", en: "Parties", te: "పక్షాలు" }, text: { ta: "இந்த ஒப்பந்தம் [உரிமையாளர் A] (உரிமையாளர்) மற்றும் [வாடகைதாரர் B] (வாடகைதாரர்) இடையே.", en: "This agreement is between [Owner A] (the owner) and [Tenant B] (the tenant).", te: "ఈ ఒప్పందం [యజమాని A] (యజమాని) మరియు [అద్దెదారు B] (అద్దెదారు) మధ్య." } },
    { n: 2, heading: { ta: "காலம்", en: "Term", te: "కాలం" }, text: { ta: "01-12-2026 முதல் 11 மாதங்கள்; 30-11-2027 வரை வெளியேற முடியாது.", en: "11 months from 01-12-2026; no exit before 30-11-2027.", te: "01-12-2026 నుండి 11 నెలలు; 30-11-2027 వరకు బయటకు వెళ్ళలేరు." } },
    { n: 3, heading: { ta: "வாடகை", en: "Rent", te: "అద్దె" }, text: { ta: "மாத வாடகை ₹12,500, ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள்.", en: "Monthly rent ₹12,500, due by the 5th of each month.", te: "నెలవారీ అద్దె ₹12,500, ప్రతి నెల 5వ తేదీలోగా." } },
    { n: 4, heading: { ta: "முன்பணம்", en: "Deposit", te: "డిపాజిట్" }, text: { ta: "முன்பணம் ₹75,000. ஏதேனும் ஒரு மாத வாடகை தாமதமானால் முன்பணம் முழுவதும் பறிமுதல்.", en: "Deposit ₹75,000. If any month's rent is late, the whole deposit is forfeited.", te: "డిపాజిట్ ₹75,000. ఏ నెల అద్దె ఆలస్యమైనా మొత్తం డిపాజిట్ జప్తు." } },
    { n: 5, heading: { ta: "நுழைவு", en: "Entry", te: "ప్రవేశం" }, text: { ta: "உரிமையாளர் எந்த நேரத்திலும் அறிவிப்பின்றிக் கடைக்குள் நுழையலாம்.", en: "The owner may enter the shop at any time without notice.", te: "యజమాని ఎప్పుడైనా నోటీసు లేకుండా దుకాణంలోకి ప్రవేశించవచ్చు." } },
    { n: 6, heading: { ta: "வாடகை உயர்வு", en: "Increase", te: "పెంపు" }, text: { ta: "ஒவ்வொரு ஆண்டும் வாடகை 15% தானாக உயரும்.", en: "Rent rises by 15% automatically every year.", te: "ప్రతి సంవత్సరం అద్దె 15% స్వయంచాలకంగా పెరుగుతుంది." } },
    { n: 7, heading: { ta: "அறிவிப்பு", en: "Notice", te: "నోటీసు" }, text: { ta: "எந்தத் தரப்பும் இரண்டு மாத எழுத்து அறிவிப்புடன் முடிக்கலாம் (30-11-2027 க்குப் பின்).", en: "Either party may end it with two months' written notice (after 30-11-2027).", te: "ఏ పక్షమైనా రెండు నెలల రాతపూర్వక నోటీసుతో ముగించవచ్చు (30-11-2027 తర్వాత)." } },
  ] satisfies Clause[],
  money: [
    { what: { ta: "மாத வாடகை", en: "Monthly rent", te: "నెలవారీ అద్దె" }, amount: "₹12,500", clause: 3 },
    { what: { ta: "முன்பணம்", en: "Deposit", te: "డిపాజిట్" }, amount: "₹75,000", clause: 4 },
  ],
  dates: [
    { what: { ta: "தொடக்கம்", en: "Starts", te: "ప్రారంభం" }, date: "01-12-2026", iso: "20261201", clause: 2 },
    { what: { ta: "வாடகை கெடு", en: "Rent due", te: "అద్దె గడువు" }, date: "5th of each month", iso: "20261205", clause: 3, monthly: true },
    { what: { ta: "வெளியேற முடியாத காலம் முடிவு", en: "Lock-in ends", te: "లాక్-ఇన్ ముగింపు" }, date: "30-11-2027", iso: "20271130", clause: 2 },
  ],
  obligations: [
    { who: { ta: "வாடகைதாரர்", en: "Tenant", te: "అద్దెదారు" }, what: { ta: "5ஆம் தேதிக்குள் வாடகை செலுத்துதல்", en: "Pay rent by the 5th", te: "5వ తేదీలోగా అద్దె చెల్లించడం" }, clause: 3 },
    { who: { ta: "வாடகைதாரர்", en: "Tenant", te: "అద్దెదారు" }, what: { ta: "30-11-2027 வரை தங்குதல்", en: "Stay until 30-11-2027", te: "30-11-2027 వరకు ఉండడం" }, clause: 2 },
    { who: { ta: "இருவரும்", en: "Both", te: "ఇద్దరూ" }, what: { ta: "முடிக்க இரண்டு மாத அறிவிப்பு", en: "Two months' notice to end it", te: "ముగించడానికి రెండు నెలల నోటీసు" }, clause: 7 },
  ],
  flags: [
    { clause: 4, why: { ta: "ஒரு சிறு தாமதத்துக்கே முழு முன்பணமும் போகலாம் — ஒருதலைப்பட்சமாகத் தெரிகிறது.", en: "One late payment could cost the whole deposit — reads as one-sided.", te: "ఒక చిన్న ఆలస్యానికే మొత్తం డిపాజిట్ పోవచ్చు — ఏకపక్షంగా కనిపిస్తుంది." } },
    { clause: 5, why: { ta: "அறிவிப்பின்றி நுழைவு — வாடகைதாரரின் தனியுரிமையைப் பாதிக்கலாம்.", en: "Entry without notice — may affect the tenant's privacy and use.", te: "నోటీసు లేకుండా ప్రవేశం — అద్దెదారు గోప్యతను ప్రభావితం చేయవచ్చు." } },
    { clause: 6, why: { ta: "ஆண்டுக்கு 15% தானியங்கி உயர்வு — ஒப்புக்கொள்ளும் முன் கேளுங்கள்.", en: "An automatic 15% yearly rise — worth asking about before agreeing.", te: "సంవత్సరానికి 15% స్వయంచాలక పెంపు — అంగీకరించే ముందు అడగండి." } },
  ],
};

/* ---------------------------------------------- legal-aid eligibility */

/** Categories from s.12 of the Legal Services Authorities Act, 1987,
    in plain words. The income limit is set by each state; the loaded
    notification supplies it. */
export const ELIGIBILITY: Bi[] = [
  { ta: "நீங்கள் பெண் அல்லது குழந்தையா?", en: "Are you a woman or a child?", te: "మీరు మహిళ లేదా పిల్లలా?" },
  { ta: "உங்களுக்கு மாற்றுத்திறன் உள்ளதா?", en: "Do you have a disability?", te: "మీకు వైకల్యం ఉందా?" },
  { ta: "நீங்கள் காவலில் உள்ளீர்களா (சிறை, காப்பகம் உட்பட)?", en: "Are you in custody (including a protective home)?", te: "మీరు కస్టడీలో ఉన్నారా (రక్షణ గృహంతో సహా)?" },
  { ta: "நீங்கள் ஒரு தொழிற்சாலைத் தொழிலாளரா?", en: "Are you an industrial workman?", te: "మీరు పారిశ్రామిక కార్మికులా?" },
  { ta: "பேரழிவு, மனிதக் கடத்தல் அல்லது கட்டாய உழைப்பால் பாதிக்கப்பட்டவரா?", en: "Are you a victim of a disaster, trafficking or forced labour?", te: "విపత్తు, అక్రమ రవాణా లేదా బలవంతపు పనికి బాధితులా?" },
  { ta: "உங்கள் ஆண்டு வருமானம் மாநில வரம்புக்குக் கீழா? [வரம்பு ஏற்றிய அறிவிப்பிலிருந்து]", en: "Is your yearly income below the state's limit? [limit from the loaded notification]", te: "మీ వార్షిక ఆదాయం రాష్ట్ర పరిమితి కంటే తక్కువా? [పరిమితి లోడ్ చేసిన నోటిఫికేషన్ నుండి]" },
];

/* --------------------------------------------------------- the draft */

export const SAMPLE_FACTS = `[Client C] lent ₹40,000 to [D] on 02-09-2026. [D] gave cheque no. [000000] dated 01-10-2026 for ₹40,000. The bank returned it unpaid on 12-10-2026 with the memo "funds insufficient". [Client C] received the bank's memo on 14-10-2026.`;

export const SAMPLE_SUMMARY: Bi[] = [
  { ta: "கடன்: ₹40,000, 02-09-2026.", en: "Loan: ₹40,000 on 02-09-2026.", te: "రుణం: ₹40,000, 02-09-2026." },
  { ta: "காசோலை: ₹40,000, தேதி 01-10-2026; 12-10-2026 அன்று “போதிய நிதி இல்லை” எனத் திரும்பியது.", en: "Cheque: ₹40,000 dated 01-10-2026; returned 12-10-2026, “funds insufficient”.", te: "చెక్: ₹40,000, తేదీ 01-10-2026; 12-10-2026న “తగినంత నిధులు లేవు” అని తిరిగి వచ్చింది." },
  { ta: "வங்கித் தகவல் பெற்றது: 14-10-2026 — அறிவிப்புக்கான 30 நாள் கணக்கு இங்கிருந்து (s.138).", en: "Bank memo received: 14-10-2026 — the 30 days for notice run from here (s.138).", te: "బ్యాంకు సమాచారం అందింది: 14-10-2026 — నోటీసుకు 30 రోజులు ఇక్కడి నుండి (s.138)." },
];
