"use client";
import { useEffect, useRef } from "react";

/** The "thinking" mark of Yazhi Chat: five yazh strings that keep sounding
    while a reply is on its way, each a little after the one before it
    (Hairline rule 02). Pure hairline: strokes only, in the landscape's ink.
    Under reduced motion the strings rest, one of them lit. */
export function YazhStrings({ className = "", label = "Thinking" }: { className?: string; label?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll("path[data-string]"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      paths.forEach((p, i) => {
        const x = 4 + i * 7, top = 3 + i * 1.2, bottom = 21;
        // a slow beat moves along the strings; each one rings as it passes
        const beat = Math.max(0, Math.sin(t * 2.2 - i * 0.55));
        const a = beat * beat * 2.4 * Math.sin(t * 42 + i);
        p.setAttribute("d", `M${x} ${top}Q${(x + a).toFixed(2)} ${(top + bottom) / 2} ${x} ${bottom}`);
        p.setAttribute("stroke", beat > 0.75 ? "var(--env-hi)" : "var(--env-edge)");
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 38 24" className={`h-6 w-[38px] ${className}`} role="img" aria-label={label}>
      <path d="M4 21L32 21" fill="none" stroke="var(--env-lo)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 4 + i * 7, top = 3 + i * 1.2;
        return (
          <path
            key={i}
            data-string
            d={`M${x} ${top}Q${x} ${(top + 21) / 2} ${x} 21`}
            fill="none"
            stroke={i === 2 ? "var(--env-hi)" : "var(--env-edge)"}
            strokeWidth={1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
