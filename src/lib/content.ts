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
    name: L("Kurinji", { ta: "குறிஞ்சி", hi: "कुरिंजी" }),
    landscape: L("Mountains", { ta: "மலை", hi: "पहाड़" }),
    poetic: L("Union — first love in the hills", { ta: "புணர்தல் — மலையில் மலரும் முதல் காதல்", hi: "मिलन — पहाड़ों में पहला प्यार" }),
  },
  {
    key: "mullai", icon: "🌳", ta: "முல்லை", en: "Mullai", section: "adhan",
    name: L("Mullai", { ta: "முல்லை", hi: "मुल्लै" }),
    landscape: L("Forest", { ta: "காடு", hi: "जंगल" }),
    poetic: L("Patient waiting — love that trusts", { ta: "இருத்தல் — நம்பிக்கையோடு காத்திருத்தல்", hi: "धैर्य से प्रतीक्षा — भरोसे वाला प्रेम" }),
  },
  {
    key: "marutham", icon: "🌾", ta: "மருதம்", en: "Marutham", section: "sangam",
    name: L("Marutham", { ta: "மருதம்", hi: "मरुदम" }),
    landscape: L("Farmland", { ta: "வயல்", hi: "खेत" }),
    poetic: L("Lovers' quarrels — and making up", { ta: "ஊடல் — பிணக்கும் சமாதானமும்", hi: "रूठना-मनाना — प्रेमियों की नोकझोंक" }),
  },
  {
    key: "palai", icon: "🏜️", ta: "பாலை", en: "Palai", section: "guardian",
    name: L("Palai", { ta: "பாலை", hi: "पालै" }),
    landscape: L("Desert", { ta: "பாலைவனம்", hi: "रेगिस्तान" }),
    poetic: L("Hardship endured — the long crossing", { ta: "பிரிதல் — கடத்தலின் துயரம்", hi: "कठिन डगर — लंबा सफ़र" }),
  },
  {
    key: "neytal", icon: "🌊", ta: "நெய்தல்", en: "Neytal", section: "community",
    name: L("Neytal", { ta: "நெய்தல்", hi: "नेय्दल" }),
    landscape: L("Seashore", { ta: "கடற்கரை", hi: "समुद्र-तट" }),
    poetic: L("Longing across the water", { ta: "இரங்கல் — கடல் தாண்டிய ஏக்கம்", hi: "विरह — पानी के पार की तड़प" }),
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
    },
    {
      ta: "AI that speaks உங்கள் மொழி",
      hi: "AI that speaks आपकी भाषा",
    }
  ),

  /** The hero sub — the whole pitch in three sentences. */
  full: L(
    "Ask it anything in Tamil, Hindi, Bengali, Telugu — any of 22+ Indian languages. It answers the way a friend would: in your words, with your context. Built in India, owned by its people.",
    {
      ta: "தமிழ், இந்தி, வங்காளம், தெலுங்கு — 22+ இந்திய மொழிகளில் எதிலும் கேளுங்கள். ஒரு நண்பர் பதில் சொல்வது போல் — உங்கள் சொற்களில், உங்கள் சூழலில் — பதில் கிடைக்கும். இந்தியாவில் உருவானது; நம் மக்களுக்கே சொந்தம்.",
      hi: "तमिल, हिन्दी, बांग्ला, तेलुगु — 22+ भारतीय भाषाओं में कुछ भी पूछिए। जवाब ऐसे मिलेगा जैसे कोई दोस्त दे रहा हो — आपके शब्दों में, आपके संदर्भ के साथ। भारत में बना, अपने लोगों का अपना।",
    },
    {
      ta: "Start in English, தமிழில் முடியுங்கள் — நடுவில் மொழி மாறினாலும் புரிந்துகொள்ளும். It's AI that code-switches, நம்மைப் போலவே.",
      hi: "Start in English, हिन्दी में ख़त्म कीजिए — बीच में भाषा बदल भी जाए तो समझ जाएगी। It's AI that code-switches, बिल्कुल हमारी तरह।",
    }
  ),

  /** Footer sign-off. */
  footer: L(
    "Made with care, in our own languages.",
    {
      ta: "நம் சொந்த மொழிகளில், அக்கறையுடன் உருவாக்கியது.",
      hi: "अपनी भाषाओं में, पूरे मन से बनाया हुआ।",
    },
    {
      ta: "Made with care — நம் மொழிகளில், நமக்காக.",
      hi: "Made with care — हमारी भाषाओं में, हमारे लिए।",
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
    },
    {
      ta: "Kurinji · மலை — every journey starts with ஒரு வணக்கம்",
      hi: "Kurinji · पहाड़ — every journey starts with एक नमस्ते",
    }
  ),
  scrollCue: L(
    "come, scroll with us",
    { ta: "வாங்க, கீழே போகலாம்", hi: "आइए, नीचे चलें" },
    { ta: "வாங்க — scroll பண்ணலாம்", hi: "आइए — scroll करते हैं" }
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
    }
  ),
  intro: L(
    "Why build all of this? Bharathiyar answered a century ago:",
    {
      ta: "இதெல்லாம் எதற்காக? நூறு ஆண்டுகளுக்கு முன்பே பாரதியார் பதில் சொல்லிவிட்டார்:",
      hi: "यह सब किसलिए? भारतीयार ने सौ साल पहले ही जवाब दे दिया था:",
    },
    {
      ta: "Why build all this? பாரதியார் அன்றே சொல்லிவிட்டார்:",
      hi: "Why build all this? भारतीयार सौ साल पहले ही बता गए:",
    }
  ),
  attribution: L("Bharathiyar", { ta: "பாரதியார்", hi: "भारतीयार" }),
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
  { value: "7B", label: L("parameters", { ta: "அளவுருக்கள்", hi: "पैरामीटर" }) },
  { value: "22+", label: L("Indian languages", { ta: "இந்திய மொழிகள்", hi: "भारतीय भाषाएँ" }) },
  { value: "3", label: L("projects", { ta: "திட்டங்கள்", hi: "प्रोजेक्ट" }) },
];

