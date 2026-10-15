export interface DataTableProps {
  columns: string[];
  rows: string[][];
  caption?: string;
  /** column indexes rendered right-aligned in mono (numbers) */
  numeric?: number[];
}

/** Plain, scrollable table. Mirrors insight TableRows: every cell is a
    pre-stringified value, so a server response can be passed straight in. */
export function DataTable({ columns, rows, caption, numeric = [] }: DataTableProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-ivory/10 text-left text-xs uppercase tracking-[0.12em] text-ivory-dim">
            {columns.map((c, i) => (
              <th key={c} scope="col" className={`py-2 pr-4 font-normal ${numeric.includes(i) ? "text-right" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-ivory/5 last:border-0">
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-2 pr-4 text-ivory ${numeric.includes(ci) ? "text-right font-mono" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
