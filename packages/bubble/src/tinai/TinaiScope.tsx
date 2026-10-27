import type { ReactNode } from "react";
import type { ThinaiKey } from "./keys";
import { envVars } from "./environments";

/** Puts everything inside it in one tinai environment: ground, surfaces,
    text, accent and hairline strokes. Change `tinai` and the whole subtree
    cross-fades to the new landscape (the --env-* colours are registered
    with @property in styles/bubble.css). Its colours are light-dark()
    pairs, so it follows the light or dark theme; `scheme` pins one. Nest
    scopes freely. */
export function TinaiScope({
  tinai,
  as: Tag = "div",
  className = "",
  ground = true,
  id,
  scheme,
  children,
}: {
  tinai: ThinaiKey;
  as?: "div" | "section" | "main" | "article" | "aside";
  className?: string;
  /** paint the landscape's ground; false lets an outer scope's ground show through */
  ground?: boolean;
  id?: string;
  /** pin light or dark for this subtree; by default it follows the page */
  scheme?: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <Tag id={id} data-tinai={tinai} data-scheme={scheme} className={`tinai-scope ${ground ? "" : "tinai-clear "}${className}`} style={envVars(tinai)}>
      {children}
    </Tag>
  );
}
