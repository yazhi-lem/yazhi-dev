"use client";
import { Pill } from "../components/Pill";
import { useBubbleT } from "../locales";
import type { Product } from "../samples";

// Fully qualified, literal keys: `t` here is namespaced to `bubble`, so a key
// that already carries the prefix is used as-is. Literal (not templated) so
// `npm run i18n:check` can verify every one against the catalogue.
const STOCK = {
  in: { tone: "ok", key: "bubble.commerce.inStock" },
  low: { tone: "warn", key: "bubble.commerce.lowStock" },
  out: { tone: "risk", key: "bubble.commerce.outOfStock" },
} as const;

const rupees = (n: number) => (n > 0 ? `₹${n.toLocaleString("en-IN")}` : "₹ —");

/** A Kadai product row: bilingual name, unit, price, stock, add. */
export function ProductCard({ product, onAdd }: { product: Product; onAdd?: (p: Product) => void }) {
  const t = useBubbleT("bubble");
  const s = STOCK[product.stock];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ivory/10 bg-night/60 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ivory">
          {product.name}
        </p>
        <p className="text-xs text-ivory-dim">
          {product.unit} · {rupees(product.price)}
        </p>
      </div>
      <Pill tone={s.tone}>{t(s.key)}</Pill>
      <button
        type="button"
        disabled={product.stock === "out"}
        onClick={() => onAdd?.(product)}
        className="rounded-md border border-[color:var(--accent)]/50 px-2.5 py-1 text-xs text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10 disabled:opacity-30"
      >
        {t("common.add")}
      </button>
    </div>
  );
}

export interface CartLine {
  product: Product;
  qty: number;
}

/** Annachi's order summary. v1 records a payment *intent* only — the
    merchant collects payment their usual way; no money moves through Yazhi. */
export function PaymentIntentCard({ lines, onRemove }: { lines: CartLine[]; onRemove?: (id: string) => void }) {
  const t = useBubbleT("bubble.commerce");
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  return (
    <div className="rounded-xl border border-ivory/10 bg-night/60 p-3 text-sm">
      <p className="font-semibold text-ivory">{t("order")}</p>
      {lines.length === 0 ? (
        <p className="mt-1 text-xs text-ivory-dim">{t("nothingAdded")}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center justify-between gap-2 text-ivory-dim">
              <span>
                {l.qty} × {l.product.name}
              </span>
              <span className="flex items-center gap-2">
                {rupees(l.product.price * l.qty)}
                {onRemove && (
                  <button type="button" onClick={() => onRemove(l.product.id)} aria-label={t("remove", { name: l.product.name })} className="text-ivory-dim hover:text-palai">
                    ✕
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex justify-between border-t border-ivory/10 pt-2 font-semibold text-ivory">
        <span>{t("bubble.common.total")}</span>
        <span>{rupees(total)}</span>
      </div>
      <p className="mt-2 rounded-md bg-gold/10 p-2 text-[11px] text-ivory-dim">
        {t("intentNote")}
      </p>
    </div>
  );
}
