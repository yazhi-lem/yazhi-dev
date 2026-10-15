"use client";
/** Workspace i18n — Telugu first, English second (Yazhi standing rule).
    The site-wide src/lib/i18n.tsx is Tamil/English (ta|en|both); these Hyderabad
    workspaces need te|en, so they get their own small typed dictionary that
    follows the same pattern (context + localStorage persistence + toggle). */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type WsLang = "te" | "en";
const STORAGE_KEY = "yazhi-ws-lang";

const te = {
  "app.legal": "న్యాయ వర్క్‌స్పేస్",
  "app.health": "ఆరోగ్య వర్క్‌స్పేస్",
  "lang.toggle": "భాష",
  "auth.title": "సైన్ ఇన్ అవసరం",
  "auth.body.legal": "మీ న్యాయ సంస్థ ఖాతాతో సైన్ ఇన్ చేయండి. రికార్డులు మీ సంస్థలో మాత్రమే కనిపిస్తాయి.",
  "auth.body.health": "మీ క్లినిక్ ఖాతాతో సైన్ ఇన్ చేయండి. రికార్డులు మీ క్లినిక్‌లో మాత్రమే కనిపిస్తాయి.",
  "auth.demo": "డెమో ఖాతాతో ప్రవేశించండి (కల్పిత సంస్థ)",
  "auth.unavailable": "ఈ డిప్లాయ్‌మెంట్‌లో సైన్ ఇన్ అందుబాటులో లేదు.",
  "auth.signout": "సైన్ అవుట్",
  "tenant.demo-lawfirm-hyd": "డెమో లా ఛాంబర్స్, హైదరాబాద్ (కల్పితం)",
  "tenant.demo-clinic-hyd": "డెమో ఫ్యామిలీ క్లినిక్, హైదరాబాద్ (కల్పితం)",
  "chat.you": "మీరు",
  "chat.thinking": "Yazhi ఆలోచిస్తోంది…",
  "chat.send": "పంపు",
  "chat.message": "సందేశం",
  "chat.demoTag": "డెమో డేటా",
  "chat.footer": "డెమో · కల్పిత నమూనా డేటా · న్యాయ/వైద్య సలహా కాదు · డేటా భారతదేశంలోనే",
  "err.unavailable": "సేవ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
  "err.invalid": "చెల్లని వివరాలు — దయచేసి ఫారం తనిఖీ చేయండి (సమ్మతి తప్పనిసరి).",
  "err.rate": "చాలా అభ్యర్థనలు — ఒక నిమిషం ఆగండి.",
  "err.forbidden": "ఈ వర్క్‌స్పేస్‌కు అనుమతి లేదు.",
  "err.too_large": "సమాచారం చాలా పెద్దది.",
  "err.bad_request": "అభ్యర్థన చెల్లదు.",
  "err.ref": "రిఫరెన్స్",
  "legal.greeting": "నమస్కారం! మీ న్యాయ ప్రశ్న అడగండి లేదా క్రింది సూచనల్లో ఒకటి ఎంచుకోండి.",
  "legal.placeholder": "మీ న్యాయ ప్రశ్న టైప్ చేయండి…",
  "legal.chip.cheque": "చెక్ బౌన్స్ అయితే?",
  "legal.q.cheque": "చెక్ బౌన్స్ అయితే నేను ఏమి చేయాలి?",
  "legal.chip.tenant": "అద్దెదారు ఖాళీ చేయడం లేదు",
  "legal.q.tenant": "అద్దెదారు ఖాళీ చేయకపోతే యజమాని ఏమి చేయవచ్చు?",
  "legal.chip.summary": "కేసు సారాంశం",
  "legal.q.summary": "నమూనా కేసు O.S. 123/2026 సారాంశం ఇవ్వండి",
  "legal.chip.draft": "నోటీసు / అఫిడవిట్",
  "legal.q.draft": "నోటీసు లేదా అఫిడవిట్ డ్రాఫ్ట్ చేయాలి",
  "legal.nextHearing": "తదుపరి విచారణ",
  "draft.title": "డ్రాఫ్టింగ్ ఫారం",
  "draft.type": "రకం",
  "draft.kind.notice": "లీగల్ నోటీసు — చెక్ బౌన్స్ (NI Act సె.138)",
  "draft.kind.affidavit": "అఫిడవిట్ — పేరు మార్పు",
  "draft.client": "క్లయింట్ పేరు",
  "draft.other": "ప్రతివాది",
  "draft.amount": "మొత్తం (₹)",
  "draft.oldName": "పాత పేరు",
  "draft.submit": "డ్రాఫ్ట్ రూపొందించు",
  "draft.sent": "పంపబడింది ✓",
  "draft.say.notice": "నోటీసు డ్రాఫ్ట్ చేయండి",
  "draft.say.affidavit": "అఫిడవిట్ డ్రాఫ్ట్ చేయండి",
  "draft.default.client": "శ్రీ ఎ. రమేష్ (నమూనా)",
  "draft.default.other": "శ్రీ బి. సురేష్ (నమూనా)",
  "draft.default.old": "ఎ. రమేష్ బాబు (నమూనా)",
  "health.greeting": "నమస్కారం! రోగి నమోదు, ప్రిస్క్రిప్షన్ వివరణ లేదా రికార్డుల కోసం అడగండి.",
  "health.placeholder": "ప్రిస్క్రిప్షన్ / డిశ్చార్జ్ నోట్ పేస్ట్ చేయండి…",
  "health.chip.intake": "రోగి నమోదు",
  "health.q.intake": "కొత్త రోగిని నమోదు చేయాలి",
  "health.chip.explain": "ప్రిస్క్రిప్షన్ వివరించు",
  "health.q.explain": "ఈ ప్రిస్క్రిప్షన్‌ను సాదా భాషలో వివరించండి:",
  "health.chip.records": "రికార్డులు",
  "health.q.records": "రోగి రికార్డులు చూపించు",
  "health.chip.search": "రికార్డు వెతకండి",
  "health.q.search": "రికార్డు YZ-H-0012 వెతకండి",
  "records.title": "రోగి రికార్డులు",
  "records.id": "ID",
  "records.name": "పేరు",
  "records.age": "వయస్సు",
  "records.dx": "నిర్ధారణ",
  "records.visit": "చివరి సందర్శన",
  "records.status": "స్థితి",
  "intake.title": "రోగి నమోదు ఫారం",
  "intake.name": "పేరు",
  "intake.age": "వయస్సు",
  "intake.sex": "లింగం",
  "intake.sex.female": "స్త్రీ",
  "intake.sex.male": "పురుషుడు",
  "intake.sex.other": "ఇతర",
  "intake.phone": "ఫోన్ (WhatsApp)",
  "intake.complaint": "ముఖ్య సమస్య (మీ మాటల్లో)",
  "intake.consent": "DPDP సమ్మతి: నా ఆరోగ్య డేటా ఈ క్లినిక్ కోసం భారతదేశంలోనే నిల్వ చేయడానికి అంగీకరిస్తున్నాను.",
  "intake.submit": "నమోదు చేయి",
  "intake.sent": "పంపబడింది ✓",
  "intake.say": "రోగి నమోదు",
  "intake.done": "నమోదు పూర్తయింది",
  "intake.triage": "ట్రయాజ్",
  "intake.doctor": "డాక్టర్ కోసం సారాంశం (EN)",
  "intake.default.name": "లక్ష్మి డి. (నమూనా)",
  "intake.default.complaint": "మూడు రోజులుగా తలనొప్పి, తల తిరుగుతోంది. బీపీ మందులు వేసుకుంటున్నాను.",
} as const;

