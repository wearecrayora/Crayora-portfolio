"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { Magnetic } from "@/components/ui/magnetic";
import type { HeroMotion } from "./hero-scene";

// Three.js is heavy and purely decorative: load it on the client after hydration.
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const motion = useRef<HeroMotion>({ intro: 0, scroll: 0 });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        motion.current.intro = 1;
        return;
      }
      gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 24 });

      const stop = onIntroDone(() => {
        gsap.to(motion.current, { intro: 1, duration: 2.2, ease: "expo.out" });
        gsap.to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.55 });
      });

      // As the hero scrolls away the mark spins off and the copy drifts up.
      gsap.to(motion.current, {
        scroll: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-parallax]"), {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return stop;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100dvh] overflow-hidden" aria-labelledby="hero-title">
      {/* Brand glow behind the 3D mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[8%] -z-10 aspect-square w-[80vw] rounded-full opacity-60 blur-3xl md:w-[55vw]"
        style={{ background: "radial-gradient(circle, rgb(75 63 255 / 0.45) 0%, rgb(75 63 255 / 0.08) 45%, transparent 70%)" }}
      />

      <div className="absolute inset-x-0 top-0 h-[58%] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[60%]">
        <HeroScene motion={motion} />
      </div>

      <div className="shell relative flex min-h-[100dvh] flex-col justify-end pb-10 pt-24 md:pb-14">
        <p data-fade className="mono-label mb-6 md:mb-8">
          Web, app and social media studio in India
        </p>

        <div data-parallax className="relative">
          <SplitReveal as="h1" id="hero-title" by="chars" onIntro className="display-xl max-w-[16ch] text-paper">
            We colour <span className="text-outline">outside</span> the lines.
          </SplitReveal>
        </div>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          <p data-fade className="max-w-[44ch] text-lg leading-relaxed text-mute md:col-span-5 md:text-xl">
            Websites, mobile apps, custom software and social media, designed and built by one studio for brands in four
            countries.
          </p>
          <div data-fade className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
            <Magnetic>
              <TransitionLink href="/contact" className="btn btn-primary">
                Start a project
                <ArrowUpRight weight="bold" className="size-4" />
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <TransitionLink href="/work" className="btn btn-ghost">
                See the work
                <ArrowDownRight weight="bold" className="size-4" />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
