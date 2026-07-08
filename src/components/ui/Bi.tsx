"use client";
import { useLang } from "@/lib/i18n";
import type { ElementType, ReactNode } from "react";
import React from "react";

/** Bilingual text primitive. Renders Tamil and/or English according to
    the global TAM / ENG / BOTH mode, with correct lang attributes so
    Tamil line-height rules apply. */
export function Bi({
  ta,
  en,
  as: Tag = "span",
  className = "",
  taClass = "",
  enClass = "",
  display = false,
  separator = null,
}: {
  ta: ReactNode;
  en: ReactNode;
  as?: ElementType;
  className?: string;
  taClass?: string;
  enClass?: string;
  display?: boolean;
  separator?: ReactNode;
}) {
  const { lang } = useLang();
  const d = display ? "display" : "";

  const content = (
    <>
      {lang !== "en" && (
        <span lang="ta" className={`${d} ${taClass}`.trim()}>
          {ta}
        </span>
      )}
      {lang === "both" && separator}
      {lang !== "ta" && (
        <span lang="en" className={`${d} ${enClass}`.trim()}>
          {en}
        </span>
      )}
    </>
  );

  return React.createElement(Tag, { className }, content);
}
