/** Minimal styled code block — real Adhan sample, real credibility signal.
    Server component; no highlighter dependency, tinted by hand. */
export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-card)] border border-ivory/10 bg-[#0a0c14]">
      <figcaption className="flex items-center justify-between border-b border-ivory/10 px-4 py-2">
        <span className="font-mono text-xs text-ivory-dim">{label}</span>
        <span aria-hidden className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-palai/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-marutham/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-mullai/70" />
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-ivory">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
