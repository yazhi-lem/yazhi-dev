"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Markdown } from "@/components/chat/Markdown";
import { AuthRequired, type Envelope, type WsMessage, type WsSession } from "@/lib/workspace/types";

export interface Chip {
  label: string;
  /** what the user bubble says when the chip is tapped */
  say: string;
  run: () => Promise<Omit<WsMessage, "id" | "role">>;
}

let n = 0;
const uid = () => `m${Date.now().toString(36)}${(n++).toString(36)}`;

function Badges({ meta }: { meta: Envelope }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
      {meta.demo ? (
        <span className="rounded-full border border-gold/50 bg-gold/15 px-2 py-0.5 font-semibold text-gold" title={meta.demo_notice ?? ""}>
          {meta.demo_notice?.startsWith("DEMO") ? meta.demo_notice : `DEMO DATA · ${meta.demo_notice ?? "canned sample"}`}
        </span>
      ) : (
        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
          Yazhi model · on-prem
        </span>
      )}
      <span className="rounded-full border border-ivory/15 px-2 py-0.5 text-ivory-dim">{meta.disclaimer}</span>
    </div>
  );
}

const DEMO_TENANT: Record<WsSession["kind"], string> = { legal: "demo-lawfirm-hyd", health: "demo-clinic-hyd" };

