"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Observatory easing presets
export const EASE = {
  smooth: "power2.inOut",
  snap: "power3.out",
  spring: "back.out(1.4)",
  out: "power2.out",
} as const;

// Observatory duration presets (seconds)
export const DURATION = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  xslow: 0.7,
  scene: 1.2,
} as const;

export { gsap, ScrollTrigger };
