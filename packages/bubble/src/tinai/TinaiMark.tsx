import type { ThinaiKey } from "./keys";

/** One flat mark per tinai, drawn in currentColor on a 24-unit grid: the
    ridge and its bloom, a tree, a paddy stalk over its rows, a wave under
    the moon, a sun over a dune. Solid shapes only — they read at 14px and
    sit inside a bubble. Decorative: the button around it carries the name. */
const MARKS: Record<ThinaiKey, React.ReactNode> = {
  kurinji: (
    <>
      <path d="M1.5 20 9 7.5l3.6 5.9 2.6-4.1L22.5 20Z" />
      <circle cx="18" cy="5" r="2" />
    </>
  ),
  mullai: (
    <>
      {/* the mullai jasmine: five petals round a small heart */}
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="12" cy="6.6" rx="3.3" ry="4.6" transform={`rotate(${r} 12 12)`} />
      ))}
    </>
  ),
  marutham: (
    <>
      <path d="M12 3c2.6 2.2 2.6 6.4 0 9.4-2.6-3-2.6-7.2 0-9.4Z" />
      <path d="M6.2 7.4c2.6.4 4.4 2.6 4.6 5.4-2.7-.3-4.6-2.5-4.6-5.4ZM17.8 7.4c0 2.9-1.9 5.1-4.6 5.4.2-2.8 2-5 4.6-5.4Z" />
      <rect x="2.5" y="15" width="19" height="2.4" rx="1.2" />
      <rect x="2.5" y="19" width="19" height="2.4" rx="1.2" />
    </>
  ),
  neytal: (
    <>
      <path d="M17.5 2.5a4 4 0 1 0 3.6 5.8 3.2 3.2 0 1 1-3.6-5.8Z" />
      <path d="M1.5 13.5c2.6 0 2.6-2.6 5.25-2.6s2.6 2.6 5.25 2.6 2.6-2.6 5.25-2.6 2.6 2.6 5.25 2.6v3c-2.6 0-2.6-2.6-5.25-2.6S14.6 16.5 12 16.5s-2.6-2.6-5.25-2.6S4.1 16.5 1.5 16.5Z" />
      <path d="M1.5 19c2.6 0 2.6-2 5.25-2s2.6 2 5.25 2 2.6-2 5.25-2 2.6 2 5.25 2v2.5h-21Z" />
    </>
  ),
  palai: (
    <>
      {/* a low sun going down behind the dunes */}
      <path d="M5.5 14.5a6.5 6.5 0 0 1 13 0Z" />
      <path d="M1.5 21.5c2.8-3.6 6.6-4.6 10-2.6 3.4 2 6.6 1.6 11-1.6v4.2Z" />
      <rect x="1.5" y="15.7" width="21" height="1.5" rx=".75" />
    </>
  ),
};

export function TinaiMark({ tinai, size = 20, className = "" }: { tinai: ThinaiKey; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {MARKS[tinai]}
    </svg>
  );
}
