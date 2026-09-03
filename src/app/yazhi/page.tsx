"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Types
type LanguageCode = "ta" | "en" | "hi" | "te" | "kn" | "ml" | "bn";

interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flag: string;
}

interface DomainInfo {
  id: string;
  icon: string;
  key: string; // matches thinai key
  color: string; // tailwind color class prefix or hex
  accentHex: string;
  taName: string;
  enName: string;
  taDesc: string;
  enDesc: string;
  welcomeMessages: Record<LanguageCode, string>;
  suggestions: Partial<Record<LanguageCode, { label: string; text: string }[]>>;
  mockReplies?: Partial<Record<LanguageCode, Record<string, string>>>;
  fallbackReplies: Partial<Record<LanguageCode, string[]>>;
}

// Available Languages
const LANGUAGES: LanguageInfo[] = [
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil", flag: "🛕" },
  { code: "en", nativeName: "English", englishName: "English", flag: "🇬🇧" },
  { code: "hi", nativeName: "हिन्दी", englishName: "Hindi", flag: "🇮🇳" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu", flag: "🌾" },
  { code: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada", flag: "⛰️" },
  { code: "ml", nativeName: "മലയാളം", englishName: "Malayalam", flag: "🌴" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali", flag: "🐅" },
];

// 5 Thinai Domain Agents
const DOMAINS: DomainInfo[] = [
  {
    id: "marutham_agri",
    key: "marutham",
    icon: "🌾",
    color: "emerald",
    accentHex: "#4f9d6b",
    taName: "மருதம் வேளாண் முகவர்",
    enName: "Marutham Agricultural Advisor",
    taDesc: "விவசாய நுட்பங்கள், மண் வளம், ஆற்றுப்படுகை நீர்ப்பாசனம் மற்றும் பாரம்பரிய உழவு முறைகள்.",
    enDesc: "Precision farming, soil science, river-basin irrigation, and ancient Tamil agrarian wisdom.",
    welcomeMessages: {
      ta: "வணக்கம்! மருதம் வேளாண் முகவர் உங்களை வரவேற்கிறது. வேளாண்மை, மண் வளம், பயிர் பாதுகாப்பு மற்றும் நீர்ப்பாசனம் குறித்த விபரங்களைக் கேளுங்கள்.",
      en: "Greetings! I am the Marutham Agricultural Advisor. How can I assist you today with crop selection, organic farming, soil diagnostics, or modern precision irrigation?",
      hi: "नमस्ते! मरुतम कृषि सलाहकार में आपका स्वागत है। आज मैं फसलों, मिट्टी की गुणवत्ता और टिकाऊ कृषि तकनीकों के बारे में आपकी क्या मदद कर सकता हूँ?",
      te: "నమస్కారం! మరుతం వ్యవసాయ సలహాదారునికి స్వాగతం. పంటలు, నేల రకాలు మరియు ఆధునిక వ్యవసాయ పద్ధతుల గురించి మీకు ఏమి సహాయం కావాలి?",
      kn: "ನಮಸ್ಕಾರ! ಮರುತಮ್ ಕೃಷಿ ಸಲಹೆಗಾರರಿಗೆ ಸುಸ್ವಾಗತ. ಬೆಳೆಗಳು, ಮಣ್ಣಿನ ಗುಣಮಟ್ಟ ಮತ್ತು ಸುಸ್ಥಿರ ಕೃಷಿ ಪದ್ಧತಿಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
      ml: "നമസ്കാരം! മരുതം കാർഷിക ഉപദേശകനിലേക്ക് സ്വാഗതം. കൃഷി രീതികൾ, മണ്ണ് പരിശോധന, ജലസേചനം എന്നിവയെക്കുറിച്ച് എന്താണ് അറിയേണ്ടത്?",
      bn: "নমস্কার! মরুথাম কৃষি উপদেষ্টার কাছে আপনাকে স্বাগত। আজ ফসল, মাটি এবং আধুনিক চাষাবাদ সম্পর্কে কীভাবে আপনাকে সাহায্য করতে পারি?"
    },
    suggestions: {
      ta: [
        { label: "நெல் சாகுபடி மண்", text: "நெல் சாகுபடிக்கு ஏற்ற மண் எது? மருத நிலத்தின் ஆற்றுப் படுகை எவ்வாறு அதற்கு உதவுகிறது?" },
        { label: "குறைந்த நீர் பயிர்கள்", text: "மழைப்பொழிவு குறைவாக உள்ள காலங்களில் எந்த வகையான சிறுதானியப் பயிர்களை நடலாம்?" },
        { label: "இயற்கை பூச்சி விரட்டி", text: "வேப்பம்பண்ணாக்கு மற்றும் இயற்கை மூலிகைகளைக் கொண்டு பூச்சி விரட்டி தயாரிப்பது எப்படி?" }
      ],
      en: [
        { label: "Best soil for Paddy", text: "What are the soil requirements for paddy cultivation, and how does river-basin soil help?" },
        { label: "Drought-resistant crops", text: "Which millets and pulses can be grown in low rainfall conditions?" },
        { label: "Organic pest control", text: "How do I formulate a botanical pest repellent using neem and native herbs?" }
      ],
      hi: [
        { label: "धान के लिए मिट्टी", text: "धान की खेती के लिए सबसे उपयुक्त मिट्टी कौन सी है और इसे कैसे तैयार करें?" },
        { label: "कम पानी की फसलें", text: "कम वर्षा वाले क्षेत्रों में कौन सी दालें या बाजरा उगाया जा सकता है?" }
      ],
      te: [
        { label: "వరి పంటకు నేల", text: "వరి పంట సాగుకు ఎటువంటి నేలలు అనుకూలం?" },
        { label: "తక్కువ నీటి పంటలు", text: "తక్కువ వర్షపాతంలో పండించగల చిరుధాన్యాలు ఏమిటి?" }
      ],
      kn: [
        { label: "ಭತ್ತದ ಕೃಷಿಗೆ ಮಣ್ಣು", text: "ಭತ್ತದ ಕೃಷಿಗೆ ಯಾವ ರೀತಿಯ ಮಣ್ಣು ಸೂಕ್ತವಾಗಿದೆ?" },
        { label: "ಕಡಿಮೆ ನೀರಿನ ಬೆಳೆಗಳು", text: "ಕಡಿಮೆ ಮಳೆಯಲ್ಲಿ ಬೆಳೆಯಬಹುದಾದ ಸಿರಿಧಾನ್ಯಗಳು ಯಾವುವು?" }
      ],
      ml: [
        { label: "നെൽകൃഷിക്ക് മണ്ണ്", text: "നെൽകൃഷിക്ക് ഏറ്റവും അനുയോജ്യമായ മണ്ണ് ഏതാണ്?" },
        { label: "വരൾച്ചാ പ്രതിരോധ വിളകൾ", text: "കുറഞ്ഞ മഴയിൽ കൃഷി ചെയ്യാൻ പറ്റിയ വിളകൾ ഏവ?" }
      ],
      bn: [
        { label: "ধান চাষের মাটি", text: "ধান চাষের জন্য কোন মাটি সবচেয়ে উপযোগী এবং নদী অববাহিকার মাটি কেন সেরা?" },
        { label: "স্বল্প জলের ফসল", text: "কম বৃষ্টিপাতের সময়ে কোন ধরনের দানাশস্য চাষ করা যায়?" }
      ]
    },
    mockReplies: {
      ta: {
        "நெல் சாகுபடிக்கு ஏற்ற மண் எது? மருத நிலத்தின் ஆற்றுப் படுகை எவ்வாறு அதற்கு உதவுகிறது?": "நெல் சாகுபடிக்கு நீரைத் தக்கவைத்துக்கொள்ளும் களிமண் மற்றும் வண்டல் மண் (Alluvial Soil) மிகவும் உகந்தது.\n\nமருத நிலத்தின் சிறப்பு என்னவென்றால், ஆறுகளால் அடித்து வரப்படும் வளமான ஆற்றுப் படுகை வண்டல் மண் இயற்கையாகவே நைதரசன் (Nitrogen) மற்றும் தாது உப்புக்களைக் கொண்டுள்ளது. இது பயிர்களின் வேர்கள் ஆழமாக ஊன்றி வளரவும், ஈரப்பதத்தை நீண்ட நாட்கள் தக்கவைக்கவும் உதவுகிறது. இதனால் நெற்பயிர் செழித்து வளர்ந்து அதிக மகசூல் தருகிறது.",
        "மழைப்பொழிவு குறைவாக உள்ள காலங்களில் எந்த வகையான சிறுதானியப் பயிர்களை நடலாம்?": "மழைப்பொழிவு குறைவாக உள்ள வறட்சி காலங்களில் நாம் 'புறம்' மற்றும் 'முல்லை' நிலப் பண்புகளோடு ஒத்துப் போகும் வறட்சி தாங்கும் பயிர்களைத் தேர்ந்தெடுக்க வேண்டும்:\n\n1. **சிறுதானியங்கள் (Millets):** கம்பு, சோளம், சாமை, வரகு, மற்றும் குதிரைவாலி. இவை மிகக் குறைந்த நீரில் 70 முதல் 90 நாட்களில் விளையக்கூடியவை.\n2. **பருப்பு வகைகள்:** உளுந்து, தட்டைப்பயறு, மற்றும் கொண்டைக்கடலை. இவை வளிமண்டல நைட்ரஜனை மண்ணில் நிலைநிறுத்தி மண் வளத்தையும் பெருக்கும்.\n3. **எண்ணெய் வித்துக்கள்:** எள் மற்றும் நிலக்கடலை.\n\nஇவை தண்ணீர்ப் பற்றாக்குறையைத் தாங்கி உழவர்களுக்குக் கை கொடுக்கும்.",
        "வேப்பம்பண்ணாக்கு மற்றும் இயற்கை மூலிகைகளைக் கொண்டு பூச்சி விரட்டி தயாரிப்பது எப்படி?": "இயற்கையான முறையில் பயிர்களைக் காக்க 'ஐந்திலை கரைசல்' சிறந்த பூச்சி விரட்டியாகும். இதை தயாரிக்கும் முறை:\n\n1. **தேவையானவை:** வேப்ப இலை, நொச்சி இலை, எருக்கன் இலை, ஆடாதொடை இலை, புங்கன் இலை (ஆடுக மாடுகள் தின்னாத இலைகள்).\n2. **செய்முறை:** சம அளவு இலைகளை நசுக்கி, மாட்டுச் சாணம் மற்றும் கோமியத்துடன் கலந்து மண் பானையில் 15 நாட்கள் ஊற வைக்கவும். தினசரி ஒருமுறை கலக்கி விட வேண்டும்.\n3. **பயன்பாடு:** 15 நாட்களுக்குப் பின், கரைசலை வடிகட்டி, 1 லிட்டர் கரைசலுக்கு 10 லிட்டர் தண்ணீர் என்ற விகிதத்தில் கலந்து பயிர்களில் தெளிக்க வேண்டும்.\n\nஇது இலைப்பேன், அசுவினி, மற்றும் குருத்துப் பூச்சிகளைத் திறம்பட விரட்டும்."
      },
      en: {
        "What are the soil requirements for paddy cultivation, and how does river-basin soil help?": "Paddy cultivation thrives best in heavy clayey or loamy alluvial soils that have a high water-holding capacity.\n\nIn the classical **Marutham** ecosystem (the fertile river valleys), the annual floods replenish the topsoil with rich river silt. This alluvial soil is naturally rich in vital nutrients like nitrogen, potash, and organic matter. Because clay soils prevent rapid drainage, they maintain the standing water level required for wet paddy cultivation, ensuring robust root systems and high agricultural yields.",
        "Which millets and pulses can be grown in low rainfall conditions?": "Under water-deficient or drought conditions, it is strategic to transition to crops with high drought resilience:\n\n1. **Millets:** Pearl Millet (Kambu), Finger Millet (Ragi), Barnyard Millet (Kuthiraivali), and Sorghum. These require 60-70% less water than paddy and mature within 80 to 100 days.\n2. **Pulses:** Black gram (Uraddal), Cowpea, and Chickpea. Apart from survival, they fix atmospheric nitrogen into the soil, naturalizing fertilizer input.\n3. **Oilseeds:** Sesame (Til) and Groundnut.\n\nThese crops act as excellent climate-resilient buffer systems for farmers.",
        "How do I formulate a botanical pest repellent using neem and native herbs?": "A highly effective organic formulation is the **Five-Leaf Extract (Ainthilai Karaisal)**, a traditional bio-pesticide. Here is the recipe:\n\n1. **Ingredients:** Neem, Calotropis (Erukku), Vitex (Nochi), Adhatoda, and Pongamia leaves (choose non-palatable bitter leaves).\n2. **Process:** Crush equal quantities of these leaves. Mix them with fresh cow dung and cow urine in a clay container. Seal and let it ferment for 12 to 15 days, stirring once daily.\n3. **Application:** Filter the concentrated extract. Dilute 1 liter of this solution with 10 liters of water and spray on the foliage.\n\nThis acts as a powerful deterrent against sucking pests, aphids, and leaf-folders without harming beneficial soil microbes."
      }
    },
    fallbackReplies: {
      ta: [
        "பயிர்களின் வளர்ச்சியை மேம்படுத்த மண்புழு உரம் (Vermicompost) மற்றும் ஜீவாமிர்தம் சிறந்த பலன் தரும். உங்கள் மண்ணின் ஈரப்பதத்தை தொடர்ந்து சோதித்துப் பாருங்கள்.",
        "மருத நிலத்து இயற்கை உழவு முறைகள் மண்ணின் நுண்ணுயிர் பெருக்கத்திற்கு உதவும். இரசாயன உரங்களைத் தவிர்த்து பஞ்சகவ்யா பயன்படுத்துங்கள்.",
        "நீர் மேலாண்மைக்குச் சொட்டுநீர்ப் பாசனம் (Drip Irrigation) அமைப்பதன் மூலம் 50% வரை நீரைச் சேமிக்கலாம், மகசூலும் அதிகரிக்கும்."
      ],
      en: [
        "To optimize crop performance, organic compost like vermicompost combined with Jeevamirtham produces excellent microbial activity in your soil.",
        "Maintaining soil biome through crop rotation and zero-tillage helps retain topsoil moisture and prevent erosion.",
        "Implementing sub-surface drip irrigation is highly recommended for water conservation and targeted nutrient delivery."
      ],
      hi: ["टिकाऊ और जैविक खाद का उपयोग करके आप फसल की पैदावार को 20% तक बढ़ा सकते हैं।", "फसल चक्र (crop rotation) अपनाने से मिट्टी की उर्वरता बनी रहती है।"],
      te: ["పంట మార్పిడి పద్ధతిని పాటించడం వల్ల భూమి సారం దెబ్బతినకుండా ఉంటుంది.", "సేంద్రీయ ఎరువుల వాడకం పంట నాణ్యతను పెంచుతుంది."],
      kn: ["ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಬೆಳೆ ಸರದಿಯನ್ನು ಅನುಸರಿಸಿ.", "ಸಾವಯವ ಗೊಬ್ಬರಗಳು ಮಣ್ಣಿನ ಸೂಕ್ಷ್ಮಜೀವಿಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಆಧಾರವಾಗಿದೆ."],
      ml: ["ജൈവവളങ്ങളുടെ ഉപയോഗം മണ്ണിന്റെ ফലഭൂയിഷ്ഠത നിലനിർത്താൻ സഹായിക്കുന്നു.", "വിളവിപ്ലവത്തിലൂടെ മികച്ച ഉൽപ്പാദനം ഉറപ്പാക്കാം."],
      bn: ["জৈব সার এবং কেঁচো সার মাটির অনুজীব বাড়াতে সাহায্য করে।", "ফসল আবর্তন পদ্ধতি মাটির উর্বরতা রক্ষা করে।"]
    }
  },
  {
    id: "kurinji_poet",
    key: "kurinji",
    icon: "🏔️",
    color: "violet",
    accentHex: "#8b7ae0",
    taName: "குறிஞ்சி சங்க அறிஞர்",
    enName: "Kurinji Sangam Scholar",
    taDesc: "சங்க இலக்கிய ஆய்வு, திணை கவிதைகள், யாப்பிலக்கணம் மற்றும் திராவிட மொழி ஒப்பாய்வு.",
    enDesc: "Classical Tamil grammar, poetic decoding of the five landscapes, and Dravidian historical linguistics.",
    welcomeMessages: {
      ta: "வணக்கம், தமிழ் நெஞ்சே! குறிஞ்சி சங்க அறிஞர் உங்களை வரவேற்கிறது. ஐந்து திணைகளின் உரிப்பொருட்கள், செய்யுள் நயம் மற்றும் தொல்காப்பியக் கோட்பாடுகள் குறித்து உரையாடுவோமா?",
      en: "Vanakkam! I am the Kurinji Sangam Scholar. Step into the ancient academy of poets. Let us decode Sangam landscape symbolism, classical metaphors, or comparative Dravidian etymology.",
      hi: "नमस्ते! कुरिंजी संगम विद्वान के दरबार में स्वागत है। प्राचीन तमिल साहित्य, कविताओं और व्याकरण के बारे में जानने के लिए पूछें।",
      te: "నమస్కారం! కురింజి సంగం పండితుని స్పేస్ స్వాగతం పలుకుతోంది. ప్రాచీన తమిళ సాహిత్యం మరియు కవిత్వం గురించి చర్చించుకుందాం.",
      kn: "ನಮಸ್ಕಾರ! ಕುರಿಂಜಿ ಸಂಗಮ್ ವಿದ್ವಾಂಸರ ಜಗತ್ತಿಗೆ ಸುಸ್ವಾಗತ. ಪ್ರಾಚೀನ ತಮಿಳು ಸಾಹಿತ್ಯ ಮತ್ತು ಕಾವ್ಯದ ಸೌಂದರ್ಯವನ್ನು ಅನ್ವೇಷಿಸೋಣ.",
      ml: "നമസ്കാരം! കുറിഞ്ഞി സംഘം പണ്ഡിതനിലേക്ക് സ്വാഗതം. പുരാതന തമിഴ് സാഹിത്യവും സംഘകാല കവിതകളും നമുക്ക് ഒന്നിച്ച് വായിക്കാം.",
      bn: "নমস্কার! কুরিঞ্জি সঙ্গম পন্ডিতের জ্ঞানলোকে স্বাগত। প্রাচীন তামিল সাহিত্য, কবিতা এবং ভাষার উৎস সম্পর্কে জানতে প্রশ্ন করুন।"
    },
    suggestions: {
      ta: [
        { label: "குறிஞ்சி நிலத் தத்துவம்", text: "குறிஞ்சி நிலத்தின் பின்னணியில் 'புணர்தலும் புணர்தல் நிமித்தமும்' எவ்வாறு கவிதைகளில் விளக்கப்படுகிறது?" },
        { label: "செம்புலப் பெயல்நீர்", text: "சங்க இலக்கியத்தின் மிகவும் புகழ்பெற்ற 'செம்புலப் பெயல்நீர்' செய்யுளின் பொருளையும் நயத்தையும் கூறுக." },
        { label: "தொல்காப்பியத் தமிழ்", text: "தொல்காப்பியத்தில் மொழியியல் மற்றும் எழுத்து முறைகள் எவ்வாறு பகுக்கப்பட்டுள்ளன?" }
      ],
      en: [
        { label: "Kurinji Metaphors", text: "How is 'union' portrayed metaphorically against the mountain backdrop of Kurinji landscape?" },
        { label: "Red Earth & Pouring Rain", text: "Can you explain the meaning and poetic brilliance of the famous 'Sembula Peyalneerar' poem?" },
        { label: "Tolkappiyam Linguistics", text: "How does the Tolkappiyam classify speech, letters, and phonetics in early Tamil?" }
      ],
      hi: [
        { label: "संगम काल की कविता", text: "संगम काल की कविताओं में प्रकृति और प्रेम को किस प्रकार जोड़ा गया है?" }
      ],
      te: [
        { label: "సంఘం సాహిత్యం", text: "సంగం సాహిత్యంలో ప్రకృతి ప్రాముఖ్యత ఏమిటి?" }
      ],
      kn: [
        { label: "ಸಂಗಮ್ ಮಹಾಕಾವ್ಯ", text: "ಸಂಗಮ್ ಮಹಾಕಾವ್ಯಗಳ ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು ಯಾವುವು?" }
      ],
      ml: [
        { label: "സംഘകാല കവിത", text: "സംഘകാല കവിതകളിലെ 'തിണകൾ' എന്നാൽ എന്താണ്?" }
      ],
      bn: [
        { label: "কুরিঞ্জি কবিতা", text: "কুরিঞ্জি বা পাহাড়ি অঞ্চলের প্রেমের প্রতীক কীভাবে সঙ্গম কাব্যে প্রকাশিত হয়েছে?" },
        { label: "লাল মাটি ও বৃষ্টি", text: "'সেম্বুলা পেয়ালনীরার' (লাল মাটি ও বৃষ্টির জল) কবিতার অন্তর্নিহিত অর্থ কী?" }
      ]
    },
    mockReplies: {
      ta: {
        "குறிஞ்சி நிலத்தின் பின்னணியில் 'புணர்தலும் புணர்தல் நிமித்தமும்' எவ்வாறு கவிதைகளில் விளக்கப்படுகிறது?": "குறிஞ்சி நிலம் என்பது மலை மற்றும் மலை சார்ந்த பிரதேசம். இதன் உரிப்பொருள் **'புணர்தலும் புணர்தல் நிமித்தமும்'** (காதலர்களின் இணைவும் அது சார்ந்த நிகழ்வுகளும்) ஆகும்.\n\nமலையும் பனிமூட்டமும் நிறைந்த இரவுக் காலம், காதலர்கள் சந்திப்பதற்கான தனிமையையும் பாதுகாப்பையும் தருகிறது. கானகத்தின் இயற்கை ஒலிகள், அருவிகளின் சத்தம், வேங்கை மலர்கள் ஆகியவை காதல் சந்திப்பின் தீவிரத்தைக் கூட்டுகின்றன. சங்கப் புலவர்கள் மலையின் கம்பீரத்தை ஆண்மையின் அடையாளமாகவும், அங்கு பூக்கும் மென்மையான குறிஞ்சி மலரை பெண்மையின் தூய்மையாகவும் கவிதைகளில் குறியீடாகப் பயன்படுத்தினர்.",
        "சங்க இலக்கியத்தின் மிகவும் புகழ்பெற்ற 'செம்புலப் பெயல்நீர்' செய்யுளின் பொருளையும் நயத்தையும் கூறுக.": "குறுந்தொகையின் நாற்பதாவது பாடல் (பாடியவர்: செம்புலப் பெயல்நீரார்):\n\n> *யாயும் ஞாயும் யாராகியரோ,*\n> *எந்தையும் நுந்தையும் எம்முறைக் கேளிர்,*\n> *யானும் நீயும் எவ்வழி அறிதும்,*\n> *செம்புலப் பெயல்நீர் போல,*\n> *அன்புடை நெஞ்சம் தாங்கலந்தனவே.*\n\n**பொருள் நயம்:**\n'என் தாயும் உன் தாயும் யார் யாரோ? என் தந்தையும் உன் தந்தையும் எந்த முறையில் உறவினர்கள்? நானும் நீயும் இதற்கு முன் எங்கு அறிந்தோம்? ஆயினும், செம்மண்ணில் பெய்த மழைநீர் அந்த மண்ணோடு பிரித்தறிய முடியாதவாறு கலந்து அதன் நிறத்தைப் பெறுவது போல, அன்பு கொண்ட நம் இருவருடைய நெஞ்சங்களும் ஒன்றுடன் ஒன்று கலந்துவிட்டன.'\n\n**சிறப்பு:** உலகப் பொதுவான காதலை இதைவிட அழகாக எவராலும் விவரிக்க இயலாது. மண்ணும் நீரும் கலப்பது போன்ற உவமை, இரு ஆன்மாக்களின் பிரிக்க முடியாத இணைப்பைக் காட்டுகிறது.",
        "தொல்காப்பியத்தில் மொழியியல் மற்றும் எழுத்து முறைகள் எவ்வாறு பகுக்கப்பட்டுள்ளன?": "தொல்காப்பியம் என்பது தமிழின் மிகப்பழமையான இலக்கண நூல் (கி.மு 3ஆம் நூற்றாண்டுக்கு முற்பட்டது). இது வெறும் இலக்கணம் மட்டுமல்ல, உயர்ந்த மொழியியல் அறிவியல் நூலாகும். இது மூன்று அதிகாரங்களைக் கொண்டது:\n\n1. **எழுத்ததிகாரம்:** ஒலிகளின் பிறப்பு, எழுத்துக்களின் வடிவம், மாத்திரை அளவு மற்றும் சொற்களின் புணர்ச்சி விதிகளை விளக்குகிறது. உதடு, நாக்கு, பற்கள், தொண்டை ஆகியவற்றின் மூலம் ஒலிகள் எவ்வாறு பிறக்கின்றன என்ற உடலியல் மொழியியலை அன்றே தொல்காப்பியர் மிகத் துல்லியமாக விவரித்துள்ளார்.\n2. **சொல்லதிகாரம்:** பெயர்ச்சொல், வினைச்சொல், இடைச்சொல், உரிச்சொல் ஆகியவற்றின் பயன்பாட்டையும், சொற்றொடர் அமைப்பையும் ஆராய்கிறது.\n3. **பொருளதிகாரம்:** உலகிலேயே முதன்முறையாக மனித வாழ்க்கையின் அகம் (காதல்) மற்றும் புறம் (வீரம், சமூக ஒழுக்கம்) சார்ந்த நெறிமுறைகளுக்கு இலக்கணம் வகுத்த பெருமை இதையே சாரும்."
      },
      en: {
        "How is 'union' portrayed metaphorically against the mountain backdrop of Kurinji landscape?": "In classical Tamil poetics, **Kurinji** represents the mountain ranges, and its cardinal emotional theme (*Uripporul*) is **'Union and its causes'**.\n\nMountains, with their deep gorges, dense mist, and gushing waterfalls, symbolize the private, hidden, and perilous nature of pre-marital love. The dark, starry nights, the scent of *vengai* blossoms, and the protective cover of bamboo forests create a natural sanctuary. The ruggedness of the peaks mirrors the strength of the lover, while the rare, once-in-12-years blooming of the Kurinji flower represents the absolute preciousness of their union.",
        "Can you explain the meaning and poetic brilliance of the famous 'Sembula Peyalneerar' poem?": "This is from the anthology **Kurunthogai (Verse 40)**, attributed to the poet named after his masterpiece, Sembula Peyalneerar:\n\n> *\"My mother and your mother, who are they?* \n> *My father and your father, how are they related?* \n> *And you and I, how did we ever know each other?* \n> *Yet, like red earth and pouring rain,* \n> *Our hearts of love have mingled together.\"*\n\n**Linguistic & Poetic Brilliance:**\nBefore meeting, the lovers were strangers with no familial or spatial connections. The poet uses the perfect scientific-natural metaphor: when pure, colorless rain falls on dry red soil, the water instantly absorbs the color, scent, and temperature of the earth. They become inseparable. It is a profound description of chemical and spiritual union where individuality dissolves into absolute partnership.",
        "How does the Tolkappiyam classify speech, letters, and phonetics in early Tamil?": "**Tolkappiyam** (circa 3rd century BCE) is the oldest surviving Tamil grammatical treatise. It is highly valued by modern linguists for its scientific phonetics. It is divided into three sections:\n\n1. **Ezhuthathigaram (Orthography & Phonology):** Outlines letter shapes, duration of pronunciation (*maathirai*), and phonetic combinations (*punarchi*). It describes the physical articulation of sounds—how wind rising from the belly passes through the larynx, palate, teeth, and lips to generate distinct vowels and consonants.\n2. **Sollathigaram (Morphology & Syntax):** Classifies words into nouns, verbs, particles, and adjectives, and details grammatical case systems and gender agreement.\n3. **Porulathigaram (Poetics & Sociology):** Truly unique, it structures the rules of literature based on life itself—defining human experience through internal emotional worlds (*Akam*) and external social/political duties (*Puram*)."
      }
    },
    fallbackReplies: {
      ta: [
        "சங்கப் பாடல்கள் வெறும் இலக்கியமல்ல, தமிழர்களின் வாழ்வியல் மற்றும் சுற்றுச்சூழல் பதிவுகள். யாதும் ஊரே யாவரும் கேளிர் என்ற உன்னதக் கருத்தை உலகிற்குத் தந்தவை.",
        "திணைக் கோட்பாடுகள் மனித உணர்வுகளை இயற்கையோடு இணைக்கும் ஒரு மிகச்சிறந்த கறியீட்டு உத்தியாகும்.",
        "பண்டைய தமிழரின் செய்யுள் நயமும், சொற்செறிவும் நவீன கவிதை வடிவங்களுக்கும் பெரும் உத்வேகமாக அமைந்துள்ளன."
      ],
      en: [
        "Sangam poetry is not merely classical literature; it is an ecological map of human feelings blended with geography. 'To us all towns are one, and all men our kin.'",
        "The Thinai framework proves that ancient scholars understood the deep, inseparable link between human psychology and natural topography.",
        "The precise brevity, lack of excessive mythology, and intense focus on human realism make Sangam literature feel incredibly modern."
      ],
      hi: ["संगम साहित्य दक्षिण भारत के इतिहास, संस्कृति और प्रेम गाथाओं का एक अनुपम संग्रह है।", "तमिल साहित्य का समृद्ध व्याकरण शास्त्रीय भाषाओं में सर्वश्रेष्ठ है।"],
      te: ["సంఘం సాహిత్యం ప్రాచీన భారతదేశంలో సామాజిక జీవితం మరియు సంస్కృతిని ప్రతిబింబిస్తుంది.", "సంగం కవిత్వం మానవ భావోద్వేగాలను ప్రకృతితో ముడిపెడుతుంది."],
      kn: ["ಸಂಗಮ್ ಸಾಹಿತ್ಯವು ಪ್ರಾಚೀನ ದಕ್ಷಿಣ ಭಾರತದ ಸಾಮಾಜಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಜೀವನದ ಕೈಗನ್ನಡಿಯಾಗಿದೆ.", "ಇದು ಪ್ರಕೃತಿ ಮತ್ತು ಮಾನವ ಸಂಬಂಧಗಳ ಅನನ್ಯ ಬಾಂಧವ್ಯವನ್ನು ವಿವರಿಸುತ್ತದೆ."],
      ml: ["സംഘകാല കൃതികൾ ദക്ഷിണേഷ്യൻ സംസ്കാരത്തിലേക്കും ചരിത്രത്തിലേക്കും വെളിച്ചം വീശുന്നവയാണ്.", "പ്രണയവും വീരത്വവുമാണ് സംഘകാല കവിതകളുടെ പ്രധാന പ്രമേയം."],
      bn: ["সঙ্গম সাহিত্য প্রাচীন ভারতের সামাজিক জীবন এবং সংস্কৃতির এক অমূল্য দলিল।", "তামিল ব্যাকরণের বৈজ্ঞানিক গঠন সত্যিই বিষ্ময়কর ও যুক্তিপূর্ণ।"]
    }
  },
  {
    id: "neytal_merchant",
    key: "neytal",
    icon: "🌊",
    color: "sky",
    accentHex: "#4a8ab5",
    taName: "நெய்தல் கடல் வணிகர்",
    enName: "Neytal Marine Merchant",
    taDesc: "கடல் வர்த்தகம், துறைமுக மேலாண்மை, ஏற்றுமதி-இறக்குமதி, மற்றும் சர்வதேச கடல்வழிகள்.",
    enDesc: "Global maritime trade, port management, customs, ancient and modern commercial sea routes.",
    welcomeMessages: {
      ta: "வணக்கம்! நெய்தல் கடல் வணிகர் உங்களை வரவேற்கிறது. கடல் கடந்து வணிகம் செய்வோம். கொற்கை, புகார் துறைமுகங்கள் முதல் தற்கால சர்வதேச வர்த்தகப் பாதைகள் வரை எதைப்பற்றி உரையாட வேண்டும்?",
      en: "Sailor's greetings! I am the Neytal Marine Merchant. Charting routes from the ancient ports of Muziris and Poompuhar to modern shipping lanes. Ask me about cargo logistics, tariffs, or maritime trade history.",
      hi: "समुद्री नमस्कार! मैं नेयतल मरीन मर्चेंट हूँ। प्राचीन बंदरगाहों से लेकर आधुनिक समुद्री व्यापार और वैश्विक शिपिंग के बारे में पूछताछ करें।",
      te: "సముద్ర ప్రయాణీకులకు సలాం! నేను నేయతల్ సముద్ర వ్యాపారిని. పురాతన ఓడరేవులు మరియు అంతర్జాతీయ నౌకా రవాణా గురించి అడగండి.",
      kn: "ನೌಕಾಯಾನದ ಶುಭಾಶಯಗಳು! ನಾನು ನೇಯ್ತಲ್ ಕಡಲ ವ್ಯಾಪಾರಿ. ಪುರಾತನ ಬಂದರುಗಳು ಮತ್ತು ಜಾಗತಿಕ ಹಡಗು ಸಾಗಣೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.",
      ml: "സമുദ്ര യാത്രികർക്ക് സ്വാഗതം! ഞാൻ നെയ്തൽ കപ്പൽ വ്യാപാരിയാണ്. പുരാതന കൊച്ചി തുറമുഖം മുതൽ ആധുനിക സമുദ്ര വ്യാപാരം വരെയുള്ള വിവരങ്ങൾ ചോദിക്കൂ.",
      bn: "সামুদ্রিক শুভেচ্ছা! আমি নেয়তাল সামুদ্রিক বণিক। প্রাচীন মুজিরিস বা পুহার বন্দর থেকে আধুনিক শিপিং রুট ও আন্তর্জাতিক বাণিজ্য সম্পর্কে জানুন।"
    },
    suggestions: {
      ta: [
        { label: "புகார் துறைமுக வணிகம்", text: "பண்டைய புகார் (பூம்புகார்) துறைமுகத்தில் நடந்த ஏற்றுமதி மற்றும் இறக்குமதி வணிகம் எத்தகையது?" },
        { label: "நவீன கடல் வணிகப் பாதை", text: "இந்தியப் பெருங்கடலின் தற்போதைய முக்கியமான கடல்சார் வர்த்தகப் பாதைகள் மற்றும் சவால்கள் யாவை?" }
      ],
      en: [
        { label: "Ancient Ports of Poompuhar", text: "What was the scale of import-export trade at the ancient port of Poompuhar (Kavery-poompattinam)?" },
        { label: "Indian Ocean Trade Routes", text: "What are the major maritime choke points and shipping lanes in the Indian Ocean today?" }
      ]
    },
    mockReplies: {
      ta: {
        "பண்டைய புகார் (பூம்புகார்) துறைமுகத்தில் நடந்த ஏற்றுமதி மற்றும் இறக்குமதி வணிகம் எத்தகையது?": "பண்டைய புகார் துறைமுகம் (காவிரிப்பூம்பட்டினம்) சோழ பேரரசின் உலகளாவிய வர்த்தக மையமாக விளங்கியது. சிலப்பதிகாரத்தில் இதன் பிரம்மாண்டம் விவரிக்கப்பட்டுள்ளது:\n\n*   **இறக்குமதிகள்:** கடலில் வந்த குதிரைகள் (அரேபியாவிலிருந்து), கப்பல்களில் மிளகு மூட்டைகள், வட மலையிலிருந்து தங்கம் மற்றும் ரத்தினங்கள், மேற்கத்திய நாடுகளின் பவளங்கள், கீழை நாடுகளில் இருந்து வந்த சந்தனம் மற்றும் அகில், இலங்கை உணவுப் பொருட்கள், மற்றும் சீனத்துப் பட்டு.\n*   **ஏற்றுமதிகள்:** முத்துக்கள் (கொற்கை முக்கடல் முத்து), பருத்தி ஆடைகள், மிளகு, ஏலக்காய், சந்தனம், மற்றும் இரும்பு.\n\nதுறைமுகத்தில் சுங்கச் சாவடிகள் இருந்தன, அங்கு ஏற்றுமதி இறக்குமதி பொருட்களுக்கு சோழ மன்னரின் புலி முத்திரை இடப்பட்டு வரி வசூலிக்கப்பட்டது. கப்பல்கள் நங்கூரமிட்டு வரிசையாக நிற்கும் காட்சி மலைகளைப் போல் காட்சியளித்தது என்று இலக்கியங்கள் கூறுகின்றன.",
        "இந்தியப் பெருங்கடலின் தற்போதைய முக்கியமான கடல்சார் வர்த்தகப் பாதைகள் மற்றும் சவால்கள் யாவை?": "இந்தியப் பெருங்கடல் (Indian Ocean) உலகின் 70% எரிசக்தி மற்றும் 50% கன்டெய்னர் போக்குவரத்தை நிர்வகிக்கும் மிக முக்கியமான வர்த்தகத் தளமாகும்.\n\n**முக்கிய பாதைகள் & நெரிசல் புள்ளிகள் (Choke Points):**\n1.  **மலாக்கா நீரிணை (Malacca Strait):** ஆசியா-பசிபிக் நாடுகளை இணைக்கும் மிக முக்கியப் பாதை. சீனா, ஜப்பான் நாடுகளின் எரிசக்தி தேவைகள் இதன் மூலமே செல்கிறது.\n2.  **பாப்-எல்-மண்டேப் நீரிணை (Bab-el-Mandeb) & செங்கடல்:** சூயஸ் கால்வாய் வழியாக ஐரோப்பாவை அடையும் பாதை.\n3.  **ஹோர்முஸ் நீரிணை (Strait of Hormuz):** அரேபிய வளைகுடாவின் கச்சா எண்ணெய் விநியோகப் பாதை.\n\n**நவீன சவால்கள்:**\n*   **கடல் கொள்ளை (Piracy):** ஏடன் வளைகுடா மற்றும் சோமாலியக் கடற்கரைகளில் உள்ள பாதுகாப்பு அச்சுறுத்தல்கள்.\n*   **புவிசார் அரசியல் பதற்றங்கள் (Geopolitics):** ஆதிக்கப் போட்டிகள் மற்றும் கடல்சார் எல்லைப் பிரச்சனைகள்.\n*   **காலநிலை மாற்றம்:** சூறாவளி மற்றும் கடல் மட்ட உயர்வால் துறைமுக உள்கட்டமைப்புகள் பாதிக்கப்படுவது."
      },
      en: {
        "What was the scale of import-export trade at the ancient port of Poompuhar (Kavery-poompattinam)?": "The ancient port city of **Poompuhar** (Kaveripoompattinam) was a bustling cosmopolitan trade hub of the Early Chola Empire, documented extensively in the epic *Silappatikaram*:\n\n*   **Imports:** High-breed horses from Arabia by sea, black pepper bags from inland hills, gold and gems from Northern mountains, red coral from the Mediterranean (Yavana trade), sandalwood and spices from the Far East (Ganga-basin), and fine silk from China.\n*   **Exports:** Lustrous pearls from the Gulf of Mannar, ultra-fine cotton textiles (highly prized in Rome), ivory, iron, peacock feathers, and cardamoms.\n\nGoods were stored in massive warehouses and cleared by Chola customs officials who stamped each bundle with the royal Chola tiger emblem (*Puli muthirai*) before levying tariffs. The port housed merchants of diverse nationalities (Romans, Chinese, Arabs) living in harmony in dedicated commercial sectors.",
        "What are the major maritime choke points and shipping lanes in the Indian Ocean today?": "The **Indian Ocean** is the central superhighway of global trade, carrying nearly 70% of the world's petroleum products and half of all container ships.\n\n**Key Shipping Lanes & Choke Points:**\n1.  **Strait of Malacca:** Connecting the Indian Ocean to the Pacific, crucial for energy supply to East Asia.\n2.  **Strait of Hormuz:** The world's primary oil transit bottleneck, connecting the Persian Gulf to the Arabian Sea.\n3.  **Bab-el-Mandeb & the Red Sea:** The critical gateway to the Suez Canal, bridging trade with Europe.\n\n**Modern Challenges:**\n*   **Geopolitics & Security:** Militarization of sea lanes and regional sovereign rivalries.\n*   **Asymmetric Threats:** Piracy in the Gulf of Aden and drone attacks on merchant shipping.\n*   **Climate Risks:** Increasing frequency of severe cyclones in the Arabian Sea affecting port infrastructures."
      }
    },
    fallbackReplies: {
      ta: [
        "கடல் வணிகத்தில் தளவாடக் கட்டணம் (Logistics Cost) மற்றும் கப்பல் கால அட்டவணைகள் (Schedules) மிக முக்கியமானவை. ஏற்றுமதியைத் திட்டமிடும்போது காப்பீடு (Cargo Insurance) அவசியம்.",
        "நெய்தல் நிலத்து உப்பளங்கள் மற்றும் மீன்பிடித் தொழில் பண்டைக்காலம் தொட்டே தமிழ்நாட்டின் கடலோரப் பொருளாதாரத்தின் முதுகெலும்பாகும்.",
        "நவீன கடல் சட்டங்கள் (UNCLOS) மற்றும் துறைமுக விதிகளுக்கு உட்பட்டு நமது சர்வதேச வர்த்தகம் நடைபெற வேண்டும்."
      ],
      en: [
        "When planning international sea freight, optimization of container utilization and choosing the correct Incoterms are essential to manage risk.",
        "Historically, the Indian Ocean was characterized by cooperative trade networks rather than military dominance, unlike the colonial era.",
        "Modern ports are heavily investing in automation and AI-driven predictive logistics to reduce vessel turnaround times."
      ],
      hi: ["अंतरराष्ट्रीय शिपिंग में भाड़ा शुल्क (freight charges) और सीमा शुल्क निकासी सबसे महत्वपूर्ण पहलू हैं।", "भारत का समुद्री इतिहास हजारों साल पुराना और समृद्ध है।"],
      te: ["అంతర్జాతీయ వ్యాపారంలో నౌకాశ్రయాలు కీలక పాత్ర పోషిస్తాయి.", "సముద్ర రవాణా ఖర్చులను తగ్గించుకోవడానికి కంటైనర్ల సమర్థవంతమైన నిర్వహణ అవసరం."],
      kn: ["ಅಂತರರಾಷ್ಟ್ರೀಯ ವ್ಯಾಪಾರದಲ್ಲಿ ಬಂದರುಗಳ ಸಾಗಣೆ ಸಾಮರ್ಥ್ಯವು ಆರ್ಥಿಕತೆಯ ಮೇಲೆ ನೇರ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ.", "ಕಡಲ ಮಾರ್ಗಗಳು ಜಾಗತಿಕ ಸಂಪರ್ಕದ ಜೀವಾಳವಾಗಿವೆ."],
      ml: ["കയറ്റുമതി വ്യാപാരികൾക്ക് ഇൻകോടേംസ് (Incoterms) മനസ്സിലാക്കുന്നത് അത്യന്താപേക്ഷിതമാണ്.", "പുരാതന കാലം മുതലേ കേരളം വിദേശരാജ്യങ്ങളുമായി ശക്തമായ സുഗന്ധവ്യഞ്ജന വ്യാപാരം നടത്തിയിരുന്നു."],
      bn: ["আন্তর্জাতিক বাণিজ্যে কন্টেইনার শিপিং সবচেয়ে সাশ্রয়ী এবং নির্ভরযোগ্য মাধ্যম।", "বঙ্গোপসাগরীয় অঞ্চলের নৌ-বাণিজ্য প্রাচীনকাল থেকেই অত্যন্ত সক্রিয় ছিল।"]
    }
  },
  {
    id: "mullai_guardian",
    key: "mullai",
    icon: "🌳",
    color: "teal",
    accentHex: "#4f9d6b",
    taName: "முல்லை வனக் காவலர்",
    enName: "Mullai Eco-Guardian",
    taDesc: "பல்லுயிர் பெருக்கம், காடு வளர்ப்பு, வன மூலிகைகள் மற்றும் காலநிலை பாதுகாப்பு.",
    enDesc: "Biodiversity, reforestation, forest pharmacopoeia, and climate resilience of woodlands.",
    welcomeMessages: {
      ta: "வணக்கம்! முல்லை வனக் காவலர் உங்களை வரவேற்கிறது. காடுகள், காட்டுயிர்கள், பல்லுயிர் பாதுகாப்பு மற்றும் காலநிலை மாற்றம் குறித்து நாம் எவ்வாறு செயல்படலாம்?",
      en: "Greetings, earthkeeper! I am the Mullai Eco-Guardian. Preserving wildlife corridors, native flora, and deep forest ecosystems. Ask me about restoration ecology or sustainable forestry.",
      hi: "पर्यावरण मित्र! मुल्लई वन संरक्षक में आपका स्वागत है। वन्यजीवों, वनीकरण और जलवायु संरक्षण के उपायों के बारे में चर्चा करें।",
      te: "పర్యావరణ ప్రేమికులకు నమస్కారం! నేను ముల్లై అటవీ సంరక్షకుడిని. జీవవైవిధ్యం మరియు పర్యావరణ పరిరక్షణ గురించి తెలుసుకోండి.",
      kn: "ಪರಿಸರ ರಕ್ಷಕರಿಗೆ ನಮಸ್ಕಾರ! ನಾನು ಮುಲ್ಲೈ ಅರಣ್ಯ ರಕ್ಷಕ. ಜೀವವೈವಿಧ್ಯ ಮತ್ತು ಅರಣ್ಯ ಸಂರಕ್ಷಣೆಯ ಮಾರ್ಗಗಳನ್ನು ಚರ್ಚಿಸೋಣ.",
      ml: "പ്രകൃതി സ്നേഹികൾക്ക് വന്ദനം! ഞാൻ മുല്ലൈ വന സംരക്ഷകനാണ്. ജൈവവൈവിധ്യവും വനസംരക്ഷണവും നേരിടുന്ന വെല്ലുവിളികളെക്കുറിച്ച് സംസാരിക്കാം.",
      bn: "বন ও প্রকৃতির বন্ধুদের শুভেচ্ছা! আমি মুল্লাই পরিবেশ-রক্ষক। বন্যপ্রাণী করিডোর, জীববৈচিত্র্য ও পরিবেশ রক্ষা নিয়ে চলুন কথা বলি।"
    },
    suggestions: {
      ta: [
        { label: "மண்ணிற்கு ஏற்ற மரங்கள்", text: "வறண்ட நிலங்களை மீண்டும் காடுகளாக்க எந்த வகையான பூர்வீக மரங்களை நட வேண்டும்?" },
        { label: "பல்லுயிர் பெருக்கம்", text: "காட்டுயிர்களின் வாழ்விடங்களை (Corridors) பாதுகாப்பதன் மூலம் பல்லுயிர் பெருக்கம் எவ்வாறு மேம்படும்?" }
      ],
      en: [
        { label: "Native Tree Afforestation", text: "Which native tree species should be prioritized for restoring degraded dry deciduous lands?" },
        { label: "Wildlife Corridors", text: "Why are wildlife corridors essential for preventing human-animal conflicts and genetic isolation?" }
      ]
    },
    mockReplies: {
      ta: {
        "வறண்ட நிலங்களை மீண்டும் காடுகளாக்க எந்த வகையான பூர்வீக மரங்களை நட வேண்டும்?": "வறண்ட நிலங்களை மீண்டும் வளமான காடுகளாக்க பூர்வீக மரங்களை (Native Tree Species) நடுவது மட்டுமே ஒரே வழி. அயல்நாட்டு மரங்களான யூக்கலிப்டஸ் அல்லது சீமைக்கருவேலம் போன்றவற்றை முற்றிலும் தவிர்க்க வேண்டும்.\n\n**முக்கிய பூர்வீக மரங்கள்:**\n1.  **வேம்பு (Neem):** சிறந்த காற்று சுத்திகரிப்பான் மற்றும் பூச்சி விரட்டி.\n2.  **புங்கன் (Pongamia):** வறட்சியைத் தாங்கி வளரக்கூடியது, நைட்ரஜனை நிலைநிறுத்தும்.\n3.  **ஆலமரம் மற்றும் அரசமரம் (Ficus species):** பறவைகள் மற்றும் அணில்களுக்கு உறைவிடமும் உணவும் தந்து பல்லுயிர் சுழற்சியைத் தொடங்கும்.\n4.  **நாவல், இலந்தை, விளாம்பழம்:** காட்டுயிர்களுக்கான பழ மரங்கள்.\n5.  **வெண்மருது & நீர்மருது:** நிலத்தடி நீரைச் சேமிக்கும் ஆற்றல் கொண்டவை.\n\nஇவற்றுடன் 'மியாவாக்கி' (Miyawaki) அடர்வன முறையை நமது பூர்வீக மரங்களைக் கொண்டு செயல்படுத்தும்போது 3 ஆண்டுகளில் வறண்ட நிலம் அடர்ந்த காடாகும்.",
        "காட்டுயிர்களின் வாழ்விடங்களை (Corridors) பாதுகாப்பதன் மூலம் பல்லுயிர் பெருக்கம் எவ்வாறு மேம்படும்?": "காட்டுயிர் வழித்தடங்கள் (Wildlife Corridors) என்பது இரண்டு காடுகளை இணைக்கும் ஒரு இயற்கை நிலப்பகுதியாகும். சாலைகளோ அல்லது குடியிருப்புகளோ காடுகளைத் துண்டிக்கும்போது விலங்குகள் ஒரு குறிப்பிட்ட பகுதிக்குள் முடக்கப்படுகின்றன.\n\n**வழித்தடங்களின் நன்மைகள்:**\n*   **மரபணு பரிமாற்றம் (Genetic Diversity):** விலங்குகள் வேறு பகுதிகளிலுள்ள தனது கூட்டத்தோடு இணைய வழித்தடங்கள் உதவுகின்றன. இதனால் இனப்பெருக்கம் சிறந்து ஆரோக்கியமான புதிய தலைமுறை விலங்குகள் பிறக்கின்றன.\n*   **மனித-விலங்கு மோதல் குறைதல்:** யானைகள், புலிகள் போன்ற பெரிய விலங்குகள் உணவு மற்றும் தண்ணீருக்காக இடம்பெயரும்போது வழித்தடம் இல்லை எனில் மனித குடியிருப்புகளுக்குள் நுழைகின்றன. வழித்தடங்களைப் பாதுகாத்தால் இந்த மோதல்கள் பெருமளவு குறையும்.\n*   **சமநிலை பாதுகாப்பு:** வேட்டை விலங்குகள் மற்றும் இரை விலங்குகளின் சமநிலை இயற்கையாகப் பேணப்பட்டு, காட்டின் ஒட்டுமொத்த பல்லுயிர்த்தன்மையும் பாதுகாக்கப்படுகிறது."
      },
      en: {
        "Which native tree species should be prioritized for restoring degraded dry deciduous lands?": "To successfully restore degraded dry deciduous lands, introducing **native tree species** is paramount. Avoid exotic monocultures like Eucalyptus or Acacia, which deplete groundwater and suppress native undergrowth.\n\n**Top Native Pioneers to Plant:**\n1.  **Neem (Azadirachta indica):** Extremely drought-hardy, improves soil organic content, and acts as a natural purifier.\n2.  **Indian Beech (Pongamia pinnata):** Leguminous tree that fixes nitrogen, thriving in rocky soils.\n3.  **Banyan and Peepal (Ficus species):** Keystone species that attract birds, bats, and insects, kickstarting ecological succession.\n4.  **Jamun (Black Plum) and Wood Apple:** Provide essential seasonal wild fruits for woodland fauna.\n5.  **Arjuna (Terminalia arjuna):** Ideal for moisture retention and stream-bank stabilization.\n\nUtilizing these species under a multi-layered forest design (resembling the natural **Mullai** forest structure) ensures rapid self-sustaining forest regeneration.",
        "Why are wildlife corridors essential for preventing human-animal conflicts and genetic isolation?": "**Wildlife Corridors** are strips of natural habitat connecting otherwise fragmented forest reserves. When human infrastructure intersects forests, it turns ecological zones into isolated 'islands.'\n\n**Critical Importance:**\n*   **Genetic Inflow:** Without corridors, small animal populations undergo inbreeding depression, leading to genetic mutations and vulnerability to diseases. Corridors facilitate necessary gene flow between distant populations.\n*   **Preventing Conflict:** Migratory giants like Asian Elephants remember migratory paths over generations. If a corridor is blocked by resorts or farms, elephants trespass, leading to severe crop damage and loss of life. Corridors keep them safely on designated wild paths.\n*   **Predator-Prey Balance:** Large carnivores need extensive territories to hunt. Corridors prevent overgrazing in single zones by dispersing prey and predators evenly across the landscape."
      }
    },
    fallbackReplies: {
      ta: [
        "காடு வளர்ப்பில் மண்ணின் ஈரப்பதத்தைப் பேண 'நிலப்போர்வை' (Mulching) இடுவது அவசியம். இது நீர் ஆவியாவதைத் தடுத்து மண்ணின் நுண்ணுயிர்களைக் காக்கும்.",
        "முல்லை நிலத்தின் இயற்கை கூறான காடும் காடு சார்ந்த வாழ்வும், இயற்கையோடு இயைந்த வாழ்வியலின் உன்னத குறியீடாகும்.",
        "பிளாஸ்டிக் கழிவுகளை வனப்பகுதிகளில் போடுவதைத் தவிர்ப்போம். ஒவ்வொரு மரமும் மழையை ஈர்க்கும் மேகக் காந்தம்."
      ],
      en: [
        "Mulching with dry organic matter is a highly efficient way to preserve topsoil moisture and nourish micro-fungi in forest beds.",
        "The preservation of natural streams and native grasses is just as important as planting tall canopy trees for a complete forest ecosystem.",
        "Restoring wildlife habitats is the single most cost-effective solution for carbon sequestration and biodiversity stabilization."
      ],
      hi: ["पेड़ों की कटाई रोकना और स्थानीय प्रजातियों के पौधे लगाना पर्यावरण को बचाने की पहली सीढ़ी है।", "जैव विविधता ही पृथ्वी के जीवन का आधार है।"],
      te: ["అడవుల సంరక్షణ వల్ల మాత్రమే గ్లోబல் వార్మింగ్ సమస్యను అరికట్టగలం.", "వన్యప్రాణుల రక్షణ మన పర్యావరణ సమతుల్యతకు ముఖ్యం."],
      kn: ["ಅರಣ್ಯೀಕರಣವು ಜಲಮೂಲಗಳನ್ನು ಪುನಶ್ಚೇತನಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.", "ಕಾಡುಗಳು ಭೂಮಿಯ ಶ್ವಾಸಕೋಶದಂತಿವೆ."],
      ml: ["വനനശീകരണം കാലാവസ്ഥാ വ്യതിയാനത്തിന് പ്രധാന കാരണമാകുന്നു.", "കാട്ടുതീ തടയുന്നതിനുള്ള മുൻകരുതലുകൾ സ്വീകരിക്കേണ്ടത് അത്യാവശ്യമാണ്."],
      bn: ["বনায়ন ও বৃক্ষরোপণ জলবায়ু পরিবর্তন রোধের সবচেয়ে শক্তিশালী হাতিয়ার।", "বন রক্ষা করা কেবল পরিবেশ নয়, আমাদের নিজেদের বেঁচে থাকার স্বার্থেই জরুরী।"]
    }
  },
  {
    id: "palai_crisis",
    key: "palai",
    icon: "🏜️",
    color: "amber",
    accentHex: "#c25b3c",
    taName: "பாலை உத்தி நிபுணர்",
    enName: "Palai Strategy & Crisis Advisor",
    taDesc: "இடர் மேலாண்மை, வறட்சி மேலாண்மை, உத்திகள், மனவலிமை மற்றும் தீவிர வாழ்வியல் சவால்கள்.",
    enDesc: "Risk mitigation, strategic crisis management, survival protocols, and psychological/operational resilience.",
    welcomeMessages: {
      ta: "வணக்கம்! பாலை உத்தி நிபுணர் உங்களை வரவேற்கிறது. இக்கட்டான சூழ்நிலைகள், இடர்பாடுகள், ஆபத்து மேலாண்மை மற்றும் சவால்களை எதிர்கொள்ளும் உத்திகளைப் பற்றி இங்கு விவாதிப்போம்.",
      en: "Greetings. I am the Palai Strategy & Crisis Advisor. Modeled after the unforgiving arid deserts, I assist in risk analysis, contingency planning, and building operational resilience under high stress.",
      hi: "स्वागत है। मैं पालै संकट और रणनीति सलाहकार हूँ। कठिन परिस्थितियों, जोखिम प्रबंधन और रणनीतिक फैसलों पर मार्गदर्शन के लिए पूछें।",
      te: "నమస్కారం! నేను పాలై సంక్షోభ నివారణ మరియు వ్యూహాత్మక సలహాదారుని. క్లిష్ట పరిస్థితులను ఎలా ఎదుర్కొనాలో వ్యూహాలను రూపొందించుకుందాం.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಪಾಲೈ ಬಿಕ್ಕಟ್ಟು ಮತ್ತು ಕಾರ್ಯತಂತ್ರ ಸಲಹೆಗಾರ. ಕಠಿಣ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಎದುರಿಸಲು ಮತ್ತು ಕಾರ್ಯತಂತ್ರ ರೂಪಿಸಲು ಚರ್ಚಿಸೋಣ.",
      ml: "നമസ്കാരം! ഞാൻ പാലൈ പ്രതിസന്ധി പരിഹാര ഉപദേശകനാണ്. കടുത്ത വെല്ലുവിളികളും പ്രതിസന്ധികളും അതിജീവിക്കാനുള്ള തಂತ್ರങ്ങൾ ആസൂത്രണം ചെയ്യാം.",
      bn: "স্বাগতম। আমি পালৈ কৌশল ও সংকট ও ঝুঁকি ব্যবস্থাপনা উপদেষ্টা। প্রতিকূল পরিস্থিতি এবং কৌশলগত সিদ্ধান্ত গ্রহণে সাহায্য করতে প্রস্তুত।"
    },
    suggestions: {
      ta: [
        { label: "தொழில் ஆபத்து மேலாண்மை", text: "ஒரு புதிய தொழிலைத் தொடங்கும்போது ஏற்படும் நிதி மற்றும் சந்தை ஆபத்துகளை எவ்வாறு முன்கூட்டியே கணிக்கலாம்?" },
        { label: "நெருக்கடி உத்திகள்", text: "தீவிரமான வணிக நெருக்கடி அல்லது தனிப்பட்ட சவால்களின் போது மன உறுதியையும் ஸ்திரத்தன்மையையும் காப்பது எப்படி?" }
      ],
      en: [
        { label: "Business Risk Management", text: "How can we systematically identify and mitigate financial and market risks in a startup?" },
        { label: "Operational Resilience", text: "What are the core steps to build organizational resilience against sudden macro-economic crises?" }
      ]
    },
    mockReplies: {
      ta: {
        "ஒரு புதிய தொழிலைத் தொடங்கும்போது ஏற்படும் நிதி மற்றும் சந்தை ஆபத்துகளை எவ்வாறு முன்கூட்டியே கணிக்கலாம்?": "பாலை நிலத்தின் கடும் வெயிலிலும் வறட்சியிலும் உயிர்வாழ உயிரினங்கள் எத்தகைய தகவமைப்புகளைக் கொண்டுள்ளனவோ, அதைப் போன்றே ஒரு புதிய தொழிலிலும் ஆபத்து மேலாண்மை உத்திகள் (Risk Management Strategies) அவசியமாகும்:\n\n1.  **இடர் கண்டறிதல் (Risk Identification):** சந்தை இடர், நிதி இடர், செயல்பாட்டு இடர் மற்றும் சட்ட இடர் என அனைத்தையும் பட்டியலிடுங்கள்.\n2.  **காப்பு நிதி (Cash Runway):** பாலைவனக் ஒட்டகம் தன் உடலில் நீரைச் சேமிப்பது போல, வணிகத்தில் குறைந்தபட்சம் 6 முதல் 12 மாதங்களுக்கான செயல்பாட்டுச் செலவுக்கான காப்பு நிதி (Runway) இருப்பதை உறுதி செய்யுங்கள்.\n3.  **திடீர் மாற்றத் திட்டம் (Contingency Plan B):** முதல் தயாரிப்பு அல்லது சேவை தோல்வியடைந்தால், மாற்றுப் பாதைக்கு (Pivot) மாறுவதற்கான நெகிழ்வுத்தன்மை இருக்க வேண்டும்.\n4.  **முன்கூட்டியே சோதித்தல் (Validation):** பெரிய முதலீடுகளைச் செய்வதற்கு முன், ஒரு சிறிய மாதிரித் தயாரிப்பை (MVP) சந்தையில் அறிமுகப்படுத்தி வாடிக்கையாளர் வரவேற்பைச் சோதித்துப் பாருங்கள்.",
        "தீவிரமான வணிக நெருக்கடி அல்லது தனிப்பட்ட சவால்களின் போது மன உறுதியையும் ஸ்திரத்தன்மையையும் காப்பது எப்படி?": "நெருக்கடியான காலங்களில் மன உறுதியை (Resilience) வளர்த்தெடுக்க பாலை நிலப் பண்பான 'சகிப்புத்தன்மை' மற்றும் 'விரைந்து மீளும் குணம்' அடிப்படையாகும்:\n\n*   **உணர்வுகளைக் கட்டுப்படுத்தல் (Emotional Regulation):** பதற்றம் தவறான முடிவுகளுக்கே வழிவகுக்கும். எதையும் உணர்ச்சிவசப்படாமல் தரவுகளின் அடிப்படையில் பகுப்பாய்வு செய்யுங்கள்.\n*   **கட்டுப்படுத்தக்கூடியவற்றில் கவனம் செலுத்துங்கள்:** உங்களால் மாற்ற முடியாத வெளிப்புறச் சூழலை (சந்தை வீழ்ச்சி, பேரிடர்) நினைத்துக் கவலைப்படுவதை நிறுத்திவிட்டு, உங்களால் என்ன செய்ய முடியும் (செலவுகளைக் குறைப்பது, மாற்று வழிகள்) என்பதில் கவனம் செலுத்துங்கள்.\n*   **அடுத்த சிறு படி (Micro-actions):** ஒட்டுமொத்தப் பிரச்சனையும் உங்களை அச்சுறுத்தும்போது, அதைச் சிறு சிறு பகுதிகளாகப் பிரித்து, அடுத்த 1 மணி நேரம் அல்லது 1 நாளில் செய்ய வேண்டிய சிறு காரியங்களில் கவனம் செலுத்துங்கள்.\n*   **தகவமைப்பு (Adaptability):** சூழ்நிலைக்கு ஏற்ப நமது திட்டங்களையும் சிந்தனையையும் உடனடியாக மாற்றிக் கொள்ளும் திறனே நெருக்கடியில் உயிர் பிழைக்கும் உன்னத சூத்திரமாகும்."
      },
      en: {
        "How can we systematically identify and mitigate financial and market risks in a startup?": "Survival in a startup is highly analogous to surviving in the unforgiving **Palai** (desert) landscape—it requires extreme efficiency, resource conservation, and foresight:\n\n1.  **Risk Audit:** Categorize risks into Market Risk (demand drop), Financial Risk (cash depletion), Operational Risk (talent loss), and Regulatory Risk.\n2.  **The Camel Strategy (Capital Runway):** Just as a camel stores fat for dry seasons, a startup must maintain a lean, non-bloated cash runway. Ideally, maintain 9 to 12 months of operating expenses in reserve before aggressively scaling.\n3.  **Pre-Mortem Analysis:** Before launching a product, conduct a pre-mortem—assume the launch has failed miserably and work backward to identify what caused the failure. This uncovers hidden blindspots.\n4.  **Prototyping & Pivot Agility:** Do not invest heavily in heavy infrastructure early on. Build a Minimum Viable Product (MVP) to test market appetite first. If the metrics don't align, pivot immediately without emotional attachment to the initial idea.",
        "What are the core steps to build organizational resilience against sudden macro-economic crises?": "Organizational resilience under sudden macro-economic stress requires immediate shift from growth-mode to survival-and-adaptability-mode:\n\n*   **Transparent Communication:** During a crisis, ambiguity breeds fear. Leaders must communicate clearly, honestly, and frequently with stakeholders and employees, stating the severity of the crisis and the concrete path forward.\n*   **Radical Cost Rationalization:** Instantly separate core business drivers from non-essential overheads. Suspend non-critical expansions and focus strictly on preserving the primary cash-generating engine.\n*   **Decentralized Decision-Making:** Enable on-the-ground teams to make rapid adjustments without awaiting layers of bureaucratic approval. Speed is of the essence in crisis mitigation.\n*   **Diversification of Dependencies:** Ensure your supply chain, customer base, and cloud providers are not tied to a single source. Redundancy is the cornerstone of resilience."
      }
    },
    fallbackReplies: {
      ta: [
        "நெருக்கடிகள் எப்போதும் தற்காலிகமானவை. தெளிவான உத்தியும், பொறுமையும் இருந்தால் எந்த ஒரு கடினமான சூழலிலிருந்தும் நாம் மீண்டு வரலாம்.",
        "பாலை நிலத்தின் கடுமையான சூழல் நமக்குக் கற்பிக்கும் பாடம்: கடின உழைப்பு மற்றும் இடைவிடாத விடாமுயற்சி மட்டுமே வெற்றியைத் தரும்.",
        "அபாயங்களை முன்கூட்டியே கணிப்பதும், அதற்குரிய மாற்றுத் திட்டங்களை (Backups) தயார் நிலையில் வைத்திருப்பதுமே சிறந்த தலைமைத்துவத்தின் அடையாளம்."
      ],
      en: [
        "Crises are temporary, but strategic adaptations are permanent. Stay focused, preserve your core strengths, and execute decisively.",
        "The primary lesson of the desert is absolute efficiency: eliminate waste, optimize existing resources, and do not panic.",
        "True leadership is defined not by how well we perform in fertile seasons, but by how strategically we steer the ship through arid storms."
      ],
      hi: ["संकट के समय धैर्य और सटीक रणनीति ही सफलता की कुंजी है।", "जोखिमों का पहले से आकलन करना नुकसान को 80% तक कम कर सकता है।"],
      te: ["కష్ట సమయాల్లో వ్యూహాత్మకంగా వ్యవహరించడం వల్ల మాత్రమే విజయం సాధ్యమవుతుంది.", "ప్రమాదాలను ముందుగానే గుర్తించడం వాటి శాతం తగ్గిస్తుంది."],
      kn: ["ಬಿಕ್ಕಟ್ಟಿನ ಸಂದರ್ಭದಲ್ಲಿ ತಾಳ್ಮೆ ಮತ್ತು ನಿಖರವಾದ ಯೋಜನೆ ಅಗತ್ಯ.", "ಯಶಸ್ವಿ ನಾಯಕತ್ವವು ಪ್ರತಿಕೂಲ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳುವಲ್ಲಿ ಅಡಗಿದೆ."],
      ml: ["പ്രതിസന്ധി ഘട്ടങ്ങളിൽ പതറാതെ തന്ത്രപരമായ തീരുമാനങ്ങൾ എടുക്കുകയാണ് പ്രധാനം.", "അപകടങ്ങളെ മുൻകൂട്ടി കാണുന്നത് ബിസിനസ്സിലെ നഷ്ടം കുറയ്ക്കും."],
      bn: ["কঠিন সময়ে ধৈর্য এবং সুনির্দিষ্ট পরিকল্পনাই ঘুরে দাঁড়ানোর একমাত্র উপায়।", "ঝুঁকি পূর্বে চিহ্নিত করা সম্ভাব্য ক্ষতি অনেকখানি কমিয়ে দেয়।"]
    }
  }
];

export default function YazhiAgentSpace() {
  const [activeDomain, setActiveDomain] = useState<DomainInfo>(DOMAINS[0]);
  const [activeLang, setActiveLang] = useState<LanguageCode>("ta");
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionLatency, setSessionLatency] = useState(250);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages whenever agent domain or language changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: activeDomain.welcomeMessages[activeLang] || activeDomain.welcomeMessages["ta"],
      },
    ]);
    // Randomize slightly for realistic display
    setSessionLatency(Math.floor(Math.random() * 80) + 210);
  }, [activeDomain, activeLang]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle sending a message
  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsgId = `user_${Date.now()}`;
    const newMessages = [...messages, { id: userMsgId, role: "user" as const, text }];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    // Simulate agent latency & thinking
    const thinkingTime = Math.floor(Math.random() * 800) + 1200; // 1.2s - 2s
    setTimeout(() => {
      // Find matching mock reply
      let replyText = "";
      const domainReplies = activeDomain.mockReplies?.[activeLang];
      if (domainReplies && domainReplies[text]) {
        replyText = domainReplies[text];
      } else {
        // Fallback random response
        const fallbackList = activeDomain.fallbackReplies[activeLang] || activeDomain.fallbackReplies["ta"] || [];
        const randomIndex = Math.floor(Math.random() * (fallbackList.length || 1));
        replyText = fallbackList[randomIndex] || "Response generated by Adhan-7B.";
      }

      setMessages((prev) => [
        ...prev,
        { id: `assistant_${Date.now()}`, role: "assistant", text: replyText },
      ]);
      setIsTyping(false);
    }, thinkingTime);
  };

  // UI labels based on chosen language
  const labels: Record<string, Record<LanguageCode, string>> = {
    title: {
      ta: "யாழி பன்மொழி முகவர் அரங்கம்",
      en: "Yazhi Multi-Lingual Agent Space",
      hi: "याझी बहुभाषी एजेंट स्पेस",
      te: "యాళి బహుభాషా ఏజెంట్ స్పేస్",
      kn: "ಯาಳಿ ಬಹುಭಾಷಾ ಏಜೆಂಟ್ ಸ್ಪೇಸ್",
      ml: "യാഴി ബഹുഭാഷാ ഏജന്റ് സ്പേസ്",
      bn: "যাঝি বহুভাষী এজেন্ট স্পেস"
    },
    subtitle: {
      ta: "இறையாண்மை பன்மொழி இந்திய முகவர் தளம் · chat.yazhi.dev",
      en: "Sovereign Multi-Lingual Indic Agent Platform · chat.yazhi.dev",
      hi: "संप्रभु बहुभाषी भारतीय एजेंट मंच · chat.yazhi.dev",
      te: "సార్వభౌమ బహుభాషా భారతీయ ఏజెంట్ ప్లాట్‌ఫారమ్ · chat.yazhi.dev",
      kn: "ಸಾರ್ವಭೌಮ ಬಹುಭಾಷಾ ಭಾರತೀಯ ಏಜೆಂಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ · chat.yazhi.dev",
      ml: "സാർവഭൗമ ബഹുഭാഷാ ഇന്ത്യൻ ഏജന്റ് പ്ലാറ്റ്ഫോം · chat.yazhi.dev",
      bn: "সার্বভৌম বহুভাষী ভারতীয় এজেন্ট প্ল্যাটফর্ম · chat.yazhi.dev"
    },
    domainTitle: {
      ta: "ஐந்திணைக் களங்கள்",
      en: "Five Thinai Domains",
      hi: "पांच थिनई क्षेत्र",
      te: "ఐదు తిణై రంగాలు",
      kn: "ಐದು ತಿಣೈ ಕ್ಷೇತ್ರಗಳು",
      ml: "അഞ്ച് തിണകൾ",
      bn: "পাঁচটি থিনৈ ক্ষেত্র"
    },
    inputPlaceholder: {
      ta: "உங்கள் கேள்வியைக் கேளுங்கள் அல்லது ஒரு யோசனையைத் தேர்வுசெய்யுங்கள்...",
      en: "Ask your question or select a suggestion below...",
      hi: "अपना प्रश्न पूछें या नीचे दिए गए सुझावों को चुनें...",
      te: "మీ ప్రశ్న అడగండి లేదా క్రింది సూచనలను ఎంచుకోండి...",
      kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಕೆಳಗಿನ ಸಲಹೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
      ml: "നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള നിർദ്ദേശങ്ങൾ തിരഞ്ഞെടുക്കുക...",
      bn: "আপনার প্রশ্নটি করুন বা নিচে দেওয়া পরামর্শগুলি থেকে বেছে নিন..."
    },
    statusLabel: {
      ta: "செயலில் உள்ளது",
      en: "Active & Latency Optimized",
      hi: "सक्रिय और उत्तरदायी",
      te: "క్రియాశీలకంగా ఉంది",
      kn: "ಸಕ್ರಿಯವಾಗಿದೆ",
      ml: "സജീവമാണ്",
      bn: "সক্রিয় রয়েছে"
    },
    statusModel: {
      ta: "Adhan-7B இறையாண்மை மாதிரி",
      en: "Adhan-7B Sovereign Model",
      hi: "अधन-7B संप्रभु मॉडल",
      te: "అధన్-7B సార్వభౌమ మోడల్",
      kn: "ಅಧನ್-7B ಸಾರ್ವಭೌಮ ಮಾದರಿ",
      ml: "അഥൻ-7B സാർവഭൗമ മോഡൽ",
      bn: "অধন-7B সার্বভৌম মডেল"
    },
    sendBtn: {
      ta: "அனுப்புக", en: "Send", hi: "भेजें", te: "పంపండి", kn: "ಕಳುಹಿಸಿ", ml: "അയക്കുക", bn: "পাঠান"
    },
    backHome: {
      ta: "← முகப்புப்பக்கம்", en: "← Back Home", hi: "← मुख्य पृष्ठ", te: "← హోమ్ పేజీ", kn: "← ಮುಖಪುಟ", ml: "← ഹോം പേജ്", bn: "← হোম পেজ"
    },
    reqDoc: {
      ta: "API தேவைகள்", en: "API Requirements", hi: "एपीआई आवश्यकताएं", te: "ఏపీఐ అవసరాలు", kn: "ಎಪಿಐ ಅವಶ್ಯಕತೆಗಳು", ml: "എപിഐ ആവശ്യകതകൾ", bn: "এপিআই প্রয়োজনীয়তা"
    }
  };

  const getLabel = (key: string) => {
    return labels[key]?.[activeLang] || labels[key]?.["en"] || key;
  };

  // Agent theme styling mapper
  const getThemeStyles = (domainKey: string) => {
    switch (domainKey) {
      case "marutham":
        return {
          glow: "from-emerald-500/10 to-transparent",
          border: "border-emerald-500/20",
          activeBg: "bg-emerald-950/40 border-emerald-500/50 text-emerald-400",
          iconBg: "bg-emerald-500/10 text-emerald-400",
          accentColor: "#10b981"
        };
      case "kurinji":
        return {
          glow: "from-violet-500/10 to-transparent",
          border: "border-violet-500/20",
          activeBg: "bg-violet-950/40 border-violet-500/50 text-violet-400",
          iconBg: "bg-violet-500/10 text-violet-400",
          accentColor: "#8b5cf6"
        };
      case "neytal":
        return {
          glow: "from-sky-500/10 to-transparent",
          border: "border-sky-500/20",
          activeBg: "bg-sky-950/40 border-sky-500/50 text-sky-400",
          iconBg: "bg-sky-500/10 text-sky-400",
          accentColor: "#0ea5e9"
        };
      case "mullai":
        return {
          glow: "from-teal-500/10 to-transparent",
          border: "border-teal-500/20",
          activeBg: "bg-teal-950/40 border-teal-500/50 text-teal-400",
          iconBg: "bg-teal-500/10 text-teal-400",
          accentColor: "#14b8a6"
        };
      case "palai":
        return {
          glow: "from-amber-500/10 to-transparent",
          border: "border-amber-500/20",
          activeBg: "bg-amber-950/40 border-amber-500/50 text-amber-400",
          iconBg: "bg-amber-500/10 text-amber-400",
          accentColor: "#f59e0b"
        };
      default:
        return {
          glow: "from-gold/10 to-transparent",
          border: "border-gold/20",
          activeBg: "bg-night-2 border-gold text-gold",
          iconBg: "bg-gold/10 text-gold",
          accentColor: "#e3b458"
        };
    }
  };

  const activeTheme = getThemeStyles(activeDomain.key);

  return (
    <div className="min-h-screen bg-night text-ivory flex flex-col font-body antialiased selection:bg-gold selection:text-night overflow-x-hidden">
      {/* Background World Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000 opacity-60"
        style={{
          background: `
            radial-gradient(900px 600px at 80% -10%, ${activeTheme.accentColor}15, transparent 70%),
            radial-gradient(800px 500px at 10% 40%, ${activeTheme.accentColor}10, transparent 70%)
          `
        }}
      />

      {/* Top Header Navigation */}
      <header className="border-b border-ivory/10 bg-night/85 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl md:text-2xl font-serif font-bold text-gold">யாழி</span>
              <span className="text-xs font-mono border border-gold/30 rounded-full px-2 py-0.5 text-gold/80">chat.dev</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-xs md:text-sm font-mono text-ivory-dim hover:text-ivory border border-ivory/10 rounded-lg px-3 py-1.5 hover:bg-ivory/5 transition-all"
            >
              {getLabel("backHome")}
            </Link>
            <a 
              href="/yazhi-api-requirements.md"
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:inline-flex text-xs font-mono text-gold/80 hover:text-gold border border-gold/20 rounded-lg px-3 py-1.5 bg-gold/5 hover:bg-gold/10 transition-all"
            >
              📄 {getLabel("reqDoc")}
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 z-10 relative">
        
        {/* Left Sidebar - Domain Selection */}
        <aside className="w-full lg:w-[360px] flex flex-col gap-4 shrink-0">
          <div className="bg-night-2/80 border border-ivory/10 rounded-2xl p-4 md:p-5 backdrop-blur">
            <h2 className="text-xs font-bold text-gold uppercase tracking-widest font-mono mb-4">
              {getLabel("domainTitle")}
            </h2>
            <div className="flex flex-col gap-2.5">
              {DOMAINS.map((domain) => {
                const isSelected = activeDomain.id === domain.id;
                const domainTheme = getThemeStyles(domain.key);
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3.5 group
                      ${isSelected 
                        ? domainTheme.activeBg 
                        : "bg-night border-ivory/5 hover:border-ivory/20 text-ivory-dim hover:text-ivory"}`}
                  >
                    <span className={`text-2xl p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110 duration-300
                      ${domainTheme.iconBg}`}
                    >
                      {domain.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm tracking-tight">
                        {activeLang === "ta" ? domain.taName : domain.enName}
                      </p>
                      <p className="text-xs text-ivory-dim/75 line-clamp-2 mt-1 leading-normal font-light">
                        {activeLang === "ta" ? domain.taDesc : domain.enDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info Block */}
          <div className="bg-night-2/40 border border-ivory/5 rounded-2xl p-4 hidden lg:flex flex-col gap-2.5">
            <p className="text-xs font-mono text-gold/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {getLabel("statusLabel")}
            </p>
            <p className="text-xs text-ivory-dim/70 leading-relaxed">
              {getLabel("statusModel")}.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-ivory/10 text-left text-[11px] font-mono text-ivory-dim/60">
              <div>Latency: <span className="text-white">{sessionLatency}ms</span></div>
              <div>Context: <span className="text-white">8192 max</span></div>
            </div>
          </div>
        </aside>

        {/* Center/Right - Chat Interface Panel */}
        <main className="flex-1 flex flex-col bg-night-2/80 border border-ivory/10 rounded-2xl overflow-hidden backdrop-blur min-h-[580px] md:min-h-[640px]">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-ivory/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-night-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeDomain.icon}</span>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {activeLang === "ta" ? activeDomain.taName : activeDomain.enName}
                </h3>
                <p className="text-xs font-mono text-gold/80 mt-0.5">
                  {getLabel("statusModel")}
                </p>
              </div>
            </div>

            {/* Language Selector Dropdown/Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {LANGUAGES.map((lang) => {
                const isActive = activeLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLang(lang.code)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0
                      ${isActive 
                        ? "bg-white text-black" 
                        : "bg-night hover:bg-ivory/5 text-ivory-dim hover:text-ivory border border-ivory/5"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Log Container */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 max-h-[420px] md:max-h-[500px]">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isAgent = message.role === "assistant";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 leading-relaxed text-sm shadow-md whitespace-pre-wrap
                      ${isAgent 
                        ? "bg-night/70 text-ivory border border-ivory/10" 
                        : "bg-white text-black font-semibold"}`}
                    >
                      {/* Message Content */}
                      <p className="text-sm tracking-wide leading-relaxed font-light">
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-night/50 text-ivory/60 border border-ivory/5 rounded-2xl px-4 py-3 flex items-center gap-1.5 font-mono text-xs">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="ml-1 text-[11px] uppercase tracking-wider">{activeLang === "ta" ? "சிந்திக்கிறது..." : "thinking..."}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Dynamic Interactive Suggestions Bar */}
          <div className="px-4 py-2 border-t border-ivory/5 bg-night/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {activeDomain.suggestions[activeLang]?.map((sug, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(sug.text)}
                disabled={isTyping}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium shrink-0 transition-all border
                  ${isTyping 
                    ? "opacity-40 cursor-not-allowed bg-night/10 border-ivory/5 text-ivory-dim/50" 
                    : "bg-night/60 hover:bg-white hover:text-black hover:border-white border-ivory/10 text-gold/95 hover:shadow-lg"}`}
              >
                ✨ {sug.label}
              </button>
            ))}
          </div>

          {/* User Input Area */}
          <div className="p-4 border-t border-ivory/10 bg-night-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={getLabel("inputPlaceholder")}
                disabled={isTyping}
                className="flex-1 bg-black/50 border border-ivory/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`px-5 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
                  ${!inputText.trim() || isTyping 
                    ? "bg-ivory/10 text-ivory-dim/40 cursor-not-allowed" 
                    : "bg-gold text-night hover:bg-gold/90 hover:scale-[1.02]"}`}
              >
                {getLabel("sendBtn")}
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] font-mono text-ivory-dim/45 mt-3 px-1">
              <div>{getLabel("statusModel")}</div>
              <div>Secure Local Handshake (chat.yazhi.dev sandbox)</div>
            </div>
          </div>

        </main>
      </div>

      {/* Footer Branding Area */}
      <footer className="border-t border-ivory/5 bg-night-2 py-6 text-center mt-auto z-10">
        <p className="text-xs text-ivory-dim/60 font-mono">
          © 2026 யாழி • Yazhi. Sovereign AI & Language Initiative. Built for multi-lingual Indic space.
        </p>
      </footer>
    </div>
  );
}
