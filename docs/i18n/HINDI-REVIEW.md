# Hindi review — every machine-drafted string, with its English source

**Status: MACHINE DRAFT. NONE OF THIS IS REVIEWED.** Every row below is
`{ origin: "mt", reviewRequired: true }` in the code, and Hindi is never
served as `reviewed` until a native speaker signs the line off here.

Generated from the catalogues by `scripts/.gen-hindi-review.mjs` — regenerate
after each review pass; do not hand-edit the tables.

## How to review

1. Read the **Hindi (draft)** against the **English source**, and against the
   Tamil original where the file has one (`src/lib/content.ts`). Tamil is the
   site's voice; where Tamil and English differ, translate the Tamil.
2. Fix the Hindi in the file named in the **where** column:
   - `src/lib/content.hi.ts` — site copy (`site.*`)
   - `packages/i18n/src/locales/ui.ts` — the language switcher's own chrome
   - `packages/i18n/src/strings/{chat,app}.ts` — in-app chrome
   - `packages/bubble/src/locales/hi.ts` — the Bubble UI library's own copy
     (the words *inside* a bubble: composer, citations, guardrails, Mission
     Control, the Kadai product row)
3. Sign a line off by setting `origin: "reviewed", reviewRequired: false`
   (site: in `content.hi.ts`; chrome: in the triple files). Clear
   `needsNativeReview` in `LOCALE_META` only when every row is signed off.
4. Keep the terms transliterated, never re-concepted: याझी (Yazhi), याझ (Yazh),
   आधन (Adhan), संगम (Sangam), तिणै (thinai), अकम / पुरम (akam / puram),
   याझी एपीआई (yazhi-api), मिशन कंट्रोल (Mission Control), बबल UI (Bubble UI).
   Copy `{placeholders}` verbatim (the order may change). Never translate the
   Maduraikkanci verse, the demo transcript or agent system prompts — none of
   them are in these tables.

## Tamil review, separately

