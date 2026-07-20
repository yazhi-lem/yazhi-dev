import { L, type LText } from "./i18n";

/* ============================================================
   ALL SITE COPY — single source of truth.

   Voice: conversational. The site talks TO the visitor, like a
   friend showing them around — short sentences, questions,
   invitations — in every language, not just English.

   Every string is an `LText`:
     en     — conversational English
     indic  — per-language variants (ta required; hi complete;
              add more languages here — see docs/CONTENT-I18N.md)
     mixed  — ONE flowing line that code-switches naturally
              between English and that Indic language, the way
              bilingual speakers actually talk. Authored by hand,
              never machine-collated.

   Tamil is the primary voice. Hindi is complete. Other Indic
   languages fall back to English until their columns land —
   adding one is purely additive (no code changes).

   NOTE: the Bharathiyar quote is verbatim and must never be
   paraphrased. Non-Tamil translations of it are translations of
   record, not conversational copy.
   ============================================================ */

export type ThinaiKey = "kurinji" | "mullai" | "marutham" | "neytal" | "palai";

export interface ThinaiEntry {
  key: ThinaiKey;
  icon: string;
  /** The thinai's name — a Tamil literary term; other languages transliterate. */
  name: LText;
  /** Keep the raw Tamil/Latin forms for brand lockups. */
  ta: string;
  en: string;
  landscape: LText;
  poetic: LText;
  section: string; // DOM id of the section this thinai governs
}

export const THINAI: ThinaiEntry[] = [
  {
    key: "kurinji", icon: "🏔️", ta: "குறிஞ்சி", en: "Kurinji", section: "hero",
    name: L("Kurinji", { ta: "குறிஞ்சி", hi: "कुरिंजी", ml: "കുരിഞ്ജി", te: "కురింజీ" }),
    landscape: L("Mountains", { ta: "மலை", hi: "पहाड़", ml: "പർവതം", te: "పర్వతాలు" }),
    poetic: L("Union — first love in the hills", { ta: "புணர்தல் — மலையில் மலரும் முதல் காதல்", hi: "मिलन — पहाड़ों में पहला प्यार", ml: "ഐക്യം — കുന്നുകളിൽ ആദ്യ പ്രണയം", te: "మిలనం — కొండల్లో మొదటి ప్రేమ" }),
  },
  {
    key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", section: "adhan",
    name: L("Mullai", { ta: "முல்லை", hi: "मुल्लै", ml: "മുല്ലൈ", te: "ముల్లై" }),
    landscape: L("Forest", { ta: "காடு", hi: "जंगल", ml: "കാട്", te: "అడవి" }),
    poetic: L("Patient waiting — love that trusts", { ta: "இருத்தல் — நம்பிக்கையோடு காத்திருத்தல்", hi: "धैर्य से प्रतीक्षा — भरोसे वाला प्रेम", ml: "ക്ഷമയോടെ കാത്തിരിക്കൽ — വിശ്വാസമുള്ള പ്രണയം", te: "ఓపిక గల ఆశ్రయం — విశ్వాస ఆధారపడిన ప్రేమ" }),
  },
  {
    key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", section: "sangam",
    name: L("Marutham", { ta: "மருதம்", hi: "मरुदम", ml: "മരുതം", te: "మరుదం" }),
    landscape: L("Farmland", { ta: "வயல்", hi: "खेत", ml: "നാരകം", te: "పొలాలు" }),
    poetic: L("Lovers' quarrels — and making up", { ta: "ஊடல் — பிணக்கும் சமாதானமும்", hi: "रूठना-मनाना — प्रेमियों की नोकझोंक", ml: "കോപം — പഴുതും പരിഹാരവും", te: "ఆగ్రహం — రూకుటా-మనవటా" }),
  },
  {
    key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", section: "guardian",
    name: L("Palai", { ta: "பாலை", hi: "पालै", ml: "പാലൈ", te: "పాలై" }),
    landscape: L("Desert", { ta: "பாலைவனம்", hi: "रेगिस्तान", ml: "മരുഭൂമി", te: "ఎడారి" }),
    poetic: L("Hardship endured — the long crossing", { ta: "பிரிதல் — கடத்தலின் துயரம்", hi: "कठिन डगर — लंबा सफ़र", ml: "പരിതാപം — നീണ്ട ദുരാതിഷ്ഠാനം", te: "కష్టం సహించిన — పొడవాటి దూసుకోవడం" }),
  },
  {
    key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", section: "community",
    name: L("Neytal", { ta: "நெய்தல்", hi: "नेय्दल", ml: "നെയ്തൽ", te: "నెయ్తల్" }),
    landscape: L("Seashore", { ta: "கடற்கரை", hi: "समुद्र-तट", ml: "കടലോരം", te: "సముద్ర పూట" }),
    poetic: L("Longing across the water", { ta: "இரங்கல் — கடல் தாண்டிய ஏக்கம்", hi: "विरह — पानी के पार की तड़प", ml: "ജലത്തിനപ്പുറത്തെ നിരാശ", te: "నీటిలో పరపక్ష ఆశ" }),
  },
];

/* ---------------- identity ---------------- */

