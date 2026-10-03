/* ============================================================
   ALL FRONT-PAGE COPY — single source of truth.

   Reviewed against the Yazhi Aram harness (Oct 2026):
   - every claim is either sourced or stated as a plan with its date and
     launch gate (Aram 1 · 5) — dates are the 2026 launch line, which
     lives in Linear; update LAUNCH_LINE when it moves
   - Tamil is written natively (not translated sentence by sentence),
     one register (written/standard; button CTAs in the -க form), with
     sandhi doubling checked, and "sovereign" = தற்சார்பு
   - TAMIL IS A DRAFT until a native-speaker review signs it off
     (Valavan's editorial gate). Glossary used throughout:
       AI செயற்கை நுண்ணறிவு · model மாதிரி · agent முகவர் ·
       corpus உரைத் தொகுப்பு · tokenizer டோக்கனைசர் · beta முன்னோட்டம் ·
       closed beta அழைப்பின் பேரில் முன்னோட்டம் · pilot சோதனை ஓட்டம் ·
       source ஆதாரம் · families குடும்பங்கள் · developers உருவாக்குநர்கள்
   - Latin brand/product names take Tamil case endings with a hyphen:
     WhatsApp-இல், GitHub-இல்.
   ============================================================ */

export type ThinaiKey = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";

/** The five thinai, in page order. Each governs one section (`section`
    is its DOM id) following the harness's tinai content system:
    kurinji — launches; palai — hard engineering (Adhan); neytal —
    diaspora, Yazh, language loss; marutham — the harvest of the corpus;
    mullai — community. `poetic` is the classical uripporul. */
