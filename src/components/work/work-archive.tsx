"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { countries, countryByCode, type CountryCode } from "@/data/countries";
import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/cn";

type CountryFilter = CountryCode | "all";

const isCountry = (v: string | null): v is CountryCode => countries.some((c) => c.code === v);

export function WorkArchive() {
  // Server HTML always lists every project (crawlable); a ?country= link filters after hydration.
  const [country, setCountry] = useState<CountryFilter>("all");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const filtered = useMemo(() => projects.filter((p) => country === "all" || p.country === country), [country]);

  // Group by country, in the order of the countries list.
  const groups = useMemo(
    () =>
      countries
        .map((c) => ({ country: c, items: filtered.filter((p) => p.country === c.code) }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  const change = (next: CountryFilter) => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
    setCountry(next);
    window.history.replaceState(null, "", next === "all" ? "/work" : `/work?country=${next}`);
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("country");
    if (!isCountry(initial)) return;
    const id = requestAnimationFrame(() => {
      if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
      setCountry(initial);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Animate cards from their old positions to the new layout.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-flip-id]"),
      duration: 0.8,
      ease: "crayora-out",
      stagger: 0.03,
      absolute: false,
      scale: false,
      simple: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [country]);

  const countFor = (code: CountryFilter) => projects.filter((p) => code === "all" || p.country === code).length;

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-white/70 bg-canvas/55 px-4 py-4 backdrop-blur-2xl backdrop-saturate-150 transition-[top] duration-500 ease-[var(--ease-crayora)] md:top-[4.5rem] md:mx-0 md:px-0 [html[data-header=hidden]_&]:top-0">
        <div className="flex flex-col gap-3">
          <div role="group" aria-label="Filter by country" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
            {(["all", ...countries.map((c) => c.code)] as CountryFilter[]).map((code) => {
              const label = code === "all" ? "All countries" : code === "global" ? "Global" : countryByCode[code].name;
              const selected = country === code;
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => change(code)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                    selected ? "border-indigo bg-indigo text-white" : "border-line-strong text-mute hover:border-ink hover:text-ink",
                  )}
                >
                  {label}
                  <span className={cn("font-mono text-xs", selected ? "text-white/80" : "text-dim")}>{countFor(code)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={grid} className="mt-12 flex flex-col gap-24 md:mt-16 md:gap-32">
        {groups.map(({ country: c, items }) => (
          <section key={c.code} aria-labelledby={`group-${c.code}`}>
            <header data-flip-id={`head-${c.code}`} className="mb-10 border-t border-line-strong pt-6">
              <h2 id={`group-${c.code}`} className="display-md">
                {c.name}
                <sup className="ml-3 align-super font-mono text-base font-normal tracking-normal text-indigo-hi">
                  {String(items.length).padStart(2, "0")}
                </sup>
              </h2>
              <p className="mt-3 max-w-[56ch] text-mute">{c.blurb}</p>
            </header>
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
              {items.map((p, i) => {
                // Odd counts lead with one wide card so the 2-column grid always fills.
                const large = i === 0 && items.length % 2 === 1;
                return (
                  <div key={p.slug} data-flip-id={p.slug} className={cn(large && "md:col-span-2")}>
                    <ProjectCard project={p} large={large} priority={i < 2 && c.code === groups[0].country.code} />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
