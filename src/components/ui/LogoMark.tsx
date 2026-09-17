/** Yazhi brand mark — the three floating bubbles, per the Brand Identity
    System (v1.1): radius ratio L:M:S = 1.00:0.74:0.56, every pairwise
    edge-to-edge gap equal (~6 units in this 100x100 viewBox), never
    touching. Solid fill, no gradient — the site is dark-ground
    throughout, so per the brand's color-pairing rule the mark uses its
    reversed (cream) form via --ivory rather than Cobalt. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Yazhi logo"
      className={className}
    >
      <circle cx="30.8" cy="30.6" r="12.3" fill="var(--ivory)" />
      <circle cx="65.2" cy="26.9" r="16.3" fill="var(--ivory)" />
      <circle cx="47.2" cy="67.4" r="22" fill="var(--ivory)" />
    </svg>
  );
}