export const IDENTITY = {
  nameTa: "யாழி",
  nameEn: "Yazhi",
  positioning: "Sovereign AI & Language Initiative",

  /** The hero headline. */
  tagline: L(
    "AI that speaks your language",
    {
      ta: "உங்கள் மொழியில் பேசும் AI",
      hi: "आपकी भाषा में बोलने वाली AI",
      ml: "നിങ്ങളുടെ ഭാഷ സംസാരിക്കുന്ന AI",
      te: "మీ భాష మాట్లాడే AI",
    },
    {
      ta: "AI that speaks உங்கள் மொழி",
      hi: "AI that speaks आपकी भाषा",
      ml: "AI that speaks നിങ്ങളുടെ ഭാഷ",
      te: "AI that speaks మీ భాష",
    }
  ),

  /** The hero sub — the whole pitch in three sentences. */
  full: L(
    "Ask it anything in Tamil, Hindi, Bengali, Telugu — any of 22+ Indian languages. It answers the way a friend would: in your words, with your context. Built in India, owned by its people.",
    {
      ta: "தமிழ், இந்தி, வங்காளம், தெலுங்கு — 22+ இந்திய மொழிகளில் எதிலும் கேளுங்கள். ஒரு நண்பர் பதில் சொல்வது போல் — உங்கள் சொற்களில், உங்கள் சூழலில் — பதில் கிடைக்கும். இந்தியாவில் உருவானது; நம் மக்களுக்கே சொந்தம்.",
      hi: "तमिल, हिन्दी, बांग्ला, तेलुगु — 22+ भारतीय भाषाओं में कुछ भी पूछिए। जवाब ऐसे मिलेगा जैसे कोई दोस्त दे रहा हो — आपके शब्दों में, आपके संदर्भ के साथ। भारत में बना, अपने लोगों का अपना।",
      ml: "തമിഴ്, ഹിന്ദി, ബംഗാളി, തെലുങ്ക് — 22+ ഇന്ത്യൻ ഭാഷകളിൽ ഏതെങ്കിലും ചോദിക്കുക. ഒരു സുഹൃത്ത് ഉത്തരം നൽകുന്ന രീതിയിൽ — നിങ്ങളുടെ പദങ്ങളിൽ, നിങ്ങളുടെ സന്ദർഭത്തിൽ — ഉത്തരം കിട്ടും. ഇന്ത്യയിൽ നിർമിതം, അതിന്റെ ജനങ്ങൾക്കുടമ്പതിയാണ്.",
      te: "తమిళ్ళు, హిందీ, బెంగాలీ, తెలుగు — 22+ భారతీయ భాషల్లో ఏదైనా అడగండి. ఒక స్నేహితుడు సమాధానం చెప్పేటప్పుడు కాబట్టి — నీ పదాల్లో, నీ సందర్భంలో — సమాధానం చేరుకుంటుంది. భారతదేశంలో నిర్మిత, దాని ప్రజలకు సొంతమైనది.",
    },
    {
      ta: "Start in English, தமிழில் முடியுங்கள் — நடுவில் மொழி மாறினாலும் புரிந்துகொள்ளும். It's AI that code-switches, நம்மைப் போலவே.",
      hi: "Start in English, हिन्दी में ख़त्म कीजिए — बीच में भाषा बदल भी जाए तो समझ जाएगी। It's AI that code-switches, बिल्कुल हमारी तरह।",
      ml: "Start in English, മലയാളത്തിൽ അവസാനിപ്പിക്കുക — നടുവിൽ ഭാഷ മാറിയാലും മനസിലാക്കും. It's AI that code-switches, നമ്മളെപോലെ.",
      te: "Start in English, తెలుగులో ముగించండి — మధ్యలో భాష మారిన కూడా అర్థమవుతుంది. It's AI that code-switches, ჩვენი లాగా.",
    }
  ),

  /** Footer sign-off. */
  footer: L(
    "Made with care, in our own languages.",
    {
      ta: "நம் சொந்த மொழிகளில், அக்கறையுடன் உருவாக்கியது.",
      hi: "अपनी भाषाओं में, पूरे मन से बनाया हुआ।",
      ml: "നമ്മുടെ സ്വന്ത ഭാഷകളിൽ, ശ്രദ്ധയോടെ നിർമിതം.",
      te: "మన సొంత భాషల్లో, సంరక్ష్‍తంతో నిర్మితమైనది.",
    },
    {
      ta: "Made with care — நம் மொழிகளில், நமக்காக.",
      hi: "Made with care — हमारी भाषाओं में, हमारे लिए।",
      ml: "Made with care — നమ്മുടെ ഭാഷകളിൽ, നമ്മുക്കായി.",
      te: "Made with care — మన భాషల్లో, మాకుగానీ.",
    }
  ),

  copyright: "© 2026 யாழி • Yazhi",
};

/* ---------------- hero ---------------- */

export const HERO = {
  eyebrow: L(
    "Kurinji · the mountains — every journey starts with a hello",
    {
      ta: "குறிஞ்சி · மலை — எல்லாப் பயணமும் ஒரு வணக்கத்தில் தொடங்குகிறது",
      hi: "कुरिंजी · पहाड़ — हर सफ़र एक नमस्ते से शुरू होता है",
      ml: "കുരിഞ്ജി · പർവതം — ഓരോ യാത്ര ഒരു അഭിനന്ദനത്തിൽ നിന്ന് ആരംഭിക്കുന്നു",
      te: "కురింజీ · పర్వతం — ప్రతి ప్రయాణం ఒక వందనతో ప్రారంభమవుతుంది",
    },
    {
      ta: "Kurinji · மலை — every journey starts with ஒரு வணக்கம்",
      hi: "Kurinji · पहाड़ — every journey starts with एक नमस्ते",
      ml: "Kurinji · പർവതം — every journey starts with ഒരു നമസ്കാരം",
      te: "Kurinji · పర్వతం — every journey starts with ఒక నమస్కారం",
    }
  ),
  scrollCue: L(
    "come, scroll with us",
    { ta: "வாங்க, கீழே போகலாம்", hi: "आइए, नीचे चलें", ml: "വാങ്ക, താഴോട്ട് പോകാം", te: "వాங్క, క్రిందికి పోవచ్చు" },
    { ta: "வாங்க — scroll பண்ணலாம்", hi: "आइए — scroll करते हैं", ml: "വാങ്ക — scroll പണ്ണാം", te: "వాங్క — scroll చేద్దాం" }
  ),
};

/** Bharathiyar — verbatim, correctly attributed. The Tamil line is the
    artefact itself and always renders in Tamil; only its translation
    follows the visitor's language. */
