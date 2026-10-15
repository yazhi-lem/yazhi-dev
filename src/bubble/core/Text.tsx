import { Bi } from "@/components/ui/Bi";

/** Bubble copy is either a plain string or a Tamil/English pair.
    Pairs follow the site-wide TAM / ENG / BOTH toggle via <Bi>. Keeping
    this a plain-data union is what lets page specs stay JSON. */
export type BiText = string | { ta: string; en: string };

export function T({
  text,
  separator = " · ",
  display = false,
}: {
  text: BiText;
  separator?: string;
  display?: boolean;
}) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <Bi
      ta={text.ta}
      en={text.en}
      display={display}
      separator={<span aria-hidden className="text-ivory-dim/60">{separator}</span>}
    />
  );
}

/** Plain-string form, for attributes (aria-label, title, metadata). */
export function plain(text: BiText): string {
  return typeof text === "string" ? text : text.en;
}
