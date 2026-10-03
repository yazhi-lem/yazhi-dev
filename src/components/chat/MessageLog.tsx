"use client";
import { useEffect, useRef } from "react";
import { T, toneStyle } from "@/bubble";
import type { Agent, Message } from "@/lib/chat/types";
import { AgentMark, StatusLine } from "./AgentMark";
import { Markdown } from "./Markdown";
import { S, useBi } from "./strings";

function clock(ts: number) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/** The conversation as an ordered list of message bubbles. Not a live
    region itself — ChatApp announces each reply once through its own
    status region, so a long answer is never read twice. Auto-scroll
    follows new messages only while the reader is already at the bottom. */
export function MessageLog({
  agent,
  messages,
  onCopy,
  onRetry,
  onPrompt,
}: {
  agent: Agent;
  messages: Message[];
  onCopy: (text: string) => void;
  onRetry: (messageId: string) => void;
  onPrompt: (prompt: string) => void;
}) {
  const t = useBi();
  const endRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stick.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      ref={scrollerRef}
      onScroll={(e) => {
        const el = e.currentTarget;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
      className="chat-scroll min-h-0 flex-1 overflow-y-auto"
      data-lenis-prevent
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
        {/* agent card — who you are talking to, its rule, before the first word */}
        <section aria-labelledby="agent-intro" className="ybi-bubble p-5" style={toneStyle(agent.tone)}>
          <div className="flex items-start gap-3">
            <AgentMark tone={agent.tone} size={44} />
            <div className="min-w-0 flex-1">
              <div>
                <h2 id="agent-intro" className="font-display text-xl text-ivory">
                  <T text={agent.name} />
                </h2>
                <StatusLine text={agent.status} />
              </div>
              <p className="mt-1 text-ivory-dim">
                <T text={agent.summary} />
              </p>
              <p className="mt-2 text-sm text-ivory">
                <span className="ybi-tone-text font-semibold">
                  <T text={S.rule} />:
                </span>{" "}
                <T text={agent.rule} />
              </p>
            </div>
          </div>
          {messages.length === 0 && (
            <div className="mt-4 border-t border-ivory/10 pt-4">
              <p className="mb-2 text-xs text-ivory-dim">
                <T text={S.tryAsking} />
              </p>
              <ul className="flex flex-wrap gap-2">
                {agent.prompts.map((p) => (
                  <li key={p.prompt}>
                    <button
                      type="button"
                      onClick={() => onPrompt(p.prompt)}
                      title={p.prompt}
                      className="ybi-soft min-h-9 rounded-full px-3.5 text-sm"
                    >
                      <T text={p.label} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <ol aria-label={t(S.conversations)} className="flex flex-col gap-5">
          {messages.map((m) =>
            m.role === "user" ? (
              <li key={m.id} className="flex justify-end">
                <article aria-label={`${t(S.you)}, ${clock(m.createdAt)}`} className="max-w-[85%]">
                  <div className="ybi-soft rounded-3xl rounded-br-lg px-4 py-2.5" style={toneStyle("gold")}>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                  </div>
                  <p className="mt-1 text-right text-xs text-ivory-dim">
                    <time dateTime={new Date(m.createdAt).toISOString()}>{clock(m.createdAt)}</time>
                  </p>
                </article>
              </li>
            ) : (
              <li key={m.id} className="flex gap-3">
                <AgentMark tone={m.status === "error" ? "error" : agent.tone} size={32} />
                <article aria-label={`${t(agent.name)}, ${clock(m.createdAt)}`} className="min-w-0 flex-1">
                  <div
                    className="ybi-bubble rounded-3xl rounded-tl-lg px-4 py-3"
                    style={toneStyle(m.status === "error" ? "error" : agent.tone)}
                  >
                    {m.status === "pending" ? (
                      <p className="flex items-center gap-3 text-ivory-dim">
                        <span className="ybi-typing" aria-hidden>
                          <span />
                          <span />
                          <span />
                        </span>
                        {t(agent.name)} {t(S.thinking)}
                      </p>
                    ) : m.status === "error" ? (
                      <p className="text-ivory">{m.content}</p>
                    ) : (
                      <Markdown>{m.content}</Markdown>
                    )}
                  </div>
                  {m.status !== "pending" && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-ivory-dim">
                      <time dateTime={new Date(m.createdAt).toISOString()} className="mr-1">
                        {clock(m.createdAt)}
                      </time>
                      {m.status === "error" ? (
                        <button type="button" onClick={() => onRetry(m.id)} className="min-h-8 rounded-full px-2.5 text-ivory underline-offset-2 hover:underline">
                          <T text={S.retry} />
                        </button>
                      ) : (
                        <button type="button" onClick={() => onCopy(m.content)} className="min-h-8 rounded-full px-2.5 hover:text-ivory hover:underline">
                          <T text={S.copy} />
                        </button>
                      )}
                    </div>
                  )}
                </article>
              </li>
            ),
          )}
        </ol>
        <div ref={endRef} />
      </div>
    </div>
  );
}
