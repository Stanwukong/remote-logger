"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE, DURATION } from "@/lib/gsap-config";

/**
 * Scroll reveal — fades elements in from below when they enter the viewport.
 * Attach the returned ref to the container element.
 * Children with `data-reveal` attribute will be animated.
 */
export function useScrollReveal(options?: {
  y?: number;
  stagger?: number;
  threshold?: number;
  duration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    y = 32,
    stagger = 0.08,
    threshold = 0.15,
    duration = 0.6,
  } = options || {};

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll("[data-reveal]");
      if (elements.length === 0) return;

      gsap.set(elements, { opacity: 0, y });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `top ${100 - threshold * 100}%`,
        once: true,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: EASE.smooth,
          });
        },
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  return containerRef;
}

/**
 * Count-up animation — animates a number from 0 to target value.
 * Returns a ref to attach to the display element and a trigger function.
 */
export function useCountUp(options?: {
  duration?: number;
  separator?: string;
}) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const { duration = DURATION.scene, separator = "," } = options || {};

  const formatNumber = useCallback(
    (num: number) => {
      return Math.round(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },
    [separator]
  );

  useGSAP(
    () => {
      if (!elementRef.current) return;

      const target = parseFloat(
        elementRef.current.dataset.target || "0"
      );
      if (isNaN(target)) return;

      ScrollTrigger.create({
        trigger: elementRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration,
            ease: EASE.out,
            onUpdate: () => {
              if (elementRef.current) {
                elementRef.current.textContent = formatNumber(obj.val);
              }
            },
          });
        },
      });
    },
    { scope: elementRef, dependencies: [] }
  );

  return elementRef;
}

/**
 * Hero load sequence — orchestrated GSAP timeline for hero section.
 * Returns a ref to attach to the hero container.
 */
export function useHeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      const canvas = containerRef.current.querySelector("[data-hero-canvas]");
      const badge = containerRef.current.querySelector("[data-hero-badge]");
      const headlines =
        containerRef.current.querySelectorAll("[data-hero-headline]");
      const sub = containerRef.current.querySelector("[data-hero-sub]");
      const ctas = containerRef.current.querySelector("[data-hero-ctas]");
      const trust = containerRef.current.querySelector("[data-hero-trust]");
      const preview = containerRef.current.querySelector(
        "[data-hero-preview]"
      );

      // Set initial states
      gsap.set(
        [canvas, badge, ...Array.from(headlines), sub, ctas, trust, preview].filter(Boolean),
        { opacity: 0 }
      );

      if (badge) gsap.set(badge, { y: 12 });
      if (headlines.length)
        gsap.set(headlines, { y: 16 });
      if (ctas) gsap.set(ctas, { y: 12 });
      if (preview) gsap.set(preview, { y: 40 });

      // Choreography: 0ms → 1100ms
      if (canvas) tl.to(canvas, { opacity: 0.6, duration: 0.8 }, 0);
      if (badge) tl.to(badge, { opacity: 1, y: 0, duration: 0.6 }, 0.2);

      headlines.forEach((el, i) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.8 }, 0.38 + i * 0.08);
      });

      if (sub) tl.to(sub, { opacity: 1, duration: 0.4 }, 0.7);
      if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.4 }, 0.85);
      if (trust) tl.to(trust, { opacity: 1, duration: 0.3 }, 0.95);

      if (preview) {
        tl.to(
          preview,
          { opacity: 1, y: 0, duration: 0.7, ease: EASE.smooth },
          1.1
        );
      }
    },
    { scope: containerRef, dependencies: [] }
  );

  return containerRef;
}

/**
 * Stagger reveal — generic stagger for grids/lists.
 * Elements with `data-stagger` inside the container are animated.
 */
export function useStaggerReveal(options?: {
  stagger?: number;
  y?: number;
  duration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { stagger = 0.08, y = 24, duration = 0.8 } = options || {};

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const items = containerRef.current.querySelectorAll("[data-stagger]");
      if (items.length === 0) return;

      gsap.set(items, { opacity: 0, y });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: EASE.smooth,
          });
        },
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  return containerRef;
}
