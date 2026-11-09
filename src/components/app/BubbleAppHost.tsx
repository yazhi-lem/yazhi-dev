"use client";
/** <BubbleAppHost> — "an app is a set of bubbles in one host".

    State machine:   tray  →  one bubble selected  →  its thread
    URL state:       /app?b=<bubble>&ws=<workspace>&t=<thread>&q=<question…>

      b   the selected bubble's slug (`tpl.avai`, `yazhi.pulavar`, `ws.guru`)
      ws  a workspace whose real screen is mounted in the canvas (`/app?ws=guru`)
      t   a thread id — "new" means a freshly started conversation
      q   the questions in the thread (repeated, at most MAX_LINK_TURNS kept)

    Every transition writes the URL, which gives back/forward for free; the
    server page reads the same parameters and hands them in as props, so a
    deep link, a reload and a history step all restore the same screen.

    Server output vs first client output: everything below starts from the SSR
    props and touches `window` only inside effects, so React hydrates
    identical markup. The canvas builds its thread with the same pure
    functions the server used (`seedTurns` / `linkTurns`), so the first client
    render is byte-identical to the server's HTML — no `mounted` flag, no
    thread that blinks away and comes back.

    Keyboard (also in the closed keyboard map; docs/APP.md carries the table):
      ↑ ↓ ← →   roving tabindex inside the tray (Enter or Space opens)
      /         the composer
      [  ]      previous / next bubble
      Esc       back to the tray (from the composer: out of it first)
      ?         the keyboard map */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { BubbleManifestV1 } from "@yazhi/bubble";
import { APP_BUBBLES, CYCLE_BUBBLES, DEFAULT_BUBBLE_SLUG, type AppBubble, type LanguageFilter } from "./bubbles";
import { AppCanvas } from "./AppCanvas";
import { AppChrome } from "./AppChrome";
import { BubbleLauncher } from "./BubbleLauncher";
import { KeyboardMap } from "./KeyboardMap";
import { useCircleSession } from "@/components/circle/CircleProvider";
import { useAppText } from "./useAppText";
import { MAX_LINK_TURNS, runManifest, type BubbleRunHistory } from "./useAppRun";
import type { ComposerHandle } from "@yazhi/bubble/host";

export interface InitialThread {
  /** the thread id in the URL; "new" for a fresh conversation */
  id: string;
  /** the bubble it belongs to */
  bubble: string;
  /** the questions asked in it, oldest first */
  questions: string[];
  /** `true` when the thread came from a link (`?q=`), not from a seed */
  fromLink?: boolean;
}

export interface AppHostProps {
  /** `?b` resolved on the server */
  initialBubbleSlug: string;
  /** `?ws` — a workspace id whose screen the canvas mounts */
  initialWorkspace?: string;
  /** `?t` — "new", or a thread id */
  initialThreadId: string;
  initialThread: InitialThread;
  /** bubbles the registry published (published + public), merged into the tray */
  registry: BubbleManifestV1[];
  /** a Circle session exists — read from the provider after mount, never
      during render, so the first client render equals the server's */
  circleReady?: boolean;
}

export type { BubbleRunHistory };

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return el.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/** Built-in bubbles first, then whatever the registry published. A registry
    bubble that shares a built-in's id is dropped: the built-in is the one
    the tray, the deep links and the starter questions already know. */
export function withRegistry(registry: BubbleManifestV1[]): AppBubble[] {
  const seen = new Set(APP_BUBBLES.map((b) => b.slug));
  const extra: AppBubble[] = [];
  for (const manifest of registry) {
    if (!manifest || seen.has(manifest.id)) continue;
    seen.add(manifest.id);
    extra.push({
      slug: manifest.id,
      kind: "agent",
      name: manifest.name,
      taName: manifest.taName,
      accent: manifest.accent,
      size: manifest.size,
      tinai: "mullai",
      languages: manifest.languages?.length ? manifest.languages : ["ta"],
      summary: manifest.description,
      action: "run",
      // the registry speaks v1; the frozen run route validates v0. Permission
      // rule is the route's: declare "yazhi-api" only when that is where the
      // bubble runs, and let runManifest() normalise the package once more.
      manifest: runManifest({
        ...manifest,
        schema: "yazhi.bubble/v0",
        permissions: manifest.runtime?.prefer === "yazhi-api" ? ["yazhi-api", "clipboard"] : ["clipboard"],
      }),
      seed: [{ role: "assistant", content: manifest.agent.greeting }],
      starters: [],
    });
  }
  return [...APP_BUBBLES, ...extra];
}

/** "new" or the id of a thread the person has not typed into yet. */
function isFresh(id: string | undefined): boolean {
  return !id || id === "new";
}

