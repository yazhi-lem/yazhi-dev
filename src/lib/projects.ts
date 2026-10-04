/* ============================================================
   PROJECTS — one registry for the 2026 launch line.

   The home roadmap (fishbone), the "what we're building" cards, the
   /projects index and every /projects/[slug] page read from here, so a
   date or a gate changes in one place.

   Sources: the Yazhi harness launch line (dates, tiers, gates) and each
   project's public repository (what it does today). Where a feature is
   planned, the copy says so (-ம் / "will"); nothing planned is written
   as done (Aram 5). Demo links point only at things a person can open
   now, or say when they open.

   TAMIL IS A DRAFT until a native-speaker review signs it off.
   ============================================================ */

import type { Tone } from "@/bubble/tone";

export type BiText = { ta: string; en: string };
export type ProjectLink = BiText & { href: string; external?: boolean; note?: BiText };
export type Milestone = { date: string; label: BiText; tier: BiText };

export type Project = {
  slug: string;
  tone: Tone;
  name: BiText;
  /** what kind of thing it is, in two or three words */
  kind: BiText;
  /** one line: what it is */
  what: BiText;
  /** the problem it answers */
  why: BiText;
  /** what it does, one line each */
  does: BiText[];
  forWhom: BiText;
  /** the launch gate / hard rule it never breaks */
  gate: BiText;
  milestones: Milestone[];
  demo?: ProjectLink;
  repo?: string;
  /** shown first on home under "what we're building" */
  flagship?: boolean;
  /** project-specific reasons to enquire, offered before the common ones */
  asks?: BiText[];
};

const GH = "https://github.com/yazhi-lem";

