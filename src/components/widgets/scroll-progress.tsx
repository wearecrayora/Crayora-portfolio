"use client";

import { useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const R = 21;
const CIRC = 2 * Math.PI * R;

/** Floating glass ring that fills with page progress and doubles as back-to-top. */
export function ScrollProgress() {
  const root = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current;
      const ring = el?.querySelector("[data-ring]");
      if (!el || !ring) return;
      gsap.set(el, { autoAlpha: 0, scale: 0.6 });
      gsap.set(ring, { strokeDasharray: CIRC, strokeDashoffset: CIRC });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          gsap.set(ring, { strokeDashoffset: CIRC * (1 - self.progress) });
          const show = self.scroll() > window.innerHeight * 0.8;
          gsap.to(el, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.6, duration: 0.35, overwrite: "auto" });
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <button
      ref={root}
      type="button"
      onClick={() => lenis?.scrollTo(0, { duration: 1.6 })}
      aria-label="Back to top"
      className="glass invisible fixed bottom-4 left-4 z-50 grid size-14 place-items-center rounded-full text-ink md:bottom-6 md:left-6"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={R} fill="none" stroke="var(--color-line-strong)" strokeWidth="2" />
        <circle data-ring cx="24" cy="24" r={R} fill="none" stroke="var(--color-indigo)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <ArrowUp weight="bold" className="relative size-5" />
    </button>
  );
}
