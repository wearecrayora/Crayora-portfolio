"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "boneyard-js/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import type { Project } from "@/data/projects";

/**
 * Full-bleed cover. Skeleton while the screenshot loads, then an upward clip
 * reveal, then a gentle parallax as the page scrolls.
 */
export function CaseCover({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 8000);
    return () => clearTimeout(t);
  }, []);

  useGSAP(
    () => {
      if (!loaded) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const frame = root.current!.querySelector("[data-frame]");
        const img = root.current!.querySelector("[data-img]");
        gsap.set(frame, { clipPath: "inset(18% 6% 0% 6% round 24px)" });
        const stop = onIntroDone(() =>
          gsap.to(frame, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.6, ease: "crayora", delay: 0.2 }),
        );
        gsap.fromTo(
          img,
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        return stop;
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [loaded] },
  );

  const cover = (
    <div data-frame className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-panel)] border border-line bg-navy-2 md:aspect-[2/1]">
      <div data-img className="absolute -inset-y-[8%] inset-x-0">
        <Image
          src={project.image.src}
          alt={`${project.title} website designed and built by Crayora`}
          fill
          priority
          sizes="(min-width: 1440px) 1344px, 100vw"
          quality={90}
          onLoad={() => setLoaded(true)}
          className="object-cover object-top"
        />
      </div>
    </div>
  );

  return (
    <div ref={root}>
      <Skeleton
        name="case-cover"
        loading={!loaded}
        fallback={
          <div className="relative">
            {cover}
            <div className="absolute inset-0 animate-pulse rounded-[var(--radius-panel)] bg-navy-2" />
          </div>
        }
      >
        {cover}
      </Skeleton>
    </div>
  );
}
