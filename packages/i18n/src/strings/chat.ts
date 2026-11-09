/** In-app UI strings — the chat surface (`/chat`).

    These are chrome, not content: labels, buttons, statuses and the copy
    that frames a conversation. They live here rather than in `content.ts`
    because `packages/i18n` owns the reusable UI catalogue and `content.ts`
    is the site's TA/EN marketing copy.

    ⚠️ Tamil here is a DRAFT pending native review; ⚠️ Hindi here is a
    MACHINE DRAFT (`origin: "mt"`, `reviewRequired: true`). See
    `docs/i18n/HINDI-REVIEW.md`.

    One entry per line, `[ta, en, hi]`. */
export type UiTriple = [ta: string, en: string, hi: string];

export const CHAT_STRINGS = {
  // Header
  "chat.skipToComposer": ["செய்திப் பெட்டிக்குச் செல்", "Skip to message box", "संदेश बॉक्स पर जाएँ"],
  "chat.homeLabel": ["யாழி — முகப்புப் பக்கம்", "Yazhi home", "याझी — मुखपृष्ठ"],
  "chat.brand": ["யாழி", "Yazhi", "याझी"],
  "chat.brandSuffix": ["அரட்டை", "Chat", "चैट"],
  "chat.pageTitle": ["யாழி அரட்டை, {agent} உடன்", "Yazhi Chat, with {agent}", "याझी चैट, {agent} के साथ"],
  "chat.runtimeCloudTip": ["பதில்கள் yazhi-api-இலிருந்து வரும்", "Replies come from yazhi-api", "उत्तर yazhi-api से आते हैं"],
  "chat.runtimeDeviceTip": ["பதில்கள் இந்தச் சாதனத்தில் உள்ள மாதிரியிலிருந்து வரும்", "Replies come from a model on this device", "उत्तर इस डिवाइस के मॉडल से आते हैं"],
  "chat.runtimeCloudShort": ["yazhi-api", "yazhi-api", "yazhi-api"],
  "chat.runtimeDeviceShort": ["சாதனத்தில்", "on device", "डिवाइस पर"],
  "chat.offlineSuffix": ["offline", "offline", "ऑफ़लाइन"],
  "chat.threads": ["உரையாடல்கள்", "Threads", "थ्रेड"],
  "chat.panelMission": ["மிஷன் கண்ட்ரோல்", "Mission Control", "मिशन कंट्रोल"],
  "chat.closePanel": ["பேனலை மூடு", "Close panel", "पैनल बंद करें"],
  "chat.close": ["{title} ஐ மூடு", "Close {title}", "{title} बंद करें"],
  "chat.agentsNav": ["முகவர்கள்", "Agents", "एजेंट"],
  "chat.railYazhi": ["யாழி", "Yazhi", "याझी"],
  "chat.railGuests": ["விருந்தினர்", "Guests", "अतिथि"],
  "chat.yazhiAgents": ["யாழி முகவர்கள்", "Yazhi agents", "याझी एजेंट"],
  "chat.guestAgents": ["விருந்தினர் முகவர்கள்", "Guest agents", "अतिथि एजेंट"],
  "chat.newThread": ["புதிய உரையாடல்", "New thread", "नया थ्रेड"],
  "chat.conversationWith": ["{agent} உடன் உரையாடல்", "Conversation with {agent}", "{agent} के साथ बातचीत"],
  "chat.messages": ["செய்திகள்", "Messages", "संदेश"],

  // Welcome
  "chat.welcomeStarts": ["எப்படித் தொடங்கலாம்", "Ways to start", "शुरू करने के तरीके"],
  "chat.agentAbout": ["இந்த முகவர் பற்றி", "About this agent", "इस एजेंट के बारे में"],
  "chat.agentLivesIn": ["{home} இல் வசிக்கிறார்", "Lives in {home}", "{home} में रहता है"],
  "chat.agentApi": ["{provider} · yazhi-api", "{provider} · yazhi-api", "{provider} · yazhi-api"],
  "chat.agentPreview": ["முன்னோட்டம் · {status}", "Preview · {status}", "पूर्वावलोकन · {status}"],
  "chat.agentGuest": ["விருந்தினர் · {provider}", "Guest · {provider}", "अतिथि · {provider}"],
  "chat.agentExternal": ["வெளி மாதிரியில் இயங்குகிறது", "Runs on an outside model", "बाहरी मॉडल पर चलता है"],
  "chat.rule": ["விதி", "Rule", "नियम"],
  "chat.seeAnswers": ["{agent} எப்படிப் பதிலளிக்கிறார் என்பதைப் பாருங்கள்", "See how {agent} answers", "देखें कि {agent} कैसे उत्तर देता है"],
  "chat.sampleQuestion": ["மாதிரிக் கேள்வி:", "Sample question:", "नमूना प्रश्न:"],
  "chat.sampleAnswer": ["மாதிரிப் பதில்:", "Sample answer:", "नमूना उत्तर:"],
  "chat.sampleNote": ["மாதிரி · விளக்கம், நேரடிப் பதில் அல்ல", "Sample · illustrative, not a live answer", "नमूना · केवल उदाहरण, जीवंत उत्तर नहीं"],
  "chat.sampleNoteTamilDraft": ["· தமிழ் வரைவு, அறிஞர் மதிப்பாய்வுக்குப் பின்", "· Tamil is a draft for native review", "· तमिल एक मसौदा है, स्थानीय समीक्षा बाक़ी"],

  // Messages
  "chat.you": ["நீங்கள்:", "You:", "आप:"],
  "chat.agentIsThinking": ["{agent} யோசிக்கிறார்", "{agent} is thinking", "{agent} सोच रहा है"],
  "chat.viaApi": ["yazhi-api", "yazhi-api", "yazhi-api"],
  "chat.viaDevice": ["சாதனத்தில்", "on device", "डिवाइस पर"],
  "chat.copied": ["நகலெடுக்கப்பட்டது", "Copied", "कॉपी हुआ"],
  "chat.copy": ["நகலெடு", "Copy", "कॉपी करें"],
  "chat.thinking": ["யோசிக்கிறார்", "Thinking", "सोच रहा है"],

  // Composer
  "chat.composerLabel": ["செய்தி அனுப்பு", "Send a message", "संदेश भेजें"],
  "chat.placeholder": ["{agent} உடன் எழுதுங்கள்…", "Message to {agent}…", "{agent} को संदेश…"],
  "chat.stopReply": ["பதிலை நிறுத்து", "Stop the reply", "उत्तर रोकें"],
  "chat.send": ["அனுப்பு", "Send", "भेजें"],
  "chat.hintEnter": ["Enter — அனுப்பு · Shift+Enter — புதிய வரி. பதில்கள் தவறாகலாம் — முக்கியமானதைச் சரிபாருங்கள்.", "Enter to send · Shift+Enter for a new line. Replies can be wrong — check what matters.", "भेजने के लिए Enter · नई पंक्ति के लिए Shift+Enter। उत्तर ग़लत भी हो सकते हैं — ज़रूरी बात जाँच लें।"],
  "chat.hintRunsApi": ["yazhi-api-இல் இயங்குகிறது.", "Runs on yazhi-api.", "yazhi-api पर चलता है।"],
  "chat.hintRunsDevice": ["இந்தச் சாதனத்தில் இயங்குகிறது.", "Runs on this device.", "इस डिवाइस पर चलता है।"],

  // Threads panel
  "chat.noThreads": ["இன்னும் உரையாடல்கள் இல்லை. அவை இந்தச் சாதனத்திலேயே இருக்கும்.", "No threads yet. They stay on this device.", "अभी कोई थ्रेड नहीं। वे इसी डिवाइस पर रहते हैं।"],
  "chat.threadAgent": ["முகவர்", "Agent", "एजेंट"],
  "chat.deleteThread": ["உரையாடலை நீக்கு: {title}", "Delete thread: {title}", "थ्रेड हटाएँ: {title}"],

  // Mission panel (chat)
  "chat.theme": ["கருப்பொருள்", "Theme", "थीम"],
  "chat.landscape": ["நிலம்", "Landscape", "भूदृश्य"],
  "chat.followAgent": ["முகவரைப் பின்பற்று", "Follow the agent", "एजेंट का अनुसरण करें"],
  "chat.nowIn": ["இப்போது {landscape}", "Now {landscape}", "अब {landscape}"],
  "chat.whereReplies": ["பதில்கள் எங்கிருந்து வருகின்றன", "Where replies come from", "उत्तर कहाँ से आते हैं"],
  "chat.runtimeAuto": ["தானியங்கி", "Automatic", "स्वचालित"],
  "chat.runtimeAutoNote": ["இணையத்தில் இருக்கும்போது yazhi-api, இல்லையெனில் இந்தச் சாதனம்", "yazhi-api when online, this device when not", "ऑनलाइन होने पर yazhi-api, वरना यह डिवाइस"],
  "chat.runtimeCloud": ["yazhi-api", "yazhi-api", "yazhi-api"],
  "chat.runtimeCloudNote": ["யாழியின் சேவையகங்கள், yazhi.dev வழியாக", "Yazhi's servers, through yazhi.dev", "याझी के सर्वर, yazhi.dev के ज़रिए"],
  "chat.runtimeDevice": ["இந்தச் சாதனத்தில்", "On this device", "इस डिवाइस पर"],
  "chat.runtimeDeviceNote": ["உள்ளூர் மாதிரி; உங்கள் இயந்திரத்தை விட்டு எதுவும் வெளியேறாது", "A local model; nothing leaves your machine", "स्थानीय मॉडल; आपकी मशीन से कुछ बाहर नहीं जाता"],
  "chat.endpointLabel": ["சாதன முடிவுப்புள்ளி (OpenAI-இன் இணக்கமானது)", "On-device endpoint (OpenAI-compatible)", "इस डिवाइस का एंडपॉइंट (OpenAI-संगत)"],
  "chat.localNote": ["உரையாடல்களும் இந்தத் தேர்வுகளும் இந்த உலாவியில் மட்டுமே இருக்கும். நிலங்களும் அவற்றின் இயக்கமும்", "Threads and these choices are kept in this browser only. The landscapes and their motion are described in the", "थ्रेड और ये विकल्प केवल इसी ब्राउज़र में रहते हैं। भूदृश्य और उनकी गति"],
  "chat.localNoteLink": ["குமிழ் UI நூலகத்தில்", "Bubble UI library", "बबल UI लाइब्रेरी"],
} satisfies Record<string, [string, string, string]>;
