/** Yazh (யாழி / yaali) — the temple guardian-beast the initiative is named
    for, distilled to a very abstract single-weight outline. No fills, just
    the gesture of the creature: reared head, curled trunk-horn, arched spine,
    planted haunches and a spiralling tail. Rendered low-opacity at the left
    and right edges of the footer so the pair appears to *stand* on the
    sediment strata, framing the deep-ocean ground between them.

    `flip` mirrors it for the opposite side; colour is inherited via
    currentColor so callers tint it with text utilities. */
export function YazhCreature({
  className = "",
  flip = false,
  height = 260,
}: {
  className?: string;
  flip?: boolean;
  height?: number;
}) {
  return (
    <svg
      width={height * (150 / 260)}
      height={height}
      viewBox="0 0 150 260"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* spine — reared body arching up from planted haunch to raised head */}
      <path d="M96 250 C 78 214, 70 190, 74 162 C 78 132, 100 118, 104 88 C 107 64, 96 48, 78 40" />
      {/* belly / underline echoing the spine, giving the body its mass */}
      <path d="M112 250 C 100 216, 96 194, 100 168 C 104 140, 122 126, 124 100" opacity="0.55" />
      {/* head crest + curling trunk-horn (the yaali's signature scroll) */}
      <path d="M78 40 C 60 34, 46 40, 40 54 C 35 66, 40 78, 52 80 C 62 82, 68 74, 64 66 C 61 60, 54 60, 52 66" />
      {/* open jaw */}
      <path d="M78 40 C 84 52, 82 62, 72 66" opacity="0.7" />
      {/* eye */}
      <circle cx="70" cy="52" r="2.2" fill="currentColor" stroke="none" />
      {/* raised foreleg, pawing inward */}
      <path d="M92 132 C 78 140, 66 150, 60 166 C 57 174, 60 180, 66 180" opacity="0.7" />
      {/* planted hind leg into the sediment */}
      <path d="M100 210 C 108 226, 112 240, 110 254" />
      <path d="M96 250 C 92 254, 88 256, 82 256" opacity="0.7" />
      {/* haunch */}
      <path d="M74 188 C 62 194, 58 210, 66 222 C 72 230, 84 228, 90 220" opacity="0.6" />
      {/* spiralling tail flicking up behind */}
      <path d="M112 234 C 130 224, 138 202, 130 184 C 124 170, 108 168, 104 182 C 101 192, 110 198, 116 192" opacity="0.65" />
      {/* mane / detail flecks along the crest — abstract "details" */}
      <path d="M96 96 l 10 -5 M100 118 l 11 -4 M92 140 l 10 -3" opacity="0.4" />
    </svg>
  );
}
