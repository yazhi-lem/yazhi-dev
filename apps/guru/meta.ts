import type { WorkspaceMeta } from "@yazhi/workspace/types";

/** Guru · குரு — the institute's own notebook (PRD Part 2), laid out after
    the Guru Book mockups: a notebook home, cited answers, "not in your
    notes", practice from past papers, history, and the faculty view of a
    notebook's sources and sharing. Plain data: safe for server components,
    routes and the launcher. */
export const GURU_META: WorkspaceMeta = {
  id: "guru",
  name: "Guru",
  taName: "குரு",
  tagline: {
    ta: "நிறுவனத்தின் சொந்தக் குறிப்பேடு — ஒவ்வொரு பதிலும் உங்கள் குறிப்புகளின் பக்கத்துடன்",
    en: "The institute's own notebook — every answer points to a page of your notes",
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
      id: "notebooks",
      icon: "book",
      label: { ta: "குறிப்பேடுகள்", en: "Notebooks" },
      purpose: {
        ta: "உங்கள் குறிப்பேடுகள். எதையும் கேளுங்கள் — தமிழ், ஆங்கிலம் அல்லது தங்கிலீஷில்.",
        en: "Your notebooks. Ask anything — in Tamil, English or Tanglish.",
      },
      layout: { main: ["guru.home"], aside: ["guru.continue", "workflow"] },
    },
    {
      id: "ask",
      icon: "ask",
      label: { ta: "கேள்", en: "Ask" },
      purpose: {
        ta: "பதில்கள் இந்தக் குறிப்பேட்டின் மூலங்களிலிருந்து மட்டுமே. ஒவ்வொரு வரியும் பக்கத்தைச் சுட்டும்; இல்லையெனில் “உங்கள் குறிப்புகளில் இல்லை”.",
        en: "Answers come only from this notebook's sources. Every line points to its page — or it says “not in your notes”.",
      },
      layout: { main: ["guru.ask"], aside: ["guru.page", "workflow"] },
    },
    {
      id: "practice",
      icon: "practice",
      label: { ta: "பயிற்சி", en: "Practice" },
      purpose: {
        ta: "இந்தக் குறிப்பேட்டின் பழைய வினாத்தாள்களிலிருந்து பயிற்சி, மூன்று நிலைச் சுருக்கம், விரைவுத் தேர்வு.",
        en: "Practice from this notebook's past papers, a summary at three depths, and a quick quiz.",
      },
      layout: { main: ["guru.practice"], aside: ["guru.vaathi", "guru.glossary"] },
    },
    {
      id: "history",
      icon: "history",
      label: { ta: "வரலாறு", en: "History" },
      purpose: {
        ta: "நீங்கள் கேட்டவையும் தேர்வு முயற்சிகளும் — இந்தச் சாதனத்தில் மட்டும்.",
        en: "What you asked and how your quizzes went — kept on this device only.",
      },
      layout: { main: ["guru.history"], aside: ["about"] },
    },
    {
      id: "faculty",
      icon: "teacher",
      label: { ta: "ஆசிரியர்", en: "Faculty" },
      purpose: {
        ta: "குறிப்பேட்டின் மூலங்கள், பகிர்வு, மாணவர் கேள்விகள். பதிவேற்றம், ஒப்புதல், ஒவ்வொன்றும் பதிவாகும்.",
        en: "A notebook's sources, who it's shared with, and what students ask. Uploads and approvals are logged.",
      },
      layout: { main: ["guru.faculty"], aside: ["guru.sharing", "guru.languages", "audit"] },
    },
  ],
  workflows: [
    {
      id: "batch1-demo",
      title: { ta: "தொகுதி 1 செயல்விளக்கம்", en: "Batch-1 demo" },
      who: { ta: "நிறுவனத்துக்கு", en: "For an institute" },
      summary: { ta: "PRD-யின் மூன்று நிமிடச் செயல்விளக்கம், தமிழில் முதலில்.", en: "The PRD's three-minute demo, Tamil first." },
      length: "3 min",
      steps: [
        { id: "ask", view: "notebooks", title: { ta: "குறிப்பேட்டைத் திறந்து கேளுங்கள்", en: "Open the notebook and ask" }, hint: { ta: "“சோழர் கால ஆட்சி முறை பற்றி விளக்குக” என்று கேளுங்கள்.", en: "Ask “Explain the Chola system of administration”." } },
        { id: "chip", view: "ask", title: { ta: "மூலத்தைத் திறவுங்கள்", en: "Open a source" }, hint: { ta: "பதிலின் கீழ் உள்ள மூலம் 1 ஐ அழுத்துங்கள் — பக்கம் விரியும்.", en: "Press source 1 under the answer — the page opens." } },
        { id: "off", view: "ask", title: { ta: "குறிப்புகளுக்கு வெளியே கேளுங்கள்", en: "Ask something off-syllabus" }, hint: { ta: "“உங்கள் குறிப்புகளில் இல்லை” அட்டையும் நெருங்கிய தலைப்பும் வரும்.", en: "See “Not in your notes” and the closest topic." } },
        { id: "tier", view: "practice", title: { ta: "சுருக்கம்: நிலை IV → II → I", en: "Summary: tier IV → II → I" }, hint: { ta: "ஒரே பாடம் மூன்று ஆழங்களில்.", en: "Same chapter, three depths." } },
        { id: "quiz", view: "practice", title: { ta: "பழைய வினாவுக்கு விடை எழுதிப் பாருங்கள்", en: "Try a past-paper answer" }, hint: { ta: "எழுதிய பின் குறிப்புகளின் வரைவுடன் ஒப்பிடுங்கள்.", en: "Then compare with the outline from your notes." } },
        { id: "upload", view: "faculty", title: { ta: "ஒரு குறிப்பைப் பதிவேற்றுங்கள்", en: "Upload a note" }, hint: { ta: "நிறுவனக் கணினியை விட்டு வெளியேறாது.", en: "It never leaves the institute machine." } },
        { id: "approve", view: "faculty", title: { ta: "ஒரு இயந்திர வரைவை ஒப்புக்கொள்ளுங்கள்", en: "Approve a machine draft" }, hint: { ta: "கற்றல் உதவிகள் தாவலில்; ஒப்புதல் பதிவாகும்.", en: "Under Study aids; the approval is logged." }, gate: true },
        { id: "english", view: "ask", title: { ta: "ஆங்கிலத்துக்கு மாற்றுங்கள்", en: "Toggle to English" }, hint: { ta: "மேலே உள்ள த | EN, அல்லது பதிலின் கீழ் “பதில் மொழி”.", en: "த | EN at the top, or “Answer in” under an answer." } },
      ],
    },
    {
      id: "build-book",
      title: { ta: "குறிப்பேடு உருவாக்கம்", en: "Build a notebook" },
      who: { ta: "ஆசிரியர் · நிர்வாகி", en: "Faculty · admin" },
      summary: { ta: "நிறுவனப் பொருளிலிருந்து ஒரு பாடத்தை வகுப்புக்குத் தயாராக்குதல்.", en: "Take one unit from the institute's material to class-ready." },
      steps: [
        { id: "upload", view: "faculty", title: { ta: "ஒரு குறிப்பைப் பதிவேற்றுங்கள்", en: "Upload a note" }, hint: { ta: "நிறுவனக் கணினியை விட்டு வெளியேறாது.", en: "It never leaves the institute machine." } },
        { id: "check-pages", view: "ask", title: { ta: "மூலங்கள் சரியான பக்கத்தைச் சுட்டுகின்றனவா பாருங்கள்", en: "Check sources land on the right page" }, hint: { ta: "ஒரு கேள்வி கேட்டு, சுட்டிய பக்கத்தைத் திறவுங்கள்.", en: "Ask a question and open the cited page." } },
        { id: "approve", view: "faculty", title: { ta: "ஒரு இயந்திர வரைவை ஒப்புக்கொள்ளுங்கள்", en: "Approve a machine draft" }, hint: { ta: "கற்றல் உதவிகள் தாவலில்; ஒப்புதல் பதிவாகும்.", en: "Under Study aids; the approval is logged." }, gate: true },
        { id: "share", view: "faculty", title: { ta: "ஒரு பிரிவுடன் பகிருங்கள்", en: "Share with a section" }, hint: { ta: "அந்தப் பிரிவு மாணவர்கள் மட்டுமே திறக்க முடியும்.", en: "Only that section's students can open it." }, gate: true },
        { id: "questions", view: "faculty", title: { ta: "மாணவர் கேள்விகளைப் பாருங்கள்", en: "Read what students ask" }, hint: { ta: "குறிப்புகளில் இல்லாதவை — அடுத்த பதிவேற்றத்துக்கு.", en: "What wasn't in the notes — for the next upload." } },
      ],
    },
    {
      id: "daily",
      title: { ta: "தினசரிப் பயிற்சி", en: "Daily practice" },
      who: { ta: "தேர்வர்", en: "Aspirant" },
      summary: { ta: "ஒரு கேள்வி, ஒரு பழைய வினா, ஒரு தேர்வு, அடுத்தது என்ன.", en: "One question, one past paper, one quiz, what next." },
      length: "20 min",
      steps: [
        { id: "ask", view: "notebooks", title: { ta: "குறிப்பேட்டைத் திறந்து கேளுங்கள்", en: "Open the notebook and ask" }, hint: { ta: "சந்தேகத்தைக் கேளுங்கள்.", en: "Ask what's unclear." } },
        { id: "quiz", view: "practice", title: { ta: "பழைய வினாவுக்கு விடை எழுதிப் பாருங்கள்", en: "Try a past-paper answer" }, hint: { ta: "எழுதிய பின் குறிப்புகளின் வரைவுடன் ஒப்பிடுங்கள்.", en: "Then compare with the outline from your notes." } },
        { id: "mcq", view: "practice", title: { ta: "விரைவுத் தேர்வு", en: "Quick quiz" }, hint: { ta: "தவறுகளின் விளக்கங்களைப் படியுங்கள்.", en: "Read why the wrong ones were wrong." } },
        { id: "next", view: "practice", title: { ta: "வாத்தியின் அடுத்த பாடம்", en: "Open Vaathi's next lesson" }, hint: { ta: "பலவீனமான பகுதியிலிருந்து தொடங்கும்.", en: "It starts from your weakest area." } },
      ],
    },
  ],
};
