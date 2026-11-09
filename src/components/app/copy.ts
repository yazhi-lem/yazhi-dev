/** Every word `/app` says — one object, three locales.

    ⚠️ Tamil here is a **DRAFT pending native review**; ⚠️ Hindi is a
    **MACHINE DRAFT**. Both follow the rules in `docs/i18n/HINDI-REVIEW.md`:
    terms that name a thing (Bubble UI, tray, workspace, Mission Control,
    yazhi-api, Adhan, Avai …) stay as terms and are transliterated, never
    paraphrased into a different concept.

    Why an object and not `@yazhi/i18n`: the hook (`useT`) returns keys only
    when the root `LangProvider` has no catalogue registered, and
    `packages/i18n/src/strings/app.ts` (i18n-core's in-app catalogue, where
    an `app.*` namespace belongs) is outside this task's write scope.

    TODO(i18n-core): move APP_TEXT into `packages/i18n/src/strings/app.ts`
    under the `app.*` namespace, register it with `<LangProvider catalogues>`,
    and replace `useAppText()` with `useT("app")`. The shape is deliberately
    that of a catalogue triple so the move is mechanical.

    Server components read `appText(locale)` (no hooks); client components
    read `useAppText()` from `src/components/app/useAppText.ts`, which follows
    the site's `LangProvider` locale. Nothing here reads `window` during
    render, so server and first client render agree (both start at Tamil). */

import type { Locale } from "@yazhi/i18n";

/** `[ta, en, hi]` — the same triple shape as the i18n catalogues. */
export type AppTriple = readonly [string, string, string];