export const THINAI: {
  key: ThinaiKey;
  icon: string;
  ta: string;
  en: string;
  landscape: string;
  poetic: string;
  section: string;
}[] = [
  { key: "kurinji", icon: "🏔️", ta: "குறிஞ்சி", en: "Kurinji", landscape: "Mountains", poetic: "Union", section: "yazhi" },
  { key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", landscape: "Drylands", poetic: "Separation", section: "adhan" },
  { key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", landscape: "Coast", poetic: "Lament", section: "guardian" },
  { key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", landscape: "Farmland", poetic: "Lovers' quarrel", section: "sangam" },
  { key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", landscape: "Forest", poetic: "Patient waiting", section: "community" },
];

/** Section-heading eyebrows: thinai · landscape · uripporul. */
export const THINAI_HEADINGS: Record<ThinaiKey, { ta: string; landscapeTa: string; en: string; landscapeEn: string }> = {
  kurinji: { ta: "குறிஞ்சி", landscapeTa: "மலை · புணர்தல்", en: "Kurinji", landscapeEn: "Mountains · new beginnings" },
  palai: { ta: "பாலை", landscapeTa: "சுரம் · பிரிதல்", en: "Palai", landscapeEn: "Drylands · hardship, transformation" },
  neytal: { ta: "நெய்தல்", landscapeTa: "கடல் · இரங்கல்", en: "Neytal", landscapeEn: "Coast · separation, resilience" },
  marutham: { ta: "மருதம்", landscapeTa: "வயல் · ஊடல்", en: "Marutham", landscapeEn: "Farmland · quarrel, reconciliation" },
  mullai: { ta: "முல்லை", landscapeTa: "காடு · இருத்தல்", en: "Mullai", landscapeEn: "Forest · patience, loyalty" },
};

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  positioning: "Sovereign AI for Indian languages",
  taglineTa: "இந்திய மொழிகளுக்கான தற்சார்புச் செயற்கை நுண்ணறிவு",
  taglineEn: "Sovereign AI for Indian languages",
  secondaryTa: "அகமும் புறமும்",
  secondaryEn: "Akam and Puram",
  footerTa: "தற்சார்புச் செயற்கை நுண்ணறிவு",
  footerEn: "Sovereign Artificial Intelligence",
  // the plain-language layer: one sentence a ten-year-old can read
  plainTa: "கணினிக்குத் தமிழைக் கற்றுத் தருகிறோம்; அடுத்து மற்ற இந்திய மொழிகளையும்.",
  plainEn: "We're teaching computers Tamil — and next, the other Indian languages.",
  // what Yazhi is doing now — a plan in progress, not a finished claim
  heroLineTa: "தமிழில் தொடங்கி, எங்கள் சொந்த உரைத் தொகுப்பிலும் சொந்த மாதிரியிலும் முகவர்களை உருவாக்குகிறோம் — எல்லாம் வெளிப்படையாக.",
  heroLineEn: "Starting with Tamil, we're building agents on our own corpus and our own model — in the open.",
  copyright: "© 2026 யாழி • Yazhi",
};

/** The Yazhi section: the collective and the rule its agents keep. */
export const YAZHI_SECTION = {
  subTa: "ஆதாரம் இல்லையேல், “தெரியவில்லை”",
  subEn: "No source? Then “I don't know.”",
  bodyTa:
    "யாழி ஒரு கூட்டு முயற்சி. இந்திய மொழிகளுக்குத் தற்சார்புச் செயற்கை நுண்ணறிவை உருவாக்குகிறோம் — தமிழிலிருந்து தொடங்கி. அவை, குரு, சேவை, நியாயா, குறள் — ஒவ்வொரு முகவரையும் yazhi-api வழியாக, எங்கள் சொந்த மாதிரியான ஆதன் மேல் இயங்கும்படி வடிவமைக்கிறோம். ஒவ்வொரு பதிலும் நாங்கள் வளைக்காத ஐந்து விதிகளுக்குள் இருக்க வேண்டும். முதல் விதி: ஆதாரம் இல்லாமல் எதையும் சொல்வதில்லை.",
  bodyEn:
    "Yazhi is a collective building sovereign AI for Indian languages, starting with Tamil. Avai, Guru, Sevai, Nyaya, Kural — we're designing every agent to run through yazhi-api on Adhan, our own model. Every answer has to stay inside five rules we don't bend. The first: say nothing without a source.",
  plainTa: "யாழியிடம் கேட்டால், பதிலோடு அது எங்கிருந்து வந்தது என்பதையும் சொல்லும். தெரியாவிட்டால் “தெரியவில்லை” என்றே சொல்லும்.",
  plainEn: "Ask Yazhi something and it tells you where the answer came from. If it doesn't know, it says so.",
};

/** A sample conversation with Avai, labelled as a sample. It shows the
    first rule at work: a sourced answer, then an honest "I don't know".
    The Keezhadi facts are from the Tamil Nadu State Department of
    Archaeology's 2019 report on the site. */
export const YAZHI_DEMO = {
  agentTa: "அவை",
  agentEn: "Avai",
  labelTa: "மாதிரி உரையாடல்",
  labelEn: "Sample conversation",
  messages: [
    { from: "user", textTa: "கீழடியில் என்ன கிடைத்தது?", textEn: "What was found at Keezhadi?" },
    {
      from: "agent",
      textTa: "தமிழ்-பிராமி எழுத்துகள் பொறித்த பானை ஓடுகள் கிடைத்துள்ளன.",
      textEn: "Potsherds inscribed in Tamil-Brahmi have been found there.",
      sourceTa: "ஆதாரம்: தமிழ்நாடு தொல்லியல் துறை, கீழடி அகழாய்வு அறிக்கை (2019)",
      sourceEn: "Source: Tamil Nadu State Dept. of Archaeology, Keeladi excavation report (2019)",
      tool: "site_lookup",
    },
    { from: "user", textTa: "அவற்றை எழுதியவர் யார்?", textEn: "Who wrote them?" },
    {
      from: "agent",
      textTa: "தெரியவில்லை. எழுதியவர் யார் என்று சொல்லும் பதிவு எதுவும் என்னிடம் இல்லை.",
      textEn: "I don't know. I have no record that says who wrote them.",
      tool: "artifact_search",
    },
  ] as {
    from: "user" | "agent";
    textTa: string;
    textEn: string;
    sourceTa?: string;
    sourceEn?: string;
    tool?: string;
  }[],
};

/** The 2026 launch line, from the Aram harness (§5; source of truth is
    Linear). Each ships only when its gate passes — shown with the date
    so nothing reads as done before it is. */
export const LAUNCH_LINE = {
  titleTa: "எது, எப்போது வெளிவரும்",
  titleEn: "What ships, and when",
  noteTa: "திட்டமிட்ட தேதிகள். ஒவ்வொன்றும் அதன் நிபந்தனை நிறைவேறிய பின்னரே வெளிவரும்.",
  noteEn: "Planned dates. Each ships only once its gate is met.",
  items: [
    { dateTa: "அக்டோபர் 18", dateEn: "18 Oct", nameTa: "யாழி Dev Spaces", nameEn: "Yazhi Dev Spaces", tierTa: "பொது", tierEn: "Public", gateTa: "நடத்தை நெறிமுறை, பங்களிப்பு வழிகாட்டி", gateEn: "Code of conduct, contribution guide" },
    { dateTa: "அக்டோபர் 31", dateEn: "31 Oct", nameTa: "ஆதன் டோக்கனைசர் அளவீடு", nameEn: "Adhan tokenizer benchmark", tierTa: "பொது", tierEn: "Public", gateTa: "ஒரே ஸ்கிரிப்டில் மீண்டும் செய்து பார்க்கலாம்", gateEn: "Reproducible from one script" },
    { dateTa: "நவம்பர் 14", dateEn: "14 Nov", nameTa: "Open Sangam · மதுரைக் காஞ்சி 1–100", nameEn: "Open Sangam · Maduraikkanci 1–100", tierTa: "பொது", tierEn: "Public", gateTa: "100 அடிகளுக்கும் அறிஞர் ஒப்புதல்", gateEn: "Scholar sign-off on all 100 lines" },
    { dateTa: "நவம்பர் 21", dateEn: "21 Nov", nameTa: "அவை + புலவர்", nameEn: "Avai + Pulavar", tierTa: "பொது முன்னோட்டம்", tierEn: "Public beta", gateTa: "மேற்கோள் துல்லியம் ≥90%; 100 பதில்களுக்குத் தாய்மொழியாளர் மதிப்பாய்வு", gateEn: "Citation accuracy ≥90%; native review of 100 answers" },
    { dateTa: "நவம்பர் 28", dateEn: "28 Nov", nameTa: "குரு", nameEn: "Guru", tierTa: "கட்டணச் சோதனை ஓட்டம்", tierEn: "Paid pilot", gateTa: "நிறுவனத்தின் தரவு அதன் கணினியை விட்டு வெளியேறாது", gateEn: "Institute data never leaves its machine" },
    { dateTa: "நவம்பர் 30 / டிசம்பர் 15", dateEn: "30 Nov / 15 Dec", nameTa: "குறள்", nameEn: "Kural", tierTa: "உள் பயன்பாடு → கட்டணச் சோதனை ஓட்டம்", tierEn: "Internal → paid pilot", gateTa: "இயக்கக் கையேடும் மனித ஒப்புதலும்", gateEn: "Runbook policy; human confirm" },
    { dateTa: "டிசம்பர் 1", dateEn: "1 Dec", nameTa: "Yazhi Academy · FDE இரண்டாம் அணி", nameEn: "Yazhi Academy · FDE cohort 2", tierTa: "விண்ணப்பங்கள்", tierEn: "Applications", gateTa: "திட்டப் பக்கம், தேர்வு அளவுகோல்", gateEn: "Programme page, selection rubric" },
    { dateTa: "டிசம்பர் 5", dateEn: "5 Dec", nameTa: "இலக்கியா விசைப்பலகை", nameEn: "Illakiya keyboard", tierTa: "Play முன்னோட்டம்", tierEn: "Play beta", gateTa: "இணைய அனுமதி இல்லை", gateEn: "No INTERNET permission" },
    { dateTa: "டிசம்பர் 12", dateEn: "12 Dec", nameTa: "நியாயா", nameEn: "Nyaya", tierTa: "அழைப்பின் பேரில் முன்னோட்டம்", tierEn: "Closed beta", gateTa: "மேற்கோள் செல்லுபடி ≥95%; வழக்கறிஞர் ஒப்புதல்", gateEn: "Citation validity ≥95%; lawyer sign-off" },
    { dateTa: "டிசம்பர் 19", dateEn: "19 Dec", nameTa: "யாழ் · கற்றல் செல்லப்பிராணி", nameEn: "Yazh · learning pet", tierTa: "அழைப்பின் பேரில், 15–20 குடும்பங்கள்", tierEn: "Closed beta, 15–20 families", gateTa: "சட்ட ஆலோசகர் ஒப்புதல்; பெற்றோர் ஒப்புதல்; குழந்தைப் பாதுகாப்புச் சோதனை ≥98%", gateEn: "Counsel sign-off; parental consent; kid red-team ≥98%" },
    { dateTa: "டிசம்பர் 26", dateEn: "26 Dec", nameTa: "ஆதன் குட்டி v1", nameEn: "Adhan Kutty v1", tierTa: "பொது", tierEn: "Public", gateTa: "அடிப்படை மாதிரி உரிமத் தெளிவு; மதிப்பீட்டுத் தேர்வுகளில் தேர்ச்சி", gateEn: "Base-model licence cleared; eval gates pass" },
  ],
};

/** Adhan — the engine underneath. Palai governs it: the hard engineering. */
export const ADHAN = {
  // ஆதன் — not அதன் ("its"): the name is ā-than, with a long ā
  nameTa: "ஆதன்",
  nameEn: "Adhan",
  eyebrowTa: "உள்ளே இயங்கும் பொறி",
  eyebrowEn: "The engine underneath",
  subTa: "யாழியின் சொந்த மொழி மாதிரி",
  subEn: "Yazhi's own language model",
  bodyTa:
    "ஆதன் யாழியின் சொந்த மொழி மாதிரி. பல பணிகளுக்கான ஒரே LoRA-வை Qwen3 4B அடிப்படை மாதிரியின் மேல் பயிற்றுவிக்கிறோம்; யாழியின் எல்லா முகவர்களும் இதன் மேல் இயங்கும்படி வடிவமைக்கிறோம். ஒவ்வொரு இந்திய மொழிக்கும் ஒரு சொல்லுக்கு எத்தனை டோக்கன்கள் தேவைப்படுகின்றன என்பதை அளக்கும் டோக்கனைசர் அளவீட்டை அக்டோபர் 31 அன்று வெளியிடுகிறோம் — ஒரே ஸ்கிரிப்டில் யார் வேண்டுமானாலும் மீண்டும் செய்து பார்க்கலாம். அடிப்படை மாதிரியின் உரிமம் தெளிவானதும் மதிப்பீட்டுத் தேர்வுகளில் தேறியதும், ஆதன் குட்டி v1 டிசம்பர் 26 அன்று வெளிவரும்.",
  bodyEn:
    "Adhan is Yazhi's own language model: one multi-task LoRA we're training on a Qwen3 4B base, built so that every Yazhi agent can run on it. On 31 October we publish the tokenizer benchmark — how many tokens each Indian language pays per word, reproducible from one script. Adhan Kutty v1 follows on 26 December, once the base-model licence is cleared and the eval gates pass.",
  tokenTax: {
    labelTa: "இந்திய மொழிகள் செலுத்தும் டோக்கன் வரி — ஒரே வாக்கியம், ஒரு சொல்லுக்கான டோக்கன்கள்",
    labelEn: "The token tax on Indian languages — tokens spent per word, same sentence",
    // ratios to verify against the paper before the 31 Oct benchmark ships
    rows: [
      { lang: "English", langTa: "ஆங்கிலம்", multiplier: "1.0×" },
      { lang: "Hindi", langTa: "இந்தி", multiplier: "2.5×" },
      { lang: "Telugu", langTa: "தெலுங்கு", multiplier: "4.0×" },
      { lang: "Tamil", langTa: "தமிழ்", multiplier: "4.5×" },
    ],
    sourceEn: "Petrov et al., NeurIPS 2023",
  },
  ctaTa: "GitHub-இல் காண்க →",
  ctaHref: "https://github.com/yazhi-lem/adhan",
  plainTa: "யாழியின் முகவர்கள் சிந்திக்கப் பயன்படும் மூளை இது. இன்னும் கற்றுக்கொண்டே இருக்கிறது.",
  plainEn: "The brain Yazhi's agents think with. It's still learning.",
};

/** Tamil first, not Tamil only. */
export const LANGUAGE_ROADMAP = {
  titleTa: "தமிழ் முதலில், தமிழ் மட்டுமல்ல",
  titleEn: "Tamil first, not Tamil only",
  steps: [
    {
      stageTa: "இப்போது", stageEn: "Now", langTa: "தமிழ்", langEn: "Tamil",
      bodyTa: "எங்கள் தாய்மொழி; மிகக் கடினமான சோதனையும் இதுவே. உரைத் தொகுப்பு, டோக்கனைசர் அளவீடு, குரல், முதல் குடும்பங்கள் — எல்லாம் இங்கேதான் தொடங்குகின்றன.",
      bodyEn: "Our home language and hardest test case. Corpus, tokenizer benchmark, voice and the first families all start here.",
    },
    {
      stageTa: "அடுத்து", stageEn: "Next", langTa: "தெலுங்கு", langEn: "Telugu",
      bodyTa: "தமிழைப் போலவே ஒட்டுநிலை மொழி; அதே டோக்கன் வரிச் சிக்கல். இயல்பான இரண்டாவது மொழி.",
      bodyEn: "Agglutinative like Tamil, with the same token-tax problem — the natural second language.",
    },
    {
      stageTa: "பிறகு", stageEn: "Then", langTa: "கன்னடம், மலையாளம்", langEn: "Kannada, Malayalam",
      bodyTa: "திராவிட மொழிக் குடும்பத்தின் மற்ற மொழிகள். உருபனியல் ஒத்திருப்பதால், ஒன்றில் கிடைக்கும் முன்னேற்றம் மற்றவற்றுக்கும் பயன்படும்.",
      bodyEn: "The rest of the Dravidian family — shared morphology means a gain in one carries to the others.",
    },
    {
      stageTa: "இலக்கு", stageEn: "Goal", langTa: "22 மொழிகள்", langEn: "22 languages",
      bodyTa: "அரசியலமைப்பின் எட்டாம் அட்டவணையிலுள்ள 22 மொழிகளுக்கும் ஒரே மாதிரி, ஒரே API.",
      bodyEn: "One model and one API for all 22 languages in the Eighth Schedule of the Constitution.",
    },
  ],
  footTa:
    "தமிழும் தெலுங்கும் ஒரே திராவிட இலக்கண அடித்தளத்தையும் ஒரே டோக்கன் வரிச் சிக்கலையும் பகிர்ந்துகொள்கின்றன. தமிழைச் சரியாகச் செய்வது தெலுங்குக்குப் போகும் வழியில் ஒரு சுற்றுவழி அல்ல — அதுவே பெரும்பகுதி வேலை.",
  footEn:
    "Tamil and Telugu share a Dravidian grammar backbone and the same token-tax problem. Solving Tamil properly is not a detour on the way to Telugu — it is most of the work.",
};

/** The five thinai as Yazhi's content system (harness §2). */
export const THINAI_WORLD = {
  eyebrowTa: "யாழியின் உலகம் · திணை",
  eyebrowEn: "Yazhi's world · Thinai",
  titleTa: "ஐந்து நிலம், ஐந்து உரிப்பொருள்",
  titleEn: "Five landscapes, five moods",
  landscapes: [
    { key: "kurinji", ta: "குறிஞ்சி", en: "Kurinji", moodTa: "மலை · புணர்தல்", moodEn: "Mountains · longing, new beginnings", bodyTa: "தொடக்கங்களும் முதல் வெளியீடுகளும்.", bodyEn: "Launches and first releases." },
    { key: "mullai", ta: "முல்லை", en: "Mullai", moodTa: "காடு · இருத்தல்", moodEn: "Forest · patience, loyalty", bodyTa: "மன்றம், Dev Spaces, Yazhi Academy.", bodyEn: "Community, Dev Spaces and the Academy." },
    { key: "marutham", ta: "மருதம்", en: "Marutham", moodTa: "வயல் · ஊடல்", moodEn: "Farmland · conflict, reconciliation", bodyTa: "குடிமை, சட்டப் பணிகள் — நியாயா, சேவை.", bodyEn: "Civic and legal work — Nyaya, Sevai." },
    { key: "neytal", ta: "நெய்தல்", en: "Neytal", moodTa: "கடல் · இரங்கல்", moodEn: "Coast · separation, resilience", bodyTa: "புலம்பெயர்ந்த தமிழர், யாழ், மொழி இழப்பு.", bodyEn: "The diaspora, Yazh, and language loss." },
    { key: "palai", ta: "பாலை", en: "Palai", moodTa: "சுரம் · பிரிதல்", moodEn: "Drylands · hardship, transformation", bodyTa: "பாதுகாப்பு, உள்கட்டமைப்பு, கடினமான பொறியியல்.", bodyEn: "Security, infrastructure and the hard engineering." },
  ],
  footTa:
    "சங்க இலக்கியம் உலகை இந்த ஐந்து திணைகளாகப் பகுக்கிறது. யாழி உருவாக்கும் ஒவ்வொன்றின் உணர்வையும் அதே ஐந்து திணைகளே தீர்மானிக்கின்றன — இது மேலே பூசிய அலங்காரம் அல்ல, வேரிலேயே தமிழ்.",
  footEn:
    "Sangam poetry sorts the world into these five tinai. Yazhi uses the same five to set the mood of everything it makes — the structure is Tamil at its root, not ornament laid on top.",
};

/** Yazh — the learning pet for families. Neytal governs it. Aram rule 4:
    no child uses Yazh before counsel sign-off and verified parental
    consent, and the copy says so. */
export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh",
  eyebrowTa: "குடும்பங்களுக்காக",
  eyebrowEn: "For families",
  subTa: "4–8 வயதுக் குழந்தைகளுக்கான கற்றல் செல்லப்பிராணி — WhatsApp-இல், குரல் வழியே",
  subEn: "A learning pet for children aged 4–8 — by voice, on WhatsApp",
  bodyTa:
    "திராவிடத் தென்னகத்தின் கோவில் தூண்களில் செதுக்கப்பட்ட காவல் உயிரான யாளியிலிருந்து பிறந்தது யாழ் — வாசலில் நின்று உள்ளே இருப்பதைக் காக்கும் உயிர். நான்கு வயதுக் குழந்தையும் பேசும் அளவுக்கு அதைச் சிறியதாக வரைந்தோம். குழந்தையின் தாய்மொழியில் கேட்டு, அதே மொழியில் பதில் சொல்லும்; படிக்கவோ தட்டச்சு செய்யவோ தேவையில்லை. குடும்பத்திடம் ஏற்கெனவே உள்ள கைப்பேசியிலேயே பேசலாம் — தனிச் செயலி வேண்டாம். நாட்டுப்புறக் கதைகளோடு கணக்கு, அறிவியல், ஆங்கிலம் — எல்லாம் உரையாடல் வழியே.",
  bodyEn:
    "Yazh takes after the yāḷi, the guardian carved on temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. We drew it small enough for a four-year-old to talk to. Yazh listens in the child's mother tongue and answers in it; nobody has to read or type. It works on the phone a family already owns — no app to install. Folk stories, plus maths, science and English, all through conversation.",
  ctaTa: "ஆர்வத்தைப் பதிவு செய்க",
  ctaEn: "Register your interest",
  ctaHref: "/onboarding",
  whatsappCtaTa: "WhatsApp குழுவில் சேருக",
  whatsappCtaEn: "Join the WhatsApp group",
  whatsappNoteTa:
    "டிசம்பர் 19 முதல் 15–20 குடும்பங்களுடன் அழைப்பின் பேரில் முன்னோட்டம். சட்ட ஆலோசகரின் ஒப்புதலும் பெற்றோரின் சரிபார்க்கப்பட்ட ஒப்புதலும் கிடைத்த பின்னரே எந்தக் குழந்தையும் யாழுடன் பேசும்.",
  whatsappNoteEn:
    "Closed beta from 19 December with 15–20 families. No child talks to Yazh until legal counsel has signed off and a parent's consent is verified.",
  plainTa: "படிக்கத் தெரியாத சிறு குழந்தைகளும் தங்கள் தாய்மொழியில் பேசிக் கற்கலாம்.",
  plainEn: "Even children who can't read yet can learn by talking, in their own language.",
};

/** Open Sangam — the memory we protect. Marutham governs it. */
export const SANGAM = {
  nameTa: "சங்கம்",
  nameEn: "Open Sangam",
  eyebrowTa: "நாம் காக்கும் நினைவு",
  eyebrowEn: "The memory we protect",
  subTa: "செம்மொழி இலக்கியத்திற்கான திறந்த தளம்",
  subEn: "An open platform for classical literature",
  bodyTa:
    "செம்மொழி இலக்கியத்திற்கான திறந்த தளம்: சங்கப் பாடல்களும் அவற்றுக்கு அப்பாலும் — பாடல் ஆய்வு, திணை வகைப்பாடு, மொழி ஆய்வு. மாணவர்களுக்கும் ஆசிரியர்களுக்கும் அறிஞர்களுக்கும் கட்டணமில்லை. உண்மையான தமிழ் எப்படி இருக்கும் என்று ஆதனுக்குக் கற்றுத் தரும் உரைத் தொகுப்பும் இதுவே. ஒவ்வொரு அடிக்கும் அறிஞர் ஒப்புதல் பெற்ற பின், மதுரைக் காஞ்சியின் 1–100 அடிகளை நவம்பர் 14 அன்று வெளியிடுகிறோம்.",
  bodyEn:
    "An open platform for classical literature — Sangam poetry and beyond, with poem analysis, landscape classification and linguistic study. Free for students, teachers and scholars. It is also the corpus that teaches Adhan what real Tamil looks like. Maduraikkanci, lines 1–100, opens on 14 November, once a scholar has signed off every line.",
  pillars: [
    { icon: "📜", ta: "செய்யுள் ஆய்வு", en: "Poem analysis" },
    { icon: "🏞️", ta: "திணை வகைப்பாடு", en: "Landscape classification" },
    { icon: "📖", ta: "மொழி ஆய்வு", en: "Linguistic study" },
  ],
  ctaTa: "மேலும் அறிக →",
  ctaEn: "Learn more",
  ctaHref: "https://sangam.yazhi.dev",
  plainTa: "சங்கப் பாடல்களைப் படித்து, ஒவ்வொன்றும் எந்தத் திணையைச் சேர்ந்தது என்று சொல்லும் கருவி — மாணவர்களுக்கும் ஆசிரியர்களுக்கும் கட்டணமில்லை.",
  plainEn: "A tool that reads Sangam poems and tells you which of the five landscapes each belongs to — free for students and teachers.",
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
  translationEn:
    "The sea holds a surging, wave-tossed expanse. Within the world it bounds, mountains rise with high peaks hung with honeycombs. Across the vast sky the wind circles with force, and the stars — vaster than anything else — travel each in its own path. Both the sun that lights the day and the moon that lights the night appear without fail and shine. The rain has fallen and the land has grown rich: sow one seed and it yields a thousand, and both the sown earth and the unsown trees bear good fruit. Because nature helps in this way, no suffering is to be seen even in people's minds — no one does harm.",
  sourceEn: "Opening passage · open-sangam corpus",
};

export const SERVICES = [
  { ta: "முகவர்கள்", en: "Agents" },
  { ta: "செயலிகள்", en: "Applications" },
  { ta: "தரவுக் குறிப்புகள்", en: "Annotations" },
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
      { ta: "ஆதன்", en: "Adhan", href: "#adhan" },
      { ta: "சங்கம்", en: "Open Sangam", href: "#sangam" },
      { ta: "திணை", en: "Thinai", href: "#thinai" },
    ],
  },
  {
    ta: "சேவைகள்", en: "Services",
    items: [
      { ta: "முகவர்கள்", en: "Agents", href: "#services" },
      { ta: "செயலிகள்", en: "Applications", href: "#services" },
      { ta: "தரவுக் குறிப்புகள்", en: "Annotations", href: "#services" },
    ],
  },
  {
    ta: "மன்றம்", en: "Community",
    items: [
      { ta: "எங்களுடன் சேருக", en: "Join us", href: "/onboarding" },
      { ta: "Discord", en: "Discord", href: LINKS.discord },
      { ta: "GitHub", en: "GitHub", href: LINKS.github },
      { ta: "எங்களைப் பற்றி", en: "About", href: "/about" },
      { ta: "தனியுரிமை", en: "Privacy", href: "/privacy" },
    ],
  },
];

