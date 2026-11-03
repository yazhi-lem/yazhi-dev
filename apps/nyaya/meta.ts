import type { WorkspaceMeta } from "@yazhi/workspace/types";

/** Nyaya · நியாயா · న్యాయ — legal information for law colleges and
    legal-aid clinics (PRD Part 3). Tamil first, Telugu next, English. */
export const NYAYA_META: WorkspaceMeta = {
  id: "nyaya",
  name: "Nyaya",
  taName: "நியாயா",
  teName: "న్యాయ",
  tagline: {
    ta: "சட்டம் என்ன சொல்கிறது — அது நிற்கும் பிரிவுடன். தகவல் மட்டுமே, ஆலோசனை அல்ல.",
    en: "What the law says — with the section it rests on. Information, never advice.",
    te: "చట్టం ఏమి చెబుతుందో — అది ఆధారపడిన సెక్షన్‌తో. సమాచారం మాత్రమే, సలహా కాదు.",
  },
  tinai: "marutham",
  runtime: "yazhi-api",
  languages: ["ta", "te", "en"],
  base: "/nyaya",
  owner: "Supriya",
  status: { ta: "உருவாக்கத்தில் · தெலுங்கில் மேற்கோள் கேள்வி-பதில் உள்ளது", en: "Building · cited Q&A, case summary and notice draft exist in Telugu", te: "నిర్మాణంలో · తెలుగులో ఉల్లేఖన ప్రశ్నోత్తరాలు ఉన్నాయి" },
  pilot: { ta: "மூடிய பீட்டா · டிசம்பர் 2026", en: "Closed beta · Dec 2026", te: "క్లోజ్డ్ బీటా · డిసెంబర్ 2026" },
  agents: ["Nyaya"],
  views: [
    {
      id: "ask",
      icon: "scale",
      label: { ta: "கேள்", en: "Ask", te: "అడగండి" },
      purpose: {
        ta: "சட்டக் கேள்வி கேளுங்கள். ஒவ்வொரு படியும் சட்டப் பிரிவைச் சுட்டும்; பொருந்தாவிட்டால் “தெரியவில்லை” என்று சட்ட உதவியிடம் ஒப்படைக்கும்.",
        en: "Ask a legal question. Every step cites the section of the Act; if nothing matches, Nyaya says it doesn't know and hands you to legal aid.",
        te: "చట్టపరమైన ప్రశ్న అడగండి. ప్రతి దశ చట్ట సెక్షన్‌ను చూపుతుంది; సరిపోలకపోతే “తెలియదు” అని న్యాయ సహాయానికి అప్పగిస్తుంది.",
      },
      layout: { main: ["nyaya.ask"], aside: ["nyaya.citation", "nyaya.lsa", "workflow"] },
    },
    {
      id: "explain",
      icon: "doc",
      label: { ta: "ஆவண விளக்கம்", en: "Explain a document", te: "పత్రం వివరణ" },
      purpose: {
        ta: "ஒப்பந்தத்தைப் பதிவேற்றுங்கள்: தரப்பினர், கடமைகள், தொகைகள், தேதிகள், கவனிக்க வேண்டிய பிரிவுகள் — ஒவ்வொன்றும் மூலப் பிரிவுடன். கையெழுத்திடலாமா என்று சொல்லாது.",
        en: "Upload an agreement: parties, obligations, money, dates and flagged clauses — each linked to its clause. It never says a document is safe to sign.",
        te: "ఒప్పందాన్ని అప్‌లోడ్ చేయండి: పక్షాలు, బాధ్యతలు, మొత్తాలు, తేదీలు, గుర్తించిన నిబంధనలు — ప్రతిదీ దాని నిబంధనతో. సంతకం చేయవచ్చో చెప్పదు.",
      },
      layout: { main: ["nyaya.explain"], aside: ["nyaya.disclaimer", "workflow"] },
    },
    {
      id: "eligibility",
      icon: "shield",
      label: { ta: "இலவச சட்ட உதவி", en: "Legal-aid check", te: "ఉచిత న్యాయ సహాయం" },
      purpose: {
        ta: "சில ஆம்/இல்லை கேள்விகள்: இலவச சட்ட உதவிக்குத் தகுதியிருக்கலாமா என்று அறியுங்கள். பதில்கள் எங்கும் சேமிக்கப்படாது.",
        en: "A few yes/no questions: find out whether you may qualify for free legal aid. Your answers are stored nowhere.",
        te: "కొన్ని అవును/కాదు ప్రశ్నలు: ఉచిత న్యాయ సహాయానికి మీరు అర్హులో తెలుసుకోండి. మీ సమాధానాలు ఎక్కడా నిల్వ చేయబడవు.",
      },
      layout: { main: ["nyaya.eligibility"], aside: ["nyaya.lsa", "nyaya.disclaimer"] },
    },
    {
      id: "draft",
      icon: "pen",
      label: { ta: "வரைவு", en: "Summary & draft", te: "ముసాయిదా" },
      purpose: {
        ta: "வழக்கு உண்மைகளை ஒட்டுங்கள்: சுருக்கமும் அறிவிப்பு வரைவும் — “வழக்கறிஞர் மதிப்பாய்வுக்கான வரைவு”. திருத்தங்கள் பதிவாகும்.",
        en: "Paste case facts: get a summary and a notice draft, marked “Draft, for advocate review”. Edits are logged.",
        te: "కేసు వాస్తవాలను అతికించండి: సారాంశం మరియు నోటీసు ముసాయిదా — “న్యాయవాది సమీక్ష కోసం ముసాయిదా”.",
      },
      layout: { main: ["nyaya.draft"], aside: ["audit", "about"] },
    },
  ],
  workflows: [
    {
      id: "clinic-demo",
      title: { ta: "சட்ட உதவி மையச் செயல்விளக்கம்", en: "Clinic demo", te: "క్లినిక్ డెమో" },
      who: { ta: "கல்லூரி அல்லது மையத்துக்கு", en: "For a college or clinic", te: "కళాశాల లేదా క్లినిక్ కోసం" },
      summary: { ta: "PRD-யின் 2.5 நிமிடச் செயல்விளக்கம்; ஹைதராபாத்துக்கு அதே தெலுங்கில்.", en: "The PRD's 2.5-minute demo; the same script in Telugu for Hyderabad.", te: "PRD యొక్క 2.5 నిమిషాల డెమో; హైదరాబాద్ కోసం అదే తెలుగులో." },
      length: "2.5 min",
      steps: [
        { id: "cheque", view: "ask", title: { ta: "காசோலைச் சுட்டியை அழுத்தி s.138 ஐத் திறவுங்கள்", en: "Tap the cheque-bounce chip and open s.138", te: "చెక్ బౌన్స్ చిప్ నొక్కి s.138 తెరవండి" }, hint: { ta: "மேற்கோள் பக்கப் பலகையில் திறக்கும்.", en: "It opens in the citation side panel.", te: "ఉల్లేఖన ప్యానెల్‌లో తెరుచుకుంటుంది." } },
        { id: "toggle", view: "ask", title: { ta: "ஆங்கிலத்துக்கு மாற்றி மீண்டும் தமிழுக்கு", en: "Toggle to English and back", te: "ఇంగ్లీష్‌కు మార్చి తిరిగి" }, hint: { ta: "மேலே உள்ள த | తె | EN.", en: "த | తె | EN at the top.", te: "పైన ఉన్న த | తె | EN." } },
        { id: "upload", view: "explain", title: { ta: "மாதிரி ஒப்பந்தம் — மூன்று கவனப் பிரிவுகள்", en: "Sample agreement — three flagged clauses", te: "నమూనా ఒప్పందం — మూడు గుర్తించిన నిబంధనలు" }, hint: { ta: "ஒன்றை மூலப் பிரிவில் திறவுங்கள்.", en: "Open one at its source clause.", te: "ఒకదాన్ని దాని నిబంధనలో తెరవండి." } },
        { id: "deadlines", view: "explain", title: { ta: "காலக்கெடுக்களை ஏற்றுமதி செய்யுங்கள்", en: "Export the deadlines", te: "గడువులను ఎగుమతి చేయండి" }, hint: { ta: ".ics நாட்காட்டிக் கோப்பு.", en: "An .ics calendar file.", te: ".ics క్యాలెండర్ ఫైల్." } },
        { id: "eligible", view: "eligibility", title: { ta: "தகுதிச் சோதனை → தொடர்பு அட்டை", en: "Run the eligibility check → contact card", te: "అర్హత పరీక్ష → సంప్రదింపు కార్డు" }, hint: { ta: "பதில்கள் சேமிக்கப்படாது.", en: "Answers aren't stored.", te: "సమాధానాలు నిల్వ కావు." } },
        { id: "refuse", view: "ask", title: { ta: "நில வழக்கு உத்தி கேளுங்கள் — நியாயா மறுக்கும்", en: "Ask a land-case strategy question — Nyaya declines", te: "భూ వివాద వ్యూహం అడగండి — న్యాయ నిరాకరిస్తుంది" }, hint: { ta: "தெரியவில்லை, சட்ட உதவியிடம் ஒப்படைப்பு.", en: "It doesn't know and hands off to legal aid.", te: "తెలియదు, న్యాయ సహాయానికి అప్పగింపు." } },
        { id: "log", view: "draft", title: { ta: "தணிக்கைப் பதிவில் முடியுங்கள்", en: "Close on the audit log", te: "ఆడిట్ లాగ్‌తో ముగించండి" }, hint: { ta: "யார், என்ன, எப்போது.", en: "Who, what, when.", te: "ఎవరు, ఏమి, ఎప్పుడు." } },
      ],
    },
    {
      id: "walk-in",
      title: { ta: "வருகையாளர் ஆவணம்", en: "Walk-in: explain a document", te: "వచ్చినవారి పత్రం" },
      who: { ta: "மையத் தன்னார்வலர்", en: "Clinic volunteer", te: "క్లినిక్ స్వచ్ఛంద సేవకుడు" },
      summary: { ta: "ஒருவர் கையில் உள்ள காகிதத்தைப் புரியவைத்தல், சரியான இடத்துக்கு அனுப்புதல்.", en: "Help someone understand the paper in their hand, then send them to the right place.", te: "చేతిలోని కాగితాన్ని అర్థం చేయించి, సరైన చోటికి పంపడం." },
      steps: [
        { id: "consent", view: "explain", title: { ta: "ஒப்புதல் பெற்றுப் பதிவேற்றுங்கள்", en: "Take consent, then upload", te: "అనుమతి తీసుకుని అప్‌లోడ్ చేయండి" }, hint: { ta: "மூன்றாம் தரப்பினர் விவரங்களும் இருக்கலாம்.", en: "It may hold third parties' details too.", te: "మూడవ పక్షాల వివరాలు కూడా ఉండవచ్చు." } },
        { id: "upload", view: "explain", title: { ta: "மாதிரி ஒப்பந்தம் — மூன்று கவனப் பிரிவுகள்", en: "Sample agreement — three flagged clauses", te: "నమూనా ఒప్పందం — మూడు గుర్తించిన నిబంధనలు" }, hint: { ta: "தொகைகளும் தேதிகளும் மூலத்திலிருந்து அப்படியே.", en: "Amounts and dates copied exactly from the source.", te: "మొత్తాలు, తేదీలు మూలం నుండి యథాతథంగా." } },
        { id: "eligible", view: "eligibility", title: { ta: "தகுதிச் சோதனை → தொடர்பு அட்டை", en: "Run the eligibility check → contact card", te: "అర్హత పరీక్ష → సంప్రదింపు కార్డు" }, hint: { ta: "பதில்கள் சேமிக்கப்படாது.", en: "Answers aren't stored.", te: "సమాధానాలు నిల్వ కావు." } },
      ],
    },
    {
      id: "clerk",
      title: { ta: "எழுத்தரின் வரைவு", en: "Clerk's draft", te: "గుమాస్తా ముసాయిదా" },
      who: { ta: "வழக்கறிஞரின் எழுத்தர்", en: "Advocate's clerk", te: "న్యాయవాది గుమాస్తా" },
      summary: { ta: "உண்மைகளிலிருந்து சுருக்கமும் அறிவிப்பு வரைவும், வழக்கறிஞர் திருத்துவதற்கு.", en: "From facts to a summary and a notice draft the advocate edits.", te: "వాస్తవాల నుండి సారాంశం, న్యాయవాది సవరించే నోటీసు ముసాయిదా." },
      steps: [
        { id: "facts", view: "draft", title: { ta: "உண்மைகளை ஒட்டுங்கள்", en: "Paste the case facts", te: "కేసు వాస్తవాలను అతికించండి" }, hint: { ta: "மாதிரி உண்மைகள் முன்பே உள்ளன.", en: "Sample facts are filled in.", te: "నమూనా వాస్తవాలు ముందే ఉన్నాయి." } },
        { id: "generate", view: "draft", title: { ta: "சுருக்கமும் வரைவும் உருவாக்குங்கள்", en: "Make the summary and draft", te: "సారాంశం, ముసాయిదా రూపొందించండి" }, hint: { ta: "“வழக்கறிஞர் மதிப்பாய்வுக்கான வரைவு” என்று குறிக்கப்படும்.", en: "Marked “Draft, for advocate review”.", te: "“న్యాయవాది సమీక్ష కోసం ముసాయిదా” అని గుర్తించబడుతుంది." } },
        { id: "download", view: "draft", title: { ta: "வரைவைப் பதிவிறக்குங்கள் (.doc)", en: "Download the draft (.doc)", te: "ముసాయిదా డౌన్‌లోడ్ (.doc)" }, hint: { ta: "பதிவிறக்கம் தணிக்கைப் பதிவில் சேரும்.", en: "The download is logged.", te: "డౌన్‌లోడ్ లాగ్ అవుతుంది." }, gate: true },
      ],
    },
  ],
};