export const HERO_QUOTE = {
  ta: "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்",
  translation: L(
    "Of all the languages we know, none is as sweet as Tamil",
    {
      ta: "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்",
      hi: "हमें ज्ञात सभी भाषाओं में, तमिल जैसी मीठी और कोई नहीं",
      ml: "നമ്മൾ അറിയുന്ന എല്ലാ ഭാഷകളിലും, തമിഴ് പോലെ മധുരം വേറെ ഇല്ല",
      te: "మనకు తెలిసిన అన్ని భాషల్లో, తమిళ్ళ వలె తీపి మరేదీ లేదు",
    }
  ),
  intro: L(
    "Why build all of this? Bharathiyar answered a century ago:",
    {
      ta: "இதெல்லாம் எதற்காக? நூறு ஆண்டுகளுக்கு முன்பே பாரதியார் பதில் சொல்லிவிட்டார்:",
      hi: "यह सब किसलिए? भारतीयार ने सौ साल पहले ही जवाब दे दिया था:",
      ml: "ഇതെല്ലാം എന്തിനു? നൂറ് വർഷങ്ങൾ മുമ്പ് ഭാരതിയാർ ഉത്തരം പറഞ്ഞിരുന്നു:",
      te: "ఇదంతా ఎందుకు? భారతీయార్ నూటి సంవత్సరాల క్రితమే సమాధానం ఇచ్చారు:",
    },
    {
      ta: "Why build all this? பாரதியார் அன்றே சொல்லிவிட்டார்:",
      hi: "Why build all this? भारतीयार सौ साल पहले ही बता गए:",
      ml: "Why build all this? ഭാരതിയാർ ഇതിനകത്തത്തന്നെ പറഞ്ഞതാണ്:",
      te: "Why build all this? భారతీయార్ ఆ సమయంలో చెప్పారు:",
    }
  ),
  attribution: L("Bharathiyar", { ta: "பாரதியார்", hi: "भारतीयार", ml: "ഭാരതിയാർ", te: "భారతీయార్" }),
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

export const STATS: { value: string; label: LText }[] = [
  { value: "7B", label: L("parameters", { ta: "அளவுருக்கள்", hi: "पैरामीटर", ml: "പരാമീറ്ററുകൾ", te: "పారామితులు" }) },
  { value: "22+", label: L("Indian languages", { ta: "இந்திய மொழிகள்", hi: "भारतीय भाषाएँ", ml: "ഇന്ത്യൻ ഭാഷകൾ", te: "భారతీయ భాషలు" }) },
  { value: "3", label: L("projects", { ta: "திட்டங்கள்", hi: "प्रोजेक्ट", ml: "പദ്ധതികൾ", te: "ప్రాజెక్టులు" }) },
];

/* ---------------- Adhan — the model ---------------- */

export const ADHAN = {
  nameTa: "அதன்",
  nameEn: "Adhan",
  name: L("Adhan", { ta: "அதன்", hi: "अदन", ml: "അതൻ", te: "అదన్" }),
  eyebrow: L(
    "Mullai · the forest — good things grow slowly",
    {
      ta: "முல்லை · காடு — நல்லவை நிதானமாக வளரும்",
      hi: "मुल्लै · जंगल — अच्छी चीज़ें धीरे-धीरे बढ़ती हैं",
      ml: "മുല്ലൈ · കാട് — നല്ലകാര്യങ്ങൾ സാവധാനത്തിൽ വളരുന്നു",
      te: "ముల్లై · అడవి — మంచి విషయాలు నిండకుండా పెరుగుతాయి",
    },
    {
      ta: "Mullai · काडu — good things नિതานामाक वळरु",
      hi: "Mullai · जंगल — good things धीरे-धीरे बढ़ती हैं",
      ml: "Mullai · കാട് — good things സാവധാനത്തിൽ വളരും",
      te: "Mullai · అడవి — good things నిండకుండా పെరుగుతాయి",
    }
  ),
  sub: L(
    "One model that grew up speaking 22+ languages",
    {
      ta: "22+ மொழிகள் பேசி வளர்ந்த ஒரே மாதிரி",
      hi: "22+ भाषाएँ बोलते हुए बड़ा हुआ एक ही मॉडल",
      ml: "22+ ഭാഷകൾ സംസാരിച്ച് വളർന്ന ഒരേ മാതൃക",
      te: "22+ భాషలు మాట్లాడేటప్పుడు పെరిగిన ఒకే మోడల్",
    },
    {
      ta: "ஒரே model — ஆனால் 22+ மொழிகள் பேசி வளர்ந்தது",
      hi: "एक ही model — लेकिन 22+ भाषाएँ बोलते हुए बड़ा हुआ",
      ml: "ഒരേ model — എന്നാൽ 22+ ഭാഷകൾ സംസാരിച്ച് വളർന്നത്",
      te: "ఒకే model — కానీ 22+ భాషలు మాట్లాడేటప్పుడు పെరిగిన",
    }
  ),
  body: L(
    "Adhan is our 7-billion-parameter model, and it didn't learn Indian languages as an afterthought — it grew up on them. Ask a question in Tamil and follow up in Hindi; quote a proverb in Telugu and ask what it means in Bengali. There's no translation layer in the middle, just one model that thinks across our languages. And it's fully open: download the weights, run it on your own machine, fine-tune it for your community.",
    {
      ta: "அதன் — 7 பில்லியன் அளவுருக்கள் கொண்ட எங்கள் மாதிரி. இந்திய மொழிகளைப் பின்குறிப்பாகக் கற்றதல்ல; அவற்றிலேயே வளர்ந்தது. தமிழில் கேள்வி கேட்டு, இந்தியில் தொடருங்கள்; தெலுங்கில் ஒரு பழமொழி சொல்லி, அதன் பொருளை வங்காளத்தில் கேளுங்கள். நடுவில் மொழிபெயர்ப்பு அடுக்கு எதுவும் இல்லை — நம் மொழிகளிலேயே சிந்திக்கும் ஒரே மாதிரி. முழுவதும் திறந்தது: எடைகளைப் பதிவிறக்குங்கள், உங்கள் கணினியில் இயக்குங்கள், உங்கள் சமூகத்திற்காகச் செம்மைப்படுத்துங்கள்.",
      hi: "अदन हमारा 7 अरब पैरामीटर वाला मॉडल है, और इसने भारतीय भाषाएँ बाद में नहीं सीखीं — यह उन्हीं में पला-बढ़ा है। तमिल में सवाल पूछिए और हिन्दी में आगे बढ़िए; तेलुगु की कोई कहावत सुनाइए और उसका मतलब बांग्ला में पूछिए। बीच में कोई अनुवाद की परत नहीं — बस एक मॉडल जो हमारी भाषाओं में सोचता है। और यह पूरी तरह खुला है: वेट्स डाउनलोड कीजिए, अपनी मशीन पर चलाइए, अपने समुदाय के लिए फ़ाइन-ट्यून कीजिए।",
    },
    {
      ta: "Adhan ஒரு 7B model — ஆனால் இது இந்திய மொழிகளை ஒரு subject போலப் படிக்கவில்லை, அவற்றிலேயே வளர்ந்தது. Ask in Tamil, follow up in Hindi — நடுவில் எந்த translation layer-ும் இல்லை. Fully open கூட: weights-ஐ download செய்து, உங்கள் machine-லேயே இயக்குங்கள்.",
      hi: "Adhan एक 7B model है — लेकिन इसने भारतीय भाषाएँ किसी subject की तरह नहीं पढ़ीं, इन्हीं में बड़ा हुआ है। Ask in Tamil, follow up in Hindi — बीच में कोई translation layer नहीं। Fully open भी: weights download कीजिए, अपनी machine पर चलाइए।",
    }
  ),
  stats: [
    { value: "7B", label: L("parameters", { ta: "அளவுருக்கள்", hi: "पैरामीटर", ml: "പരാമീറ്ററുകൾ", te: "పారామితులు" }) },
    { value: "22+", label: L("languages", { ta: "மொழிகள்", hi: "भाषाएँ", ml: "ഭാഷകൾ", te: "భాషలు" }) },
    { value: "100%", label: L("open, Indian-built", { ta: "திறந்த, இந்திய உருவாக்கம்", hi: "खुला, भारत में बना", ml: "തുറന്ന, ഇന്ത്യൻ നിർമിത", te: "తెరిచిన, ఇండియన్-నిర్మిత" }) },
  ],
  /* the quickstart itself demonstrates the natural EN→Indic hand-off */
  code: `from adhan import Model

model = Model.load("adhan-7b")

# start in English, finish in your language — Adhan follows
chat = model.chat()
chat.send("Explain photosynthesis, ஆனா தமிழ்ல சொல்லு")
chat.send("अब यही हिन्दी में समझाओ")
chat.send("ఇప్పుడు తెలుగులో చెప్పు")`,
  cta: L(
    "See it on GitHub →",
    { ta: "GitHub-இல் போய் பாருங்கள் →", hi: "GitHub पर देखिए →", ml: "GitHub-ൽ പോയി നോക്കുക →", te: "GitHub-లో చూడండి →" },
    { ta: "GitHub-ல போய் பாருங்க →", hi: "GitHub पर जाकर देखिए →", ml: "GitHub-ൽ പോയ് നോക്കുക →", te: "GitHub-కి వెళ్లి చూడండి →" }
  ),
  ctaHref: "https://github.com/yazhi-lem/adhan",
};

/* ---------------- Sangam — the literature companion ---------------- */

export const SANGAM = {
  nameTa: "சங்கம்",
  nameEn: "Sangam",
  name: L("Sangam", { ta: "சங்கம்", hi: "संगम", ml: "സങ്കം", te: "సంగం" }),
  eyebrow: L(
    "Marutham · the farmland — where stories are harvested",
    {
      ta: "மருதம் · வயல் — கதைகள் அறுவடையாகும் இடம்",
      hi: "मरुदम · खेत — जहाँ कहानियों की फ़सल कटती है",
      ml: "മരുതം · നാരകം — കഥകൾ വിളവെടുക്കപ്പെടുന്ന സ്ഥലം",
      te: "మరుదం · పొల్లు — కథలు కోయబడిన స్థలం",
    },
    {
      ta: "Marutham · வயல் — stories அறுவடையாகும் இடம்",
      hi: "Marutham · खेत — जहाँ stories की फ़सल कटती है",
      ml: "Marutham · നാരകം — stories വിളവെടുക്കപ്പെടുന്നു",
      te: "Marutham · పొల్లు — stories కోయబడుతుంది",
    }
  ),
  sub: L(
    "Two thousand years of Tamil poetry, one curious companion",
    {
      ta: "இரண்டாயிரம் ஆண்டுத் தமிழ்க் கவிதை, உடன் வரும் ஒரு துணை",
      hi: "दो हज़ार साल की तमिल कविता, साथ चलने वाला एक साथी",
      ml: "രണ്ടായിരം വർഷത്തെ തമിഴ് കവിത, ഒരു കൌതുകശീലനായ സഹചാരി",
      te: "రెండు వేల సంవత్సరాల తమిళ్ల కవిత, ఒక కൌతూహల సహచారి",
    },
    {
      ta: "2000 வருடங்களின் Tamil poetry — உங்களுடன் ஒரு companion",
      hi: "2000 साल की Tamil poetry — आपके साथ एक companion",
      ml: "2000 വർഷത്തെ Tamil poetry — നിങ്ങളുടെ companion",
      te: "2000 సంవత్సరాల Tamil poetry — మీ companion",
    }
  ),
  body: L(
    "Long before hashtags, Sangam poets tagged every feeling with a landscape: mountains for first love, forests for patient waiting, farmland for lovers' quarrels, the seashore for longing, the desert for separation. Sangam — our literature companion — reads classical Tamil poems with you. It tells you which landscape a verse belongs to, unpacks the birds and flowers doing the emotional work, and shows why a two-thousand-year-old line can still make you catch your breath.",
    {
      ta: "ஹேஷ்டேக் வருவதற்கு வெகு காலம் முன்பே, சங்கப் புலவர்கள் ஒவ்வொரு உணர்வுக்கும் ஒரு நிலத்தைக் குறியிட்டனர்: முதல் காதலுக்கு மலை, பொறுமையான காத்திருப்புக்குக் காடு, ஊடலுக்கு வயல், ஏக்கத்திற்குக் கடற்கரை, பிரிவுக்குப் பாலை. எங்கள் இலக்கியத் துணையான சங்கம், உங்களுடன் சேர்ந்து சங்கப் பாடல்களைப் படிக்கிறது — ஒரு பாடல் எந்தத் திணை என்று சொல்லும்; பறவைகளும் பூக்களும் சுமந்து நிற்கும் உணர்வுகளை விளக்கும்; இரண்டாயிரம் ஆண்டு பழைய ஒரு வரி ஏன் இன்றும் மூச்சை நிறுத்துகிறது என்று காட்டும்.",
      hi: "हैशटैग आने से बहुत पहले, संगम कवियों ने हर भावना को एक परिदृश्य से जोड़ दिया था: पहले प्यार के लिए पहाड़, धैर्य भरी प्रतीक्षा के लिए जंगल, प्रेमियों की नोकझोंक के लिए खेत, विरह के लिए समुद्र-तट, बिछोह के लिए रेगिस्तान। संगम — हमारा साहित्य-साथी — आपके साथ बैठकर प्राचीन तमिल कविताएँ पढ़ता है। बताता है कि कोई पद किस परिदृश्य का है, समझाता है कि पंछी और फूल कौन-सी भावना ढो रहे हैं, और दिखाता है कि दो हज़ार साल पुरानी पंक्ति आज भी साँस क्यों रोक देती है।",
    },
    {
      ta: "Hashtags வருவதற்கு ரொம்ப முன்னாடியே, சங்கப் புலவர்கள் feelings-ஐ நிலங்களால் tag செய்துவிட்டார்கள். Sangam உங்களுடன் உட்கார்ந்து பாடல் படிக்கும் — which thinai, எந்த உணர்வு, ஏன் அந்த வரி இன்னும் நெஞ்சில் தைக்கிறது என்று சொல்லும்.",
      hi: "Hashtags से बहुत पहले ही संगम कवियों ने feelings को landscapes से tag कर दिया था। Sangam आपके साथ बैठकर कविता पढ़ता है — which landscape, कौन-सी भावना, और वह पंक्ति आज भी दिल में क्यों चुभती है।",
    }
  ),
  pillars: [
    {
      icon: "📜",
      label: L(
        "Read poems together",
        { ta: "சேர்ந்து பாடல் படிப்போம்", hi: "साथ मिलकर कविता पढ़ें", ml: "ഒരുമിച്ച് കവിത വായിക്കാം", te: "కలిసి కవిత చదువుకుందాం" },
        { ta: "பாடலை together படிப்போம்", hi: "कविता together पढ़ेंगे", ml: "കവിത together വായിക്കാം", te: "కవిత together చదువుకుందాం" }
      ),
    },
    {
      icon: "🏞️",
      label: L(
        "Which landscape is this?",
        { ta: "இது எந்தத் திணை?", hi: "यह कौन-सा परिदृश्य है?", ml: "ഇത് ഏതാണ് തിണൈ?", te: "ఇది ఏ ల్యాండ్‌స్కేప్?" },
        { ta: "இது which thinai?", hi: "यह which landscape?", ml: "ഇത് which thinai?", te: "ఇది which landscape?" }
      ),
    },
    {
      icon: "📖",
      label: L(
        "How the language works",
        { ta: "மொழி எப்படி இயங்குகிறது", hi: "भाषा कैसे काम करती है", ml: "ഭാഷ എങ്ങനെ പ്രവർത്തിക്കുന്നു", te: "భాష ఎలా పనిచేస్తుంది" },
        { ta: "மொழி எப்படி work ஆகிறது", hi: "भाषा कैसे work करती है", ml: "ഭാഷ എങ്ങനെ work ആണ്", te: "భాష ఎలా work చేస్తుంది" }
      ),
    },
  ],
  cta: L(
    "Wander in →",
    { ta: "உள்ளே வாருங்கள் →", hi: "अंदर आइए →", ml: "അകത്തേക്ക് കടക്കുക →", te: "లోపలికి వెళ్లండి →" },
    { ta: "உள்ள வாங்க →", hi: "अंदर आ जाइए →", ml: "അകത്ത് കടക്കാം →", te: "లోపలికి వెళ్లిద్దాం →" }
  ),
  ctaHref: "https://sangam.yazhi.dev",
};

/* ---------------- Yazh — the guardian ---------------- */

export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh",
  name: L("Yazh", { ta: "யாழ்", hi: "यज़", ml: "യാഴ്", te: "యాఴ్" }),
  eyebrow: L(
    "Your child's bilingual companion — Tamil and English, growing together",
    {
      ta: "உங்கள் குழந்தைக்கான இரு மொழி துணை — தமிழும் ஆங்கிலமும், சேர்ந்து வளரும்",
      hi: "आपके बच्चे का द्विभाषिक साथी — तमिल और अंग्रेजी, साथ बढ़ते हुए",
      ml: "നിങ്ങളുടെ കുട്ടിയുടെ ദ്വിഭാഷിക സഹചാരി — തമിഴും ഇംഗ്ലീഷും, ഒരുമിച്ച് വളരുന്നു",
      te: "మీ బాలుడ/బాలికకు ద్విభాషిక సహచారి — తమిళ్ళు మరియు ఇంగ్లీష్, కలిసి పెరుగుతూ",
    },
    {
      ta: "உங்கள் குழந்தைக்கான companion — தமிழும் English-ம், சேர்ந்து வளரும்",
      hi: "आपके बच्चे के साथ एक companion — तमिल और English, साथ बढ़ेंगे",
      ml: "നിങ്ങളുടെ കുട്ടിയുടെ companion — തമിഴും English, കൂടിച്ചേർന്ന് വളരും",
      te: "మీ బాలుడ/బాలికకు companion — తమిళ్ళు మరియు English, కలిసి పెరుగుతారు",
    }
  ),
  sub: L(
    "A learning pet that speaks your language and remembers your child's name",
    {
      ta: "உங்கள் மொழিতে பேசி, உங்கள் குழந்தையின் பெயரை நினைக்கும் ஒரு கற்ற குட்டை",
      hi: "एक सीखने वाला साथी जो आपकी भाषा बोलता है और आपके बच्चे का नाम याद रखता है",
      ml: "നിങ്ങളുടെ ഭാഷ സംസാരിക്കുന്ന, നിങ്ങളുടെ കുട്ടിയുടെ പേര് ഓർത്തുവയ്ക്കുന്ന ഒരു പഠന സാഹചര്യം",
      te: "మీ భాష మాట్లాడే, మీ బాలుడ/బాలికचकी పేరు గుర్తుకు తెచ్చుకోగలిగిన ఒక అభ్యాస సాథి",
    },
    {
      ta: "Learning pet — எங்கள் மொழিയில் பேசும், உங்கள் குழந்தையைப் போலவே",
      hi: "Learning pet — हमारी भाषाओं में बोलता है, आपके बच्चे की तरह",
      ml: "Learning pet — നമ്മുടെ ഭാഷകളിൽ സംസാരിക്കുന്നു, നിങ്ങളുടെ കുട്ടി പോലെ",
      te: "Learning pet — మన భాషలలో మాట్లాడుతుంది, మీ కూతుర/కుమారుడు లాగా",
    }
  ),
  body: L(
    "Yazh is a bilingual companion for children aged 4–12, speaking Tamil and English the way real families actually talk — code-switching in one sentence, remembering your child's name and favorite stories. Born from the yali of ancient temple pillars, it's here to keep language alive: answering questions, playing games, and reading bedtime tales collected from grandmothers across Tamil Nadu, Jaffna, Singapore, and Toronto. Each story carries the name of the elder who gave it. Yazh grows with your child, and never judges — every try is a chance to learn.",
    {
      ta: "யாழ் என்பது 4-12 வயது குழந்தைகளுக்கான இரு மொழி துணை — தமிழும் ஆங்கிலமும் இயல்பாக பேசும், கோடுசாதல் செய்யும், குழந்தையின் பெயரை நினைக்கும், பிடித்த கதைகளை ஞாபகம் வைக்கும். பாரம்பரிய கோயில் தூண்களின் யாளியிலிருந்து பிறந்த இது, மொழியை உயிர்ப்பாக வைக்க, கேள்விகளுக்குப் பதிலளிக்க, விளையாட்டு விளையாட, தமிழ்நாடு, யாழ்ப்பாணம், சிங்கப்பூர், டொரன்டோ என்று உள்ள பாட்டிமார்களிடமிருந்து சேகரித்த படுக்கைக்கு முன் கதை சொல்லலாம். ஒவ்வொரு கதைக்கும் அதைக் கொடுத்த பெரியவருடைய பெயர் இருக்கிறது. யாழ் குழந்தையுடன் வளரும், ஒருபோதும் குற்றம் சாட்டாது — ஒவ்வொரு முயற்சியும் கற்க ஒரு வாய்ப்பு.",
      hi: "यज़ 4-12 साल के बच्चों के लिए एक द्विभाषिक साथी है — तमिल और अंग्रेजी स्वाभाविक तरीके से बोलता है, कोड-स्विच करता है, आपके बच्चे का नाम याद रखता है, प्रिय कहानियों को स्मरण करता है। प्राचीन मंदिर के खंभों की याऴी से पैदा हुआ, यह भाषा को जीवंत रखने के लिए है — सवालों का जवाब देने, खेल खेलने, और तमिलनाडु, जाफना, सिंगापुर, टोरंटो भर की दादी-नानियों से जुटाई गई बिस्तर के वक़्त की कहानियें सुनाने के लिए। हर कहानी में उस बुजुर्ग का नाम होता है जिसने वह दी। यज़ आपके बच्चे के साथ बढ़ता है, और कभी शिकायत नहीं करता — हर कोशिश सीखने का एक मौका है।",
      ml: "യാഴ് 4-12 വയസ്സുള്ള കുട്ടികൾക്കായി ഒരു ദ്വിഭാഷിക സഹചാരി — തമിഴിലും ഇംഗ്ലീഷിലും സ്വാഭാവികമായി സംസാരിക്കുന്നു, കോഡ് സ്വിച്ച് ചെയ്യുന്നു, നിങ്ങളുടെ കുട്ടിയുടെ പേര് ഓർമ്മയിൽ നിലനിർത്തുന്നു, പ്രിയപ്പെട്ട കഥകൾ മനസ്സിലാക്കി വയ്ക്കുന്നു. പുരാതന ക്ഷേത്ര സ്തംഭങ്ങളിലെ യാഴിയിൽ നിന്ന് ജനിച്ച, ഭാഷയെ ജീവനോടെ പാലിക്കാൻ — ചോദ്യങ്ങൾക്കുത്തരം നൽകാൻ, കളിയാടാൻ, തമിഴ്നാട്, യാഴ്പ്പാണം, സിംഗപ്പൂർ, ടോറന്റോ എന്നിവിടങ്ങളിലെ അമ്മച്ചമാരിൽ നിന്ന് സംഗ്രഹിച്ച ഉറങ്ങും മുമ്പ് കഥകൾ പറയാൻ ഈ പ്രയോജനപ്പെടുത്തുന്നു. ഓരോ കഥയും അത് നൽകിയ മുതിർന്ന വ്യക്തിയുടെ പേര് വഹിക്കുന്നു. യാഴ് നിങ്ങളുടെ കുട്ടിയോടൊപ്പം വളരുന്നു, ഒരിക്കലും കുറ്റം ചുമത്താത്തിരിക്കുന്നു — ഓരോ ശ്രമവും പഠിക്കാനുള്ള ഒരു അവസരം.",
      te: "యాఴ్ 4-12 సంవత్సరాల బాలకులకు ఒక ద్విభాషిక సహచారి — తమిళ్ళు మరియు ఇంగ్లీష్ సహజంగా మాట్లాడుతుంది, కోడ్ స్విచ్ చేస్తుంది, మీ బాలుడ/బాలికचનું పేరు గుర్తు ఉంచుతుంది, ఇష్టమైన కథలను గుర్తుకు తెచ్చుకుంటుంది. ప్రాచీన ఆలయ స్తంభాలపై యాఴి నుండి జన్మించిన, ఈ భాష జీవంతమైనదిగా ఉంచడానికి — ప్రశ్నలకు సమాధానం ఇవ్వడానికి, ఆట ఆడటానికి, తమిళ్నాడు, యాఴ్నా, సింగపూర్, టోరంటో జరిగిన అమ్మలవారు నుండి సేకరించిన నిద్రకు ముందు కథలు చెప్పడానికి ఉంటుంది. ప్రతి కథ దానిని ఇచ్చిన పెద్దల పేరు కలిగి ఉంటుంది. యాఴ్ మీ కుమారుడు/కూతురుతో కూడా పెరుగుతుంది, ఎప్పుడూ నిందించదు — ప్రతి ప్రయత్నం నేర్చుకోవడానికి ఒక అవకాశం.",
    },
    {
      ta: "4-12 வயது குழந்தைகளுக்கான companion — தமிழிலும் ஆங்கிலத்திலும் பேசும். குழந்தையின் பெயர் ஞாபகம் வைக்கும், கேள்விகளுக்குப் பதிலளிக்கும், games விளையாட்டும், bedtime stories சொல்லுமுன் — அவை பாட்டிமார்களிடமிருந்து சேகரிக்கப்பட்ட கதைகள். குழந்தையுடன் வளர்ந்து, ஒருபோதும் குற்றம் சாட்டாமல், ஒவ்வொரு முயற்சிக்கும் கற்றல் வாய்ப்பை കொடுக்கும் companion.",
      hi: "4-12 साल के बच्चों का साथी — तमिल और अंग्रेजी दोनों में बोलता है। बच्चे का नाम याद रखता है, सवालों का जवाब देता है, games खेलता है, bedtime stories सुनाता है — जो दादी-नानियों से जुटाई गई कहानियाँ हैं। बच्चे के साथ बढ़ता है, कभी शिकायत नहीं करता, हर कोशिश को सीखने का मौका देता है।",
      ml: "4-12 വയസ്സുള്ള കുട്ടികൾക്കായി സഹചാരി — തമിഴിലും ഇംഗ്ലീഷിലും സംസാരിക്കുന്നു। കുട്ടിയുടെ പേര് ഓർത്തുവയ്ക്കുന്നു, ചോദ്യങ്ങൾക്കുത്തരം നൽകുന്നു, games കളിക്കുന്നു, bedtime stories പറയുന്നു — അവ അമ്മച്ചമാരിൽ നിന്ന് സംഗ്രഹിച്ച കഥകളാണ്. കുട്ടിയുടെ സാഥ് വളരുന്നു, ഒരിക്കലും കുറ്റം കാണിക്കുന്നില്ല, ഓരോ ശ്രമത്തിനും പഠന അവസരം നൽകുന്നു।",
      te: "4-12 సంవత్సరాల కుమారుల/కూతుర్ల సహచారి — తమిళ్ళు మరియు ఇంగ్లీష్ రెండింటిలోనూ మాట్లాడుతుంది. బాలుడ/బాలిక పేరు గుర్తు ఉంచుతుంది, ప్రశ్నలకు సమాధానం ఇస్తుంది, games ఆడుతుంది, bedtime stories చెప్పుతుంది — అవి అమ్మలవారు నుండి సేకరించిన కథలు. కుమారుడు/కూతురు తో కూడా పెరుగుతుంది, ఎప్పుడూ నిందించదు, ప్రతి ప్రయత్నానికి నేర్చుకోవడానికి అవకాశం ఇస్తుంది।",
    }
  ),
  cta: L(
    "Start your child's journey",
    { ta: "உங்கள் குழந்தையின் பயணம் தொடங்குங்கள்", hi: "अपने बच्चे की यात्रा शुरू करें" },
    { ta: "குழந்தைக்கான journey தொடங்கலாம்", hi: "बच्चे की journey शुरू करते हैं" }
  ),
  ctaHref: "/onboarding",
};

