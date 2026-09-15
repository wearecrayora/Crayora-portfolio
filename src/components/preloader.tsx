"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { MARK_C_PATH, MARK_STAR_PATH, MARK_VIEWBOX } from "@/lib/logo-paths";

const SEEN_KEY = "crayora:seen";

/**
 * First-load sequence: the C is drawn stroke by stroke while a counter runs,
 * the sparkle spins into place, then grows until it floods the screen and the
 * whole curtain lifts to reveal the page.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const q = gsap.utils.selector(el);
      const counter = q("[data-counter]")[0] as HTMLElement;
      const seen = sessionStorage.getItem(SEEN_KEY) === "1";
      const speed = seen ? 0.55 : 1;
      document.documentElement.style.overflow = "hidden";

      const finish = () => {
        document.documentElement.style.overflow = "";
        lenisRef.current?.start();
        sessionStorage.setItem(SEEN_KEY, "1");
        el.style.display = "none";
        markIntroDone();
      };

      if (prefersReducedMotion()) {
        document.fonts.ready.then(() => gsap.to(el, { autoAlpha: 0, duration: 0.4, onComplete: finish }));
        return;
      }

      const progress = { value: 0 };
      const intro = gsap.timeline({ defaults: { ease: "crayora" } });
      intro
        .set(q("[data-c]"), { drawSVG: "0%", fillOpacity: 0 })
        .set(q("[data-star]"), { scale: 0, rotate: -180, transformOrigin: "50% 50%" })
        .to(q("[data-c]"), { drawSVG: "100%", duration: 1.4 * speed }, 0)
        .to(
          progress,
          {
            value: 100,
            duration: 1.9 * speed,
            ease: "power2.inOut",
            onUpdate: () => {
              counter.textContent = String(Math.round(progress.value)).padStart(3, "0");
            },
          },
          0,
        )
        .to(q("[data-bar]"), { scaleX: 1, duration: 1.9 * speed, ease: "power2.inOut" }, 0)
        .to(q("[data-c]"), { fillOpacity: 1, strokeOpacity: 0, duration: 0.5 * speed }, 1.2 * speed)
        .to(q("[data-star]"), { scale: 1, rotate: 0, duration: 0.9 * speed, ease: "back.out(2)" }, 1.1 * speed);

      const outro = () =>
        gsap
          .timeline({ onComplete: finish })
          .to(q("[data-meta]"), { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.05 })
          .to(q("[data-c]"), { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "crayora" }, 0.1)
          .to(q("[data-star]"), { rotate: 90, scale: 110, duration: 1.1, ease: "expo.in" }, 0.15)
          .set(el, { backgroundColor: "var(--color-indigo)" })
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "crayora" }, ">-0.05");

      Promise.all([new Promise<void>((r) => intro.eventCallback("onComplete", () => r())), document.fonts.ready]).then(
        outro,
      );
    },
    { scope: root },
  );

  // Hold smooth scrolling until the curtain lifts; finish() re-enables it.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && !window.__crayoraIntroDone) lenis.stop();
  }, [lenis]);

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <svg viewBox={MARK_VIEWBOX} className="w-24 overflow-visible sm:w-32" aria-hidden="true">
        <path
          data-c
          d={MARK_C_PATH}
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth={3}
          fillRule="evenodd"
        />
        <path data-star d={MARK_STAR_PATH} fill="var(--color-indigo)" />
      </svg>

      <div data-meta className="mono-label absolute bottom-8 left-4 sm:left-8">
        Crayora studio
      </div>
      <div
        data-meta
        data-counter
        className="absolute bottom-4 right-4 font-display text-6xl font-extrabold tabular-nums tracking-tighter text-ink sm:right-8 sm:text-8xl"
      >
        000
      </div>
      <div data-meta className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div data-bar className="h-full origin-left scale-x-0 bg-indigo" />
      </div>
    </div>
  );
}
