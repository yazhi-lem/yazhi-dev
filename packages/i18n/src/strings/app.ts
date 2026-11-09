/** In-app UI strings — Circle sign-in, Mission Control, the builder docs
    chrome and the onboarding / profile pages.

    ⚠️ Tamil here is a DRAFT pending native review; ⚠️ Hindi here is a
    MACHINE DRAFT. See `docs/i18n/HINDI-REVIEW.md`. One entry per line,
    `[ta, en, hi]`.

    Persona text, system prompts and conversation starters are NOT here —
    they are agent content (`packages/bubble/src/lib/agents.ts`,
    `src/lib/chat/agents.ts`). The one exception is `chat.copy` in
    `./chat.ts`: the copy button's own label. */

export const APP_STRINGS = {
  // ── Circle dialog ─────────────────────────────────────────────────────
  "circle.eyebrow": ["வட்டம் · மிஷன் கண்ட்ரோல்", "Circle · Mission Control", "सर्कल · मिशन कंट्रोल"],
  "circle.yourCircle": ["உங்கள் வட்டம்", "Your Circle", "आपका सर्कल"],
  "circle.signIn": ["உள்நுழைக", "Sign in", "साइन इन करें"],
  "circle.joinBuilder": ["உருவாக்குநராக இணைக", "Join as a builder", "बिल्डर के रूप में जुड़ें"],
  "circle.close": ["மூடு", "Close", "बंद करें"],
  "circle.checking": ["உங்கள் அமர்வைச் சரிபார்க்கிறோம்…", "Checking your session…", "आपका सत्र जाँच रहे हैं…"],
  "circle.name": ["பெயர்", "Name", "नाम"],
  "circle.email": ["மின்னஞ்சல்", "Email", "ईमेल"],
  "circle.account": ["கணக்கு", "Account", "खाता"],
  "circle.missionOn": ["மிஷன் கண்ட்ரோல் இயங்குகிறது: உங்கள் கணக்கு, கருப்பொருள், அரட்டை அமைப்புகளுக்கு மூன்று-குமிழ்ச் சின்னத்தை அழுத்துங்கள். நீங்கள் வெளியிடும் குமிழ்கள் இந்தக் கணக்கால் கையொப்பமிடப்படும் — அவற்றை", "Mission Control is on: press the three-bubble mark for your account, the theme and your chat settings. Bubbles you publish are signed with this account — build them from the", "मिशन कंट्रोल चालू है: अपने खाते, थीम और चैट सेटिंग्स के लिए तीन-बुलबुले वाले चिह्न को दबाएँ। आपके प्रकाशित बबल इसी खाते से हस्ताक्षरित होते हैं — उन्हें यहाँ बनाएँ:"],
  "circle.uiLibrary": ["UI நூலகம்", "UI library", "UI लाइब्रेरी"],
  "circle.done": ["முடிந்தது", "Done", "हो गया"],
  "circle.signOut": ["வெளியேறு", "Sign out", "साइन आउट"],
  "circle.notConnected": ["இந்த வரிசைப்படுத்தலில் வட்டம் உள்நுழைவு இன்னும் இணைக்கப்படவில்லை. yazhi-api-ஐ அணுக", "Circle sign-in isn't connected on this deployment yet. Set", "इस डिप्लॉयमेंट पर सर्कल साइन-इन अभी जुड़ा नहीं है। yazhi-api तक पहुँचने के लिए सेट करें"],
  "circle.notConnected2": ["அமைக்கவும் —", "to reach yazhi-api — see", "— देखें"],
  "circle.circleDocsLink": ["குமிழ் UI → வட்டம்", "Bubble UI → Circle", "बबल UI → सर्कल"],
  "circle.notConnected3": ["பாருங்கள். குமிழ் UI-யும் UI நூலகமும் இங்கேயே இயங்கும்.", "The Bubble UI and the UI library still work locally.", "बबल UI और UI लाइब्रेरी स्थानीय रूप से चलते रहेंगे।"],
  "circle.wakesAfter": ["வட்டக் கணக்கு இருந்தால் மிஷன் கண்ட்ரோல் விழித்துக்கொள்ளும்.", "Mission Control wakes once you have a Circle account.", "सर्कल खाता होते ही मिशन कंट्रोल जाग जाएगा।"],
  "circle.password": ["கடவுச்சொல்", "Password", "पासवर्ड"],
  "circle.adult": ["நான் 18 வயது அல்லது அதற்கு மேல். (குழந்தைகள் பெற்றோருடன் குடும்ப வழியாக யாழைப் பயன்படுத்துகிறார்கள்.)", "I am 18 or older. (Children use Yazh through the family flow, with a parent.)", "मैं 18 वर्ष या अधिक हूँ। (बच्चे अभिभावक के साथ परिवार-मार्ग से याझ का उपयोग करते हैं।)"],
  "circle.conductPre": ["நான்", "I'll follow the", "मैं"],
  "circle.conductLink": ["உருவாக்குநர் நடத்தை விதிகளைப்", "builder code of conduct", "बिल्डर आचार संहिता"],
  "circle.conductPost": ["பின்பற்றுவேன்.", ".", "का पालन करूँगा।"],
  "circle.createAccount": ["வட்டக் கணக்கை உருவாக்கு", "Create Circle account", "सर्कल खाता बनाएँ"],
  "circle.newHere": ["புதியவரா?", "New here?", "नए हैं?"],
  "circle.haveAccount": ["ஏற்கனவே வட்டக் கணக்கு உள்ளதா?", "Already have a Circle account?", "पहले से सर्कल खाता है?"],
  "circle.inviteOnly": ["பைலட்டின்போது உருவாக்குநர் பதிவு அழைப்பின் அடிப்படையில் மட்டும் — Discord-இல் கேளுங்கள்.", "Builder sign-up is invite-only during the pilot — ask in Discord.", "पायलट के दौरान बिल्डर पंजीकरण निमंत्रण-आधारित है — Discord में पूछें।"],

  // ── Join Circle button ───────────────────────────────────────────────
  "circle.joinCta": ["வட்டத்தில் இணைக", "Join Circle", "सर्कल से जुड़ें"],

  // ── Mission Control menu (src/components/mission) ────────────────────
  "mission.accountTitle": ["வட்டக் கணக்கு", "Circle account", "सर्कल खाता"],
  "mission.signingOut": ["வெளியேறுகிறது…", "Signing out…", "साइन आउट हो रहा है…"],
  "mission.goTo": ["இங்கே செல்", "Go to", "यहाँ जाएँ"],
  "mission.placeChat": ["யாழி அரட்டை", "Yazhi Chat", "याझी चैट"],
  "mission.placeChatNote": ["யாழியின் முகவர்களுடன் பேசுங்கள்", "Talk to Yazhi's agents", "याझी के एजेंट से बात करें"],
  "mission.placeBubble": ["குமிழ் UI", "Bubble UI", "बबल UI"],
  "mission.placeBubbleNote": ["UI நூலகமும் வடிவமைப்பு முறையும்", "The UI library and design system", "UI लाइब्रेरी और डिज़ाइन सिस्टम"],
  "mission.placeWorkspaces": ["பணியிடங்கள்", "Workspaces", "वर्कस्पेस"],
  "mission.placeWorkspacesNote": ["குரு, நியாய, குறள், கடை", "Guru, Nyaya, Kural and Kadai", "गुरु, न्याय, कुरल और कडै"],
  "mission.menuLabel": ["மிஷன் கண்ட்ரோல்", "Mission Control", "मिशन कंट्रोल"],
  "mission.theme": ["கருப்பொருள்", "Theme", "थीम"],

  // ── Workspace launcher ───────────────────────────────────────────────
  "workspaces.all": ["எல்லாப் பணியிடங்களும்", "All workspaces", "सभी वर्कस्पेस"],
  "workspaces.home": ["யாழி முகப்பு", "Yazhi home", "याझी मुखपृष्ठ"],

  // ── Dev shell (/bubble chrome) ───────────────────────────────────────
  "dev.homeLabel": ["யாழி — முகப்புப் பக்கம்", "Yazhi home", "याझी — मुखपृष्ठ"],
  "dev.brand": ["யாழி", "Yazhi", "याझी"],
  "dev.brandSuffix": ["குமிழ் UI", "Bubble UI", "बबल UI"],
  "dev.navLabel": ["குமிழ்", "Bubble", "बबल"],
  "dev.navLibrary": ["UI நூலகம்", "UI library", "UI लाइब्रेरी"],
  "dev.navChat": ["அரட்டை", "Chat", "चैट"],
  "dev.navWorkspaces": ["பணியிடங்கள்", "Workspaces", "वर्कस्पेस"],

  // ── Bubble UI playground (/bubble) ───────────────────────────────────
  "bubble.onlineTip": ["இணையத்தில் — yazhi.dev வழியாக yazhi-api அணுகலாம்", "Online — yazhi-api reachable through yazhi.dev", "ऑनलाइन — yazhi.dev के ज़रिए yazhi-api उपलब्ध"],
  "bubble.offlineTip": ["ஆஃப்லைன் — சாதன மாதிரிகள் மட்டும்", "Offline — on-device models only", "ऑफ़लाइन — केवल डिवाइस मॉडल"],
  "bubble.online": ["online", "online", "ऑनलाइन"],
  "bubble.offline": ["offline", "offline", "ऑफ़लाइन"],
  "bubble.runtimeSettings": ["இயக்க அமைப்புகள்", "Runtime settings", "रनटाइम सेटिंग्स"],
  "bubble.runtime": ["இயக்கம்", "Runtime", "रनटाइम"],
  "bubble.auto": ["auto", "auto", "स्वचालित"],
  "bubble.onDevice": ["சாதனத்தில்", "on-device", "डिवाइस पर"],
  "bubble.endpointLabel": ["சாதன முடிவுப்புள்ளி (OpenAI-இன் இணக்கமானது)", "On-device endpoint (OpenAI-compatible)", "इस डिवाइस का एंडपॉइंट (OpenAI-संगत)"],
  "bubble.thinking": ["யோசிக்கிறார்", "Thinking", "सोच रहा है"],
  "bubble.viaDevice": ["சாதன மாதிரி வழியாக", "via on-device model", "डिवाइस मॉडल के ज़रिए"],
  "bubble.viaApi": ["yazhi-api வழியாக", "via yazhi-api", "yazhi-api के ज़रिए"],
  "bubble.placeholder": ["{bubble} உடன் எழுதுங்கள்…", "Message {bubble}…", "{bubble} को संदेश…"],

  // ── Anatomy figure labels ────────────────────────────────────────────
  "anatomy.title": ["குமிழ் UI உடற்கூறு", "Bubble UI anatomy", "बबल UI शरीर-रचना"],
  "anatomy.capitol": ["கேபிடல்", "Capitol", "कैपिटल"],
  "anatomy.canvas": ["கேன்வாஸ்", "Canvas", "कैनवास"],
  "anatomy.canvasNote": ["செயலில் உள்ள குமிழின் உரையாடல்", "the active bubble's conversation", "सक्रिय बबल की बातचीत"],
  "anatomy.tray": ["தட்டு", "Tray", "ट्रे"],
  "anatomy.insider": ["உள்ளகம்", "Insider", "आंतरिक"],
  "anatomy.risk": ["ஆபத்து", "risk", "जोखिम"],
  "anatomy.onlyDeclared": ["அறிவிக்கப்பட்ட", "only declared", "केवल घोषित"],
  "anatomy.permissions": ["அனுமதிகளே", "permissions cross", "अनुमतियाँ पार होती हैं"],
  "anatomy.composer": ["எழுதுபெட்டி", "Composer", "कंपोज़र"],
  "anatomy.missionControl": ["மிஷன் கண்ட்ரோல்", "Mission Control", "मिशन कंट्रोल"],
  "anatomy.send": ["அனுப்பு", "send", "भेजें"],
  "anatomy.offlineTop": ["இணையம் இல்லாமல் இயங்கும் · சாதன மாதிரிகள்", "Runs without internet · on-device models", "इंटरनेट के बिना चलता है · डिवाइस मॉडल"],
  "anatomy.offlineSub": ["இயல்பாக 0% மேகம் — எல்லாமே வட்ட அடையாளத்துடன்", "0% cloud by default — Circle identity throughout", "डिफ़ॉल्ट रूप से 0% क्लाउड — हर जगह सर्कल पहचान"],

  // ── Page metadata (server, read via ui()) ────────────────────────────
  "chat.metadataTitle": [
    "யாழி அரட்டை — யாழியின் முகவர்கள், அவர்களின் நிலங்களில்",
    "யாழி Chat — Yazhi's agents, in their landscapes",
    "याझी चैट — याझी के एजेंट, उनके भूदृश्यों में",
  ],
  "chat.metadataDescription": [
    "குமிழ் UI-இல் யாழியின் முகவர்களுடன் பேசுங்கள்: ஒவ்வொருவரும் ஒரு சங்க நிலத்தில் வசிக்கிறார்கள்; பதில்கள் yazhi-api-இலிருந்தோ உங்கள் சாதனத்தில் உள்ள மாதிரியிலிருந்தோ வரும்.",
    "Talk to Yazhi's agents in the Bubble UI: each one lives in a Sangam landscape, replies stream from yazhi-api or a model on your own device.",
    "बबल UI में याझी के एजेंट से बात करें: हर एजेंट एक संगम भूदृश्य में रहता है, उत्तर yazhi-api या आपके डिवाइस के मॉडल से आते हैं।",
  ],

  // ── Footer chrome ────────────────────────────────────────────────────
  "timer.label": ["யாழி விழிப்பு", "Yazhi Awakening", "याझी जागरण"],
  "timer.remaining": [
    "{days} நாட்கள் {hrs} மணி {mins} நிமிடம் {secs} வினாடிகள் எஞ்சியுள்ளன",
    "{days} days {hrs} hours {mins} minutes {secs} seconds remaining",
    "{days} दिन {hrs} घंटे {mins} मिनट {secs} सेकंड शेष",
  ],
  "timer.dayShort": ["நா", "d", "दिन"],
  "whatsapp.groupLabel": [
    "யாழி WhatsApp குழுவில் இணையுங்கள்",
    "Join the Yazhi WhatsApp group",
    "याझी WhatsApp समूह से जुड़ें",
  ],

  // ── Onboarding ───────────────────────────────────────────────────────
  "onboarding.welcomeBuilder": ["வருக, உருவாக்குநரே", "Welcome, builder", "स्वागत है, बिल्डर"],
  "onboarding.joinDeveloper": ["உருவாக்குநராக இணைக", "Join as a Developer", "डेवलपर के रूप में जुड़ें"],
  "onboarding.joinNetwork": ["வலையமைப்பில் இணைக", "Join the Network", "नेटवर्क से जुड़ें"],
  "onboarding.subDeveloper": ["உங்கள் தாய்மொழிக்காக உருவாக்குகிறீர்களா? இங்கே தொடங்குங்கள்.", "Building for your mother tongue? Start here.", "अपनी मातृभाषा के लिए बना रहे हैं? यहाँ से शुरू करें।"],
  "onboarding.subNetwork": ["உங்கள் node-ஐ அடையாளம் காட்டுங்கள்.", "Identify your node.", "अपना नोड पहचानें।"],
  "onboarding.yazhName": ["யாழ் பெயர்", "Yazh Name", "याझ नाम"],
  "onboarding.yazhNamePlaceholder": ["எ.கா. shadow_coder", "e.g. shadow_coder", "जैसे shadow_coder"],
  "onboarding.phone": ["தொலைபேசி எண்", "Phone Number", "फ़ोन नंबर"],
  "onboarding.phoneTitle": ["7–16 இலக்கங்கள்; +, இடைவெளிகள், கோடுகள், அடைப்புக்குறிகள் அனுமதிக்கப்படும்", "7–16 digits; +, spaces, dashes, and parentheses allowed", "7–16 अंक; +, स्पेस, डैश और कोष्ठक मान्य हैं"],
  "onboarding.phonePlaceholder": ["தொலைபேசி எண்ணை உள்ளிடுங்கள்", "Enter phone number", "फ़ोन नंबर दर्ज करें"],
  "onboarding.staysBrowser": ["உங்கள் உலாவியிலேயே இருக்கும் — சேவையகத்திற்கு அனுப்பப்படாது.", "Stays in your browser — never sent to a server.", "आपके ब्राउज़र में ही रहता है — सर्वर पर कभी नहीं भेजा जाता।"],
  "onboarding.privacyNote": ["தனியுரிமைக் குறிப்பு", "Privacy note", "गोपनीयता नोट"],
  "onboarding.consentDeveloper": ["தனியுரிமைக் குறிப்பைப் படித்துவிட்டேன்.", "I've read the privacy note.", "मैंने गोपनीयता नोट पढ़ लिया है।"],
  "onboarding.consentNetwork": ["நான் 13 வயது அல்லது அதற்கு மேல் — அல்லது பெற்றோர்/பாதுகாவலர் உதவுகிறார்கள் — மேலும் தனியுரிமைக் குறிப்பைப் படித்துவிட்டேன்.", "I'm 13 or older — or a parent/guardian is helping me — and I've read the privacy note.", "मैं 13 वर्ष या अधिक हूँ — या अभिभावक/संरक्षक साथ हैं — और मैंने गोपनीयता नोट पढ़ लिया है।"],
  "onboarding.unknownRegion": ["தெரியாத பிரதேசம்", "Unknown region", "अज्ञात क्षेत्र"],
  "onboarding.joining": ["இணைகிறது…", "Joining…", "जुड़ रहे हैं…"],
  "onboarding.joinDeveloperCta": ["உருவாக்குநராக இணைக →", "Join as a Developer →", "डेवलपर के रूप में जुड़ें →"],
  "onboarding.joinNetworkCta": ["வலையமைப்பில் இணைக →", "Join the Network →", "नेटवर्क से जुड़ें →"],
  "onboarding.joinDiscord": ["Discord-இல் இணைக →", "Join the Discord →", "Discord से जुड़ें →"],
  "onboarding.continueProfile": ["சுயவிவரத்திற்குத் தொடரவும் →", "Continue to profile →", "प्रोफ़ाइल पर जाएँ →"],

  // ── Profile pages ────────────────────────────────────────────────────
  "profile.configTitle": ["சுயவிவர அமைப்பு", "Profile Configuration", "प्रोफ़ाइल सेटिंग"],
  "profile.configSub": ["வலையமைப்பு node-களில் உங்கள் அடையாளத்தை முழுமைப்படுத்துங்கள்.", "Flesh out your identity across the network nodes.", "नेटवर्क नोड्स पर अपनी पहचान पूरी करें।"],
  "profile.bio": ["சுயவிவரம் / இலக்கு", "Bio / Objective", "बायो / उद्देश्य"],
  "profile.bioPlaceholder": ["அடுத்த தலைமுறை பரவலாக்கப்பட்ட கணினியை உருவாக்குகிறேன்…", "Building the next generation of decentralised compute…", "अगली पीढ़ी के विकेंद्रीकृत कंप्यूट की रचना…"],
  "profile.stack": ["முதன்மை தொழில்நுட்பத் தொகுப்பு (கமாவால் பிரிக்கப்பட்டது)", "Primary Tech Stack (Comma separated)", "मुख्य टेक स्टैक (कॉमा से अलग)"],
  "profile.stackPlaceholder": ["எ.கா. Rust, React, Python, Postgres", "e.g. Rust, React, Python, Postgres", "जैसे Rust, React, Python, Postgres"],
  "profile.availability": ["கிடைக்கும் நிலை", "Availability", "उपलब्धता"],
  "profile.availOpen": ["கூட்டு வேலைகளுக்கும் ஒப்பந்த வேலைகளுக்கும் திறந்தவர்", "Open to Collab & Gigs", "सहयोग और काम के लिए उपलब्ध"],
  "profile.availEmployed": ["தற்போது வேலையில் (சாதாரண ஹேக்கிங் மட்டும்)", "Currently Employed (Casual Hacking Only)", "वर्तमान में नौकरी में (केवल शौक़िया कोडिंग)"],
  "profile.availClosed": ["தேடவில்லை", "Not Looking", "खोज नहीं रहे"],
  "profile.skipForNow": ["இப்போதைக்குத் தவிர்", "Skip for now", "अभी छोड़ें"],
  "profile.syncing": ["ஒத்திசைக்கிறது…", "Syncing…", "सिंक हो रहा है…"],
  "profile.save": ["சுயவிவரத்தைச் சேமி", "Save Profile", "प्रोफ़ाइल सहेजें"],
  "profile.noNodePre": ["திருத்த node எதுவும் கிடைக்கவில்லை.", "No node found to edit.", "संपादित करने के लिए कोई नोड नहीं मिला।"],
  "profile.noNodePost": ["முதலில் இணையுங்கள்.", "first.", "पहले जुड़ें।"],
  "profile.notFound": ["வட்டார node-களில் பயனர் கிடைக்கவில்லை.", "User not found in regional nodes.", "क्षेत्रीय नोड्स में उपयोगकर्ता नहीं मिला।"],
  "profile.backToNetwork": ["← வலையமைப்பிற்குத் திரும்பு", "← Back to Network", "← नेटवर्क पर वापस"],
  "profile.nodeSuffix": ["node", "Node", "नोड"],
  "profile.noBio": ["இன்னும் சுயவிவரம் இல்லை — இந்த node தன் சுயவிவரத்தை அமைக்கவில்லை.", "No bio yet — this node hasn't configured their profile.", "अभी कोई बायो नहीं — इस नोड ने प्रोफ़ाइल सेट नहीं की।"],
  "profile.stackLabel": ["தொகுப்பு:", "Stack:", "स्टैक:"],
  "profile.connect": ["இணைக ⅄", "Connect ⅄", "जुड़ें ⅄"],
  "profile.recentActivity": ["சமீபத்திய செயல்பாடு", "Recent Activity", "हाल की गतिविधि"],
  "profile.noActivity": ["வலையமைப்பில் சமீபத்திய செயல்பாடு இல்லை.", "No recent activity detected on the network.", "नेटवर्क पर हाल की कोई गतिविधि नहीं मिली।"],
} satisfies Record<string, [string, string, string]>;
