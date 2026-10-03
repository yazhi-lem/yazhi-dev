import { firstGrapheme } from "../text";

/** The Yazhi bubble: one app, agent or tool, drawn as a lit sphere in its
    accent colour with its first glyph. Used by the Bubble UI tray and
    anywhere an app needs a compact identity mark. */
export function Bubble({
  accent,
  label,
  glyph,
  size = 40,
  active = false,
  onSelect,
  title,
}: {
  accent: string;
  /** accessible name — the app or agent name */
  label: string;
  /** shown in the middle; defaults to the first character of `label` */
  glyph?: string;
  /** diameter in px */
  size?: number;
  active?: boolean;
  /** makes the bubble a button */
  onSelect?: () => void;
  /** tooltip text */
  title?: string;
}) {
  const style = {
    width: size,
    height: size,
    background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${accent} 55%, white) 0%, ${accent} 55%, color-mix(in oklab, ${accent} 60%, black) 100%)`,
  };
  const inner = (
    <span aria-hidden className="font-semibold text-night" style={{ fontSize: Math.max(11, size * 0.3) }}>
      {glyph ?? firstGrapheme(label)}
    </span>
  );
  const ring = active ? "ring-2 ring-ivory ring-offset-2 ring-offset-night-2" : "";

  if (!onSelect) {
    return (
      <span role="img" aria-label={label} title={title} className={`grid shrink-0 place-items-center rounded-full ${ring}`} style={style}>
        {inner}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={label}
      title={title}
      className={`grid shrink-0 place-items-center rounded-full transition-transform hover:scale-105 ${ring}`}
      style={style}
    >
      {inner}
    </button>
  );
}
