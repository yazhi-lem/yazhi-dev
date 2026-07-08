"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KurinjiScene, MullaiScene, MaruthamScene, NeytalScene, PalaiScene } from "./webgl/ThinaiScenes";

export default function WebGLBackground() {
  const [theme, setTheme] = useState<string>("ocean");

  useEffect(() => {
    // Read initial theme
    const htmlTheme = document.documentElement.getAttribute("data-theme") || "ocean";
    setTheme(htmlTheme);

    // Watch for changes to the data-theme attribute on the HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "ocean");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {theme === "kurinji" && <KurinjiScene />}
        {theme === "mullai" && <MullaiScene />}
        {theme === "marutham" && <MaruthamScene />}
        {(theme === "neytal" || theme === "ocean" || theme === "puram" || theme === "agam") && <NeytalScene />}
        {theme === "palai" && <PalaiScene />}
      </Canvas>
    </div>
  );
}
