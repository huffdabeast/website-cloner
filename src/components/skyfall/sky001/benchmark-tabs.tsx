"use client";

import { useId, useState } from "react";
import { chartMeta, type BenchmarkModel, type BenchmarkView, type ChartMetric } from "@/content/skyfall";
import { Panel } from "@/components/skyfall/ui/layout";
import { VideoFigure, type VideoTone } from "@/components/skyfall/ui/video-figure";
import { BarChart } from "./bar-chart";
import { metricLabels, type BenchmarkClipSource } from "./benchmark";

export function BenchmarkChartTabs({ story }: { story: BenchmarkModel }) {
  const model = story.key;
  const tag = story.tag;
  const metrics = chartMeta.metrics[model];
  const [active, setActive] = useState<ChartMetric>(metrics[0]);
  const id = useId();
  return (
    <div className="lg:hidden">
      <div role="tablist" aria-label={`${tag} charts`} className="grid grid-cols-3 border-x border-t border-ink">
        {metrics.map((metric, index) => (
          <button
            key={metric}
            role="tab"
            id={`${id}-${metric}`}
            aria-selected={active === metric}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(metric)}
            className={`min-h-11 text-[15px] tracking-[-0.02em] transition-colors ${index > 0 ? "border-l border-ink" : ""} ${active === metric ? "bg-ink text-white" : "bg-paper text-ink hover:bg-studio"}`}
          >
            {chartMeta.charts[metric].tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active}`}>
        <BarChart key={active} rows={story.rows} labels={metricLabels(story, active)} model={model} metric={active} tag={tag} />
      </div>
    </div>
  );
}

interface BenchmarkFilmsProps {
  title: string;
  views: BenchmarkView[];
  clips: BenchmarkClipSource[];
  tone: VideoTone;
}

export function BenchmarkFilms({ title, views, clips, tone }: BenchmarkFilmsProps) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <>
      <div className="mt-3 hidden grid-cols-2 gap-3 lg:grid">
        {views.map((view, index) => (
          <Panel key={view.label} title={<h4>{view.label}</h4>} bodyClassName="">
            <VideoFigure src={clips[index].src} poster={clips[index].poster} label={view.clipLabel} tone={tone} className="border-0" />
          </Panel>
        ))}
      </div>
      <div className="lg:hidden">
        <div role="tablist" aria-label={`${title} films`} className="grid grid-cols-2 border-x border-ink">
          {views.map((view, index) => (
            <button
              key={view.label}
              type="button"
              role="tab"
              id={`${id}-${index}`}
              aria-selected={active === index}
              aria-controls={`${id}-panel`}
              onClick={() => setActive(index)}
              className={`min-h-11 text-[15px] tracking-[-0.02em] transition-colors ${index > 0 ? "border-l border-ink" : ""} ${active === index ? "bg-ink text-white" : "bg-paper text-ink hover:bg-studio"}`}
            >
              {view.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active}`}>
          <VideoFigure key={active} src={clips[active].src} poster={clips[active].poster} label={views[active].clipLabel} tone={tone} />
        </div>
      </div>
    </>
  );
}
