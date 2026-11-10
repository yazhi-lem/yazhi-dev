import { BackendError, type NyayaAnswer, type NyayaAskRequest, type NyayaSection, type Text } from "@yazhi/contract/types";
import { SECTIONS, findLegal } from "./samples";

/** Nyaya's side of the backend contract, answered from the fixtures.
    Pure functions: the workspace calls them in fixture mode and the mock
    gateway calls them on the server. The refusal rules here (advice words,
    no stored Act text) are the demo's stand-in for the checks yazhi-api
    runs in code before any model text is shown. */

/** Shown under every Nyaya reply, answered or refused. † draft. */
export const NYAYA_DISCLAIMER: Text = {
  ta: "இது தகவல் மட்டுமே; சட்ட ஆலோசனை அல்ல.",
  en: "Information, not advice.",
  te: "ఇది సమాచారం మాత్రమే; న్యాయ సలహా కాదు.",
};

/** The section the legal-aid handoff card rests on. */
const LEGAL_AID_SECTION = "lsa-12";

function section(id: string): NyayaSection {
  const s = SECTIONS[id];
  return { id: s.id, act: s.act, title: s.title, locator: s.locator, excerpt: s.excerpt ?? "", verified: !!s.verified };
}

export function nyayaAsk(req: NyayaAskRequest): NyayaAnswer {
  const question = typeof req?.question === "string" ? req.question.trim() : "";
  if (!question) throw new BackendError("bad_request", "question is required.", 400);
  const found = findLegal(question);
  if (found.kind === "answer") {
    const ids = [...new Set(found.a.steps.map((s) => s.cite))];
    return {
      status: "answered",
      answer_id: found.a.id,
      steps: found.a.steps.map((s) => ({ text: s.text, section_id: s.cite })),
      sections: ids.map(section),
      disclaimer: NYAYA_DISCLAIMER,
    };
  }
  return {
    status: found.kind === "advice" ? "refused_advice" : "no_source",
    handoff: { kind: "legal_services_authority", basis_section_id: LEGAL_AID_SECTION },
    disclaimer: NYAYA_DISCLAIMER,
  };
}

export function nyayaSection(id: string): NyayaSection {
  if (!SECTIONS[id]) throw new BackendError("not_found", `No section "${id}".`, 404);
  return section(id);
}
