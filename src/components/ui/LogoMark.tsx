/** Yazhi brand mark — the three spheres, recreated as SVG from the supplied
    logo so it stays crisp at any size and reads on the dark ground.
    Three spheres = the three projects (Adhan · Sangam · Yazh). */
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
      <defs>
        <radialGradient id="yzsphere" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#2f6ae0" />
          <stop offset="55%" stopColor="#1245b8" />
          <stop offset="100%" stopColor="#0a1f5c" />
        </radialGradient>
      </defs>
      <circle cx="33" cy="27" r="13" fill="url(#yzsphere)" />
      <circle cx="67" cy="34" r="16" fill="url(#yzsphere)" />
      <circle cx="49" cy="67" r="22" fill="url(#yzsphere)" />
    </svg>
  );
}
