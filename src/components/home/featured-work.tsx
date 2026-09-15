"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featuredProjects, projects } from "@/data/projects";
import { countryByCode } from "@/data/countries";
import { TransitionLink } from "@/components/ui/transition-link";
import { fitHeading } from "@/lib/fit-heading";

/**
 * Horizontal reel: the section pins and vertical scroll pans the track, on every
 * screen size. Each screenshot also drifts inside its frame for depth. With
 * reduced motion it falls back to native swipe-to-scroll with snap points.
 */
export function FeaturedWork() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        // Travel until the last panel's right edge sits one gutter from the viewport edge.
        const distance = () => {
          const last = t.lastElementChild as HTMLElement;
          return last.offsetLeft + last.offsetWidth + window.innerWidth * 0.04 - window.innerWidth;
        };
        const pan = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // Phones: settle on the nearest card so each one lands centred.
            snap: window.matchMedia("(max-width: 767px)").matches
              ? {
                  snapTo: (value: number) => {
                    const total = distance();
                    const points = Array.from(t.children, (el) => {
                      const c = el as HTMLElement;
                      return Math.min(1, Math.max(0, (c.offsetLeft + c.offsetWidth / 2 - window.innerWidth / 2) / total));
                    });
                    return points.reduce((best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best), 0);
                  },
                  duration: { min: 0.2, max: 0.6 },
                  ease: "power2.out",
                }
              : undefined,
          },
        });

        // Each card tilts up into place as it slides in. The screenshot itself is never
        // scaled or cropped, so the whole site is always visible in its frame.
        gsap.utils.toArray<HTMLElement>("[data-reel-card]", t).forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.86, rotate: 3, autoAlpha: 0.55 },
            {
              scale: 1,
              rotate: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: pan,
                start: "left right",
                end: "center 60%",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <section ref={wrap} className="relative overflow-hidden" aria-labelledby="featured-title">
      <div
        ref={track}
        className="flex h-[100svh] items-center gap-5 px-4 md:gap-8 md:px-[4vw] motion-reduce:h-auto motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-px-4 motion-reduce:overflow-x-auto motion-reduce:pb-16"
      >
        <div className="@container flex w-[80vw] shrink-0 snap-start flex-col justify-center gap-6 md:w-[52vw] lg:w-[34vw]">
          {/* Sized to this panel, not the viewport, so "Selected" never runs into the first card. */}
          <h2 id="featured-title" className="display-lg" style={{ fontSize: fitHeading("Selected", "clamp(2.5rem, 6.4vw, 6.25rem)") }}>
            Selected <span className="text-outline">work</span>
          </h2>
          <p className="max-w-[34ch] text-lg text-mute">
            Six launches from four countries, with the full archive waiting at the end.
          </p>
        </div>

        {featuredProjects.map((project) => {
          const country = countryByCode[project.country];
          return (
            <TransitionLink
              key={project.slug}
              data-reel-card
              href={`/work/${project.slug}`}
              className="group relative flex w-[82vw] shrink-0 snap-start flex-col gap-4 md:w-[64vw] lg:w-[46vw]"
            >
              {/* The frame takes the screenshot's own proportions, so the full image shows uncropped. */}
              <div
                className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface-2 shadow-[var(--shadow-card)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-crayora)] group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)]"
                style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}
              >
                <Image
                  src={project.image.src}
                  alt={`${project.title} website`}
                  fill
                  sizes="(min-width: 1024px) 46vw, (min-width: 768px) 64vw, 82vw"
                  className="object-cover"
                />
                <span className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-ink text-canvas opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowUpRight weight="bold" className="size-5" />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{project.title}</h3>
                <span className="mono-label shrink-0">
                  {country.short} {project.year}
                </span>
              </div>
              <p className="-mt-2 text-sm text-mute">
                {project.type} for a client in {project.location}
              </p>
            </TransitionLink>
          );
        })}

        <TransitionLink
          href="/work"
          className="group flex aspect-square w-[60vw] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-full border border-line-strong text-center transition-colors duration-500 hover:border-indigo hover:bg-indigo hover:text-white md:w-[40vw] lg:w-[26vw]"
        >
          <span className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">All {projects.length}</span>
          <span className="flex items-center gap-2 text-mute transition-colors group-hover:text-white">
            See the work <ArrowUpRight weight="bold" className="size-4" />
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
