"use client";
import { useEffect, useRef, useState } from "react";
import type { Agent, Message } from "@/lib/chat/types";
import { Markdown } from "./Markdown";

function Avatar({ agent, role }: { agent: Agent; role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <span
        aria-hidden
        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ivory/10 text-xs font-semibold text-ivory-dim"
      >
        You
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-night"
      style={{ backgroundColor: agent.accent }}
      title={`${agent.taName} • ${agent.name}`}
    >
      {agent.taName.charAt(0)}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy message"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="rounded-md px-1.5 py-0.5 text-[11px] text-ivory-dim opacity-0 transition hover:text-gold group-hover:opacity-100"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

function timeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageList({
  agent,
  messages,
  streaming,
}: {
  agent: Agent;
  messages: Message[];
  streaming: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  if (messages.length === 0) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      {messages.map((m, i) => {
        const isLast = i === messages.length - 1;
        const isStreaming = isLast && streaming && m.role === "assistant";
        const content = isStreaming && !m.content ? "…" : m.content;

        if (m.role === "user") {
          return (
            <div key={m.id} className="flex justify-end gap-3" data-lenis-prevent>
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gold/15 px-4 py-2.5 text-ivory">
                <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
              </div>
              <Avatar agent={agent} role="user" />
            </div>
          );
        }

        return (
          <div key={m.id} className="group flex gap-3" data-lenis-prevent>
            <Avatar agent={agent} role="assistant" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-ivory">
                  {agent.taName}
                  <span className="ml-1.5 text-xs font-normal text-ivory-dim">{agent.name}</span>
                </span>
                <span className="text-[11px] text-ivory-dim/70">{timeLabel(m.createdAt)}</span>
                <CopyButton text={m.content} />
              </div>
              <div className="min-w-0">
                <Markdown>{content}</Markdown>
                {isStreaming && (
                  <span aria-hidden className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-gold align-middle" />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
