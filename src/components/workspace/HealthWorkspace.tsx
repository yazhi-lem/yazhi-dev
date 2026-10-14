"use client";
import { useState } from "react";
import { useWsLang, type WsKey, type WsLang } from "@/lib/workspace/i18n";
import { callApi, type Envelope } from "@/lib/workspace/types";
import { WorkspaceChat, field, primaryBtn, type Chip } from "./WorkspaceChat";

interface Rec { id: string; name: string; age: number; sex: string; diagnosis: string; last_visit: string; status: string }
type Intake = Envelope & { record: Rec; triage: string; doctor_summary_en: string };
type Explain = Envelope & { explanation: string };
type Records = Envelope & { records: Rec[] };

const SAMPLE_RX = `Dx: Essential hypertension, Type 2 DM.
Tab Amlodipine 5mg 1-0-0 x 30 days
Tab Metformin 500mg 1-0-1 after food x 30 days
Low salt diet. Review after 2 weeks with FBS, PPBS.`;

const explain = (lang: WsLang) => async (note: string) => {
  const r = await callApi<Explain>("health.explain", { note, lang });
  return { content: r.explanation.replace(/\n/g, "  \n"), meta: r };
};

function IntakeForm({ reply }: { reply: (say: string, run: Chip["run"]) => void }) {
  const { t, lang } = useWsLang();
  const [name, setName] = useState(t("intake.default.name"));
  const [age, setAge] = useState(54);
  const [sex, setSex] = useState<"female" | "male" | "other">("female");
  const [phone, setPhone] = useState("+91 90000 00000");
  const [complaint, setComplaint] = useState(t("intake.default.complaint"));
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid gap-3 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        reply(`${t("intake.say")}: ${name}, ${age}`, async () => {
          const r = await callApi<Intake>("health.intake", { name, age, sex, phone, complaint, consent, lang });
          return {
            content: `✅ ${t("intake.done")} — **${r.record.id}**\n\n**${t("intake.triage")}:** ${r.triage}\n\n**${t("intake.doctor")}:** ${r.doctor_summary_en}`,
            meta: r,
          };
        });
      }}
    >
      <p className="font-semibold">{t("intake.title")}</p>
      <label>{t("intake.name")}<input className={field} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="grid grid-cols-3 gap-3">
        <label>{t("intake.age")}<input className={field} type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} /></label>
        <label>{t("intake.sex")}
          <select className={field} value={sex} onChange={(e) => setSex(e.target.value as typeof sex)}>
            {(["female", "male", "other"] as const).map((s) => <option key={s} value={s}>{t(`intake.sex.${s}` as WsKey)}</option>)}
          </select>
        </label>
        <label>{t("intake.phone")}<input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
      </div>
      <label>{t("intake.complaint")}<textarea className={field} rows={3} value={complaint} onChange={(e) => setComplaint(e.target.value)} /></label>
      <label className="flex items-start gap-2 text-xs text-ivory-dim">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        {t("intake.consent")}
      </label>
      <button className={primaryBtn} disabled={sent}>{sent ? t("intake.sent") : t("intake.submit")}</button>
    </form>
  );
}

export function HealthWorkspace() {
  const { t, lang } = useWsLang();
  const ex = explain(lang);
  const records = (q?: string) => async () => {
    const r = await callApi<Records>("health.records", { ...(q ? { q } : {}), lang });
    const head = `| ${t("records.id")} | ${t("records.name")} | ${t("records.age")} | ${t("records.dx")} | ${t("records.visit")} | ${t("records.status")} |\n|---|---|---|---|---|---|`;
    const rows = r.records.map((x) => `| ${x.id} | ${x.name} | ${x.age} | ${x.diagnosis} | ${x.last_visit} | ${x.status} |`).join("\n");
    return { content: `**${t("records.title")}** (${r.records.length})\n\n${head}\n${rows}`, meta: r };
  };
  const chips: Chip[] = [
    { label: t("health.chip.intake"), say: t("health.q.intake"), run: async () => ({ content: "", form: "intake" }) },
    { label: t("health.chip.explain"), say: `${t("health.q.explain")}\n${SAMPLE_RX}`, run: () => ex(SAMPLE_RX) },
    { label: t("health.chip.records"), say: t("health.q.records"), run: records() },
    { label: t("health.chip.search"), say: t("health.q.search"), run: records("లక్ష్మి") },
  ];
  return <WorkspaceChat kind="health" chips={chips} onText={ex} renderForm={(_, reply) => <IntakeForm key={lang} reply={reply} />} />;
}
