"use client";
import { forwardRef } from "react";
import { T, toneStyle } from "@/bubble";
import { AGENTS } from "@/lib/chat/agents";
import type { Agent } from "@/lib/chat/types";
import { AgentMark, StatusLine } from "./AgentMark";
import { S, useBi } from "./strings";

/** No conversation open: choose who to ask. Each agent card shows its
    job, its rule and its release state before anything is sent; a prompt
    chip starts the conversation and sends that prompt in one step. */
export const Welcome = forwardRef<
  HTMLHeadingElement,
  { onStart: (agent: Agent, prompt?: string) => void }
>(function Welcome({ onStart }, headingRef) {
  const t = useBi();
  return (
    <div className="chat-scroll min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <header className="text-center">
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl text-ivory focus:outline-none sm:text-4xl">
            <T text={S.chooseAgent} separator=" · " />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ivory-dim">
            <T text={S.chooseAgentLede} separator=" — " />
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {AGENTS.map((a) => (
            <li key={a.id}>
              <article aria-labelledby={`agent-${a.id}`} className="ybi-bubble flex h-full flex-col gap-4 p-5" style={toneStyle(a.tone)}>
                <div className="flex items-start gap-3">
                  <AgentMark tone={a.tone} size={48} />
                  <div className="min-w-0">
                    <h3 id={`agent-${a.id}`} className="font-display text-2xl text-ivory">
                      <T text={a.name} />
                    </h3>
                    <StatusLine text={a.status} />
                  </div>
                </div>
                <p className="text-ivory-dim">
                  <T text={a.summary} />
                </p>
                <p className="text-sm text-ivory">
                  <span className="ybi-tone-text font-semibold">
                    <T text={S.rule} />:
                  </span>{" "}
                  <T text={a.rule} />
                </p>
                <div className="mt-auto space-y-2 border-t border-ivory/10 pt-4">
                  <p className="text-xs text-ivory-dim">
                    <T text={S.tryAsking} />
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {a.prompts.map((p) => (
                      <li key={p.prompt}>
                        <button
                          type="button"
                          onClick={() => onStart(a, p.prompt)}
                          title={p.prompt}
                          className="ybi-soft min-h-9 rounded-full px-3.5 text-sm"
                        >
                          <T text={p.label} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onStart(a)}
                    aria-label={`${t(S.start)}: ${t(a.name)}`}
                    className="ybi-solid mt-2 min-h-11 w-full rounded-full px-4 text-sm font-semibold"
                  >
                    <T text={S.start} /> · <T text={a.name} />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-ivory-dim">
          <T text={S.keptHere} separator=" " />
        </p>
      </div>
    </div>
  );
});
