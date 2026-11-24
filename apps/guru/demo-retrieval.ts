/** Guru chat demo — retrieval over the Guru lesson notes (demo-corpus.ts).

    No model, no network: a small BM25 over the verbatim study chunks, with
    prefix matching so Tamil inflections (உரிமை / உரிமைகள்) still meet.
    Every answer is a lesson chunk as written; when nothing scores, the demo
    says the question is not in Guru's notes instead of guessing.
    Plain TypeScript (no React) so `npm run test:guru-demo` can load it. */

import { DEMO_CORPUS, type DemoChunk } from "./demo-corpus";

export interface Bi {
  ta: string;
  en: string;
}

/** A starter question pinned to the chunks that answer it. */
export interface DemoStarter {
  q: Bi;
  chunks: string[];
}

/** Starter questions, each answered by named chunks of the lesson notes. */
export const DEMO_STARTERS: DemoStarter[] = [
  {
    q: { ta: "அடிப்படை உரிமைகள் அரசியலமைப்பின் எந்தப் பகுதியில் உள்ளன?", en: "Which part of the Constitution holds the Fundamental Rights?" },
    chunks: ["GURU-GS4-POLITY-FR#003", "GURU-GS4-POLITY-FR#007"],
  },
  {
    q: { ta: "ஐந்து நீதிப்பேராணைகள் யாவை?", en: "What are the five writs?" },
    chunks: ["GURU-GS4-POLITY-FR#009"],
  },
  {
    q: { ta: "ஒழுக்கமுடைமை அதிகாரம் — முக்கியத் தகவல்கள்", en: "Ozhukkamudaimai chapter — key facts" },
    chunks: ["GURU-TAM-U7-KURAL-014#010"],
  },
  {
    q: { ta: "விழுக்காடு — சூத்திர அட்டை", en: "Percentage — formula card" },
    chunks: ["GURU-APT-U1-PERCENT#006"],
  },
  {
    q: { ta: "மூவேந்தர் ஒப்பீடு — சேரர், சோழர், பாண்டியர்", en: "The three Sangam kings at a glance" },
    chunks: ["GURU-GS6-TNHIST-SANGAM#008"],
  },
];

/** The lessons in the corpus, in corpus order. */
export const DEMO_LESSONS: { id: string; titleTa: string; titleEn: string; exam: string; review: number; chunks: number }[] = (() => {
  const seen = new Map<string, { id: string; titleTa: string; titleEn: string; exam: string; review: number; chunks: number }>();
  for (const c of DEMO_CORPUS) {
    const l = seen.get(c.lesson) ?? { id: c.lesson, titleTa: c.titleTa, titleEn: c.titleEn, exam: c.exam, review: 0, chunks: 0 };
    l.chunks += 1;
    if (c.review) l.review += 1;
    seen.set(c.lesson, l);
  }
  return [...seen.values()];
})();

const BY_ID = new Map(DEMO_CORPUS.map((c) => [c.id, c]));
export const chunkById = (id: string): DemoChunk | undefined => BY_ID.get(id);

// question words and fillers that carry no topic
const STOP = new Set(
  [
    "a", "an", "the", "is", "are", "was", "were", "of", "in", "on", "to", "for", "and", "or", "what", "which", "who", "whom", "how", "why", "when", "where",
    "explain", "tell", "me", "about", "give", "list", "do", "does", "did", "be", "it", "its", "this", "that", "with", "by", "from", "as", "at", "can", "you", "please",
    "என்ன", "யாவை", "எந்த", "எந்தப்", "எது", "யார்", "எப்படி", "ஏன்", "பற்றி", "விளக்குக", "கூறுக", "சொல்", "சொல்லுங்கள்", "உள்ளன", "உள்ளது", "ஆகும்", "மற்றும்", "ஒரு", "இந்த", "அந்த",
    "enna", "entha", "pathi", "sollu", "irukku", "eppadi",
  ].map((w) => w.normalize("NFC")),
);

/** Lowercased NFC word tokens; Tamil vowel signs stay with their letters. */
export function tokens(s: string): string[] {
  return (s.normalize("NFC").toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? []).filter((w) => w.length > 1 || /\d/.test(w));
}

