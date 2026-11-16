// Guru chat demo — retrieval checks.
//
//   npm run test:guru-demo
//
// The demo must answer only from the Guru lesson notes: starters resolve to
// real chunks, real topics retrieve the right lesson, and off-syllabus
// questions come back as "not in the notes" rather than a guess.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEMO_CORPUS } from "./demo-corpus.ts";
import { DEMO_STARTERS, DEMO_LESSONS, answer, chunkById, search, tokens, groundedPrompt } from "./demo-retrieval.ts";

test("corpus holds the four Guru lessons, study chunks only", () => {
  assert.equal(DEMO_LESSONS.length, 4);
  for (const c of DEMO_CORPUS) {
    assert.ok(["overview", "notes", "key_facts", "mind_map"].includes(c.type), c.id);
    assert.ok(c.text.length > 0, c.id);
    assert.equal(c.text, c.text.normalize("NFC"), `${c.id} is NFC`);
  }
});

test("every starter points at real chunks and answers verbatim", () => {
  for (const s of DEMO_STARTERS) {
    for (const id of s.chunks) assert.ok(chunkById(id), `${id} exists`);
    for (const q of [s.q.ta, s.q.en]) {
      const a = answer(q);
      assert.equal(a.via, "starter", q);
      assert.deepEqual(a.chunks.map((c) => c.id), s.chunks, q);
    }
  }
});

test("free questions find the right lesson, in Tamil and English", () => {
  const cases = [
    ["Habeas Corpus writ", "GURU-GS4-POLITY-FR"],
    ["அடிப்படை உரிமைகள் உறுப்புகள்", "GURU-GS4-POLITY-FR"],
    ["ஒழுக்கமுடைமை குறள்", "GURU-TAM-U7-KURAL-014"],
    ["percentage increase formula", "GURU-APT-U1-PERCENT"],
    ["Sangam age trade barter", "GURU-GS6-TNHIST-SANGAM"],
  ];
  for (const [q, lesson] of cases) {
    const a = answer(q);
    assert.equal(a.via, "search", q);
    assert.equal(a.chunks[0].lesson, lesson, q);
  }
});

test("off-syllabus questions are not answered", () => {
  for (const q of ["Who won the 2022 FIFA world cup?", "quantum chromodynamics", "   ", "என்ன?"]) {
    const a = answer(q);
    assert.equal(a.via, "none", q);
    assert.equal(a.chunks.length, 0, q);
  }
});

test("review flags surface with the answer", () => {
  const flagged = DEMO_CORPUS.find((c) => c.review);
  assert.ok(flagged);
  const s = DEMO_STARTERS.find((x) => x.chunks.includes("GURU-GS4-POLITY-FR#009"));
  assert.equal(answer(s.q.en).review, chunkById("GURU-GS4-POLITY-FR#009").review);
});

test("tokens keep Tamil words whole; prompt cites ids", () => {
  assert.deepEqual(tokens("அடிப்படை உரிமைகள்!"), ["அடிப்படை", "உரிமைகள்"]);
  assert.ok(search("writs").length > 0);
  const p = groundedPrompt([chunkById("GURU-GS4-POLITY-FR#009")]);
  assert.match(p, /\[GURU-GS4-POLITY-FR#009\]/);
  assert.match(p, /ONLY from the lesson notes/);
});

test("a related chip opens exactly that chunk", async () => {
  const { answerChunk } = await import("./demo-retrieval.ts");
  assert.deepEqual(answerChunk("GURU-APT-U1-PERCENT#006").chunks.map((c) => c.id), ["GURU-APT-U1-PERCENT#006"]);
  assert.equal(answerChunk("nope").chunks.length, 0);
});
