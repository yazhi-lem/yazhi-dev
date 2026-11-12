/** The Bubble UI library catalogue, Hindi — MACHINE-DRAFTED.

    Every entry is `{ text, origin: "mt", reviewRequired: true }`: drafted by
    a machine from the English/Tamil source, never served as `reviewed`.
    `docs/TRANSLATION-STATUS.md` lists them for a native Hindi speaker;
    only they may flip an entry to `origin: "reviewed", reviewRequired: false`.

    Keys match `en.ts` / `ta.ts` exactly. Placeholders (`{name}`) are kept
    verbatim so interpolation works identically in every locale. */
import type { Catalogue, TranslationEntry } from "@yazhi/i18n";

/** One machine draft, with its provenance spelled out once. */
const mt = (text: string): TranslationEntry => ({ text, origin: "mt", reviewRequired: true });

export const hiBubbleCatalogue: Catalogue = {
  // --------------------------------------------------------------- common
  "bubble.common.add": mt("जोड़ें"),
  "bubble.common.total": mt("कुल"),
  "bubble.common.close": mt("{title} बंद करें"),
  "bubble.common.open": mt("{title} खोलें"),
  "bubble.common.verified": mt("सत्यापित"),
  "bubble.common.verifiedTitle": mt("किसी समीक्षक द्वारा जाँचा गया"),
  "bubble.common.unverified": mt("असत्यापित"),
  "bubble.common.unverifiedTitle": mt("अभी किसी समीक्षक द्वारा नहीं जाँचा गया"),
  "bubble.common.cited": mt("{count} उद्धृत"),
  "bubble.common.approvedBy": mt("✓ स्वीकृत · {name}"),
  "bubble.common.approvedTitle": mt("{name} द्वारा स्वीकृत"),

  // ----------------------------------------------------------------- pill
  "bubble.pill.onDevice": mt("इस डिवाइस पर"),
  "bubble.pill.onDeviceTitle": mt("इस डिवाइस पर चला — कुछ भी बाहर नहीं गया"),
  "bubble.pill.offline": mt("ऑफ़लाइन"),
  "bubble.pill.offlineTitle": mt("नेटवर्क नहीं — केवल डिवाइस मॉडल"),
  "bubble.pill.apiTitle": mt("yazhi-api के ज़रिए अधान पर चला"),
  "bubble.pill.draft": mt("मसौदा · मातृभाषा समीक्षा"),
  "bubble.pill.draftWhat": mt("तमिल पाठ"),
  "bubble.pill.draftTitle": mt("{what} तब तक मसौदा है जब तक कोई मातृभाषी समीक्षा न करे"),

  // ------------------------------------------------------------- citation
  "bubble.citation.label": mt("स्रोत {n}: {title}, {locator}"),
  "bubble.citation.openSource": mt("स्रोत खोलें ↗"),
  "bubble.citation.hrefTo": mt("{label} खोलें"),

  // ----------------------------------------------------------- guardrails
  "bubble.guardrails.idontknow": mt("मुझे नहीं पता"),
  "bubble.guardrails.legalTitle": mt("कानूनी जानकारी, कानूनी सलाह नहीं"),
  "bubble.guardrails.legalBody": mt(
    "यह बताता है कि कानून क्या कहता है; यह आपकी स्थिति पर सलाह नहीं दे सकता। सलाह के लिए अपने ज़िला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें — कई लोगों के लिए विधिक सहायता नि:शुल्क है — या किसी वकील से।"
  ),
  "bubble.guardrails.sampleTitle": mt("नमूना डेटा"),
  "bubble.guardrails.sampleBody": mt(
    "इस स्क्रीन पर सब कुछ उदाहरण के लिए है। यह लेआउट दिखाता है, वास्तविक उत्तर, उद्धरण, कीमतें या लोग नहीं।"
  ),
  "bubble.guardrails.childrenTitle": mt("माता-पिता और अभिभावकों के लिए"),
  "bubble.guardrails.childrenBody": mt(
    "बच्चे याझ का उपयोग तभी करते हैं जब कोई माता-पिता सत्यापित सहमति देते हैं। हम केवल पहला नाम और आयु-वर्ग रखते हैं — और कुछ नहीं।"
  ),

  // ----------------------------------------------------------------- gate
  "bubble.gate.needsHuman": mt("मनुष्य की पुष्टि आवश्यक"),
  "bubble.gate.affects": mt("प्रभाव"),
  "bubble.gate.rollback": mt("वापसी"),
  "bubble.gate.typeToConfirm": mt("पुष्टि के लिए {word} लिखें"),
  "bubble.gate.typePrompt": mt("{word} लिखें"),
  "bubble.gate.confirmRun": mt("पुष्टि करें और चलाएँ"),
  "bubble.gate.dontRun": mt("न चलाएँ"),
  "bubble.gate.confirmed": mt("आपने पुष्टि की — दर्ज हो गया।"),
  "bubble.gate.declined": mt("अस्वीकृत — कुछ नहीं चला।"),

  // -------------------------------------------------------------- message
  "bubble.message.thinking": mt("सोच रहा है"),

  // ------------------------------------------------------------- composer
  "bubble.composer.placeholder": mt("संदेश…"),
  "bubble.composer.send": mt("भेजें"),
  "bubble.composer.stop": mt("रोकें"),

  // ------------------------------------------------------------ workspace
  "bubble.workspace.pageNotVerified": mt(" (अंश सत्यापित नहीं)"),
  "bubble.workspace.machineDraftTa": mt("इयந்திர வரைவு"),
  "bubble.workspace.machineDraftEn": mt("machine draft"),
  "bubble.workspace.machineDraftTitle": mt("किसी मॉडल द्वारा बनाया गया — कोई व्यक्ति स्वीकृति देता है, तभी मान्य"),
  "bubble.workspace.sampleTa": mt("मாதிரித் தரவு"),
  "bubble.workspace.sampleEn": mt("sample data"),
  "bubble.workspace.sampleTitle": mt("डेमो मोड: कृत्रिम डेटा, वास्तविक उत्तर या लोग नहीं"),
  "bubble.workspace.handoffTitle": mt("किसी व्यक्ति को सौंपा गया"),
  "bubble.workspace.handoffPickedUp": mt("लिया गया: {who}"),
  "bubble.workspace.chooseFiles": mt("फ़ाइलें चुनें"),
  "bubble.workspace.tickFirst": mt("फ़ाइलें चुनने के लिए ऊपर बॉक्स पर टिक करें"),

  // ---------------------------------------------------------------- verse
  "bubble.verse.kural": mt("तिरुक्कुरल {number}"),
  "bubble.verse.draftGloss": mt("(मसौदा अनुवाद)"),

  // --------------------------------------------------------------- answer
  "bubble.answer.sources": mt("स्रोत"),
  "bubble.answer.noSources": mt("कोई स्रोत नहीं — इसलिए कोई दावा नहीं।"),
  "bubble.answer.fallbackReason": mt("इस प्रश्न का उत्तर किसी संग्रहीत स्रोत से समर्थित नहीं है।"),
  "bubble.answer.fallbackNext": mt("जिस पाठ, श्लोक या धारा का अभिप्राय है उसका नाम बताएँ।"),
  "bubble.answer.matched": mt("{pct}% मेल खाया"),
  "bubble.answer.matchedTitle": mt("उद्धृत धाराएँ संग्रहीत अधिनियम पाठ से मेल खाती हैं"),

  // -------------------------------------------------------------- support
  "bubble.support.runbookEyebrow": mt("कुरल रनबुक"),
  "bubble.support.runbookTitle": mt("रनबुक"),

  // ---------------------------------------------------------- hint ladder
  "bubble.hintLadder.eyebrow": mt("गुरु"),
  "bubble.hintLadder.hintN": mt("संकेत {n}"),
  "bubble.hintLadder.stuck": mt("मैं अटका हूँ — एक संकेत दें"),
  "bubble.hintLadder.next": mt("अगला संकेत ({next} / {total})"),
  "bubble.hintLadder.footnote": mt("गुरु संकेत देते हैं, उत्तर नहीं। आपके शिक्षक देखते हैं कि आपने कौन-से संकेत लिए।"),

  // ---------------------------------------------------------------- trust
  "bubble.trust.traceTitle": mt("तर्क-अनुक्रम"),
  "bubble.trust.traceEyebrow": mt("पंच-अवस्था कर्नेल"),
  "bubble.trust.failed": mt("{count} विफल"),
  "bubble.trust.allPassed": mt("सभी उत्तीर्ण"),
  "bubble.trust.posture.context": mt("संदर्भ"),
  "bubble.trust.posture.reason": mt("तर्क"),
  "bubble.trust.posture.plan": mt("योजना"),
  "bubble.trust.posture.respond": mt("उत्तर"),
  "bubble.trust.posture.reflect": mt("चिंतन"),
  "bubble.trust.consentTitle": mt("पहले माता-पिता की सहमति"),
  "bubble.trust.consentEyebrow": mt("याझ"),
  "bubble.trust.consentBullet1": mt("हम आपके बच्चे का पहला नाम और आयु-वर्ग रखते हैं। और कुछ नहीं।"),
  "bubble.trust.consentBullet2": mt("चिह्नित बातचीत की समीक्षा कोई प्रतिदिन करता है।"),
  "bubble.trust.consentBullet3": mt("आप कभी भी सब कुछ देख, रोक या हटा सकते हैं।"),
  "bubble.trust.consentSent": mt("हमने माता-पिता के फ़ोन पर सत्यापन चरण भेजा है। पूरा होने तक याझ बंद रहेगा।"),
  "bubble.trust.consentCta": mt("मैं अभिभावक हूँ — मेरा सत्यापन करें"),

  // ------------------------------------------------------------- commerce
  "bubble.commerce.inStock": mt("उपलब्ध"),
  "bubble.commerce.lowStock": mt("कम"),
  "bubble.commerce.outOfStock": mt("नहीं है"),
  "bubble.commerce.order": mt("ऑर्डर"),
  "bubble.commerce.nothingAdded": mt("अभी कुछ नहीं जोड़ा गया।"),
  "bubble.commerce.remove": mt("{name} हटाएँ"),
  "bubble.commerce.intentNote": mt(
    "केवल भुगतान अनुरोध — दुकान पुष्टि करके सीधे भुगतान लेती है। याझी से होकर पैसा नहीं जाता।"
  ),

  // --------------------------------------------------------------- reader
  "bubble.reader.scholarVerified": mt("विद्वान द्वारा सत्यापित"),
  "bubble.reader.awaitingReview": mt("विद्वान समीक्षा की प्रतीक्षा"),
  "bubble.reader.verses": mt("श्लोक"),
  "bubble.reader.line": mt("पंक्ति {n}"),
  "bubble.reader.glossLabel": mt("भावार्थ · मसौदा, विद्वान समीक्षा बाक़ी"),

  // ------------------------------------------------------------------ tray
  "bubble.tray.label": mt("बबल"),

  // -------------------------------------------------------------- mission
  "bubble.mission.labelActive": mt("मिशन कंट्रोल{who}"),
  "bubble.mission.whoSignedIn": mt(" — {who} के रूप में साइन इन"),
  "bubble.mission.labelBusy": mt("मिशन कंट्रोल — आपका Circle खाता जाँचा जा रहा है"),
  "bubble.mission.labelAsleep": mt("मिशन कंट्रोल — शुरू करने के लिए Circle से साइन इन करें"),
  "bubble.mission.titleActive": mt("मिशन कंट्रोल"),
  "bubble.mission.titleAsleep": mt("मिशन कंट्रोल खोलने के लिए Circle से साइन इन करें"),
  "bubble.mission.title": mt("मिशन कंट्रोल"),
  "bubble.mission.close": mt("{title} बंद करें"),

  // ----------------------------------------------------------------- mode
  "bubble.mode.system": mt("सिस्टम"),
  "bubble.mode.light": mt("उजला"),
  "bubble.mode.dark": mt("गहरा"),
  "bubble.mode.switch": mt("थीम: {current}। {next} पर स्विच करें"),
  "bubble.mode.current": mt("थीम: {current}"),
  "bubble.mode.label": mt("थीम"),

  // ---------------------------------------------------------------- sound
  "bubble.sound.on": mt("ध्वनि चालू"),
  "bubble.sound.off": mt("ध्वनि"),
  "bubble.sound.ariaOn": mt("याझ ध्वनि चालू है। बंद करें"),
  "bubble.sound.ariaOff": mt("याझ ध्वनि बंद है। तार सुनने के लिए चालू करें"),
  "bubble.sound.titleOn": mt("ध्वनि चालू"),
  "bubble.sound.titleOff": mt("याझ की ध्वनि चालू करें"),

  // ---------------------------------------------------------------- tinai
  "bubble.tinai.palai": mt("पालै"),
  "bubble.tinai.mullai": mt("मुल्लै"),
  "bubble.tinai.kurinji": mt("कुरिंजि"),
  "bubble.tinai.marutham": mt("मरुतम्"),
  "bubble.tinai.neytal": mt("नेय्तल्"),
  "bubble.tinai.palai.landscape": mt("शुष्क भूमि"),
  "bubble.tinai.mullai.landscape": mt("वन"),
  "bubble.tinai.kurinji.landscape": mt("पहाड़"),
  "bubble.tinai.marutham.landscape": mt("खेत"),
  "bubble.tinai.neytal.landscape": mt("समुद्रतट"),
  "bubble.tinai.palai.mood": mt("सहनशीलता — साहस और वियोग, कठिन कथाएँ"),
  "bubble.tinai.mullai.mood": mt("प्रतीक्षा — धैर्य, पशु और बच्चों की लोककथाएँ"),
  "bubble.tinai.kurinji.mood": mt("पहला मिलन — जिज्ञासा और खोज, जहाँ कथा आरंभ होती है"),
  "bubble.tinai.marutham.mood": mt("रोज़मर्रा का जीवन — गणना, काम और परिवार; कलह और मेल"),
  "bubble.tinai.neytal.mood": mt("विरह — यात्राएँ और दूरी, प्रवासी भूमि"),

  // ----------------------------------------------------------------- apps
  "bubble.app.avai.name": mt("अवै"),
  "bubble.app.avai.tagline": mt("तमिल साहित्य, व्याकरण और प्रयोग — हर दावे के साथ स्रोत"),
  "bubble.app.nyaya.name": mt("न्याय"),
  "bubble.app.nyaya.tagline": mt("कानून क्या कहता है, तमिल में — उस धारा के साथ जहाँ से वह आता है"),
  "bubble.app.kuralDesk.name": mt("कुरल डेस्क"),
  "bubble.app.kuralDesk.tagline": mt("तमिल में IT सहायता — रनबुक सुझाता है, स्वयं कोई सिस्टम नहीं बदलता"),
  "bubble.app.guru.name": mt("गुरु"),
  "bubble.app.guru.tagline": mt("गणित, विज्ञान और अंग्रेज़ी तमिल के माध्यम से — संकेत, उत्तर नहीं"),
  "bubble.app.kadai.name": mt("कडै"),
  "bubble.app.kadai.tagline": mt("पड़ोस की दुकान जो तमिल में ऑर्डर लेती है, अण्णाच्ची के साथ"),
  "bubble.app.openSangam.name": mt("खुला संगम"),
  "bubble.app.openSangam.tagline": mt("शास्त्रीय तमिल, पंक्ति-दर-पंक्ति — विद्वान की स्वीकृति के बाद ही प्रकाशित"),
  "bubble.app.yazhParent.name": mt("याझ — अभिभावकों के लिए"),
  "bubble.app.yazhParent.tagline": mt("याझ का अभिभावक-द्वार। बच्चे यह पृष्ठ कभी नहीं देखते।"),

  // ----------------------------------------------------------------- page
  "bubble.page.templateReply": mt("टेम्पलेट पूर्वावलोकन — उत्तर के लिए इस पृष्ठ को बबल रनटाइम से जोड़ें।"),
  "bubble.page.avai.anchorQuestion": mt("दूसरों को सुनने के बारे में कुरल क्या कहता है?"),
  "bubble.page.avai.anchorAnswer": mt("कुरल 423 कहता है कि जो सुना जाए, उसमें जो भी कहे, सत्य देखना ही ज्ञान है।"),
  "bubble.page.avai.unknownQuestion": mt("तिरुक्कुरल किस वर्ष लिखा गया?"),
  "bubble.page.avai.unknownReason": mt("विद्वान भिन्न काल सुझाते हैं, और किसी संग्रहीत स्रोत से एक वर्ष तय नहीं होता।"),
  "bubble.page.avai.unknownNext": mt("मैं दिखा सकता हूँ कि प्रत्येक तिथि-तर्क किस पर टिका है, उसके स्रोतों सहित।"),
  "bubble.page.avai.posture1": mt("तमिल पाठ पर अंग्रेज़ी प्रश्न; उत्तर द्विभाषी।"),
  "bubble.page.avai.posture2": mt("एक संग्रहीत स्रोत मिला: तिरुक्कुरल 423।"),
  "bubble.page.avai.posture3": mt("उद्धरण, अनुवाद, स्रोत। किसी चरण में मनुष्य की आवश्यकता नहीं।"),
  "bubble.page.avai.posture4": mt("हर वाक्य उद्धृत।"),
  "bubble.page.avai.posture5": mt("दूसरे प्रश्न का स्रोत नहीं था — अस्वीकार किया।"),
  "bubble.page.avai.composer": mt("अवै से किसी श्लोक, शब्द या नियम के बारे में पूछें…"),
  "bubble.page.nyaya.asideTitle": mt("अपनी स्थिति पर सलाह चाहिए?"),
  "bubble.page.nyaya.asideEyebrow": mt("सहायता लें"),
  "bubble.page.nyaya.dlsa": mt("ज़िला विधिक सेवा प्राधिकरण"),
  "bubble.page.nyaya.dlsaNote": mt("पात्र लोगों के लिए नि:शुल्क विधिक सहायता।"),
  "bubble.page.nyaya.lawyer": mt("एक वकील"),
  "bubble.page.nyaya.lawyerNote": mt("आपके अपने मामले पर सलाह के लिए।"),
  "bubble.page.nyaya.disclaimer": mt("न्याय कानून समझाता है। यह सलाह नहीं देता और वकील नहीं है।"),
  "bubble.page.nyaya.question": mt("[किरायेदार के अधिकारों पर नमूना प्रश्न]"),
  "bubble.page.nyaya.part1": mt("[पहला प्रावधान क्या कहता है, इसकी सरल व्याख्या।]"),
  "bubble.page.nyaya.part2": mt("[प्रक्रिया पर नियम क्या जोड़ते हैं।]"),
  "bubble.page.nyaya.composer": mt("किसी कानून के बारे में पूछें, तमिल या अंग्रेज़ी में…"),
  "bubble.page.kural.queue": mt("कतार"),
  "bubble.page.kural.open": mt("{count} खुले"),
  "bubble.page.kural.noRunbook": mt("ज्ञान-आधार में अभी इस टिकट से मेल खाती कोई रनबुक नहीं है।"),
  "bubble.page.kural.noRunbookNext": mt("कुरल अब तक जाँचे गए के साथ इसे किसी व्यक्ति को सौंपेगा।"),
  "bubble.page.guru.asideTitle": mt("यह कहाँ चलता है"),
  "bubble.page.guru.asideEyebrow": mt("संस्थान डेटा"),
  "bubble.page.guru.asideBody": mt("गुरु संस्थान की अपनी मशीन पर चलता है। छात्र का कार्य और संकेत-उपयोग बाहर नहीं जाते।"),
  "bubble.page.guru.lessonTitle": mt("रैखिक समीकरण · पाठ 3"),
  "bubble.page.guru.lessonEyebrow": mt("बीजगणित"),
  "bubble.page.guru.stepRead": mt("पढ़ें"),
  "bubble.page.guru.stepTry": mt("आज़माएँ"),
  "bubble.page.guru.stepHints": mt("संकेत"),
  "bubble.page.guru.stepCheck": mt("जाँचें"),
  "bubble.page.kadai.shopReply": mt("दुकान में यह उपलब्ध है — जो चाहिए जोड़ें, दुकान पुष्टि करेगी।"),
  "bubble.page.sangam.asideTitle": mt("इस संकलन के बारे में"),
  "bubble.page.sangam.asideEyebrow": mt("स्रोत"),
  "bubble.page.sangam.asideBody": mt(
    "नमूना संकलन: चार तिरुक्कुरल। यह पाठक मदुरैक्काञ्चि की पंक्ति 1–100 के लिए बना है, जो हर पंक्ति पर विद्वान की स्वीकृति के बाद प्रकाशित होती हैं।"
  ),
  "bubble.page.sangam.readerTitle": mt("तिरुक्कुरल — नमूना"),
  "bubble.page.yazh.behindGate": mt("द्वार के पीछे: अपने बच्चे के याझ पर अभिभावक का दृश्य।"),
};
