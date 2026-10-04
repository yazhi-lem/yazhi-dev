/** Yazhi brand mark — cream monochrome for dark surfaces (brand-kit/logos/yazhi-mark-mono-ivory.svg) */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Yazhi mark, cream monochrome — for dark surfaces"
      className={`shrink-0 ${className}`}
    >
      <circle cx="30.8" cy="30.6" r="12.3" fill="#f8f5ef" />
      <circle cx="65.2" cy="26.9" r="16.3" fill="#f8f5ef" />
      <circle cx="47.2" cy="67.4" r="22" fill="#f8f5ef" />
    </svg>
  );
}
