"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroWidgets } from "@/components/widgets/hero-widgets";
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
      gsap.set(q("[data-widget]"), { autoAlpha: 0, scale: 0.7, y: 30 });

      const stop = onIntroDone(() => {
        gsap.to(motion.current, { intro: 1, duration: 2.2, ease: "expo.out" });
        gsap.to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.55 });
        gsap.to(q("[data-widget]"), { autoAlpha: 1, scale: 1, y: 0, duration: 1, stagger: 0.15, delay: 1.1, ease: "back.out(1.7)" });
      });

      // As the hero scrolls away the mark spins off, the copy drifts up and the widgets scatter.
      const away = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(motion.current, { scroll: 1, ease: "none", scrollTrigger: away });
      gsap.to(q("[data-parallax]"), { yPercent: -18, ease: "none", scrollTrigger: away });
      q("[data-widget]").forEach((w, i) => {
        gsap.to(w, { y: -120 - i * 70, x: (i % 2 ? 1 : -1) * 40, ease: "none", scrollTrigger: away });
      });

      // Desktop only: widgets drift against the pointer for depth.
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine)", () => {
        const movers = q("[data-widget]").map((w, i) => ({
          x: gsap.quickTo(w.firstElementChild, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(w.firstElementChild, "y", { duration: 1.2, ease: "power3.out" }),
          depth: 18 + i * 10,
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * m.depth);
            m.y(-ny * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => {
        stop();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100dvh] overflow-hidden" aria-labelledby="hero-title">
      {/* Brand glow behind the 3D mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[8%] -z-10 aspect-square w-[80vw] rounded-full opacity-60 blur-3xl lg:w-[55vw]"
        style={{ background: "radial-gradient(circle, rgb(124 104 255 / 0.32) 0%, rgb(75 63 255 / 0.08) 45%, transparent 70%)" }}
      />

      {/* Phones and tablets: mark above the copy. Large screens: mark on the right. */}
      <div className="absolute inset-x-0 top-0 h-[56%] md:h-[60%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[60%]">
        <HeroScene motion={motion} />
      </div>

      <HeroWidgets />

      <div className="shell relative z-[2] flex min-h-[100dvh] flex-col justify-end pb-24 pt-24 md:pb-16 lg:pb-14">
        <p data-fade className="mono-label mb-6 md:mb-8">
          Web, app and social media studio in India
        </p>

        <div data-parallax className="relative">
          {/* Company tagline. Tablet and up: one clause per line. Phones: "dream it," and
              "code it." stay together (nowrap) so the words never orphan. */}
          <SplitReveal as="h1" id="hero-title" by="chars" onIntro className="display-xl !text-[clamp(3rem,8.2vw,9rem)] text-ink">
            You <span className="whitespace-nowrap"><span className="text-outline">dream</span> it,</span>
            <br className="hidden md:inline" /> we <span className="whitespace-nowrap"><span className="text-indigo">code</span> it.</span>
          </SplitReveal>
        </div>

        <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-12 lg:items-end">
          <p data-fade className="max-w-[44ch] text-lg leading-relaxed text-mute md:text-xl lg:col-span-5">
            Websites, mobile apps, custom software and social media, designed and built by one studio for brands in four
            countries.
          </p>
          <div data-fade className="flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end">
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
