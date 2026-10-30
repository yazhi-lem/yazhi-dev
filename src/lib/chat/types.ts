/** Shared chat data model — used by the client UI, the session store,
    and the /api/chat route handler. Defined in @yazhi/bubble so the
    package's agents and the app's chat share one shape. */

export type { Provider, Agent, Message, Session, ChatRequest, ChatChunk } from "@yazhi/bubble/lib/agent-types";
