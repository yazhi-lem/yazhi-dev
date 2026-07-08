"use client";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScrollProgress } from "@/three/hooks/useScrollProgress";
import { WORLD_LEN, ZONE_LEN } from "@/three/materials/zones";

/** Scroll = travel. Page progress drives the camera down the corridor
    through all five landscapes; pointer adds a free-look sway so the
    world feels explorable rather than on rails. */
export function CameraRig() {
  const progress = useScrollProgress();
  const { camera, pointer } = useThree();
  const look = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const targetZ = 6 - progress.current * (WORLD_LEN - ZONE_LEN * 0.4);
    // smooth travel
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.9, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 9 + pointer.y * 1.2, 2.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 3, 2.2, delta);
    look.current.set(pointer.x * 7, 6.2, camera.position.z - 36);
    camera.lookAt(look.current);
  });

  return null;
}
