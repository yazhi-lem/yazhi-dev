/** The Bubble UI library catalogue, English — the source strings.

    This is the library's OWN copy: the words inside `packages/bubble`
    (its components, modules, page templates, Mission Control, the yazh
    sound button and the locale-dependent tinai words). Chrome that lives on
    the site (`/chat`, `/app`, Circle…) is NOT here — it is
    `packages/i18n/src/strings/{chat,app}.ts`, read through `useUiT()`.

    Keys are flat and dotted, `bubble.<area>.<name>`; the areas mirror the
    package layout:

      bubble.common.*        shared words (add, total, send, close…)
      bubble.pill.*          RuntimeBadge, DraftTag
      bubble.citation.*      CitationMark, SourceCard
      bubble.guardrails.*    IDontKnow, Disclaimer
      bubble.gate.*          ConfirmGate
      bubble.message.*       typing dots
      bubble.composer.*      the message bar
      bubble.workspace.*     page chips, draft tags, upload card, handoff
      bubble.verse.*         KuralQuote, Stepper
      bubble.answer.*        SourcesPanel, CitedAnswer, LegalAnswerCard
      bubble.support.*       Kural's runbook panel
      bubble.hintLadder.*    Guru's hint ladder
      bubble.trust.*         Five-Posture trace, Yazh consent gate
      bubble.commerce.*      Kadai's product row and payment intent
      bubble.reader.*        Open Sangam's reader
      bubble.mission.*       Mission Control
      bubble.mode.*          light / dark / system switch
      bubble.sound.*         the yazh sound button
      bubble.tinai.*         tinai names, landscapes and moods
      bubble.app.*           app template identities and frames
      bubble.page.*          page-template chrome

    English is written by us, so entries are bare strings. Every key must
    exist in `ta.ts` / `hi.ts` too — `catalogue.test.mjs` enforces it. */
import type { Catalogue } from "@yazhi/i18n";

