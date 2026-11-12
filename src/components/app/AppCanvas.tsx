"use client";
/** The canvas: one bubble's conversation, and the composer that leads it.

    What it shows, by bubble kind:

      agent     the seeded or restored thread, then the streaming reply, then
                the finished answer. The composer is live.
      template  the page template from the UI library, filled with sample
                data (Avai first — static copy, no auth, no commerce).
      workspace the real workspace shell from `@yazhi/apps/registry` — the
                same screen `/guru` serves, without leaving `/app`. It owns
                its own composer, so no second one is drawn.

    Hydration: there is no server-rendered thread to hydrate — `/app` keeps
    the conversation on the client, because restoring it depends on
    `localStorage` (`history`) and on `?q=` in the address bar, neither of
    which the server can see. So the thread is drawn by a `useState`
    initialiser that runs on both sides with the same pure inputs: the first
    client render reproduces the server's empty/seed/`?q=` list exactly (it
    shows nothing until mount), and any restored history is folded in after
    mount. The rule the task asks for — "the thread loads hydration-safe" —
    holds because the seed path and the client path are one function
    (`seedTurns` / `linkTurns`), not two.

    Screen readers: the host owns ONE polite live region; this canvas fills it
    exactly once per completed reply — never per token, and not at all for a
    reply the person stopped. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { BubbleMessage, BubbleRuntime } from "@yazhi/bubble";
import { Composer, MessageBubble, PAGE_COMPONENTS } from "@yazhi/bubble/host";
import { Panel } from "@yazhi/bubble";
import type { ComposerHandle } from "@yazhi/bubble/host";
import { MANIFESTS } from "@yazhi/apps/registry";
import { WorkspaceShell, type LinkLike } from "@yazhi/workspace";
import { WORKSPACE_BY_ID } from "@yazhi/apps/meta";
import { MissionMenu } from "@/components/mission/Mission";
import type { AppBubble } from "./bubbles";
import { useAppText } from "./useAppText";
import { nextId, resolveRuntime, useAppRun, type BubbleRunHistory, type RunError, type RunTurn, type RuntimeMode } from "./useAppRun";

const LinkAdapter: LinkLike = ({ href, className, children, ...rest }) => (
  <Link href={href} className={className} {...rest}>
    {children}
  </Link>
);

/** Every question in a thread, in order — what the URL carries in `?q=`. */
export function questionsOf(turns: RunTurn[]): string[] {
  return turns.filter((turn) => turn.role === "user").map((turn) => turn.content);
}

/** A thread built from `?q=` questions (a shared link). Answers are NOT
    restored — nobody can honestly replay a model's reply from a URL — so the
    note above the thread says exactly that. Pure and deterministic. */
export function linkTurns(bubble: AppBubble, questions: string[]): RunTurn[] {
  return questions.map((q, i) => ({ id: `${bubble.slug}-q${i}`, role: "user" as const, content: q, status: "done" as const }));
}

/** The first paint of an agent bubble with no questions yet: its own
    greeting, then the sample starting question. Pure and deterministic — the
    server and the browser run this with the same inputs. */
export function seedTurns(bubble: AppBubble): RunTurn[] {
  const seed = bubble.seed ?? [{ role: "assistant" as const, content: bubble.manifest?.agent.greeting ?? bubble.summary }];
  return seed.map((turn, i) => ({ id: `${bubble.slug}-s${i}`, role: turn.role, content: turn.content, status: "done" as const }));
}

export interface AppCanvasProps {
  bubble: AppBubble;
  workspaceId?: string;
  threadId: string;
  questions: string[];
  fromLink: boolean;
  circleReady: boolean;
  history: BubbleRunHistory | undefined;
  composerRef: RefObject<ComposerHandle | null>;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onHistory: (next: BubbleRunHistory) => void;
  onThreadGrew: (id: string, questions: string[]) => void;
  onAnnounce: (message: string) => void;
  onBackToTray: () => void;
}