export function BubbleAppHost({
  initialBubbleSlug,
  initialWorkspace,
  initialThreadId,
  initialThread,
  registry,
  circleReady: circleReadyProp = false,
}: AppHostProps) {
  const t = useAppText();
  const router = useRouter();
  const bubbles = useMemo(() => withRegistry(registry), [registry]);
  const bySlug = useMemo(() => Object.fromEntries(bubbles.map((b) => [b.slug, b])) as Record<string, AppBubble>, [bubbles]);

  const [selected, setSelected] = useState<string>(initialBubbleSlug);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(initialWorkspace);
  const [threadId, setThreadId] = useState<string>(initialThreadId);
  const [questionList, setQuestionList] = useState<string[]>(initialThread.questions);
  const [linkThread, setLinkThread] = useState<boolean>(Boolean(initialThread.fromLink));
  const [filter, setFilter] = useState<LanguageFilter>("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [histories, setHistories] = useState<Record<string, BubbleRunHistory>>({});

  const active = bySlug[selected] ?? bySlug[initialBubbleSlug] ?? bubbles[0];
  const cycle = useMemo(
    () => CYCLE_BUBBLES.filter((b) => bySlug[b.slug] || b.slug === DEFAULT_BUBBLE_SLUG),
    [bySlug]
  );

  /* ── refs ─────────────────────────────────────────────────────────── */
  const trayRef = useRef<HTMLElement>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  /** The one place `/app` speaks to a screen reader mid-page. The canvas
      owns "a reply finished"; the host owns navigation. Each call replaces
      the text (never appends), so nothing is announced twice. */
  const announce = useCallback((message: string) => {
    const node = liveRef.current;
    if (!node) return;
    // clear first, then set on the next frame: a screen reader announces a
    // change, and two identical completions in a row are still two events
    node.textContent = "";
    window.requestAnimationFrame(() => {
      if (liveRef.current) liveRef.current.textContent = message;
    });
  }, []);

  /* ── URL ← state ─────────────────────────────────────────────────────
     push = a new history entry (a place a person chose); replace = the same
     screen with more detail (a question added, a run finished). */
  const writeUrl = useCallback(
    (
      next: {
        bubble?: string;
        /** `null` = leave the workspace; `undefined` = keep it */
        workspace?: string | null;
        thread?: string;
        questions?: string[];
      },
      mode: "push" | "replace"
    ) => {
      const params = new URLSearchParams();
      const b = next.bubble ?? selected;
      const ws = next.workspace === undefined ? workspaceId : next.workspace ?? undefined;
      const th = next.thread ?? threadId;
      const qs = next.questions ?? questionList;
      if (b && b !== DEFAULT_BUBBLE_SLUG) params.set("b", b);
      if (ws) params.set("ws", ws);
      if (!isFresh(th)) {
        params.set("t", th);
        for (const q of qs.slice(-MAX_LINK_TURNS)) params.set("q", q);
      }
      const href = params.toString() ? `/app?${params.toString()}` : "/app";
      if (mode === "push") router.push(href, { scroll: false });
      else router.replace(href, { scroll: false });
    },
    [router, selected, workspaceId, threadId, questionList]
  );

  /* ── URL → state, when the browser goes back / forward ────────────── */
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const b = params.get("b");
      const ws = params.get("ws");
      const th = params.get("t");
      const qs = params.getAll("q");
      setWorkspaceId(ws ?? undefined);
      setSelected(b ?? (ws ? `ws.${ws}` : DEFAULT_BUBBLE_SLUG));
      setThreadId(th ?? "new");
      setQuestionList(qs);
      setLinkThread(qs.length > 0);
    };
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  /* ── selection ────────────────────────────────────────────────────── */
  const focusInTray = useCallback((slug: string) => {
    const node = trayRef.current;
    if (!node) return;
    const options = Array.from(node.querySelectorAll<HTMLElement>('[role="radio"]'));
    const target = options.find((el) => el.dataset.slug === slug) ?? options[0];
    target?.focus();
  }, []);

  const select = useCallback(
    (bubble: AppBubble, options: { push?: boolean; focus?: boolean } = {}) => {
      const workspace = bubble.kind === "workspace" ? bubble.slug.replace(/^ws\./, "") : null;
      setSelected(bubble.slug);
      setWorkspaceId(workspace ?? undefined);
      setThreadId("new");
      setQuestionList([]);
      setLinkThread(false);
      writeUrl({ bubble: bubble.slug, workspace, thread: "new", questions: [] }, options.push === false ? "replace" : "push");
      if (options.focus !== false) requestAnimationFrame(() => headingRef.current?.focus());
    },
    [writeUrl]
  );

  const backToTray = useCallback(() => {
    setWorkspaceId(undefined);
    setSelected(DEFAULT_BUBBLE_SLUG);
    setThreadId("new");
    setQuestionList([]);
    setLinkThread(false);
    router.push("/app", { scroll: false });
    requestAnimationFrame(() => focusInTray(selected));
  }, [focusInTray, router, selected]);

  const cycleBy = useCallback(
    (step: 1 | -1) => {
      const i = cycle.findIndex((b) => b.slug === selected);
      const next = cycle[(Math.max(0, i) + step + cycle.length) % cycle.length];
      if (!next) return;
      select(next, { focus: false });
      requestAnimationFrame(() => focusInTray(next.slug));
    },
    [cycle, selected, select, focusInTray]
  );

  /** The canvas tells the host a thread grew, so every question lands in the
      address bar — and so a reload, a bookmark and a paste to someone else
      restore the thread. This rewrites the URL from the values it is handed
      rather than from the host's state, which is about to be replaced. */
  const rememberQuestions = useCallback(
    (bubble: AppBubble, id: string, questions: string[]) => {
      setThreadId(id);
      setQuestionList(questions);
      setLinkThread(false);
      const params = new URLSearchParams();
      if (bubble.slug !== DEFAULT_BUBBLE_SLUG) params.set("b", bubble.slug);
      if (!isFresh(id)) {
        params.set("t", id);
        for (const q of questions.slice(-MAX_LINK_TURNS)) params.set("q", q);
      }
      router.replace(`/app?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  /* ── the keyboard map ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // modified shortcuts belong to the browser
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = isTyping(e.target);

      if (e.key === "?" && !typing) {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        if (helpOpen) {
          e.preventDefault();
          setHelpOpen(false);
          return;
        }
        if (typing && document.activeElement?.closest("form")?.querySelector("input") === document.activeElement) {
          // first Esc leaves the composer — what the map says
          composerRef.current?.blur();
          e.preventDefault();
          return;
        }
        if (typing) return;
        e.preventDefault();
        backToTray();
        announce(t("app.announceTray"));
        return;
      }
      if (e.key === "/" && !typing) {
        const composer = composerRef.current;
        if (!composer) return;
        e.preventDefault();
        composer.focus();
        return;
      }
      if ((e.key === "[" || e.key === "]") && !typing) {
        e.preventDefault();
        cycleBy(e.key === "]" ? 1 : -1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [announce, backToTray, cycleBy, helpOpen, t]);

  /* ── roving tabindex in the tray ──────────────────────────────────── */
  const onTrayKeyDown = useCallback((e: ReactKeyboardEvent<HTMLElement>) => {
    const arrows = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!arrows.includes(e.key)) return;
    const node = trayRef.current;
    if (!node) return;
    const options = Array.from(node.querySelectorAll<HTMLElement>('[role="radio"]'));
    if (!options.length) return;
    const current = options.indexOf(document.activeElement as HTMLElement);
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? options.length - 1
          : (Math.max(0, current) + (forward ? 1 : -1) + options.length) % options.length;
    e.preventDefault();
    options[next].focus();
  }, []);

  const history = histories[active.slug];

  // the Circle session is a browser fact: read it after mount (the provider
  // starts at "loading" on both sides, so the first render still matches),
  // and treat "not known yet" as not-ready rather than as signed-out
  const { state: circleState } = useCircleSession();
  const circleReady = circleReadyProp || circleState.status === "signed-in";

  return (
    <AppChrome>
    <div className="min-h-dvh bg-night text-ivory">
      <a
        href="#app-canvas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        {t("app.skip")}
      </a>

      {/* the only live region on the page: one deliberate update per event */}
      <div ref={liveRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

      <div className="mx-auto flex max-w-[96rem] flex-col gap-4 px-3 pb-8 pt-3 md:flex-row md:items-start md:gap-6 md:px-6">
        <BubbleLauncher
          trayRef={trayRef}
          bubbles={bubbles}
          activeSlug={active.slug}
          filter={filter}
          onFilter={setFilter}
          onOpen={(slug) => {
            const bubble = bySlug[slug];
            if (bubble) select(bubble, { focus: false });
          }}
          onKeyDown={onTrayKeyDown}
          onHelp={() => setHelpOpen(true)}
        />

        <main id="app-canvas" className="min-w-0 flex-1" aria-label={t("app.canvasLabel")}>
          <AppCanvas
            bubble={active}
            workspaceId={workspaceId}
            threadId={threadId}
            questions={questionList}
            fromLink={linkThread}
            circleReady={circleReady}
            history={history}
            composerRef={composerRef}
            headingRef={headingRef}
            onHistory={(next) => setHistories((all) => ({ ...all, [active.slug]: next }))}
            onThreadGrew={(id, questions) => rememberQuestions(active, id, questions)}
            onAnnounce={announce}
            onBackToTray={backToTray}
          />
        </main>
      </div>

      {helpOpen && (
        <KeyboardMap
          onClose={() => setHelpOpen(false)}
          items={[
            { keys: "↑ ↓ ← →", text: t("app.keyRoving") },
            { keys: "/", text: t("app.keySlash") },
            { keys: "[  ]", text: t("app.keyCycle") },
            { keys: "Esc", text: t("app.keyEsc") },
            { keys: "?", text: t("app.keyQuestion") },
            { keys: "Enter", text: t("app.keyEnter") },
          ]}
        />
      )}
    </div>
    </AppChrome>
  );
}
