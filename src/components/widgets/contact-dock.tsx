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

/** Mouse and trackpad users (hover-capable, precise pointer). */
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Floating contact dock that fans out into WhatsApp, Instagram, Facebook and email.
 * Desktop: opens on hover and collapses shortly after the pointer leaves.
 * Phones and tablets: tap to open; the button turns into a close (X) button.
 * Keyboard: Enter/Space toggles, Escape or tabbing away closes.
 */
export function ContactDock() {
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        duration: open ? 0.45 : 0.22,
        stagger: open ? { each: 0.05, from: "end" } : 0,
        ease: open ? "back.out(2)" : "power2.in",
        overwrite: true,
      });
    },
    { dependencies: [open], scope: root },
  );

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelClose();
    // Grace period so crossing the gaps between links doesn't collapse the menu.
    closeTimer.current = setTimeout(() => setOpen(false), 280);
  };

  // Mouse users already opened it by hovering, so a click keeps it open; touch and keyboard toggle.
  const onButtonClick = (e: React.MouseEvent) => {
    const viaMouse = e.detail > 0 && canHover();
    setOpen((v) => (viaMouse ? true : !v));
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Tapping or clicking anywhere else collapses it.
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={root}
      // The wrapper ignores the pointer so the hidden links' empty space can't trigger a hover.
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <ul id="contact-dock" className="flex flex-col items-end gap-2.5" aria-hidden={!open}>
        {channels.map(({ label, href, icon: Icon }) => (
          <li key={label} data-dock-item className="pointer-events-auto invisible opacity-0">
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
        onClick={onButtonClick}
        aria-expanded={open}
        aria-controls="contact-dock"
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          "pointer-events-auto relative grid size-14 place-items-center rounded-full text-white shadow-[0_18px_40px_-12px_rgb(44_34_201/0.7)] transition-[transform,background-color] duration-300 active:scale-95",
          open ? "bg-ink" : "bg-indigo hover:scale-105",
        )}
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-indigo/40 [animation-duration:2.4s]" aria-hidden="true" />}
        {/* Open: the button becomes the close (X) control, which is what touch users tap to collapse. */}
        {open ? <X weight="bold" className="relative size-6" /> : <ChatCircleDots weight="fill" className="relative size-7" />}
      </button>
    </div>
  );
}
