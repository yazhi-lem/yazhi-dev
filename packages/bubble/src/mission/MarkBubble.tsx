/** The Yazhi mark — three bubbles, L : M : S = 1.00 : 0.74 : 0.56, never
    touching — held inside one bubble. It is Mission Control's face.

    Asleep (no Circle account yet) the three marks are open rings on a
    dashed bubble; awake they fill with ink and the bubble closes. Purely
    drawn: the button that carries it supplies the name. */
export function MarkBubble({
  size = 40,
  awake = true,
  className = "",
}: {
  size?: number;
  awake?: boolean;
  className?: string;
}) {
  const ink = awake ? "var(--ivory)" : "none";
  const stroke = awake ? "none" : "var(--ivory-dim)";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={className}>
      <circle
        cx="50"
        cy="50"
        r="47"
        fill={awake ? "color-mix(in oklab, var(--gold) 14%, transparent)" : "none"}
        stroke={awake ? "var(--gold)" : "var(--ivory-dim)"}
        strokeWidth={awake ? 2.5 : 2}
        strokeDasharray={awake ? undefined : "4 5"}
        vectorEffect="non-scaling-stroke"
      />
      {/* the brand mark, scaled about its own centre to sit inside the bubble */}
      <g transform="translate(50 50) scale(0.56) translate(-50 -50)">
        <circle cx="30.8" cy="30.6" r="12.3" fill={ink} stroke={stroke} strokeWidth={5} />
        <circle cx="65.2" cy="26.9" r="16.3" fill={ink} stroke={stroke} strokeWidth={5} />
        <circle cx="47.2" cy="67.4" r="22" fill={ink} stroke={stroke} strokeWidth={5} />
      </g>
    </svg>
  );
}
