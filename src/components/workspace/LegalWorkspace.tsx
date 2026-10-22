"use client";
import { useState } from "react";
import { useWsLang, type WsLang } from "@/lib/workspace/i18n";
import { callApi, type Envelope } from "@/lib/workspace/types";
import { WorkspaceChat, field, primaryBtn, type Chip } from "./WorkspaceChat";

type Ask = Envelope & { answer: string; citations: string[] };
type Summary = Envelope & { title: string; summary: string; next_hearing?: string; risks: string[] };
type Draft = Envelope & { title: string; body: string };

const ask = (lang: WsLang) => async (question: string) => {
  const r = await callApi<Ask>("legal.ask", { question, lang });
  const cites = r.citations.length ? `\n\n📚 ${r.citations.join(" · ")}` : "";
  return { content: r.answer + cites, meta: r };
};

function DraftForm({ reply }: { reply: (say: string, run: Chip["run"]) => void }) {
  const { t, lang } = useWsLang();
  const [kind, setKind] = useState<"cheque_bounce_notice" | "name_change_affidavit">("cheque_bounce_notice");
  const [client, setClient] = useState(t("draft.default.client"));
  const [other, setOther] = useState(t("draft.default.other"));
  const [amount, setAmount] = useState("2,50,000");
  const [oldName, setOldName] = useState(t("draft.default.old"));
  const [sent, setSent] = useState(false);
  const notice = kind === "cheque_bounce_notice";
  return (
    <form
      className="grid gap-3 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        reply(`${t(notice ? "draft.say.notice" : "draft.say.affidavit")} — ${client}`, async () => {
          const r = await callApi<Draft>("legal.draft", {
            kind, client_name: client, other_party: notice ? other : undefined,
            amount: notice ? amount : undefined, old_name: notice ? undefined : oldName, lang,
          });
          return { content: `**${r.title}**\n\n${r.body.split("\n").map((l) => `> ${l}`).join("  \n")}`, meta: r };
        });
      }}
    >
      <p className="font-semibold">{t("draft.title")}</p>
      <label>{t("draft.type")}
        <select className={field} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="cheque_bounce_notice">{t("draft.kind.notice")}</option>
          <option value="name_change_affidavit">{t("draft.kind.affidavit")}</option>
        </select>
      </label>
      <label>{t("draft.client")}<input className={field} value={client} onChange={(e) => setClient(e.target.value)} /></label>
      {notice ? (
        <div className="grid grid-cols-2 gap-3">
          <label>{t("draft.other")}<input className={field} value={other} onChange={(e) => setOther(e.target.value)} /></label>
          <label>{t("draft.amount")}<input className={field} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        </div>
      ) : (
        <label>{t("draft.oldName")}<input className={field} value={oldName} onChange={(e) => setOldName(e.target.value)} /></label>
      )}
      <button className={primaryBtn} disabled={sent}>{sent ? t("draft.sent") : t("draft.submit")}</button>
    </form>
  );
}

export function LegalWorkspace() {
  const { t, lang } = useWsLang();
  const a = ask(lang);
  const chips: Chip[] = [
    { label: t("legal.chip.cheque"), say: t("legal.q.cheque"), run: () => a(t("legal.q.cheque")) },
    { label: t("legal.chip.tenant"), say: t("legal.q.tenant"), run: () => a(t("legal.q.tenant")) },
    {
      label: t("legal.chip.summary"), say: t("legal.q.summary"),
      run: async () => {
        const r = await callApi<Summary>("legal.summary", { sample_id: "os-123-2026", lang });
        const risks = r.risks.map((x) => `- ⚠️ ${x}`).join("\n");
        return { content: `**${r.title}**\n\n${r.summary.replace(/\n/g, "  \n")}\n\n**${t("legal.nextHearing")}:** ${r.next_hearing ?? "—"}\n\n${risks}`, meta: r };
      },
    },
    { label: t("legal.chip.draft"), say: t("legal.q.draft"), run: async () => ({ content: "", form: "draft" }) },
  ];
  return <WorkspaceChat kind="legal" chips={chips} onText={a} renderForm={(_, reply) => <DraftForm reply={reply} />} />;
}
