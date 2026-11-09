/** ═══════════════════════════════════════════════════════════════════════
    HINDI (`hi`) — MACHINE-DRAFTED SITE COPY. NOT REVIEWED.
    ═══════════════════════════════════════════════════════════════════════

    Every value in this file is a machine draft against the English source
    line of `packages/i18n/src/catalogues/en.ts` (same key). Each entry is
    `{ text, origin: "mt", reviewRequired: true }`, and nothing in the site
    serves an `mt` entry as `reviewed`:

      - A native Hindi speaker reviews each line against
        `docs/i18n/HINDI-REVIEW.md` (one row per key: Hindi vs English
        source), then sets `origin: "reviewed", reviewRequired: false` here.
      - Until then the Hindi string may appear behind the `hi` locale, always
        labelled as a draft in the review doc.

    Rules that must survive review:
      - Never translate Tamil/Sanskrit terms used as *terms*: திணை (tinai),
        akam, puram, yazhi, Kural, Sangam, Adhan, Yazh, Yazhi. Transliterate
        them (तिणै, अकम, पुरम, याझी, संगम, आधन, याझ) and keep the English
        gloss beside them in Latin script.
      - `{placeholders}` are copied verbatim, in whatever order Hindi needs.
      - Sangam verse, the Maduraikkanci passage and the demo transcript are
        NEVER translated (they are not in this file at all).

    Site catalogue only (`site.*`). The switcher's own chrome lives in
    `packages/i18n/src/locales/ui.ts`; the in-app UI strings of chat, circle
    and builder chrome live in `packages/i18n/src/strings/*`. */

import type { TranslationEntry } from "@yazhi/i18n";

/** One draft line: machine-translated, review required. */
const mt = (text: string): TranslationEntry => ({ text, origin: "mt", reviewRequired: true });

