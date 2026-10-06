"use client";
import { AGENTS, PROVIDER_META } from "@/lib/chat/agents";
import type { Agent, Provider } from "@/lib/chat/types";

const GROUPS: Provider[] = ["gemini", "openai"];

export function AgentPicker({ onSelect }: { onSelect: (agent: Agent) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <p className="display font-display text-2xl font-semibold text-ivory sm:text-3xl">
          Choose an agent
        </p>
        <p className="mt-2 text-sm text-ivory-dim">
          Each agent runs on a fixed provider — Gemini or ChatGPT — through the yazhi-api backend.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((provider) => {
          const meta = PROVIDER_META[provider];
          const agents = AGENTS.filter((a) => a.provider === provider);
          return (
            <section key={provider} className="rounded-2xl border border-ivory/10 bg-night-2/60 p-4">
              <header className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden />
                <h2 className="display font-display text-base font-semibold text-ivory">
                  {meta.label}
                </h2>
                <span className="text-xs text-ivory-dim">{meta.tagline}</span>
              </header>
              <div className="flex flex-col gap-2.5">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => onSelect(agent)}
                    className="group flex items-start gap-3 rounded-xl border border-ivory/10 bg-night p-3 text-left transition hover:border-gold/50 hover:bg-night-2"
                  >
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-night"
                      style={{ backgroundColor: agent.accent }}
                    >
                      {agent.taName.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-semibold text-ivory">{agent.name}</span>
                        <span className="text-xs text-ivory-dim">{agent.taName}</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ivory-dim">
                        {agent.description}
                      </span>
                      <span className="mt-1.5 inline-block rounded-full border border-ivory/15 px-2 py-0.5 font-mono text-[10px] text-ivory-dim">
                        {agent.model}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