/* ---- short chrome labels ---- */
export const UI = {
  heroEyebrow: { ta: "குறிஞ்சி · முதல் வெளியீடுகள் — அக்டோபர் 2026", en: "Kurinji · first releases — October 2026" },
  comingSoon: { ta: "விரைவில்", en: "Coming soon" },
  servicesLabel: { ta: "சேவைகள்", en: "Services" },
  scrollCue: { ta: "கீழே உருட்டி ஆராய்க", en: "scroll to explore" },
  chat: { ta: "உரையாடல்", en: "Chat" },
  adhanCtaEn: "View Adhan on GitHub →",
};

/** Community — Mullai governs it: patience, loyalty, building together. */
export const COMMUNITY = {
  titleTa: "மன்றம்", titleEn: "Community",
  subTa: "சேர்ந்து உருவாக்குவோம்", subEn: "Build it together",
  plainTa: "யாழி ஒரு கூட்டு முயற்சி. தமிழையும் கணினியையும் நேசிப்பவர்கள் சேர்ந்து உருவாக்குகிறோம் — நீங்களும் வரலாம்.",
  plainEn: "Yazhi is a collective — people who love Tamil and computers, building this together. You're welcome to join.",
  chatAgeTa: "WhatsApp, Discord உரையாடல்கள் 13 வயது நிரம்பியவர்களுக்கு மட்டும் — சிறுவர்கள் பெற்றோருடன் சேருக.",
  chatAgeEn: "WhatsApp and Discord are for ages 13 and up — kids, join with a parent.",
  cards: [
    { ta: "எங்களுடன் சேருக", en: "Join us", bodyTa: "பங்களிப்பாளர்கள், தரவுக் குறியீட்டாளர்கள், உருவாக்குநர்கள் — எல்லோருக்கும் இதுவே நுழைவாயில்.", bodyEn: "The way in for contributors, annotators and builders.", href: "/onboarding", label: "/onboarding →", external: false },
    { ta: "Discord", en: "Discord", bodyTa: "அன்றாட உரையாடல் — தமிழ்ச் செயற்கை நுண்ணறிவு உருவாக்குநர்கள், ஆய்வாளர்கள், எழுத்தாளர்கள்.", bodyEn: "The daily conversation — Tamil AI builders, researchers, and writers.", href: "https://discord.gg/yazhi", label: "discord.gg/yazhi →", external: true },
    { ta: "GitHub", en: "GitHub", bodyTa: "திறந்த பணி — மாதிரிகள், கருவிகள், மதிப்பீட்டுத் தொகுப்புகள்.", bodyEn: "The open work — models, tooling, and evaluation suites.", href: "https://github.com/yazhi-lem", label: "github.com/yazhi-lem →", external: true },
  ],
};

