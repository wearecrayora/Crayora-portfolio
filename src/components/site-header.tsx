"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { navLinks, site } from "@/data/site";
import { Logo } from "@/components/brand/logo";
import { TransitionLink } from "@/components/ui/transition-link";
import { ScrambleText } from "@/components/ui/scramble-text";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Intro + hide on scroll down, reveal on scroll up.
  useGSAP(() => {
    const el = bar.current;
    if (!el) return;
    gsap.set(el, { yPercent: -120 });
    const stopIntro = onIntroDone(() => gsap.to(el, { yPercent: 0, duration: 1, delay: 0.5 }));

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        setScrolled(self.scroll() > 40);
        if (!window.__crayoraIntroDone) return;
        const hide = self.direction === 1 && self.scroll() > 240;
        // Lets sticky UI (e.g. the work filters) slide up into the header's space.
        document.documentElement.dataset.header = hide ? "hidden" : "shown";
        gsap.to(el, { yPercent: hide ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      },
    });
    return () => {
      stopIntro();
      st.kill();
    };
  });

  // Mobile menu choreography.
  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      const items = el.querySelectorAll("[data-menu-item]");
      if (open) {
        gsap
          .timeline()
          .set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "crayora" })
          .fromTo(items, { yPercent: 120 }, { yPercent: 0, duration: 0.8, stagger: 0.06 }, "-=0.5");
      } else {
        gsap.to(el, {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.6,
          ease: "crayora",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open] },
  );

  // Close the menu whenever the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-40">
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled && !open
              ? "border-b border-white/70 bg-canvas/55 shadow-[0_12px_40px_-24px_rgb(44_34_201/0.35)] backdrop-blur-2xl backdrop-saturate-150"
              : "border-b border-transparent",
          )}
        >
          <nav className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]" aria-label="Primary">
            <TransitionLink href="/" className="relative z-10 shrink-0 text-ink" aria-label="Crayora home">
              <Logo className="h-7 w-auto md:h-8" />
            </TransitionLink>

            <ul className="hidden items-center gap-9 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-ink",
                      pathname === link.href ? "text-ink" : "text-mute",
                    )}
                  >
                    <ScrambleText text={link.label} />
                  </TransitionLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <TransitionLink href="/contact" className="btn btn-primary hidden !px-5 !py-3 text-sm sm:inline-flex">
                Start a project
                <ArrowUpRight weight="bold" className="size-4" />
              </TransitionLink>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative z-10 grid size-11 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X className="size-5" /> : <List className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="glass-strong invisible fixed inset-0 z-30 flex flex-col justify-between !rounded-none !border-0 px-4 pb-10 pt-28 md:px-10 lg:hidden"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {[...navLinks, { label: "Contact", href: "/contact" }].map((link) => (
            <li key={link.href} className="overflow-hidden">
              <TransitionLink
                data-menu-item
                href={link.href}
                onClick={() => setOpen(false)}
                className="block font-display text-5xl font-extrabold tracking-tight text-ink"
                tabIndex={open ? 0 : -1}
              >
                {link.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 text-mute">
          <a href={`mailto:${site.email}`} className="text-ink" tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <a href={site.phoneHref} tabIndex={open ? 0 : -1}>
            {site.phone}
          </a>
          <div className="mt-3 flex gap-4 text-ink">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-underline">
              Instagram
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-underline">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
