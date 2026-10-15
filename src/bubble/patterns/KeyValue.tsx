export interface KeyValueItem {
  label: string;
  value: string;
  mono?: boolean;
}

/** Definition list for facts: collector kind, interval, model, owner. */
export function KeyValue({ items }: { items: KeyValueItem[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-xs uppercase tracking-[0.14em] text-ivory-dim">{it.label}</dt>
          <dd className={`mt-0.5 break-words text-ivory ${it.mono ? "font-mono text-sm" : ""}`}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