/** The developer track — Yazhi Dev Spaces opens 18 Oct (harness §5). */
export const DEVELOPERS = {
  eyebrowTa: "உருவாக்குநர்களுக்கு", eyebrowEn: "For developers",
  titleTa: "உங்கள் தாய்மொழிக்காக உருவாக்குங்கள்", titleEn: "Build for your mother tongue",
  bodyTa:
    "யாழி Dev Spaces அக்டோபர் 18 அன்று circle.yazhi.dev-இல் திறக்கிறது: நாம் பேசி வளர்ந்த மொழிகளுக்குச் செயற்கை நுண்ணறிவை உருவாக்கும் இந்திய உருவாக்குநர்களின் மன்றம். ஆதன் டோக்கனைசர் அளவீட்டிலிருந்தும் யாழி API-யிலிருந்தும் தொடங்குங்கள்; உங்கள் மொழியில் முகவர்களையும் கருவிகளையும் உருவாக்குங்கள்; இதை ஏற்கெனவே செய்த பொறியாளர்களிடம் உதவி பெறுங்கள்.",
  bodyEn:
    "Yazhi Dev Spaces opens on 18 October at circle.yazhi.dev — a community of developers across India building AI for the languages we grew up speaking. Start with the Adhan tokenizer benchmark and the Yazhi API, ship agents and tools in your own language, and get help from engineers who've done it before.",
  plainTa: "இந்தியா முழுவதும் உள்ள உருவாக்குநர்கள் தங்கள் தாய்மொழிக்காகச் செயற்கை நுண்ணறிவுக் கருவிகளை வடிவமைக்கிறார்கள் — நீங்களும் இணையலாம்.",
  plainEn: "Developers across India building AI tools for their own mother tongues — you're welcome to join in.",
  ctaTa: "உருவாக்குநராகச் சேருக", ctaEn: "Join as a developer",
  ctaHref: "/onboarding?track=developer",
  discordCtaTa: "Discord-இல் சேருக", discordCtaEn: "Join the Discord",
};

export const SCRIPTS: { name: string; glyphs: string[] }[] = [
  { name: "Tamil", glyphs: "அ ஆ இ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன".split(" ") },
  { name: "Devanagari", glyphs: "अ आ इ क ख ग च ज ट ड त द न प ब म य र ल व".split(" ") },
  { name: "Bengali", glyphs: "অ আ ই ক খ গ চ জ ট ড ত দ ন প ব ম য র ল".split(" ") },
  { name: "Telugu", glyphs: "అ ఆ ఇ క గ చ జ ట డ త ద న ప బ మ య ర ల వ".split(" ") },
  { name: "Kannada", glyphs: "ಅ ಆ ಇ ಕ ಗ ಚ ಜ ಟ ಡ ತ ದ ನ ಪ ಬ ಮ ಯ ರ ಲ ವ".split(" ") },
  { name: "Malayalam", glyphs: "അ ആ ഇ ക ഗ ച ജ ട ഡ ത ദ ന പ ബ മ യ ര ല വ".split(" ") },
  { name: "Gujarati", glyphs: "અ આ ઇ".split(" ") },
];
