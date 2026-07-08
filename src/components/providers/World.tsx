"use client";
import dynamic from "next/dynamic";

/** SSR-safe entry for the WebGL world. While loading (and forever, under
    reduced motion or without WebGL) the DOM gradient system carries the
    page — the world is progressive enhancement, never a dependency. */
const ThinaiWorld = dynamic(() => import("@/three/scenes/ThinaiWorld"), { ssr: false });

export function World() {
  return <ThinaiWorld />;
}
