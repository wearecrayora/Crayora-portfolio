"use client";

import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";
import { Magnetic } from "@/components/ui/magnetic";
import { TransitionLink } from "@/components/ui/transition-link";
import { SplitReveal } from "@/components/ui/split-reveal";

/** Closing call to action: an indigo disc floods the section as it scrolls in. */
export function CtaBlock() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-flood]",
          { scale: 0.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 10%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden py-32 md:py-48" aria-labelledby="cta-title">
      <div
        data-flood
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[170vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo"
      />
      <div className="shell flex flex-col items-start gap-10 md:gap-14">
        <SplitReveal id="cta-title" by="words" className="display-xl max-w-[12ch] text-white">
          Got an idea? Let&apos;s make it loud.
        </SplitReveal>
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 text-lg text-white/80">
            <a href={`mailto:${site.email}`} className="link-underline w-fit text-white">
              {site.email}
            </a>
            <a href={site.phoneHref} className="link-underline w-fit">
              {site.phone}
            </a>
          </div>
          <Magnetic strength={0.45}>
            <TransitionLink
              href="/contact"
              className="group grid size-44 place-items-center rounded-full bg-paper text-center text-ink transition-transform duration-300 active:scale-95 md:size-56"
            >
              <span className="flex flex-col items-center gap-2 font-display text-xl font-extrabold tracking-tight md:text-2xl">
                <ArrowUpRight weight="bold" className="size-7 transition-transform duration-500 group-hover:rotate-45" />
                Start a project
              </span>
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