export const PROJECTS: Project[] = [
  {
    slug: "adhan",
    tone: "palai",
    flagship: true,
    name: { ta: "ஆதன்", en: "Adhan" },
    kind: { ta: "மொழி மாதிரி", en: "Language model" },
    what: {
      ta: "தமிழை முதன்மையாகக் கொண்டு, அடித்தளத்திலிருந்து நாங்களே உருவாக்கும் சிறிய மொழி மாதிரி.",
      en: "A Tamil-first small language model we are building from the ground up.",
    },
    why: {
      ta: "ஆங்கிலத்துக்காக வடிவமைத்த டோக்கனைசர்கள் தமிழ்ச் சொற்களைத் துண்டு துண்டாக உடைக்கின்றன. ஆதன் தமிழ் எழுத்தையே அடிப்படை அலகாகக் கொள்கிறது.",
      en: "Tokenizers designed for English break Tamil words into fragments. Adhan takes the Tamil letter itself as its basic unit.",
    },
    does: [
      { ta: "உயிர்மெய் எழுத்தை அலகாகக் கொண்ட டோக்கனைசர் — சுமார் 12,000 அலகுகள்.", en: "A tokenizer built on Tamil letters (uyirmei) — about 12,000 units." },
      { ta: "GPU இல்லாமல், சாதாரணக் கணினியின் CPU-இலேயே பயிற்றுவிக்கலாம்.", en: "Trains on an ordinary computer's CPU — no GPU needed." },
      { ta: "திருக்குறள், புணர்ச்சி, உருபனியல் சோதனைகளால் மதிப்பிடப்படுகிறது.", en: "Evaluated with Thirukkural, sandhi and morphology tests." },
      { ta: "யாழ், இலக்கியா ஆகியவற்றுக்காகக் கைபேசியிலேயே இயங்கும் வகையில் சுருக்கப்படும்.", en: "Will be compressed to run on phones, for Yazh and Illakiya." },
    ],
    forWhom: {
      ta: "ஆய்வாளர்கள், உருவாக்குநர்கள், தமிழில் சேவை தர விரும்பும் நிறுவனங்கள்.",
      en: "Researchers, developers, and organisations that want to serve people in Tamil.",
    },
    gate: {
      ta: "ஒவ்வொரு அளவீட்டையும் ஒரே நிரலில் யார் வேண்டுமானாலும் மீண்டும் ஓட்டிப் பார்க்கலாம்; மதிப்பீட்டு வாயில்களைக் கடந்த பின்பே வெளியீடு.",
      en: "Anyone can reproduce every benchmark from one script; nothing ships before its evaluation gates pass.",
    },
    milestones: [
      { date: "2026-10-31", label: { ta: "டோக்கனைசர் அளவீடு", en: "Tokenizer benchmark" }, tier: { ta: "பொது", en: "Public" } },
      { date: "2026-12-26", label: { ta: "ஆதன் குட்டி v1", en: "Adhan Kutty v1" }, tier: { ta: "பொது", en: "Public" } },
    ],
    demo: { ta: "GitHub-இல் முயல்க", en: "Try it on GitHub", href: `${GH}/adhan`, external: true },
    repo: `${GH}/adhan`,
    asks: [{ ta: "ஆதனை என் தயாரிப்பில் பயன்படுத்த", en: "Use Adhan in my product" }],
  },
  {
    slug: "yazh",
    tone: "neytal",
    flagship: true,
    name: { ta: "யாழ்", en: "Yazh" },
    kind: { ta: "கற்றல் செல்லப்பிராணி", en: "Learning pet" },
    what: {
      ta: "குழந்தைகள் தாய்மொழியில் பேசி, விளையாடிக் கற்கும் செல்லப்பிராணி.",
      en: "A pet children talk to, play with, and learn from — in their mother tongue.",
    },
    why: {
      ta: "குழந்தை தாய்மொழியில் கேட்டால், பதிலும் தாய்மொழியிலேயே வர வேண்டும் — பாதுகாப்பாக.",
      en: "When a child asks in their mother tongue, the answer should come back in it — safely.",
    },
    does: [
      { ta: "ஐந்திணை நிலங்கள் வழியே ஓடும் விளையாட்டு; இடையிடையே செல்லப்பிராணியுடன் தமிழில் உரையாடல்.", en: "A runner game through the five tinai landscapes, with Tamil conversation with the pet in between." },
      { ta: "கணிதமும் அறிவியலும் — விடையை நேரடியாகத் தராமல், படிப்படியான குறிப்புகளால்.", en: "Maths and science through step-by-step hints — never the answer handed over." },
      { ta: "ஒவ்வொரு உரையாடலிலும், மாதிரி பேசும் முன்பே, குழந்தைப் பாதுகாப்புச் சோதனை.", en: "A child-safety check on every turn, before the model speaks." },
      { ta: "கைபேசியிலேயே இயங்கும் சிறிய தமிழ் மாதிரி.", en: "A small Tamil model that runs on the phone itself." },
    ],
    forWhom: { ta: "குழந்தைகளும் அவர்களின் பெற்றோரும்.", en: "Children, and their parents." },
    gate: {
      ta: "சட்ட ஆலோசகர் ஒப்புதலும், சரிபார்த்த பெற்றோர் ஒப்புதலும் இன்றி எந்தக் குழந்தையும் யாழைப் பயன்படுத்தாது.",
      en: "No child uses Yazh before counsel signs off and a parent's consent is verified.",
    },
    milestones: [
      { date: "2026-12-19", label: { ta: "யாழ் — 15–20 குடும்பங்கள்", en: "Yazh — 15–20 families" }, tier: { ta: "அழைப்பின் பேரில் முன்னோட்டம்", en: "Closed beta" } },
    ],
    // no open demo for a children's product before its gate passes
    demo: { ta: "முன்னோட்டம் காண்க", en: "See the preview", href: "/projects/yazh#preview" },
    repo: `${GH}/yazh-unity`,
    asks: [{ ta: "என் குடும்பம் முன்னோட்டத்தில் சேர (பெற்றோர் மட்டும்)", en: "My family for the closed beta (parents only)" }],
  },
  {
    slug: "open-sangam",
    tone: "marutham",
    flagship: true,
    name: { ta: "Open Sangam", en: "Open Sangam" },
    kind: { ta: "திறந்த இலக்கியத் தளம்", en: "Open literature platform" },
    what: {
      ta: "சங்க இலக்கியத்தை இன்றைய வாசகருக்கு அடுக்கடுக்காகத் திறக்கும் தளம் — மூலம், உரை, ஆங்கிலம், சொற்பொருள்.",
      en: "Sangam literature opened up for today's reader, layer by layer — the original, a modern prose rendering, English, and word meanings.",
    },
    why: {
      ta: "நம் மொழிக்கான செயற்கை நுண்ணறிவுக்குத் தரமான, சரிபார்த்த உரைத் தொகுப்பு வேண்டும். Open Sangam அதைத் திறந்த முறையில் கட்டுகிறது.",
      en: "AI for our language needs a high-quality, verified corpus. Open Sangam builds one in the open.",
    },
    does: [
      { ta: "ஒவ்வொரு பாடலையும் மூலம், இன்றைய உரைநடை, ஆங்கிலம் என மாற்றி மாற்றிப் படிக்கலாம்.", en: "Read every verse in the original, in modern prose, or in English." },
      { ta: "எந்தச் சொல்லைத் தொட்டாலும் அதன் வேர்ச்சொல்லும் இலக்கணமும்.", en: "Tap any word for its root and its grammar." },
      { ta: "ஐந்திணை நிலங்கள் வழியே சங்க உலகைச் சுற்றிப் பார்க்கலாம்.", en: "Explore the Sangam world through the five tinai landscapes." },
      { ta: "அறிஞர்கள் சரிபார்த்த திருத்தங்கள் மட்டுமே சேர்க்கப்படும்.", en: "Only scholar-reviewed corrections go in." },
    ],
    forWhom: { ta: "மாணவர்கள், ஆசிரியர்கள், தமிழ் வாசகர்கள் — கட்டணமில்லை.", en: "Students, teachers and readers of Tamil — free." },
    gate: {
      ta: "மதுரைக்காஞ்சியின் முதல் 100 அடிகளுக்கும் அறிஞர் ஒப்புதல் பெற்ற பின்பே பொது வெளியீடு.",
      en: "Public release only after scholars sign off all of Maduraikanchi's first 100 lines.",
    },
    milestones: [
      { date: "2026-11-14", label: { ta: "மதுரைக்காஞ்சி 1–100", en: "Maduraikanchi 1–100" }, tier: { ta: "பொது", en: "Public" } },
    ],
    demo: {
      ta: "தளத்தைத் திறக்க", en: "Open the site", href: "https://sangam.yazhi.dev", external: true,
      note: { ta: "முன்னோட்டம் · நவம்பர் 14 அன்று பொது வெளியீடு", en: "Preview · public release 14 November" },
    },
    repo: `${GH}/open-sangam`,
    asks: [{ ta: "பாடல்களைச் சரிபார்க்க உதவ (அறிஞர்கள்)", en: "Help verify verses (scholars)" }],
  },
  {
    slug: "dev-spaces",
    tone: "mullai",
    name: { ta: "Dev Spaces", en: "Yazhi Dev Spaces" },
    kind: { ta: "உருவாக்குநர் சமூகம்", en: "Developer community" },
    what: {
      ta: "இந்திய மொழித் தொழில்நுட்பத்தை உருவாக்க விரும்புவோர் சந்தித்து, கற்று, சேர்ந்து பணியாற்றும் இடம்.",
      en: "Where people who want to build Indian-language technology meet, learn and work together.",
    },
    why: {
      ta: "ஒவ்வொரு மொழிக்கும் தனி மாதிரி வேண்டுமென்றால், அதை உருவாக்க ஆயிரக்கணக்கான கைகள் வேண்டும்.",
      en: "If every language is to have its own model, it will take thousands of hands to build.",
    },
    does: [
      { ta: "நடத்தை விதிமுறையும் பங்களிப்பு வழிகாட்டியும்.", en: "A code of conduct and a contribution guide." },
      { ta: "யாழியின் திட்டங்களில் தொடக்கநிலைப் பணிகள்.", en: "Starter tasks across Yazhi's projects." },
      { ta: "yazhi-api அணுகல் — இப்போதைக்குக் கைமுறையாக வழங்கப்படுகிறது.", en: "yazhi-api access — provisioned by hand for now." },
    ],
    forWhom: { ta: "மாணவர்கள் முதல் அனுபவமிக்க பொறியாளர்கள் வரை.", en: "Everyone from students to seasoned engineers." },
    gate: {
      ta: "நடத்தை விதிமுறையும் பங்களிப்பு வழிகாட்டியும் வெளியான பின்பே திறப்பு.",
      en: "Opens only once the code of conduct and contribution guide are published.",
    },
    milestones: [
      { date: "2026-10-18", label: { ta: "Dev Spaces திறப்பு", en: "Dev Spaces opens" }, tier: { ta: "பொது", en: "Public" } },
    ],
    demo: {
      ta: "circle.yazhi.dev", en: "circle.yazhi.dev", href: "https://circle.yazhi.dev", external: true,
      note: { ta: "அக்டோபர் 18 முதல்", en: "From 18 October" },
    },
  },
  {
    slug: "avai",
    tone: "kurinji",
    name: { ta: "அவை", en: "Avai" },
    kind: { ta: "இலக்கிய முகவர்", en: "Literature agent" },
    what: {
      ta: "தமிழ் இலக்கியம், இலக்கணம், பொருள் பற்றிக் கேட்கலாம் — ஒவ்வொரு பதிலும் ஆதாரத்துடன்.",
      en: "Ask about Tamil literature, grammar and meaning — every answer with its source.",
    },
    why: {
      ta: "ஆதாரமின்றிப் பதில் சொல்லும் மாதிரிகள் நம் இலக்கியத்தைத் தவறாக மேற்கோள் காட்டுகின்றன.",
      en: "Models that answer without sources misquote our literature.",
    },
    does: [
      { ta: "புலவர் முகவர் பதில் தருகிறது; ஆதாரம் இல்லையெனில் «தெரியவில்லை» என்கிறது.", en: "The Pulavar agent answers — and says \"I don't know\" when it has no source." },
      { ta: "Open Sangam-இன் சரிபார்த்த பாடல்களிலிருந்து மேற்கோள்.", en: "Quotes from Open Sangam's verified verses." },
      { ta: "100 பதில்களைத் தமிழ் அறிஞர்கள் மதிப்பாய்வு செய்த பின்பே வெளியீடு.", en: "Released only after Tamil scholars review 100 of its answers." },
    ],
    forWhom: { ta: "மாணவர்கள், ஆசிரியர்கள், தமிழ் ஆர்வலர்கள்.", en: "Students, teachers and lovers of Tamil." },
    gate: { ta: "மேற்கோள் துல்லியம் 90% அல்லது அதற்கு மேல்.", en: "Citation accuracy of 90% or higher." },
    milestones: [
      { date: "2026-11-21", label: { ta: "அவை + புலவர்", en: "Avai + Pulavar" }, tier: { ta: "பொது முன்னோட்டம்", en: "Public beta" } },
    ],
    demo: { ta: "அவையுடன் உரையாடுக", en: "Talk to Avai", href: "/chat", note: { ta: "நவம்பர் 21 முதல்", en: "From 21 November" } },
  },
  {
    slug: "guru",
    tone: "mullai",
    name: { ta: "குரு", en: "Guru" },
    kind: { ta: "கல்வி நிறுவனங்களுக்கு", en: "For institutions" },
    what: {
      ta: "கல்வி நிறுவனங்களுக்கான துணை — நிறுவனத்தின் சொந்தக் கணினியிலேயே இயங்கும்.",
      en: "An assistant for educational institutions that runs on the institution's own machine.",
    },
    why: {
      ta: "மாணவர்களின் தரவு பள்ளியை விட்டு வெளியேறக் கூடாது. அதனால் மாதிரியே பள்ளிக்கு வர வேண்டும்.",
      en: "Students' data should not leave the school. So the model has to come to the school.",
    },
    does: [
      { ta: "கணிதம், அறிவியல், ஆங்கிலம் — தமிழ் வழியாக.", en: "Maths, science and English — through Tamil." },
      { ta: "விடையை நேரடியாகத் தராமல், படிப்படியான குறிப்புகள்.", en: "Step-by-step hints, never the answer handed over." },
      { ta: "இணையம் இல்லாமலும் நிறுவனத்தின் கணினியில் இயங்கும் வகையில் நிறுவப்படும்.", en: "Installed to run on the institution's machine, even offline." },
    ],
    forWhom: { ta: "பள்ளிகள், கல்லூரிகள், பயிற்சி நிறுவனங்கள்.", en: "Schools, colleges and training institutes." },
    gate: { ta: "நிறுவனத்தின் தரவு அதன் கணினியை விட்டு வெளியேறாது.", en: "Institute data never leaves its machine." },
    milestones: [
      { date: "2026-11-28", label: { ta: "குரு", en: "Guru" }, tier: { ta: "கட்டணச் சோதனை ஓட்டம்", en: "Paid pilot" } },
    ],
    asks: [{ ta: "என் நிறுவனத்தில் சோதனை ஓட்டம்", en: "A pilot at my institution" }],
  },
  {
    slug: "kural",
    tone: "palai",
    name: { ta: "குறள்", en: "Kural" },
    kind: { ta: "ஆதரவும் தகவல் தொழில்நுட்பமும்", en: "Support and IT" },
    what: {
      ta: "ஆதரவு, தகவல் தொழில்நுட்பக் குழுக்களுக்கான முகவர் — அறிவுத் தளம், சிக்கல் வகைப்படுத்தல், செயல்முறை ஏடுகள், மனிதரிடம் ஒப்படைப்பு.",
      en: "An agent for support and IT teams — knowledge base, triage, runbooks, and hand-off to a person.",
    },
    why: {
      ta: "தவறான ஒரு கட்டளை ஓர் அமைப்பையே நிறுத்திவிடும். முகவர் உதவலாம்; முடிவு மனிதருடையது.",
      en: "One wrong command can take a whole system down. An agent can help; the decision stays with a person.",
    },
    does: [
      { ta: "உங்கள் அறிவுத் தளத்திலிருந்து பதில்கள், தமிழிலும் ஆங்கிலத்திலும்.", en: "Answers from your own knowledge base, in Tamil and English." },
      { ta: "சிக்கல்களை வகைப்படுத்தி, சரியான குழுவிடம் சேர்க்கும்.", en: "Triages issues and routes them to the right team." },
      { ta: "செயல்முறை ஏட்டின் ஒவ்வொரு படிக்கும் மனித ஒப்புதல்.", en: "A person confirms every runbook step." },
    ],
    forWhom: { ta: "நிறுவனங்களின் ஆதரவு, IT குழுக்கள்.", en: "Support and IT teams in organisations." },
    gate: {
      ta: "செயல்முறை ஏடும் மனித ஒப்புதலும் இன்றி எந்த அமைப்பையும் மாற்றாது.",
      en: "Changes no system without a runbook and a person's confirmation.",
    },
    milestones: [
      { date: "2026-11-30", label: { ta: "குறள் — உள் பயன்பாடு", en: "Kural — internal" }, tier: { ta: "உள் பயன்பாடு", en: "Internal" } },
      { date: "2026-12-15", label: { ta: "குறள் — சோதனை ஓட்டம்", en: "Kural — pilot" }, tier: { ta: "கட்டணச் சோதனை ஓட்டம்", en: "Paid pilot" } },
    ],
    asks: [{ ta: "என் நிறுவனத்தில் சோதனை ஓட்டம்", en: "A pilot at my organisation" }],
  },
  {
    slug: "academy",
    tone: "kurinji",
    name: { ta: "யாழி பயிலகம்", en: "Yazhi Academy" },
    kind: { ta: "பயிற்சித் திட்டம்", en: "Training programme" },
    what: {
      ta: "செயற்கை நுண்ணறிவை நிறுவனங்களுக்குள் கொண்டு சென்று நிறுவும் பொறியாளர்களுக்கான பயிற்சி — இரண்டாம் அணி.",
      en: "Training for forward-deployed engineers — the people who take AI into organisations. Cohort 2.",
    },
    why: {
      ta: "மாதிரி மட்டும் போதாது; அதை ஒவ்வொரு ஊரிலும் நிறுவி இயக்கத் தெரிந்தவர்கள் வேண்டும்.",
      en: "A model is not enough; every town needs people who can install it and keep it running.",
    },
    does: [
      { ta: "யாழியின் உண்மையான திட்டங்களில் நேரடிப் பணி.", en: "Hands-on work on Yazhi's real projects." },
      { ta: "தரவை வெளியே அனுப்பாமல் நிறுவும் முறைகள்.", en: "Ways to deploy without sending data out." },
      { ta: "வெளிப்படையான தேர்வு அளவுகோல்.", en: "A published selection rubric." },
    ],
    forWhom: { ta: "பொறியியல் மாணவர்களும் இளம் பொறியாளர்களும்.", en: "Engineering students and early-career engineers." },
    gate: {
      ta: "திட்டப் பக்கமும் தேர்வு அளவுகோலும் வெளியான பின்பே விண்ணப்பங்கள்.",
      en: "Applications open only once the programme page and selection rubric are published.",
    },
    milestones: [
      { date: "2026-12-01", label: { ta: "பயிலகம் — அணி 2", en: "Academy — cohort 2" }, tier: { ta: "விண்ணப்பங்கள்", en: "Applications" } },
    ],
    asks: [{ ta: "விண்ணப்பிக்க ஆர்வம்", en: "Interested in applying" }],
  },
  {
    slug: "illakiya",
    tone: "neytal",
    name: { ta: "இலக்கியா", en: "Illakiya" },
    kind: { ta: "தமிழ் விசைப்பலகை", en: "Tamil keyboard" },
    what: {
      ta: "Android-க்கான தமிழ் விசைப்பலகை — தொல்காப்பிய ஒலி அமைப்பில் விசைகள்.",
      en: "A Tamil keyboard for Android, with keys grouped by sound as in Tolkappiyam.",
    },
    why: {
      ta: "தமிழில் எழுதுவது எளிதாக இருந்தால், தமிழில் எழுதுவோர் பெருகுவர்.",
      en: "Make writing in Tamil easy, and more people will write in Tamil.",
    },
    does: [
      { ta: "247 தமிழ் எழுத்துகளும்.", en: "All 247 Tamil letters." },
      { ta: "மேலே தேய்த்தால் நெடில் — குறில் → நெடில்.", en: "Swipe up for the long vowel." },
      { ta: "தொல்காப்பியப் புணர்ச்சி விதிகளுடன் சொல் பரிந்துரை.", en: "Word suggestions that follow Tolkappiyam's sandhi rules." },
      { ta: "இணைய அனுமதியே இல்லை — நீங்கள் தட்டச்சு செய்வது கைபேசியை விட்டு வெளியேறாது.", en: "No internet permission at all — what you type never leaves the phone." },
    ],
    forWhom: { ta: "தமிழில் எழுதும் அனைவரும்.", en: "Everyone who writes in Tamil." },
    gate: { ta: "இணைய அனுமதி இல்லாமலே வெளியீடு.", en: "Ships without the internet permission." },
    milestones: [
      { date: "2026-12-05", label: { ta: "இலக்கியா", en: "Illakiya" }, tier: { ta: "Play Store முன்னோட்டம்", en: "Play Store beta" } },
    ],
    demo: { ta: "GitHub-இல் காண்க", en: "See it on GitHub", href: `${GH}/illakiya`, external: true },
    repo: `${GH}/illakiya`,
  },
  {
    slug: "nyaya",
    tone: "marutham",
    name: { ta: "நியாயா", en: "Nyaya" },
    kind: { ta: "சட்டத் தகவல்", en: "Legal information" },
    what: {
      ta: "இந்தியச் சட்டங்கள் பற்றிய தகவல், தமிழில் — India Code மேற்கோள்களுடன்.",
      en: "Information on Indian law, in Tamil — with India Code citations.",
    },
    why: {
      ta: "சட்டம் எல்லோருக்குமானது; அதைப் புரிந்துகொள்ள ஆங்கிலம் தடையாக இருக்கக் கூடாது.",
      en: "The law is for everyone; English should not stand between people and understanding it.",
    },
    does: [
      { ta: "தகவல் மட்டுமே — சட்ட ஆலோசனை அல்ல.", en: "Information only — never legal advice." },
      { ta: "ஒவ்வொரு பதிலுக்கும் India Code மேற்கோள்.", en: "An India Code citation for every answer." },
      { ta: "தேவைப்படும்போது இலவச சட்ட உதவி மையங்களுக்கு வழிகாட்டும்.", en: "Points you to free legal aid when you need it." },
    ],
    forWhom: { ta: "குடிமக்கள், சட்ட மாணவர்கள், சட்ட உதவி அமைப்புகள்.", en: "Citizens, law students and legal-aid organisations." },
    gate: {
      ta: "மேற்கோள் சரித்தன்மை 95% அல்லது அதற்கு மேல்; வழக்கறிஞர் ஒப்புதல்.",
      en: "Citation validity of 95% or higher, and a lawyer's sign-off.",
    },
    milestones: [
      { date: "2026-12-12", label: { ta: "நியாயா", en: "Nyaya" }, tier: { ta: "அழைப்பின் பேரில் முன்னோட்டம்", en: "Closed beta" } },
    ],
    asks: [{ ta: "சட்ட உதவி அமைப்பாகக் கூட்டுச் சேர", en: "Partner as a legal-aid organisation" }],
  },
];

