"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis from GSAP's ticker so ScrollTrigger and Lenis share a single
 * animation frame. ReactLenis creates its instance in an effect after the first
 * render, so this waits for the instance via useLenis() instead of reading it
 * once on mount (which left Lenis with no frame loop: the wheel did nothing).
 */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Options only feed the client-side Lenis constructor, so reading matchMedia here is safe.
  // Reduced motion keeps Lenis (for programmatic scrolls) but lets the wheel scroll natively.
  const [options] = useState(() => ({
    autoRaf: false,
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));

  return (
    <ReactLenis root options={options}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