export const APP_TEXT = {
  // ── the host shell ───────────────────────────────────────────────────
  "app.title": ["யாழி பயன்பாடு", "Yazhi App", "याझी ऐप"],
  "app.eyebrow": ["குமிழ் ஹோஸ்ட் · பயன்பாடு = ஒரு தொகுப்புக் குமிழ்கள்", "Bubble host · an app is a set of bubbles", "बबल होस्ट · ऐप बबल्स का एक सेट है"],
  "app.intro": [
    "ஒரு பயன்பாடு என்பது ஒரு ஹோஸ்ட்டில் இருக்கும் குமிழ்களின் தொகுப்பு: தட்டில் தேர்ந்தெடுங்கள், கேன்வாஸில் அரட்டையாடுங்கள், எழுதுபெட்டியில் எழுதுங்கள். எல்லாம் இணைப்பாகப் பகிரலாம்.",
    "An app is a set of bubbles in one host: choose one in the tray, talk to it on the canvas, type in the composer. Every view is a link you can share.",
    "एक ऐप एक ही होस्ट में बबल्स का समूह है: ट्रे में चुनें, कैनवास पर बात करें, कंपोज़र में लिखें। हर दृश्य साझा करने योग्य लिंक है।",
  ],
  "app.homeLabel": ["யாழி முகப்பு", "Yazhi home", "याझी मुखपृष्ठ"],
  "app.brand": ["யாழி", "Yazhi", "याझी"],
  "app.brandSuffix": ["பயன்பாடு", "App", "ऐप"],
  "app.navLabel": ["பயன்பாட்டு இணைப்புகள்", "App links", "ऐप लिंक"],
  "app.navDocs": ["உருவாக்குநர் ஆவணங்கள்", "Builder docs", "बिल्डर दस्तावेज़"],
  "app.navChat": ["அரட்டை", "Chat", "चैट"],
  "app.navWorkspaces": ["பணியிடங்கள்", "Workspaces", "वर्कस्पेस"],
  "app.backToTray": ["தட்டுக்குத் திரும்பு", "Back to the tray", "ट्रे पर वापस"],
  "app.skip": ["உள்ளடக்கத்திற்குச் செல்", "Skip to the canvas", "कैनवास पर जाएँ"],
  "app.viewToggle": ["தட்டுத் தோற்றத்தை மாற்று", "Switch the tray view", "ट्रे दृश्य बदलें"],
  "app.announceTray": ["தட்டுக்குத் திரும்பியது.", "Back at the tray.", "ट्रे पर वापस।"],
  "app.announceOpen": ["{bubble} திறக்கப்பட்டது.", "{bubble} opened.", "{bubble} खुला।"],

  // ── launcher ─────────────────────────────────────────────────────────
  "app.launcherTitle": ["உங்கள் குமிழ்கள்", "Your bubbles", "आपके बबल"],
  "app.launcherHint": [
    "ஒரு குமிழைத் தேர்ந்தெடுங்கள், அல்லது [ மற்றும் ] விசைகளால் சுழற்றுங்கள்.",
    "Choose a bubble, or cycle with the [ and ] keys.",
    "एक बबल चुनें, या [ और ] कुंजियों से बदलें।",
  ],
  "app.groupApp": ["பயன்பாடுகள்", "App bubbles", "ऐप बबल"],
  "app.groupAgents": ["முகவர்கள்", "Agent bubbles", "एजेंट बबल"],
  "app.groupWorkspaces": ["பணியிடங்கள்", "Workspaces", "वर्कस्पेस"],
  "app.groupTemplates": ["பக்க வார்ப்புருக்கள்", "Page templates", "पेज टेम्पलेट"],
  "app.filterLabel": ["வடிகட்டு", "Filter", "फ़िल्टर"],
  "app.filterAll": ["அனைத்தும்", "All", "सभी"],
  "app.filterTamil": ["தமிழ்", "Tamil", "तमिल"],
  "app.filterEnglish": ["ஆங்கிலம்", "English", "अंग्रेज़ी"],
  "app.filterTelugu": ["தெலுங்கு", "Telugu", "तेलुगु"],
  "app.filterNoMatch": ["இந்த வடிகட்டலுக்கு எந்தக் குமிழும் இல்லை. மீண்டும் எல்லாவற்றையும் காட்ட", "No bubble matches this filter. Choose", "इस फ़िल्टर से कोई बबल नहीं मिलता। चुनें"],
  "app.filterNoMatch2": ["எல்லாம்", "All", "सभी"],
  "app.bubbleLanguage": ["மொழிகள்", "Languages", "भाषाएँ"],
  "app.bubbleRuntime": ["இயக்கம்", "Runtime", "रनटाइम"],
  "app.bubbleCommands": ["கட்டளைகள்", "Commands", "आदेश"],
  "app.bubbleSize": ["அளவு", "Size", "आकार"],
  "app.openBubble": ["திற", "Open", "खोलें"],
  "app.runAction": ["இயக்கு", "Run", "चलाएँ"],
  "app.startersTitle": ["இதில் தொடங்குங்கள்", "Start here", "यहाँ से शुरू करें"],

  // ── canvas ───────────────────────────────────────────────────────────
  "app.canvasLabel": ["கேன்வாஸ்", "Canvas", "कैनवास"],
  "app.threadTitle": ["உரையாடல்", "Conversation", "बातचीत"],
  "app.threadEmpty": [
    "இன்னும் உரையாடல் இல்லை. கீழே எழுதுங்கள் — அல்லது / அழுத்தி எழுதுபெட்டிக்குச் செல்லுங்கள்.",
    "No conversation yet. Write below — or press / to jump to the composer.",
    "अभी कोई बातचीत नहीं। नीचे लिखें — या / दबाकर कंपोज़र पर जाएँ।",
  ],
  "app.deepLinkNote": [
    "இந்தக் குமிழ், இந்தக் கேள்விகளுடன் ஒரு இணைப்பில் திறக்கப்பட்டது. மீண்டும் முழுமையாகத் தொடங்க",
    "This bubble and these questions opened from a link. To start fresh, choose",
    "यह बबल इन प्रश्नों के साथ लिंक से खुला। नए सिरे से शुरू करने के लिए चुनें",
  ],
  "app.deepLinkNote2": ["புதிய உரையாடல்", "New conversation", "नई बातचीत"],
  "app.deepLinkNoAnswer": [
    "கேள்விகள் மட்டுமே சேமிக்கப்படுகின்றன — பதில்கள் ஒருபோதும் இணைப்பில் வைக்கப்படுவதில்லை.",
    "only the questions travel in the link, never the answers",
    "लिंक में केवल प्रश्न जाते हैं, उत्तर कभी नहीं",
  ],
  "app.newConversation": ["புதிய உரையாடல்", "New conversation", "नई बातचीत"],
  "app.threadTable": ["(பழைய செய்திகள்)", "(earlier messages)", "(पिछले संदेश)"],
  "app.you": ["நீங்கள்", "You", "आप"],
  "app.agent": ["முகவர்", "Agent", "एजेंट"],
  "app.earlierMessages": ["சமீபத்திய செய்திகள் மட்டுமே இணைப்பில் சேமிக்கப்படுகின்றன", "Only the most recent messages are kept in the link", "लिंक में केवल नवीनतम संदेश रहते हैं"],
  "app.stopped": ["நிறுத்தப்பட்டது", "Stopped", "रोका गया"],
  "app.stoppedNote": ["நீங்கள் பதிலை நிறுத்தினீர்கள்.", "You stopped this reply.", "आपने यह उत्तर रोका।"],

  // ── composer ─────────────────────────────────────────────────────────
  "app.placeholder": ["{bubble} உடன் எழுதுங்கள்…", "Message {bubble}…", "{bubble} को संदेश…"],
  "app.send": ["அனுப்பு", "Send", "भेजें"],
  "app.stop": ["நிறுத்து", "Stop", "रोकें"],
  "app.composerLabel": ["செய்தி", "Message", "संदेश"],

  // ── runtime & errors ─────────────────────────────────────────────────
  "app.runtimeAuto": ["தானியங்கி", "Auto", "स्वतः"],
  "app.runtimeDevice": ["சாதனத்தில்", "On-device", "डिवाइस पर"],
  "app.runtimeApi": ["yazhi-api", "yazhi-api", "yazhi-api"],
  "app.runtimeGroup": ["இயக்கம்", "Runtime", "रनटाइम"],
  "app.runtimeHintAuto": [
    "தட்டில் இருந்து வரையும். இணையம் இல்லாவிட்டாலோ அனுமதி அறிவிக்காவிட்டாலோ சாதனத்தில் இயங்கும்.",
    "Follows the bubble. Falls back to on-device without a network, or when the bubble has not declared yazhi-api.",
    "बबल का अनुसरण करता है। नेटवर्क नहीं होने या अनुमति घोषित न होने पर डिवाइस पर चलता है।",
  ],
  "app.runtimeHintDevice": ["இந்தக் கணினியில்/லேனில் உள்ள மாதிரி மட்டும் — எதுவும் வெளியே போகாது.", "The model server on this machine or LAN only — nothing leaves.", "केवल इस मशीन या लैन का मॉडल — कुछ बाहर नहीं जाता।"],
  "app.runtimeHintApi": ["yazhi.dev சேவையகம் வழியாக Adhan — வட்ட உள்நுழைவு தேவை.", "Adhan through yazhi.dev's server — needs a Circle sign-in.", "yazhi.dev सर्वर के ज़रिए आधन — सर्कल साइन-इन आवश्यक।"],
  "app.offlineNote": [
    "இணையம் இல்லை — குமிழ் சாதனத்தில் இயங்குகிறது (அறிவிக்கப்பட்டால்).",
    "No network — the bubble runs on this device (when its manifest allows it).",
    "नेटवर्क नहीं — बबल इस डिवाइस पर चलता है (जब बबल अनुमति देता है)।",
  ],
  "app.needSession": [
    "இந்தக் குமிழ் yazhi-api-இல் இயங்குகிறது, அதற்கு வட்ட உள்நுழைவு தேவை. உள்நுழைந்த பின் அல்லது இயக்கத்தை “சாதனத்தில்” ஆக்கி மீண்டும் முயலுங்கள்.",
    "This bubble runs on yazhi-api, which needs a Circle sign-in. Sign in, or switch the runtime to on-device, and ask again.",
    "यह बबल yazhi-api पर चलता है, जिसके लिए सर्कल साइन-इन चाहिए। साइन इन करें या रनटाइम “डिवाइस पर” करके फिर पूछें।",
  ],
  "app.notConfigured": [
    "இந்த இடமாற்றலில் yazhi-api இன்னும் இணைக்கப்படவில்லை. குமிழ்கள் சாதன இயக்கத்தில் வேலை செய்யும்.",
    "yazhi-api isn't connected on this deployment yet. Bubbles still run on the device runtime.",
    "इस डिप्लॉयमेंट पर yazhi-api अभी जुड़ा नहीं है। बबल डिवाइस रनटाइम पर चलते रहेंगे।",
  ],
  "app.errorStart": [
    "முகவரை அணுக முடியவில்லை. இயக்கத்தை மாற்றி முயற்சிக்கவும், அல்லது சற்று நேரம் கழித்து.",
    "The agent couldn't be reached. Try the other runtime, or retry in a moment.",
    "एजेंट तक नहीं पहुँच सके। दूसरा रनटाइम आज़माएँ, या थोड़ी देर बाद पुनः प्रयास करें।",
  ],
  "app.errorStop": ["நிறுத்தப்பட்டது.", "Stopped.", "रोका गया।"],

  // ── a11y: the one announcement when a reply completes ────────────────
  "app.announceDone": ["{bubble} பதிலளித்தார். பதில் கேன்வாஸில் உள்ளது.", "{bubble} replied. The answer is on the canvas.", "{bubble} ने उत्तर दिया। उत्तर कैनवास पर है।"],
  "app.announceError": ["{bubble}-இன் பதிலில் சிக்கல்: {error}", "{bubble}'s reply failed: {error}", "{bubble} का उत्तर विफल: {error}"],
  "app.announceStopped": ["பதில் நிறுத்தப்பட்டது.", "Reply stopped.", "उत्तर रोका गया।"],

  // ── keyboard help ────────────────────────────────────────────────────
  "app.keysTitle": ["விசைப்பலகை", "Keyboard", "कीबोर्ड"],
  "app.keysHint": ["குமிழ்கள் · அம்புக்குறிகள் · / · [ ] · Esc · ?", "bubbles · arrows · / · [ ] · Esc · ?", "बबल · तीर · / · [ ] · Esc · ?"],
  "app.keyRoving": ["தட்டில் ஒரு குமிழ் என்று நகர்ந்து, Enter/இடைவெளியால் திறக்க", "Roving tabindex in the tray: arrows move, Enter or Space opens", "ट्रे में घूमता टैबइंडेक्स: तीर चलाएँ, Enter या Space खोले"],
  "app.keySlash": ["எழுதுபெட்டிக்குச் செல்", "Jump to the composer", "कंपोज़र पर जाएँ"],
  "app.keyCycle": ["முந்தைய / அடுத்த குமிழ்", "Previous / next bubble", "पिछला / अगला बबल"],
  "app.keyEsc": ["தட்டுக்குத் திரும்பு (எழுதுபெட்டிக்குள் இருந்தால் முதலில் வெளியே)", "Back to the tray (first leaves the composer if you are typing)", "ट्रे पर वापस (लिखते समय पहले कंपोज़र से बाहर)"],
  "app.keyQuestion": ["இந்த உதவியைக் காட்டு / மறை", "Show / hide this help", "यह सहायता दिखाएँ / छिपाएँ"],
  "app.keyEnter": ["தேர்ந்தெடுத்த குமிழைத் திற; எழுதுபெட்டியில் அனுப்பு", "Open the focused bubble; in the composer, send", "केंद्रित बबल खोलें; कंपोज़र में, भेजें"],
  "app.keysShow": ["விசைப்பலகை உதவியைக் காட்டு", "Show keyboard help", "कीबोर्ड सहायता दिखाएँ"],
  "app.keysHide": ["விசைப்பலகை உதவியை மறை", "Hide keyboard help", "कीबोर्ड सहायता छिपाएँ"],
  "app.close": ["மூடு", "Close", "बंद करें"],

  // ── notes ────────────────────────────────────────────────────────────
  "app.sampleNote": [
    "இந்தக் குமிழின் முதல் வரிகள் மாதிரி உரை. எழுதுபெட்டி உங்கள் சொந்த முகவர் குமிழுக்கானது — தயார் ஆனதும் yazhi-api வழியாகப் பதில் வரும்.",
    "The starter lines are sample copy. The composer is wired to this bubble's agent — the reply comes back through yazhi-api once its runtime is reachable.",
    "शुरुआती पंक्तियाँ नमूना हैं। कंपोज़र इस बबल के एजेंट से जुड़ा है — रनटाइम उपलब्ध होते ही उत्तर yazhi-api से आता है।",
  ],
  "app.docsNote": [
    "குமிழ் உருவாக்க வழிகள்",
    "How to build a bubble",
    "बबल बनाने का तरीका",
  ],
  "app.promptTitle": ["இந்தக் குமிழ் அனுப்பும் அமைப்புக் கட்டளை", "The system prompt this bubble sends", "इस बबल का सिस्टम प्रॉम्प्ट"],
  "app.starterNote": [
    "முதல் வரிகள் குமிழின் தனிப்பட்ட வாழ்த்து — அதன் manifest-இலிருந்து நேரடியாக வரும்.",
    "The opening line is the bubble's own greeting, straight from its manifest.",
    "शुरुआती पंक्ति बबल का अपना अभिवादन है, सीधे उसके manifest से।",
  ],
  "app.templateNote": [
    "இது UI நூலகத்திலிருந்து வரும் பக்க வார்ப்புரு — மாதிரித் தரவுடன்.",
    "This is a page template from the UI library — filled with sample data.",
    "यह UI लाइब्रेरी का पेज टेम्पलेट है — नमूना डेटा के साथ।",
  ],

  // ── the deep-link line (server-rendered) ─────────────────────────────
  "app.link.prefix": ["குமிழ் · Bubble:", "Bubble:", "बबल:"],
} as const satisfies Record<string, AppTriple>;

/** Every key `/app` can say. */
export type AppKey = keyof typeof APP_TEXT;

const INDEX: Record<string, number> = { ta: 0, en: 1, hi: 2 };

/** Translate one key for a locale. Tamil is the fallback for an unknown
    locale; an unknown key returns the key itself (never `""`, never a
    throw). `{name}` holes are filled by `params`. */
export function appText(locale: Locale, key: AppKey, params?: Record<string, string | number>): string {
  const triple = APP_TEXT[key];
  if (!triple) return key;
  const i = INDEX[locale] ?? 0;
  const text = triple[i] ?? triple[1] ?? triple[0];
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (hole, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : hole
  );
}