export type WsKey = keyof typeof te;

const en: Record<WsKey, string> = {
  "app.legal": "Legal workspace",
  "app.health": "Healthcare workspace",
  "lang.toggle": "Language",
  "auth.title": "Sign in required",
  "auth.body.legal": "Sign in with your law firm account. Records are visible only within your firm.",
  "auth.body.health": "Sign in with your clinic account. Records are visible only within your clinic.",
  "auth.demo": "Demo sign-in (fictional tenant)",
  "auth.unavailable": "Sign-in is not configured on this deployment.",
  "auth.signout": "Sign out",
  "tenant.demo-lawfirm-hyd": "Demo Law Chambers, Hyderabad (fictional)",
  "tenant.demo-clinic-hyd": "Demo Family Clinic, Hyderabad (fictional)",
  "chat.you": "You",
  "chat.thinking": "Yazhi is thinking…",
  "chat.send": "Send",
  "chat.message": "Message",
  "chat.demoTag": "demo data",
  "chat.footer": "Demo · fictional sample data · not legal or medical advice · data stays in India",
  "err.unavailable": "The service is unavailable right now. Please try again.",
  "err.invalid": "Invalid details — please check the form (consent is required).",
  "err.rate": "Too many requests — please wait a minute.",
  "err.forbidden": "Not permitted for this workspace.",
  "err.too_large": "Request is too large.",
  "err.bad_request": "Invalid request.",
  "err.ref": "ref",
  "legal.greeting": "Hello! Ask a legal question or pick one of the suggestions below.",
  "legal.placeholder": "Type your legal question…",
  "legal.chip.cheque": "Cheque bounced?",
  "legal.q.cheque": "What should I do if a cheque bounces?",
  "legal.chip.tenant": "Tenant won't vacate",
  "legal.q.tenant": "What can a landlord do if a tenant won't vacate?",
  "legal.chip.summary": "Case summary",
  "legal.q.summary": "Summarise sample case O.S. 123/2026",
  "legal.chip.draft": "Notice / affidavit",
  "legal.q.draft": "I need to draft a notice or affidavit",
  "legal.nextHearing": "Next hearing",
  "draft.title": "Drafting form",
  "draft.type": "Type",
  "draft.kind.notice": "Legal notice — cheque bounce (NI Act s.138)",
  "draft.kind.affidavit": "Affidavit — change of name",
  "draft.client": "Client name",
  "draft.other": "Opposite party",
  "draft.amount": "Amount (₹)",
  "draft.oldName": "Former name",
  "draft.submit": "Generate draft",
  "draft.sent": "Sent ✓",
  "draft.say.notice": "Draft a notice",
  "draft.say.affidavit": "Draft an affidavit",
  "draft.default.client": "Mr A. Ramesh (sample)",
  "draft.default.other": "Mr B. Suresh (sample)",
  "draft.default.old": "A. Ramesh Babu (sample)",
  "health.greeting": "Hello! Ask for patient intake, a prescription explanation, or records.",
  "health.placeholder": "Paste a prescription / discharge note…",
  "health.chip.intake": "Patient intake",
  "health.q.intake": "Register a new patient",
  "health.chip.explain": "Explain prescription",
  "health.q.explain": "Explain this prescription in plain language:",
  "health.chip.records": "Records",
  "health.q.records": "Show patient records",
  "health.chip.search": "Search a record",
  "health.q.search": "Find record YZ-H-0012",
  "records.title": "Patient records",
  "records.id": "ID",
  "records.name": "Name",
  "records.age": "Age",
  "records.dx": "Diagnosis",
  "records.visit": "Last visit",
  "records.status": "Status",
  "intake.title": "Patient intake form",
  "intake.name": "Name",
  "intake.age": "Age",
  "intake.sex": "Sex",
  "intake.sex.female": "Female",
  "intake.sex.male": "Male",
  "intake.sex.other": "Other",
  "intake.phone": "Phone (WhatsApp)",
  "intake.complaint": "Main complaint (in your words)",
  "intake.consent": "DPDP consent: I agree to my health data being stored in India for this clinic.",
  "intake.submit": "Submit",
  "intake.sent": "Sent ✓",
  "intake.say": "Patient intake",
  "intake.done": "Registered",
  "intake.triage": "Triage",
  "intake.doctor": "Doctor summary (EN)",
  "intake.default.name": "Lakshmi D. (sample)",
  "intake.default.complaint": "Headache and dizziness for three days. I take BP medicines.",
};

