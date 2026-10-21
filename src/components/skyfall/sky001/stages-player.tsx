"use client";

import { useEffect, useRef, useState } from "react";
import { sky001 } from "@/content/skyfall";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-media-query";
import { headingBase, monoLabel } from "@/lib/skyfall/classes";
import { stageMedia } from "@/lib/skyfall/media";
import { SplitReveal } from "@/components/skyfall/motion/reveal";

const stages = sky001.stages.items;

export function StagesPlayer({ titleId }: { titleId: string }) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, "0px");
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const media = stageMedia[stages[active].key];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [inView, reduced, active]);

  const frame = useRef(0);
  const startProgress = () => {
    cancelAnimationFrame(frame.current);
    const tick = () => {
      const video = videoRef.current;
      if (video?.duration) setProgress(video.currentTime / video.duration);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  const stopProgress = () => cancelAnimationFrame(frame.current);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const select = (index: number) => {
    setProgress(0);
    if (index !== active) {
      setActive(index);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    if (!reduced) video.play().catch(() => {});
  };

  return (
    <>
      <SplitReveal as="h2" id={titleId} className={`${headingBase} text-[30px] leading-none sm:text-[40px] lg:text-[48px]`}>
        {sky001.stages.title}
      </SplitReveal>
      <div ref={gridRef} className="mt-10 grid gap-8 md:mt-12 xl:grid-cols-[minmax(0,330px)_minmax(0,1fr)] xl:gap-10">
        <figure className="relative overflow-hidden border border-ink bg-black xl:order-last">
          <div aria-hidden="true" className="aspect-video" />
          <video
            key={media.src}
            ref={videoRef}
            src={inView || reduced ? media.src : undefined}
            poster={media.poster}
            aria-label={`${stages[active].label}: ${stages[active].title}`}
            muted
            playsInline
            preload="none"
            controls={reduced}
            onPlay={startProgress}
            onPause={stopProgress}
            onEnded={() => {
              stopProgress();
              if (reduced) return;
              setProgress(0);
              setActive((current) => (current + 1) % stages.length);
            }}
            className="absolute inset-0 size-full object-cover"
          />
        </figure>
        <div className="-mt-5 xl:hidden">
          <div className="flex border-t border-l border-line bg-paper">
            {stages.map((stage, index) => {
              const current = index === active;
              return (
                <button
                  key={stage.key}
                  type="button"
                  aria-current={current ? "step" : undefined}
                  aria-label={`${stage.label}: ${stage.title}`}
                  onClick={() => select(index)}
                  className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center border-r border-b px-1 font-mono text-xs tracking-[-0.02em] uppercase transition-colors duration-300 sm:text-[13px] ${current ? "border-brand bg-brand font-semibold text-white" : "border-line font-medium text-muted hover:bg-studio"}`}
                >
                  {current ? `<${stage.label}>` : stage.label}
                  {current && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/35">
                      <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${progress})` }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <h3 className="mt-6 text-[22px] leading-[1.15] font-medium tracking-[-0.03em] text-ink md:text-[26px]">{stages[active].title}</h3>
          <p className="mt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body md:text-base">{stages[active].body}</p>
        </div>
        <ol className="hidden flex-col xl:flex">
          {stages.map((stage, index) => {
            const current = index === active;
            return (
              <li key={stage.key} className="relative xl:grow">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-line">
                  <span
                    className="block w-full origin-top bg-brand"
                    style={{ height: "100%", transform: `scaleY(${index < active ? 1 : current ? progress : 0})` }}
                  />
                </span>
                <p className={`${monoLabel} flex items-center gap-2.5 pt-4 pl-6 md:pt-5 md:pl-7 xl:pt-0 ${current ? "text-brand" : "text-faint"}`}>
                  <span aria-hidden="true" className={`block size-2 ${current ? "bg-brand" : "bg-line"}`} />
                  {stage.label}
                </p>
                <h3 className="pl-6 md:pl-7">
                  <button
                    type="button"
                    aria-current={current ? "step" : undefined}
                    onClick={() => select(index)}
                    className={`mt-2 block w-full xl:mt-1.5 cursor-pointer text-left font-medium tracking-[-0.03em] transition-colors duration-300 after:absolute after:inset-0 ${current ? "text-[22px] leading-[1.15] text-ink md:text-[26px] xl:text-[22px]" : "text-[19px] leading-[1.2] text-faint hover:text-muted md:text-[20px] xl:text-[17px]"}`}
                  >
                    {stage.title}
                  </button>
                </h3>
                <div
                  className={`grid pb-4 pl-6 transition-[grid-template-rows] duration-500 ease-out-expo md:pb-5 md:pl-7 xl:pb-0 ${current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body md:text-base xl:pt-2 xl:text-[15px] xl:leading-[1.4]">{stage.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
