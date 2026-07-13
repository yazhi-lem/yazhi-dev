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
    // Coarse pointers (touch) drag the same gesture that scrolls the page —
    // the finger's on-screen position mid-swipe isn't an intentional "look"
    // input like a hovering mouse is, and following it fought the scroll,
    // reading as the camera snapping around. Touch devices get the idle
    // drift only (see CameraRig); mouse keeps the free-look sway.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onPointer = (e: PointerEvent) => {
      sway.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      sway.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  return sway;
}
