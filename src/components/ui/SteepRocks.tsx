/** Steep sea-floor rocks — dark, unlit stone rising from the bottom of the
    deep-ocean footer. Two jagged ranges (a further, slightly lighter range
    behind a nearer near-black one) give the trench floor depth. The peaks are
    tall at the two sides and lower through the middle so the footer text keeps
    a clear channel above them. Stretched full-width via preserveAspectRatio
    "none"; purely decorative. */
export function SteepRocks({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* faint light falling from the water above onto the near range */}
        <linearGradient id="rockLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ocean-deep)" />
          <stop offset="35%" stopColor="var(--rock-deep)" />
          <stop offset="100%" stopColor="#01060c" />
        </linearGradient>
      </defs>

      {/* further range — lower, softer, sits behind */}
      <path
        fill="var(--rock)"
        opacity="0.85"
        d="M0,240 L0,168 L64,120 L120,166 L188,96 L262,158 L332,112 L420,150 L512,104
           L600,158 L690,120 L788,164 L890,110 L996,158 L1090,118 L1188,160 L1276,116
           L1360,158 L1408,124 L1440,150 L1440,240 Z"
      />

      {/* nearer range — steep cliffs at both edges, a low channel through the
          centre; near-black with a faint top-lit gradient */}
      <path
        fill="url(#rockLight)"
        d="M0,240 L0,58 L58,150 L120,104 L196,182 L286,150 L372,196 L470,176 L560,206
           L660,190 L760,206 L864,184 L968,204 L1074,178 L1168,196 L1252,150 L1330,110
           L1388,158 L1440,52 L1440,240 Z"
      />
    </svg>
  );
}
