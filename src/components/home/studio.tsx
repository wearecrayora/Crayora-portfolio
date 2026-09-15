"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { stats } from "@/data/projects";
import { site } from "@/data/site";

const manifesto =
  "Crayora is a design and engineering studio from Odisha, India. We plan, design, build and market digital products for businesses at home and abroad, from the first sketch to launch day and every post after it.";

/**
 * Studio intro. The manifesto lights up word by word as it is read (scrubbed to
 * scroll) and the numbers count up once, both derived from real project data.
 */
export function Studio() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const text = el.querySelector<HTMLElement>("[data-manifesto]")!;
        const split = SplitText.create(text, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 90%", once: true },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
          });
        });

        gsap.from(el.querySelectorAll("[data-stat]"), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: el.querySelector("[data-stats]"), start: "top 85%", once: true },
        });

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" className="shell scroll-mt-24 py-28 md:py-44" aria-labelledby="studio-title">
      <h2 id="studio-title" className="sr-only">
        The studio
      </h2>
      <p data-manifesto className="max-w-[26ch] font-display text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-6xl">
        {manifesto}
      </p>

      <dl data-stats className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-28 lg:grid-cols-4">
        {stats.map((stat) => (
          <div data-stat key={stat.label} className="border-t border-line-strong pt-6">
            <dt className="mono-label">{stat.label}</dt>
            <dd className="mt-3 font-display text-5xl font-extrabold tracking-tighter text-ink sm:text-6xl lg:text-8xl">
              <span data-count={stat.value}>{stat.value}</span>
              <span className="text-indigo">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-14 max-w-[60ch] text-mute">
        Led by{" "}
        <a href={site.founder.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">
          {site.founder.name}
        </a>
        , full stack developer and designer. Every project is planned, designed and shipped in-house.
      </p>
    </section>
  );
}
