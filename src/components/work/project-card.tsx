"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "boneyard-js/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Project } from "@/data/projects";
import { countryByCode } from "@/data/countries";
import { TransitionLink } from "@/components/ui/transition-link";
import { cn } from "@/lib/cn";

type Props = { project: Project; large?: boolean; priority?: boolean };

/**
 * Work card. boneyard shows a skeleton snapshotted from this exact card until
 * the screenshot has loaded, then cross-fades to the real thing.
 */
export function ProjectCard({ project, large, priority }: Props) {
  const [loaded, setLoaded] = useState(false);
  const country = countryByCode[project.country];

  // Never leave a card stuck in its loading state on a slow or failed image.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const card = (
    <TransitionLink href={`/work/${project.slug}`} className="group flex h-full flex-col gap-5">
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-navy-2",
          large ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={project.image.src}
          alt={`${project.title} website by Crayora`}
          fill
          priority={priority}
          sizes={large ? "(min-width: 1440px) 1344px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          onLoad={() => setLoaded(true)}
          className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-crayora)] group-hover:scale-[1.05]"
        />
        <span className="absolute bottom-4 right-4 grid size-12 translate-y-3 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-[var(--ease-crayora)] group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight weight="bold" className="size-5" />
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className={cn("font-display font-bold tracking-tight", large ? "text-3xl md:text-4xl" : "text-2xl")}>
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-mute">
            {project.type} in {project.location}
          </p>
        </div>
        <span className="chip shrink-0 !py-1 font-mono !text-xs">
          {country.short} {project.year}
        </span>
      </div>
      <p className="line-clamp-2 max-w-[60ch] text-mute">{project.summary}</p>
    </TransitionLink>
  );

  return (
    <Skeleton
      name={large ? "project-card-large" : "project-card"}
      loading={!loaded}
      className="h-full"
      fallback={
        // Before skeletons are captured, keep the card mounted (so the image can
        // load) under a shimmer instead of blocking on missing bones.
        <div className="relative h-full">
          {card}
          <div className="absolute inset-0 animate-pulse rounded-[var(--radius-panel)] bg-navy-2" />
        </div>
      }
    >
      {card}
    </Skeleton>
  );
}
