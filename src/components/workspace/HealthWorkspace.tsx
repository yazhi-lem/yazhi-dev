"use client";
import { useState } from "react";
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

const explain = async (note: string) => {
  const r = await callApi<Explain>("health.explain", { note });
  return { content: r.explanation.replace(/\n/g, "  \n"), meta: r };
};

const records = (q?: string) => async () => {
  const r = await callApi<Records>("health.records", q ? { q } : undefined);
  const rows = r.records.map((x) => `| ${x.id} | ${x.name} | ${x.age} | ${x.diagnosis} | ${x.last_visit} | ${x.status} |`).join("\n");
  return {
    content: `**రోగి రికార్డులు · Records** (${r.records.length})\n\n| ID | పేరు | వయస్సు | నిర్ధారణ | చివరి సందర్శన | స్థితి |\n|---|---|---|---|---|---|\n${rows}`,
    meta: r,
  };
};

function IntakeForm({ reply }: { reply: (say: string, run: Chip["run"]) => void }) {
  const [name, setName] = useState("లక్ష్మి డి. (నమూనా)");
  const [age, setAge] = useState(54);
  const [sex, setSex] = useState<"female" | "male" | "other">("female");
  const [phone, setPhone] = useState("+91 90000 00000");
  const [complaint, setComplaint] = useState("మూడు రోజులుగా తలనొప్పి, తల తిరుగుతోంది. బీపీ మందులు వేసుకుంటున్నాను.");
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid gap-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        reply(`రోగి నమోదు: ${name}, ${age}`, async () => {
          const r = await callApi<Intake>("health.intake", { name, age, sex, phone, complaint, consent, language: "te" });
          return {
            content: `✅ నమోదు పూర్తయింది — **${r.record.id}**\n\n**ట్రయాజ్:** ${r.triage}\n\n**Doctor summary (EN):** ${r.doctor_summary_en}`,
            meta: r,
          };
        });
      }}
    >
      <p className="font-semibold">🧾 రోగి నమోదు ఫారం · Patient intake</p>
      <label>పేరు<input className={field} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="grid grid-cols-3 gap-2">
        <label>వయస్సు<input className={field} type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} /></label>
        <label>లింగం
          <select className={field} value={sex} onChange={(e) => setSex(e.target.value as typeof sex)}>
            <option value="female">స్త్రీ</option><option value="male">పురుషుడు</option><option value="other">ఇతర</option>
          </select>
        </label>
        <label>ఫోన్ (WhatsApp)<input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
      </div>
      <label>ముఖ్య సమస్య (మీ మాటల్లో)<textarea className={field} rows={3} value={complaint} onChange={(e) => setComplaint(e.target.value)} /></label>
      <label className="flex items-start gap-2 text-xs text-ivory-dim">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        DPDP సమ్మతి: నా ఆరోగ్య డేటా ఈ క్లినిక్ కోసం భారతదేశంలోనే నిల్వ చేయడానికి అంగీకరిస్తున్నాను. (DPDP Act 2023 consent)
      </label>
      <button className={primaryBtn} disabled={sent}>{sent ? "పంపబడింది ✓" : "నమోదు చేయి / Submit"}</button>
    </form>
  );
}

const chips: Chip[] = [
  { label: "రోగి నమోదు", say: "కొత్త రోగిని నమోదు చేయాలి", run: async () => ({ content: "", form: "intake" }) },
  { label: "ప్రిస్క్రిప్షన్ వివరించు", say: `ఈ ప్రిస్క్రిప్షన్‌ను సాదా తెలుగులో వివరించండి:\n${SAMPLE_RX}`, run: () => explain(SAMPLE_RX) },
  { label: "రికార్డులు", say: "రోగి రికార్డులు చూపించు", run: records() },
  { label: "రికార్డు వెతకండి", say: "లక్ష్మి రికార్డు వెతకండి", run: records("లక్ష్మి") },
];

export function HealthWorkspace() {
  return (
    <WorkspaceChat
      kind="health"
      title="Healthcare workspace"
      teTitle="ఆరోగ్య వర్క్‌స్పేస్"
      greeting={"నమస్కారం! రోగి నమోదు, ప్రిస్క్రిప్షన్ వివరణ లేదా రికార్డుల కోసం అడగండి."}
      chips={chips}
      onText={explain}
      placeholder="ప్రిస్క్రిప్షన్ / డిశ్చార్జ్ నోట్ పేస్ట్ చేయండి…"
      renderForm={(_, reply) => <IntakeForm reply={reply} />}
    />
  );
}
