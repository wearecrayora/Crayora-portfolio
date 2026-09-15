"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: React.ReactNode;
  className?: string;
  /** "lines" rises line by line, "chars" staggers each letter with a 3D flip. */
  by?: "lines" | "words" | "chars";
  /** Play once the preloader clears (hero) instead of on scroll. */
  onIntro?: boolean;
  delay?: number;
  id?: string;
};

/**
 * Headline reveal built on GSAP SplitText. Lines are masked so text rises out
 * of an invisible slot, and splits re-run on resize (autoSplit) so wrapping
 * stays correct at every width.
 */
export function SplitReveal({ as: Tag = "h2", children, className, by = "lines", onIntro, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let played = false;
        let trigger: ScrollTrigger | undefined;
        let cleanupIntro = () => {};

        const split = SplitText.create(el, {
          type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
          mask: "lines",
          linesClass: "split-mask",
          autoSplit: true,
          onSplit(self) {
            const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            const from = by === "chars" ? { yPercent: 110, rotateX: -80, opacity: 0 } : { yPercent: 115 };
            const tween = gsap.from(targets, {
              ...from,
              duration: by === "chars" ? 1 : 1.1,
              stagger: by === "chars" ? 0.025 : by === "words" ? 0.05 : 0.1,
              ease: "crayora-out",
              delay: played ? 0 : delay,
              transformOrigin: "50% 100%",
              paused: true,
            });

            // A re-split after the reveal must not hide the text again.
            if (played) return tween.progress(1);

            const play = () => {
              played = true;
              tween.play();
            };
            trigger?.kill();
            cleanupIntro();
            if (onIntro) cleanupIntro = onIntroDone(play);
            else trigger = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
            return tween;
          },
        });

        return () => {
          trigger?.kill();
          cleanupIntro();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} id={id} style={{ perspective: by === "chars" ? "600px" : undefined }}>
      {children}
    </Tag>
  );
}
