"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";

export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      const match = /^(\d+)(.*)$/.exec(value);
      if (!el || !match || prefersReducedMotion()) return;
      const [, digits, suffix] = match;
      const state = { n: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(state, {
        n: Number(digits),
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}${suffix}`;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
