import type { ReactNode } from "react";
import { RuntimeBadge } from "./Pill";

/** Three dots while a reply streams. */
export function TypingDots() {
  return (
    <span className="inline-flex gap-1" role="status" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ivory-dim" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </span>
  );
}

/** One turn in a conversation. User turns sit right in a filled bubble;
    agent turns sit left as plain prose with an optional runtime badge and
    footer (citations, actions). */
export function MessageBubble({
  role,
  children,
  runtime,
  footer,
  pending = false,
}: {
  role: "user" | "assistant";
  children?: ReactNode;
  runtime?: "device" | "yazhi-api";
  footer?: ReactNode;
  pending?: boolean;
}) {
  if (role === "user") {
    return <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">{children}</div>;
  }
  return (
    <div className="max-w-[92%] text-sm leading-relaxed text-ivory">
      {pending ? <TypingDots /> : children}
      {(runtime || footer) && !pending && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {runtime && <RuntimeBadge runtime={runtime} />}
          {footer}
        </div>
      )}
    </div>
  );
}