/* ---------------- Community ---------------- */

export const COMMUNITY = {
  title: L("Community", { ta: "சமூகம்", hi: "समुदाय", ml: "സമൂഹം", te: "సమాజం" }),
  eyebrow: L(
    "Neytal · the seashore — the sea took us far; the net brings us home",
    {
      ta: "நெய்தல் · கடற்கரை — கடல் நம்மைத் தொலைவில் கொண்டு சென்றது; வலை வீட്டுக்குக் கொண்டு வருகிறது",
      hi: "नेय्दल · समुद्र-तट — समुद्र हमें दूर ले गया; नेटवर्क घर ले आता है",
      ml: "നെയ്തൽ · കടലോരം — കടൽ നമ്മെ ദൂരത്തേക്ക് കൊണ്ടുപോയി; നെറ്റ്‌വർക്ക് നമ്മെ വീട്ടിലേക്ക് കൊണ്ടുവരുന്നു",
      te: "నెయ్తల్ · సముద్ర పూట — సముద్రం ನన్ను దూరానికి కూడా కాని; నెట్‌వర్క్ ఇంటికి తీసుకువస్తుంది",
    },
    {
      ta: "Neytal · கடற்கரை — the sea took us far; வலை நம்மை வீட்டுக்குக் கொண்டு வரும்",
      hi: "Neytal · समुद्र-तट — the sea took us far; network हमें घर ले आता है",
      ml: "Neytal · കടലോരം — the sea took us far; വലയ് നമ്മെ വീട്ടിലേക്ക് കൊണ്ടുവരുന്നു",
      te: "Neytal · సముద్ర పూట — the sea took us far; network నన్ను ఇంటికి తీసుకువస్తుంది",
    }
  ),
  sub: L(
    "Wherever you are, there's a seat here for you",
    {
      ta: "நீங்கள் எங்கிருந்தாலும், இங்கே உங்களுக்கு ஓர் இடம் உண்டு",
      hi: "आप जहाँ भी हों, यहाँ आपकी एक जगह है",
      ml: "നിങ്ങൾ എവിടെയായാലും, ഇവിടെ നിങ്ങൾക്ക് ഒരു സീറ്റ് ഉണ്ട്",
      te: "మీరు ఎక్కడైనా ఉన్నా, ఇక్కడ మీకు సీటు ఉంది",
    },
    {
      ta: "நீங்கள் எங்கே இருந்தாலும் — இங்கே உங்களுக்கு ஒரு இடம் ready",
      hi: "आप कहीं भी हों — यहाँ आपकी जगह ready है",
      ml: "നിങ്ങൾ എവിടെയായാലും — ഇവിടെ നിങ്ങൾക്കായി സീറ്റ് ready",
      te: "మీరు ఎక్కడైనా ఉన్నా — ఇక్కడ మీకు సీటు ready",
    }
  ),
  cards: [
    {
      title: L("Join the network", { ta: "வலையில் இணையுங்கள்", hi: "नेटवर्क से जुड़िए" }),
      body: L(
        "New here? Tell us what you love doing — writing, translating, labelling data, building apps — and we'll find you a corner. No PhD required; caring about your language is the only prerequisite.",
        {
          ta: "புதியவரா? உங்களுக்குப் பிடித்ததைச் சொல்லுங்கள் — எழுதுவது, மொழிபெயர்ப்பது, தரவுக்கு விளக்கமிடுவது, செயலிகள் உருவாக்குவது — உங்களுக்கான இடத்தை நாங்கள் காட்டுகிறோம். முனைவர் பட்டம் தேவையில்லை; மொழியின் மீது அக்கறை இருந்தால் போதும்.",
          hi: "नए हैं? बताइए आपको क्या करना पसंद है — लिखना, अनुवाद, डेटा लेबलिंग, ऐप बनाना — हम आपके लिए जगह ढूँढ़ देंगे। PhD की ज़रूरत नहीं; अपनी भाषा की परवाह ही एकमात्र शर्त है।",
        },
        {
          ta: "புதுசா வந்திருக்கீங்களா? உங்களுக்கு என்ன பிடிக்கும் என்று சொல்லுங்கள் — writing, translation, data labelling, app building — உங்களுக்கான இடம் இங்கே இருக்கு. PhD தேவையில்லை; மொழி மேல் love இருந்தால் போதும்.",
          hi: "नए आए हैं? बताइए क्या पसंद है — writing, translation, data labelling, app building — आपकी जगह यहीं है। PhD नहीं चाहिए; भाषा से love ही काफ़ी है।",
        }
      ),
      href: "/onboarding",
      label: "/onboarding →",
      external: false,
    },
    {
      title: L("Discord", { ta: "Discord", hi: "Discord" }),
      body: L(
        "This is where we hang out every day — builders arguing about tokenizers, teachers sharing worksheets, poets testing the model's taste. Drop in and say vanakkam.",
        {
          ta: "நாங்கள் தினமும் கூடும் இடம் இதுதான் — டோக்கனைசர் பற்றி விவாதிக்கும் உருவாக்குநர்கள், பயிற்சித்தாள் பகிரும் ஆசிரியர்கள், மாதிரியின் ரசனையைச் சோதிக்கும் கவிஞர்கள். வந்து ஒரு வணக்கம் சொல்லுங்கள்.",
          hi: "यहीं हम रोज़ मिलते हैं — टोकनाइज़र पर बहस करते बिल्डर, वर्कशीट बाँटते शिक्षक, मॉडल की रुचि परखते कवि। आइए और एक नमस्ते कह जाइए।",
        },
        {
          ta: "இங்கேதான் நாங்கள் daily hang out ஆகிறோம் — tokenizer பற்றி debate, model-க்கு poetry test, எல்லாம் நடக்கும். வந்து ஒரு வணக்கம் சொல்லுங்க.",
          hi: "यहीं हम daily hang out करते हैं — tokenizer पर debate, model का poetry test, सब चलता है। आकर एक नमस्ते कह जाइए।",
        }
      ),
      href: "https://discord.gg/yazhi",
      label: "discord.gg/yazhi →",
      external: true,
    },
    {
      title: L("GitHub", { ta: "GitHub", hi: "GitHub" }),
      body: L(
        "Everything we make lives in the open — model weights, training recipes, eval suites, even this website. Star it, fork it, file an issue; it's yours too.",
        {
          ta: "நாங்கள் உருவாக்கும் அனைத்தும் திறந்தவெளியில் — மாதிரி எடைகள், பயிற்சி முறைகள், மதிப்பீட்டுத் தொகுப்புகள், இந்த இணையதளமும் கூட. நட்சத்திரமிடுங்கள், பிரித்தெடுங்கள், பிழை சொல்லுங்கள் — இது உங்களுடையதும் தான்.",
          hi: "हम जो भी बनाते हैं, खुले में रहता है — मॉडल वेट्स, ट्रेनिंग रेसिपी, इवैल सूट, यह वेबसाइट भी। स्टार कीजिए, फ़ोर्क कीजिए, इशू डालिए — यह आपका भी है।",
        },
        {
          ta: "நாங்கள் செய்வது எல்லாமே open-ல தான் — model weights, training recipes, eval suites, இந்த website கூட. Star பண்ணுங்க, fork பண்ணுங்க, issue போடுங்க — இது உங்களுடையதும் தான்.",
          hi: "हम जो बनाते हैं सब open में है — model weights, training recipes, eval suites, यह website भी। Star कीजिए, fork कीजिए, issue डालिए — यह आपका भी है।",
        }
      ),
      href: "https://github.com/yazhi-lem",
      label: "github.com/yazhi-lem →",
      external: true,
    },
  ],
};

