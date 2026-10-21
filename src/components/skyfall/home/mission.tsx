"use client";

import { useRef } from "react";
import { home } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { headingBase, monoLabel } from "@/lib/skyfall/classes";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import { GridField, Section } from "@/components/skyfall/ui/layout";

export function Mission() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = `${home.mission.before.trim()} ${home.mission.emphasis}`.split(" ");

  useGSAP(
    () => {
      const statement = ref.current;
      if (reduced || !statement) return;
      const targets = statement.querySelectorAll("[data-word]");
      gsap.fromTo(
        targets,
        { opacity: 0.16 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 45%", scrub: 0.4 } },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <Section id="research" ground="blue" field={<GridField tone="blue" cell={56} mask="none" />}>
      <p className={`${monoLabel} text-white`}>
        {"[ "}
        {home.mission.label}
        {" ]"}
      </p>
      <p
        ref={ref}
        className={`${headingBase} mt-6 max-w-[22ch] text-[34px] leading-[0.98] normal-case sm:text-[56px] lg:mt-8 lg:text-[clamp(56px,5vw,76px)] lg:leading-[0.94]`}
      >
        {words.map((word, index) => (
          <span key={index} data-word>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </Section>
  );
}
