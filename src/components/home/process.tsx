"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { process, stackLogos } from "@/data/services";
import { Sparkle } from "@/components/brand/logo";
import { SplitReveal } from "@/components/ui/split-reveal";

/**
 * How a project runs. A single path draws itself across the four stages as the
 * section is scrolled, and each stage lights up when the line reaches it.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const path = root.current!.querySelector(desktop ? "[data-path-h]" : "[data-path-v]");
          const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current!.querySelector("[data-steps]"),
              start: "top 75%",
              end: desktop ? "bottom 60%" : "bottom 70%",
              scrub: 0.6,
            },
          });
          if (desktop) tl.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: steps.length });
          else tl.fromTo(path, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: steps.length });
          steps.forEach((step, i) => {
            tl.fromTo(
              step,
              { autoAlpha: 0.2, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
              i + 0.1,
            ).fromTo(
              step.querySelector("[data-node]"),
              { scale: 0, rotate: -90 },
              { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
              i,
            );
          });

          gsap.from(root.current!.querySelectorAll("[data-logo]"), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.04,
            duration: 0.8,
            scrollTrigger: { trigger: root.current!.querySelector("[data-logos]"), start: "top 85%", once: true },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="shell scroll-mt-24 py-28 md:py-40" aria-labelledby="process-title">
      <SplitReveal id="process-title" className="display-lg max-w-[13ch]">
        How a project <span className="text-outline">moves.</span>
      </SplitReveal>

      <div data-steps className="@container relative mt-16 md:mt-24">
        {/* Desktop: a wave that runs through all four stages */}
        <svg
          className="pointer-events-none absolute left-0 top-0 hidden h-auto w-full md:block"
          viewBox="0 0 1000 64"
          aria-hidden="true"
        >
          <path d="M0 32 H1000" stroke="var(--color-line-strong)" strokeWidth="1" fill="none" />
          <path
            data-path-h
            d="M0 8 Q 62.5 8 125 32 T 250 56 T 375 32 T 500 8 T 625 32 T 750 56 T 875 32 T 1000 8"
            stroke="var(--color-indigo)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* Mobile: a straight rail down the left edge */}
        <div className="pointer-events-none absolute bottom-0 left-[11px] top-0 w-px bg-line-strong md:hidden" aria-hidden="true">
          <div data-path-v className="h-full w-[2px] origin-top bg-indigo" />
        </div>

        <ol className="grid gap-14 md:grid-cols-4 md:gap-0">
          {process.map((step) => (
            <li key={step.title} data-step className="relative pl-12 md:px-4 md:pt-[calc(6.4cqw+2.5rem)]">
              <span
                data-node
                className="absolute left-0 top-0 grid size-6 place-items-center text-indigo md:left-[calc(50%-1rem)] md:top-[calc(3.2cqw-1rem)] md:size-8"
              >
                <Sparkle className="size-full" />
              </span>
              <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{step.title}</h3>
              <p className="mt-4 max-w-[34ch] leading-relaxed text-mute">{step.body}</p>
              <span className="chip mt-5 !text-paper">{step.output}</span>
            </li>
          ))}
        </ol>
      </div>

      <div data-logos className="mt-28 md:mt-40">
        <h3 className="max-w-[24ch] font-display text-2xl font-bold tracking-tight md:text-3xl">
          Built on tools that scale with you.
        </h3>
        <ul className="mt-10 grid grid-cols-4 gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-8">
          {stackLogos.map((logo) => (
            <li key={logo.file} data-logo className="group grid aspect-square place-items-center bg-ink">
              <span
                role="img"
                aria-label={logo.name}
                title={logo.name}
                className="logo-mask size-8 text-mute transition-colors duration-300 group-hover:text-paper md:size-10"
                style={{ "--logo": `url(/stack/${logo.file}.svg)` } as React.CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
