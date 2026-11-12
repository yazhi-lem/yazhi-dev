"use client";
import { CONTRACT_VERSION, backendMode, envelope, httpBackend, type Backend, type Envelope, type Health } from "@yazhi/contract";
import { getShared } from "@yazhi/workspace";
import { guruAsk, guruCitation, guruNotebooks, guruSources } from "./guru/backend";
import { nyayaAsk, nyayaSection } from "./nyaya/backend";
import { decideConfirmation, kuralKb, kuralMessage, kuralOrder, kuralReplyToTicket, kuralTickets } from "./kural/backend";
import { INITIAL_ORDERS, INITIAL_TICKETS, type Order, type Ticket } from "./shared/commerce-data";

/** The backend the workspaces talk to — the single integration point for
    Guru, Nyaya and Kural.

      fixture (default)  answers in the browser from the sample data, after
                         a short think. No network: safe for a demo on an
                         institute's machine with the cable out.
      api                the same calls over HTTP to /api/v1 (the mock
                         gateway, or yazhi-api behind it once it is wired).
                         Set NEXT_PUBLIC_YAZHI_BACKEND=api.

    Modules never import fixtures to answer a question; they call this. */

const think = <T>(ms: number, make: () => T): Promise<Envelope<T>> =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(envelope(make(), "fixture"));
      } catch (err) {
        reject(err);
      }
    }, ms);
  });

/** The shop's records as the person has changed them in this tab. */
const orders = () => getShared<Order[]>("shop.orders", INITIAL_ORDERS);
const tickets = () => getShared<Ticket[]>("shop.tickets", INITIAL_TICKETS);

const health = (): Health => ({ status: "ok", contract: CONTRACT_VERSION, served_by: "fixture", workspaces: ["guru", "nyaya", "kural"] });

export const fixtureBackend: Backend = {
  health: () => think(0, health),
  guru: {
    notebooks: () => think(0, guruNotebooks),
    sources: (nb) => think(0, () => guruSources(nb)),
    ask: (nb, req) => think(700, () => guruAsk(nb, req)),
    citation: (id) => think(0, () => guruCitation(id)),
  },
  nyaya: {
    ask: (req) => think(650, () => nyayaAsk(req)),
    section: (id) => think(0, () => nyayaSection(id)),
  },
  kural: {
    message: (req) => think(600, () => kuralMessage(req, orders())),
    tickets: () => think(0, () => kuralTickets(tickets())),
    kb: () => think(0, kuralKb),
    order: (id) => think(0, () => kuralOrder(id, orders())),
    replyToTicket: (id) => think(0, () => kuralReplyToTicket(id, tickets())),
  },
  confirmations: {
    decide: (id, req) => think(0, () => decideConfirmation(id, req?.decision)),
  },
};

let http: Backend | undefined;

export function backend(): Backend {
  if (backendMode() === "fixture") return fixtureBackend;
  return (http ??= httpBackend());
}
