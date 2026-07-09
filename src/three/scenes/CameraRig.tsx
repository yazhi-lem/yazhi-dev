"use client";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScrollProgress } from "@/three/hooks/useScrollProgress";
import { usePointerSway } from "@/three/hooks/usePointerSway";
import { WORLD_LEN, ZONE_LEN } from "@/three/materials/zones";

/** Scroll = travel. Page progress drives the camera down the corridor
    through all five landscapes; a window-level pointer/touch sway plus a
    slow idle drift add the free-look, so the world feels explorable on
    every device — mouse, finger, or hands-off — rather than on rails. */
export function CameraRig() {
  const progress = useScrollProgress();
  const sway = usePointerSway();
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Idle drift keeps the world alive with no input at all — essential on
    // touch devices, where there is no hovering pointer to sway the camera.
    const t = state.clock.elapsedTime;
    const px = sway.current.x + Math.sin(t * 0.11) * 0.35;
    const py = sway.current.y + Math.cos(t * 0.08) * 0.18;

    const targetZ = 6 - progress.current * (WORLD_LEN - ZONE_LEN * 0.4);
    // smooth travel — camera sits lower and looks down into the land so the
    // terrain fills the frame and its motion reads clearly as you scroll
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.9, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 6.5 + py * 1.2, 2.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 3, 2.2, delta);
    look.current.set(px * 7, 3.4, camera.position.z - 34);
    camera.lookAt(look.current);
  });

  return null;
}