export function AppCanvas({
  bubble,
  workspaceId,
  threadId,
  questions,
  fromLink,
  circleReady,
  history,
  composerRef,
  headingRef,
  onHistory,
  onThreadGrew,
  onAnnounce,
  onBackToTray,
}: AppCanvasProps) {
  const t = useAppText();
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>("auto");
  const [online, setOnline] = useState(true);
  const first = (): RunTurn[] => history?.turns ?? (questions.length ? linkTurns(bubble, questions) : seedTurns(bubble));
  const [turns, setTurns] = useState<RunTurn[]>(first);
  const askedRef = useRef<string[]>(questions);

  const runtime = resolveRuntime(runtimeMode, bubble, online);

  // the network state is a browser fact — read it in an effect, never during
  // render, so the server markup and the first client markup agree
  useEffect(() => {
    setOnline(navigator.onLine !== false);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  const run = useAppRun(
    useCallback(
      (text: string, via: BubbleRuntime) => {
        const reply: RunTurn = { id: nextId("a"), role: "assistant", content: text, status: "done", via };
        setTurns((prev) => {
          const next = [...prev, reply];
          onHistory({ thread: threadId, turns: next });
          return next;
        });
        // exactly one announcement per completed reply
        onAnnounce(t("app.announceDone", { bubble: bubble.name }));
      },
      [bubble.name, onAnnounce, onHistory, t, threadId]
    )
  );

  const failure: RunError | null = run.error;

  const send = (text: string) => {
    if (!bubble.manifest || run.streaming) return;
    const question: RunTurn = { id: nextId("u"), role: "user", content: text, status: "done" };
    const next = [...turns, question];
    const historyForModel: BubbleMessage[] = next.map(({ id, role, content }) => ({ id, role, content }));
    const id = threadId === "new" ? nextId("th") : threadId;
    askedRef.current = questionsOf(next);
    setTurns(next);
    onThreadGrew(id, askedRef.current);
    onHistory({ thread: id, turns: next });
    void run.send(text, historyForModel, bubble, runtime);
  };

  const header = (
    <CanvasHeader
      bubble={bubble}
      runtime={runtime}
      runtimeMode={runtimeMode}
      onRuntimeMode={setRuntimeMode}
      onBackToTray={onBackToTray}
      headingRef={headingRef}
      showRuntime={bubble.kind === "agent"}
    />
  );

  /* ── a workspace: the real shell, mounted ─────────────────────────── */
  const workspace = workspaceId ? WORKSPACE_BY_ID[workspaceId] : bubble.kind === "workspace" ? WORKSPACE_BY_ID[bubble.slug.replace(/^ws\./, "")] : undefined;
  const manifest = workspace ? MANIFESTS[workspace.id] : undefined;
  if (workspace && manifest) {
    return (
      <div className="space-y-3">
        {header}
        {!circleReady && <CircleNote />}
        <div className="overflow-hidden rounded-2xl border border-ivory/10 bubble-root">
          <WorkspaceShell
            manifest={manifest}
            Link={LinkAdapter}
            navigate={(href) => {
              window.location.assign(href);
            }}
            home={
              <button
                type="button"
                onClick={onBackToTray}
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 text-ivory-dim hover:border-ivory/40 hover:text-ivory"
                aria-label={t("app.backToTray")}
                title={t("app.backToTray")}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            }
            account={<MissionMenu size={34} />}
          />
        </div>
      </div>
    );
  }

  /* ── a page template: the library's own screen, sample data ──────── */
  const Template = bubble.kind === "template" && bubble.template ? PAGE_COMPONENTS[bubble.template as keyof typeof PAGE_COMPONENTS] : undefined;
  if (Template) {
    return (
      <div className="space-y-3">
        {header}
        <p className="rounded-xl border border-ivory/15 bg-ivory/5 px-3 py-2 text-xs text-ivory-dim">{t("app.templateNote")}</p>
        <div className="overflow-hidden rounded-2xl border border-ivory/10 bubble-root">
          <Template embedded />
        </div>
      </div>
    );
  }

  /* ── an agent bubble: the conversation the host exists for ────────── */
  return (
    <div className="space-y-3">
      {header}
      {!online && <p className="rounded-xl border border-palai/40 bg-palai/5 px-3 py-2 text-xs text-ivory">{t("app.offlineNote")}</p>}

      <p className="rounded-xl border border-ivory/15 bg-ivory/5 px-3 py-2 text-xs text-ivory-dim">{t("app.starterNote")}</p>

      {(fromLink || questions.length > 0) && (
        <p className="rounded-xl border border-ivory/15 bg-ivory/5 px-3 py-2 text-xs text-ivory-dim">
          {t("app.deepLinkNote")}{" "}
          <a href="/app" className="underline decoration-gold/60 underline-offset-2 hover:text-ivory">
            {t("app.deepLinkNote2")}
          </a>
          . <span className="opacity-70">({t("app.deepLinkNoAnswer")})</span>
        </p>
      )}

      <Panel title={t("app.threadTitle")} actions={<span className="text-[11px] text-ivory-dim">{turns.length}</span>}>
        <ol className="space-y-4">
          {turns.map((turn) => (
            <li key={turn.id}>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-ivory-dim">{turn.role === "user" ? t("app.you") : t("app.agent")}</p>
              <MessageBubble
                role={turn.role}
                runtime={turn.role === "assistant" ? (turn.via ?? bubble.manifest?.runtime.prefer) : undefined}
              >
                <p className="whitespace-pre-wrap break-words">{turn.content}</p>
                {turn.status === "stopped" && <p className="mt-1 text-xs text-ivory-dim">{t("app.stoppedNote")}</p>}
              </MessageBubble>
            </li>
          ))}

          {run.streaming && (
            <li>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-ivory-dim">{t("app.agent")}</p>
              {run.draft ? (
                <MessageBubble role="assistant" runtime={runtime}>
                  <p className="whitespace-pre-wrap break-words">{run.draft}</p>
                </MessageBubble>
              ) : (
                <MessageBubble role="assistant" pending />
              )}
            </li>
          )}
        </ol>
        {!turns.length && !run.streaming && <p className="text-sm text-ivory-dim">{t("app.threadEmpty")}</p>}
      </Panel>

      {failure && <RunErrorNote error={failure} />}

      {bubble.starters?.length ? (
        <div className="flex flex-wrap gap-2" aria-label={t("app.startersTitle")}>
          {bubble.starters.map((q) => (
            <button
              key={q}
              type="button"
              disabled={run.streaming}
              onClick={() => send(q)}
              className="rounded-full border border-ivory/20 px-3 py-1.5 text-xs text-ivory-dim transition-colors hover:border-gold/60 hover:text-ivory disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      <Composer
        ref={composerRef}
        onSend={send}
        onStop={run.stop}
        streaming={run.streaming}
        placeholder={t("app.placeholder", { bubble: bubble.taName ?? bubble.name })}
        sendLabel={t("app.send")}
        stopLabel={t("app.stop")}
        inputLabel={t("app.composerLabel")}
        leading={<MissionMenu size={36} up />}
      />

      {bubble.manifest && (
        <details className="rounded-xl border border-ivory/10 bg-night-2/60 px-3 py-2 text-xs text-ivory-dim">
          <summary className="cursor-pointer text-ivory">{t("app.promptTitle")}</summary>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">{bubble.promptPreview}</pre>
        </details>
      )}
    </div>
  );
}

/* ── the header: identity, runtime, place ────────────────────────────── */

function CanvasHeader({
  bubble,
  runtime,
  runtimeMode,
  onRuntimeMode,
  onBackToTray,
  headingRef,
  showRuntime,
}: {
  bubble: AppBubble;
  runtime: BubbleRuntime;
  runtimeMode: RuntimeMode;
  onRuntimeMode: (mode: RuntimeMode) => void;
  onBackToTray: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  showRuntime: boolean;
}) {
  const t = useAppText();
  const modes: { value: RuntimeMode; key: "app.runtimeAuto" | "app.runtimeDevice" | "app.runtimeApi" }[] = [
    { value: "auto", key: "app.runtimeAuto" },
    { value: "device", key: "app.runtimeDevice" },
    { value: "yazhi-api", key: "app.runtimeApi" },
  ];
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBackToTray}
            className="shrink-0 rounded-full border border-ivory/15 px-3 py-1.5 text-xs text-ivory-dim hover:border-ivory/40 hover:text-ivory"
          >
            ← {t("app.backToTray")}
          </button>
          <h1 ref={headingRef} tabIndex={-1} className="truncate font-display text-xl font-semibold focus:outline-none">
            {bubble.taName ?? bubble.name}
            {bubble.taName && <span className="ml-2 text-sm font-normal text-ivory-dim">{bubble.name}</span>}
          </h1>
        </div>
        {showRuntime && (
          <fieldset className="flex items-center gap-1 rounded-full border border-ivory/15 p-0.5">
            <legend className="sr-only">{t("app.runtimeGroup")}</legend>
            {modes.map((m) => {
              const checked = runtimeMode === m.value;
              return (
                <label
                  key={m.value}
                  title={m.value === "auto" ? t("app.runtimeHintAuto") : m.value === "device" ? t("app.runtimeHintDevice") : t("app.runtimeHintApi")}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                    checked ? "bg-ivory text-night" : "text-ivory-dim hover:text-ivory"
                  }`}
                >
                  <input type="radio" name="app-runtime" className="sr-only" checked={checked} onChange={() => onRuntimeMode(m.value)} />
                  {t(m.key)}
                </label>
              );
            })}
            <span className="px-2 text-[11px] text-ivory-dim" title={t("app.runtimeHintAuto")}>
              · {runtime === "device" ? t("app.runtimeDevice") : t("app.runtimeApi")}
            </span>
          </fieldset>
        )}
      </header>
      <p className="text-xs text-ivory-dim">{bubble.summaryTa ?? bubble.summary}</p>
    </>
  );
}

/* ── notes ───────────────────────────────────────────────────────────── */

function CircleNote() {
  const t = useAppText();
  return <p className="rounded-xl border border-ivory/15 bg-ivory/5 px-3 py-2 text-xs text-ivory-dim">{t("app.needSession")}</p>;
}

function RunErrorNote({ error }: { error: RunError }) {
  const t = useAppText();
  const text =
    error.kind === "session" ? t("app.needSession") : error.kind === "unconfigured" ? t("app.notConfigured") : t("app.errorStart");
  return (
    <div role="note" className="rounded-xl border border-palai/40 bg-palai/5 p-3 text-sm">
      <p className="text-ivory">{text}</p>
      {error.message && error.message !== text && <p className="mt-1 break-words text-xs text-ivory-dim">{error.message}</p>}
    </div>
  );
}