/* ---------------- Adhan — the model ---------------- */

export const ADHAN = {
  nameTa: "அதன்",
  nameEn: "Adhan",
  name: L("Adhan", { ta: "அதன்", hi: "अदन" }),
  eyebrow: L(
    "Mullai · the forest — good things grow slowly",
    {
      ta: "முல்லை · காடு — நல்லவை நிதானமாக வளரும்",
      hi: "मुल्लै · जंगल — अच्छी चीज़ें धीरे-धीरे बढ़ती हैं",
    },
    {
      ta: "Mullai · காடு — good things நிதானமாக வளரும்",
      hi: "Mullai · जंगल — good things धीरे-धीरे बढ़ती हैं",
    }
  ),
  sub: L(
    "One model that grew up speaking 22+ languages",
    {
      ta: "22+ மொழிகள் பேசி வளர்ந்த ஒரே மாதிரி",
      hi: "22+ भाषाएँ बोलते हुए बड़ा हुआ एक ही मॉडल",
    },
    {
      ta: "ஒரே model — ஆனால் 22+ மொழிகள் பேசி வளர்ந்தது",
      hi: "एक ही model — लेकिन 22+ भाषाएँ बोलते हुए बड़ा हुआ",
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
    { value: "7B", label: L("parameters", { ta: "அளவுருக்கள்", hi: "पैरामीटर" }) },
    { value: "22+", label: L("languages", { ta: "மொழிகள்", hi: "भाषाएँ" }) },
    { value: "100%", label: L("open, Indian-built", { ta: "திறந்த, இந்திய உருவாக்கம்", hi: "खुला, भारत में बना" }) },
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
    { ta: "GitHub-இல் போய் பாருங்கள் →", hi: "GitHub पर देखिए →" },
    { ta: "GitHub-ல போய் பாருங்க →", hi: "GitHub पर जाकर देखिए →" }
  ),
  ctaHref: "https://github.com/yazhi-lem/adhan",
};

/* ---------------- Sangam — the literature companion ---------------- */

export const SANGAM = {
  nameTa: "சங்கம்",
  nameEn: "Sangam",
  name: L("Sangam", { ta: "சங்கம்", hi: "संगम" }),
  eyebrow: L(
    "Marutham · the farmland — where stories are harvested",
    {
      ta: "மருதம் · வயல் — கதைகள் அறுவடையாகும் இடம்",
      hi: "मरुदम · खेत — जहाँ कहानियों की फ़सल कटती है",
    },
    {
      ta: "Marutham · வயல் — stories அறுவடையாகும் இடம்",
      hi: "Marutham · खेत — जहाँ stories की फ़सल कटती है",
    }
  ),
  sub: L(
    "Two thousand years of Tamil poetry, one curious companion",
    {
      ta: "இரண்டாயிரம் ஆண்டுத் தமிழ்க் கவிதை, உடன் வரும் ஒரு துணை",
      hi: "दो हज़ार साल की तमिल कविता, साथ चलने वाला एक साथी",
    },
    {
      ta: "2000 வருடங்களின் Tamil poetry — உங்களுடன் ஒரு companion",
      hi: "2000 साल की Tamil poetry — आपके साथ एक companion",
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
        { ta: "சேர்ந்து பாடல் படிப்போம்", hi: "साथ मिलकर कविता पढ़ें" },
        { ta: "பாடலை together படிப்போம்", hi: "कविता together पढ़ेंगे" }
      ),
    },
    {
      icon: "🏞️",
      label: L(
        "Which landscape is this?",
        { ta: "இது எந்தத் திணை?", hi: "यह कौन-सा परिदृश्य है?" },
        { ta: "இது which thinai?", hi: "यह which landscape?" }
      ),
    },
    {
      icon: "📖",
      label: L(
        "How the language works",
        { ta: "மொழி எப்படி இயங்குகிறது", hi: "भाषा कैसे काम करती है" },
        { ta: "மொழி எப்படி work ஆகிறது", hi: "भाषा कैसे work करती है" }
      ),
    },
  ],
  cta: L(
    "Wander in →",
    { ta: "உள்ளே வாருங்கள் →", hi: "अंदर आइए →" },
    { ta: "உள்ள வாங்க →", hi: "अंदर आ जाइए →" }
  ),
  ctaHref: "https://sangam.yazhi.dev",
};

