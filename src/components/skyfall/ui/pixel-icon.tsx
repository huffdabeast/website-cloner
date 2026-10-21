"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import { PIXEL_ART, pixelOutlinePath, type PixelIconName } from "@/lib/skyfall/pixel-art";

interface PixelIconProps {
  name: PixelIconName;
  active: boolean;
  className?: string;
  color?: string;
  ghost?: string;
}

export function PixelIcon({ name, active, className = "size-[50px] lg:size-20", color = "#3E57DA", ghost = "#B9C3F2" }: PixelIconProps) {
  const ref = useRef<SVGSVGElement>(null);
  const wasActive = useRef(active);
  const points = PIXEL_ART[name];

  useGSAP(
    () => {
      const activating = active && !wasActive.current;
      wasActive.current = active;
      if (activating && !prefersReducedMotion()) {
        gsap.from("[data-px]", { autoAlpha: 0, duration: 0.18, ease: "none", stagger: { each: 0.012, from: "random" } });
      }
    },
    { scope: ref, dependencies: [active] },
  );

  return (
    <svg ref={ref} viewBox="0 0 80 80" className={`block shrink-0 overflow-visible ${className}`} aria-hidden="true">
      <path d={pixelOutlinePath(points)} fill="none" stroke="#ADADAD" className={`transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`} />
      <g className={`transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
        <path d={pixelOutlinePath(points, 1, -1)} fill="none" stroke={ghost} />
        <g fill={color}>
          {points.map(([x, y]) => (
            <rect key={`${x}-${y}`} data-px="" x={x * 8} y={y * 8} width="8" height="8" />
          ))}
        </g>
      </g>
    </svg>
  );
}