export const SERVICES: { label: LText }[] = [
  { label: L("Agents", { ta: "முகவர்கள்", hi: "एजेंट", ml: "ഏജന്റ്‌സ്", te: "ఏజెంట్‌లు" }) },
  { label: L("Applications", { ta: "செயலிகள்", hi: "ऐप्स", ml: "ആപ്ലിക്കേഷനുകൾ", te: "అప్లికేషన్‌లు" }) },
  { label: L("Annotations", { ta: "விளக్கங்கள்", hi: "एनोटेशन", ml: "അനോടേഷനുകൾ", te: "వ్యాఖ్యానాలు" }) },
];

export const LINKS = {
  discord: "https://discord.gg/yazhi",
  github: "https://github.com/yazhi-lem",
  adhanRepo: "https://github.com/yazhi-lem/adhan",
  whatsapp: "https://chat.whatsapp.com/G0sWRof4Z4cFXXY6Gmavmu",
  onboarding: "/onboarding",
};

export const NAV_GROUPS: { label: LText; items: { label: LText; href: string }[] }[] = [
  {
    label: L("Projects", { ta: "திட்டங்கள்", hi: "प्रोजेक्ट", ml: "പദ്ധതികൾ", te: "ప్రాజెక్టులు" }),
    items: [
      { label: L("Adhan", { ta: "அதன்", hi: "अदन", ml: "അതൻ", te: "అదన్" }), href: "#adhan" },
      { label: L("Sangam", { ta: "சங்கம்", hi: "संगम", ml: "സങ്കം", te: "సంగం" }), href: "#sangam" },
      { label: L("Yazh", { ta: "யாழ்", hi: "यज़", ml: "യാഴ്", te: "యాఴ్" }), href: "#guardian" },
    ],
  },
  {
    label: L("Services", { ta: "சேவைகள்", hi: "सेवाएँ", ml: "സേവനങ്ങൾ", te: "సేవలు" }),
    items: [
      { label: L("Agents", { ta: "முகவர்கள்", hi: "एजेंट", ml: "ഏജന്റ്‌സ്", te: "ఏజెంట్‌లు" }), href: "#services" },
      { label: L("Applications", { ta: "செயலிகள்", hi: "ऐप्स", ml: "ആപ്ലിക്കേഷനുകൾ", te: "అప్లికేషన్‌లు" }), href: "#services" },
      { label: L("Annotations", { ta: "விளక்கங்கள்", hi: "एनोटेशन", ml: "അനോടേഷനുകൾ", te: "వ్యాఖ్యానాలు" }), href: "#services" },
    ],
  },
  {
    label: L("Community", { ta: "சமூகம்", hi: "समुदाय", ml: "സമൂഹം", te: "సమాజం" }),
    items: [
      { label: L("Join the network", { ta: "வலையில் இணை", hi: "नेटवर्क से जुड़ें", ml: "നെറ്റ്‌വർക്കിൽ ചേരുക", te: "నెట్‌వర్క్‌లో చేరండి" }), href: "/onboarding" },
      { label: L("Discord", { ta: "Discord", hi: "Discord", ml: "Discord", te: "Discord" }), href: LINKS.discord },
      { label: L("GitHub", { ta: "GitHub", hi: "GitHub", ml: "GitHub", te: "GitHub" }), href: LINKS.github },
    ],
  },
];

