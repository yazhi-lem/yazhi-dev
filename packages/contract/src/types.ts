/** @yazhi/contract — the shapes the workspaces and the backend agree on.

    Backend Contract v0.1 (draft). This file and ../openapi.yaml say the
    same thing; when one changes, change the other in the same commit.
    Plain types only: safe to import from the browser, route handlers and
    tests.

    Three rules are part of the contract, not of any one screen:
      1. A source, or a refusal. An answer either carries the citations it
         rests on, or says which kind of "I don't know" it is.
      2. Nothing changes without a yes. A call that would change a system
         returns a Confirmation; a second call by a person carries it out.
      3. Sample data says so. `meta.sample` is true whenever the reply was
         built from fixtures. */

export const CONTRACT_VERSION = "0.1.0";

export type Lang = "ta" | "en" | "te";
/** Guru can answer in Tanglish (Tamil in Latin letters) as well. */
export type AnswerLang = "ta" | "en" | "tg";

/** One string in each language the screen may show. Tamil is required;
    `te` and `tg` are present only where the product offers them. */
export interface Text {
  ta: string;
  en: string;
  te?: string;
  tg?: string;
}

export interface Meta {
  request_id: string;
  /** true when the reply was built from fixtures, not a customer's data */
  sample: boolean;
  /** who answered: fixtures in the browser, the mock gateway, or yazhi-api behind the gateway */
  served_by: "fixture" | "mock-gateway" | "yazhi-api";
  /** where the request was served; production is India only */
  region: "IN";
  contract: string;
  model?: string;
  latency_ms?: number;
}

export interface Envelope<T> {
  data: T;
  meta: Meta;
}

export type ErrorCode = "bad_request" | "unauthorized" | "forbidden" | "not_found" | "conflict" | "unavailable" | "not_implemented";

export interface Problem {
  error: { code: ErrorCode; message: string; request_id: string };
}

/* ---------------------------------------------------------------- Guru */

export interface GuruNotebook {
  id: string;
  code: string;
  title: Text;
  faculty: string;
  state: "ready" | "indexing";
  source_count: number;
  searchable_count: number;
}

export interface GuruSource {
  id: string;
  name: string;
  type: "PDF" | "PPTX" | "DOCX" | "Image";
  pages: number;
  status: "searchable" | "indexing" | "scanned";
  past_paper: boolean;
  uploaded_by: string;
  /** indexing progress, 0–1, and minutes left */
  progress?: number;
  eta_minutes?: number;
}

/** One cited page: the file, the page, and the span the sentence rests on. */
export interface GuruCitation {
  id: string;
  source_id: string;
  source_name: string;
  page: number;
  heading: Text;
  span: Text;
  /** the span was found in the stored page by the citation check, in code */
  verified: boolean;
}

export interface GuruAskRequest {
  question: string;
  answer_lang?: AnswerLang;
}

export type GuruAnswer =
  | {
      status: "answered";
      answer_id: string;
      /** each sentence points at one citation, 1-based into `citations` */
      parts: { text: Text; cite: number }[];
      citations: GuruCitation[];
    }
  | {
      status: "not_in_sources";
      /** the closest page the faculty shared, if there is one */
      nearest?: GuruCitation & { pages?: string };
    };

/* --------------------------------------------------------------- Nyaya */

export interface NyayaSection {
  id: string;
  act: string;
  title: string;
  locator: string;
  excerpt: string;
  verified: boolean;
}

export interface NyayaAskRequest {
  question: string;
  lang?: Lang;
  /** e.g. "tn", "ts", "ap" */
  jurisdiction?: string;
}

export interface NyayaHandoff {
  kind: "legal_services_authority";
  /** the section the handoff card rests on */
  basis_section_id: string;
}