/* ---------------- Yazh — the guardian ---------------- */

export const GUARDIAN = {
  nameTa: "யாழ்",
  nameEn: "Yazh Guardian",
  name: L("Yazh Guardian", { ta: "யாழ்", hi: "यज़ गार्डियन" }),
  eyebrow: L(
    "Palai · the desert — someone has to guard the crossing",
    {
      ta: "பாலை · பாலைவனம் — கடப்பவர்களைக் காக்க ஒருவர் வேண்டும்",
      hi: "पालै · रेगिस्तान — राह की रखवाली किसी को तो करनी है",
    },
    {
      ta: "Palai · பாலைவனம் — someone has to காவல் நிற்க",
      hi: "Palai · रेगिस्तान — someone has to पहरा देना",
    }
  ),
  sub: L(
    "The temple guardian, now on duty for your digital heritage",
    {
      ta: "கோயில் காவலன் — இப்போது உங்கள் எண்ணிம மரபுக்குக் காவல்",
      hi: "मंदिर का रक्षक — अब आपकी डिजिटल विरासत की पहरेदारी पर",
    },
    {
      ta: "கோயில் காவலன் — இப்போது உங்கள் digital heritage-க்கு duty-ல",
      hi: "मंदिर का रक्षक — अब आपकी digital heritage की duty पर",
    }
  ),
  body: L(
    "Walk into any old Tamil temple and look up at the pillars: there's a yazhi — part lion, part elephant, all guardian — carved there to watch over what's precious. Yazh is that instinct, written in software. It keeps watch over the community's digital heritage — manuscripts, recordings, datasets, memories — and makes sure they stay open to the people they belong to. Come in; it walks beside you.",
    {
      ta: "எந்தப் பழைய கோயிலுக்குச் சென்றாலும் தூண்களை நிமிர்ந்து பாருங்கள்: அங்கே ஒரு யாழி — பாதி சிங்கம், பாதி யானை, முழுக்கக் காவலன் — விலைமதிப்பற்றவற்றைக் காக்கச் செதுக்கப்பட்டிருக்கும். அந்த உள்ளுணர்வின் மென்பொருள் வடிவமே யாழ். சமூகத்தின் எண்ணிம மரபை — சுவடிகள், பதிவுகள், தரவுத்தொகுப்புகள், நினைவுகள் — கண்ணிமைக்காமல் காக்கிறது; அவை உரியவர்களுக்கே திறந்திருக்கும்படி பார்த்துக்கொள்கிறது. உள்ளே வாருங்கள்; உங்களுடன் நடக்கும்.",
      hi: "किसी भी पुराने तमिल मंदिर में जाकर खंभों की ओर देखिए: वहाँ एक याऴी मिलेगा — आधा शेर, आधा हाथी, पूरा रक्षक — जो क़ीमती चीज़ों की रखवाली के लिए तराशा गया है। यज़ — वही प्रवृत्ति, सॉफ़्टवेयर में। यह समुदाय की डिजिटल विरासत — पांडुलिपियाँ, रिकॉर्डिंग, डेटासेट, यादें — पर नज़र रखता है, और यह पक्का करता है कि वे उन्हीं लोगों के लिए खुली रहें जिनकी वे हैं। अंदर आइए; यह आपके साथ-साथ चलता है।",
    },
    {
      ta: "பழைய கோயிலில் pillar-ஐப் பாருங்கள் — அங்கே ஒரு யாழி இருக்கும்: half lion, half elephant, full-time காவலன். Yazh அதே வேலையை software-ஆகச் செய்கிறது — நம் texts, recordings, datasets எல்லாவற்றையும் காத்து நிற்கிறது. Join செய்யுங்கள்; உங்களுடனே நடக்கும்.",
      hi: "पुराने मंदिर में pillar देखिए — वहाँ एक याऴी मिलेगा: half lion, half elephant, full-time रक्षक। Yazh वही काम software में करता है — हमारे texts, recordings, datasets सबकी रखवाली। Join कीजिए; आपके साथ-साथ चलेगा।",
    }
  ),
  cta: L(
    "Walk with the guardian",
    { ta: "வாருங்கள், தொடங்கலாம்", hi: "आइए, शुरू करें" },
    { ta: "வாங்க, start பண்ணலாம்", hi: "आइए, start करते हैं" }
  ),
  ctaHref: "/onboarding",
};

