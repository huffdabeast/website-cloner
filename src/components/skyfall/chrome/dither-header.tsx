"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";

export type DitherScene = "cubes" | "queue";

type Ctx = CanvasRenderingContext2D;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const SCENE_W = 280;
const SCENE_H = 110;
const STEP = 64;
const LOOP = 2.6;

const ease = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

const grey = (value: number) => {
  const v = Math.round(value * 255);
  return `rgb(${v},${v},${v})`;
};

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, rotation: number, shade: number) {
  ctx.fillStyle = grey(shade);
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fill();
}

function polygon(ctx: Ctx, points: number[], shade: number) {
  ctx.fillStyle = grey(shade);
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 2) {
    if (i) ctx.lineTo(points[i], points[i + 1]);
    else ctx.moveTo(points[i], points[i + 1]);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCubes(ctx: Ctx, gap: number, ring: number, bob: number) {
  const cx = SCENE_W / 2;
  const half = 34.64;
  const base = 97 + bob;
  const top = base - 40;
  const left = -gap / 2;
  polygon(ctx, [cx + left - half, top - 20, cx + left, top, cx + left, top - 40], 0.98);
  polygon(ctx, [cx + left - half, top - 20, cx + left, top, cx + left, base, cx + left - half, base - 20], 0.62);
  const right = gap / 2;
  polygon(ctx, [cx + right, top, cx + right + half, top - 20, cx + right, top - 40], 0.84);
  polygon(ctx, [cx + right, top, cx + right + half, top - 20, cx + right + half, base - 20, cx + right, base], 0.34);
  ellipse(ctx, cx, base + 9, 46 + gap * 0.5, 5, 0, 0.16);
  if (ring > 0) {
    const y = top - 20;
    ctx.strokeStyle = grey(ring);
    ctx.lineWidth = 2.5;
    const radius = 6 + (1 - ring) * 70;
    ctx.beginPath();
    ctx.ellipse(cx, y, radius, radius * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ellipse(ctx, cx, y, 3 + 4 * ring, 3 + 4 * ring, 0, ring);
  }
}

function cube(ctx: Ctx, x: number, y: number, size: number, topShade: number, leftShade: number, rightShade: number) {
  const dx = size * 0.866;
  const dy = size / 2;
  const top = y - size;
  polygon(ctx, [x - dx, top - dy, x, top, x + dx, top - dy, x, top - 2 * dy], topShade);
  polygon(ctx, [x - dx, top - dy, x, top, x, y, x - dx, y - dy], leftShade);
  polygon(ctx, [x, top, x + dx, top - dy, x + dx, y - dy, x, y], rightShade);
}

function drawQueue(ctx: Ctx, time: number) {
  const cx = SCENE_W / 2;
  const phase = time % LOOP;
  const shift = ease(phase / 0.8) * STEP;
  const lift = phase < 0.9 ? 0 : phase < 1.3 ? ease((phase - 0.9) / 0.4) : phase < 2 ? 1 : 1 - ease((phase - 2) / 0.45);
  polygon(ctx, [0, 102, SCENE_W, 102, SCENE_W, 104, 0, 104], 0.32);
  polygon(ctx, [0, 109, SCENE_W, 109, SCENE_W, 110.5, 0, 110.5], 0.18);
  for (let slot = -5; slot <= 4; slot++) {
    const x = cx + slot * STEP + shift;
    const presence = Math.max(0, 1 - Math.abs(x - cx) / (SCENE_W * 0.62));
    if (presence <= 0) continue;
    const picked = slot === -1 && phase >= 0.8;
    const raise = picked ? lift : 0;
    const glow = 0.72 + 0.28 * raise;
    cube(ctx, x, 96 - raise * 26, 32, 0.95 * presence * glow + 0.05 * raise, 0.62 * presence * glow, 0.36 * presence * glow);
    if (picked && raise > 0) {
      const flicker = raise * (0.6 + 0.4 * Math.sin(time * 8));
      const px = x + 36;
      const py = 64 - 26 * raise + 2;
      polygon(ctx, [px, py, px + 13, py + 6, px + 7, py + 8, px + 10, py + 15, px + 7, py + 16, px + 4, py + 9, px, py + 13], flicker);
      ellipse(ctx, x, 98, 26 * raise, 3.5, 0, 0.25 * raise);
    }
  }
}

function runDither(canvas: HTMLCanvasElement, still: boolean, scene: DitherScene) {
  const ctx = canvas.getContext("2d");
  const buffer = document.createElement("canvas");
  const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx || !bufferCtx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let frame = 0;
  let start = performance.now();

  const rasterize = (paint: (target: Ctx) => void) => {
    bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
    bufferCtx.fillStyle = "#000";
    bufferCtx.fillRect(0, 0, cols, rows);
    const usable = rows * 0.74;
    const scale = Math.min(cols / SCENE_W, usable / SCENE_H) * 0.96;
    bufferCtx.setTransform(scale, 0, 0, scale, (cols - SCENE_W * scale) / 2, rows * 0.06 + (usable - SCENE_H * scale) / 2);
    paint(bufferCtx);
    return bufferCtx.getImageData(0, 0, cols, rows).data;
  };

  const threshold = (pixels: Uint8ClampedArray, jitter = 0) => {
    const lit: [number, number][] = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const value = pixels[(y * cols + x) * 4] / 255;
        if (value <= 0.02) continue;
        if (value + jitter * (Math.sin(x * 12.9 + y * 78.2) * 0.5) > BAYER[(y % 4) * 4 + (x % 4)]) lit.push([x, y]);
      }
    return lit;
  };

  const dot = (x: number, y: number, size: number) => {
    ctx.fillRect((x + 0.5) * 3 - size / 2, (y + 0.5) * 3 - size / 2, size, size);
  };

  const draw = (time: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let y = 0; y < rows; y += 2) for (let x = 0; x < cols; x += 2) dot(x, y, 1.2);
    ctx.fillStyle = "#FFFFFF";
    const gap = 70 * (1 - ease((time - 0.25) / 1.3));
    const ring = time > 1.55 ? Math.max(0, 1 - (time - 1.55) / 0.9) : 0;
    const bob = time > 2.4 ? Math.sin((time - 2.4) * 1.6) * 1.5 : 0;
    const paint = scene === "queue" ? (target: Ctx) => drawQueue(target, time) : (target: Ctx) => drawCubes(target, gap, ring, bob);
    for (const [x, y] of threshold(rasterize(paint))) dot(x, y, 1.9);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cols = Math.max(1, Math.floor(width / 3));
    rows = Math.max(1, Math.floor(height / 3));
    buffer.width = cols;
    buffer.height = rows;
    start = performance.now();
    draw(still ? (scene === "queue" ? 1.6 : 99) : 0);
  };

  const loop = (now: number) => {
    draw((now - start) / 1000);
    frame = requestAnimationFrame(loop);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  if (!still) frame = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}

export function DitherHeader({ active, scene = "cubes" }: { active: boolean; scene?: DitherScene }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (canvas && active) return runDither(canvas, reduced, scene);
  }, [active, reduced, scene]);
  return (
    <div aria-hidden="true" className="relative h-48 overflow-hidden bg-brand sm:h-56">
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  );
}
