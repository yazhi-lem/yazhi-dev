import Image from "next/image";
import { Bubble } from "../core/Bubble";
import { T, type BiText } from "../core/Text";

const ART = {
  sleepy: "/yazh/yazh-sleepy.png",
  thinking: "/yazh/yazh-thinking.png",
  surprised: "/yazh/yazh-surprised.png",
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
      <Image src={ART[art]} alt="" width={88} height={88} className="h-20 w-20 rounded-2xl object-cover opacity-90" />
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
