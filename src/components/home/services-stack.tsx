"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ServiceVisual } from "./service-visuals";
import { cn } from "@/lib/cn";

const surfaces = [
  "bg-navy-2",
  "bg-[linear-gradient(145deg,#2c22c9_0%,#4b3fff_55%,#6a60ff_100%)]",
  "bg-navy-3",
  "bg-[radial-gradient(120%_120%_at_100%_0%,#1b2247_0%,#0c1229_60%)]",
];

/**
 * Sticky stack: each service pins at the top of the viewport and the next card
 * slides over it, pushing the previous one back. Desktop only; phones get a
 * simple vertical list because tall cards cannot pin on short screens.
 */
export function ServicesStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root.current);
        const last = cards[cards.length - 1];
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: last,
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
          // Push the outgoing card back and shade it (kept opaque so older cards never ghost through).
          const push = { ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true } };
          gsap.to(card.querySelector("[data-card-inner]"), { scale: 0.92, ...push });
          gsap.to(card.querySelector("[data-shade]"), { opacity: 0.7, ...push });
        });
        cards.forEach((card) => {
          gsap.from(card.querySelector("[data-visual]"), {
            yPercent: 12,
            rotate: -3,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="scroll-mt-24 pb-24 md:pb-40" aria-labelledby="services-title">
      <div className="shell pb-12 md:pb-20">
        <SplitReveal id="services-title" className="display-lg max-w-[14ch]">
          Four services. <span className="text-indigo">One team.</span>
        </SplitReveal>
      </div>

      <div className="shell flex flex-col gap-6 md:gap-0">
        {services.map((service, i) => (
          <article
            key={service.key}
            data-stack-card
            className="relative md:flex md:min-h-[100dvh] md:items-center md:py-[6vh]"
            // Later cards must paint above the pinned (position: fixed) ones.
            style={{ zIndex: i + 1 }}
            aria-labelledby={`service-${service.key}`}
          >
            <div
              data-card-inner
              className={cn(
                "relative grid w-full origin-top gap-10 overflow-hidden rounded-[var(--radius-panel)] border border-line p-6 sm:p-10 md:min-h-[82dvh] md:grid-cols-2 md:items-center md:gap-12 md:p-14",
                surfaces[i],
              )}
            >
              <div className="flex flex-col gap-6">
                <h3 id={`service-${service.key}`} className="display-md text-paper">
                  {service.title}
                </h3>
                <p className={cn("max-w-[42ch] text-lg leading-relaxed", i === 1 ? "text-paper/85" : "text-mute")}>
                  {service.pitch}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className={cn("chip", i === 1 && "!border-paper/35 !text-paper")}>
                      {d}
                    </li>
                  ))}
                </ul>
                <TransitionLink
                  href={`/services/${service.slug}`}
                  className={cn("group mt-2 inline-flex w-fit items-center gap-2 font-semibold", i === 1 ? "text-white" : "text-paper")}
                >
                  <span className="link-underline">Explore {service.short.toLowerCase()}</span>
                  <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </TransitionLink>
              </div>
              <ServiceVisual kind={service.key} />
              <div data-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
