"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ServiceVisual } from "./service-visuals";
import { cn } from "@/lib/cn";
import { fitHeading } from "@/lib/fit-heading";

// Four distinct surfaces on the light canvas; the indigo card is the single colour block.
const surfaces = [
  "glass-strong",
  "bg-[linear-gradient(145deg,#2c22c9_0%,#4b3fff_55%,#6a60ff_100%)] shadow-[var(--shadow-lift)]",
  // Extra blur: this card slides over the indigo one, which should melt into colour.
  "glass-violet [-webkit-backdrop-filter:blur(56px)_saturate(180%)] [backdrop-filter:blur(56px)_saturate(180%)]",
  "glass-strong bg-[radial-gradient(120%_120%_at_100%_0%,rgb(190_178_255/0.55)_0%,rgb(255_253_250/0.9)_60%)]",
];

/**
 * Large screens: a sticky stack, each service pins at the top of the viewport and
 * the next card slides over it, pushing the previous one back. Phones and
 * tablets: cards are taller than the screen, so instead of pinning each one
 * unfolds into place as it scrolls in. Both are separate matchMedia branches.
 */
export function ServicesStack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
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
          gsap.to(card.querySelector("[data-shade]"), { opacity: 0.55, ...push });
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

      // Phones and tablets: no pinning (cards are taller than the screen), so each card
      // rises and unfolds as it enters, and its visual and chips follow.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stack-card]", root.current).forEach((card) => {
          const inner = card.querySelector("[data-card-inner]");
          gsap.fromTo(
            inner,
            { y: 90, scale: 0.9, rotateX: 12, autoAlpha: 0.35, transformPerspective: 900 },
            { y: 0, scale: 1, rotateX: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: card, start: "top 98%", end: "top 55%", scrub: 0.6 } },
          );
          gsap.from(card.querySelector("[data-visual]"), {
            y: 70,
            scale: 0.85,
            rotate: 4,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 80%", end: "center 55%", scrub: 0.6 },
          });
          gsap.from(card.querySelectorAll(".chip"), {
            y: 16,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.5,
            scrollTrigger: { trigger: card, start: "top 60%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="scroll-mt-24 overflow-x-clip pb-24 md:pb-40" aria-labelledby="services-title">
      <div className="shell pb-12 md:pb-20">
        <SplitReveal id="services-title" className="display-lg max-w-[14ch]">
          Four services. <span className="text-indigo">One team.</span>
        </SplitReveal>
      </div>

      {/* No perspective/transform here: it would become the containing block for the
          pinned (position: fixed) cards and they would scroll away. Mobile tilt uses transformPerspective. */}
      <div className="shell flex flex-col gap-6 lg:gap-0">
        {services.map((service, i) => (
          <article
            key={service.key}
            data-stack-card
            className="relative lg:flex lg:min-h-[100dvh] lg:items-center lg:py-[6vh]"
            // Later cards must paint above the pinned (position: fixed) ones.
            style={{ zIndex: i + 1 }}
            aria-labelledby={`service-${service.key}`}
          >
            <div
              data-card-inner
              className={cn(
                "relative grid w-full origin-top gap-10 overflow-hidden rounded-[var(--radius-panel)] border border-white/60 p-6 sm:p-10 lg:min-h-[82dvh] lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14",
                surfaces[i],
              )}
            >
              {/* @container + fitHeading: the title is sized to this half-width column, not the viewport. */}
              <div className="@container flex min-w-0 flex-col gap-6">
                <h3
                  id={`service-${service.key}`}
                  className={cn("display-md", i === 1 ? "text-white" : "text-ink")}
                  style={{ fontSize: fitHeading(service.title, "clamp(2rem, 4.2vw, 4rem)") }}
                >
                  {service.title}
                </h3>
                <p className={cn("max-w-[42ch] text-lg leading-relaxed", i === 1 ? "text-white/85" : "text-mute")}>
                  {service.pitch}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className={cn("chip", i === 1 && "!border-white/35 !text-white")}>
                      {d}
                    </li>
                  ))}
                </ul>
                <TransitionLink
                  href={`/services/${service.slug}`}
                  className={cn("group mt-2 inline-flex w-fit items-center gap-2 font-semibold", i === 1 ? "text-white" : "text-ink")}
                >
                  <span className="link-underline">Explore {service.short.toLowerCase()}</span>
                  <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </TransitionLink>
              </div>
              <ServiceVisual kind={service.key} />
              <div data-shade className="pointer-events-none absolute inset-0 bg-canvas opacity-0" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
