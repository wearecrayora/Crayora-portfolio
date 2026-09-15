"use client";

import { useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { navLinks, site } from "@/data/site";
import { services } from "@/data/services";
import { Wordmark } from "@/components/brand/logo";
import { TransitionLink } from "@/components/ui/transition-link";
import { ScrambleText } from "@/components/ui/scramble-text";

/**
 * Curtain footer: it sits fixed beneath the page inside a clipped wrapper, so
 * the content scrolls away to uncover it. The wordmark rises as it appears.
 */
export function SiteFooter() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-wordmark]",
          { yPercent: 60, opacity: 0.2 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    // Large screens: curtain reveal (footer fixed under the page). Smaller screens: a normal footer, so nothing is cut off.
    <div ref={root} className="relative lg:h-[100svh] lg:min-h-[640px]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      <footer className="relative flex flex-col justify-between gap-16 overflow-hidden lg:fixed lg:inset-x-0 lg:bottom-0 lg:h-[100svh] lg:min-h-[640px] lg:gap-0 bg-[linear-gradient(180deg,rgb(246_242_236/0.7)_0%,rgb(214_204_255/0.55)_100%)] pt-24 backdrop-blur-2xl md:pt-28">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">Say hello.</p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-4 inline-block break-all text-lg text-indigo-hi md:text-xl"
            >
              {site.email}
            </a>
            <p className="mt-2 text-mute">
              <a href={site.phoneHref} className="link-underline">
                {site.phone}
              </a>
              <span aria-hidden="true"> / </span>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline">
                WhatsApp
              </a>
            </p>
            <p className="mt-6 text-mute">
              {site.location.city}, {site.location.region}, {site.location.country}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7" aria-label="Footer">
            <div>
              <h2 className="mono-label">Services</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {services.map((s) => (
                  <li key={s.key}>
                    <TransitionLink href={`/services/${s.slug}`} className="text-ink/85 transition-colors hover:text-ink">
                      <ScrambleText text={s.name} />
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mono-label">Studio</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {[...navLinks, { label: "Contact", href: "/contact" }].map((l) => (
                  <li key={l.href}>
                    <TransitionLink href={l.href} className="text-ink/85 transition-colors hover:text-ink">
                      <ScrambleText text={l.label} />
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mono-label">Follow</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink/85 transition-colors hover:text-ink">
                      <ScrambleText text={s.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="shell">
          <div className="flex items-center justify-between gap-4 border-t border-line py-5 text-sm text-mute">
            <span>
              &copy; {year} {site.name}. All rights reserved.
            </span>
            <button
              type="button"
              onClick={() => lenis?.scrollTo(0, { duration: 1.6 })}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-ink hover:text-canvas"
              aria-label="Back to top"
            >
              <ArrowUp weight="bold" className="size-4" />
            </button>
          </div>
          <div className="overflow-hidden pb-24 lg:pb-4">
            <div data-wordmark>
              <Wordmark className="h-auto w-full text-ink" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
