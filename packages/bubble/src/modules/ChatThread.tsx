import type { ReactNode } from "react";
import { MessageBubble } from "../components/Message";

export interface ThreadTurn {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
  runtime?: "device" | "yazhi-api";
  pending?: boolean;
  footer?: ReactNode;
}

/** A scrolling conversation — the canvas of most Yazhi apps. Content is
    any node, so turns can hold cited answers, cards or gates. */
export function ChatThread({ turns, className = "" }: { turns: ThreadTurn[]; className?: string }) {
  return (
    <div className={`chat-scroll space-y-4 overflow-y-auto ${className}`} data-lenis-prevent aria-live="polite">
      {turns.map((t) => (
        <MessageBubble key={t.id} role={t.role} runtime={t.runtime} pending={t.pending} footer={t.footer}>
          {t.content}
        </MessageBubble>
      ))}
    </div>
  );
}
