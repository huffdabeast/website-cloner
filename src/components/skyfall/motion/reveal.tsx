"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, SplitText, useGSAP } from "@/lib/skyfall/gsap";

type RevealTag = "div" | "ul" | "ol" | "li" | "section" | "header" | "p" | "span" | "h1" | "h2" | "h3" | "dl";

interface FadeUpProps {
  children?: ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
}

export function FadeUp({ children, as = "div", className, delay = 0, y = 24, stagger }: FadeUpProps) {
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.children).filter((child) => !child.hasAttribute("data-split-reveal")) : el;
      gsap.from(targets, { autoAlpha: 0, y, delay, stagger, duration: 1.1, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} data-fade-up={stagger ? "stagger" : "self"}>
      {children}
    </Tag>
  );
}

type SplitBy = "lines" | "words" | "chars";

interface SplitRevealProps {
  children?: ReactNode;
  as?: RevealTag;
  className?: string;
  by?: SplitBy;
  delay?: number;
  immediate?: boolean;
  id?: string;
  data?: Record<string, string>;
}

const splitStagger: Record<SplitBy, number> = { chars: 0.015, words: 0.04, lines: 0.09 };

export function SplitReveal({ children, as = "div", className, by = "lines", delay = 0, immediate = false, id, data }: SplitRevealProps) {
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !contextSafe) return;
      let cancelled = false;
      const split = contextSafe(() => {
        if (cancelled) return;
        SplitText.create(el, {
          type: by === "lines" ? "lines" : `lines,${by}`,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) => {
            el.style.visibility = "inherit";
            return gsap.from(self[by], {
              yPercent: 110,
              duration: 1.2,
              stagger: splitStagger[by],
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
            });
          },
        });
      });
      document.fonts.ready.then(split);
      return () => {
        cancelled = true;
      };
    },
    { scope: ref },
  );
  const dataAttributes = Object.fromEntries(Object.entries(data ?? {}).map(([key, value]) => [`data-${key}`, value]));
  return (
    <Tag ref={ref} className={className} id={id} data-split-reveal="" {...dataAttributes}>
      {children}
    </Tag>
  );
}