/* ---- short chrome labels ---- */
export const UI = {
  oneModel: L("One model", { ta: "ஒரே மாதிரி", hi: "एक ही मॉडल", ml: "ഒരേ മാതൃക", te: "ఒకే మోడల్" }),
  comingSoon: L(
    "cooking — coming soon",
    { ta: "சமைத்துக்கொண்டிருக்கிறோம் — விரைவில்", hi: "बन रहा है — जल्द ही", ml: "പാചകം ചെയ്യുന്നുണ്ട് — നിക്കൽ ചൈതന്യം", te: "ఆ రోజు విధానం ఉంటుంది — త్వరలో" },
    { ta: "சமைச்சிட்டு இருக்கோம் — coming soon!", hi: "बन रहा है — coming soon!", ml: "സജ്ജമാണ് — coming soon!", te: "తయారు చేస్తుంటున్నాము — coming soon!" }
  ),
  servicesLabel: L("Services", { ta: "சேவைகள்", hi: "सेवाएँ", ml: "സേവനങ്ങൾ", te: "సేవలు" }),
  thinaiCol: L("Thinai", { ta: "திணை", hi: "तिणै", ml: "തിണൈ", te: "తిణై" }),
  landscapeCol: L("Landscape", { ta: "நிலம்", hi: "परिदृश्य", ml: "ഭൂപ്രകൃതി", te: "ల్యాండ్‌స్కేప్" }),
  poeticCol: L("What it stands for", { ta: "உரிப్పொருள്", hi: "भाव", ml: "അതു പ്രതിനിധാനം ചെയ്യുന്നത്", te: "ఇది పోలుస్తుంది" }),
  awakening: L(
    "Yazhi awakens in…",
    { ta: "யாழி விழிக்க இன்னும်…", hi: "Yazhi के जागने में…", ml: "യാഴ് ജാഗരണം ചെയ്യാൻ...", te: "యాఴ్ మేల్కోందాం..." },
    { ta: "யாழி awakening in…", hi: "Yazhi awakening in…", ml: "യാഴ് awakening in…", te: "Yazh awakening in…" }
  ),
};
