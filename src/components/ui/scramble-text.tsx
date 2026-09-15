"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Label that decodes itself on hover or focus of its closest link/button. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const trigger = el?.closest("a, button") ?? el;
      if (!el || !trigger) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const run = () =>
          gsap.to(el, {
            duration: 0.6,
            scrambleText: { text, chars: "CRAYO*+#", speed: 0.6, revealDelay: 0.1 },
            ease: "none",
            overwrite: true,
          });
        trigger.addEventListener("pointerenter", run);
        trigger.addEventListener("focus", run);
        return () => {
          trigger.removeEventListener("pointerenter", run);
          trigger.removeEventListener("focus", run);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [text] },
  );

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
