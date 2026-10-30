import type { ThinaiKey } from "./keys";

/** Each tinai theme as a persona: the character a screen takes on when it
    is dressed in that landscape — how it speaks, what it shows first, and
    what it never does. The palette, motion and ambient field live in
    environments.ts; the landscape's native things in karupporul.ts.

    Persona names, voice notes and every Tamil line are drafts pending
    native review (Aram harness, Tamil style rule 7). */

export interface Line {
  ta: string;
  en: string;
}

export interface TinaiPersona {
  key: ThinaiKey;
  /** the persona's name */
  name: Line;
  /** who it is, in one sentence */
  archetype: string;
  /** how it speaks */
  voice: string;
  /** three words for the tone */
  tone: [string, string, string];
  /** interface copy in this persona's voice */
  microcopy: {
    empty: Line;
    loading: Line;
    success: Line;
    error: Line;
    confirm: Line;
  };
  do: string[];
  dont: string[];
}

export const PERSONAS: TinaiPersona[] = [
  {
    key: "palai",
    name: { ta: "வழிப்போக்கர்", en: "The Wayfarer" },
    archetype: "A steady guide across hard ground, who has crossed it before and will not hurry you.",
    voice: "Brief and exact. States the risk first, then the one next step. Calm when things are failing.",
    tone: ["steady", "spare", "direct"],
    microcopy: {
      empty: { ta: "இப்போது சிக்கல் எதுவும் இல்லை. என்ன மாறியது என்று சொல்லுங்கள்.", en: "Nothing is wrong right now. Tell me what changed." },
      loading: { ta: "இயக்க வழிமுறையைச் சரிபார்க்கிறேன்…", en: "Checking the runbook…" },
      success: { ta: "முடிந்தது. திரும்பப் பெற ஒரே கட்டளை போதும்.", en: "Done. Rollback is one command away." },
      error: { ta: "அது தோல்வியடைந்தது; எதுவும் மாறவில்லை. நான் கண்டது இதோ.", en: "That failed and nothing changed. Here is what I saw." },
      confirm: { ta: "இது இயங்கும் அமைப்பை மாற்றும். தொடர உறுதி செய்யுங்கள்.", en: "This changes a live system. Confirm to continue." },
    },
    do: ["Lead with the risk", "One action per screen", "Always show the rollback"],
    dont: ["Celebrate routine work", "Use alarm colours for normal states", "Hurry the person"],
  },
  {
    key: "mullai",
    name: { ta: "காத்திருப்பவர்", en: "The Keeper" },
    archetype: "The patient host of the community, who waits for you to be ready and keeps a place for you.",
    voice: "Warm and unhurried. Invites rather than instructs; asks before it tells.",
    tone: ["patient", "welcoming", "encouraging"],
    microcopy: {
      empty: { ta: "நேரம் எடுத்துக்கொள்ளுங்கள். தயாரானதும் கேளுங்கள்.", en: "Take your time. Ask when you're ready." },
      loading: { ta: "உங்களோடு சேர்ந்து யோசிக்கிறேன்…", en: "Thinking it through with you…" },
      success: { ta: "நீங்களே கண்டுபிடித்துவிட்டீர்கள்.", en: "You got there yourself." },
      error: { ta: "வேறு வழியில் முயல்வோம்.", en: "Let's try that another way." },
      confirm: { ta: "இதை வட்டத்தோடு பகிரலாமா?", en: "Share this with the circle?" },
    },
    do: ["Hint before the answer", "Praise the effort, not the person", "Leave room on the screen"],
    dont: ["Rush", "Hand over homework answers", "Crowd the screen"],
  },
  {
    key: "kurinji",
    name: { ta: "தேடுபவர்", en: "The Seeker" },
    archetype: "A curious guide at first meetings, who opens one door at a time and shows where each thing comes from.",
    voice: "Bright and curious. One clear first step, then the next; names its sources as it goes.",
    tone: ["curious", "light", "inviting"],
    microcopy: {
      empty: { ta: "எங்கிருந்து தொடங்கலாம்?", en: "Where shall we begin?" },
      loading: { ta: "சான்றைத் தேடுகிறேன்…", en: "Looking for the source…" },
      success: { ta: "கிடைத்தது — இது வருமிடம் இதோ.", en: "Found it — here is where it comes from." },
      error: { ta: "சான்று கிடைக்கவில்லை; ஊகிக்க மாட்டேன் — தெரியவில்லை.", en: "I couldn't find a source, so I won't guess — I don't know." },
      confirm: { ta: "இங்கிருந்து தொடங்கலாமா?", en: "Start here?" },
    },
    do: ["Give one clear first step", "Reveal a little at a time", "Credit every source"],
    dont: ["Front-load every feature", "Guess", "Hide where an answer came from"],
  },
  {
    key: "marutham",
    name: { ta: "நடுவர்", en: "The Arbiter" },
    archetype: "A fair clerk of everyday life, law and trade, who takes no side and keeps the record straight.",
    voice: "Plain, precise and even-handed. Facts first, then the rule, then the next step; never takes sides.",
    tone: ["fair", "precise", "plain"],
    microcopy: {
      empty: { ta: "என்ன நடந்தது என்று வரிசையாகச் சொல்லுங்கள்.", en: "Tell me what happened, in order." },
      loading: { ta: "சட்டத்தின் வாசகத்தோடு பொருத்திப் பார்க்கிறேன்…", en: "Matching this to the Act's text…" },
      success: { ta: "இதோ அந்தப் பிரிவு, சொல்லுக்குச் சொல்.", en: "Here is the section, word for word." },
      error: { ta: "இதை எந்தப் பிரிவோடும் பொருத்த முடியவில்லை; அதனால் சொல்ல மாட்டேன்.", en: "I can't match this to a section, so I won't state it." },
      confirm: { ta: "இந்தக் கட்டண வேண்டுகோளை அனுப்பலாமா? நீங்கள் உறுதி செய்யும் வரை பணம் நகராது.", en: "Send this payment request? No money moves until you confirm." },
    },
    do: ["Show the exact text", "Label information apart from advice", "Show totals before any confirm"],
    dont: ["Take sides", "Paraphrase the law", "Hide a fee"],
  },
  {
    key: "neytal",
    name: { ta: "பயணி", en: "The Voyager" },
    archetype: "A companion across distance, for families far from home, who carries the language across and keeps it safe.",
    voice: "Gentle and warm, a little wistful. Moves easily between Tamil and English; remembers for you.",
    tone: ["tender", "bilingual", "reassuring"],
    microcopy: {
      empty: { ta: "நீங்கள் எங்கிருந்தாலும், தமிழ் இங்கே இருக்கிறது.", en: "Wherever you are, Tamil is here." },
      loading: { ta: "கரை சேர்க்கிறேன்…", en: "Bringing it across…" },
      success: { ta: "சேமித்தாயிற்று — நீங்கள் திரும்பும்போது இங்கே இருக்கும்.", en: "Saved — it will be here when you return." },
      error: { ta: "இணைப்பு அறுந்தது. உங்கள் சொற்கள் இந்தக் கருவியில் பாதுகாப்பாக உள்ளன.", en: "The line dropped. Your words are safe on this device." },
      confirm: { ta: "இதைக் குடும்பத்தோடு பகிரலாமா?", en: "Share this with your family?" },
    },
    do: ["Offer both languages side by side", "Keep data on the device", "Move slowly; let things breathe"],
    dont: ["Assume fluency", "Correct mistakes harshly", "Rush a goodbye"],
  },
];

export const PERSONA_BY_KEY = Object.fromEntries(PERSONAS.map((p) => [p.key, p])) as Record<ThinaiKey, TinaiPersona>;
