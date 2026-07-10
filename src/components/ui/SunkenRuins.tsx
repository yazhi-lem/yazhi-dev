/** The drowned city on the Indian Ocean floor — three smooth, rolling rock
    ranges (far, middle, near, each a darker blue than the last) cradling the
    broken ruins of a sunken Tamil city: snapped colonnades, a stepped temple
    gopuram, a broken tower and wall, a toppled column. The rock edges are soft
    bezier swells — silt smoothed by deep water — while the ruins stay angular.
    The near range half-buries the ruin bases so the city seems to emerge from
    the seabed. Stretched full-width via preserveAspectRatio "none"; decorative. */

/** a broken column — vertical shaft with an uneven, snapped-off top */
const pillar = (x: number, w: number, top: number, base = 262) =>
  `M${x} ${base} L${x} ${top} L${x + w * 0.3} ${top + 7} L${x + w * 0.55} ${top}` +
  ` L${x + w * 0.8} ${top + 9} L${x + w} ${top + 3} L${x + w} ${base} Z`;

export function SunkenRuins({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* faint light falling from the water above onto the near rock range */}
        <linearGradient id="rockLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ocean-deep)" />
          <stop offset="38%" stopColor="var(--rock-deep)" />
          <stop offset="100%" stopColor="#01050b" />
        </linearGradient>
      </defs>

      {/* furthest rock range — soft rolling swells, lightest blue, behind all */}
      <path
        fill="var(--rock-far)"
        opacity="0.9"
        d="M0,300 L0,150 C120,112 240,188 360,150 C480,112 600,188 720,150
           C840,112 960,188 1080,150 C1200,112 1320,188 1440,150 L1440,300 Z"
      />

      {/* middle rock range — lower, offset swells */}
      <path
        fill="var(--rock)"
        d="M0,300 L0,192 C150,158 290,226 440,190 C590,156 720,226 870,190
           C1020,156 1150,226 1290,190 C1360,176 1410,202 1440,188 L1440,300 Z"
      />

      {/* the sunken ruins — drowned stone standing on the floor */}
      <g fill="var(--ruin)" opacity="0.9">
        {/* left colonnade + fallen entablature beam */}
        <path d={pillar(176, 24, 140)} />
        <path d={pillar(232, 24, 120)} />
        <path d={pillar(300, 22, 172)} />
        <rect x="170" y="130" width="94" height="11" opacity="0.85" />

        {/* stepped temple gopuram with a snapped tip */}
        <path
          d="M452,262 L452,176 L470,176 L470,154 L486,154 L486,132 L500,132 L500,112
             L512,100 L520,110 L520,132 L534,132 L534,154 L550,154 L550,176 L568,176
             L568,262 Z"
        />

        {/* tall broken tower, centre-right */}
        <path d="M712,262 L712,122 L724,110 L742,118 L742,158 L752,146 L752,262 Z" />
        <path d={pillar(792, 22, 194)} opacity="0.8" />

        {/* right colonnade */}
        <path d={pillar(980, 24, 154)} />
        <path d={pillar(1036, 24, 176)} />
        {/* toppled column resting across the rocks */}
        <path d="M900,258 L1010,240 L1013,252 L903,270 Z" opacity="0.8" />

        {/* ruined wall with a doorway gap, far right */}
        <path
          d="M1236,262 L1236,158 L1254,146 L1300,146 L1318,158 L1318,262 L1300,262
             L1300,208 L1272,208 L1272,262 Z"
        />
      </g>

      {/* nearest rock range — soft swells with higher shoulders and a low
          central channel; near-black with a faint top-lit gradient. Painted
          last so it half-buries the ruin bases. */}
      <path
        fill="url(#rockLight)"
        d="M0,300 L0,120 C70,180 150,150 250,196 C360,244 520,208 640,228
           C770,250 900,214 1040,232 C1170,250 1290,206 1360,150 C1400,124
           1420,150 1440,116 L1440,300 Z"
      />
    </svg>
  );
}
