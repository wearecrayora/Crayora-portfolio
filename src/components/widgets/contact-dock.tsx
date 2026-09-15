"use client";

import { useEffect, useRef, useState } from "react";
import { ChatCircleDots, EnvelopeSimple, FacebookLogo, InstagramLogo, WhatsappLogo, X } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

const channels = [
  { label: "WhatsApp", href: site.whatsapp, icon: WhatsappLogo },
  { label: "Instagram", href: site.instagram, icon: InstagramLogo },
  { label: "Facebook", href: site.facebook, icon: FacebookLogo },
  { label: "Email", href: `mailto:${site.email}`, icon: EnvelopeSimple },
];

/**
 * Floating contact dock: one glass button that fans out into WhatsApp,
 * Instagram, Facebook and email. Works the same on touch and desktop.
 */
export function ContactDock() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, y: 30, scale: 0.8 });
      return onIntroDone(() => gsap.to(el, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, delay: 1.2, ease: "back.out(1.8)" }));
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll("[data-dock-item]");
      if (!items) return;
      gsap.to(items, {
        autoAlpha: open ? 1 : 0,
        y: open ? 0 : 16,
        scale: open ? 1 : 0.6,
        duration: open ? 0.5 : 0.25,
        stagger: open ? { each: 0.05, from: "end" } : 0,
        ease: open ? "back.out(2)" : "power2.in",
      });
    },
    { dependencies: [open], scope: root },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <ul id="contact-dock" className="flex flex-col items-end gap-2.5" aria-hidden={!open}>
        {channels.map(({ label, href, icon: Icon }) => (
          <li key={label} data-dock-item className="invisible opacity-0">
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="glass-strong group flex items-center gap-3 rounded-full py-2 pl-4 pr-2 text-sm font-semibold text-ink transition-transform duration-300 hover:-translate-x-1"
            >
              {label}
              <span className="grid size-9 place-items-center rounded-full bg-indigo text-white transition-transform duration-300 group-hover:scale-110">
                <Icon weight="fill" className="size-[18px]" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-dock"
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          "relative grid size-14 place-items-center rounded-full text-white shadow-[0_18px_40px_-12px_rgb(44_34_201/0.7)] transition-[transform,background-color] duration-300 active:scale-95",
          open ? "bg-ink" : "bg-indigo hover:scale-105",
        )}
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-indigo/40 [animation-duration:2.4s]" aria-hidden="true" />}
        {open ? <X weight="bold" className="relative size-6" /> : <ChatCircleDots weight="fill" className="relative size-7" />}
      </button>
    </div>
  );
}