function useSession() {
  const [state, setState] = useState<{ loading: boolean; session: WsSession | null; demoLogin: boolean }>({
    loading: true, session: null, demoLogin: false,
  });
  const refresh = () =>
    fetch("/api/workspace/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setState({ loading: false, session: j.session, demoLogin: !!j.demoLogin }))
      .catch(() => setState({ loading: false, session: null, demoLogin: false }));
  useEffect(() => {
    refresh();
  }, []);
  const login = async (tenant: string) => {
    await fetch("/api/workspace/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tenant }) });
    await refresh();
  };
  const logout = async () => {
    await fetch("/api/workspace/session", { method: "DELETE" });
    await refresh();
  };
  return { ...state, login, logout, expire: () => setState((s) => ({ ...s, session: null })) };
}

function SignInGate({ kind, demoLogin, onLogin, loading }: { kind: WsSession["kind"]; demoLogin: boolean; onLogin: () => void; loading: boolean }) {
  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-2xl border border-ivory/10 bg-night-2/80 p-6 text-center">
      <p className="text-lg font-semibold">🔐 సైన్ ఇన్ అవసరం · Sign in required</p>
      <p className="mt-2 text-sm text-ivory-dim">
        {kind === "health" ? "క్లినిక్" : "న్యాయ సంస్థ"} ఖాతాతో సైన్ ఇన్ చేయండి. Records are visible only within your {kind === "health" ? "clinic" : "firm"}.
      </p>
      {loading ? null : demoLogin ? (
        <button type="button" onClick={onLogin} className={`${primaryBtn} mt-4`}>
          డెమో {kind === "health" ? "క్లినిక్" : "సంస్థ"}గా ప్రవేశించండి · Demo sign-in (fictional tenant)
        </button>
      ) : (
        <p className="mt-4 text-xs text-ivory-dim">Sign-in is not configured on this deployment.</p>
      )}
    </div>
  );
}

export function WorkspaceChat({
  kind,
  title,
  teTitle,
  accent,
  greeting,
  chips,
  onText,
  renderForm,
  placeholder,
}: {
  kind: WsSession["kind"];
  title: string;
  teTitle: string;
  accent: string;
  greeting: string;
  chips: Chip[];
  onText: (text: string) => Promise<Omit<WsMessage, "id" | "role">>;
  renderForm: (form: NonNullable<WsMessage["form"]>, reply: (say: string, run: Chip["run"]) => void) => ReactNode;
  placeholder: string;
}) {
  const [messages, setMessages] = useState<WsMessage[]>([{ id: "g", role: "assistant", content: greeting }]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const auth = useSession();
  const signedIn = auth.session?.kind === kind;
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const exchange = async (say: string, run: Chip["run"]) => {
    if (busy) return;
    setMessages((m) => [...m, { id: uid(), role: "user", content: say }]);
    setBusy(true);
    try {
      const out = await run();
      setMessages((m) => [...m, { id: uid(), role: "assistant", ...out }]);
    } catch (e) {
      if (e instanceof AuthRequired) {
        auth.expire();
        return;
      }
      setMessages((m) => [...m, { id: uid(), role: "assistant", error: true, content: `⚠️ ${(e as Error).message}` }]);
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    exchange(t, () => onText(t));
  };

  return (
    <div className="te-workspace flex h-dvh flex-col bg-night text-ivory">
      <header className="flex items-center justify-between gap-3 border-b border-ivory/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-lg font-black text-gold">யாழி</Link>
          <span className="h-5 w-px bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <h1 className="text-base font-semibold">
            {teTitle} <span className="text-sm font-normal text-ivory-dim">· {title}</span>
          </h1>
        </div>
        <nav className="flex items-center gap-1.5 text-xs">
          {signedIn && (
            <span className="hidden items-center gap-2 rounded-full border border-ivory/15 bg-night-2 px-3 py-1 text-ivory-dim sm:flex" data-testid="tenant">
              🏷️ {auth.session!.name}
              <button type="button" onClick={auth.logout} className="text-gold hover:underline">sign out</button>
            </span>
          )}
          <Link href="/workspaces/legal" className="rounded-lg border border-gold/40 px-3 py-1.5 text-gold hover:bg-gold hover:text-night">⚖️ న్యాయ</Link>
          <Link href="/workspaces/health" className="rounded-lg border border-gold/40 px-3 py-1.5 text-gold hover:bg-gold hover:text-night">🩺 ఆరోగ్యం</Link>
        </nav>
      </header>
      <div className="border-b border-gold/20 bg-gold/10 px-4 py-1.5 text-center text-[11px] text-gold">
        🇮🇳 డేటా భారతదేశంలోనే · Data stays in India (on-prem / India-hosted yazhi-api) · DPDP Act 2023 consent & audit ·
        Pilot demo — sample names, cases and records are fictional
      </div>

      <main className="chat-scroll flex-1 overflow-y-auto" data-lenis-prevent>
        {!signedIn ? (
          <SignInGate kind={kind} demoLogin={auth.demoLogin} loading={auth.loading} onLogin={() => auth.login(DEMO_TENANT[kind])} />
        ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end gap-3">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gold/15 px-4 py-2.5">
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                </div>
                <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ivory/10 text-xs text-ivory-dim">మీరు</span>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-night" style={{ backgroundColor: accent }}>య</span>
                <div className={`min-w-0 max-w-[90%] rounded-2xl rounded-tl-sm border px-4 py-3 ${m.error ? "border-red-400/40 bg-red-400/10" : "border-ivory/10 bg-night-2/80"}`}>
                  {m.form ? renderForm(m.form, exchange) : <Markdown>{m.content}</Markdown>}
                  {m.meta && <Badges meta={m.meta} />}
                </div>
              </div>
            )
          )}
          {busy && (
            <div className="flex gap-3 text-sm text-ivory-dim">
              <span className="grid h-7 w-7 place-items-center rounded-full text-xs text-night" style={{ backgroundColor: accent }}>య</span>
              <span className="animate-pulse">Yazhi ఆలోచిస్తోంది…</span>
            </div>
          )}
          <div ref={bottom} />
        </div>
        )}
      </main>

      {signedIn && (
      <div className="border-t border-ivory/10 bg-night/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c.label} type="button" disabled={busy} onClick={() => exchange(c.say, c.run)}
                className="rounded-full border border-ivory/15 bg-night-2 px-3 py-1 text-xs text-ivory-dim transition hover:border-gold hover:text-gold disabled:opacity-40">
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2 rounded-2xl border border-ivory/15 bg-night-2/80 px-3 py-2 focus-within:border-gold/60">
            <textarea rows={1} value={text} placeholder={placeholder} aria-label="Message"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              className="max-h-[160px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-ivory placeholder:text-ivory-dim/50 focus:outline-none" />
            <button type="button" onClick={send} disabled={!text.trim() || busy} aria-label="Send"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-night disabled:opacity-30">↑</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export const field =
  "w-full rounded-lg border border-ivory/15 bg-night px-3 py-2 text-sm text-ivory focus:border-gold/60 focus:outline-none";
export const primaryBtn =
  "rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-night transition hover:bg-bronze hover:text-ivory disabled:opacity-40";
