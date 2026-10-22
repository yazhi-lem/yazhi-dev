"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Markdown } from "@/components/chat/Markdown";
import { useWsLang, WsLangToggle, type WsKey } from "@/lib/workspace/i18n";
import { AuthRequired, WsError, type Envelope, type WsMessage, type WsSession } from "@/lib/workspace/types";

export interface Chip {
  label: string;
  /** what the user bubble says when the chip is tapped */
  say: string;
  run: () => Promise<Omit<WsMessage, "id" | "role">>;
}

let n = 0;
const uid = () => `m${Date.now().toString(36)}${(n++).toString(36)}`;

const DEMO_TENANT: Record<WsSession["kind"], string> = { legal: "demo-lawfirm-hyd", health: "demo-clinic-hyd" };

function DemoTag({ meta }: { meta: Envelope }) {
  const { t } = useWsLang();
  if (!meta.demo) return null;
  return <p className="mt-2 text-[11px] uppercase tracking-wide text-ivory-dim/60" title={meta.demo_notice ?? ""}>{t("chat.demoTag")}</p>;
}

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
  const { t } = useWsLang();
  return (
    <div className="mx-auto mt-24 w-full max-w-md px-6 text-center">
      <p className="text-lg font-semibold">{t("auth.title")}</p>
      <p className="mt-3 text-sm leading-relaxed text-ivory-dim">{t(`auth.body.${kind}`)}</p>
      {loading ? null : demoLogin ? (
        <button type="button" onClick={onLogin} className={`${primaryBtn} mt-6`} data-testid="demo-login">
          {t("auth.demo")}
        </button>
      ) : (
        <p className="mt-6 text-xs text-ivory-dim">{t("auth.unavailable")}</p>
      )}
    </div>
  );
}

export function WorkspaceChat({
  kind,
  chips,
  onText,
  renderForm,
}: {
  kind: WsSession["kind"];
  chips: Chip[];
  onText: (text: string) => Promise<Omit<WsMessage, "id" | "role">>;
  renderForm: (form: NonNullable<WsMessage["form"]>, reply: (say: string, run: Chip["run"]) => void) => ReactNode;
}) {
  const { t } = useWsLang();
  const [messages, setMessages] = useState<WsMessage[]>([]);
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
      const err = e instanceof WsError ? e : new WsError("unavailable");
      const ref = err.ref ? ` (${t("err.ref")} ${err.ref})` : "";
      setMessages((m) => [...m, { id: uid(), role: "assistant", error: true, content: `⚠️ ${t(`err.${err.code}` as WsKey)}${ref}` }]);
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    const v = text.trim();
    if (!v) return;
    setText("");
    exchange(v, () => onText(v));
  };

  const all: WsMessage[] = [{ id: "g", role: "assistant", content: t(`${kind}.greeting`) }, ...messages];

  return (
    <div className="flex h-dvh flex-col bg-night text-ivory">
      <header className="flex items-center justify-between gap-3 border-b border-ivory/5 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-lg font-black text-gold">யாழி</Link>
          <span className="h-5 w-px bg-ivory/15" />
          <h1 className="text-base font-semibold">{t(`app.${kind}`)}</h1>
        </div>
        <nav className="flex items-center gap-4 text-xs">
          {signedIn && (
            <span className="hidden items-center gap-3 text-ivory-dim sm:flex" data-testid="tenant">
              {t(`tenant.${auth.session!.tenant}` as WsKey) ?? auth.session!.name}
              <button type="button" onClick={auth.logout} className="text-gold hover:underline">{t("auth.signout")}</button>
            </span>
          )}
          <WsLangToggle />
        </nav>
      </header>

      <main className="chat-scroll flex-1 overflow-y-auto" data-lenis-prevent>
        {!signedIn ? (
          <SignInGate kind={kind} demoLogin={auth.demoLogin} loading={auth.loading} onLogin={() => auth.login(DEMO_TENANT[kind])} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12 sm:px-8">
            {all.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gold/10 px-4 py-2.5" aria-label={t("chat.you")}>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-semibold text-night">య</span>
                  <div className={`min-w-0 max-w-[90%] rounded-2xl rounded-tl-sm px-4 py-3 ${m.error ? "bg-red-400/10" : "bg-night-2/70"}`}>
                    {m.form ? renderForm(m.form, exchange) : <Markdown>{m.content}</Markdown>}
                    {m.meta && <DemoTag meta={m.meta} />}
                  </div>
                </div>
              )
            )}
            {busy && (
              <div className="flex gap-3 text-sm text-ivory-dim">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs text-night">య</span>
                <span className="animate-pulse">{t("chat.thinking")}</span>
              </div>
            )}
            <div ref={bottom} />
          </div>
        )}
      </main>

      {signedIn && (
        <div className="bg-night">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 pb-6 pt-2 sm:px-8">
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c.label} type="button" disabled={busy} onClick={() => exchange(c.say, c.run)}
                  className="rounded-full border border-ivory/10 px-3 py-1 text-xs text-ivory-dim transition hover:border-gold hover:text-gold disabled:opacity-40">
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-2xl border border-ivory/15 bg-night-2/80 px-3 py-2 focus-within:border-gold/60">
              <textarea rows={1} value={text} placeholder={t(`${kind}.placeholder`)} aria-label={t("chat.message")}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                className="max-h-[160px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-ivory placeholder:text-ivory-dim/50 focus:outline-none" />
              <button type="button" onClick={send} disabled={!text.trim() || busy} aria-label={t("chat.send")}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-night disabled:opacity-30">↑</button>
            </div>
            <p className="text-center text-[11px] text-ivory-dim/60">{t("chat.footer")}</p>
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
