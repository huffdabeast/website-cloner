"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { showcase, type ShowcaseId } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { monoLabel } from "@/lib/skyfall/classes";
import { showcaseMedia } from "@/lib/skyfall/media";

const COPIES = 5;
const models = showcase.models;
const COUNT = models.length * COPIES;
const STEP = 360 / COUNT;
const ASPECT = 8 / 5;

type RingStyle = CSSProperties & Record<"--ring-r" | "--ring-turn", string>;

export function FilmRing({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<ShowcaseId | null>(null);
  const film = models.find((model) => model.id === selected);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal?.();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const height = Math.max(120, Math.min(size.h * 0.74, size.w * 0.2));
  const width = height * ASPECT;
  const radius = (width * 1.06) / (2 * Math.sin((STEP / 2) * (Math.PI / 180)));
  const measured = size.w > 0;
  const ringStyle: RingStyle = {
    "--ring-r": `${radius}px`,
    "--ring-turn": `${-STEP * models.length}deg`,
    transform: `translateZ(${radius}px)`,
    animationName: reduced ? undefined : "tilt-ring",
    animationDuration: "36s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: selected ? "paused" : undefined,
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 transition-opacity duration-700 [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]"
        style={{ perspective: `${radius * 0.62}px`, perspectiveOrigin: "50% 50%", opacity: measured ? 1 : 0 }}
      >
        <ul
          className="group/ring absolute inset-0 [transform-style:preserve-3d] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={ringStyle}
        >
          {Array.from({ length: COUNT }, (_, index) => {
            const model = models[index % models.length];
            const copy = index >= models.length;
            return (
              <li
                key={index}
                className="absolute top-1/2 left-1/2 [backface-visibility:hidden]"
                style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2, transform: `rotateY(${index * STEP}deg) translateZ(${-radius}px)` }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(model.id)}
                  aria-label={`Play the film: ${model.title}`}
                  aria-hidden={copy || undefined}
                  tabIndex={copy ? -1 : 0}
                  className="group relative block size-full cursor-pointer border border-line bg-studio text-left transition-colors duration-300 hover:border-ink focus-visible:border-brand"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={showcaseMedia.final(model.id)} alt="" loading="lazy" draggable={false} className="size-full object-contain" />
                  <span className={`${monoLabel} absolute top-2 left-2.5 text-muted`}>
                    <span className="text-ink">{model.kind}</span>
                  </span>
                  <span className="absolute inset-0 grid place-items-center bg-studio/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className={`${monoLabel} flex items-center gap-2.5 bg-ink px-4 py-3 text-white transition-colors group-hover:bg-brand`}>
                      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                        <path d="M2.5 1.2v9.6L10.5 6z" fill="currentColor" />
                      </svg>
                      Play
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        aria-label={film ? `${film.title} film` : "Film"}
        data-lenis-prevent
        className="m-auto w-[min(1100px,calc(100vw-2rem))] max-w-none border border-ink bg-studio p-0 backdrop:bg-ink/70"
      >
        {film && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-ink bg-paper pl-4">
              <p className={`${monoLabel} flex min-w-0 items-center gap-2.5 text-ink`}>
                <span aria-hidden="true" className="block size-2 shrink-0 bg-brand" />
                <span className="truncate">{film.title}</span>
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={`${monoLabel} inline-flex h-12 shrink-0 cursor-pointer items-center bg-ink px-5 text-white hover:bg-brand`}
              >
                Close ×
              </button>
            </div>
            <video
              key={film.id}
              src={showcaseMedia.reel(film.id)}
              poster={showcaseMedia.poster(film.id)}
              aria-label={`${film.title}: from one image to a 3D model`}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="block aspect-[8/5] w-full bg-studio"
            />
          </div>
        )}
      </dialog>
    </div>
  );
}