export const enBubbleCatalogue: Catalogue = {
  // --------------------------------------------------------------- common
  "bubble.common.add": "Add",
  "bubble.common.total": "Total",
  "bubble.common.close": "Close {title}",
  "bubble.common.open": "Open {title}",
  "bubble.common.verified": "verified",
  "bubble.common.verifiedTitle": "Checked by a reviewer",
  "bubble.common.unverified": "unverified",
  "bubble.common.unverifiedTitle": "Not yet checked by a reviewer",
  "bubble.common.cited": "{count} cited",
  "bubble.common.approvedBy": "✓ approved · {name}",
  "bubble.common.approvedTitle": "Approved by {name}",

  // ----------------------------------------------------------------- pill
  "bubble.pill.onDevice": "on-device",
  "bubble.pill.onDeviceTitle": "Ran on this device — nothing left it",
  "bubble.pill.offline": "offline",
  "bubble.pill.offlineTitle": "No network — on-device models only",
  "bubble.pill.apiTitle": "Ran on Adhan through yazhi-api",
  "bubble.pill.draft": "draft · native review",
  "bubble.pill.draftWhat": "Tamil copy",
  "bubble.pill.draftTitle": "{what} is a draft until a native speaker reviews it",

  // ------------------------------------------------------------- citation
  "bubble.citation.label": "Source {n}: {title}, {locator}",
  "bubble.citation.openSource": "Open source ↗",
  "bubble.citation.hrefTo": "Open {label}",

  // ----------------------------------------------------------- guardrails
  "bubble.guardrails.idontknow": "I don't know",
  "bubble.guardrails.legalTitle": "Legal information, not legal advice",
  "bubble.guardrails.legalBody":
    "This explains what the law says; it cannot advise you on your situation. For advice, contact your District Legal Services Authority (DLSA) — legal aid is free for many people — or a lawyer.",
  "bubble.guardrails.sampleTitle": "Sample data",
  "bubble.guardrails.sampleBody":
    "Everything on this screen is illustrative. It shows the layout, not real answers, citations, prices or people.",
  "bubble.guardrails.childrenTitle": "For parents and guardians",
  "bubble.guardrails.childrenBody":
    "Children use Yazh only after a parent gives verified consent. We keep a first name and an age band — nothing else.",

  // ----------------------------------------------------------------- gate
  "bubble.gate.needsHuman": "Needs a human confirm",
  "bubble.gate.affects": "Affects",
  "bubble.gate.rollback": "Rollback",
  "bubble.gate.typeToConfirm": "Type {word} to confirm",
  "bubble.gate.typePrompt": "Type {word}",
  "bubble.gate.confirmRun": "Confirm and run",
  "bubble.gate.dontRun": "Don't run",
  "bubble.gate.confirmed": "Confirmed by you — logged.",
  "bubble.gate.declined": "Declined — nothing ran.",

  // -------------------------------------------------------------- message
  "bubble.message.thinking": "Thinking",

  // ------------------------------------------------------------- composer
  "bubble.composer.placeholder": "Message…",
  "bubble.composer.send": "Send",
  "bubble.composer.stop": "Stop",

  // ------------------------------------------------------------ workspace
  "bubble.workspace.pageNotVerified": " (span not verified)",
  "bubble.workspace.machineDraftTa": "இயந்திர வரைவு",
  "bubble.workspace.machineDraftEn": "machine draft",
  "bubble.workspace.machineDraftTitle": "Generated by a model — a person approves it before it counts",
  "bubble.workspace.sampleTa": "மாதிரித் தரவு",
  "bubble.workspace.sampleEn": "sample data",
  "bubble.workspace.sampleTitle": "Demo mode: synthetic data, not real answers or people",
  "bubble.workspace.handoffTitle": "Handed to a person",
  "bubble.workspace.handoffPickedUp": "Picked up by: {who}",
  "bubble.workspace.chooseFiles": "Choose files",
  "bubble.workspace.tickFirst": "Tick the box above to choose files",

  // ---------------------------------------------------------------- verse
  "bubble.verse.kural": "Thirukkural {number}",
  "bubble.verse.draftGloss": "(draft gloss)",

  // --------------------------------------------------------------- answer
  "bubble.answer.sources": "Sources",
  "bubble.answer.noSources": "No sources — so no claim is made.",
  "bubble.answer.fallbackReason": "No stored source supports an answer to this question.",
  "bubble.answer.fallbackNext": "Try naming the text, verse or section you mean.",
  "bubble.answer.matched": "{pct}% matched",
  "bubble.answer.matchedTitle": "Cited sections matched to stored Act text",

  // -------------------------------------------------------------- support
  "bubble.support.runbookEyebrow": "Kural runbook",
  "bubble.support.runbookTitle": "Runbook",

  // ---------------------------------------------------------- hint ladder
  "bubble.hintLadder.eyebrow": "Guru",
  "bubble.hintLadder.hintN": "Hint {n}",
  "bubble.hintLadder.stuck": "I'm stuck — give me a hint",
  "bubble.hintLadder.next": "Next hint ({next} of {total})",
  "bubble.hintLadder.footnote": "Guru gives hints, not answers. Your teacher sees which hints you used.",

  // ---------------------------------------------------------------- trust
  "bubble.trust.traceTitle": "Reasoning trace",
  "bubble.trust.traceEyebrow": "Five-Posture kernel",
  "bubble.trust.failed": "{count} failed",
  "bubble.trust.allPassed": "all passed",
  "bubble.trust.posture.context": "Context",
  "bubble.trust.posture.reason": "Reason",
  "bubble.trust.posture.plan": "Plan",
  "bubble.trust.posture.respond": "Respond",
  "bubble.trust.posture.reflect": "Reflect",
  "bubble.trust.consentTitle": "A parent's consent comes first",
  "bubble.trust.consentEyebrow": "Yazh",
  "bubble.trust.consentBullet1": "We keep your child's first name and age band. Nothing else.",
  "bubble.trust.consentBullet2": "A person reviews flagged conversations every day.",
  "bubble.trust.consentBullet3": "You can see, pause or delete everything at any time.",
  "bubble.trust.consentSent": "We've sent a verification step to the parent's phone. Yazh stays closed until it is completed.",
  "bubble.trust.consentCta": "I'm the parent — verify me",

  // ------------------------------------------------------------- commerce
  "bubble.commerce.inStock": "in stock",
  "bubble.commerce.lowStock": "low",
  "bubble.commerce.outOfStock": "out",
  "bubble.commerce.order": "Order",
  "bubble.commerce.nothingAdded": "Nothing added yet.",
  "bubble.commerce.remove": "Remove {name}",
  "bubble.commerce.intentNote":
    "Payment intent only — the shop confirms and collects payment directly. No money moves through Yazhi.",

  // --------------------------------------------------------------- reader
  "bubble.reader.scholarVerified": "scholar-verified",
  "bubble.reader.awaitingReview": "awaiting scholar review",
  "bubble.reader.verses": "Verses",
  "bubble.reader.line": "line {n}",
  "bubble.reader.glossLabel": "Gloss · draft, pending scholar review",

  // ------------------------------------------------------------------ tray
  "bubble.tray.label": "Bubbles",

  // -------------------------------------------------------------- mission
  "bubble.mission.labelActive": "Mission Control{who}",
  "bubble.mission.whoSignedIn": " — signed in as {who}",
  "bubble.mission.labelBusy": "Mission Control — checking your Circle account",
  "bubble.mission.labelAsleep": "Mission Control — sign in with Circle to start",
  "bubble.mission.titleActive": "Mission Control",
  "bubble.mission.titleAsleep": "Sign in with Circle to open Mission Control",
  "bubble.mission.title": "Mission Control",
  "bubble.mission.close": "Close {title}",

  // ----------------------------------------------------------------- mode
  "bubble.mode.system": "System",
  "bubble.mode.light": "Light",
  "bubble.mode.dark": "Dark",
  "bubble.mode.switch": "Theme: {current}. Switch to {next}",
  "bubble.mode.current": "Theme: {current}",
  "bubble.mode.label": "Theme",

  // ---------------------------------------------------------------- sound
  "bubble.sound.on": "Sound on",
  "bubble.sound.off": "Sound",
  "bubble.sound.ariaOn": "Yazh sound on. Turn off",
  "bubble.sound.ariaOff": "Yazh sound off. Turn on to hear the strings",
  "bubble.sound.titleOn": "Sound on",
  "bubble.sound.titleOff": "Turn on the yazh's sound",

  // ---------------------------------------------------------------- tinai
  "bubble.tinai.palai": "Palai",
  "bubble.tinai.mullai": "Mullai",
  "bubble.tinai.kurinji": "Kurinji",
  "bubble.tinai.marutham": "Marutham",
  "bubble.tinai.neytal": "Neytal",
  "bubble.tinai.palai.landscape": "Drylands",
  "bubble.tinai.mullai.landscape": "Forest",
  "bubble.tinai.kurinji.landscape": "Hills",
  "bubble.tinai.marutham.landscape": "Farmland",
  "bubble.tinai.neytal.landscape": "Seashore",
  "bubble.tinai.palai.mood": "Endurance — courage and separation, the harder stories",
  "bubble.tinai.mullai.mood": "Waiting — patience, animals and the folk tales children know",
  "bubble.tinai.kurinji.mood": "First meetings — curiosity and discovery, where a story starts",
  "bubble.tinai.marutham.mood": "Everyday life — counting, work and family; quarrel and reconciliation",
  "bubble.tinai.neytal.mood": "Longing — voyages and distance, the diaspora's landscape",

  // ----------------------------------------------------------------- apps
  "bubble.app.avai.name": "Avai",
  "bubble.app.avai.tagline": "Tamil literature, grammar and usage — every claim with its source",
  "bubble.app.nyaya.name": "Nyaya",
  "bubble.app.nyaya.tagline": "What the law says, in Tamil — with the section it comes from",
  "bubble.app.kuralDesk.name": "Kural Desk",
  "bubble.app.kuralDesk.tagline": "IT help in Tamil — proposes runbooks, never changes a system on its own",
  "bubble.app.guru.name": "Guru",
  "bubble.app.guru.tagline": "Maths, science and English through Tamil — hints, never answers",
  "bubble.app.kadai.name": "Kadai",
  "bubble.app.kadai.tagline": "A neighbourhood shop that takes orders in Tamil, with Annachi",
  "bubble.app.openSangam.name": "Open Sangam",
  "bubble.app.openSangam.tagline": "Classical Tamil, line by line — published only after scholar sign-off",
  "bubble.app.yazhParent.name": "Yazh — for parents",
  "bubble.app.yazhParent.tagline": "The parent's door into Yazh. Children never see this page.",

  // ----------------------------------------------------------------- page
  "bubble.page.templateReply": "Template preview — connect this page to a bubble runtime to answer.",
  "bubble.page.avai.anchorQuestion": "What does the Kural say about listening to others?",
  "bubble.page.avai.anchorAnswer": "Couplet 423 says wisdom is finding the truth in what you hear, whoever says it.",
  "bubble.page.avai.unknownQuestion": "In which year was the Thirukkural written?",
  "bubble.page.avai.unknownReason": "Scholars propose different dates, and no stored source settles a single year.",
  "bubble.page.avai.unknownNext": "I can show what each dating argument rests on, with its sources.",
  "bubble.page.avai.posture1": "English question about a Tamil text; answer bilingual.",
  "bubble.page.avai.posture2": "One stored source matched: Thirukkural 423.",
  "bubble.page.avai.posture3": "Quote, gloss, cite. No step needs a human.",
  "bubble.page.avai.posture4": "Every sentence cited.",
  "bubble.page.avai.posture5": "Second question had no source — declined.",
  "bubble.page.avai.composer": "Ask Avai about a verse, a word, a rule…",
  "bubble.page.nyaya.asideTitle": "Need advice on your situation?",
  "bubble.page.nyaya.asideEyebrow": "Get help",
  "bubble.page.nyaya.dlsa": "District Legal Services Authority",
  "bubble.page.nyaya.dlsaNote": "free legal aid for those who qualify.",
  "bubble.page.nyaya.lawyer": "A lawyer",
  "bubble.page.nyaya.lawyerNote": "for advice about your own case.",
  "bubble.page.nyaya.disclaimer": "Nyaya explains the law. It does not advise and is not a lawyer.",
  "bubble.page.nyaya.question": "[Sample question about a tenant's rights]",
  "bubble.page.nyaya.part1": "[Plain-language explanation of what the first provision says.]",
  "bubble.page.nyaya.part2": "[What the rules add about the procedure.]",
  "bubble.page.nyaya.composer": "Ask about a law, in Tamil or English…",
  "bubble.page.kural.queue": "Queue",
  "bubble.page.kural.open": "{count} open",
  "bubble.page.kural.noRunbook": "No runbook in the knowledge base matches this ticket yet.",
  "bubble.page.kural.noRunbookNext": "Kural will hand it to a person with what it has checked so far.",
  "bubble.page.guru.asideTitle": "Where this runs",
  "bubble.page.guru.asideEyebrow": "Institute data",
  "bubble.page.guru.asideBody": "Guru runs on the institute's own machine. Student work and hint usage never leave it.",
  "bubble.page.guru.lessonTitle": "Linear equations · lesson 3",
  "bubble.page.guru.lessonEyebrow": "Algebra",
  "bubble.page.guru.stepRead": "Read",
  "bubble.page.guru.stepTry": "Try",
  "bubble.page.guru.stepHints": "Hints",
  "bubble.page.guru.stepCheck": "Check",
  "bubble.page.kadai.shopReply":
    "Here's what the shop has — add what you need, and the shop will confirm.",
  "bubble.page.sangam.asideTitle": "About this corpus",
  "bubble.page.sangam.asideEyebrow": "Provenance",
  "bubble.page.sangam.asideBody":
    "Sample corpus: four Thirukkural couplets. The reader is built for Maduraikanchi lines 1–100, which publish after scholar sign-off on every line.",
  "bubble.page.sangam.readerTitle": "Thirukkural — sample",
  "bubble.page.yazh.behindGate": "Behind the gate: the parent's view of their child's Yazh.",
};
