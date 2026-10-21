"use client";

import { useRef } from "react";
import { routes, sky001 } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { bodyText, container, gutter, heroTitle } from "@/lib/skyfall/classes";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import { FadeUp, SplitReveal } from "@/components/skyfall/motion/reveal";
import { LineButton, PrimaryButton } from "@/components/skyfall/ui/buttons";
import { HeroField } from "@/components/skyfall/ui/halftone-field";

export function Sky001Hero() {
  const { hero, intro } = sky001;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!reduced && ref.current) {
        gsap.from("[data-bracket]", { x: (index: number) => (index === 0 ? -28 : 28), opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.45 });
      }
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <section id="top" className={`relative overflow-hidden bg-paper ${gutter} pt-14 pb-14 md:pt-24 md:pb-20 lg:pt-32`}>
      <HeroField className="h-[300px] md:h-[440px]" mask="radial-gradient(ellipse 46% 62% at 50% 62%, transparent 45%, #000 85%)" revealDelay={110} />
      <FadeUp stagger={0.12} delay={0.15} className={`relative z-10 ${container} flex flex-col items-center text-center`}>
        <p ref={ref} className="flex items-center gap-3 font-mono text-[13px] font-medium tracking-[0.08em] uppercase md:gap-4 md:text-[15px]">
          <span data-bracket aria-hidden="true">[</span>
          <span>
            {intro.before}
            <span className="text-brand">{intro.emphasis.replace("SKY-001", "SKY‑001")}</span>
          </span>
          <span data-bracket aria-hidden="true">]</span>
        </p>
        <SplitReveal as="h1" immediate delay={0.25} data={{ "grid-avoid": "" }} className={`${heroTitle} mt-6 max-w-[12ch] md:mt-8 lg:text-[136px]`}>
          {hero.title}
        </SplitReveal>
        <p data-grid-avoid className={`${bodyText} mt-8 max-w-[38ch] text-body`}>
          {hero.lede}
        </p>
        <div className="mt-8 flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row md:mt-12">
          <PrimaryButton href={routes.waitlist}>{intro.waitlist.cta.label}</PrimaryButton>
          <LineButton href={routes.launchVideo}>{intro.video.label}</LineButton>
        </div>
      </FadeUp>
    </section>
  );
}