export type NyayaAnswer =
  | {
      status: "answered";
      answer_id: string;
      steps: { text: Text; section_id: string }[];
      sections: NyayaSection[];
      /** "Information, not advice" — always present, always shown */
      disclaimer: Text;
    }
  | {
      /** refused_advice: the question asks what to do or how to win.
          no_source: no stored Act text supports an answer. */
      status: "refused_advice" | "no_source";
      handoff: NyayaHandoff;
      disclaimer: Text;
    };

/* --------------------------------------------------------------- Kural */

export type KuralChannel = "chat" | "mail";
export type OrderStatus = "placed" | "confirmed" | "packed" | "out" | "delivered";

export interface KuralOrder {
  id: string;
  customer: string;
  items: string;
  status: OrderStatus;
  placed: string;
  channel: "counter" | "chat" | "mail";
}

export interface KuralKbEntry {
  id: string;
  group: "faq" | "policy";
  question: Text;
  answer: Text;
  state: "live" | "draft";
}

export interface KuralKb {
  entries: KuralKbEntry[];
  updated: string;
}

export interface KuralMessageRequest {
  conversation_id?: string;
  channel: KuralChannel;
  text: string;
}

/** What the reply rests on: a shop record or a knowledge-base entry. */
export interface KuralSource {
  type: "record" | "kb";
  id: string;
}

export type KuralReply =
  | { kind: "order"; order: KuralOrder; source: KuralSource }
  | { kind: "ask_order_id" }
  | { kind: "kb"; entry: KuralKbEntry; source: KuralSource }
  | { kind: "handoff"; ticket_id: string; reason: "not_in_knowledge_base" | "order_not_found" };

export interface KuralTicket {
  id: string;
  channel: KuralChannel;
  from: string;
  subject: string;
  body: string;
  category: Text;
  priority: "low" | "normal" | "high" | "urgent";
  suggested: Text;
  status: "open" | "sent" | "staff";
  /** the message holds text that reads like instructions to the agent;
      it is treated as data and goes to a person */
  injection: boolean;
  source?: string;
}

/* ------------------------------------------------------- confirmations */

/** The ConfirmGate, as data: what will happen, what it touches, how to
    undo it. Nothing has happened while `status` is "pending". */
export interface Confirmation {
  id: string;
  action: string;
  affects: string;
  undo: string;
  status: "pending" | "approved" | "declined";
  expires_at: string;
}

export interface ConfirmationDecision {
  decision: "approve" | "decline";
}

export interface Health {
  status: "ok";
  contract: string;
  served_by: Meta["served_by"];
  workspaces: string[];
}

/* -------------------------------------------------------- the backend */

/** Everything a workspace may ask of the backend. One interface, three
    implementations: fixtures in the browser, HTTP to the gateway, and the
    mock gateway's handlers. */
export interface Backend {
  health(): Promise<Envelope<Health>>;
  guru: {
    notebooks(): Promise<Envelope<GuruNotebook[]>>;
    sources(notebookId: string): Promise<Envelope<GuruSource[]>>;
    ask(notebookId: string, req: GuruAskRequest): Promise<Envelope<GuruAnswer>>;
    citation(id: string): Promise<Envelope<GuruCitation>>;
  };
  nyaya: {
    ask(req: NyayaAskRequest): Promise<Envelope<NyayaAnswer>>;
    section(id: string): Promise<Envelope<NyayaSection>>;
  };
  kural: {
    message(req: KuralMessageRequest): Promise<Envelope<KuralReply>>;
    tickets(): Promise<Envelope<KuralTicket[]>>;
    kb(): Promise<Envelope<KuralKb>>;
    order(id: string): Promise<Envelope<KuralOrder>>;
    /** asks to send the suggested reply; returns the gate, sends nothing */
    replyToTicket(ticketId: string): Promise<Envelope<Confirmation>>;
  };
  confirmations: {
    decide(id: string, req: ConfirmationDecision): Promise<Envelope<Confirmation>>;
  };
}

export class BackendError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status = 500,
  ) {
    super(message);
    this.name = "BackendError";
  }
}
