"use client";
import { useEffect, useRef } from "react";

/** Normalized −1..1 pointer/touch position, tracked on the window.

    The WebGL canvas sits behind the page content (`-z-10`), so R3F's own
    canvas pointer events never fire — which is why the free-look sway only
    ever worked from a mouse hovering the page, and not at all on touch.
    Listening on the window instead means both a desktop mouse and a finger
    dragging the page drive the same sway. Combined with the idle drift in
    CameraRig, the world stays explorable without any pointer at all. */
export function usePointerSway() {
  const sway = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const set = (clientX: number, clientY: number) => {
      sway.current.x = (clientX / window.innerWidth) * 2 - 1;
      sway.current.y = -((clientY / window.innerHeight) * 2 - 1);
    };
    const onPointer = (e: PointerEvent) => set(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) set(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return sway;
}
