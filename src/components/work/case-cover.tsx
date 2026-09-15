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
        gsap.set(frame, { clipPath: "inset(18% 6% 0% 6% round 24px)" });
        const stop = onIntroDone(() =>
          gsap.to(frame, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.6, ease: "crayora", delay: 0.2 }),
        );
        // Depth without cropping: the whole frame drifts and settles, the image is never scaled.
        gsap.fromTo(
          frame,
          { y: 60, scale: 0.96 },
          { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true } },
        );
        return stop;
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [loaded] },
  );

  const cover = (
    // The frame takes the screenshot's own proportions, so the full site is visible.
    <div
      data-frame
      className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface-2 shadow-[var(--shadow-card)]"
      style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}
    >
      <Image
        src={project.image.src}
        alt={`${project.title} website designed and built by Crayora`}
        fill
        priority
        sizes="(min-width: 1440px) 1344px, 100vw"
        quality={90}
        onLoad={() => setLoaded(true)}
        className="object-cover"
      />
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
            <div className="absolute inset-0 animate-pulse rounded-[var(--radius-panel)] bg-surface-3" />
          </div>
        }
      >
        {cover}
      </Skeleton>
    </div>
  );
}
