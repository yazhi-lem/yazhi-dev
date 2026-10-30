/** The five landscapes as one hairline, left to right: Kurinji's ridges and
    bloom, Mullai's trees, Marutham's paddy rows, Neytal's tide and moon,
    Palai's dunes and sun. One stroke weight, no fills; each stretch takes
    its tinai hue very faintly so the line warms and cools as it travels.
    Decorative — a footer or section edge, never content. */
export function HairlineHorizon({ className = "", tint = true }: { className?: string; tint?: boolean }) {
  const ink = (k: string) => (tint ? `color-mix(in oklab, var(--${k}) 55%, var(--ivory))` : "var(--ivory)");
  const line = { fill: "none", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 1200 140" preserveAspectRatio="xMidYMax slice" aria-hidden className={className}>
      {/* the ground, end to end */}
      <path d="M0 128H1200" stroke="var(--ivory)" strokeOpacity={0.18} {...line} />

      {/* kurinji — layered ridges, the bloom on the high one */}
      <g stroke={ink("kurinji")} strokeOpacity={0.5}>
        <path d="M0 128 38 92 64 108 108 52 146 96 172 80 236 128" {...line} />
        <path d="M20 128 70 100 96 112 132 84 190 128" strokeOpacity={0.45} strokeDasharray="2 4" {...line} />
        <circle cx="108" cy="40" r="4" {...line} />
      </g>

      {/* mullai — crowns and trunks */}
      <g stroke={ink("mullai")} strokeOpacity={0.5}>
        {[
          [272, 92, 16],
          [306, 82, 22],
          [346, 96, 13],
          [384, 86, 19],
          [424, 98, 12],
        ].map(([x, y, r]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={r} {...line} />
            <path d={`M${x} ${y + r}V128`} {...line} />
          </g>
        ))}
      </g>

      {/* marutham — stalks over the rows */}
      <g stroke={ink("marutham")} strokeOpacity={0.5}>
        {[112, 120].map((y) => (
          <path key={y} d={`M468 ${y}H708`} strokeOpacity={0.6} {...line} />
        ))}
        {Array.from({ length: 13 }, (_, i) => 476 + i * 18).map((x, i) => (
          <path key={x} d={`M${x} 112c0-10 2-18 ${i % 2 ? 6 : -5} -${24 + (i % 3) * 5}`} {...line} />
        ))}
      </g>

      {/* neytal — the tide, and the moon above it */}
      <g stroke={ink("neytal")} strokeOpacity={0.5}>
        {[100, 112, 124].map((y, i) => (
          <path
            key={y}
            d={`M720 ${y}c20 -${8 - i * 2} 40 -${8 - i * 2} 60 0s40 ${8 - i * 2} 60 0 40 -${8 - i * 2} 60 0 40 ${8 - i * 2} 60 0`}
            strokeOpacity={0.6 - i * 0.12}
            {...line}
          />
        ))}
        <path d="M884 38a14 14 0 1 0 14 20 11 11 0 1 1 -14 -20Z" {...line} />
      </g>

      {/* palai — dunes under a low sun */}
      <g stroke={ink("palai")} strokeOpacity={0.5}>
        <circle cx="1104" cy="70" r="15" {...line} />
        <path d="M964 128c40 -36 82 -40 124 -14s80 22 112 -6" {...line} />
        <path d="M1010 128c34 -18 70 -20 104 -4" strokeOpacity={0.45} {...line} />
      </g>
    </svg>
  );
}