const hi: Record<string, TranslationEntry> = {
  // ── The umbrella (Yazhi section) ──────────────────────────────────────
  "site.yazhi.sub": mt("एक बातचीत — सभी भाषाएँ"),
  "site.yazhi.body": mt(
    "याज़ी भारतीय भाषाओं के लिए संप्रभु एआई है — यहीं बना, यहीं इसका स्वामित्व, और खुला। हम एक ऐसी बातचीत बना रहे हैं जो तमिल, तेलुगु और हिंदी के बीच चलती रहे, बदलने में कुछ भी न खोए, और उन औज़ारों तक पहुँचे जो परिवार पहले से इस्तेमाल करते हैं। इसके नीचे तीन उत्पाद हैं: याझ, परिवारों की आवाज़-मित्र; आधन, नीचे का इंजन; और ओपन संगम, वह स्मृति जिसकी हम रक्षा करते हैं।"
  ),
  "site.yazhi.plain": mt(
    "तमिल, तेलुगु या हिंदी में बोलिए — याज़ी उसी भाषा में जवाब देता है, और वाक्य के बीच में भाषा बदलने पर भी समझता रहता है। हम इसे अभी बना रहे हैं।"
  ),
  "site.yazhi.preview": mt("पूर्वावलोकन — तमिल, तेलुगु, हिंदी"),
  "site.yazhi.chatAlt": mt(
    "याज़ी के साथ एक बातचीत जो बिना रुके तमिल, तेलुगु और हिंदी के बीच चलती है, जिसमें कॉर्पस खोज और व्हाट्सएप भेजना भी शामिल है"
  ),

  // ── Adhan ─────────────────────────────────────────────────────────────
  "site.adhan.name": mt("आधन"),
  "site.adhan.eyebrow": mt("नीचे चलने वाला इंजन"),
  "site.adhan.sub": mt("भारतीय भाषाओं के लिए हमारा खुला इंडिक आधार मॉडल"),
  "site.adhan.body": mt(
    "आधन हमारा खुला इंडिक आधार मॉडल है, जो 22+ भारतीय भाषाओं के लिए बनाया गया है, और जिसका टोकनाइज़र अंग्रेज़ी से पुनर्निर्मित करने के बजाय अग्लूटिनेटिव व्याकरण के लिए बनाया गया है। पहले तमिल, फिर तेलुगु, कन्नड़ और मलयालम। प्रशिक्षण शिवकाशी में हमारी ही मशीनों पर चलता है। यह पूरा नहीं हुआ है और इसका पूरा होना लक्ष्य भी नहीं है — मॉडल लगातार विकसित होता रहता है, कॉर्पस बढ़ने और हर नई भाषा के पाइपलाइन में आने के साथ बढ़ता रहता है।"
  ),
  "site.adhan.plain": mt(
    "भारत की भाषाओं को पढ़ना और बोलना सीखता रहने वाला कंप्यूटर मस्तिष्क — काम अभी पूरा नहीं हुआ, यह बढ़ता रहता है।"
  ),
  "site.adhan.cta": mt("आधन को GitHub पर देखें →"),
  "site.adhan.tokenTax.label": mt("भारतीय भाषाओं पर टोकन कर — एक ही वाक्य में प्रति शब्द खर्च किए गए टोकन"),
  "site.adhan.tokenTax.source": mt("पेत्रोव एवं अन्य, NeurIPS 2023"),
  "site.adhan.tokenTax.row.0": mt("अंग्रेज़ी"),
  "site.adhan.tokenTax.row.1": mt("हिंदी"),
  "site.adhan.tokenTax.row.2": mt("तेलुगु"),
  "site.adhan.tokenTax.row.3": mt("तमिल"),

  // ── Language roadmap ──────────────────────────────────────────────────
  "site.languageRoadmap.title": mt("पहले तमिल, केवल तमिल नहीं"),
  "site.languageRoadmap.step.0.stage": mt("अब"),
  "site.languageRoadmap.step.0.lang": mt("तमिल"),
  "site.languageRoadmap.step.0.body": mt(
    "हमारी घर की भाषा और सबसे कठिन परीक्षा। कॉर्पस, टोकनाइज़र, आवाज़ और पहले परिवार, सब यहीं हैं।"
  ),
  "site.languageRoadmap.step.1.stage": mt("आगे"),
  "site.languageRoadmap.step.1.lang": mt("तेलुगु"),
  "site.languageRoadmap.step.1.body": mt(
    "~9.6 करोड़ वक्ता, तमिल की तरह अग्लूटिनेटिव, वही टोकनाइज़र समस्या — स्वाभाविक दूसरी भाषा।"
  ),
  "site.languageRoadmap.step.2.stage": mt("फिर"),
  "site.languageRoadmap.step.2.lang": mt("कन्नड़, मलयालम"),
  "site.languageRoadmap.step.2.body": mt(
    "बाकी द्रविड़ परिवार — साझा रूप-विज्ञान यानी साझा टोकनाइज़र लाभ।"
  ),
  "site.languageRoadmap.step.3.stage": mt("लक्ष्य"),
  "site.languageRoadmap.step.3.lang": mt("22+ भाषाएँ"),
  "site.languageRoadmap.step.3.body": mt(
    "एक खुला मॉडल, एक एपीआई, हर अनुसूचित भाषा। यह डिज़ाइन लक्ष्य है, पूरा हुआ परिणाम नहीं — आज पाइपलाइन में तमिल है, फिर तेलुगु, कन्नड़ और मलयालम।"
  ),
  "site.languageRoadmap.foot": mt(
    "तमिल और तेलुगु एक ही द्रविड़ व्याकरण रीढ़ और वही टोकनाइज़र समस्या साझा करते हैं। तमिल को ठीक से हल करना तेलुगु के रास्ते में एक विचलन नहीं — यही ज़्यादातर काम है।"
  ),

  // ── Yazh (the guardian product) ───────────────────────────────────────
  "site.yazh.name": mt("याझ"),
  "site.yazh.eyebrow": mt("परिवार किसके लिए भुगतान करते हैं"),
  "site.yazh.sub": mt("4–8 साल के बच्चों के लिए व्हाट्सएप पर आवाज़-भरोसेमंद दोस्त"),
  "site.yazh.body": mt(
    "याझ दक्षिण भारत के मंदिर के खंभों पर तराशा गया संरक्षक प्राणी है — वह दरवाज़े पर खड़ा रहता है और अंदर की चीज़ों को सुरक्षित रखता है। याझ वही संरक्षक है, जो इतना छोटा खींचा गया है कि चार साल का बच्चा उससे बात कर सके। वह सुनता है, बच्चे की मातृभाषा में जवाब देता है, और उससे कभी पढ़ने या टाइप करने को नहीं कहता। आवाज़ में, आवाज़ में बाहर — कोई ऐप नहीं, कोई टाइपिंग नहीं, उसी फ़ोन पर जो परिवारों के पास पहले से है। लोक कथाएँ और बातचीत के ज़रिए गणित, विज्ञान और अंग्रेज़ी।"
  ),
  "site.yazh.plain": mt(
    "इंटरनेट पर तमिल कहानियों और गीतों की रक्षा करने वाला ऐप — जैसे मंदिर का याझी।"
  ),
  "site.yazh.cta": mt("शुरू करें"),
  "site.yazh.whatsappCta": mt("व्हाट्सएप पर बात करें"),
  "site.yazh.whatsappNote": mt(
    "फ़िलहाल हैदराबाद के आसपास 30 से अधिक संस्थापक परिवारों के साथ निजी बीटा में हैं — जैसे ही हम खुलें, अपडेट के लिए व्हाट्सएप समुदाय से जुड़ें।"
  ),
  "site.yazh.caption": mt("யாழி · मंदिर का संरक्षक"),
  "site.yazh.artAlt": mt("याझी — पौराणिक संरक्षक"),
  "site.yazh.markAlt": mt("याझी संरक्षक का अमूर्त चिह्न"),

  // ── Open Sangam ───────────────────────────────────────────────────────
  "site.sangam.name": mt("ओपन संगम"),
  "site.sangam.eyebrow": mt("वह स्मृति जिसकी हम रक्षा करते हैं"),
  "site.sangam.sub": mt("शास्त्रीय साहित्य के लिए एक खुला मंच"),
  "site.sangam.body": mt(
    "शास्त्रीय साहित्य के लिए एक खुला मंच — संगम कविता और उससे आगे, कविता-विश्लेषण, भूदृश्य-वर्गीकरण और भाषा-विज्ञान अध्ययन के साथ। छात्रों, शिक्षकों और विद्वानों के लिए निःशुल्क। यह वही कॉर्पस भी है जो आधन को सिखाता है कि असली भाषा कैसी लगती है।"
  ),
  "site.sangam.plain": mt(
    "2,000 साल पुरानी तमिल कविताएँ पढ़कर बताने वाला औज़ार कि हर रचना पाँच में से किस भूदृश्य की है — छात्रों और शिक्षकों के लिए निःशुल्क।"
  ),
  "site.sangam.cta": mt("और जानें"),
  "site.sangam.source": mt("आरंभिक अंश · ओपन-संगम कॉर्पस"),
  // The verse (MADURAI_KANCHI.verseTa / translationEn) is NEVER translated:
  // it renders verbatim in the Sangam section for every locale.

  // ── Services ──────────────────────────────────────────────────────────
  "site.services.0": mt("एजेंट"),
  "site.services.1": mt("अनुप्रयोग"),
  "site.services.2": mt("एनोटेशन"),

  // ── Navigation (footer groups) ────────────────────────────────────────
  "site.nav.groups.0.label": mt("परियोजनाएँ"),
  "site.nav.groups.0.items.0": mt("याझ"),
  "site.nav.groups.0.items.1": mt("आधन"),
  "site.nav.groups.0.items.2": mt("ओपन संगम"),
  "site.nav.groups.0.items.3": mt("तिणै"),
  "site.nav.groups.1.label": mt("सेवाएँ"),
  "site.nav.groups.1.items.0": mt("एजेंट"),
  "site.nav.groups.1.items.1": mt("अनुप्रयोग"),
  "site.nav.groups.1.items.2": mt("কுறிப்புரைகள்"),
  "site.nav.groups.2.label": mt("समुदाय"),
  "site.nav.groups.2.items.0": mt("नेटवर्क से जुड़ें"),
  "site.nav.groups.2.items.1": mt("Discord"),
  "site.nav.groups.2.items.2": mt("GitHub"),
  "site.nav.groups.2.items.3": mt("रिपॉज़िटरी"),
  "site.nav.groups.2.items.4": mt("बबल UI"),
  "site.nav.groups.2.items.5": mt("हमारे बारे में"),
  "site.nav.groups.2.items.6": mt("गोपनीयता"),

  // ── Identity strings (footer, wordmark) ───────────────────────────────
  "site.identity.positioning": mt("भारतीय भाषाओं के लिए संप्रभु एआई"),
  "site.identity.secondary": mt("अकम और पुरम"),
  "site.identity.footer": mt("संप्रभु कृत्रिम बुद्धिमत्ता"),
  "site.identity.copyright": mt("© 2026 याझी • Yazhi"),

  // ── Community ─────────────────────────────────────────────────────────
  "site.community.title": mt("समुदाय"),
  "site.community.sub": mt("समुद्रों के पार तमिल — नेटवर्क से जुड़ें"),
  "site.community.plain": mt(
    "तमिल और कंप्यूटर से प्यार करने वाले असली लोग, मिलकर इसे बना रहे हैं — आपका स्वागत है।"
  ),
  "site.community.chatAge": mt(
    "बातचीत मंच (व्हाट्सएप, Discord) में 13 वर्ष और उससे अधिक उम्र के लोगों की सहमति होती है — बच्चे माता-पिता के साथ जुड़ें।"
  ),
  "site.community.card.0.title": mt("नेटवर्क से जुड़ें"),
  "site.community.card.0.body": mt("योगदानकर्ताओं, एनोटेटरों और बिल्डरों के लिए प्रवेश।"),
  "site.community.card.1.title": mt("Discord"),
  "site.community.card.1.body": mt(
    "रोज़ की बातचीत — तमिल एआई बिल्डर, शोधकर्ता और लेखक।"
  ),
  "site.community.card.2.title": mt("GitHub"),
  "site.community.card.2.body": mt("खुला काम — मॉडल, औज़ार और मूल्यांकन सूट।"),

  // ── Developers ────────────────────────────────────────────────────────
  "site.developers.eyebrow": mt("डेवलपर्स के लिए"),
  "site.developers.title": mt("अपनी मातृभाषा के लिए बनाइए"),
  "site.developers.body": mt(
    "पूरे भारत के डेवलपर्स का एक समुदाय, जो उन भाषाओं के लिए एआई बना रहा है जिनमें हम बड़े हुए। आधन के खुले वज़न या याज़ी एपीआई से शुरू करें, अपनी भाषा में एजेंट और औज़ार बनाइए, और उन इंजीनियरों से सहायता पाइए जिन्होंने ऐसा पहले किया है।"
  ),
  "site.developers.plain": mt(
    "पूरे भारत के डेवलपर्स अपनी मातृभाषाओं के लिए एआई औज़ार बना रहे हैं — आप भी जुड़ सकते हैं।"
  ),
  "site.developers.cta": mt("डेवलपर के रूप में जुड़ें"),
  "site.developers.discordCta": mt("Discord से जुड़ें"),

  // ── Repositories (/repos) ─────────────────────────────────────────────
  "site.repos.title": mt("ओपन-सोर्स रिपॉज़िटरी"),
  "site.repos.intro": mt(
    "हमारा सारा खुला काम GitHub पर yazhi-lem के अंतर्गत है। एक रिपॉज़िटरी चुनें, उसका README पढ़ें, और good first issue लेबल वाले मुद्दे से शुरुआत करें। हर पुल रिक्वेस्ट की पहली समीक्षा 48 घंटों में होती है, और योगदानकर्ताओं का नाम अंकित किया जाता है।"
  ),
  "site.repos.note": mt(
    "good-first-issue सूचियाँ अभी भरी जा रही हैं। अगर कोई सूची खाली है, खुले मुद्दे देखें या Discord पर नमस्ते कहें।"
  ),
  "site.repos.link": mt("खुली रिपॉज़िटरी देखें"),
  "site.repos.goodFirst": mt("शुरुआती मुद्दे →"),
  "site.repos.allIssues": mt("सभी खुले मुद्दे"),
  "site.repos.reference": mt("संदर्भ"),
  "site.repos.what.0": mt("तमिल भाषा-मॉडल का काम: स्वरम टोकनाइज़र, कॉर्पस तैयारी, प्रशिक्षण, मूल्यांकन, अनुमान सर्वर"),
  "site.repos.what.1": mt("शास्त्रीय तमिल कॉर्पस और परतदार पाठक: संगम तमिल, आधुनिक तमिल, अंग्रेज़ी"),
  "site.repos.what.2": mt("तमिल मोबाइल कीबोर्ड, पहले Android पर; फ़ोन से कुछ भी बाहर नहीं जाता"),
  "site.repos.what.3": mt("याझ: बच्चों के लिए द्विभाषी सीखने-खेलने वाला ऐप (Unity 6)"),
  "site.repos.what.4": mt("याज़ी.देव वेबसाइट"),
  "site.repos.what.5": mt("एजेंट स्किल्स और सीखने की सामग्री (SKILL.md प्रारूप)"),
  "site.repos.what.6": mt("Google की स्टाइल गाइड का फ़ोर्क (संदर्भ)"),

  // ── About page ────────────────────────────────────────────────────────
  "site.about.title": mt("याझी के बारे में"),
  "site.about.description": mt(
    "याझी के पीछे कौन है, हम क्या बना रहे हैं, और जागरण उलटी गिनती का क्या अर्थ है।"
  ),
  "site.about.what.q": mt("याज़ी क्या है?"),
  "site.about.what.p1": mt(
    "याज़ी (யாழி) भारतीय भाषाओं के लिए संप्रभु एआई बनाने वाली एक सामुदायिक पहल है — शुरुआत तमिल से। सरल शब्दों में: हम कंप्यूटर को तमिल और हर दूसरी भारतीय भाषा को समझना, पढ़ना और बोलना सिखाते हैं, काम खुले तौर पर, समुदाय द्वारा, समुदाय के लिए होता है।"
  ),
  "site.about.what.p2": mt(
    "यह नाम याझी से आया है, तमिल मंदिर के खंभों पर तराशा गया पौराणिक संरक्षक — आधा सिंह, आधा हाथी — दहलीज़ का रक्षक।"
  ),
  "site.about.building.q": mt("हम क्या बना रहे हैं"),
  "site.about.building.adhan": mt(
    "आधन (அதன்) — हमारा खुला इंडिक आधार मॉडल, 22+ भारतीय भाषाओं के लिए बनाया गया, पहले तमिल और फिर बाकी द्रविड़ परिवार। यह अभी प्रशिक्षण में है; आज भाषाओं की संख्या की जानकारी हमारी रोडमैप पर है, किसी रिलीज़ पर नहीं।"
  ),
  "site.about.building.sangam": mt(
    "संगम (சங்கம்) — संगम कविता के पाँच भूदृश्यों (ஐந்திணை) के ज़रिए शास्त्रीय तमिल साहित्य का विश्लेषण। अभी उपलब्ध:"
  ),
  "site.about.building.yazh": mt(
    "याझ गार्डियन (யாழ்) — तमिल डिजिटल विरासत और सामुदायिक ज्ञान की रक्षा करने वाला ऐप।"
  ),
  "site.about.countdown.q": mt("उलटी गिनती क्या है?"),
  "site.about.countdown.bold": mt("{date} — हमारा सार्वजनिक लॉन्च"),
  "site.about.countdown.pre": mt("होम पेज पर उलटी गिनती"),
  "site.about.countdown.post": mt(
    "तक चलती है: वह दिन जब मॉडल, औज़ार और सामुदायिक कार्यक्रम पूरी तरह खुलते हैं। कोई रहस्य नहीं — बस एक लॉन्च तिथि जिसका हम स्वयं पालन करते हैं।"
  ),
  "site.about.countdown.date": mt("याज़ी जागरण — 1 जनवरी 2027"),
  "site.about.landscapes.q": mt("इस साइट पर पाँच भूदृश्य"),
  "site.about.landscapes.p": mt(
    "जिन दृश्यों से आप गुज़रते हैं — पहाड़, जंगल, खेत, रेगिस्तान, समुद्र — वे ஐந்திணை का अनुसरण करते हैं, यानी 2,000 साल पुरानी संगम कविता के पाँच भूदृश्य। हर भूदृश्य अपने शास्त्रीय काव्य-विषय के साथ जुड़ा है, ठीक जैसे तमिल साहित्य में सिखाया जाता है। यह हमारा नक़्शा है: पुरानी ज़मीन, नया काम।"
  ),
  "site.about.who.q": mt("इसे कौन चलाता है और हम तक कैसे पहुँचें"),
  "site.about.who.p1": mt(
    "याज़ी उन स्वयंसेवकों द्वारा चलाया जाता है जो इसे बनाते हैं, खुले तौर पर। हमारा सारा काम सार्वजनिक है"
  ),
  "site.about.who.p2": mt(
    "— सवाल, मुद्दे और नमस्ते, सबका स्वागत है। हमारा"
  ),
  "site.about.who.p3": mt("गोपनीयता नोट भी देखें"),

  // ── Privacy page ──────────────────────────────────────────────────────
  "site.privacy.title": mt("गोपनीयता"),
  "site.privacy.description": mt(
    "याज़ी क्या एकत्र करता है, क्या आपके डिवाइस पर रहता है, और परिवारों को इस साइट का उपयोग कैसे करना चाहिए।"
  ),
  "site.privacy.updated": mt("अंतिम अपडेट: जुलाई 2026"),
  "site.privacy.collect.q": mt("हम क्या एकत्र करते हैं — और वह कहाँ रहता है"),
  "site.privacy.collect.p": mt(
    "जब आप नेटवर्क से जुड़ते हैं, तो आपका दर्ज किया गया हैंडल और फ़ोन नंबर केवल आपके अपने ब्राउज़र (localStorage) में सहेजा जाता है। वे हमारे सर्वर पर न भेजे जाते हैं न सहेजे जाते हैं। अपना ब्राउज़र डेटा साफ़ करने से वे पूरी तरह हट जाते हैं।"
  ),
  "site.privacy.location.q": mt("स्थान"),
  "site.privacy.location.p": mt(
    "ऑनबोर्डिंग के दौरान हम स्वतः पहचाना गया क्षेत्र-लेबल (जैसे शहर का नाम) दिखाते हैं। यह हमारे होस्टिंग प्रदाता के नेटवर्क हेडर से आता है, जो हमारा कोड चलने से पहले ही तय हो जाता है। हम केवल वही मोटा लेबल पढ़ते हैं — आपका IP पता हम कभी नहीं पढ़ते, सहेजते या आगे नहीं भेजते, और कोई सटीक स्थान कभी एकत्र नहीं किया जाता।"
  ),
  "site.privacy.links.q": mt("इस साइट से बाहर जाने वाले लिंक"),
  "site.privacy.links.p": mt(
    "व्हाट्सएप, Discord और GitHub लिंक आपको तृतीय-पक्ष प्लेटफ़ॉर्म पर ले जाते हैं जिनकी अपनी शर्तें और गोपनीयता नीतियाँ हैं। वे प्लेटफ़ॉर्म आमतौर पर उपयोगकर्ताओं को 13 वर्ष (कुछ क्षेत्रों में 16) या उससे अधिक होने की अपेक्षा करते हैं।"
  ),
  "site.privacy.children.q": mt("बच्चे"),
  "site.privacy.children.p": mt(
    "बच्चे साइट देख सकते हैं — यहाँ ऐसा कुछ भी नहीं जिसके लिए खाता चाहिए। अगर आप 13 से कम आयु के हैं, तो नेटवर्क या चैट समुदायों से माता-पिता या अभिभावक के साथ ही जुड़ें।"
  ),
  "site.privacy.changes.q": mt("अगर इसमें बदलाव हो"),
  "site.privacy.changes.p": mt(
    "याज़ी लॉन्च से पहले है। अगर कभी खाते सर्वर पर जाएँ, तो हम कुछ भी एकत्र करने से पहले यह पेज अपडेट करेंगे और स्पष्ट रूप से बताएँगे कि क्या सहेजा जाता है और क्यों।"
  ),
  "site.privacy.contact.q": mt("संपर्क"),
  "site.privacy.contact.p": mt("कोई सवाल है? हम से मिलिए:"),

  // ── Cross-section chrome (added with the full-coverage pass) ──────────
  "site.identity.name": mt("याझी"),
  "site.identity.tagline": mt("भारतीय भाषाओं के लिए संप्रभु एआई"),
  "site.identity.heroLine": mt(
    "हम उन बच्चों के लिए एक आवाज़-मित्र से शुरुआत कर रहे हैं जो अभी पढ़ना या टाइप करना नहीं जानते।"
  ),
  "site.hero.eyebrow": mt("कुरिंजी · पहाड़ — 22+ लिपियाँ, एक मॉडल"),
  "site.hero.talkCta": mt("याझी से बात करें"),
  "site.hero.openChatCta": mt("चैट खोलें"),
  "site.hero.landscapesLabel": mt("पाँच भूदृश्य"),
  "site.hero.scrollCue": mt("देखने के लिए नीचे स्क्रॉल करें"),
  "site.thinai.landscape.0.name": mt("பாலை"),
  "site.thinai.landscape.1.name": mt("முல்லை"),
  "site.thinai.landscape.2.name": mt("குறிஞ்சி"),
  "site.thinai.landscape.3.name": mt("மருதம்"),
  "site.thinai.landscape.4.name": mt("நெய்தல்"),
  "site.hero.yazhCaption": mt("याझ को बजाइए — हर तार अगली तार को जगाती है"),
  "site.hero.homeLabel": mt("याझी — मुखपृष्ठ"),
  "site.hero.skipIntro": mt("छोड़ें →"),
  "site.nav.home": mt("याझी — मुखपृष्ठ"),
  "site.nav.menu": mt("मेन्यू"),
  "site.nav.label": mt("याझी"),
  "site.nav.fiveLandscapes": mt("पाँच भूदृश्य"),
  "site.nav.thinaiItem": mt("{ta} · {en} — {landscape}"),
  "site.nav.backToTop": mt("ऊपर जाएँ"),
  "site.nav.link.0": mt("याझ"),
  "site.nav.link.1": mt("आधन"),
  "site.nav.link.2": mt("संगम"),
  "site.nav.link.3": mt("बनाइए"),
  "site.sangam.pillar.0": mt("काव्य-विश्लेषण"),
  "site.sangam.pillar.1": mt("भूदृश्य-वर्गीकरण"),
  "site.sangam.pillar.2": mt("भाषा-विज्ञान अध्ययन"),
  "site.services.label": mt("सेवाएँ"),
  "site.services.comingSoon": mt("जल्द आ रहा है"),
  "site.services.asideLabel": mt("सेवाएँ — जल्द आ रहा है"),
  "site.thinai.eyebrow": mt("याझ की दुनिया · திணை"),
  "site.thinai.title": mt("पाँच भूमियाँ, पाँच मनोदशाएँ"),
  "site.thinai.landscape.0.mood": mt("सूखी भूमि · सहन करना"),
  "site.thinai.landscape.0.body": mt("साहस और वियोग — कठिन कहानियाँ।"),
  "site.thinai.landscape.1.mood": mt("वन · प्रतीक्षा"),
  "site.thinai.landscape.1.body": mt("जानवर, धैर्य और वे लोककथाएँ जो बच्चे जानते हैं।"),
  "site.thinai.landscape.2.mood": mt("पहाड़ · पहली मुलाक़ात"),
  "site.thinai.landscape.2.body": mt("जिज्ञासा और खोज — जहाँ कहानी शुरू होती है।"),
  "site.thinai.landscape.3.mood": mt("खेत · रोज़मर्रा का जीवन"),
  "site.thinai.landscape.3.body": mt("गिनती, काम और परिवार — जहाँ सबक़ बसते हैं।"),
  "site.thinai.landscape.4.mood": mt("तट · ललक"),
  "site.thinai.landscape.4.body": mt("यात्राएँ और दूरी — प्रवासियों की भूमि।"),
  "site.thinai.foot": mt(
    "संगम कविता संसार को इन पाँच तिणै में बाँटती है। याझ की कहानी-पुस्तकालय भी उसी तरह व्यवस्थित है — यह ढाँचा तमिल में जड़ों तक बसा है, ऊपर से लगाया गया अलंकार नहीं।"
  ),
  "site.section.yazhi.thinai": mt("குறிஞ்சி"),
  "site.section.yazhi.landscape": mt("पहाड़ · पहला मिलन"),
  "site.section.adhan.thinai": mt("முல்லை"),
  "site.section.adhan.landscape": mt("वन · प्रतीक्षा"),
  "site.section.guardian.thinai": mt("பாலை"),
  "site.section.guardian.landscape": mt("बंजर भूमि · वियोग"),
  "site.section.sangam.thinai": mt("மருதம்"),
  "site.section.sangam.landscape": mt("खेत · प्रणय-कलह"),
  "site.section.community.thinai": mt("நெய்தல்"),
  "site.section.community.landscape": mt("तट · विरह"),
  "site.about.backLink": mt("← யாழி · Yazhi"),
  "site.about.metadataTitle": mt("हमारे बारे में — याझी • About — Yazhi"),
  "site.privacy.metadataTitle": mt("गोपनीयता — याझी • Privacy — Yazhi"),
  "site.about.who.p4": mt("देखें।"),

  // ── Onboarding (server chrome: the form copy is in the strings catalogue) ──
  "site.onboarding.nodeRegion": mt(
    "नोड क्षेत्र: {region} — स्वतः पहचाना गया, केवल शहर-स्तर तक अनाम।"
  ),
  "site.onboarding.detecting": mt("नोड क्षेत्र का पता लगाया जा रहा है…"),
  "site.onboarding.developer.nextSteps.1": mt(
    "आज डेवलपर्स यहीं तालमेल बिठाते हैं, सवाल पूछते हैं और देखते हैं क्या बन रहा है।"
  ),
  "site.onboarding.developer.nextSteps.2": mt(
    "स्व-सेवा खाते अभी बन रहे हैं, इसलिए हम इन्हें हाथ से बनाते हैं — तैयार होने पर हम व्हाट्सएप/Discord पर संपर्क करेंगे।"
  ),
  "site.onboarding.developer.stepJoinDiscord": mt("Discord से जुड़ें"),
  "site.onboarding.developer.stepApiAccount": mt("आपका याज़ी एपीआई खाता"),
  "site.onboarding.developer.stepTwo": mt("यहाँ से दो बातें होती हैं:"),
};

export const HI_SITE: Record<string, TranslationEntry> = hi;

export default HI_SITE;
