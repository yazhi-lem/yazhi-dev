import type { WorkspaceMeta } from "@yazhi/workspace/types";

/** Guru · குரு — the institute's own notebook (PRD Part 2). Plain data:
    safe for server components, routes and the launcher. */
export const GURU_META: WorkspaceMeta = {
  id: "guru",
  name: "Guru",
  taName: "குரு",
  tagline: {
    ta: "நிறுவனத்தின் சொந்தக் குறிப்பேடு — ஒவ்வொரு பதிலும் குருநூலின் பக்கத்துடன்",
    en: "The institute's own notebook — every answer cites a page of the GuruBook",
  },
  tinai: "mullai",
  runtime: "device",
  languages: ["ta", "en"],
  base: "/guru",
  owner: "Jai Prakash",
  status: { ta: "உருவாக்கத்தில் · நான்கு மாதிரிப் பாடங்கள் தயார்", en: "Building · four sample Group IV lessons written" },
  pilot: { ta: "உள்ளூர் தொகுதி 1 · 23 நவம்பர் 2026 முதல்", en: "Local batch 1 from 23 Nov 2026 · 8-week paid pilot" },
  agents: ["Note agent", "Vaathi"],
  views: [
    {
      id: "notebook",
      label: { ta: "குறிப்பேடு", en: "Notebook" },
      purpose: {
        ta: "தமிழில் கேளுங்கள். ஒவ்வொரு பதிலும் குருநூலின் பக்கத்தைச் சுட்டும்; இல்லையெனில் “இந்நூல்களில் இல்லை” என்று சொல்லும்.",
        en: "Ask in Tamil. Every answer points to a page of the GuruBook — or says it isn't in these sources.",
      },
      layout: { main: ["guru.notebook"], aside: ["guru.page", "guru.books", "workflow"] },
    },
    {
      id: "tiers",
      label: { ta: "நிலைகள்", en: "Tiers" },
      purpose: {
        ta: "ஒரு பாடத்தை மூன்று நிலைகளில்: குரூப் IV சுருக்கக் குறிப்பு, குரூப் II/IIA அமைப்புக் குறிப்பு, குரூப் I முதன்மைத் தேர்வு வரைவு.",
        en: "One chapter, three depths: a Group IV short note, a Group II/IIA structured note, a Group I mains outline.",
      },
      layout: { main: ["guru.tiers"], aside: ["guru.glossary", "workflow"] },
    },
    {
      id: "quiz",
      label: { ta: "பயிற்சித் தேர்வு", en: "Quiz" },
      purpose: {
        ta: "பத்து வினாக்களில் ஐந்து மாதிரி. தவறான விடைக்கு விளக்கமும் பக்கமும்; அடுத்த பாடத்தை வாத்தி சொல்வார்.",
        en: "Five sample questions of ten. Wrong answers get an explanation with its page; Vaathi suggests the next lesson.",
      },
      layout: { main: ["guru.quiz"], aside: ["guru.vaathi", "guru.page", "workflow"] },
    },
    {
      id: "teacher",
      label: { ta: "ஆசிரியர்", en: "Teacher" },
      purpose: {
        ta: "நிறுவனத்தின் பாடப்பொருளைப் பதிவேற்றுங்கள், இயந்திர வரைவுகளை ஒப்புக்கொள்ளுங்கள், வகுப்பின் பலவீனப் பகுதிகளைப் பாருங்கள். ஒவ்வொரு ஒப்புதலும் பதிவாகும்.",
        en: "Upload the institute's material, approve machine drafts and see the class's weak areas. Every approval is logged.",
      },
      layout: { main: ["guru.upload", "guru.drafts"], aside: ["guru.class", "audit", "about"] },
    },
  ],
  workflows: [
    {
      id: "batch1-demo",
      title: { ta: "தொகுதி 1 செயல்விளக்கம்", en: "Batch-1 demo" },
      who: { ta: "நிறுவனத்துக்கு", en: "For an institute" },
      summary: {
        ta: "PRD-யின் மூன்று நிமிடச் செயல்விளக்கம், தமிழில் முதலில்.",
        en: "The PRD's three-minute demo, Tamil first.",
      },
      length: "3 min",
      steps: [
        { id: "ask", view: "notebook", title: { ta: "குருநூலைத் திறந்து கேளுங்கள்", en: "Open the GuruBook and ask" }, hint: { ta: "“சோழர் கால ஆட்சி முறை” பரிந்துரையை அழுத்துங்கள்.", en: "Press the Chola administration suggestion." } },
        { id: "chip", view: "notebook", title: { ta: "பக்கச் சுட்டியைத் திறவுங்கள்", en: "Tap a page chip" }, hint: { ta: "பதிலின் கீழ் உள்ள p. 118 ஐ அழுத்துங்கள் — பக்கம் அருகில் திறக்கும்.", en: "Press p. 118 under the answer — the page opens beside it." } },
        { id: "off", view: "notebook", title: { ta: "பாடத்திட்டத்துக்கு வெளியே கேளுங்கள்", en: "Ask something off-syllabus" }, hint: { ta: "“இந்நூல்களில் இல்லை” என்ற பதிலைப் பாருங்கள்.", en: "See the “not in these sources” reply." } },
        { id: "tier", view: "tiers", title: { ta: "நிலை IV → II → I", en: "Switch tier IV → II → I" }, hint: { ta: "ஒரே பாடம் மூன்று ஆழங்களில்.", en: "Same chapter, three depths." } },
        { id: "quiz", view: "quiz", title: { ta: "தேர்வு எழுதி ஒரு தவறை விளக்கத்துடன் திறவுங்கள்", en: "Take the quiz, open one wrong-answer explanation" }, hint: { ta: "சமர்ப்பித்த பின் விளக்கமும் பக்கமும் வரும்.", en: "After you submit, each explanation carries its page." } },
        { id: "upload", view: "teacher", title: { ta: "ஒரு குறிப்பைப் பதிவேற்றுங்கள்", en: "Upload a note" }, hint: { ta: "PDF அல்லது பக்கப் படம். நிறுவனக் கணினியை விட்டு வெளியேறாது.", en: "A PDF or a photo of a page. It never leaves the institute machine." } },
        { id: "approve", view: "teacher", title: { ta: "ஒரு இயந்திர வரைவை ஒப்புக்கொள்ளுங்கள்", en: "Approve a machine draft" }, hint: { ta: "ஒப்புதல் தணிக்கைப் பதிவில் சேரும்.", en: "The approval lands in the audit log." }, gate: true },
        { id: "english", view: "notebook", title: { ta: "ஆங்கிலத்துக்கு மாற்றுங்கள்", en: "Toggle to English" }, hint: { ta: "மேலே உள்ள த | EN.", en: "த | EN at the top." } },
      ],
    },
    {
      id: "build-book",
      title: { ta: "குருநூல் உருவாக்கம்", en: "Build a GuruBook" },
      who: { ta: "ஆசிரியர் · நிர்வாகி", en: "Teacher · admin" },
      summary: { ta: "நிறுவனப் பொருளிலிருந்து ஒரு பாடத்தை வகுப்புக்குத் தயாராக்குதல்.", en: "Take one unit from the institute's material to class-ready." },
      steps: [
        { id: "upload", view: "teacher", title: { ta: "ஒரு குறிப்பைப் பதிவேற்றுங்கள்", en: "Upload a note" }, hint: { ta: "PDF அல்லது பக்கப் படம்.", en: "A PDF or a photo of a page." } },
        { id: "check-pages", view: "notebook", title: { ta: "பக்கங்கள் சரியாகச் சுட்டப்படுகின்றனவா பாருங்கள்", en: "Check the page chips land right" }, hint: { ta: "ஒரு கேள்வி கேட்டு, சுட்டிய பக்கத்தைத் திறவுங்கள்.", en: "Ask a question and open the cited page." } },
        { id: "tier", view: "tiers", title: { ta: "மூன்று நிலைகளையும் படியுங்கள்", en: "Read all three tiers" }, hint: { ta: "தவறிருந்தால் வரைவைத் திருத்துங்கள்.", en: "Edit the draft where it's wrong." } },
        { id: "approve", view: "teacher", title: { ta: "ஒரு இயந்திர வரைவை ஒப்புக்கொள்ளுங்கள்", en: "Approve a machine draft" }, hint: { ta: "ஒப்புதல் தணிக்கைப் பதிவில் சேரும்.", en: "The approval lands in the audit log." }, gate: true },
        { id: "class", view: "teacher", title: { ta: "வகுப்பின் பலவீனப் பகுதிகளைப் பாருங்கள்", en: "Review the class's weak areas" }, hint: { ta: "அடுத்த வகுப்பை அதற்கேற்பத் திட்டமிடுங்கள்.", en: "Plan the next class around them." } },
      ],
    },
    {
      id: "daily",
      title: { ta: "தினசரிப் பயிற்சி", en: "Daily practice" },
      who: { ta: "தேர்வர்", en: "Aspirant" },
      summary: { ta: "ஒரு பாடம், ஒரு தேர்வு, அடுத்தது என்ன.", en: "One chapter, one quiz, what next." },
      length: "20 min",
      steps: [
        { id: "tier", view: "tiers", title: { ta: "இன்றைய பாடத்தை உங்கள் நிலையில் படியுங்கள்", en: "Read today's chapter at your tier" }, hint: { ta: "குரூப் IV இல் தொடங்குங்கள்.", en: "Start at Group IV." } },
        { id: "ask", view: "notebook", title: { ta: "சந்தேகத்தைக் கேளுங்கள்", en: "Ask about what's unclear" }, hint: { ta: "பதில் பக்கத்தைச் சுட்டும்.", en: "The answer points to its page." } },
        { id: "quiz", view: "quiz", title: { ta: "பயிற்சித் தேர்வு", en: "Take the quiz" }, hint: { ta: "தவறுகளின் விளக்கங்களைப் படியுங்கள்.", en: "Read why the wrong ones were wrong." } },
        { id: "next", view: "quiz", title: { ta: "வாத்தியின் அடுத்த பாடம்", en: "Open Vaathi's next lesson" }, hint: { ta: "பலவீனமான பகுதியிலிருந்து தொடங்கும்.", en: "It starts from your weakest area." } },
      ],
    },
  ],
};
