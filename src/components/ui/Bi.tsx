"use client";
import {
  useLang,
  resolveIndic,
  resolveMixed,
  segmentMixed,
  type LText,
} from "@/lib/i18n";
import type { ElementType, ReactNode } from "react";
import React from "react";

/** Bilingual/multilingual text primitive.
 *
 * Preferred usage: pass a `text` LText — it follows the visitor's
 * Indic language and mode, including the "mixed" mode, where an
 * authored code-switched line renders as ONE flowing sentence with
 * honest per-script `lang` attributes.
 *
 * Legacy usage: raw `ta`/`en` props (for composed strings). These
 * only know Tamil, so they render Tamil in indic mode regardless of
 * the chosen language — migrate call sites to `text` as copy gets
 * translated.
 */
export function Bi({
  text,
  ta,
  en,
  as: Tag = "span",
  className = "",
  taClass = "",
  enClass = "",
  mixedClass,
  display = false,
  separator = null,
}: {
  text?: LText;
  ta?: ReactNode;
  en?: ReactNode;
  as?: ElementType;
  className?: string;
  taClass?: string;
  enClass?: string;
  /** Styling for the single-line mixed rendering; defaults to taClass. */
  mixedClass?: string;
  display?: boolean;
  separator?: ReactNode;
}) {
  const { mode, indic } = useLang();
  const d = display ? "display" : "";

  // resolve what to show in each slot
  const indicResolved = text ? resolveIndic(text, indic) : null;
  const indicNode: ReactNode = indicResolved ? indicResolved.value : ta;
  const indicLang = indicResolved ? indicResolved.lang : "ta";
  const enNode: ReactNode = text ? text.en : en;
  const mixedLine = text ? resolveMixed(text, indic) : null;

  let content: ReactNode;
  if (mode === "en") {
    content = (
      <span lang="en" className={`${d} ${enClass}`.trim()}>
        {enNode}
      </span>
    );
  } else if (mode === "indic") {
    content = (
      <span lang={indicLang} className={`${d} ${taClass}`.trim()}>
        {indicNode}
      </span>
    );
  } else if (mixedLine) {
    // mixed mode with an authored code-switched line: one flowing
    // sentence, each script run carrying its own lang attribute
    content = (
      <span className={`${d} ${mixedClass ?? taClass}`.trim()}>
        {segmentMixed(mixedLine, indic).map((seg, i) => (
          <span key={i} lang={seg.lang}>
            {seg.text}
          </span>
        ))}
      </span>
    );
  } else {
    // mixed mode, no authored line yet: stacked bilingual fallback
    content = (
      <>
        <span lang={indicLang} className={`${d} ${taClass}`.trim()}>
          {indicNode}
        </span>
        {separator}
        <span lang="en" className={`${d} ${enClass}`.trim()}>
          {enNode}
        </span>
      </>
    );
  }

  return React.createElement(Tag, { className }, content);
}
