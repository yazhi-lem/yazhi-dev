/** Labelled diagram of the Bubble UI host, drawn after the founding sketch:
    the window, the packed tray on the right, the composer along the bottom
    with the Circle button and send, and the two things outside the frame —
    Capitol above, the insider-risk boundary beside the tray. */
export function BubbleAnatomy() {
  const tray: [number, number, number][] = [
    [452, 58, 16], [492, 52, 20], [535, 60, 18], [470, 98, 22], [520, 106, 24],
    [556, 140, 12], [480, 146, 18], [530, 160, 16], [500, 196, 22], [548, 208, 18],
    [468, 222, 14], [512, 246, 16], [556, 252, 12],
  ];
  return (
    <figure className="mt-6 max-w-3xl">
      <svg
        viewBox="0 0 680 340"
        role="img"
        aria-labelledby="anatomy-title anatomy-desc"
        className="w-full rounded-xl border border-ivory/10 bg-night-2/60"
      >
        <title id="anatomy-title">Bubble UI anatomy</title>
        <desc id="anatomy-desc">
          A rounded window. The conversation canvas fills the left. A tray of packed, non-touching circles runs down
          the right edge. Along the bottom: the Circle button, the message input and the send arrow. Above the window
          an arrow rises to Capitol; beside the tray a line marks the insider-risk boundary.
        </desc>
        {/* Capitol */}
        <g fill="none" stroke="var(--ivory-dim)" strokeWidth="1.5">
          <path d="M40 46 q-4-18 16-20 q6-14 24-8 q12-8 22 4 q16 0 14 14 q8 10-6 14 h-62 q-14-2-8-4z" />
          <path d="M70 90 V68" markerEnd="url(#arrow)" />
        </g>
        <text x="71" y="44" textAnchor="middle" fontSize="11" fill="var(--ivory)">Capitol</text>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10z" fill="var(--ivory-dim)" />
          </marker>
        </defs>

        {/* window */}
        <rect x="30" y="92" width="550" height="226" rx="22" fill="var(--night)" stroke="var(--ivory)" strokeOpacity="0.5" />
        <text x="54" y="128" fontSize="15" fill="var(--ivory)" fontWeight="600">Canvas</text>
        <text x="54" y="146" fontSize="11" fill="var(--ivory-dim)">the active bubble&apos;s conversation</text>
        {[170, 196].map((y, i) => (
          <rect key={y} x={i ? 190 : 54} y={y} width={i ? 200 : 230} height="16" rx="8" fill="var(--ivory)" fillOpacity={i ? 0.12 : 0.06} />
        ))}

        {/* tray (shifted into the window's right side) */}
        <g transform="translate(0,48)">
          {tray.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="var(--accent)" fillOpacity={0.25 + (i % 4) * 0.12} stroke="var(--ivory)" strokeOpacity="0.35" />
          ))}
        </g>
        <text x="506" y="86" textAnchor="middle" fontSize="11" fill="var(--ivory)">Tray</text>

        {/* insider-risk boundary */}
        <line x1="594" y1="96" x2="594" y2="314" stroke="var(--palai)" strokeWidth="2" strokeDasharray="5 4" />
        <text x="604" y="180" fontSize="11" fill="var(--ivory)">Insider</text>
        <text x="604" y="194" fontSize="11" fill="var(--ivory)">risk</text>
        <text x="604" y="212" fontSize="9.5" fill="var(--ivory-dim)">only declared</text>
        <text x="604" y="224" fontSize="9.5" fill="var(--ivory-dim)">permissions cross</text>

        {/* composer */}
        <circle cx="66" cy="284" r="15" fill="none" stroke="var(--gold)" strokeWidth="1.8" />
        <text x="66" y="289" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--gold)">C</text>
        <rect x="94" y="270" width="300" height="28" rx="14" fill="none" stroke="var(--ivory)" strokeOpacity="0.5" />
        <path d="M404 274 l18 10 -18 10z" fill="var(--gold)" />
        <text x="110" y="288" fontSize="11" fill="var(--ivory-dim)">Composer</text>
        <text x="66" y="314" textAnchor="middle" fontSize="9.5" fill="var(--ivory-dim)">Circle</text>
        <text x="413" y="314" textAnchor="middle" fontSize="9.5" fill="var(--ivory-dim)">send</text>

        {/* principles along the top */}
        <text x="330" y="30" textAnchor="middle" fontSize="12" fill="var(--ivory)">Runs without internet · on-device models</text>
        <text x="330" y="48" textAnchor="middle" fontSize="10.5" fill="var(--ivory-dim)">0% cloud by default — Circle identity throughout</text>
      </svg>
      <figcaption className="mt-2 text-xs text-ivory-dim/70">
        Redrawn from the founding notebook sketch. Capitol and the insider-risk line sit outside the frame on purpose:
        they are what the host answers to, not what the user sees.
      </figcaption>
    </figure>
  );
}