/* ---------------- Community ---------------- */

export const COMMUNITY = {
  title: L("Community", { ta: "சமூகம்", hi: "समुदाय" }),
  eyebrow: L(
    "Neytal · the seashore — the sea took us far; the net brings us home",
    {
      ta: "நெய்தல் · கடற்கரை — கடல் நம்மைத் தொலைவில் கொண்டு சென்றது; வலை வீட்டுக்குக் கொண்டு வருகிறது",
      hi: "नेय्दल · समुद्र-तट — समुद्र हमें दूर ले गया; नेटवर्क घर ले आता है",
    },
    {
      ta: "Neytal · கடற்கரை — the sea took us far; வலை நம்மை வீட்டுக்குக் கொண்டு வரும்",
      hi: "Neytal · समुद्र-तट — the sea took us far; network हमें घर ले आता है",
    }
  ),
  sub: L(
    "Wherever you are, there's a seat here for you",
    {
      ta: "நீங்கள் எங்கிருந்தாலும், இங்கே உங்களுக்கு ஓர் இடம் உண்டு",
      hi: "आप जहाँ भी हों, यहाँ आपकी एक जगह है",
    },
    {
      ta: "நீங்கள் எங்கே இருந்தாலும் — இங்கே உங்களுக்கு ஒரு இடம் ready",
      hi: "आप कहीं भी हों — यहाँ आपकी जगह ready है",
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
  { label: L("Agents", { ta: "முகவர்கள்", hi: "एजेंट" }) },
  { label: L("Applications", { ta: "செயலிகள்", hi: "ऐप्स" }) },
  { label: L("Annotations", { ta: "விளக்கங்கள்", hi: "एनोटेशन" }) },
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
    label: L("Projects", { ta: "திட்டங்கள்", hi: "प्रोजेक्ट" }),
    items: [
      { label: L("Adhan", { ta: "அதன்", hi: "अदन" }), href: "#adhan" },
      { label: L("Sangam", { ta: "சங்கம்", hi: "संगम" }), href: "#sangam" },
      { label: L("Yazh", { ta: "யாழ்", hi: "यज़" }), href: "#guardian" },
    ],
  },
  {
    label: L("Services", { ta: "சேவைகள்", hi: "सेवाएँ" }),
    items: [
      { label: L("Agents", { ta: "முகவர்கள்", hi: "एजेंट" }), href: "#services" },
      { label: L("Applications", { ta: "செயலிகள்", hi: "ऐप्स" }), href: "#services" },
      { label: L("Annotations", { ta: "விளக்கங்கள்", hi: "एनोटेशन" }), href: "#services" },
    ],
  },
  {
    label: L("Community", { ta: "சமூகம்", hi: "समुदाय" }),
    items: [
      { label: L("Join the network", { ta: "வலையில் இணை", hi: "नेटवर्क से जुड़ें" }), href: "/onboarding" },
      { label: L("Discord", { ta: "Discord", hi: "Discord" }), href: LINKS.discord },
      { label: L("GitHub", { ta: "GitHub", hi: "GitHub" }), href: LINKS.github },
    ],
  },
];

/* ---- short chrome labels ---- */
export const UI = {
  oneModel: L("One model", { ta: "ஒரே மாதிரி", hi: "एक ही मॉडल" }),
  comingSoon: L(
    "cooking — coming soon",
    { ta: "சமைத்துக்கொண்டிருக்கிறோம் — விரைவில்", hi: "बन रहा है — जल्द ही" },
    { ta: "சமைச்சிட்டு இருக்கோம் — coming soon!", hi: "बन रहा है — coming soon!" }
  ),
  servicesLabel: L("Services", { ta: "சேவைகள்", hi: "सेवाएँ" }),
  thinaiCol: L("Thinai", { ta: "திணை", hi: "तिणै" }),
  landscapeCol: L("Landscape", { ta: "நிலம்", hi: "परिदृश्य" }),
  poeticCol: L("What it stands for", { ta: "உரிப்பொருள்", hi: "भाव" }),
  awakening: L(
    "Yazhi awakens in…",
    { ta: "யாழி விழிக்க இன்னும்…", hi: "Yazhi के जागने में…" },
    { ta: "யாழி awakening in…", hi: "Yazhi awakening in…" }
  ),
};
