"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Sparkle } from "@/components/brand/logo";

const items = ["Websites", "Android & iOS apps", "Social media", "Custom software", "Content shoots", "E-commerce"];

/**
 * The page's single marquee: what we do, on a loop. Scrolling speeds it up and
 * flips its direction to match the scroll, so it reads as part of the motion.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        let direction = 1;
        const st = ScrollTrigger.create({
          onUpdate(self) {
            const v = self.getVelocity();
            if (v !== 0) direction = v > 0 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(v) / 350, 5);
            gsap.to(loop, { timeScale: boost * direction, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.25, overwrite: false });
          },
        });
        return () => {
          st.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (hidden: boolean) =>
    items.map((item, i) => (
      <li key={`${item}-${hidden}`} className="flex items-center gap-8 pr-8 md:gap-12 md:pr-12" aria-hidden={hidden || undefined}>
        <span className={i % 2 ? "text-outline" : "text-ink"}>{item}</span>
        <Sparkle className="size-8 shrink-0 text-indigo md:size-12" />
      </li>
    ));

  // The outer wrapper clips the endless track; the band is wider than the screen
  // so its tilted ends never show. Without the clip, phones zoom the page out.
  return (
    <div ref={root} className="overflow-hidden py-6">
      <div className="glass relative -mx-[5vw] -rotate-2 overflow-hidden !rounded-none !border-x-0 py-6 md:py-9">
        <h2 className="sr-only">What we do</h2>
        <ul data-track className="flex w-max font-display text-5xl font-extrabold tracking-tight md:text-7xl">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </div>
  );
}
