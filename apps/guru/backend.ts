import { BackendError, type GuruAnswer, type GuruAskRequest, type GuruCitation, type GuruNotebook, type GuruSource } from "@yazhi/contract/types";
import { CITES, NOTEBOOKS, findAnswer, findNear, sourceById, sourcesFor, type Cite } from "./samples";

/** Guru's side of the backend contract, answered from the fixtures.
    Pure functions, no browser or React: the workspace calls them in
    fixture mode and the mock gateway (/api/v1) calls them on the server.
    In the product the same shapes come from the note agent and the
    citation check behind yazhi-api. */

function citation(c: Cite): GuruCitation {
  return { id: c.id, source_id: c.source, source_name: sourceById(c.source).name, page: c.page, heading: c.heading, span: c.span, verified: true };
}

export function guruNotebooks(): GuruNotebook[] {
  return NOTEBOOKS.map((n) => {
    const sources = sourcesFor(n.id);
    return { id: n.id, code: n.code, title: n.title, faculty: n.faculty, state: n.state, source_count: sources.length, searchable_count: sources.filter((s) => s.status === "searchable").length };
  });
}

function notebook(id: string) {
  const nb = NOTEBOOKS.find((n) => n.id === id);
  if (!nb) throw new BackendError("not_found", `No notebook "${id}".`, 404);
  return nb;
}

export function guruSources(notebookId: string): GuruSource[] {
  notebook(notebookId);
  return sourcesFor(notebookId).map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    pages: s.pages,
    status: s.status,
    past_paper: !!s.pastPaper,
    uploaded_by: s.by,
    ...(s.progress === undefined ? {} : { progress: s.progress }),
    ...(s.eta === undefined ? {} : { eta_minutes: s.eta }),
  }));
}

export function guruAsk(notebookId: string, req: GuruAskRequest): GuruAnswer {
  notebook(notebookId);
  const question = typeof req?.question === "string" ? req.question.trim() : "";
  if (!question) throw new BackendError("bad_request", "question is required.", 400);
  const hit = findAnswer(question, notebookId);
  if (hit) return { status: "answered", answer_id: hit.id, parts: hit.parts, citations: hit.cites.map((id) => citation(CITES[id])) };
  const near = findNear(question);
  return near ? { status: "not_in_sources", nearest: { ...citation(CITES[near.cite]), pages: near.pages } } : { status: "not_in_sources" };
}

export function guruCitation(id: string): GuruCitation {
  const c = CITES[id];
  if (!c) throw new BackendError("not_found", `No citation "${id}".`, 404);
  return citation(c);
}
