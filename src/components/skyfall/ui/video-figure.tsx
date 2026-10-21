"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-media-query";
import { monoLabel } from "@/lib/skyfall/classes";
import { CornerDots } from "./layout";

export type VideoTone = "dark" | "light" | "native-light";

interface VideoFigureProps {
  src: string;
  poster?: string;
  label: string;
  hud?: ReactNode;
  chip?: ReactNode;
  tone?: VideoTone;
  className?: string;
}

export function VideoFigure({ src, poster, label, hud, chip, tone = "dark", className = "" }: VideoFigureProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref);
  const light = tone === "light";
  const native = tone === "native-light";

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    if (inView) video.play().catch(() => {});
    else if (!video.paused) video.pause();
  }, [inView, reduced]);

  return (
    <figure className={`relative overflow-hidden border ${light || native ? "border-ink bg-studio" : "border-night-mid bg-black"} ${className}`}>
      <video
        ref={ref}
        src={inView && !reduced ? src : undefined}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        className={`aspect-video size-full object-cover ${light ? "brightness-[0.97] hue-rotate-180 invert" : ""}`}
      />
      {!native && <CornerDots tone={light ? "light" : "dark"} />}
      {chip && (
        <span
          className={`${monoLabel} absolute top-3 left-1/2 -translate-x-1/2 border px-2 py-1 whitespace-nowrap max-sm:hidden ${light || native ? "border-ink bg-paper text-ink" : "border-white/70 bg-white text-ink"}`}
        >
          {chip}
        </span>
      )}
      {hud && <figcaption className={`${monoLabel} absolute top-4 left-4 px-2 py-1 ${light ? "bg-ink text-white" : "bg-white text-ink"}`}>{hud}</figcaption>}
    </figure>
  );
}