const chunkTerms = (c: DemoChunk) => tokens([c.titleTa, c.titleEn, c.section, c.subsection ?? "", c.text].join(" "));
const DOCS = DEMO_CORPUS.map((c) => ({ c, terms: chunkTerms(c) }));
const AVG = DOCS.reduce((n, d) => n + d.terms.length, 0) / DOCS.length;

/** a query word meets a chunk word when one is a prefix of the other (≥ 3 letters) */
function meets(q: string, d: string): boolean {
  if (q === d) return true;
  const n = Math.min(q.length, d.length);
  return n >= 3 && (d.startsWith(q) || q.startsWith(d));
}

export interface Hit {
  chunk: DemoChunk;
  score: number;
  /** share of the question's topic words this chunk contains */
  covered: number;
}

/** BM25 (k1 1.2, b 0.75) with prefix matching. */
export function search(q: string, limit = 3): Hit[] {
  const qs = [...new Set(tokens(q).filter((w) => !STOP.has(w)))];
  if (qs.length === 0) return [];
  const N = DOCS.length;
  const df = new Map(qs.map((w) => [w, DOCS.filter((d) => d.terms.some((t) => meets(w, t))).length]));
  const hits: Hit[] = [];
  for (const d of DOCS) {
    let score = 0;
    let met = 0;
    for (const w of qs) {
      const tf = d.terms.filter((t) => meets(w, t)).length;
      if (!tf) continue;
      met += 1;
      const n = df.get(w) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((tf * 2.2) / (tf + 1.2 * (0.25 + (0.75 * d.terms.length) / AVG)));
    }
    if (score > 0) hits.push({ chunk: d.c, score, covered: met / qs.length });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** below these the best chunk is too weak a match to show as an answer */
export const MIN_SCORE = 2.5;
export const MIN_COVERED = 0.5;

export interface DemoAnswer {
  /** the chunks shown as the answer, verbatim; empty = not in the notes */
  chunks: DemoChunk[];
  /** other chunks worth opening */
  related: DemoChunk[];
  /** true when any shown chunk carries a † faculty-review flag */
  review: boolean;
  via: "starter" | "search" | "none";
}

const asAnswer = (chunks: DemoChunk[], related: DemoChunk[], via: DemoAnswer["via"]): DemoAnswer => ({ chunks, related, review: chunks.some((c) => c.review), via });

/** Open one chunk directly (a "related" chip). */
export function answerChunk(id: string): DemoAnswer {
  const c = chunkById(id);
  return c ? asAnswer([c], [], "starter") : asAnswer([], [], "none");
}

/** Answer a learner's question from the notes only. */
export function answer(q: string): DemoAnswer {
  const norm = q.normalize("NFC").trim();
  const starter = DEMO_STARTERS.find((s) => s.q.ta === norm || s.q.en.toLowerCase() === norm.toLowerCase());
  if (starter) {
    const chunks = starter.chunks.map(chunkById).filter((c): c is DemoChunk => !!c);
    const related = search(norm, 4).map((h) => h.chunk).filter((c) => !starter.chunks.includes(c.id)).slice(0, 2);
    return asAnswer(chunks, related, "starter");
  }
  const hits = search(norm, 3);
  if (!hits.length || hits[0].score < MIN_SCORE || hits[0].covered < MIN_COVERED) return asAnswer([], hits.map((h) => h.chunk).slice(0, 2), "none");
  return asAnswer([hits[0].chunk], hits.slice(1).map((h) => h.chunk), "search");
}

/** The system prompt for the optional on-device model: answer only from the
    retrieved notes, Tamil first, cite chunk ids, never add facts. */
export function groundedPrompt(chunks: DemoChunk[]): string {
  const notes = chunks.map((c) => `[${c.id}] ${c.titleTa} / ${c.titleEn} — ${c.section}${c.subsection ? ` — ${c.subsection}` : ""}\n${c.text}`).join("\n\n---\n\n");
  return [
    "You are Guru, Yazhi's TNPSC Group IV study companion. Answer ONLY from the lesson notes below.",
    "Write the answer in Tamil first, then a short English version. Cite the note ids in square brackets.",
    "If the notes do not answer the question, say so (உங்கள் குறிப்புகளில் இல்லை / Not in Guru's notes) and stop. Never add dates, numbers, names or exam facts that are not in the notes.",
    "Lines marked † still need faculty review; keep the † and say so.",
    "",
    "LESSON NOTES:",
    notes,
  ].join("\n");
}
