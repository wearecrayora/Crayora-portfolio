"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Sparkle } from "@/components/brand/logo";

type Ctx = { navigate: (href: string) => void };
const RouteTransitionContext = createContext<Ctx>({ navigate: () => {} });

export const useRouteTransition = () => useContext(RouteTransitionContext);

/**
 * Animated loader between routes: two panels sweep up to cover the page while
 * the sparkle spins, the route changes underneath, then the panels exit upward.
 */
export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef<{ href: string; hash: string } | null>(null);
  const busy = useRef(false);

  const scrollToHash = useCallback(
    (hash: string, immediate: boolean) => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (target) lenis?.scrollTo(target, { immediate, offset: -24 });
      else lenis?.scrollTo(0, { immediate: true });
    },
    [lenis],
  );

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;

      if (samePage) {
        if (url.hash) scrollToHash(url.hash, false);
        else lenis?.scrollTo(0);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      pending.current = { href: url.pathname + url.search, hash: url.hash };

      const el = overlay.current;
      if (!el || prefersReducedMotion()) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }

      lenis?.stop();
      gsap
        .timeline({ onComplete: () => router.push(url.pathname + url.search) })
        .set(el, { visibility: "visible" })
        .fromTo(
          el.querySelectorAll("[data-panel]"),
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "crayora" },
        )
        .fromTo(
          el.querySelector("[data-loader]"),
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.25",
        );
    },
    [lenis, router, scrollToHash],
  );

  // When the new route has rendered, reveal it.
  useEffect(() => {
    const job = pending.current;
    if (!job) return;
    pending.current = null;

    const el = overlay.current;
    const reveal = () => {
      lenis?.start();
      scrollToHash(job.hash, true);
      ScrollTrigger.refresh();
      if (!el || prefersReducedMotion()) {
        busy.current = false;
        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
            busy.current = false;
          },
        })
        .to(el.querySelector("[data-loader]"), { autoAlpha: 0, scale: 0.6, duration: 0.3 })
        .to(el.querySelectorAll("[data-panel]"), {
          yPercent: -100,
          duration: 0.8,
          stagger: { each: 0.08, from: "end" },
          ease: "crayora",
        });
    };
    // Give the incoming page a frame to lay out before measuring triggers.
    const id = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis, scrollToHash]);

  return (
    <RouteTransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlay} className="invisible fixed inset-0 z-[90]" aria-hidden="true">
        <div data-panel className="absolute inset-0 bg-indigo" />
        <div data-panel className="absolute inset-0 bg-navy" />
        <div data-loader className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <Sparkle className="size-14 animate-[spin_1.6s_cubic-bezier(0.76,0,0.24,1)_infinite] text-indigo" />
          <span className="mono-label">Loading</span>
        </div>
      </div>
    </RouteTransitionContext.Provider>
  );
}