/** Reasons to enquire that every project offers. */
export const COMMON_ASKS: BiText[] = [
  { ta: "பங்களிக்க", en: "Contribute" },
  { ta: "கூட்டாண்மை", en: "Partnership" },
  { ta: "ஊடகம்", en: "Press" },
  { ta: "மற்றவை", en: "Something else" },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function asksFor(p: Project): BiText[] {
  return [...(p.asks ?? []), ...COMMON_ASKS];
}

export type RoadmapNode = Milestone & { slug: string; tone: Tone; index: number };

/** Every milestone of the year on one line, in date order. */
export const ROADMAP: RoadmapNode[] = PROJECTS.flatMap((p) =>
  p.milestones.map((m) => ({ ...m, slug: p.slug, tone: p.tone, index: 0 })),
)
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((n, index) => ({ ...n, index }));

/** Projects ordered by their first launch date. */
export const PROJECTS_BY_DATE: Project[] = [...PROJECTS].sort((a, b) =>
  a.milestones[0].date.localeCompare(b.milestones[0].date),
);

const MONTH_TA = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];
const MONTH_TA_SHORT = ["ஜன.", "பிப்.", "மார்ச்", "ஏப்.", "மே", "ஜூன்", "ஜூலை", "ஆக.", "செப்.", "அக்.", "நவ.", "டிச."];
const MONTH_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-18" → { ta: "அக்டோபர் 18", en: "18 October" }; short → "அக். 18" / "18 Oct". */
export function formatDate(iso: string, short = false): BiText {
  const [, m, d] = iso.split("-").map(Number);
  const ta = MONTH_TA[m - 1];
  const en = MONTH_EN[m - 1];
  return short
    ? { ta: `${MONTH_TA_SHORT[m - 1]} ${d}`, en: `${d} ${en.slice(0, 3)}` }
    : { ta: `${ta} ${d}`, en: `${d} ${en}` };
}

export const MONTHS = { ta: MONTH_TA, en: MONTH_EN };
