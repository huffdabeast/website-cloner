import type { ReactNode } from "react";
import { SplitReveal } from "@/components/skyfall/motion/reveal";
import { container, gutter, headingBase } from "@/lib/skyfall/classes";

const grounds = {
  paper: "bg-paper text-ink",
  studio: "bg-studio text-ink",
  night: "grid-dark text-white",
  ink: "bg-night text-white",
  blue: "bg-brand text-white",
};

export type Ground = keyof typeof grounds;
export type Tone = "light" | "dark";

interface SectionProps {
  id?: string;
  ground?: Ground;
  className?: string;
  field?: ReactNode;
  children?: ReactNode;
}

export function Section({ id, ground = "paper", className = "", field, children }: SectionProps) {
  return (
    <section id={id} className={`relative ${grounds[ground]} ${gutter} py-16 md:py-24 lg:py-28 ${className}`}>
      {field}
      <div className={`relative ${container}`}>{children}</div>
    </section>
  );
}

export function Frame({ children, tone = "light", className = "" }: { children?: ReactNode; tone?: Tone; className?: string }) {
  const corner = `absolute block size-2 ${tone === "dark" ? "border-white/60" : "border-ink/50"}`;
  return (
    <div className={`relative py-6 md:py-10 ${className}`}>
      <span aria-hidden="true" className={`${corner} top-0 left-0 border-t border-l`} />
      <span aria-hidden="true" className={`${corner} top-0 right-0 border-t border-r`} />
      <span aria-hidden="true" className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden="true" className={`${corner} right-0 bottom-0 border-r border-b`} />
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children?: ReactNode;
  tone?: Tone;
  align?: "center" | "left";
  size?: "lg" | "md";
  id?: string;
  note?: ReactNode;
  className?: string;
}

export function SectionTitle({ children, tone = "light", align = "center", size = "lg", id, note, className = "" }: SectionTitleProps) {
  const scale =
    size === "lg"
      ? "text-[40px] leading-[0.95] sm:text-[64px] lg:text-[96px] lg:leading-[0.9]"
      : "text-[34px] leading-[0.98] sm:text-[48px] lg:text-[64px] lg:leading-[0.94]";
  return (
    <Frame tone={tone} className={className}>
      <div id={id}>
        <SplitReveal as="h2" className={`${headingBase} ${scale} ${align === "center" ? "mx-auto max-w-[15ch] text-center" : "max-w-[16ch]"}`}>
          {children}
        </SplitReveal>
      </div>
      {note && (
        <p
          className={`mt-4 font-mono text-[11px] tracking-[0.05em] capitalize md:text-xs ${align === "center" ? "text-center" : ""} ${tone === "dark" ? "text-white/80" : "text-body"}`}
        >
          {note}
        </p>
      )}
    </Frame>
  );
}

export function LabelBlock({ label, children, tone = "light", className = "" }: { label?: ReactNode; children?: ReactNode; tone?: Tone; className?: string }) {
  return (
    <div className={`flex flex-col justify-between gap-8 border-l pl-2.5 md:gap-12 ${tone === "dark" ? "border-white/70" : "border-ink"} ${className}`}>
      {label && <div className={`font-mono text-[11px] font-medium tracking-[0.05em] capitalize ${tone === "dark" ? "text-white/80" : "text-body"}`}>{label}</div>}
      <div>{children}</div>
    </div>
  );
}

interface PanelProps {
  title?: ReactNode;
  accent?: boolean;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, accent = false, children, className = "", bodyClassName = "bg-paper" }: PanelProps) {
  return (
    <div className={`border border-ink bg-paper text-ink ${className}`}>
      <div
        className={`flex min-h-6 items-center px-1.5 font-mono text-xs font-medium tracking-[0.02em] text-white md:text-[13px] ${accent ? "bg-brand" : "bg-ink"}`}
      >
        {title}
      </div>
      <div className={`border-t border-ink ${bodyClassName}`}>{children}</div>
    </div>
  );
}

interface FigureProps {
  tag?: ReactNode;
  children?: ReactNode;
  title?: ReactNode;
  caption?: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Figure({ tag, children, title, caption, className = "", padded = true }: FigureProps) {
  return (
    <figure className={`flex flex-col border-l border-ink ${className}`}>
      <div className={`dots-grey relative flex-1 ${padded ? "px-4 pt-12 pb-8 md:px-8 md:pt-14 md:pb-10" : ""}`}>
        <span className="absolute top-0 left-0 z-10 bg-ink px-1.5 py-0.5 font-mono text-xs font-medium tracking-[0.02em] text-white md:text-[13px]">{tag}</span>
        {children}
      </div>
      {(title || caption) && (
        <figcaption className="pt-4 pl-2.5">
          {title && <span className="block text-[15px] font-medium tracking-[-0.03em] md:text-base">{title}</span>}
          {caption && <span className="mt-1 block text-sm leading-snug tracking-[-0.02em] text-muted md:text-[15px]">{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function CornerDots({ tone = "light" }: { tone?: Tone }) {
  const dot = `absolute block size-1.5 ${tone === "dark" ? "bg-white" : "bg-ink"}`;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`${dot} top-1.5 left-1.5`} />
      <span className={`${dot} top-1.5 right-1.5`} />
      <span className={`${dot} bottom-1.5 left-1.5`} />
      <span className={`${dot} right-1.5 bottom-1.5`} />
    </span>
  );
}

interface GridFieldProps {
  tone?: "light" | "blue";
  cell?: number;
  mask?: string;
  className?: string;
}

export function GridField({ tone = "light", cell = 32, mask = "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)", className = "" }: GridFieldProps) {
  const line = tone === "blue" ? "var(--color-grid-on-dark)" : "var(--color-grid)";
  const size = Math.round(cell);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: "-1px -1px",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
