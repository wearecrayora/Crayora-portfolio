"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { countries, type CountryCode } from "@/data/countries";
import { projects, projectsByCountry } from "@/data/projects";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { Globe } from "./globe";
import { cn } from "@/lib/cn";

export function WorldWork() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CountryCode>("in");
  const [hovered, setHovered] = useState<string | null>(null);
  const list = projectsByCountry(active);
  const country = countries.find((c) => c.code === active)!;

  // Rows cascade in whenever the country changes.
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-row]",
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: "crayora-out" },
      );
    },
    { scope: root, dependencies: [active] },
  );

  // Floating screenshot that trails the cursor over the list (fine pointers).
  useGSAP(() => gsap.set(preview.current, { scale: 0.6, autoAlpha: 0 }), { scope: root });
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !preview.current) return;
    gsap.to(preview.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
  };
  const showPreview = (slug: string | null) => {
    setHovered(slug);
    if (!preview.current) return;
    gsap.to(preview.current, { scale: slug ? 1 : 0.6, autoAlpha: slug ? 1 : 0, duration: 0.4, ease: "power3.out" });
  };

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + countries.length) % countries.length;
    setActive(countries[next].code);
    root.current?.querySelector<HTMLButtonElement>(`#tab-${countries[next].code}`)?.focus();
  };

  return (
    <section ref={root} className="shell pb-28 pt-16 md:pb-40 md:pt-20" aria-labelledby="world-title">
      <SplitReveal id="world-title" className="display-lg max-w-[12ch]">
        From Odisha to the <span className="text-outline">world.</span>
      </SplitReveal>
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Globe active={active} className="relative mx-auto w-full max-w-[520px]" />
            <p className="mt-4 text-center text-sm text-dim">Drag to spin. Lines run from our studio in Odisha.</p>
          </div>
        </div>

        <div className="md:col-span-7 md:pt-4">
          <div role="tablist" aria-label="Filter projects by country" className="flex flex-wrap gap-2">
            {countries.map((c, i) => {
              const count = projectsByCountry(c.code).length;
              const selected = c.code === active;
              return (
                <button
                  key={c.code}
                  id={`tab-${c.code}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="country-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.code)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                    selected
                      ? "border-indigo bg-indigo text-white"
                      : "border-line-strong text-mute hover:border-paper hover:text-paper",
                  )}
                >
                  {c.code === "global" ? "Global" : c.short}
                  <span className={cn("font-mono text-xs", selected ? "text-white/80" : "text-dim")}>{count}</span>
                </button>
              );
            })}
          </div>

          <div id="country-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{country.name}</h3>
              <span className="mono-label">
                {list.length} of {projects.length} projects
              </span>
            </div>
            <p className="mt-3 max-w-[52ch] text-mute">{country.blurb}</p>

            <ul className="mt-8" onPointerMove={onMove} onPointerLeave={() => showPreview(null)}>
              {list.map((p) => (
                <li key={p.slug} className="overflow-hidden border-b border-line">
                  <TransitionLink
                    data-row
                    href={`/work/${p.slug}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && showPreview(p.slug)}
                    onFocus={() => showPreview(null)}
                    className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[1fr_auto_auto] md:gap-8 md:py-5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:hidden">
                      <Image src={p.image.src} alt="" fill sizes="72px" className="object-cover object-top" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate font-display text-xl font-bold tracking-tight transition-transform duration-500 ease-[var(--ease-crayora)] group-hover:translate-x-3 md:text-3xl">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm text-mute md:hidden">{p.location}</span>
                    </div>
                    <span className="hidden text-sm text-mute md:block">
                      {p.type}, {p.location}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-dim">{p.year}</span>
                      <ArrowUpRight
                        weight="bold"
                        className="size-5 text-mute transition-all duration-500 group-hover:rotate-45 group-hover:text-indigo-hi"
                      />
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[22rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-line-strong opacity-0 shadow-[0_40px_80px_-20px_rgb(4_6_20/0.9)] md:block"
      >
        {projects.map((p) => (
          <Image
            key={p.slug}
            src={p.image.src}
            alt=""
            width={p.image.width}
            height={p.image.height}
            sizes="352px"
            className={cn("h-auto w-full", hovered === p.slug ? "block" : "hidden")}
          />
        ))}
      </div>
    </section>
  );
}
