"use client";
import { useEffect, useRef, useState } from "react";
import HL from "./kernel.js";
import type { HairlineFigureDef } from "./types";

/** Hosts one Hairline figure: an isometric line drawing that answers the
    pointer. Does what Hairline's own bench does — injects the stroke
    styles, makes the 400 × 320 svg, mounts the figure and passes its
    read-out up — so figures written to the Hairline rules run unchanged.

    Colours come from the nearest --hairline-* custom properties, which a
    TinaiScope sets from its environment, so a figure always sits in its
    landscape's ink. */
export function HairlineFigure({
  figure,
  intensity = 0.5,
  play = false,
  onRead,
  className = "",
}: {
  figure: HairlineFigureDef;
  /** 0 (subtle) … 1 (strong), mapped onto the figure's own range */
  intensity?: number;
  /** walk the figure's tour until a real pointer arrives */
  play?: boolean;
  onRead?: (text: string) => void;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<{ set: (v: number) => void; destroy: () => void } | null>(null);
  const onReadRef = useRef(onRead);
  const [read, setRead] = useState("rest");

  useEffect(() => {
    onReadRef.current = onRead;
  }, [onRead]);

  const toValue = (i: number) => {
    const [lo, mid, hi] = figure.range;
    const t = Math.min(1, Math.max(0, i));
    return t <= 0.5 ? lo + (t / 0.5) * (mid - lo) : mid + ((t - 0.5) / 0.5) * (hi - mid);
  };

  // mount once per figure
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    HL.inject(document);
    const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
    let text = "rest";
    const readObj = {
      get textContent() {
        return text;
      },
      set textContent(v: string) {
        text = v == null ? "" : String(v);
        setRead(text);
        onReadRef.current?.(text);
      },
    };
    handleRef.current = figure.mount({ stage, svg, read: readObj }, toValue(intensity));
    return () => {
      handleRef.current?.destroy();
      handleRef.current = null;
      svg.remove();
    };
    // intensity is applied by the effect below without remounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figure]);

  useEffect(() => {
    handleRef.current?.set(toValue(intensity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!play || !stage) return;
    const t = HL.tour(stage, figure.tour || HL.LAP, () => {});
    return () => t.stop();
  }, [play, figure]);

  return (
    <figure className={`relative ${className}`}>
      <div ref={stageRef} data-hairline={figure.name} role="img" aria-label={figure.means} />
      <figcaption className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] tabular-nums text-[color:var(--env-text-dim)]" aria-live="polite">
        {read}
      </figcaption>
    </figure>
  );
}
