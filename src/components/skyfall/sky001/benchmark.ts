import { chartMeta, type BenchmarkModel, type BenchmarkRow, type ChartMetric } from "@/content/skyfall";
import type { VideoTone } from "@/components/skyfall/ui/video-figure";

export interface BenchmarkClipSource {
  src: string;
  poster: string;
}

export interface BenchmarkClip extends BenchmarkClipSource {
  tone: VideoTone;
  second?: BenchmarkClipSource;
}

const LABEL_COLUMNS: ChartMetric[] = ["iou", "time", "cost"];

export function metricValue(row: BenchmarkRow, metric: ChartMetric) {
  return metric === "time" ? row.seconds : metric === "cost" ? row.cost : row.iou;
}

function parseLabel(label: string) {
  const match = /^(\$?)([\d,]+)(?:\.(\d+))?(.*)$/.exec(label);
  return match ? { prefix: match[1], decimals: match[3]?.length ?? 0, commas: match[2].includes(","), suffix: match[4] } : null;
}

export function formatLike(label: string, value: number) {
  const format = parseLabel(label);
  if (!format) return label;
  const digits = format.commas
    ? value.toLocaleString("en-US", { minimumFractionDigits: format.decimals, maximumFractionDigits: format.decimals })
    : value.toFixed(format.decimals);
  return `${format.prefix}${digits}${format.suffix}`;
}

export function metricLabels(story: BenchmarkModel, metric: ChartMetric) {
  return chartMeta.labels[story.key].map((labels) => labels[LABEL_COLUMNS.indexOf(metric)]);
}
