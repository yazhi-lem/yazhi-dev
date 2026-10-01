import Image from "next/image";
import { Bubble } from "../core/Bubble";
import { T, type BiText } from "../core/Text";

// transparent cutouts — they sit on any theme's bubble
const ART = {
  sleepy: "/yazh/cutout/yazh-sleepy.webp",
  thinking: "/yazh/cutout/yazh-thinking.webp",
  surprised: "/yazh/cutout/yazh-surprised.webp",
} as const;

/** "Nothing here yet", said honestly — with Yazh keeping it company. */
export function EmptyState({
  title,
  body,
  art = "sleepy",
}: {
  title: BiText;
  body?: BiText;
  art?: keyof typeof ART;
}) {
  return (
    <Bubble size="lg" className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
      <Image src={ART[art]} alt="" width={192} height={192} className="h-24 w-24 object-contain" />
      <div>
        <p className="font-display text-xl text-ivory">
          <T text={title} />
        </p>
        {body && (
          <p className="mt-1 text-ivory-dim">
            <T text={body} />
          </p>
        )}
      </div>
    </Bubble>
  );
}
