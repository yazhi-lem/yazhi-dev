/** The Bubble UI library catalogue, Tamil.

    DRAFT: native review pending. Every string below is newly written Tamil
    for copy that never had any (the library shipped English-only). Per the
    ecosystem rule, none of it may be presented as reviewed until a native
    speaker signs it off — `docs/TRANSLATION-STATUS.md` is the reviewer's
    list. Keys match `en.ts` exactly (both are derived from one key list in
    `index.ts`; `catalogue.test.mjs` asserts the parity).

    Written in செந்தமிழ் with the ecosystem glossary terms kept as they are
    (`தற்சார்பு` sovereign, `உள்நுழை` sign in); brand/product names
    (Yazhi, Avai, Nyaya, Guru, Kadai, Open Sangam, yazhi-api, Thirukkural)
    and Tamil-in-Tamil words stay as proper nouns. */
import type { Catalogue } from "@yazhi/i18n";

export const taBubbleCatalogue: Catalogue = {
  // --------------------------------------------------------------- common
  "bubble.common.add": "சேர்",
  "bubble.common.total": "மொத்தம்",
  "bubble.common.close": "{title} ஐ மூடு",
  "bubble.common.open": "{title} ஐத் திற",
  "bubble.common.verified": "சரிபார்க்கப்பட்டது",
  "bubble.common.verifiedTitle": "ஒரு திறனாய்வாளரால் சரிபார்க்கப்பட்டது",
  "bubble.common.unverified": "சரிபார்க்கப்படவில்லை",
  "bubble.common.unverifiedTitle": "இன்னும் ஒரு திறனாய்வாளரால் சரிபார்க்கப்படவில்லை",
  "bubble.common.cited": "{count} மேற்கோள்",
  "bubble.common.approvedBy": "✓ அங்கீகரிக்கப்பட்டது · {name}",
  "bubble.common.approvedTitle": "{name} அங்கீகரித்தது",

  // ----------------------------------------------------------------- pill
  "bubble.pill.onDevice": "சாதனத்தில்",
  "bubble.pill.onDeviceTitle": "இந்தச் சாதனத்தில் இயங்கியது — எதுவும் வெளியேறவில்லை",
  "bubble.pill.offline": "இணைப்பில்லை",
  "bubble.pill.offlineTitle": "வலைப்பிணைப்பு இல்லை — சாதன மாதிரிகள் மட்டுமே",
  "bubble.pill.apiTitle": "yazhi-api வழியாக அதனில் இயங்கியது",
  "bubble.pill.draft": "வரைவு · தாய்மொழி மதிப்பாய்வு",
  "bubble.pill.draftWhat": "தமிழ் உரை",
  "bubble.pill.draftTitle": "தாய்மொழிப் பேச்சாளர் மதிப்பாய்வு செய்யும் வரை {what} வரைவே",

  // ------------------------------------------------------------- citation
  "bubble.citation.label": "மூலம் {n}: {title}, {locator}",
  "bubble.citation.openSource": "மூலத்தைத் திற ↗",
  "bubble.citation.hrefTo": "{label} ஐத் திற",

  // ----------------------------------------------------------- guardrails
  "bubble.guardrails.idontknow": "எனக்குத் தெரியவில்லை",
  "bubble.guardrails.legalTitle": "சட்டத் தகவல், சட்ட ஆலோசனை அல்ல",
  "bubble.guardrails.legalBody":
    "சட்டம் என்ன சொல்கிறது என்பதை இது விளக்குகிறது; உங்கள் நிலைமைக்கு ஆலோசனை தர முடியாது. ஆலோசனைக்கு உங்கள் மாவட்ட சட்ட உதவி மையத்தை (DLSA) — பலருக்கு இலவச சட்ட உதவி உண்டு — அல்லது ஒரு வழக்கறிஞரை அணுகுங்கள்.",
  "bubble.guardrails.sampleTitle": "மாதிரித் தரவு",
  "bubble.guardrails.sampleBody":
    "இந்தத் திரையில் உள்ள அனைத்தும் விளக்கத்துக்கானவை. தளவமைப்பைக் காட்டுகின்றன; உண்மையான பதில்கள், மேற்கோள்கள், விலைகள் அல்லது மனிதர்கள் அல்ல.",
  "bubble.guardrails.childrenTitle": "பெற்றோருக்கும் பாதுகாவலருக்கும்",
  "bubble.guardrails.childrenBody":
    "ஒரு பெற்றோர் சரிபார்க்கப்பட்ட ஒப்புதலைத் தந்த பின்பே குழந்தைகள் யாழைப் பயன்படுத்துவர். முதல் பெயரும் வயதுப் பிரிவும் மட்டுமே நாங்கள் வைத்திருக்கிறோம் — வேறு எதுவுமில்லை.",

  // ----------------------------------------------------------------- gate
  "bubble.gate.needsHuman": "ஒரு மனித ஒப்புதல் தேவை",
  "bubble.gate.affects": "பாதிக்கும்",
  "bubble.gate.rollback": "பின்னிழுப்பு",
  "bubble.gate.typeToConfirm": "உறுதி செய்ய {word} எனத் தட்டச்சு செய்யுங்கள்",
  "bubble.gate.typePrompt": "{word} எனத் தட்டச்சு செய்யுங்கள்",
  "bubble.gate.confirmRun": "உறுதி செய்து இயக்கு",
  "bubble.gate.dontRun": "இயக்க வேண்டாம்",
  "bubble.gate.confirmed": "நீங்கள் உறுதி செய்தீர்கள் — பதிவு செய்யப்பட்டது.",
  "bubble.gate.declined": "மறுக்கப்பட்டது — எதுவும் இயங்கவில்லை.",

  // -------------------------------------------------------------- message
  "bubble.message.thinking": "யோசிக்கிறார்",

  // ------------------------------------------------------------- composer
  "bubble.composer.placeholder": "செய்தி…",
  "bubble.composer.send": "அனுப்பு",
  "bubble.composer.stop": "நிறுத்து",

  // ------------------------------------------------------------ workspace
  "bubble.workspace.pageNotVerified": " (பகுதி சரிபார்க்கப்படவில்லை)",
  "bubble.workspace.machineDraftTa": "இயந்திர வரைவு",
  "bubble.workspace.machineDraftEn": "machine draft",
  "bubble.workspace.machineDraftTitle": "ஒரு மாதிரியால் உருவாக்கப்பட்டது — ஒருவர் அங்கீகரித்த பின்பே கணக்கில் எடுக்கப்படும்",
  "bubble.workspace.sampleTa": "மாதிரித் தரவு",
  "bubble.workspace.sampleEn": "sample data",
  "bubble.workspace.sampleTitle": "மாதிரிக் காட்சி: செயற்கைத் தரவு; உண்மையான பதில்களும் மனிதர்களும் அல்ல",
  "bubble.workspace.handoffTitle": "ஒருவரிடம் ஒப்படைக்கப்பட்டது",
  "bubble.workspace.handoffPickedUp": "எடுத்துக்கொள்பவர்: {who}",
  "bubble.workspace.chooseFiles": "கோப்புகளைத் தேர்",
  "bubble.workspace.tickFirst": "கோப்புகளைத் தேர்ந்தெடுக்க மேலே உள்ள பெட்டியைக் குறிக்கவும்",

  // ---------------------------------------------------------------- verse
  "bubble.verse.kural": "திருக்குறள் {number}",
  "bubble.verse.draftGloss": "(வரைவு உரை)",

  // --------------------------------------------------------------- answer
  "bubble.answer.sources": "மூலங்கள்",
  "bubble.answer.noSources": "மூலங்கள் இல்லை — எனவே எந்தக் கூற்றும் இல்லை.",
  "bubble.answer.fallbackReason": "இந்தக் கேள்விக்கான பதிலைச் சேமிக்கப்பட்ட எந்த மூலமும் ஆதரிக்கவில்லை.",
  "bubble.answer.fallbackNext": "நீங்கள் குறிப்பிடும் உரை, பாடல் அல்லது பிரிவைப் பெயரிட்டுப் பாருங்கள்.",
  "bubble.answer.matched": "{pct}% பொருந்தியது",
  "bubble.answer.matchedTitle": "மேற்கோள் காட்டிய பிரிவுகள் சேமித்த சட்ட உரையோடு பொருந்தியவை",

  // -------------------------------------------------------------- support
  "bubble.support.runbookEyebrow": "குறள் இயக்க வழிமுறை",
  "bubble.support.runbookTitle": "இயக்க வழிமுறை",

  // ---------------------------------------------------------- hint ladder
  "bubble.hintLadder.eyebrow": "குரு",
  "bubble.hintLadder.hintN": "குறிப்பு {n}",
  "bubble.hintLadder.stuck": "தடைபடுகிறேன் — ஒரு குறிப்புத் தாருங்கள்",
  "bubble.hintLadder.next": "அடுத்த குறிப்பு ({next} / {total})",
  "bubble.hintLadder.footnote": "குரு குறிப்புகள் தருவார், விடைகள் தர மாட்டார். எந்தக் குறிப்புகளைப் பயன்படுத்தினீர்கள் என்பதை உங்கள் ஆசிரியர் பார்ப்பார்.",

  // ---------------------------------------------------------------- trust
  "bubble.trust.traceTitle": "பகுத்தறிவுத் தடம்",
  "bubble.trust.traceEyebrow": "ஐந்து-நிலைக் கருவம்",
  "bubble.trust.failed": "{count} தோல்வி",
  "bubble.trust.allPassed": "அனைத்தும் தேர்ச்சி",
  "bubble.trust.posture.context": "சூழல்",
  "bubble.trust.posture.reason": "பகுத்தறிவு",
  "bubble.trust.posture.plan": "திட்டம்",
  "bubble.trust.posture.respond": "பதில்",
  "bubble.trust.posture.reflect": "பின்னூட்டம்",
  "bubble.trust.consentTitle": "ஒரு பெற்றோரின் ஒப்புதலே முதலில்",
  "bubble.trust.consentEyebrow": "யாழ்",
  "bubble.trust.consentBullet1": "உங்கள் குழந்தையின் முதல் பெயரும் வயதுப் பிரிவும் மட்டுமே. வேறு எதுவுமில்லை.",
  "bubble.trust.consentBullet2": "குறிக்கப்பட்ட உரையாடல்களை ஒருவர் தினமும் மதிப்பாய்வு செய்கிறார்.",
  "bubble.trust.consentBullet3": "எந்த நேரத்திலும் அனைத்தையும் பார்க்கலாம், இடைநிறுத்தலாம் அல்லது நீக்கலாம்.",
  "bubble.trust.consentSent": "பெற்றோரின் கைபேசிக்கு ஒரு சரிபார்ப்பு நடவடிக்கையை அனுப்பியுள்ளோம். அது முடியும் வரை யாழ் மூடியே இருக்கும்.",
  "bubble.trust.consentCta": "நானே பெற்றோர் — என்னைச் சரிபார்க்கவும்",

  // ------------------------------------------------------------- commerce
  "bubble.commerce.inStock": "இருப்பில் உள்ளது",
  "bubble.commerce.lowStock": "குறைவு",
  "bubble.commerce.outOfStock": "இல்லை",
  "bubble.commerce.order": "ஆர்டர்",
  "bubble.commerce.nothingAdded": "இன்னும் எதுவும் சேர்க்கப்படவில்லை.",
  "bubble.commerce.remove": "{name} ஐ நீக்கு",
  "bubble.commerce.intentNote":
    "கட்டண வேண்டுகோள் மட்டுமே — கடையே உறுதி செய்து நேரடியாகப் பணம் பெறும். யாழி வழியாகப் பணம் செல்லாது.",

  // --------------------------------------------------------------- reader
  "bubble.reader.scholarVerified": "அறிஞரால் சரிபார்க்கப்பட்டது",
  "bubble.reader.awaitingReview": "அறிஞர் மதிப்பாய்வுக்குக் காத்திருக்கிறது",
  "bubble.reader.verses": "பாடல்கள்",
  "bubble.reader.line": "வரி {n}",
  "bubble.reader.glossLabel": "உரை · வரைவு, அறிஞர் மதிப்பாய்வுக்குக் காத்திருக்கிறது",

  // ------------------------------------------------------------------ tray
  "bubble.tray.label": "குமிழ்கள்",

  // -------------------------------------------------------------- mission
  "bubble.mission.labelActive": "மிஷன் கண்ட்ரோல்{who}",
  "bubble.mission.whoSignedIn": " — {who} ஆக உள்நுழைந்துள்ளீர்கள்",
  "bubble.mission.labelBusy": "மிஷன் கண்ட்ரோல் — உங்கள் Circle கணக்கு சரிபார்க்கப்படுகிறது",
  "bubble.mission.labelAsleep": "மிஷன் கண்ட்ரோல் — தொடங்க Circle மூலம் உள்நுழையுங்கள்",
  "bubble.mission.titleActive": "மிஷன் கண்ட்ரோல்",
  "bubble.mission.titleAsleep": "மிஷன் கண்ட்ரோலைத் திறக்க Circle மூலம் உள்நுழையுங்கள்",
  "bubble.mission.title": "மிஷன் கண்ட்ரோல்",
  "bubble.mission.close": "{title} ஐ மூடு",

  // ----------------------------------------------------------------- mode
  "bubble.mode.system": "ஒப்பனை நிலை",
  "bubble.mode.light": "வெளிச்சம்",
  "bubble.mode.dark": "இருள்",
  "bubble.mode.switch": "ஒப்பனை: {current}. {next} நிலைக்கு மாற்று",
  "bubble.mode.current": "ஒப்பனை: {current}",
  "bubble.mode.label": "ஒப்பனை",

  // ---------------------------------------------------------------- sound
  "bubble.sound.on": "ஓசை இயக்கத்தில்",
  "bubble.sound.off": "ஓசை",
  "bubble.sound.ariaOn": "யாழ் ஓசை இயக்கத்தில் உள்ளது. அணைக்க",
  "bubble.sound.ariaOff": "யாழ் ஓசை அணைந்துள்ளது. நரம்புகளைக் கேட்க இயக்குங்கள்",
  "bubble.sound.titleOn": "ஓசை இயக்கத்தில்",
  "bubble.sound.titleOff": "யாழின் ஓசையை இயக்குங்கள்",

  // ---------------------------------------------------------------- tinai
  "bubble.tinai.palai": "பாலை",
  "bubble.tinai.mullai": "முல்லை",
  "bubble.tinai.kurinji": "குறிஞ்சி",
  "bubble.tinai.marutham": "மருதம்",
  "bubble.tinai.neytal": "நெய்தல்",
  "bubble.tinai.palai.landscape": "வறண்ட நிலம்",
  "bubble.tinai.mullai.landscape": "காடு",
  "bubble.tinai.kurinji.landscape": "மலை",
  "bubble.tinai.marutham.landscape": "வயல்",
  "bubble.tinai.neytal.landscape": "கடலோரம்",
  "bubble.tinai.palai.mood": "தாங்கும் திறன் — துணிவும் பிரிவும், கடினமான கதைகள்",
  "bubble.tinai.mullai.mood": "காத்திருத்தல் — பொறுமை, விலங்குகள், குழந்தைகள் அறியும் நாட்டுப்புறக் கதைகள்",
  "bubble.tinai.kurinji.mood": "முதல் சந்திப்பு — ஆர்வமும் கண்டுபிடிப்பும்; கதை தொடங்கும் இடம்",
  "bubble.tinai.marutham.mood": "அன்றாட வாழ்க்கை — எண்ணிக்கை, வேலை, குடும்பம்; சண்டையும் சமரசமும்",
  "bubble.tinai.neytal.mood": "ஏக்கம் — கடலோட்டங்களும் தூரமும்; புலம்பெயர் நிலம்",

  // ----------------------------------------------------------------- apps
  "bubble.app.avai.name": "அவை",
  "bubble.app.avai.tagline": "தமிழ் இலக்கியம், இலக்கணம், வழக்கு — ஒவ்வொரு கூற்றுக்கும் சான்று",
  "bubble.app.nyaya.name": "நியாயம்",
  "bubble.app.nyaya.tagline": "சட்டம் என்ன சொல்கிறது, தமிழில் — அது வரும் பிரிவோடு",
  "bubble.app.kuralDesk.name": "குறள் மேசை",
  "bubble.app.kuralDesk.tagline": "தமிழில் IT உதவி — இயக்க வழிமுறைகளை முன்மொழியும், தானாக எந்த அமைப்பையும் மாற்றாது",
  "bubble.app.guru.name": "குரு",
  "bubble.app.guru.tagline": "கணக்கு, அறிவியல், ஆங்கிலம் — தமிழ் வழியாக; குறிப்புகள் தான், விடைகள் அல்ல",
  "bubble.app.kadai.name": "கடை",
  "bubble.app.kadai.tagline": "தமிழில் ஆர்டர்களை ஏற்கும் அக்கம்பக்கக் கடை, அண்ணாச்சியுடன்",
  "bubble.app.openSangam.name": "திறந்த சங்கம்",
  "bubble.app.openSangam.tagline": "சங்கத் தமிழ், வரிக்கு வரி — அறிஞர் ஒப்புதலுக்குப் பின்பே வெளியீடு",
  "bubble.app.yazhParent.name": "யாழ் — பெற்றோருக்கு",
  "bubble.app.yazhParent.tagline": "யாழுக்குள் பெற்றோரின் வழி. இந்தப் பக்கத்தைக் குழந்தைகள் ஒருபோதும் பார்க்க மாட்டார்கள்.",

  // ----------------------------------------------------------------- page
  "bubble.page.templateReply": "வார்ப்புரு முன்னோட்டம் — பதிலளிக்க இந்தப் பக்கத்தை ஒரு குமிழ் இயக்ககத்தோடு இணைக்கவும்.",
  "bubble.page.avai.anchorQuestion": "பிறரைக் கேட்டலைப் பற்றிக் குறள் என்ன சொல்கிறது?",
  "bubble.page.avai.anchorAnswer": "423-ஆம் குறள்: யார் சொன்னாலும், கேட்டதில் உண்மையைக் காண்பதே அறிவு என்கிறது.",
  "bubble.page.avai.unknownQuestion": "திருக்குறள் எந்த ஆண்டு எழுதப்பட்டது?",
  "bubble.page.avai.unknownReason": "அறிஞர்கள் வெவ்வேறு காலங்களை முன்மொழிகிறார்கள்; சேமிக்கப்பட்ட எந்த மூலமும் ஒரு ஆண்டை உறுதிசெய்யவில்லை.",
  "bubble.page.avai.unknownNext": "ஒவ்வொரு காலக்கணிப்பு வாதமும் எதை அடிப்படையாகக் கொண்டது என்பதை, அதன் மூலங்களோடு காட்ட முடியும்.",
  "bubble.page.avai.posture1": "தமிழ் உரை பற்றிய ஆங்கிலக் கேள்வி; பதில் இருமொழியில்.",
  "bubble.page.avai.posture2": "ஒரு சேமித்த மூலம் பொருந்தியது: திருக்குறள் 423.",
  "bubble.page.avai.posture3": "மேற்கோள், உரை, சான்று. எந்தப் படிக்கும் மனிதர் தேவையில்லை.",
  "bubble.page.avai.posture4": "ஒவ்வொரு வாக்கியத்துக்கும் சான்று.",
  "bubble.page.avai.posture5": "இரண்டாம் கேள்விக்கு மூலம் இல்லை — மறுக்கப்பட்டது.",
  "bubble.page.avai.composer": "ஒரு பாடல், சொல், இலக்கண விதி பற்றி அவையிடம் கேளுங்கள்…",
  "bubble.page.nyaya.asideTitle": "உங்கள் நிலைமைக்கு ஆலோசனை தேவையா?",
  "bubble.page.nyaya.asideEyebrow": "உதவி பெறுங்கள்",
  "bubble.page.nyaya.dlsa": "மாவட்ட சட்ட உதவி மையம்",
  "bubble.page.nyaya.dlsaNote": "தகுதியுள்ளவர்க்கு இலவச சட்ட உதவி.",
  "bubble.page.nyaya.lawyer": "ஒரு வழக்கறிஞர்",
  "bubble.page.nyaya.lawyerNote": "உங்கள் சொந்த வழக்குக்கான ஆலோசனைக்கு.",
  "bubble.page.nyaya.disclaimer": "நியாயம் சட்டத்தை விளக்குகிறது. ஆலோசனை தராது; வழக்கறிஞரும் அல்ல.",
  "bubble.page.nyaya.question": "[குத்தகைதாரரின் உரிமைகள் பற்றிய மாதிரிக் கேள்வி]",
  "bubble.page.nyaya.part1": "[முதல் சட்டத்துண்டு என்ன சொல்கிறது என்பதற்கான எளிய விளக்கம்.]",
  "bubble.page.nyaya.part2": "[செயல்முறை பற்றி விதிகள் சேர்ப்பது.]",
  "bubble.page.nyaya.composer": "ஒரு சட்டம் பற்றிக் கேளுங்கள் — தமிழிலோ ஆங்கிலத்திலோ…",
  "bubble.page.kural.queue": "வரிசை",
  "bubble.page.kural.open": "{count} திறந்தவை",
  "bubble.page.kural.noRunbook": "அறிவுத் தளத்தில் இந்தப் பணிக்குப் பொருந்தும் இயக்க வழிமுறை இன்னும் இல்லை.",
  "bubble.page.kural.noRunbookNext": "இதுவரை சரிபார்த்தவற்றோடு குறள் இதை ஒரு மனிதரிடம் ஒப்படைக்கும்.",
  "bubble.page.guru.asideTitle": "இது எங்கே இயங்குகிறது",
  "bubble.page.guru.asideEyebrow": "நிறுவனத் தரவு",
  "bubble.page.guru.asideBody": "குரு நிறுவனத்தின் சொந்த இயந்திரத்தில் இயங்குகிறது. மாணவர் வேலையும் குறிப்புப் பயன்பாடும் வெளியே செல்லாது.",
  "bubble.page.guru.lessonTitle": "நேரியல் சமன்பாடுகள் · பாடம் 3",
  "bubble.page.guru.lessonEyebrow": "இயற்கணிதம்",
  "bubble.page.guru.stepRead": "படி",
  "bubble.page.guru.stepTry": "முயற்சி",
  "bubble.page.guru.stepHints": "குறிப்புகள்",
  "bubble.page.guru.stepCheck": "சரிபார்",
  "bubble.page.kadai.shopReply": "கடையில் இருப்பது இதோ — தேவையானதைச் சேருங்கள்; கடை உறுதி செய்யும்.",
  "bubble.page.sangam.asideTitle": "இந்தத் தொகுப்பு பற்றி",
  "bubble.page.sangam.asideEyebrow": "மூலம்",
  "bubble.page.sangam.asideBody":
    "மாதிரித் தொகுப்பு: நான்கு திருக்குறள்கள். ஒவ்வொரு வரிக்கும் அறிஞர் ஒப்புதலுக்குப் பின்பே வெளியாகும் மதுரைக்காஞ்சி வரிகள் 1–100-க்காக இந்த வாசகம் கட்டப்பட்டது.",
  "bubble.page.sangam.readerTitle": "திருக்குறள் — மாதிரி",
  "bubble.page.yazh.behindGate": "வாசலுக்குப் பின்னால்: தங்கள் குழந்தையின் யாழைப் பற்றிய பெற்றோரின் பார்வை.",
};