Tamil written for the first time in Wave B is marked
`// DRAFT: native review pending` in `src/lib/content.ts` and
`packages/i18n/src/strings/*.ts`: the LANGUAGE_ROADMAP steps,
THINAI_WORLD moods and bodies, the English-only `body` fields of
YAZHI_SECTION / ADHAN / GUARDIAN / SANGAM / DEVELOPERS, `REPOS[].what`,
About / Privacy body copy, onboarding and profile chrome, and chat / Circle /
builder chrome. A native reviewer should read those beside the English source
in the same table below (the Tamil column of `content.ts`'s `SITE_PAIRS`).

## Site copy — `site.*` (204 keys)

| # | Key | Hindi (draft, MT) | English source | Where |
|---|---|---|---|---|
| 1 | `site.about.backLink` | ← யாழி · Yazhi | ← யாழி · Yazhi | src/lib/content.hi.ts |
| 2 | `site.about.building.adhan` | आधन (அதன்) — हमारा खुला इंडिक आधार मॉडल, 22+ भारतीय भाषाओं के लिए बनाया गया, पहले तमिल और फिर बाकी द्रविड़ परिवार। यह अभी प्रशिक्षण में है; आज भाषाओं की संख्या की जानकारी हमारी रोडमैप पर है, किसी रिलीज़ पर नहीं। | Adhan (அதன்) — our open Indic foundation model, built for 22+ Indian languages, starting with Tamil and then the rest of the Dravidian family. It is still in training; our roadmap, not a release, is where the language count lives today. | src/lib/content.hi.ts |
| 3 | `site.about.building.q` | हम क्या बना रहे हैं | What we're building | src/lib/content.hi.ts |
| 4 | `site.about.building.sangam` | संगम (சங்கம்) — संगम कविता के पाँच भूदृश्यों (ஐந்திணை) के ज़रिए शास्त्रीय तमिल साहित्य का विश्लेषण। अभी उपलब्ध: | Sangam (சங்கம்) — analysis of classical Tamil literature through the five landscapes (ஐந்திணை) of Sangam poetry. Live at | src/lib/content.hi.ts |
| 5 | `site.about.building.yazh` | याझ गार्डियन (யாழ்) — तमिल डिजिटल विरासत और सामुदायिक ज्ञान की रक्षा करने वाला ऐप। | Yazh Guardian (யாழ்) — an app protecting Tamil digital heritage and community knowledge. | src/lib/content.hi.ts |
| 6 | `site.about.countdown.bold` | {date} — हमारा सार्वजनिक लॉन्च | {date} — our public launch | src/lib/content.hi.ts |
| 7 | `site.about.countdown.date` | याज़ी जागरण — 1 जनवरी 2027 | Yazhi Awakening — 1 January 2027 | src/lib/content.hi.ts |
| 8 | `site.about.countdown.post` | तक चलती है: वह दिन जब मॉडल, औज़ार और सामुदायिक कार्यक्रम पूरी तरह खुलते हैं। कोई रहस्य नहीं — बस एक लॉन्च तिथि जिसका हम स्वयं पालन करते हैं। | , our public launch: the day the models, tools, and community programs open fully. Nothing mysterious — just a launch date we hold ourselves to. | src/lib/content.hi.ts |
| 9 | `site.about.countdown.pre` | होम पेज पर उलटी गिनती | The timer on the home page counts down to the | src/lib/content.hi.ts |
| 10 | `site.about.countdown.q` | उलटी गिनती क्या है? | What is the countdown? | src/lib/content.hi.ts |
| 11 | `site.about.description` | याझी के पीछे कौन है, हम क्या बना रहे हैं, और जागरण उलटी गिनती का क्या अर्थ है। | Who is behind Yazhi, what we're building, and what the Awakening countdown means. | src/lib/content.hi.ts |
| 12 | `site.about.landscapes.p` | जिन दृश्यों से आप गुज़रते हैं — पहाड़, जंगल, खेत, रेगिस्तान, समुद्र — वे ஐந்திணை का अनुसरण करते हैं, यानी 2,000 साल पुरानी संगम कविता के पाँच भूदृश्य। हर भूदृश्य अपने शास्त्रीय काव्य-विषय के साथ जुड़ा है, ठीक जैसे तमिल साहित्य में सिखाया जाता है। यह हमारा नक़्शा है: पुरानी ज़मीन, नया काम। | The scenery you scroll through — mountain, forest, farmland, desert, sea — follows the ஐந்திணை, the five landscapes of 2,000-year-old Sangam poetry. Each landscape is paired with its classical poetic theme, exactly as taught in Tamil literature. It's our map: old land, new work. | src/lib/content.hi.ts |
| 13 | `site.about.landscapes.q` | इस साइट पर पाँच भूदृश्य | The five landscapes on this site | src/lib/content.hi.ts |
| 14 | `site.about.metadataTitle` | हमारे बारे में — याझी • About — Yazhi | எங்களைப் பற்றி — யாழி • About — Yazhi | src/lib/content.hi.ts |
| 15 | `site.about.title` | याझी के बारे में | About Yazhi | src/lib/content.hi.ts |
| 16 | `site.about.what.p1` | याज़ी (யாழி) भारतीय भाषाओं के लिए संप्रभु एआई बनाने वाली एक सामुदायिक पहल है — शुरुआत तमिल से। सरल शब्दों में: हम कंप्यूटर को तमिल और हर दूसरी भारतीय भाषा को समझना, पढ़ना और बोलना सिखाते हैं, काम खुले तौर पर, समुदाय द्वारा, समुदाय के लिए होता है। | Yazhi (யாழி) is a community initiative building sovereign AI for Indian languages — starting from Tamil. In plain words: we teach computers to understand, read, and speak Tamil and every other Indian language, with the work done in the open, by the community, for the community. | src/lib/content.hi.ts |
| 17 | `site.about.what.p2` | यह नाम याझी से आया है, तमिल मंदिर के खंभों पर तराशा गया पौराणिक संरक्षक — आधा सिंह, आधा हाथी — दहलीज़ का रक्षक। | The name comes from the yazhi, the mythical guardian carved on Tamil temple pillars — part lion, part elephant — the keeper at the threshold. | src/lib/content.hi.ts |
| 18 | `site.about.what.q` | याज़ी क्या है? | What is Yazhi? | src/lib/content.hi.ts |
| 19 | `site.about.who.p1` | याज़ी उन स्वयंसेवकों द्वारा चलाया जाता है जो इसे बनाते हैं, खुले तौर पर। हमारा सारा काम सार्वजनिक है | Yazhi is run by the volunteers who build it, in the open. All our work is public at | src/lib/content.hi.ts |
| 20 | `site.about.who.p2` | — सवाल, मुद्दे और नमस्ते, सबका स्वागत है। हमारा | — questions, issues, and hellos all welcome there. Also see our | src/lib/content.hi.ts |
| 21 | `site.about.who.p3` | गोपनीयता नोट भी देखें | privacy note | src/lib/content.hi.ts |
| 22 | `site.about.who.p4` | देखें। | See | src/lib/content.hi.ts |
| 23 | `site.about.who.q` | इसे कौन चलाता है और हम तक कैसे पहुँचें | Who runs this & how to reach us | src/lib/content.hi.ts |
| 24 | `site.adhan.body` | आधन हमारा खुला इंडिक आधार मॉडल है, जो 22+ भारतीय भाषाओं के लिए बनाया गया है, और जिसका टोकनाइज़र अंग्रेज़ी से पुनर्निर्मित करने के बजाय अग्लूटिनेटिव व्याकरण के लिए बनाया गया है। पहले तमिल, फिर तेलुगु, कन्नड़ और मलयालम। प्रशिक्षण शिवकाशी में हमारी ही मशीनों पर चलता है। यह पूरा नहीं हुआ है और इसका पूरा होना लक्ष्य भी नहीं है — मॉडल लगातार विकसित होता रहता है, कॉर्पस बढ़ने और हर नई भाषा के पाइपलाइन में आने के साथ बढ़ता रहता है। | Adhan is our open Indic foundation model, designed for 22+ Indian languages, with a tokenizer built for agglutinative grammar rather than retrofitted from English. Tamil comes first, then Telugu, Kannada and Malayalam. Training runs on our own machines in Sivakasi. It is not finished and is not meant to be — the model develops continuously, growing as the corpus grows and as each new language enters the pipeline. | src/lib/content.hi.ts |
| 25 | `site.adhan.cta` | आधन को GitHub पर देखें → | View Adhan on GitHub → | src/lib/content.hi.ts |
| 26 | `site.adhan.eyebrow` | नीचे चलने वाला इंजन | The engine underneath | src/lib/content.hi.ts |
| 27 | `site.adhan.name` | आधन | Adhan | src/lib/content.hi.ts |
| 28 | `site.adhan.plain` | भारत की भाषाओं को पढ़ना और बोलना सीखता रहने वाला कंप्यूटर मस्तिष्क — काम अभी पूरा नहीं हुआ, यह बढ़ता रहता है। | A computer brain still learning to read and speak India's languages — the work isn't finished, it keeps growing. | src/lib/content.hi.ts |
| 29 | `site.adhan.sub` | भारतीय भाषाओं के लिए हमारा खुला इंडिक आधार मॉडल | Our open Indic foundation model | src/lib/content.hi.ts |
| 30 | `site.adhan.tokenTax.label` | भारतीय भाषाओं पर टोकन कर — एक ही वाक्य में प्रति शब्द खर्च किए गए टोकन | The token tax on Indian languages — tokens spent per word, same sentence | src/lib/content.hi.ts |
| 31 | `site.adhan.tokenTax.row.0` | अंग्रेज़ी | English | src/lib/content.hi.ts |
| 32 | `site.adhan.tokenTax.row.1` | हिंदी | Hindi | src/lib/content.hi.ts |
| 33 | `site.adhan.tokenTax.row.2` | तेलुगु | Telugu | src/lib/content.hi.ts |
| 34 | `site.adhan.tokenTax.row.3` | तमिल | Tamil | src/lib/content.hi.ts |
| 35 | `site.adhan.tokenTax.source` | पेत्रोव एवं अन्य, NeurIPS 2023 | Petrov et al., NeurIPS 2023 | src/lib/content.hi.ts |
| 36 | `site.community.card.0.body` | योगदानकर्ताओं, एनोटेटरों और बिल्डरों के लिए प्रवेश। | Onboarding for contributors, annotators, and builders. | src/lib/content.hi.ts |
| 37 | `site.community.card.0.title` | नेटवर्क से जुड़ें | Join the Network | src/lib/content.hi.ts |
| 38 | `site.community.card.1.body` | रोज़ की बातचीत — तमिल एआई बिल्डर, शोधकर्ता और लेखक। | The daily conversation — Tamil AI builders, researchers, and writers. | src/lib/content.hi.ts |
| 39 | `site.community.card.1.title` | Discord | Discord | src/lib/content.hi.ts |
| 40 | `site.community.card.2.body` | खुला काम — मॉडल, औज़ार और मूल्यांकन सूट। | The open work — models, tooling, and evaluation suites. | src/lib/content.hi.ts |
| 41 | `site.community.card.2.title` | GitHub | GitHub | src/lib/content.hi.ts |
| 42 | `site.community.chatAge` | बातचीत मंच (व्हाट्सएप, Discord) में 13 वर्ष और उससे अधिक उम्र के लोगों की सहमति होती है — बच्चे माता-पिता के साथ जुड़ें। | Chat platforms (WhatsApp, Discord) require age 13+ — kids, join with a parent. | src/lib/content.hi.ts |
| 43 | `site.community.plain` | तमिल और कंप्यूटर से प्यार करने वाले असली लोग, मिलकर इसे बना रहे हैं — आपका स्वागत है। | Real people who love Tamil and computers, building this together — you're welcome to join. | src/lib/content.hi.ts |
| 44 | `site.community.sub` | समुद्रों के पार तमिल — नेटवर्क से जुड़ें | Tamil across the seas — join the network | src/lib/content.hi.ts |
| 45 | `site.community.title` | समुदाय | Community | src/lib/content.hi.ts |
| 46 | `site.developers.body` | पूरे भारत के डेवलपर्स का एक समुदाय, जो उन भाषाओं के लिए एआई बना रहा है जिनमें हम बड़े हुए। आधन के खुले वज़न या याज़ी एपीआई से शुरू करें, अपनी भाषा में एजेंट और औज़ार बनाइए, और उन इंजीनियरों से सहायता पाइए जिन्होंने ऐसा पहले किया है। | A community of developers across India, building AI for the languages we grew up speaking. Start on Adhan's open weights or the Yazhi API, ship agents and tools in your own language, and land support from engineers who've done the same. | src/lib/content.hi.ts |
| 47 | `site.developers.cta` | डेवलपर के रूप में जुड़ें | Join as a developer | src/lib/content.hi.ts |
| 48 | `site.developers.discordCta` | Discord से जुड़ें | Join the Discord | src/lib/content.hi.ts |
| 49 | `site.developers.eyebrow` | डेवलपर्स के लिए | For developers | src/lib/content.hi.ts |
| 50 | `site.developers.plain` | पूरे भारत के डेवलपर्स अपनी मातृभाषाओं के लिए एआई औज़ार बना रहे हैं — आप भी जुड़ सकते हैं। | Developers across India building AI tools for their own mother tongues — you're welcome to join in. | src/lib/content.hi.ts |
| 51 | `site.developers.title` | अपनी मातृभाषा के लिए बनाइए | Build for your mother tongue | src/lib/content.hi.ts |
| 52 | `site.hero.eyebrow` | कुरिंजी · पहाड़ — 22+ लिपियाँ, एक मॉडल | Kurinji · Mountains — 22+ scripts, one model | src/lib/content.hi.ts |
| 53 | `site.hero.homeLabel` | याझी — मुखपृष्ठ | Yazhi home | src/lib/content.hi.ts |
| 54 | `site.hero.landscapesLabel` | पाँच भूदृश्य | Five landscapes | src/lib/content.hi.ts |
| 55 | `site.hero.openChatCta` | चैट खोलें | Open the chat | src/lib/content.hi.ts |
| 56 | `site.hero.scrollCue` | देखने के लिए नीचे स्क्रॉल करें | scroll to explore | src/lib/content.hi.ts |
| 57 | `site.hero.skipIntro` | छोड़ें → | Skip → | src/lib/content.hi.ts |
| 58 | `site.hero.talkCta` | याझी से बात करें | Talk to Yazhi | src/lib/content.hi.ts |
| 59 | `site.hero.yazhCaption` | याझ को बजाइए — हर तार अगली तार को जगाती है | Pluck the yazh — each string wakes the next | src/lib/content.hi.ts |
| 60 | `site.identity.copyright` | © 2026 याझी • Yazhi | © 2026 யாழி • Yazhi | src/lib/content.hi.ts |
| 61 | `site.identity.footer` | संप्रभु कृत्रिम बुद्धिमत्ता | Sovereign Artificial Intelligence | src/lib/content.hi.ts |
| 62 | `site.identity.heroLine` | हम उन बच्चों के लिए एक आवाज़-मित्र से शुरुआत कर रहे हैं जो अभी पढ़ना या टाइप करना नहीं जानते। | Starting with a voice friend for children who cannot yet read or type. | src/lib/content.hi.ts |
| 63 | `site.identity.name` | याझी | Yazhi | src/lib/content.hi.ts |
| 64 | `site.identity.positioning` | भारतीय भाषाओं के लिए संप्रभु एआई | Sovereign AI for Indian languages | src/lib/content.hi.ts |
| 65 | `site.identity.secondary` | अकम और पुरम | Akam and Puram | src/lib/content.hi.ts |
| 66 | `site.identity.tagline` | भारतीय भाषाओं के लिए संप्रभु एआई | Sovereign AI for Indian languages | src/lib/content.hi.ts |
| 67 | `site.languageRoadmap.foot` | तमिल और तेलुगु एक ही द्रविड़ व्याकरण रीढ़ और वही टोकनाइज़र समस्या साझा करते हैं। तमिल को ठीक से हल करना तेलुगु के रास्ते में एक विचलन नहीं — यही ज़्यादातर काम है। | Tamil and Telugu share a Dravidian grammar backbone and the same tokenizer problem. Solving Tamil properly is not a detour on the way to Telugu — it is most of the work. | src/lib/content.hi.ts |
| 68 | `site.languageRoadmap.step.0.body` | हमारी घर की भाषा और सबसे कठिन परीक्षा। कॉर्पस, टोकनाइज़र, आवाज़ और पहले परिवार, सब यहीं हैं। | Our home language and hardest test case. Corpus, tokenizer, voice and the first families all live here. | src/lib/content.hi.ts |
| 69 | `site.languageRoadmap.step.0.lang` | तमिल | Tamil | src/lib/content.hi.ts |
| 70 | `site.languageRoadmap.step.0.stage` | अब | Now | src/lib/content.hi.ts |
| 71 | `site.languageRoadmap.step.1.body` | ~9.6 करोड़ वक्ता, तमिल की तरह अग्लूटिनेटिव, वही टोकनाइज़र समस्या — स्वाभाविक दूसरी भाषा। | ~96M speakers, agglutinative like Tamil, the same tokenizer problem — the natural second language. | src/lib/content.hi.ts |
| 72 | `site.languageRoadmap.step.1.lang` | तेलुगु | Telugu | src/lib/content.hi.ts |
| 73 | `site.languageRoadmap.step.1.stage` | आगे | Next | src/lib/content.hi.ts |
| 74 | `site.languageRoadmap.step.2.body` | बाकी द्रविड़ परिवार — साझा रूप-विज्ञान यानी साझा टोकनाइज़र लाभ। | The rest of the Dravidian family — shared morphology means shared tokenizer gains. | src/lib/content.hi.ts |
| 75 | `site.languageRoadmap.step.2.lang` | कन्नड़, मलयालम | Kannada, Malayalam | src/lib/content.hi.ts |
| 76 | `site.languageRoadmap.step.2.stage` | फिर | Then | src/lib/content.hi.ts |
| 77 | `site.languageRoadmap.step.3.body` | एक खुला मॉडल, एक एपीआई, हर अनुसूचित भाषा। यह डिज़ाइन लक्ष्य है, पूरा हुआ परिणाम नहीं — आज पाइपलाइन में तमिल है, फिर तेलुगु, कन्नड़ और मलयालम। | One open model, one API, every scheduled language. That is the design goal, not a shipped result — today the pipeline holds Tamil, then Telugu, Kannada and Malayalam. | src/lib/content.hi.ts |
| 78 | `site.languageRoadmap.step.3.lang` | 22+ भाषाएँ | 22+ languages | src/lib/content.hi.ts |
| 79 | `site.languageRoadmap.step.3.stage` | लक्ष्य | Goal | src/lib/content.hi.ts |
| 80 | `site.languageRoadmap.title` | पहले तमिल, केवल तमिल नहीं | Tamil first, not Tamil only | src/lib/content.hi.ts |
| 81 | `site.nav.backToTop` | ऊपर जाएँ | Back to top | src/lib/content.hi.ts |
| 82 | `site.nav.fiveLandscapes` | पाँच भूदृश्य | Five landscapes | src/lib/content.hi.ts |
| 83 | `site.nav.groups.0.items.0` | याझ | Yazh | src/lib/content.hi.ts |
| 84 | `site.nav.groups.0.items.1` | आधन | Adhan | src/lib/content.hi.ts |
| 85 | `site.nav.groups.0.items.2` | ओपन संगम | Open Sangam | src/lib/content.hi.ts |
| 86 | `site.nav.groups.0.items.3` | तिणै | Thinai | src/lib/content.hi.ts |
| 87 | `site.nav.groups.0.label` | परियोजनाएँ | Projects | src/lib/content.hi.ts |
| 88 | `site.nav.groups.1.items.0` | एजेंट | Agents | src/lib/content.hi.ts |
| 89 | `site.nav.groups.1.items.1` | अनुप्रयोग | Applications | src/lib/content.hi.ts |
| 90 | `site.nav.groups.1.items.2` | কுறிப்புரைகள் | Annotations | src/lib/content.hi.ts |
| 91 | `site.nav.groups.1.label` | सेवाएँ | Services | src/lib/content.hi.ts |
| 92 | `site.nav.groups.2.items.0` | नेटवर्क से जुड़ें | Join the Network | src/lib/content.hi.ts |
| 93 | `site.nav.groups.2.items.1` | Discord | Discord | src/lib/content.hi.ts |
| 94 | `site.nav.groups.2.items.2` | GitHub | GitHub | src/lib/content.hi.ts |
| 95 | `site.nav.groups.2.items.3` | रिपॉज़िटरी | Repositories | src/lib/content.hi.ts |
| 96 | `site.nav.groups.2.items.4` | बबल UI | Bubble UI | src/lib/content.hi.ts |
| 97 | `site.nav.groups.2.items.5` | हमारे बारे में | About | src/lib/content.hi.ts |
| 98 | `site.nav.groups.2.items.6` | गोपनीयता | Privacy | src/lib/content.hi.ts |
| 99 | `site.nav.groups.2.label` | समुदाय | Community | src/lib/content.hi.ts |
| 100 | `site.nav.home` | याझी — मुखपृष्ठ | Yazhi home | src/lib/content.hi.ts |
| 101 | `site.nav.label` | याझी | Yazhi | src/lib/content.hi.ts |
| 102 | `site.nav.link.0` | याझ | Yazh | src/lib/content.hi.ts |
| 103 | `site.nav.link.1` | आधन | Adhan | src/lib/content.hi.ts |
| 104 | `site.nav.link.2` | संगम | Sangam | src/lib/content.hi.ts |
| 105 | `site.nav.link.3` | बनाइए | Build | src/lib/content.hi.ts |
| 106 | `site.nav.menu` | मेन्यू | Menu | src/lib/content.hi.ts |
| 107 | `site.nav.thinaiItem` | {ta} · {en} — {landscape} | {ta} · {en} — {landscape} | src/lib/content.hi.ts |
| 108 | `site.onboarding.detecting` | नोड क्षेत्र का पता लगाया जा रहा है… | Detecting node region… | src/lib/content.hi.ts |
| 109 | `site.onboarding.developer.nextSteps.1` | आज डेवलपर्स यहीं तालमेल बिठाते हैं, सवाल पूछते हैं और देखते हैं क्या बन रहा है। | That's where developers coordinate today, ask questions, and see what's shipping. | src/lib/content.hi.ts |
| 110 | `site.onboarding.developer.nextSteps.2` | स्व-सेवा खाते अभी बन रहे हैं, इसलिए हम इन्हें हाथ से बनाते हैं — तैयार होने पर हम व्हाट्सएप/Discord पर संपर्क करेंगे। | We provision these by hand while self-serve account creation is still being built (tracked in docs/community/PRD-DEVELOPER-COMMUNITY.md). We'll reach out on WhatsApp/Discord once it's ready. | src/lib/content.hi.ts |
| 111 | `site.onboarding.developer.stepApiAccount` | आपका याज़ी एपीआई खाता | Your Yazhi API account | src/lib/content.hi.ts |
| 112 | `site.onboarding.developer.stepJoinDiscord` | Discord से जुड़ें | Join the Discord | src/lib/content.hi.ts |
| 113 | `site.onboarding.developer.stepTwo` | यहाँ से दो बातें होती हैं: | Two things happen from here: | src/lib/content.hi.ts |
| 114 | `site.onboarding.nodeRegion` | नोड क्षेत्र: {region} — स्वतः पहचाना गया, केवल शहर-स्तर तक अनाम। | Node region: {region} — auto-detected, anonymized to city level only. | src/lib/content.hi.ts |
| 115 | `site.privacy.changes.p` | याज़ी लॉन्च से पहले है। अगर कभी खाते सर्वर पर जाएँ, तो हम कुछ भी एकत्र करने से पहले यह पेज अपडेट करेंगे और स्पष्ट रूप से बताएँगे कि क्या सहेजा जाता है और क्यों। | Yazhi is pre-launch. If accounts ever move to a server, we will update this page before collecting anything, and say exactly what is stored and why. | src/lib/content.hi.ts |
| 116 | `site.privacy.changes.q` | अगर इसमें बदलाव हो | If this changes | src/lib/content.hi.ts |
| 117 | `site.privacy.children.p` | बच्चे साइट देख सकते हैं — यहाँ ऐसा कुछ भी नहीं जिसके लिए खाता चाहिए। अगर आप 13 से कम आयु के हैं, तो नेटवर्क या चैट समुदायों से माता-पिता या अभिभावक के साथ ही जुड़ें। | Kids are welcome to explore the site — there is nothing here that requires an account. If you are under 13, please only join the network or the chat communities together with a parent or guardian. | src/lib/content.hi.ts |
| 118 | `site.privacy.children.q` | बच्चे | Children | src/lib/content.hi.ts |
| 119 | `site.privacy.collect.p` | जब आप नेटवर्क से जुड़ते हैं, तो आपका दर्ज किया गया हैंडल और फ़ोन नंबर केवल आपके अपने ब्राउज़र (localStorage) में सहेजा जाता है। वे हमारे सर्वर पर न भेजे जाते हैं न सहेजे जाते हैं। अपना ब्राउज़र डेटा साफ़ करने से वे पूरी तरह हट जाते हैं। | When you join the network, the handle and phone number you enter are saved only in your own browser (localStorage). They are not sent to or stored on our servers. Clearing your browser data removes them completely. | src/lib/content.hi.ts |
| 120 | `site.privacy.collect.q` | हम क्या एकत्र करते हैं — और वह कहाँ रहता है | What we collect — and where it lives | src/lib/content.hi.ts |
| 121 | `site.privacy.contact.p` | कोई सवाल है? हम से मिलिए: | Questions? Reach us at | src/lib/content.hi.ts |
| 122 | `site.privacy.contact.q` | संपर्क | Contact | src/lib/content.hi.ts |
| 123 | `site.privacy.description` | याज़ी क्या एकत्र करता है, क्या आपके डिवाइस पर रहता है, और परिवारों को इस साइट का उपयोग कैसे करना चाहिए। | What Yazhi collects, what stays on your device, and how families should use the site. | src/lib/content.hi.ts |
| 124 | `site.privacy.links.p` | व्हाट्सएप, Discord और GitHub लिंक आपको तृतीय-पक्ष प्लेटफ़ॉर्म पर ले जाते हैं जिनकी अपनी शर्तें और गोपनीयता नीतियाँ हैं। वे प्लेटफ़ॉर्म आमतौर पर उपयोगकर्ताओं को 13 वर्ष (कुछ क्षेत्रों में 16) या उससे अधिक होने की अपेक्षा करते हैं। | The WhatsApp, Discord, and GitHub links take you to third-party platforms with their own terms and privacy policies. Those platforms generally require users to be 13 or older (16 in some regions). | src/lib/content.hi.ts |
| 125 | `site.privacy.links.q` | इस साइट से बाहर जाने वाले लिंक | Links that leave this site | src/lib/content.hi.ts |
| 126 | `site.privacy.location.p` | ऑनबोर्डिंग के दौरान हम स्वतः पहचाना गया क्षेत्र-लेबल (जैसे शहर का नाम) दिखाते हैं। यह हमारे होस्टिंग प्रदाता के नेटवर्क हेडर से आता है, जो हमारा कोड चलने से पहले ही तय हो जाता है। हम केवल वही मोटा लेबल पढ़ते हैं — आपका IP पता हम कभी नहीं पढ़ते, सहेजते या आगे नहीं भेजते, और कोई सटीक स्थान कभी एकत्र नहीं किया जाता। | We show an auto-detected region label (like a city name) during onboarding. It comes from our hosting provider's network headers, resolved before our code runs. We read only that coarse label — your IP address is never read, stored, or forwarded by us, and no precise location is ever collected. | src/lib/content.hi.ts |
| 127 | `site.privacy.location.q` | स्थान | Location | src/lib/content.hi.ts |
| 128 | `site.privacy.metadataTitle` | गोपनीयता — याझी • Privacy — Yazhi | தனியுரிமை — யாழி • Privacy — Yazhi | src/lib/content.hi.ts |
| 129 | `site.privacy.title` | गोपनीयता | Privacy | src/lib/content.hi.ts |
| 130 | `site.privacy.updated` | अंतिम अपडेट: जुलाई 2026 | Last updated: July 2026 | src/lib/content.hi.ts |
| 131 | `site.repos.allIssues` | सभी खुले मुद्दे | All open issues | src/lib/content.hi.ts |
| 132 | `site.repos.goodFirst` | शुरुआती मुद्दे → | Good first issues → | src/lib/content.hi.ts |
| 133 | `site.repos.intro` | हमारा सारा खुला काम GitHub पर yazhi-lem के अंतर्गत है। एक रिपॉज़िटरी चुनें, उसका README पढ़ें, और good first issue लेबल वाले मुद्दे से शुरुआत करें। हर पुल रिक्वेस्ट की पहली समीक्षा 48 घंटों में होती है, और योगदानकर्ताओं का नाम अंकित किया जाता है। | Everything we build in the open lives on GitHub under yazhi-lem. Pick a repo, read its README, and start with an issue labelled good first issue. Every pull request gets a first review within 48 hours, and contributors are credited by name. | src/lib/content.hi.ts |
| 134 | `site.repos.link` | खुली रिपॉज़िटरी देखें | Browse our open-source repos | src/lib/content.hi.ts |
| 135 | `site.repos.note` | good-first-issue सूचियाँ अभी भरी जा रही हैं। अगर कोई सूची खाली है, खुले मुद्दे देखें या Discord पर नमस्ते कहें। | Good-first-issue lists are being filled in now. If a list is empty, browse the open issues or say hello on Discord. | src/lib/content.hi.ts |
| 136 | `site.repos.reference` | संदर्भ | Reference | src/lib/content.hi.ts |
| 137 | `site.repos.title` | ओपन-सोर्स रिपॉज़िटरी | Open-source repositories | src/lib/content.hi.ts |
| 138 | `site.repos.what.0` | तमिल भाषा-मॉडल का काम: स्वरम टोकनाइज़र, कॉर्पस तैयारी, प्रशिक्षण, मूल्यांकन, अनुमान सर्वर | Tamil language model work: Swaram tokenizer, corpus prep, training, evaluation, inference server | src/lib/content.hi.ts |
| 139 | `site.repos.what.1` | शास्त्रीय तमिल कॉर्पस और परतदार पाठक: संगम तमिल, आधुनिक तमिल, अंग्रेज़ी | Classical Tamil corpus and layered reader: Sangam Tamil, modern Tamil, English | src/lib/content.hi.ts |
| 140 | `site.repos.what.2` | तमिल मोबाइल कीबोर्ड, पहले Android पर; फ़ोन से कुछ भी बाहर नहीं जाता | Tamil mobile keyboard, Android first; nothing typed leaves the phone | src/lib/content.hi.ts |
| 141 | `site.repos.what.3` | याझ: बच्चों के लिए द्विभाषी सीखने-खेलने वाला ऐप (Unity 6) | Yazh: bilingual learning pet app for children (Unity 6) | src/lib/content.hi.ts |
| 142 | `site.repos.what.4` | याज़ी.देव वेबसाइट | The yazhi.dev website | src/lib/content.hi.ts |
| 143 | `site.repos.what.5` | एजेंट स्किल्स और सीखने की सामग्री (SKILL.md प्रारूप) | Agent skills and learning content (SKILL.md format) | src/lib/content.hi.ts |
| 144 | `site.repos.what.6` | Google की स्टाइल गाइड का फ़ोर्क (संदर्भ) | Fork of Google's style guides (reference) | src/lib/content.hi.ts |
| 145 | `site.sangam.body` | शास्त्रीय साहित्य के लिए एक खुला मंच — संगम कविता और उससे आगे, कविता-विश्लेषण, भूदृश्य-वर्गीकरण और भाषा-विज्ञान अध्ययन के साथ। छात्रों, शिक्षकों और विद्वानों के लिए निःशुल्क। यह वही कॉर्पस भी है जो आधन को सिखाता है कि असली भाषा कैसी लगती है। | An open platform for classical literature — Sangam poetry and beyond, with poem analysis, landscape classification and linguistic study. Free for students, teachers and scholars. It is also the corpus that teaches Adhan what real language sounds like. | src/lib/content.hi.ts |
| 146 | `site.sangam.cta` | और जानें | Learn more → | src/lib/content.hi.ts |
| 147 | `site.sangam.eyebrow` | वह स्मृति जिसकी हम रक्षा करते हैं | The memory we protect | src/lib/content.hi.ts |
| 148 | `site.sangam.name` | ओपन संगम | Open Sangam | src/lib/content.hi.ts |
| 149 | `site.sangam.pillar.0` | काव्य-विश्लेषण | Poem analysis | src/lib/content.hi.ts |
| 150 | `site.sangam.pillar.1` | भूदृश्य-वर्गीकरण | Landscape classification | src/lib/content.hi.ts |
| 151 | `site.sangam.pillar.2` | भाषा-विज्ञान अध्ययन | Linguistic study | src/lib/content.hi.ts |
| 152 | `site.sangam.plain` | 2,000 साल पुरानी तमिल कविताएँ पढ़कर बताने वाला औज़ार कि हर रचना पाँच में से किस भूदृश्य की है — छात्रों और शिक्षकों के लिए निःशुल्क। | A tool that reads 2,000-year-old Tamil poems and tells you which of the five landscapes each belongs to — free for students and teachers. | src/lib/content.hi.ts |
| 153 | `site.sangam.source` | आरंभिक अंश · ओपन-संगम कॉर्पस | Opening passage · open-sangam corpus | src/lib/content.hi.ts |
| 154 | `site.sangam.sub` | शास्त्रीय साहित्य के लिए एक खुला मंच | An open platform for classical literature | src/lib/content.hi.ts |
| 155 | `site.section.adhan.landscape` | वन · प्रतीक्षा | Forest · waiting | src/lib/content.hi.ts |
| 156 | `site.section.adhan.thinai` | முல்லை | Mullai | src/lib/content.hi.ts |
| 157 | `site.section.community.landscape` | तट · विरह | Coastal · separation, pining | src/lib/content.hi.ts |
| 158 | `site.section.community.thinai` | நெய்தல் | Neytal | src/lib/content.hi.ts |
| 159 | `site.section.guardian.landscape` | बंजर भूमि · वियोग | Desert · hardship endured | src/lib/content.hi.ts |
| 160 | `site.section.guardian.thinai` | பாலை | Palai | src/lib/content.hi.ts |
| 161 | `site.section.sangam.landscape` | खेत · प्रणय-कलह | Agriculture · fertile land | src/lib/content.hi.ts |
| 162 | `site.section.sangam.thinai` | மருதம் | Marutham | src/lib/content.hi.ts |
| 163 | `site.section.yazhi.landscape` | पहाड़ · पहला मिलन | Mountains · first meetings | src/lib/content.hi.ts |
| 164 | `site.section.yazhi.thinai` | குறிஞ்சி | Kurinji | src/lib/content.hi.ts |
| 165 | `site.services.0` | एजेंट | Agents | src/lib/content.hi.ts |
| 166 | `site.services.1` | अनुप्रयोग | Applications | src/lib/content.hi.ts |
| 167 | `site.services.2` | एनोटेशन | Annotations | src/lib/content.hi.ts |
| 168 | `site.services.asideLabel` | सेवाएँ — जल्द आ रहा है | Services — coming soon | src/lib/content.hi.ts |
| 169 | `site.services.comingSoon` | जल्द आ रहा है | Coming soon | src/lib/content.hi.ts |
| 170 | `site.services.label` | सेवाएँ | Services | src/lib/content.hi.ts |
| 171 | `site.thinai.eyebrow` | याझ की दुनिया · திணை | Yazh's world · Thinai | src/lib/content.hi.ts |
| 172 | `site.thinai.foot` | संगम कविता संसार को इन पाँच तिणै में बाँटती है। याझ की कहानी-पुस्तकालय भी उसी तरह व्यवस्थित है — यह ढाँचा तमिल में जड़ों तक बसा है, ऊपर से लगाया गया अलंकार नहीं। | Sangam poetry sorts the world into these five tinai. Yazh's story library is organised the same way — the structure is Tamil at its root, not ornament laid on top. | src/lib/content.hi.ts |
| 173 | `site.thinai.landscape.0.body` | साहस और वियोग — कठिन कहानियाँ। | Courage and separation — the harder stories. | src/lib/content.hi.ts |
| 174 | `site.thinai.landscape.0.mood` | सूखी भूमि · सहन करना | Drylands · endurance | src/lib/content.hi.ts |
| 175 | `site.thinai.landscape.0.name` | பாலை | Palai | src/lib/content.hi.ts |
| 176 | `site.thinai.landscape.1.body` | जानवर, धैर्य और वे लोककथाएँ जो बच्चे जानते हैं। | Animals, patience and the folk tales children know. | src/lib/content.hi.ts |
| 177 | `site.thinai.landscape.1.mood` | वन · प्रतीक्षा | Forest · waiting | src/lib/content.hi.ts |
| 178 | `site.thinai.landscape.1.name` | முல்லை | Mullai | src/lib/content.hi.ts |
| 179 | `site.thinai.landscape.2.body` | जिज्ञासा और खोज — जहाँ कहानी शुरू होती है। | Curiosity and discovery — where a story starts. | src/lib/content.hi.ts |
| 180 | `site.thinai.landscape.2.mood` | पहाड़ · पहली मुलाक़ात | Mountains · first meetings | src/lib/content.hi.ts |
| 181 | `site.thinai.landscape.2.name` | குறிஞ்சி | Kurinji | src/lib/content.hi.ts |
| 182 | `site.thinai.landscape.3.body` | गिनती, काम और परिवार — जहाँ सबक़ बसते हैं। | Counting, work and family — where lessons live. | src/lib/content.hi.ts |
| 183 | `site.thinai.landscape.3.mood` | खेत · रोज़मर्रा का जीवन | Farmland · everyday life | src/lib/content.hi.ts |
| 184 | `site.thinai.landscape.3.name` | மருதம் | Marutham | src/lib/content.hi.ts |
| 185 | `site.thinai.landscape.4.body` | यात्राएँ और दूरी — प्रवासियों की भूमि। | Voyages and distance — the diaspora's landscape. | src/lib/content.hi.ts |
| 186 | `site.thinai.landscape.4.mood` | तट · ललक | Coast · longing | src/lib/content.hi.ts |
| 187 | `site.thinai.landscape.4.name` | நெய்தல் | Neytal | src/lib/content.hi.ts |
| 188 | `site.thinai.title` | पाँच भूमियाँ, पाँच मनोदशाएँ | Five landscapes, five moods | src/lib/content.hi.ts |
| 189 | `site.yazh.artAlt` | याझी — पौराणिक संरक्षक | Yazhi — mythical guardian | src/lib/content.hi.ts |
| 190 | `site.yazh.body` | याझ दक्षिण भारत के मंदिर के खंभों पर तराशा गया संरक्षक प्राणी है — वह दरवाज़े पर खड़ा रहता है और अंदर की चीज़ों को सुरक्षित रखता है। याझ वही संरक्षक है, जो इतना छोटा खींचा गया है कि चार साल का बच्चा उससे बात कर सके। वह सुनता है, बच्चे की मातृभाषा में जवाब देता है, और उससे कभी पढ़ने या टाइप करने को नहीं कहता। आवाज़ में, आवाज़ में बाहर — कोई ऐप नहीं, कोई टाइपिंग नहीं, उसी फ़ोन पर जो परिवारों के पास पहले से है। लोक कथाएँ और बातचीत के ज़रिए गणित, विज्ञान और अंग्रेज़ी। | Yazh is a guardian creature carved onto temple pillars across the Dravidian south — it stands at the doorway and keeps what is inside safe. Yazh is that guardian, drawn small enough for a four-year-old to talk to. He listens, answers in the child's mother tongue, and never asks them to read or type. Voice in, voice out — no app, no typing, on the phone families already own. Folk stories plus Maths, Science and English through conversation. | src/lib/content.hi.ts |
| 191 | `site.yazh.caption` | யாழி · मंदिर का संरक्षक | temple guardian | src/lib/content.hi.ts |
| 192 | `site.yazh.cta` | शुरू करें | Get started | src/lib/content.hi.ts |
| 193 | `site.yazh.eyebrow` | परिवार किसके लिए भुगतान करते हैं | What families pay for | src/lib/content.hi.ts |
| 194 | `site.yazh.markAlt` | याझी संरक्षक का अमूर्त चिह्न | Abstract yazhi guardian mark | src/lib/content.hi.ts |
| 195 | `site.yazh.name` | याझ | Yazh | src/lib/content.hi.ts |
| 196 | `site.yazh.plain` | इंटरनेट पर तमिल कहानियों और गीतों की रक्षा करने वाला ऐप — जैसे मंदिर का याझी। | An app that watches over Tamil stories and songs on the internet — like the temple guardian it's named after. | src/lib/content.hi.ts |
| 197 | `site.yazh.sub` | 4–8 साल के बच्चों के लिए व्हाट्सएप पर आवाज़-भरोसेमंद दोस्त | A voice AI friend for children aged 4–8, on WhatsApp | src/lib/content.hi.ts |
| 198 | `site.yazh.whatsappCta` | व्हाट्सएप पर बात करें | Chat on WhatsApp | src/lib/content.hi.ts |
| 199 | `site.yazh.whatsappNote` | फ़िलहाल हैदराबाद के आसपास 30 से अधिक संस्थापक परिवारों के साथ निजी बीटा में हैं — जैसे ही हम खुलें, अपडेट के लिए व्हाट्सएप समुदाय से जुड़ें। | Currently in private beta with 30+ founding families around Hyderabad — join the WhatsApp community for updates as we open up. | src/lib/content.hi.ts |
| 200 | `site.yazhi.body` | याज़ी भारतीय भाषाओं के लिए संप्रभु एआई है — यहीं बना, यहीं इसका स्वामित्व, और खुला। हम एक ऐसी बातचीत बना रहे हैं जो तमिल, तेलुगु और हिंदी के बीच चलती रहे, बदलने में कुछ भी न खोए, और उन औज़ारों तक पहुँचे जो परिवार पहले से इस्तेमाल करते हैं। इसके नीचे तीन उत्पाद हैं: याझ, परिवारों की आवाज़-मित्र; आधन, नीचे का इंजन; और ओपन संगम, वह स्मृति जिसकी हम रक्षा करते हैं। | Yazhi is sovereign AI for Indian languages — built here, owned here, and open. We are building one conversation that moves between Tamil, Telugu and Hindi with nothing lost in the switch, and reaches the tools a family already uses. Three products sit under it: Yazh, the voice friend families pay for; Adhan, the engine underneath; and Open Sangam, the memory we protect. | src/lib/content.hi.ts |
| 201 | `site.yazhi.chatAlt` | याज़ी के साथ एक बातचीत जो बिना रुके तमिल, तेलुगु और हिंदी के बीच चलती है, जिसमें कॉर्पस खोज और व्हाट्सएप भेजना भी शामिल है | A chat with Yazhi moving between Tamil, Telugu, and Hindi without restarting, including a corpus search and a WhatsApp send | src/lib/content.hi.ts |
| 202 | `site.yazhi.plain` | तमिल, तेलुगु या हिंदी में बोलिए — याज़ी उसी भाषा में जवाब देता है, और वाक्य के बीच में भाषा बदलने पर भी समझता रहता है। हम इसे अभी बना रहे हैं। | Talk in Tamil, Telugu or Hindi — Yazhi answers in the same one, and keeps up even when you switch mid-sentence. We are still building this. | src/lib/content.hi.ts |
| 203 | `site.yazhi.preview` | पूर्वावलोकन — तमिल, तेलुगु, हिंदी | preview — Tamil, Telugu, Hindi | src/lib/content.hi.ts |
| 204 | `site.yazhi.sub` | एक बातचीत — सभी भाषाएँ | One conversation, every language | src/lib/content.hi.ts |

## In-app chrome — 190 keys

| # | Key | Hindi (draft, MT) | English source | Where |
|---|---|---|---|---|
| 1 | `anatomy.canvas` | कैनवास | Canvas | packages/i18n/src/strings/app.ts |
| 2 | `anatomy.canvasNote` | सक्रिय बबल की बातचीत | the active bubble's conversation | packages/i18n/src/strings/app.ts |
| 3 | `anatomy.capitol` | कैपिटल | Capitol | packages/i18n/src/strings/app.ts |
| 4 | `anatomy.composer` | कंपोज़र | Composer | packages/i18n/src/strings/app.ts |
| 5 | `anatomy.insider` | आंतरिक | Insider | packages/i18n/src/strings/app.ts |
| 6 | `anatomy.missionControl` | मिशन कंट्रोल | Mission Control | packages/i18n/src/strings/app.ts |
| 7 | `anatomy.offlineSub` | डिफ़ॉल्ट रूप से 0% क्लाउड — हर जगह सर्कल पहचान | 0% cloud by default — Circle identity throughout | packages/i18n/src/strings/app.ts |
| 8 | `anatomy.offlineTop` | इंटरनेट के बिना चलता है · डिवाइस मॉडल | Runs without internet · on-device models | packages/i18n/src/strings/app.ts |
| 9 | `anatomy.onlyDeclared` | केवल घोषित | only declared | packages/i18n/src/strings/app.ts |
| 10 | `anatomy.permissions` | अनुमतियाँ पार होती हैं | permissions cross | packages/i18n/src/strings/app.ts |
| 11 | `anatomy.risk` | जोखिम | risk | packages/i18n/src/strings/app.ts |
| 12 | `anatomy.send` | भेजें | send | packages/i18n/src/strings/app.ts |
| 13 | `anatomy.title` | बबल UI शरीर-रचना | Bubble UI anatomy | packages/i18n/src/strings/app.ts |
| 14 | `anatomy.tray` | ट्रे | Tray | packages/i18n/src/strings/app.ts |
| 15 | `bubble.auto` | स्वचालित | auto | packages/i18n/src/strings/app.ts |
| 16 | `bubble.endpointLabel` | इस डिवाइस का एंडपॉइंट (OpenAI-संगत) | On-device endpoint (OpenAI-compatible) | packages/i18n/src/strings/app.ts |
| 17 | `bubble.offline` | ऑफ़लाइन | offline | packages/i18n/src/strings/app.ts |
| 18 | `bubble.offlineTip` | ऑफ़लाइन — केवल डिवाइस मॉडल | Offline — on-device models only | packages/i18n/src/strings/app.ts |
| 19 | `bubble.onDevice` | डिवाइस पर | on-device | packages/i18n/src/strings/app.ts |
| 20 | `bubble.online` | ऑनलाइन | online | packages/i18n/src/strings/app.ts |
| 21 | `bubble.onlineTip` | ऑनलाइन — yazhi.dev के ज़रिए yazhi-api उपलब्ध | Online — yazhi-api reachable through yazhi.dev | packages/i18n/src/strings/app.ts |
| 22 | `bubble.placeholder` | {bubble} को संदेश… | Message {bubble}… | packages/i18n/src/strings/app.ts |
| 23 | `bubble.runtime` | रनटाइम | Runtime | packages/i18n/src/strings/app.ts |
| 24 | `bubble.runtimeSettings` | रनटाइम सेटिंग्स | Runtime settings | packages/i18n/src/strings/app.ts |
| 25 | `bubble.thinking` | सोच रहा है | Thinking | packages/i18n/src/strings/app.ts |
| 26 | `bubble.viaApi` | yazhi-api के ज़रिए | via yazhi-api | packages/i18n/src/strings/app.ts |
| 27 | `bubble.viaDevice` | डिवाइस मॉडल के ज़रिए | via on-device model | packages/i18n/src/strings/app.ts |
| 28 | `chat.agentAbout` | इस एजेंट के बारे में | About this agent | packages/i18n/src/strings/chat.ts |
| 29 | `chat.agentApi` | {provider} · yazhi-api | {provider} · yazhi-api | packages/i18n/src/strings/chat.ts |
| 30 | `chat.agentExternal` | बाहरी मॉडल पर चलता है | Runs on an outside model | packages/i18n/src/strings/chat.ts |
| 31 | `chat.agentGuest` | अतिथि · {provider} | Guest · {provider} | packages/i18n/src/strings/chat.ts |
| 32 | `chat.agentIsThinking` | {agent} सोच रहा है | {agent} is thinking | packages/i18n/src/strings/chat.ts |
| 33 | `chat.agentLivesIn` | {home} में रहता है | Lives in {home} | packages/i18n/src/strings/chat.ts |
| 34 | `chat.agentPreview` | पूर्वावलोकन · {status} | Preview · {status} | packages/i18n/src/strings/chat.ts |
| 35 | `chat.agentsNav` | एजेंट | Agents | packages/i18n/src/strings/chat.ts |
| 36 | `chat.brand` | याझी | Yazhi | packages/i18n/src/strings/chat.ts |
| 37 | `chat.brandSuffix` | चैट | Chat | packages/i18n/src/strings/chat.ts |
| 38 | `chat.close` | {title} बंद करें | Close {title} | packages/i18n/src/strings/chat.ts |
| 39 | `chat.closePanel` | पैनल बंद करें | Close panel | packages/i18n/src/strings/chat.ts |
| 40 | `chat.composerLabel` | संदेश भेजें | Send a message | packages/i18n/src/strings/chat.ts |
| 41 | `chat.conversationWith` | {agent} के साथ बातचीत | Conversation with {agent} | packages/i18n/src/strings/chat.ts |
| 42 | `chat.copied` | कॉपी हुआ | Copied | packages/i18n/src/strings/chat.ts |
| 43 | `chat.copy` | कॉपी करें | Copy | packages/i18n/src/strings/chat.ts |
| 44 | `chat.deleteThread` | थ्रेड हटाएँ: {title} | Delete thread: {title} | packages/i18n/src/strings/chat.ts |
| 45 | `chat.endpointLabel` | इस डिवाइस का एंडपॉइंट (OpenAI-संगत) | On-device endpoint (OpenAI-compatible) | packages/i18n/src/strings/chat.ts |
| 46 | `chat.followAgent` | एजेंट का अनुसरण करें | Follow the agent | packages/i18n/src/strings/chat.ts |
| 47 | `chat.guestAgents` | अतिथि एजेंट | Guest agents | packages/i18n/src/strings/chat.ts |
| 48 | `chat.hintEnter` | भेजने के लिए Enter · नई पंक्ति के लिए Shift+Enter। उत्तर ग़लत भी हो सकते हैं — ज़रूरी बात जाँच लें। | Enter to send · Shift+Enter for a new line. Replies can be wrong — check what matters. | packages/i18n/src/strings/chat.ts |
| 49 | `chat.hintRunsApi` | yazhi-api पर चलता है। | Runs on yazhi-api. | packages/i18n/src/strings/chat.ts |
| 50 | `chat.hintRunsDevice` | इस डिवाइस पर चलता है। | Runs on this device. | packages/i18n/src/strings/chat.ts |
| 51 | `chat.homeLabel` | याझी — मुखपृष्ठ | Yazhi home | packages/i18n/src/strings/chat.ts |
| 52 | `chat.landscape` | भूदृश्य | Landscape | packages/i18n/src/strings/chat.ts |
| 53 | `chat.localNote` | थ्रेड और ये विकल्प केवल इसी ब्राउज़र में रहते हैं। भूदृश्य और उनकी गति | Threads and these choices are kept in this browser only. The landscapes and their motion are described in the | packages/i18n/src/strings/chat.ts |
| 54 | `chat.localNoteLink` | बबल UI लाइब्रेरी | Bubble UI library | packages/i18n/src/strings/chat.ts |
| 55 | `chat.messages` | संदेश | Messages | packages/i18n/src/strings/chat.ts |
| 56 | `chat.metadataDescription` | बबल UI में याझी के एजेंट से बात करें: हर एजेंट एक संगम भूदृश्य में रहता है, उत्तर yazhi-api या आपके डिवाइस के मॉडल से आते हैं। | Talk to Yazhi's agents in the Bubble UI: each one lives in a Sangam landscape, replies stream from yazhi-api or a model on your own device. | packages/i18n/src/strings/chat.ts |
| 57 | `chat.metadataTitle` | याझी चैट — याझी के एजेंट, उनके भूदृश्यों में | யாழி Chat — Yazhi's agents, in their landscapes | packages/i18n/src/strings/chat.ts |
| 58 | `chat.newThread` | नया थ्रेड | New thread | packages/i18n/src/strings/chat.ts |
| 59 | `chat.noThreads` | अभी कोई थ्रेड नहीं। वे इसी डिवाइस पर रहते हैं। | No threads yet. They stay on this device. | packages/i18n/src/strings/chat.ts |
| 60 | `chat.nowIn` | अब {landscape} | Now {landscape} | packages/i18n/src/strings/chat.ts |
| 61 | `chat.offlineSuffix` | ऑफ़लाइन | offline | packages/i18n/src/strings/chat.ts |
| 62 | `chat.pageTitle` | याझी चैट, {agent} के साथ | Yazhi Chat, with {agent} | packages/i18n/src/strings/chat.ts |
| 63 | `chat.panelMission` | मिशन कंट्रोल | Mission Control | packages/i18n/src/strings/chat.ts |
| 64 | `chat.placeholder` | {agent} को संदेश… | Message to {agent}… | packages/i18n/src/strings/chat.ts |
| 65 | `chat.railGuests` | अतिथि | Guests | packages/i18n/src/strings/chat.ts |
| 66 | `chat.railYazhi` | याझी | Yazhi | packages/i18n/src/strings/chat.ts |
| 67 | `chat.rule` | नियम | Rule | packages/i18n/src/strings/chat.ts |
| 68 | `chat.runtimeAuto` | स्वचालित | Automatic | packages/i18n/src/strings/chat.ts |
| 69 | `chat.runtimeAutoNote` | ऑनलाइन होने पर yazhi-api, वरना यह डिवाइस | yazhi-api when online, this device when not | packages/i18n/src/strings/chat.ts |
| 70 | `chat.runtimeCloud` | yazhi-api | yazhi-api | packages/i18n/src/strings/chat.ts |
| 71 | `chat.runtimeCloudNote` | याझी के सर्वर, yazhi.dev के ज़रिए | Yazhi's servers, through yazhi.dev | packages/i18n/src/strings/chat.ts |
| 72 | `chat.runtimeCloudShort` | yazhi-api | yazhi-api | packages/i18n/src/strings/chat.ts |
| 73 | `chat.runtimeCloudTip` | उत्तर yazhi-api से आते हैं | Replies come from yazhi-api | packages/i18n/src/strings/chat.ts |
| 74 | `chat.runtimeDevice` | इस डिवाइस पर | On this device | packages/i18n/src/strings/chat.ts |
| 75 | `chat.runtimeDeviceNote` | स्थानीय मॉडल; आपकी मशीन से कुछ बाहर नहीं जाता | A local model; nothing leaves your machine | packages/i18n/src/strings/chat.ts |
| 76 | `chat.runtimeDeviceShort` | डिवाइस पर | on device | packages/i18n/src/strings/chat.ts |
| 77 | `chat.runtimeDeviceTip` | उत्तर इस डिवाइस के मॉडल से आते हैं | Replies come from a model on this device | packages/i18n/src/strings/chat.ts |
| 78 | `chat.sampleAnswer` | नमूना उत्तर: | Sample answer: | packages/i18n/src/strings/chat.ts |
| 79 | `chat.sampleNote` | नमूना · केवल उदाहरण, जीवंत उत्तर नहीं | Sample · illustrative, not a live answer | packages/i18n/src/strings/chat.ts |
| 80 | `chat.sampleNoteTamilDraft` | · तमिल एक मसौदा है, स्थानीय समीक्षा बाक़ी | · Tamil is a draft for native review | packages/i18n/src/strings/chat.ts |
| 81 | `chat.sampleQuestion` | नमूना प्रश्न: | Sample question: | packages/i18n/src/strings/chat.ts |
| 82 | `chat.seeAnswers` | देखें कि {agent} कैसे उत्तर देता है | See how {agent} answers | packages/i18n/src/strings/chat.ts |
| 83 | `chat.send` | भेजें | Send | packages/i18n/src/strings/chat.ts |
| 84 | `chat.skipToComposer` | संदेश बॉक्स पर जाएँ | Skip to message box | packages/i18n/src/strings/chat.ts |
| 85 | `chat.stopReply` | उत्तर रोकें | Stop the reply | packages/i18n/src/strings/chat.ts |
| 86 | `chat.theme` | थीम | Theme | packages/i18n/src/strings/chat.ts |
| 87 | `chat.thinking` | सोच रहा है | Thinking | packages/i18n/src/strings/chat.ts |
| 88 | `chat.threadAgent` | एजेंट | Agent | packages/i18n/src/strings/chat.ts |
| 89 | `chat.threads` | थ्रेड | Threads | packages/i18n/src/strings/chat.ts |
| 90 | `chat.viaApi` | yazhi-api | yazhi-api | packages/i18n/src/strings/chat.ts |
| 91 | `chat.viaDevice` | डिवाइस पर | on device | packages/i18n/src/strings/chat.ts |
| 92 | `chat.welcomeStarts` | शुरू करने के तरीके | Ways to start | packages/i18n/src/strings/chat.ts |
| 93 | `chat.whereReplies` | उत्तर कहाँ से आते हैं | Where replies come from | packages/i18n/src/strings/chat.ts |
| 94 | `chat.yazhiAgents` | याझी एजेंट | Yazhi agents | packages/i18n/src/strings/chat.ts |
| 95 | `chat.you` | आप: | You: | packages/i18n/src/strings/chat.ts |
| 96 | `circle.account` | खाता | Account | packages/i18n/src/strings/app.ts |
| 97 | `circle.adult` | मैं 18 वर्ष या अधिक हूँ। (बच्चे अभिभावक के साथ परिवार-मार्ग से याझ का उपयोग करते हैं।) | I am 18 or older. (Children use Yazh through the family flow, with a parent.) | packages/i18n/src/strings/app.ts |
| 98 | `circle.checking` | आपका सत्र जाँच रहे हैं… | Checking your session… | packages/i18n/src/strings/app.ts |
| 99 | `circle.circleDocsLink` | बबल UI → सर्कल | Bubble UI → Circle | packages/i18n/src/strings/app.ts |
| 100 | `circle.close` | बंद करें | Close | packages/i18n/src/strings/app.ts |
| 101 | `circle.conductLink` | बिल्डर आचार संहिता | builder code of conduct | packages/i18n/src/strings/app.ts |
| 102 | `circle.conductPost` | का पालन करूँगा। | . | packages/i18n/src/strings/app.ts |
| 103 | `circle.conductPre` | मैं | I'll follow the | packages/i18n/src/strings/app.ts |
| 104 | `circle.createAccount` | सर्कल खाता बनाएँ | Create Circle account | packages/i18n/src/strings/app.ts |
| 105 | `circle.done` | हो गया | Done | packages/i18n/src/strings/app.ts |
| 106 | `circle.email` | ईमेल | Email | packages/i18n/src/strings/app.ts |
| 107 | `circle.eyebrow` | सर्कल · मिशन कंट्रोल | Circle · Mission Control | packages/i18n/src/strings/app.ts |
| 108 | `circle.haveAccount` | पहले से सर्कल खाता है? | Already have a Circle account? | packages/i18n/src/strings/app.ts |
| 109 | `circle.inviteOnly` | पायलट के दौरान बिल्डर पंजीकरण निमंत्रण-आधारित है — Discord में पूछें। | Builder sign-up is invite-only during the pilot — ask in Discord. | packages/i18n/src/strings/app.ts |
| 110 | `circle.joinBuilder` | बिल्डर के रूप में जुड़ें | Join as a builder | packages/i18n/src/strings/app.ts |
| 111 | `circle.joinCta` | सर्कल से जुड़ें | Join Circle | packages/i18n/src/strings/app.ts |
| 112 | `circle.missionOn` | मिशन कंट्रोल चालू है: अपने खाते, थीम और चैट सेटिंग्स के लिए तीन-बुलबुले वाले चिह्न को दबाएँ। आपके प्रकाशित बबल इसी खाते से हस्ताक्षरित होते हैं — उन्हें यहाँ बनाएँ: | Mission Control is on: press the three-bubble mark for your account, the theme and your chat settings. Bubbles you publish are signed with this account — build them from the | packages/i18n/src/strings/app.ts |
| 113 | `circle.name` | नाम | Name | packages/i18n/src/strings/app.ts |
| 114 | `circle.newHere` | नए हैं? | New here? | packages/i18n/src/strings/app.ts |
| 115 | `circle.notConnected` | इस डिप्लॉयमेंट पर सर्कल साइन-इन अभी जुड़ा नहीं है। yazhi-api तक पहुँचने के लिए सेट करें | Circle sign-in isn't connected on this deployment yet. Set | packages/i18n/src/strings/app.ts |
| 116 | `circle.notConnected2` | — देखें | to reach yazhi-api — see | packages/i18n/src/strings/app.ts |
| 117 | `circle.notConnected3` | बबल UI और UI लाइब्रेरी स्थानीय रूप से चलते रहेंगे। | The Bubble UI and the UI library still work locally. | packages/i18n/src/strings/app.ts |
| 118 | `circle.password` | पासवर्ड | Password | packages/i18n/src/strings/app.ts |
| 119 | `circle.signIn` | साइन इन करें | Sign in | packages/i18n/src/strings/app.ts |
| 120 | `circle.signOut` | साइन आउट | Sign out | packages/i18n/src/strings/app.ts |
| 121 | `circle.uiLibrary` | UI लाइब्रेरी | UI library | packages/i18n/src/strings/app.ts |
| 122 | `circle.wakesAfter` | सर्कल खाता होते ही मिशन कंट्रोल जाग जाएगा। | Mission Control wakes once you have a Circle account. | packages/i18n/src/strings/app.ts |
| 123 | `circle.yourCircle` | आपका सर्कल | Your Circle | packages/i18n/src/strings/app.ts |
| 124 | `dev.brand` | याझी | Yazhi | packages/i18n/src/strings/app.ts |
| 125 | `dev.brandSuffix` | बबल UI | Bubble UI | packages/i18n/src/strings/app.ts |
| 126 | `dev.homeLabel` | याझी — मुखपृष्ठ | Yazhi home | packages/i18n/src/strings/app.ts |
| 127 | `dev.navChat` | चैट | Chat | packages/i18n/src/strings/app.ts |
| 128 | `dev.navLabel` | बबल | Bubble | packages/i18n/src/strings/app.ts |
| 129 | `dev.navLibrary` | UI लाइब्रेरी | UI library | packages/i18n/src/strings/app.ts |
| 130 | `dev.navWorkspaces` | वर्कस्पेस | Workspaces | packages/i18n/src/strings/app.ts |
| 131 | `mission.accountTitle` | सर्कल खाता | Circle account | packages/i18n/src/strings/app.ts |
| 132 | `mission.goTo` | यहाँ जाएँ | Go to | packages/i18n/src/strings/app.ts |
| 133 | `mission.menuLabel` | मिशन कंट्रोल | Mission Control | packages/i18n/src/strings/app.ts |
| 134 | `mission.placeBubble` | बबल UI | Bubble UI | packages/i18n/src/strings/app.ts |
| 135 | `mission.placeBubbleNote` | UI लाइब्रेरी और डिज़ाइन सिस्टम | The UI library and design system | packages/i18n/src/strings/app.ts |
| 136 | `mission.placeChat` | याझी चैट | Yazhi Chat | packages/i18n/src/strings/app.ts |
| 137 | `mission.placeChatNote` | याझी के एजेंट से बात करें | Talk to Yazhi's agents | packages/i18n/src/strings/app.ts |
| 138 | `mission.placeWorkspaces` | वर्कस्पेस | Workspaces | packages/i18n/src/strings/app.ts |
| 139 | `mission.placeWorkspacesNote` | गुरु, न्याय, कुरल और कडै | Guru, Nyaya, Kural and Kadai | packages/i18n/src/strings/app.ts |
| 140 | `mission.signingOut` | साइन आउट हो रहा है… | Signing out… | packages/i18n/src/strings/app.ts |
| 141 | `mission.theme` | थीम | Theme | packages/i18n/src/strings/app.ts |
| 142 | `onboarding.consentDeveloper` | मैंने गोपनीयता नोट पढ़ लिया है। | I've read the privacy note. | packages/i18n/src/strings/app.ts |
| 143 | `onboarding.consentNetwork` | मैं 13 वर्ष या अधिक हूँ — या अभिभावक/संरक्षक साथ हैं — और मैंने गोपनीयता नोट पढ़ लिया है। | I'm 13 or older — or a parent/guardian is helping me — and I've read the privacy note. | packages/i18n/src/strings/app.ts |
| 144 | `onboarding.continueProfile` | प्रोफ़ाइल पर जाएँ → | Continue to profile → | packages/i18n/src/strings/app.ts |
| 145 | `onboarding.joinDeveloper` | डेवलपर के रूप में जुड़ें | Join as a Developer | packages/i18n/src/strings/app.ts |
| 146 | `onboarding.joinDeveloperCta` | डेवलपर के रूप में जुड़ें → | Join as a Developer → | packages/i18n/src/strings/app.ts |
| 147 | `onboarding.joinDiscord` | Discord से जुड़ें → | Join the Discord → | packages/i18n/src/strings/app.ts |
| 148 | `onboarding.joinNetwork` | नेटवर्क से जुड़ें | Join the Network | packages/i18n/src/strings/app.ts |
| 149 | `onboarding.joinNetworkCta` | नेटवर्क से जुड़ें → | Join the Network → | packages/i18n/src/strings/app.ts |
| 150 | `onboarding.joining` | जुड़ रहे हैं… | Joining… | packages/i18n/src/strings/app.ts |
| 151 | `onboarding.phone` | फ़ोन नंबर | Phone Number | packages/i18n/src/strings/app.ts |
| 152 | `onboarding.phonePlaceholder` | फ़ोन नंबर दर्ज करें | Enter phone number | packages/i18n/src/strings/app.ts |
| 153 | `onboarding.phoneTitle` | 7–16 अंक; +, स्पेस, डैश और कोष्ठक मान्य हैं | 7–16 digits; +, spaces, dashes, and parentheses allowed | packages/i18n/src/strings/app.ts |
| 154 | `onboarding.privacyNote` | गोपनीयता नोट | Privacy note | packages/i18n/src/strings/app.ts |
| 155 | `onboarding.staysBrowser` | आपके ब्राउज़र में ही रहता है — सर्वर पर कभी नहीं भेजा जाता। | Stays in your browser — never sent to a server. | packages/i18n/src/strings/app.ts |
| 156 | `onboarding.subDeveloper` | अपनी मातृभाषा के लिए बना रहे हैं? यहाँ से शुरू करें। | Building for your mother tongue? Start here. | packages/i18n/src/strings/app.ts |
| 157 | `onboarding.subNetwork` | अपना नोड पहचानें। | Identify your node. | packages/i18n/src/strings/app.ts |
| 158 | `onboarding.unknownRegion` | अज्ञात क्षेत्र | Unknown region | packages/i18n/src/strings/app.ts |
| 159 | `onboarding.welcomeBuilder` | स्वागत है, बिल्डर | Welcome, builder | packages/i18n/src/strings/app.ts |
| 160 | `onboarding.yazhName` | याझ नाम | Yazh Name | packages/i18n/src/strings/app.ts |
| 161 | `onboarding.yazhNamePlaceholder` | जैसे shadow_coder | e.g. shadow_coder | packages/i18n/src/strings/app.ts |
| 162 | `profile.availClosed` | खोज नहीं रहे | Not Looking | packages/i18n/src/strings/app.ts |
| 163 | `profile.availEmployed` | वर्तमान में नौकरी में (केवल शौक़िया कोडिंग) | Currently Employed (Casual Hacking Only) | packages/i18n/src/strings/app.ts |
| 164 | `profile.availOpen` | सहयोग और काम के लिए उपलब्ध | Open to Collab & Gigs | packages/i18n/src/strings/app.ts |
| 165 | `profile.availability` | उपलब्धता | Availability | packages/i18n/src/strings/app.ts |
| 166 | `profile.backToNetwork` | ← नेटवर्क पर वापस | ← Back to Network | packages/i18n/src/strings/app.ts |
| 167 | `profile.bio` | बायो / उद्देश्य | Bio / Objective | packages/i18n/src/strings/app.ts |
| 168 | `profile.bioPlaceholder` | अगली पीढ़ी के विकेंद्रीकृत कंप्यूट की रचना… | Building the next generation of decentralised compute… | packages/i18n/src/strings/app.ts |
| 169 | `profile.configSub` | नेटवर्क नोड्स पर अपनी पहचान पूरी करें। | Flesh out your identity across the network nodes. | packages/i18n/src/strings/app.ts |
| 170 | `profile.configTitle` | प्रोफ़ाइल सेटिंग | Profile Configuration | packages/i18n/src/strings/app.ts |
| 171 | `profile.connect` | जुड़ें ⅄ | Connect ⅄ | packages/i18n/src/strings/app.ts |
| 172 | `profile.noActivity` | नेटवर्क पर हाल की कोई गतिविधि नहीं मिली। | No recent activity detected on the network. | packages/i18n/src/strings/app.ts |
| 173 | `profile.noBio` | अभी कोई बायो नहीं — इस नोड ने प्रोफ़ाइल सेट नहीं की। | No bio yet — this node hasn't configured their profile. | packages/i18n/src/strings/app.ts |
| 174 | `profile.noNodePost` | पहले जुड़ें। | first. | packages/i18n/src/strings/app.ts |
| 175 | `profile.noNodePre` | संपादित करने के लिए कोई नोड नहीं मिला। | No node found to edit. | packages/i18n/src/strings/app.ts |
| 176 | `profile.nodeSuffix` | नोड | Node | packages/i18n/src/strings/app.ts |
| 177 | `profile.notFound` | क्षेत्रीय नोड्स में उपयोगकर्ता नहीं मिला। | User not found in regional nodes. | packages/i18n/src/strings/app.ts |
| 178 | `profile.recentActivity` | हाल की गतिविधि | Recent Activity | packages/i18n/src/strings/app.ts |
| 179 | `profile.save` | प्रोफ़ाइल सहेजें | Save Profile | packages/i18n/src/strings/app.ts |
| 180 | `profile.skipForNow` | अभी छोड़ें | Skip for now | packages/i18n/src/strings/app.ts |
| 181 | `profile.stack` | मुख्य टेक स्टैक (कॉमा से अलग) | Primary Tech Stack (Comma separated) | packages/i18n/src/strings/app.ts |
| 182 | `profile.stackLabel` | स्टैक: | Stack: | packages/i18n/src/strings/app.ts |
| 183 | `profile.stackPlaceholder` | जैसे Rust, React, Python, Postgres | e.g. Rust, React, Python, Postgres | packages/i18n/src/strings/app.ts |
| 184 | `profile.syncing` | सिंक हो रहा है… | Syncing… | packages/i18n/src/strings/app.ts |
| 185 | `timer.dayShort` | दिन | d | packages/i18n/src/strings/app.ts |
| 186 | `timer.label` | याझी जागरण | Yazhi Awakening | packages/i18n/src/strings/app.ts |
| 187 | `timer.remaining` | {days} दिन {hrs} घंटे {mins} मिनट {secs} सेकंड शेष | {days} days {hrs} hours {mins} minutes {secs} seconds remaining | packages/i18n/src/strings/app.ts |
| 188 | `whatsapp.groupLabel` | याझी WhatsApp समूह से जुड़ें | Join the Yazhi WhatsApp group | packages/i18n/src/strings/app.ts |
| 189 | `workspaces.all` | सभी वर्कस्पेस | All workspaces | packages/i18n/src/strings/app.ts |
| 190 | `workspaces.home` | याझी मुखपृष्ठ | Yazhi home | packages/i18n/src/strings/app.ts |

## Bubble UI library — 188 keys

The words inside a bubble (`@yazhi/bubble`), drafted from the English
source the library shipped with and the Tamil written beside it. Tamil is
the ecosystem's voice, so where the two disagree translate the Tamil.

| # | Key | Hindi (draft, MT) | English source | Where |
|---|---|---|---|---|
| 1 | `bubble.answer.fallbackNext` | जिस पाठ, श्लोक या धारा का अभिप्राय है उसका नाम बताएँ। | Try naming the text, verse or section you mean. | packages/bubble/src/locales/hi.ts |
| 2 | `bubble.answer.fallbackReason` | इस प्रश्न का उत्तर किसी संग्रहीत स्रोत से समर्थित नहीं है। | No stored source supports an answer to this question. | packages/bubble/src/locales/hi.ts |
| 3 | `bubble.answer.matched` | {pct}% मेल खाया | {pct}% matched | packages/bubble/src/locales/hi.ts |
| 4 | `bubble.answer.matchedTitle` | उद्धृत धाराएँ संग्रहीत अधिनियम पाठ से मेल खाती हैं | Cited sections matched to stored Act text | packages/bubble/src/locales/hi.ts |
| 5 | `bubble.answer.noSources` | कोई स्रोत नहीं — इसलिए कोई दावा नहीं। | No sources — so no claim is made. | packages/bubble/src/locales/hi.ts |
| 6 | `bubble.answer.sources` | स्रोत | Sources | packages/bubble/src/locales/hi.ts |
| 7 | `bubble.app.avai.name` | अवै | Avai | packages/bubble/src/locales/hi.ts |
| 8 | `bubble.app.avai.tagline` | तमिल साहित्य, व्याकरण और प्रयोग — हर दावे के साथ स्रोत | Tamil literature, grammar and usage — every claim with its source | packages/bubble/src/locales/hi.ts |
| 9 | `bubble.app.guru.name` | गुरु | Guru | packages/bubble/src/locales/hi.ts |
| 10 | `bubble.app.guru.tagline` | गणित, विज्ञान और अंग्रेज़ी तमिल के माध्यम से — संकेत, उत्तर नहीं | Maths, science and English through Tamil — hints, never answers | packages/bubble/src/locales/hi.ts |
| 11 | `bubble.app.kadai.name` | कडै | Kadai | packages/bubble/src/locales/hi.ts |
| 12 | `bubble.app.kadai.tagline` | पड़ोस की दुकान जो तमिल में ऑर्डर लेती है, अण्णाच्ची के साथ | A neighbourhood shop that takes orders in Tamil, with Annachi | packages/bubble/src/locales/hi.ts |
| 13 | `bubble.app.kuralDesk.name` | कुरल डेस्क | Kural Desk | packages/bubble/src/locales/hi.ts |
| 14 | `bubble.app.kuralDesk.tagline` | तमिल में IT सहायता — रनबुक सुझाता है, स्वयं कोई सिस्टम नहीं बदलता | IT help in Tamil — proposes runbooks, never changes a system on its own | packages/bubble/src/locales/hi.ts |
| 15 | `bubble.app.nyaya.name` | न्याय | Nyaya | packages/bubble/src/locales/hi.ts |
| 16 | `bubble.app.nyaya.tagline` | कानून क्या कहता है, तमिल में — उस धारा के साथ जहाँ से वह आता है | What the law says, in Tamil — with the section it comes from | packages/bubble/src/locales/hi.ts |
| 17 | `bubble.app.openSangam.name` | खुला संगम | Open Sangam | packages/bubble/src/locales/hi.ts |
| 18 | `bubble.app.openSangam.tagline` | शास्त्रीय तमिल, पंक्ति-दर-पंक्ति — विद्वान की स्वीकृति के बाद ही प्रकाशित | Classical Tamil, line by line — published only after scholar sign-off | packages/bubble/src/locales/hi.ts |
| 19 | `bubble.app.yazhParent.name` | याझ — अभिभावकों के लिए | Yazh — for parents | packages/bubble/src/locales/hi.ts |
| 20 | `bubble.app.yazhParent.tagline` | याझ का अभिभावक-द्वार। बच्चे यह पृष्ठ कभी नहीं देखते। | The parent's door into Yazh. Children never see this page. | packages/bubble/src/locales/hi.ts |
| 21 | `bubble.citation.hrefTo` | {label} खोलें | Open {label} | packages/bubble/src/locales/hi.ts |
| 22 | `bubble.citation.label` | स्रोत {n}: {title}, {locator} | Source {n}: {title}, {locator} | packages/bubble/src/locales/hi.ts |
| 23 | `bubble.citation.openSource` | स्रोत खोलें ↗ | Open source ↗ | packages/bubble/src/locales/hi.ts |
| 24 | `bubble.commerce.inStock` | उपलब्ध | in stock | packages/bubble/src/locales/hi.ts |
| 25 | `bubble.commerce.intentNote` | केवल भुगतान अनुरोध — दुकान पुष्टि करके सीधे भुगतान लेती है। याझी से होकर पैसा नहीं जाता। | Payment intent only — the shop confirms and collects payment directly. No money moves through Yazhi. | packages/bubble/src/locales/hi.ts |
| 26 | `bubble.commerce.lowStock` | कम | low | packages/bubble/src/locales/hi.ts |
| 27 | `bubble.commerce.nothingAdded` | अभी कुछ नहीं जोड़ा गया। | Nothing added yet. | packages/bubble/src/locales/hi.ts |
| 28 | `bubble.commerce.order` | ऑर्डर | Order | packages/bubble/src/locales/hi.ts |
| 29 | `bubble.commerce.outOfStock` | नहीं है | out | packages/bubble/src/locales/hi.ts |
| 30 | `bubble.commerce.remove` | {name} हटाएँ | Remove {name} | packages/bubble/src/locales/hi.ts |
| 31 | `bubble.common.add` | जोड़ें | Add | packages/bubble/src/locales/hi.ts |
| 32 | `bubble.common.approvedBy` | ✓ स्वीकृत · {name} | ✓ approved · {name} | packages/bubble/src/locales/hi.ts |
| 33 | `bubble.common.approvedTitle` | {name} द्वारा स्वीकृत | Approved by {name} | packages/bubble/src/locales/hi.ts |
| 34 | `bubble.common.cited` | {count} उद्धृत | {count} cited | packages/bubble/src/locales/hi.ts |
| 35 | `bubble.common.close` | {title} बंद करें | Close {title} | packages/bubble/src/locales/hi.ts |
| 36 | `bubble.common.open` | {title} खोलें | Open {title} | packages/bubble/src/locales/hi.ts |
| 37 | `bubble.common.total` | कुल | Total | packages/bubble/src/locales/hi.ts |
| 38 | `bubble.common.unverified` | असत्यापित | unverified | packages/bubble/src/locales/hi.ts |
| 39 | `bubble.common.unverifiedTitle` | अभी किसी समीक्षक द्वारा नहीं जाँचा गया | Not yet checked by a reviewer | packages/bubble/src/locales/hi.ts |
| 40 | `bubble.common.verified` | सत्यापित | verified | packages/bubble/src/locales/hi.ts |
| 41 | `bubble.common.verifiedTitle` | किसी समीक्षक द्वारा जाँचा गया | Checked by a reviewer | packages/bubble/src/locales/hi.ts |
| 42 | `bubble.composer.placeholder` | संदेश… | Message… | packages/bubble/src/locales/hi.ts |
| 43 | `bubble.composer.send` | भेजें | Send | packages/bubble/src/locales/hi.ts |
| 44 | `bubble.composer.stop` | रोकें | Stop | packages/bubble/src/locales/hi.ts |
| 45 | `bubble.gate.affects` | प्रभाव | Affects | packages/bubble/src/locales/hi.ts |
| 46 | `bubble.gate.confirmRun` | पुष्टि करें और चलाएँ | Confirm and run | packages/bubble/src/locales/hi.ts |
| 47 | `bubble.gate.confirmed` | आपने पुष्टि की — दर्ज हो गया। | Confirmed by you — logged. | packages/bubble/src/locales/hi.ts |
| 48 | `bubble.gate.declined` | अस्वीकृत — कुछ नहीं चला। | Declined — nothing ran. | packages/bubble/src/locales/hi.ts |
| 49 | `bubble.gate.dontRun` | न चलाएँ | Don't run | packages/bubble/src/locales/hi.ts |
| 50 | `bubble.gate.needsHuman` | मनुष्य की पुष्टि आवश्यक | Needs a human confirm | packages/bubble/src/locales/hi.ts |
| 51 | `bubble.gate.rollback` | वापसी | Rollback | packages/bubble/src/locales/hi.ts |
| 52 | `bubble.gate.typePrompt` | {word} लिखें | Type {word} | packages/bubble/src/locales/hi.ts |
| 53 | `bubble.gate.typeToConfirm` | पुष्टि के लिए {word} लिखें | Type {word} to confirm | packages/bubble/src/locales/hi.ts |
| 54 | `bubble.guardrails.childrenBody` | बच्चे याझ का उपयोग तभी करते हैं जब कोई माता-पिता सत्यापित सहमति देते हैं। हम केवल पहला नाम और आयु-वर्ग रखते हैं — और कुछ नहीं। | Children use Yazh only after a parent gives verified consent. We keep a first name and an age band — nothing else. | packages/bubble/src/locales/hi.ts |
| 55 | `bubble.guardrails.childrenTitle` | माता-पिता और अभिभावकों के लिए | For parents and guardians | packages/bubble/src/locales/hi.ts |
| 56 | `bubble.guardrails.idontknow` | मुझे नहीं पता | I don't know | packages/bubble/src/locales/hi.ts |
| 57 | `bubble.guardrails.legalBody` | यह बताता है कि कानून क्या कहता है; यह आपकी स्थिति पर सलाह नहीं दे सकता। सलाह के लिए अपने ज़िला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें — कई लोगों के लिए विधिक सहायता नि:शुल्क है — या किसी वकील से। | This explains what the law says; it cannot advise you on your situation. For advice, contact your District Legal Services Authority (DLSA) — legal aid is free for many people — or a lawyer. | packages/bubble/src/locales/hi.ts |
| 58 | `bubble.guardrails.legalTitle` | कानूनी जानकारी, कानूनी सलाह नहीं | Legal information, not legal advice | packages/bubble/src/locales/hi.ts |
| 59 | `bubble.guardrails.sampleBody` | इस स्क्रीन पर सब कुछ उदाहरण के लिए है। यह लेआउट दिखाता है, वास्तविक उत्तर, उद्धरण, कीमतें या लोग नहीं। | Everything on this screen is illustrative. It shows the layout, not real answers, citations, prices or people. | packages/bubble/src/locales/hi.ts |
| 60 | `bubble.guardrails.sampleTitle` | नमूना डेटा | Sample data | packages/bubble/src/locales/hi.ts |
| 61 | `bubble.hintLadder.eyebrow` | गुरु | Guru | packages/bubble/src/locales/hi.ts |
| 62 | `bubble.hintLadder.footnote` | गुरु संकेत देते हैं, उत्तर नहीं। आपके शिक्षक देखते हैं कि आपने कौन-से संकेत लिए। | Guru gives hints, not answers. Your teacher sees which hints you used. | packages/bubble/src/locales/hi.ts |
| 63 | `bubble.hintLadder.hintN` | संकेत {n} | Hint {n} | packages/bubble/src/locales/hi.ts |
| 64 | `bubble.hintLadder.next` | अगला संकेत ({next} / {total}) | Next hint ({next} of {total}) | packages/bubble/src/locales/hi.ts |
| 65 | `bubble.hintLadder.stuck` | मैं अटका हूँ — एक संकेत दें | I'm stuck — give me a hint | packages/bubble/src/locales/hi.ts |
| 66 | `bubble.message.thinking` | सोच रहा है | Thinking | packages/bubble/src/locales/hi.ts |
| 67 | `bubble.mission.close` | {title} बंद करें | Close {title} | packages/bubble/src/locales/hi.ts |
| 68 | `bubble.mission.labelActive` | मिशन कंट्रोल{who} | Mission Control{who} | packages/bubble/src/locales/hi.ts |
| 69 | `bubble.mission.labelAsleep` | मिशन कंट्रोल — शुरू करने के लिए Circle से साइन इन करें | Mission Control — sign in with Circle to start | packages/bubble/src/locales/hi.ts |
| 70 | `bubble.mission.labelBusy` | मिशन कंट्रोल — आपका Circle खाता जाँचा जा रहा है | Mission Control — checking your Circle account | packages/bubble/src/locales/hi.ts |
| 71 | `bubble.mission.title` | मिशन कंट्रोल | Mission Control | packages/bubble/src/locales/hi.ts |
| 72 | `bubble.mission.titleActive` | मिशन कंट्रोल | Mission Control | packages/bubble/src/locales/hi.ts |
| 73 | `bubble.mission.titleAsleep` | मिशन कंट्रोल खोलने के लिए Circle से साइन इन करें | Sign in with Circle to open Mission Control | packages/bubble/src/locales/hi.ts |
| 74 | `bubble.mission.whoSignedIn` | — {who} के रूप में साइन इन | — signed in as {who} | packages/bubble/src/locales/hi.ts |
| 75 | `bubble.mode.current` | थीम: {current} | Theme: {current} | packages/bubble/src/locales/hi.ts |
| 76 | `bubble.mode.dark` | गहरा | Dark | packages/bubble/src/locales/hi.ts |
| 77 | `bubble.mode.label` | थीम | Theme | packages/bubble/src/locales/hi.ts |
| 78 | `bubble.mode.light` | उजला | Light | packages/bubble/src/locales/hi.ts |
| 79 | `bubble.mode.switch` | थीम: {current}। {next} पर स्विच करें | Theme: {current}. Switch to {next} | packages/bubble/src/locales/hi.ts |
| 80 | `bubble.mode.system` | सिस्टम | System | packages/bubble/src/locales/hi.ts |
| 81 | `bubble.page.avai.anchorAnswer` | कुरल 423 कहता है कि जो सुना जाए, उसमें जो भी कहे, सत्य देखना ही ज्ञान है। | Couplet 423 says wisdom is finding the truth in what you hear, whoever says it. | packages/bubble/src/locales/hi.ts |
| 82 | `bubble.page.avai.anchorQuestion` | दूसरों को सुनने के बारे में कुरल क्या कहता है? | What does the Kural say about listening to others? | packages/bubble/src/locales/hi.ts |
| 83 | `bubble.page.avai.composer` | अवै से किसी श्लोक, शब्द या नियम के बारे में पूछें… | Ask Avai about a verse, a word, a rule… | packages/bubble/src/locales/hi.ts |
| 84 | `bubble.page.avai.posture1` | तमिल पाठ पर अंग्रेज़ी प्रश्न; उत्तर द्विभाषी। | English question about a Tamil text; answer bilingual. | packages/bubble/src/locales/hi.ts |
| 85 | `bubble.page.avai.posture2` | एक संग्रहीत स्रोत मिला: तिरुक्कुरल 423। | One stored source matched: Thirukkural 423. | packages/bubble/src/locales/hi.ts |
| 86 | `bubble.page.avai.posture3` | उद्धरण, अनुवाद, स्रोत। किसी चरण में मनुष्य की आवश्यकता नहीं। | Quote, gloss, cite. No step needs a human. | packages/bubble/src/locales/hi.ts |
| 87 | `bubble.page.avai.posture4` | हर वाक्य उद्धृत। | Every sentence cited. | packages/bubble/src/locales/hi.ts |
| 88 | `bubble.page.avai.posture5` | दूसरे प्रश्न का स्रोत नहीं था — अस्वीकार किया। | Second question had no source — declined. | packages/bubble/src/locales/hi.ts |
| 89 | `bubble.page.avai.unknownNext` | मैं दिखा सकता हूँ कि प्रत्येक तिथि-तर्क किस पर टिका है, उसके स्रोतों सहित। | I can show what each dating argument rests on, with its sources. | packages/bubble/src/locales/hi.ts |
| 90 | `bubble.page.avai.unknownQuestion` | तिरुक्कुरल किस वर्ष लिखा गया? | In which year was the Thirukkural written? | packages/bubble/src/locales/hi.ts |
| 91 | `bubble.page.avai.unknownReason` | विद्वान भिन्न काल सुझाते हैं, और किसी संग्रहीत स्रोत से एक वर्ष तय नहीं होता। | Scholars propose different dates, and no stored source settles a single year. | packages/bubble/src/locales/hi.ts |
| 92 | `bubble.page.guru.asideBody` | गुरु संस्थान की अपनी मशीन पर चलता है। छात्र का कार्य और संकेत-उपयोग बाहर नहीं जाते। | Guru runs on the institute's own machine. Student work and hint usage never leave it. | packages/bubble/src/locales/hi.ts |
| 93 | `bubble.page.guru.asideEyebrow` | संस्थान डेटा | Institute data | packages/bubble/src/locales/hi.ts |
| 94 | `bubble.page.guru.asideTitle` | यह कहाँ चलता है | Where this runs | packages/bubble/src/locales/hi.ts |
| 95 | `bubble.page.guru.lessonEyebrow` | बीजगणित | Algebra | packages/bubble/src/locales/hi.ts |
| 96 | `bubble.page.guru.lessonTitle` | रैखिक समीकरण · पाठ 3 | Linear equations · lesson 3 | packages/bubble/src/locales/hi.ts |
| 97 | `bubble.page.guru.stepCheck` | जाँचें | Check | packages/bubble/src/locales/hi.ts |
| 98 | `bubble.page.guru.stepHints` | संकेत | Hints | packages/bubble/src/locales/hi.ts |
| 99 | `bubble.page.guru.stepRead` | पढ़ें | Read | packages/bubble/src/locales/hi.ts |
| 100 | `bubble.page.guru.stepTry` | आज़माएँ | Try | packages/bubble/src/locales/hi.ts |
| 101 | `bubble.page.kadai.shopReply` | दुकान में यह उपलब्ध है — जो चाहिए जोड़ें, दुकान पुष्टि करेगी। | Here's what the shop has — add what you need, and the shop will confirm. | packages/bubble/src/locales/hi.ts |
| 102 | `bubble.page.kural.noRunbook` | ज्ञान-आधार में अभी इस टिकट से मेल खाती कोई रनबुक नहीं है। | No runbook in the knowledge base matches this ticket yet. | packages/bubble/src/locales/hi.ts |
| 103 | `bubble.page.kural.noRunbookNext` | कुरल अब तक जाँचे गए के साथ इसे किसी व्यक्ति को सौंपेगा। | Kural will hand it to a person with what it has checked so far. | packages/bubble/src/locales/hi.ts |
| 104 | `bubble.page.kural.open` | {count} खुले | {count} open | packages/bubble/src/locales/hi.ts |
| 105 | `bubble.page.kural.queue` | कतार | Queue | packages/bubble/src/locales/hi.ts |
| 106 | `bubble.page.nyaya.asideEyebrow` | सहायता लें | Get help | packages/bubble/src/locales/hi.ts |
| 107 | `bubble.page.nyaya.asideTitle` | अपनी स्थिति पर सलाह चाहिए? | Need advice on your situation? | packages/bubble/src/locales/hi.ts |
| 108 | `bubble.page.nyaya.composer` | किसी कानून के बारे में पूछें, तमिल या अंग्रेज़ी में… | Ask about a law, in Tamil or English… | packages/bubble/src/locales/hi.ts |
| 109 | `bubble.page.nyaya.disclaimer` | न्याय कानून समझाता है। यह सलाह नहीं देता और वकील नहीं है। | Nyaya explains the law. It does not advise and is not a lawyer. | packages/bubble/src/locales/hi.ts |
| 110 | `bubble.page.nyaya.dlsa` | ज़िला विधिक सेवा प्राधिकरण | District Legal Services Authority | packages/bubble/src/locales/hi.ts |
| 111 | `bubble.page.nyaya.dlsaNote` | पात्र लोगों के लिए नि:शुल्क विधिक सहायता। | free legal aid for those who qualify. | packages/bubble/src/locales/hi.ts |
| 112 | `bubble.page.nyaya.lawyer` | एक वकील | A lawyer | packages/bubble/src/locales/hi.ts |
| 113 | `bubble.page.nyaya.lawyerNote` | आपके अपने मामले पर सलाह के लिए। | for advice about your own case. | packages/bubble/src/locales/hi.ts |
| 114 | `bubble.page.nyaya.part1` | [पहला प्रावधान क्या कहता है, इसकी सरल व्याख्या।] | [Plain-language explanation of what the first provision says.] | packages/bubble/src/locales/hi.ts |
| 115 | `bubble.page.nyaya.part2` | [प्रक्रिया पर नियम क्या जोड़ते हैं।] | [What the rules add about the procedure.] | packages/bubble/src/locales/hi.ts |
| 116 | `bubble.page.nyaya.question` | [किरायेदार के अधिकारों पर नमूना प्रश्न] | [Sample question about a tenant's rights] | packages/bubble/src/locales/hi.ts |
| 117 | `bubble.page.sangam.asideBody` | नमूना संकलन: चार तिरुक्कुरल। यह पाठक मदुरैक्काञ्चि की पंक्ति 1–100 के लिए बना है, जो हर पंक्ति पर विद्वान की स्वीकृति के बाद प्रकाशित होती हैं। | Sample corpus: four Thirukkural couplets. The reader is built for Maduraikanchi lines 1–100, which publish after scholar sign-off on every line. | packages/bubble/src/locales/hi.ts |
| 118 | `bubble.page.sangam.asideEyebrow` | स्रोत | Provenance | packages/bubble/src/locales/hi.ts |
| 119 | `bubble.page.sangam.asideTitle` | इस संकलन के बारे में | About this corpus | packages/bubble/src/locales/hi.ts |
| 120 | `bubble.page.sangam.readerTitle` | तिरुक्कुरल — नमूना | Thirukkural — sample | packages/bubble/src/locales/hi.ts |
| 121 | `bubble.page.templateReply` | टेम्पलेट पूर्वावलोकन — उत्तर के लिए इस पृष्ठ को बबल रनटाइम से जोड़ें। | Template preview — connect this page to a bubble runtime to answer. | packages/bubble/src/locales/hi.ts |
| 122 | `bubble.page.yazh.behindGate` | द्वार के पीछे: अपने बच्चे के याझ पर अभिभावक का दृश्य। | Behind the gate: the parent's view of their child's Yazh. | packages/bubble/src/locales/hi.ts |
| 123 | `bubble.pill.apiTitle` | yazhi-api के ज़रिए अधान पर चला | Ran on Adhan through yazhi-api | packages/bubble/src/locales/hi.ts |
| 124 | `bubble.pill.draft` | मसौदा · मातृभाषा समीक्षा | draft · native review | packages/bubble/src/locales/hi.ts |
| 125 | `bubble.pill.draftTitle` | {what} तब तक मसौदा है जब तक कोई मातृभाषी समीक्षा न करे | {what} is a draft until a native speaker reviews it | packages/bubble/src/locales/hi.ts |
| 126 | `bubble.pill.draftWhat` | तमिल पाठ | Tamil copy | packages/bubble/src/locales/hi.ts |
| 127 | `bubble.pill.offline` | ऑफ़लाइन | offline | packages/bubble/src/locales/hi.ts |
| 128 | `bubble.pill.offlineTitle` | नेटवर्क नहीं — केवल डिवाइस मॉडल | No network — on-device models only | packages/bubble/src/locales/hi.ts |
| 129 | `bubble.pill.onDevice` | इस डिवाइस पर | on-device | packages/bubble/src/locales/hi.ts |
| 130 | `bubble.pill.onDeviceTitle` | इस डिवाइस पर चला — कुछ भी बाहर नहीं गया | Ran on this device — nothing left it | packages/bubble/src/locales/hi.ts |
| 131 | `bubble.reader.awaitingReview` | विद्वान समीक्षा की प्रतीक्षा | awaiting scholar review | packages/bubble/src/locales/hi.ts |
| 132 | `bubble.reader.glossLabel` | भावार्थ · मसौदा, विद्वान समीक्षा बाक़ी | Gloss · draft, pending scholar review | packages/bubble/src/locales/hi.ts |
| 133 | `bubble.reader.line` | पंक्ति {n} | line {n} | packages/bubble/src/locales/hi.ts |
| 134 | `bubble.reader.scholarVerified` | विद्वान द्वारा सत्यापित | scholar-verified | packages/bubble/src/locales/hi.ts |
| 135 | `bubble.reader.verses` | श्लोक | Verses | packages/bubble/src/locales/hi.ts |
| 136 | `bubble.sound.ariaOff` | याझ ध्वनि बंद है। तार सुनने के लिए चालू करें | Yazh sound off. Turn on to hear the strings | packages/bubble/src/locales/hi.ts |
| 137 | `bubble.sound.ariaOn` | याझ ध्वनि चालू है। बंद करें | Yazh sound on. Turn off | packages/bubble/src/locales/hi.ts |
| 138 | `bubble.sound.off` | ध्वनि | Sound | packages/bubble/src/locales/hi.ts |
| 139 | `bubble.sound.on` | ध्वनि चालू | Sound on | packages/bubble/src/locales/hi.ts |
| 140 | `bubble.sound.titleOff` | याझ की ध्वनि चालू करें | Turn on the yazh's sound | packages/bubble/src/locales/hi.ts |
| 141 | `bubble.sound.titleOn` | ध्वनि चालू | Sound on | packages/bubble/src/locales/hi.ts |
| 142 | `bubble.support.runbookEyebrow` | कुरल रनबुक | Kural runbook | packages/bubble/src/locales/hi.ts |
| 143 | `bubble.support.runbookTitle` | रनबुक | Runbook | packages/bubble/src/locales/hi.ts |
| 144 | `bubble.tinai.kurinji` | कुरिंजि | Kurinji | packages/bubble/src/locales/hi.ts |
| 145 | `bubble.tinai.kurinji.landscape` | पहाड़ | Hills | packages/bubble/src/locales/hi.ts |
| 146 | `bubble.tinai.kurinji.mood` | पहला मिलन — जिज्ञासा और खोज, जहाँ कथा आरंभ होती है | First meetings — curiosity and discovery, where a story starts | packages/bubble/src/locales/hi.ts |
| 147 | `bubble.tinai.marutham` | मरुतम् | Marutham | packages/bubble/src/locales/hi.ts |
| 148 | `bubble.tinai.marutham.landscape` | खेत | Farmland | packages/bubble/src/locales/hi.ts |
| 149 | `bubble.tinai.marutham.mood` | रोज़मर्रा का जीवन — गणना, काम और परिवार; कलह और मेल | Everyday life — counting, work and family; quarrel and reconciliation | packages/bubble/src/locales/hi.ts |
| 150 | `bubble.tinai.mullai` | मुल्लै | Mullai | packages/bubble/src/locales/hi.ts |
| 151 | `bubble.tinai.mullai.landscape` | वन | Forest | packages/bubble/src/locales/hi.ts |
| 152 | `bubble.tinai.mullai.mood` | प्रतीक्षा — धैर्य, पशु और बच्चों की लोककथाएँ | Waiting — patience, animals and the folk tales children know | packages/bubble/src/locales/hi.ts |
| 153 | `bubble.tinai.neytal` | नेय्तल् | Neytal | packages/bubble/src/locales/hi.ts |
| 154 | `bubble.tinai.neytal.landscape` | समुद्रतट | Seashore | packages/bubble/src/locales/hi.ts |
| 155 | `bubble.tinai.neytal.mood` | विरह — यात्राएँ और दूरी, प्रवासी भूमि | Longing — voyages and distance, the diaspora's landscape | packages/bubble/src/locales/hi.ts |
| 156 | `bubble.tinai.palai` | पालै | Palai | packages/bubble/src/locales/hi.ts |
| 157 | `bubble.tinai.palai.landscape` | शुष्क भूमि | Drylands | packages/bubble/src/locales/hi.ts |
| 158 | `bubble.tinai.palai.mood` | सहनशीलता — साहस और वियोग, कठिन कथाएँ | Endurance — courage and separation, the harder stories | packages/bubble/src/locales/hi.ts |
| 159 | `bubble.tray.label` | बबल | Bubbles | packages/bubble/src/locales/hi.ts |
| 160 | `bubble.trust.allPassed` | सभी उत्तीर्ण | all passed | packages/bubble/src/locales/hi.ts |
| 161 | `bubble.trust.consentBullet1` | हम आपके बच्चे का पहला नाम और आयु-वर्ग रखते हैं। और कुछ नहीं। | We keep your child's first name and age band. Nothing else. | packages/bubble/src/locales/hi.ts |
| 162 | `bubble.trust.consentBullet2` | चिह्नित बातचीत की समीक्षा कोई प्रतिदिन करता है। | A person reviews flagged conversations every day. | packages/bubble/src/locales/hi.ts |
| 163 | `bubble.trust.consentBullet3` | आप कभी भी सब कुछ देख, रोक या हटा सकते हैं। | You can see, pause or delete everything at any time. | packages/bubble/src/locales/hi.ts |
| 164 | `bubble.trust.consentCta` | मैं अभिभावक हूँ — मेरा सत्यापन करें | I'm the parent — verify me | packages/bubble/src/locales/hi.ts |
| 165 | `bubble.trust.consentEyebrow` | याझ | Yazh | packages/bubble/src/locales/hi.ts |
| 166 | `bubble.trust.consentSent` | हमने माता-पिता के फ़ोन पर सत्यापन चरण भेजा है। पूरा होने तक याझ बंद रहेगा। | We've sent a verification step to the parent's phone. Yazh stays closed until it is completed. | packages/bubble/src/locales/hi.ts |
| 167 | `bubble.trust.consentTitle` | पहले माता-पिता की सहमति | A parent's consent comes first | packages/bubble/src/locales/hi.ts |
| 168 | `bubble.trust.failed` | {count} विफल | {count} failed | packages/bubble/src/locales/hi.ts |
| 169 | `bubble.trust.posture.context` | संदर्भ | Context | packages/bubble/src/locales/hi.ts |
| 170 | `bubble.trust.posture.plan` | योजना | Plan | packages/bubble/src/locales/hi.ts |
| 171 | `bubble.trust.posture.reason` | तर्क | Reason | packages/bubble/src/locales/hi.ts |
| 172 | `bubble.trust.posture.reflect` | चिंतन | Reflect | packages/bubble/src/locales/hi.ts |
| 173 | `bubble.trust.posture.respond` | उत्तर | Respond | packages/bubble/src/locales/hi.ts |
| 174 | `bubble.trust.traceEyebrow` | पंच-अवस्था कर्नेल | Five-Posture kernel | packages/bubble/src/locales/hi.ts |
| 175 | `bubble.trust.traceTitle` | तर्क-अनुक्रम | Reasoning trace | packages/bubble/src/locales/hi.ts |
| 176 | `bubble.verse.draftGloss` | (मसौदा अनुवाद) | (draft gloss) | packages/bubble/src/locales/hi.ts |
| 177 | `bubble.verse.kural` | तिरुक्कुरल {number} | Thirukkural {number} | packages/bubble/src/locales/hi.ts |
| 178 | `bubble.workspace.chooseFiles` | फ़ाइलें चुनें | Choose files | packages/bubble/src/locales/hi.ts |
| 179 | `bubble.workspace.handoffPickedUp` | लिया गया: {who} | Picked up by: {who} | packages/bubble/src/locales/hi.ts |
| 180 | `bubble.workspace.handoffTitle` | किसी व्यक्ति को सौंपा गया | Handed to a person | packages/bubble/src/locales/hi.ts |
| 181 | `bubble.workspace.machineDraftEn` | machine draft | machine draft | packages/bubble/src/locales/hi.ts |
| 182 | `bubble.workspace.machineDraftTa` | इयந்திர வரைவு | இயந்திர வரைவு | packages/bubble/src/locales/hi.ts |
| 183 | `bubble.workspace.machineDraftTitle` | किसी मॉडल द्वारा बनाया गया — कोई व्यक्ति स्वीकृति देता है, तभी मान्य | Generated by a model — a person approves it before it counts | packages/bubble/src/locales/hi.ts |
| 184 | `bubble.workspace.pageNotVerified` | (अंश सत्यापित नहीं) | (span not verified) | packages/bubble/src/locales/hi.ts |
| 185 | `bubble.workspace.sampleEn` | sample data | sample data | packages/bubble/src/locales/hi.ts |
| 186 | `bubble.workspace.sampleTa` | मாதிரித் தரவு | மாதிரித் தரவு | packages/bubble/src/locales/hi.ts |
| 187 | `bubble.workspace.sampleTitle` | डेमो मोड: कृत्रिम डेटा, वास्तविक उत्तर या लोग नहीं | Demo mode: synthetic data, not real answers or people | packages/bubble/src/locales/hi.ts |
| 188 | `bubble.workspace.tickFirst` | फ़ाइलें चुनने के लिए ऊपर बॉक्स पर टिक करें | Tick the box above to choose files | packages/bubble/src/locales/hi.ts |
