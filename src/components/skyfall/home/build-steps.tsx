"use client";

import { useRef, useState } from "react";
import { home } from "@/content/skyfall";
import { prefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import type { PixelIconName } from "@/lib/skyfall/pixel-art";
import { PixelIcon } from "@/components/skyfall/ui/pixel-icon";

const STEP_ICONS: PixelIconName[] = ["learn", "simulate", "plan", "guardrails"];

const stepNumber = (index: number) => `// ${String(index + 1).padStart(3, "0")}`;

export function BuildSteps() {
  const steps = home.build.steps;
  const count = steps.length;
  const ref = useRef<HTMLOListElement>(null);
  // Must start at 0 even under reduced motion so hydration matches the server HTML; the effect applies the final state.
  const [reached, setReached] = useState(0);

  const apply = (progress: number) => {
    const list = ref.current;
    if (!list) return;
    list.querySelectorAll<HTMLElement>("[data-bar]").forEach((bar, index) => {
      const fill = gsap.utils.clamp(0, 1, progress - index);
      bar.style.transform = `scaleX(${fill})`;
      const tip = bar.parentElement?.querySelector<HTMLElement>("[data-tip]");
      if (tip) {
        tip.style.left = `calc(${fill * 100}% - 4px)`;
        tip.style.opacity = fill > 0.01 && fill < 0.99 ? "1" : "0";
      }
    });
    const next = Math.min(count, Math.floor(progress + 0.02));
    setReached((current) => (current === next ? current : next));
  };

  useGSAP(
    () => {
      const list = ref.current;
      if (!list) return;
      if (prefersReducedMotion()) {
        apply(count);
        return;
      }
      apply(0);
      const state = { p: 0 };
      const mm = gsap.matchMedia();
      const build = (vars: ScrollTrigger.Vars) =>
        gsap.to(state, { p: count, ease: "none", onUpdate: () => apply(state.p), scrollTrigger: { trigger: list, scrub: 0.3, ...vars } });
      const section = list.closest("section") ?? list;
      mm.add("(min-width: 1024px)", () => {
        build({ trigger: list, start: "bottom bottom-=32", end: "+=110%", pin: section, anticipatePin: 1 });
      });
      mm.add("(min-width: 768px) and (max-width: 1023.98px)", () => {
        build({ start: "top 70%", end: "bottom 55%" });
      });
      mm.add("(max-width: 767.98px)", () => {
        apply(count);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol
      ref={ref}
      className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-0 [&::-webkit-scrollbar]:hidden"
    >
      {steps.map((step, index) => {
        const done = index < reached;
        return (
          <li key={step.key} className="relative flex w-[78%] shrink-0 snap-start flex-col border border-line bg-paper md:w-auto lg:-ml-px lg:first:ml-0">
            <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
              <span className={`text-base tracking-[-0.04em] transition-colors duration-300 md:text-[22px] ${done ? "text-brand" : "text-faint"}`}>{stepNumber(index)}</span>
              <h3
                className={`mt-2 text-[24px] leading-[1.1] font-medium tracking-[-0.05em] transition-colors duration-300 md:mt-8 md:text-[28px] ${done ? "text-brand" : "text-ink/60"}`}
              >
                {step.title}
              </h3>
              <p className={`text-[15px] leading-[1.4] tracking-[-0.02em] transition-opacity duration-300 md:text-base ${done ? "text-ink" : "text-ink opacity-60"}`}>
                {step.body}
              </p>
            </div>
            <div aria-hidden="true" className="dots relative flex h-6 items-center md:h-8">
              <span data-bar className="block h-1.5 w-full origin-left bg-brand md:h-2" style={{ transform: "scaleX(0)" }} />
              <span data-tip className="absolute top-1/2 size-2 -translate-y-1/2 bg-brand opacity-0 shadow-[0_0_0_3px_rgba(62,87,218,0.2)]" />
            </div>
            <div className="flex justify-end p-5 md:p-6">
              <PixelIcon name={STEP_ICONS[index]} active={done} className="size-14 md:size-20" />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
