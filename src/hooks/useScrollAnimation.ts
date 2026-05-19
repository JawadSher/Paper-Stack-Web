"use client";

import { useEffect, useRef } from "react";
import { useAnimation, useInView } from "framer-motion";

export function useScrollAnimation() {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount: 0.15, once: true });

  useEffect(() => {
    if (inView) {
      void controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls };
}
