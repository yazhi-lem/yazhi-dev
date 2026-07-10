/** The drowned city on the Indian Ocean floor — steep dark rocks with the
    broken ruins of a sunken Tamil city rising between them: snapped colonnades,
    a stepped temple gopuram, a broken tower and a wall, a toppled column. The
    ruins sit between a far rock range and a nearer, near-black one so the front
    rocks and silt half-bury their bases. Everything is a dark-blue silhouette,
    murky with depth. Stretched full-width via preserveAspectRatio "none";
    purely decorative. */

/** a broken column — vertical shaft with an uneven, snapped-off top */
const pillar = (x: number, w: number, top: number, base = 236) =>
  `M${x} ${base} L${x} ${top} L${x + w * 0.3} ${top + 7} L${x + w * 0.55} ${top}` +
  ` L${x + w * 0.8} ${top + 9} L${x + w} ${top + 3} L${x + w} ${base} Z`;

export function SunkenRuins({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 260"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* faint light falling from the water above onto the near rock range */}
        <linearGradient id="rockLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ocean-deep)" />
          <stop offset="35%" stopColor="var(--rock-deep)" />
          <stop offset="100%" stopColor="#01050b" />
        </linearGradient>
      </defs>

      {/* further rock range — lower, softer, behind everything */}
      <path
        fill="var(--rock)"
        opacity="0.85"
        d="M0,260 L0,182 L64,140 L120,180 L188,120 L262,172 L332,132 L420,166 L512,126
           L600,172 L690,138 L788,178 L890,128 L996,172 L1090,134 L1188,174 L1276,132
           L1360,172 L1408,140 L1440,166 L1440,260 Z"
      />

      {/* the sunken ruins — drowned stone standing on the floor */}
      <g fill="var(--ruin)" opacity="0.9">
        {/* left colonnade + fallen entablature beam */}
        <path d={pillar(176, 24, 118)} />
        <path d={pillar(232, 24, 100)} />
        <path d={pillar(300, 22, 150)} />
        <rect x="170" y="110" width="94" height="11" opacity="0.85" />

        {/* stepped temple gopuram with a snapped tip */}
        <path
          d="M452,236 L452,150 L470,150 L470,128 L486,128 L486,106 L500,106 L500,86
             L512,74 L520,84 L520,106 L534,106 L534,128 L550,128 L550,150 L568,150
             L568,236 Z"
        />

        {/* tall broken tower, centre-right */}
        <path
          d="M712,236 L712,96 L724,84 L742,92 L742,132 L752,120 L752,236 Z"
        />
        <path d={pillar(792, 22, 168)} opacity="0.8" />

        {/* right colonnade */}
        <path d={pillar(980, 24, 128)} />
        <path d={pillar(1036, 24, 150)} />
        {/* toppled column resting across the rocks */}
        <path d="M900,232 L1010,214 L1013,226 L903,244 Z" opacity="0.8" />

        {/* ruined wall with a doorway gap, far right */}
        <path
          d="M1236,236 L1236,132 L1254,120 L1300,120 L1318,132 L1318,236 L1300,236
             L1300,182 L1272,182 L1272,236 Z"
        />
      </g>

      {/* nearer rock range — steep cliffs at both edges, a low channel through
          the centre; near-black with a faint top-lit gradient. Painted last so
          it half-buries the ruin bases. */}
      <path
        fill="url(#rockLight)"
        d="M0,260 L0,64 L58,158 L120,112 L196,192 L286,158 L372,206 L470,186 L560,216
           L660,200 L760,216 L864,194 L968,214 L1074,188 L1168,206 L1252,158 L1330,116
           L1388,166 L1440,58 L1440,260 Z"
      />
    </svg>
  );
}
