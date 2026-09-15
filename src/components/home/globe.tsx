"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { gsap } from "@/lib/gsap";
import { countries, countryByCode, type CountryCode } from "@/data/countries";

const HQ: [number, number] = [19.31, 84.79]; // Brahmapur, Odisha
const TAU = Math.PI * 2;

const toAngles = ([lat, lng]: [number, number]) => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];

/**
 * cobe globe driven from GSAP's ticker (cobe v2 has no render loop of its own).
 * Arcs run from the studio in Odisha to every client city; the active country's
 * markers grow and the globe eases round to face it. Drag to spin.
 */
export function Globe({ active, className }: { active: CountryCode; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const dragOffset = useRef(0);

  useEffect(() => {
    activeRef.current = active;
    dragOffset.current = 0;
    const markers = countries.flatMap((c) =>
      c.markers.map((m) => ({ location: m.location, size: c.code === active ? 0.09 : 0.045 })),
    );
    globeRef.current?.update({ markers: [...markers, { location: HQ, size: 0.07, color: [1, 1, 1] }] });
  }, [active]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = el.offsetWidth;
    let phi = 0;
    let theta = 0.3;
    let dragX: number | null = null;
    let visible = true;

    const globe = createGlobe(el, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size,
      height: size,
      phi,
      theta,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 18000,
      mapBrightness: 5.5,
      mapBaseBrightness: 0.02,
      baseColor: [0.16, 0.19, 0.38],
      markerColor: [0.58, 0.55, 1],
      glowColor: [0.2, 0.17, 0.75],
      opacity: 0.95,
      markers: countries.flatMap((c) => c.markers.map((m) => ({ location: m.location, size: 0.05 }))),
      arcs: countries.flatMap((c) => c.markers.map((m) => ({ from: HQ, to: m.location }))),
      arcColor: [0.58, 0.55, 1],
      arcWidth: 0.6,
      arcHeight: 0.28,
      markerElevation: 0.01,
    });
    globeRef.current = globe;
    // Seed markers for the current selection.
    const markers = countries.flatMap((c) =>
      c.markers.map((m) => ({ location: m.location, size: c.code === activeRef.current ? 0.09 : 0.045 })),
    );
    globe.update({ markers: [...markers, { location: HQ, size: 0.07, color: [1, 1, 1] }] });

    const tick = () => {
      if (!visible) return;
      const code = activeRef.current;
      if (code === "global" || reduce) {
        if (!reduce && dragX === null) phi += 0.0035;
        theta += (0.3 - theta) * 0.05;
      } else {
        const [fPhi, fTheta] = toAngles(countryByCode[code].focus);
        const target = fPhi + dragOffset.current;
        const pos = (target - phi + TAU * 10) % TAU;
        const neg = (phi - target + TAU * 10) % TAU;
        phi += pos < neg ? pos * 0.06 : -neg * 0.06;
        theta += (fTheta * 0.85 - theta) * 0.06;
      }
      globe.update({ phi, theta });
    };
    gsap.ticker.add(tick);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (dragX === null) return;
      const dx = (e.clientX - dragX) / 180;
      dragX = e.clientX;
      phi += dx;
      dragOffset.current += dx;
    };
    const up = () => {
      dragX = null;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    gsap.fromTo(el, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.4 });

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      globe.destroy();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className={className} style={{ aspectRatio: "1 / 1" }}>
      <canvas
        ref={canvas}
        className="size-full cursor-grab touch-pan-y"
        style={{ contain: "layout paint size" }}
        aria-label="Globe showing Crayora client locations"
        role="img"
      />
    </div>
  );
}