export const WS_DICT: Record<WsLang, Record<WsKey, string>> = { te, en };

const Ctx = createContext<{ lang: WsLang; setLang: (l: WsLang) => void; t: (k: WsKey) => string }>({
  lang: "te",
  setLang: () => {},
  t: (k) => te[k],
});

export function WsLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<WsLang>("te");
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore persisted choice after hydration
    if (saved === "te" || saved === "en") setLangState(saved);
  }, []);
  // Capture the site's own <html lang> first (effects run in order), restore it
  // on unmount, and keep it in step with the active language meanwhile.
  useEffect(() => {
    const previous = document.documentElement.lang;
    return () => {
      document.documentElement.lang = previous;
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: WsLang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => WS_DICT[lang][k] }}>{children}</Ctx.Provider>;
}

export const useWsLang = () => useContext(Ctx);

/** Wrapper element whose lang attribute follows the active language. */
export function WsLangScope({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  const { lang } = useWsLang();
  return (
    <div lang={lang} data-testid="ws-scope" style={style}>
      {children}
    </div>
  );
}

export function WsLangToggle() {
  const { lang, setLang, t } = useWsLang();
  return (
    <div role="radiogroup" aria-label={t("lang.toggle")} className="flex items-center gap-1 rounded-full border border-ivory/10 p-0.5 text-xs">
      {(["te", "en"] as const).map((l) => (
        <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-0.5 transition-colors ${lang === l ? "bg-gold font-semibold text-night" : "text-ivory-dim hover:text-ivory"}`}>
          {l === "te" ? "తెలుగు" : "English"}
        </button>
      ))}
    </div>
  );
}
