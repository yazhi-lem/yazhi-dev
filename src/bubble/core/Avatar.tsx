import Image from "next/image";
import { toneStyle, type Tone } from "../tone";

/** Yazh's moods as transparent cutouts (public/yazh/cutout, generated
    from the original art by flood-filling the black backdrop). */
export const YAZH_MOODS = {
  waving: "/yazh/cutout/yazh-waving.webp",
  thinking: "/yazh/cutout/yazh-thinking.webp",
  sleepy: "/yazh/cutout/yazh-sleepy.webp",
  surprised: "/yazh/cutout/yazh-surprised.webp",
  hero: "/yazh/cutout/yazhi.webp",
} as const;

export type YazhMood = keyof typeof YAZH_MOODS;

/** Yazh in a soft orb. Decorative by default; pass `label` when the mood
    carries meaning (e.g. an assistant's state). */
export function Avatar({
  mood = "waving",
  size = 56,
  tone = "kurinji",
  label,
}: {
  mood?: YazhMood;
  size?: number;
  tone?: Tone;
  label?: string;
}) {
  return (
    <span
      style={toneStyle(tone, { width: size, height: size })}
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-[color:var(--tone)]/30 bg-[color:var(--tone)]/15"
    >
      <Image
        src={YAZH_MOODS[mood]}
        alt={label ?? ""}
        width={size * 2}
        height={size * 2}
        className="h-[118%] w-[118%] max-w-none translate-y-[6%] object-contain"
      />
    </span>
  );
}
