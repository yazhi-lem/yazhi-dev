"use client";
import { useState } from "react";
import { callApi, type Envelope } from "@/lib/workspace/types";
import { WorkspaceChat, field, primaryBtn, type Chip } from "./WorkspaceChat";

type Ask = Envelope & { answer: string; citations: string[] };
type Summary = Envelope & { title: string; summary: string; next_hearing?: string; risks: string[] };
type Draft = Envelope & { title: string; body: string };

const ask = async (question: string) => {
  const r = await callApi<Ask>("legal.ask", { question, language: "te" });
  const cites = r.citations.length ? `\n\n📚 ${r.citations.join(" · ")}` : "";
  return { content: r.answer + cites, meta: r };
};

const summary = (language: "te" | "en") => async () => {
  const r = await callApi<Summary>("legal.summary", { sample_id: "os-123-2026", language });
  const risks = r.risks.map((x) => `- ⚠️ ${x}`).join("\n");
  return {
    content: `**${r.title}**\n\n${r.summary.replace(/\n/g, "  \n")}\n\n**తదుపరి విచారణ / Next hearing:** ${r.next_hearing ?? "—"}\n\n${risks}`,
    meta: r,
  };
};

function DraftForm({ reply }: { reply: (say: string, run: Chip["run"]) => void }) {
  const [kind, setKind] = useState<"cheque_bounce_notice" | "name_change_affidavit">("cheque_bounce_notice");
  const [client, setClient] = useState("శ్రీ ఎ. రమేష్ (నమూనా)");
  const [other, setOther] = useState("శ్రీ బి. సురేష్ (నమూనా)");
  const [amount, setAmount] = useState("2,50,000");
  const [oldName, setOldName] = useState("ఎ. రమేష్ బాబు (నమూనా)");
  const [sent, setSent] = useState(false);
  const notice = kind === "cheque_bounce_notice";
  return (
    <form
      className="grid gap-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        reply(`${notice ? "నోటీసు" : "అఫిడవిట్"} డ్రాఫ్ట్ చేయండి — ${client}`, async () => {
          const r = await callApi<Draft>("legal.draft", {
            kind, client_name: client, other_party: notice ? other : undefined,
            amount: notice ? amount : undefined, old_name: notice ? undefined : oldName,
          });
          return { content: `**${r.title}**\n\n${r.body.split("\n").map((l) => `> ${l}`).join("  \n")}`, meta: r };
        });
      }}
    >
      <p className="font-semibold">📝 డ్రాఫ్టింగ్ ఫారం · Drafting form</p>
      <label>రకం / Type
        <select className={field} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="cheque_bounce_notice">లీగల్ నోటీసు — చెక్ బౌన్స్ (NI Act సె.138)</option>
          <option value="name_change_affidavit">అఫిడవిట్ — పేరు మార్పు</option>
        </select>
      </label>
      <label>క్లయింట్ పేరు<input className={field} value={client} onChange={(e) => setClient(e.target.value)} /></label>
      {notice ? (
        <div className="grid grid-cols-2 gap-2">
          <label>ప్రతివాది<input className={field} value={other} onChange={(e) => setOther(e.target.value)} /></label>
          <label>మొత్తం (₹)<input className={field} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        </div>
      ) : (
        <label>పాత పేరు<input className={field} value={oldName} onChange={(e) => setOldName(e.target.value)} /></label>
      )}
      <button className={primaryBtn} disabled={sent}>{sent ? "పంపబడింది ✓" : "డ్రాఫ్ట్ రూపొందించు / Generate"}</button>
    </form>
  );
}

const chips: Chip[] = [
  { label: "చెక్ బౌన్స్ అయితే?", say: "చెక్ బౌన్స్ అయితే నేను ఏమి చేయాలి?", run: () => ask("చెక్ బౌన్స్ అయితే నేను ఏమి చేయాలి?") },
  { label: "Limitation for money suit", say: "What is the limitation period for a money recovery suit?", run: () => ask("What is the limitation period for a money recovery suit?") },
  { label: "అద్దెదారు ఖాళీ చేయడం లేదు", say: "అద్దెదారు ఖాళీ చేయకపోతే యజమాని ఏమి చేయవచ్చు?", run: () => ask("అద్దెదారు ఖాళీ చేయకపోతే యజమాని ఏమి చేయవచ్చు?") },
  { label: "📄 కేసు సారాంశం (తెలుగు)", say: "నమూనా కేసు O.S. 123/2026 సారాంశం తెలుగులో ఇవ్వండి", run: summary("te") },
  { label: "📄 Case summary (English)", say: "Summarise sample case O.S. 123/2026 in English", run: summary("en") },
  { label: "📝 నోటీసు / అఫిడవిట్", say: "నోటీసు లేదా అఫిడవిట్ డ్రాఫ్ట్ చేయాలి", run: async () => ({ content: "", form: "draft" }) },
];

export function LegalWorkspace() {
  return (
    <WorkspaceChat
      title="Legal workspace"
      teTitle="న్యాయ వర్క్‌స్పేస్"
      accent="#c9932e"
      greeting={"నమస్కారం! నేను Yazhi న్యాయ సహాయకుడిని. తెలుగు లేదా English లో అడగండి — చట్ట ప్రశ్నలు, కేసు పత్రాల సారాంశం, నోటీసు/అఫిడవిట్ డ్రాఫ్ట్‌లు.\n\n_క్రింది చిప్‌లలో ఒకటి ఎంచుకోండి._"}
      chips={chips}
      onText={ask}
      placeholder="మీ న్యాయ ప్రశ్న టైప్ చేయండి… / Ask a legal question"
      renderForm={(_, reply) => <DraftForm reply={reply} />}
    />
  );
}
