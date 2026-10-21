"use client";

import { useRef } from "react";
import { chartMeta, type BenchmarkModel, type BenchmarkRow, type ChartMetric } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/skyfall/gsap";
import { Panel } from "@/components/skyfall/ui/layout";
import { formatLike, metricValue } from "./benchmark";

interface BarChartProps {
  rows: BenchmarkRow[];
  labels: string[];
  model: BenchmarkModel["key"];
  metric: ChartMetric;
  tag: string;
}

export function BarChart({ rows, labels, model, metric, tag }: BarChartProps) {
  const base = chartMeta.charts[metric];
  const bimTitle = model === "bim" && metric !== "iou" ? chartMeta.titles.bim?.[metric] : undefined;
  const chart = { ...base, title: bimTitle ?? base.title };
  const axis = chartMeta.axes[model][metric];
  const ticks = chartMeta.ticks[model][metric];
  const max = axis[axis.length - 1];
  const footnote = chartMeta.footnotes[model]?.[metric];
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      const bars = el.querySelectorAll("[data-bar]");
      const values = el.querySelectorAll<HTMLElement>("[data-value]");
      const timeline = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      timeline.from(bars, { scaleX: 0, duration: 1.4, ease: "power3.out", stagger: 0.08 }, 0);
      values.forEach((value, index) => {
        const label = value.dataset.label ?? "";
        const target = Number(value.dataset.value);
        const counter = { n: 0 };
        value.textContent = formatLike(label, 0);
        timeline.to(
          counter,
          {
            n: target,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: () => {
              value.textContent = formatLike(label, counter.n);
            },
            onComplete: () => {
              value.textContent = label;
            },
          },
          index * 0.08,
        );
      });
    },
    { scope: ref, dependencies: [reduced, metric] },
  );

  return (
    <Panel
      title={
        <span className="flex w-full justify-between gap-2">
          <span>
            {chart.title} {chart.arrow}
          </span>
          <span className="text-white/70">{tag}</span>
        </span>
      }
      className="h-full"
      bodyClassName="bg-paper px-3 pt-3 pb-3 md:px-4"
    >
      <div
        ref={ref}
        role="img"
        aria-label={`${chart.title}, ${tag}, ${chart.note.toLowerCase()}: ${rows.map((row, index) => `${row.model} ${labels[index]}`).join(", ")}${footnote ? `. ${footnote}` : ""}`}
      >
        <ul aria-hidden="true">
          {rows.map((row, index) => {
            const value = metricValue(row, metric);
            const label = labels[index];
            return (
              <li
                key={row.model}
                className={`grid min-h-8 grid-cols-[minmax(0,7.5rem)_1fr_4.5rem] items-center gap-2 border-b border-line text-[13px] tracking-[-0.02em] md:text-sm ${row.ours ? "-mx-3 bg-tint px-3 font-medium text-brand md:-mx-4 md:px-4" : ""}`}
              >
                <span className="truncate">{row.model}</span>
                <span className="relative h-2.5">
                  {value !== null && (
                    <span
                      data-bar
                      className={`absolute inset-y-0 left-0 origin-left ${row.ours ? "bg-brand" : "bg-bar"}`}
                      style={{ width: `${Math.max((value / max) * 100, 0.6)}%` }}
                    />
                  )}
                </span>
                <span data-value={value ?? undefined} data-label={label} className="text-right font-mono text-xs tabular-nums md:text-[13px]">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        <div aria-hidden="true" className="grid grid-cols-[minmax(0,7.5rem)_1fr_4.5rem] gap-2 pt-1.5">
          <span />
          <span className="relative h-4 font-mono text-[10px] text-muted md:text-[11px]">
            {axis.map((tick, index) => (
              <span
                key={tick}
                className={`absolute top-0 ${index === 0 ? "left-0" : "-translate-x-1/2"}`}
                style={index === 0 ? undefined : { left: `${(tick / max) * 100}%` }}
              >
                {ticks[index]}
              </span>
            ))}
          </span>
        </div>
        <p aria-hidden="true" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] font-medium md:text-[11px]">
          <span className="text-brand">{chart.note}</span>
          {footnote && <span className="text-muted">{footnote}</span>}
        </p>
      </div>
    </Panel>
  );
}
