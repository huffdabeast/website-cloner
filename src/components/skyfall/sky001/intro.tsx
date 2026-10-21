"use client";

import { useRef } from "react";
import { sky001 } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { gutter, headingBase } from "@/lib/skyfall/classes";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import { FilmRing } from "./ring";

export function Sky001Intro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = sky001.hero.note.split(" ");
  const designAt = words.indexOf("Design");
  const items = words.map((word, index) => ({ word, emphasis: designAt >= 0 && index >= designAt }));

  useGSAP(
    () => {
      if (!reduced && ref.current) {
        gsap.fromTo(
          ref.current.querySelectorAll("[data-word]"),
          { opacity: 0.16 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 50%", scrub: 0.4 } },
        );
      }
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section id="intro" aria-labelledby="intro-statement" className="relative overflow-hidden bg-paper pt-2 pb-0 md:pt-20 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(55%_45%_at_50%_45%,rgba(62,87,218,0.14),transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] bottom-10 h-16 rounded-[50%] bg-[radial-gradient(closest-side,rgba(26,26,26,0.12),transparent)] blur-md md:bottom-14"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-studio md:h-48" />
      <div className={`relative ${gutter}`}>
        <p
          id="intro-statement"
          ref={ref}
          className={`${headingBase} mx-auto max-w-[22ch] text-center text-[32px] leading-[0.98] normal-case sm:text-[48px] lg:text-[64px] lg:leading-[0.95]`}
        >
          {items.map(({ word, emphasis }, index) => (
            <span key={index} data-word className={emphasis ? "text-brand" : undefined}>
              {word}
              {index < items.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
      <FilmRing className="relative mt-0 h-[190px] sm:h-[340px] md:mt-14 lg:h-[420px]" />
    </section>
  );
}
