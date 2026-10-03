import type { ReactNode } from "react";
import { CitationMark, SourceCard, type Source } from "../components/Citation";
import { Disclaimer, IDontKnow } from "../components/Guardrails";
import { Panel } from "../components/Panel";
import { Pill } from "../components/Pill";

/** Numbered sources for an answer — the evidence column of Avai, Nyaya,
    Guru. Numbering matches the CitationMarks in the answer. */
export function SourcesPanel({ sources, title = "Sources" }: { sources: Source[]; title?: string }) {
  return (
    <Panel title={title} eyebrow={`${sources.length} cited`}>
      {sources.length === 0 ? (
        <p className="text-sm text-ivory-dim">No sources — so no claim is made.</p>
      ) : (
        <div className="space-y-2">
          {sources.map((s, i) => (
            <SourceCard key={s.id} n={i + 1} source={s} />
          ))}
        </div>
      )}
    </Panel>
  );
}

export interface AnswerPart {
  text: string;
  /** index into `sources` this sentence rests on */
  cite?: number;
}

/** An answer whose every sentence either carries a citation or is not
    said. When there are no sources at all it renders IDontKnow instead. */
export function CitedAnswer({
  parts,
  sources,
  fallbackReason = "No stored source supports an answer to this question.",
}: {
  parts: AnswerPart[];
  sources: Source[];
  fallbackReason?: ReactNode;
}) {
  if (sources.length === 0 || parts.length === 0) {
    return <IDontKnow reason={fallbackReason} next="Try naming the text, verse or section you mean." />;
  }
  return (
    <p className="text-sm leading-relaxed text-ivory">
      {parts.map((p, i) => (
        <span key={i}>
          {p.text}
          {p.cite !== undefined && sources[p.cite] && <CitationMark n={p.cite + 1} source={sources[p.cite]} />}{" "}
        </span>
      ))}
    </p>
  );
}

/** Nyaya's answer layout: the question restated, a cited plain-language
    explanation, the provisions it rests on, and the standing legal notice.
    Nyaya informs; it never advises. */
export function LegalAnswerCard({
  question,
  parts,
  sources,
  validity,
}: {
  question: string;
  parts: AnswerPart[];
  sources: Source[];
  /** share of cited sections matched to stored Act text, 0–1 */
  validity: number;
}) {
  const pct = Math.round(validity * 100);
  return (
    <Panel
      accentEdge
      eyebrow={<span lang="ta">நியாயம் · Nyaya</span>}
      title={question}
      actions={<Pill tone={pct >= 95 ? "ok" : "risk"} title="Cited sections matched to stored Act text">{pct}% matched</Pill>}
    >
      <div className="space-y-4">
        <CitedAnswer parts={parts} sources={sources} />
        <div className="grid gap-2 sm:grid-cols-2">
          {sources.map((s, i) => (
            <SourceCard key={s.id} n={i + 1} source={s} />
          ))}
        </div>
        <Disclaimer kind="legal" />
      </div>
    </Panel>
  );
}
