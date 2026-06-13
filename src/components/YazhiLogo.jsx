"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

function randomOffset(range) {
  return (Math.random() - 0.5) * range * 2;
}

function FloatingBubble({ cx, cy, r }) {
  const [target, setTarget] = useState({
    x: randomOffset(8),
    y: randomOffset(8),
  });

  const pickNewTarget = useCallback(() => {
    setTarget({ x: randomOffset(8), y: randomOffset(8) });
  }, []);

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="currentColor"
      animate={{ x: target.x, y: target.y }}
      transition={{
        duration: 3 + Math.random() * 3,
        ease: "easeInOut",
      }}
      onAnimationComplete={pickNewTarget}
    />
  );
}

const YazhiLogo = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <FloatingBubble cx={50} cy={50} r={26} />
      <FloatingBubble cx={140} cy={40} r={35} />
      <FloatingBubble cx={95} cy={145} r={48} />
    </svg>
  );
};

export default YazhiLogo;
