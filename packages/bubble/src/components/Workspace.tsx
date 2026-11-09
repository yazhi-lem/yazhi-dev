"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { Pill } from "./Pill";
import { bubbleLabelPair, useBubbleLocale, useBubbleT } from "../locales";

/** Primitives the product workspaces share (Guru, Nyaya, Kural, Kadai):
    page chips, the machine-draft and sample-data tags, the handoff card,
    the upload card and a segmented switch. Same Bubble rules as the rest:
    hairlines not shadows, gold for the one action, Tamil never tracked. */

/** A citation to one page (or clause, or record) of a stored source.
    Pressing it opens the page beside the answer — the student checks the
    claim themselves. Aram rule 1. */
export function PageChip({
  book,
  page,
  active = false,
  verified = true,
  onOpen,
}: {
  /** the GuruBook, Act or record set the page belongs to */
  book: string;
  /** what to show inside the chip: "p. 42", "s.138", "#KD-1042" */
  page: string;
  active?: boolean;
  /** the cited span was found in the stored source by the citation verifier */
  verified?: boolean;
  onOpen?: () => void;
}) {
  const t = useBubbleT("bubble");
  const label = `${book}, ${page}${verified ? "" : t("workspace.pageNotVerified")}`;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={active}
      aria-label={t("citation.hrefTo", { label })}
      title={label}
      className={`inline-flex min-h-7 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition ${
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent)]/20 text-ivory"
          : "border-[color:var(--accent)]/50 text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
      }`}
    >
      <span aria-hidden>{verified ? "✓" : "?"}</span>
      {page}
    </button>
  );
}

/** "இயந்திர வரைவு · Machine draft" on every generated item until a person
    approves it; then it says who approved. */
export function MachineDraft({ approvedBy }: { approvedBy?: string }) {
  const t = useBubbleT("bubble.workspace");
  const { display } = useBubbleLocale();
  if (approvedBy) return <Pill tone="ok" title={t("bubble.common.approvedTitle", { name: approvedBy })}>{t("bubble.common.approvedBy", { name: approvedBy })}</Pill>;
  // Tamil first by design; the display preference decides whether the
  // English half is shown beside it (`"both"`, the default, is today's look).
  const pair = bubbleLabelPair(t("machineDraftTa"), t("machineDraftEn"), display);
  return (
    <Pill tone="warn" title={t("machineDraftTitle")}>
      {pair.ta && <span lang="ta" className="text-[11px] normal-case tracking-normal [font-family:var(--font-body)]">{pair.ta}</span>}
      {pair.ta && pair.en && pair.separator}
      {pair.en}
    </Pill>
  );
}

/** "மாதிரித் தரவு · Sample data" — on every reply in demo mode. */
export function SampleTag() {
  const t = useBubbleT("bubble.workspace");
  const { display } = useBubbleLocale();
  const pair = bubbleLabelPair(t("sampleTa"), t("sampleEn"), display);
  return (
    <Pill tone="neutral" title={t("sampleTitle")}>
      {pair.ta && <span lang="ta" className="text-[11px] normal-case tracking-normal [font-family:var(--font-body)]">{pair.ta}</span>}
      {pair.ta && pair.en && pair.separator}
      {pair.en}
    </Pill>
  );
}

/** When the agent isn't sure, it hands the conversation to a person and
    says so — with the ticket the person will pick up. */
export function HandoffCard({
  title,
  reason,
  ticket,
  who,
  children,
}: {
  title?: ReactNode;
  reason: ReactNode;
  /** the ticket or case the handoff created */
  ticket?: string;
  /** who picks it up: "Counter staff", "Legal aid" */
  who?: string;
  children?: ReactNode;
}) {
  const t = useBubbleT("bubble.workspace");
  // `title` stays an override; a node is rendered as given, a string is
  // already copy from the caller.
  const heading = title ?? t("handoffTitle");
  return (
    <div role="note" className="rounded-xl border border-neytal/50 bg-neytal/5 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-ivory">{heading}</p>
        {ticket && <span className="font-mono text-[11px] text-neytal">{ticket}</span>}
      </div>
      <p className="mt-1 text-ivory-dim">{reason}</p>
      {who && <p className="mt-2 text-xs text-ivory-dim">{t("handoffPickedUp", { who })}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export interface UploadItem {
  id: string;
  name: string;
  /** bytes */
  size: number;
  status: "queued" | "reading" | "ready" | "rejected";
  note?: string;
}

const kb = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
const UPLOAD_TONE = { queued: "neutral", reading: "info", ready: "ok", rejected: "risk" } as const;

/** The shared upload card. Files are read where the workspace runs — the
    card itself sends nothing anywhere; the host decides what happens to
    the File objects it is handed. */
export function UploadCard({
  title,
  hint,
  accept,
  items = [],
  onFiles,
  consent,
  labels = {},
}: {
  title: ReactNode;
  hint?: ReactNode;
  /** input accept string, e.g. ".pdf,image/*" */
  accept?: string;
  items?: UploadItem[];
  onFiles: (files: File[]) => void;
  /** a consent line the person must tick before choosing files (DPDP) */
  consent?: ReactNode;
  /** the button's words in the screen's language */
  labels?: { choose?: string; tickFirst?: string };
}) {
  const t = useBubbleT("bubble.workspace");
  const choose = labels.choose ?? t("chooseFiles");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [agreed, setAgreed] = useState(!consent);
  const take = (list: FileList | null) => {
    if (!list || !agreed) return;
    onFiles(Array.from(list));
  };
  return (
    <div className="space-y-3">
      {consent && (
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-ivory">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--gold)]" />
          <span>{consent}</span>
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
        className={`grid place-items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition ${
          over ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10" : "border-ivory/20"
        }`}
      >
        <p className="text-sm font-semibold text-ivory">{title}</p>
        {hint && <p className="max-w-sm text-xs text-ivory-dim">{hint}</p>}
        <input id={id} ref={input} type="file" multiple accept={accept} aria-label={choose} className="sr-only" disabled={!agreed} onChange={(e) => take(e.target.files)} />
        {agreed ? (
          <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-bronze">
            {choose}
          </label>
        ) : (
          <p className="inline-flex min-h-11 items-center rounded-full border border-dashed border-ivory/30 px-4 text-xs text-ivory-dim">{labels.tickFirst ?? t("tickFirst")}</p>
        )}
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-2 rounded-lg border border-ivory/10 bg-night/60 px-3 py-2 text-xs">
              <span className="min-w-0 truncate text-ivory">{it.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-ivory-dim">
                {kb(it.size)}
                <Pill tone={UPLOAD_TONE[it.status]}>{it.note ?? it.status}</Pill>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A row of mutually exclusive choices — tiers, channels, languages. */
export function Segmented<V extends string>({
  label,
  options,
  value,
  onChange,
}: {
  /** accessible name for the group */
  label: string;
  options: { value: V; label: ReactNode; lang?: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-full border border-ivory/15 bg-night/60 p-0.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            lang={o.lang}
            onClick={() => onChange(o.value)}
            className={`min-h-9 rounded-full px-3 text-xs transition ${on ? "bg-[color:var(--accent)] font-semibold text-night" : "text-ivory-dim hover:text-ivory"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
