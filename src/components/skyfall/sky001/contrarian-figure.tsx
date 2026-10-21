"use client";

import { useEffect, useRef, type RefObject } from "react";
import { sky001 } from "@/content/skyfall";
import { useReducedMotion } from "@/hooks/use-media-query";
import { DOMAIN_ICONS, PIXEL_ART, type PixelIconName } from "@/lib/skyfall/pixel-art";

type DrawFn = (ctx: CanvasRenderingContext2D, t: number) => void;
type Point = [number, number];
type Project = (x: number, y: number, z: number) => Point;
type CheckStatus = "done" | "now" | "todo";

interface Palette {
  top: string;
  left: string;
  right: string;
  line: string;
}

interface Orbiter {
  name: PixelIconName;
  i: number;
  x: number;
  y: number;
  depth: number;
}

const WIDTH = 400;
const HEIGHT = 250;
const INK = "#1A1A1A";
const BLUE = "#3E57DA";
const FAINT = "#ADADAD";
const MUTED = "#7A7A7A";
const FONT = `"Geist Mono", ui-monospace, monospace`;

const { figures } = sky001.contrarian;

function useFigureCanvas(ref: RefObject<HTMLCanvasElement | null>, draw: DrawFn, still: number) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let running = false;
    let last = performance.now();
    const frozen = Number(new URLSearchParams(window.location.search).get("figT"));
    let time = reduced ? still : frozen || 0;
    const render = () => {
      const scale = canvas.width / WIDTH;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      draw(ctx, time);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      render();
    };
    const tick = (now: number) => {
      time += Math.min(0.1, (now - last) / 1000);
      last = now;
      render();
      frame = requestAnimationFrame(tick);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (reduced || frozen) return;
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    intersectionObserver.observe(canvas);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [ref, draw, still, reduced]);
}

function FigureCanvas({ draw, still, label }: { draw: DrawFn; still: number; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useFigureCanvas(ref, draw, still);
  return <canvas ref={ref} role="img" aria-label={label} className="block aspect-[8/5] w-full" />;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const easeInOutCubic = (value: number) => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

const progress = (t: number, start: number, end: number) => easeInOutCubic((t - start) / (end - start));

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = MUTED,
  align: CanvasTextAlign = "left",
  size = 11,
) {
  ctx.font = `500 ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text.toUpperCase(), x, y);
}

const isometric =
  (ox: number, oy: number, scale: number): Project =>
  (x, y, z) => [ox + (x - y) * 0.866 * scale, oy + (x + y) * 0.5 * scale - z * scale];

const EXPLORE_LOOP = 7.5;
const TILE = 66;
const COLS = 5;
const ROWS = 3;
const DOT = 3;
const GRID = TILE / DOT;
const GRID_LEFT = 11;
const GRID_TOP = 16;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function seededRandom(seed: number) {
  let state = seed * 9301 + 49297;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const hash3 = (x: number, y: number, z: number) => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

const SHADES = { top: 1, left: 0.78, right: 0.5 };

function paintPart(ctx: CanvasRenderingContext2D, kind: number, random: () => number) {
  const project = isometric(GRID / 2, GRID * 0.62, 1);
  const face = (points: Point[], shade: number) => {
    const v = Math.round(shade * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
  };
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    face([project(x0, y1, z0), project(x1, y1, z0), project(x1, y1, z1), project(x0, y1, z1)], SHADES.left);
    face([project(x1, y0, z0), project(x1, y1, z0), project(x1, y1, z1), project(x1, y0, z1)], SHADES.right);
    face([project(x0, y0, z1), project(x1, y0, z1), project(x1, y1, z1), project(x0, y1, z1)], SHADES.top);
  };
  const cylinder = (radius: number, z0: number, z1: number) => {
    const [cx, bottom] = project(0, 0, z0);
    const [, top] = project(0, 0, z1);
    const rx = radius * 1.22;
    const ry = radius * 0.707;
    const gradient = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
    gradient.addColorStop(0, "rgb(170,170,170)");
    gradient.addColorStop(1, "rgb(70,70,70)");
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - rx, top, rx * 2, bottom - top);
    ctx.beginPath();
    ctx.ellipse(cx, bottom, rx, ry, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = "rgb(242,242,242)";
    ctx.beginPath();
    ctx.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const hole = (radius: number, z: number) => {
    const [x, y] = project(0, 0, z);
    ctx.fillStyle = "rgb(40,40,40)";
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.22, radius * 0.707, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const halfX = 4 + random() * 3;
  const halfY = 3 + random() * 3;
  const height = 2 + random() * 5;
  if (kind === 0) {
    box(-halfX, -halfY, 0, halfX, halfY, height);
  } else if (kind === 1) {
    box(-halfX, -halfY, 0, halfX, halfY, height);
    hole(1.2 + random() * 1.4, height);
  } else if (kind === 2) {
    cylinder(4.5 + random() * 2, 0, 1.5 + random() * 1.5);
    const top = 1.5 + random() * 1.5 + 2 + random() * 5;
    cylinder(2 + random() * 1.4, 2.4, top);
    hole(1, top);
  } else if (kind === 3) {
    box(-halfX, -halfY, 0, halfX, halfY, 2);
    box(-halfX, -halfY, 0, -halfX + 2, halfY, 2 + height + 2);
  } else {
    box(-halfX, -halfY, 0, halfX, halfY, height * 0.5);
    box(-halfX * 0.5, -halfY * 0.6, height * 0.5, halfX * 0.5, halfY * 0.6, height + 2);
  }
}

let partBitmaps: Float32Array[] | null = null;

function getPartBitmaps(): Float32Array[] {
  if (partBitmaps) return partBitmaps;
  const canvas = document.createElement("canvas");
  canvas.width = GRID;
  canvas.height = GRID;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  partBitmaps = [];
  for (let part = 0; part < 14; part++) {
    const values = new Float32Array(484);
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, GRID, GRID);
      const random = seededRandom(part + 3);
      paintPart(ctx, part % 5, random);
      const data = ctx.getImageData(0, 0, GRID, GRID).data;
      for (let k = 0; k < values.length; k++) values[k] = data[k * 4] / 255;
    }
    partBitmaps.push(values);
  }
  return partBitmaps;
}

const drawExplore: DrawFn = (ctx, t) => {
  const phase = t % EXPLORE_LOOP;
  const cycle = Math.floor(t / EXPLORE_LOOP);
  const fade = 1 - progress(phase, 6.9, EXPLORE_LOOP);
  const grow = progress(phase, 0.7, 2.7);
  const revealed = phase > 3.2;
  const pick = (cycle * 5 + 3) % 14;
  const bitmaps = getPartBitmaps();
  const tick = Math.floor(t * 12);
  ctx.globalAlpha = fade;
  let index = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = GRID_LEFT + col * 78;
      const y = GRID_TOP + row * 78;
      if (row === 1 && col === 2) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, 65, 65);
        drawText(ctx, figures.input, x + 5, y + 13, BLUE, "left", 9);
        const sketch = progress(phase, 0, 0.7);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        const path: Point[] = [
          [x + 14, y + 52],
          [x + 52, y + 52],
          [x + 52, y + 44],
          [x + 41, y + 44],
          [x + 41, y + 24],
          [x + 25, y + 24],
          [x + 25, y + 44],
          [x + 14, y + 44],
          [x + 14, y + 52],
        ];
        const reach = (path.length - 1) * sketch;
        ctx.moveTo(...path[0]);
        for (let k = 1; k <= Math.floor(reach); k++) ctx.lineTo(...path[k]);
        const partial = reach % 1;
        if (partial > 0 && Math.floor(reach) + 1 < path.length) {
          const [x0, y0] = path[Math.floor(reach)];
          const [x1, y1] = path[Math.floor(reach) + 1];
          ctx.lineTo(x0 + (x1 - x0) * partial, y0 + (y1 - y0) * partial);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
        continue;
      }
      const bitmap = bitmaps[index];
      const picked = revealed && index === pick;
      ctx.strokeStyle = picked ? BLUE : "#E0E0E0";
      ctx.lineWidth = picked ? 1.5 : 1;
      ctx.strokeRect(x + 0.5, y + 0.5, 65, 65);
      ctx.lineWidth = 1;
      ctx.globalAlpha = fade;
      ctx.fillStyle = picked ? BLUE : "#C4C4C4";
      for (let gy = 0; gy < GRID; gy++) {
        for (let gx = 0; gx < GRID; gx++) {
          const value = bitmap[gy * GRID + gx];
          const noise = hash3(gx, gy, index);
          const on = value > 0.02 && value > BAYER[(gy % 4) * 4 + (gx % 4)] && noise < grow * 1.15;
          const flicker = grow < 1 && hash3(gx, gy, index * 31 + tick) < 0.22 * (1 - grow) * Math.min(1, grow * 6 + 0.15);
          if (on || flicker) ctx.fillRect(x + gx * DOT + 0.3, y + gy * DOT + 0.3, 2.4, 2.4);
        }
      }
      ctx.globalAlpha = fade;
      if (picked) drawText(ctx, figures.picked, x + TILE, y - 3, BLUE, "right", 9);
      index++;
    }
  }
  ctx.globalAlpha = 1;
};

const GLOBE = { x: 200, y: 112, r: 58 };
const ORBIT = { rx: 168, ry: 40, y: 118 };

function drawDomainIcon(ctx: CanvasRenderingContext2D, name: PixelIconName, cx: number, cy: number, cell: number, active: boolean) {
  const left = cx - cell * 5;
  const top = cy - cell * 5;
  for (const [x, y] of PIXEL_ART[name]) {
    if (active) {
      ctx.fillStyle = BLUE;
      ctx.fillRect(left + x * cell, top + y * cell, cell, cell);
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(left + x * cell, top + y * cell, cell, cell);
      ctx.strokeStyle = FAINT;
      ctx.strokeRect(left + x * cell + 0.5, top + y * cell + 0.5, cell - 1, cell - 1);
    }
  }
}

const drawGlobe: DrawFn = (ctx, t) => {
  const spin = t * 0.35;
  const orbit = t * 0.32;
  const count = DOMAIN_ICONS.length;
  const orbiters = DOMAIN_ICONS.map((name, i): Orbiter => {
    const angle = orbit + (i / count) * Math.PI * 2;
    return { name, i, x: GLOBE.x + ORBIT.rx * Math.cos(angle), y: ORBIT.y + ORBIT.ry * Math.sin(angle), depth: Math.sin(angle) };
  });
  const front = orbiters.reduce((best, orbiter) => (orbiter.depth > best.depth ? orbiter : best));
  const drawOrbiter = (orbiter: Orbiter) => {
    const scale = 0.62 + 0.38 * ((orbiter.depth + 1) / 2);
    ctx.globalAlpha = 0.45 + 0.55 * ((orbiter.depth + 1) / 2);
    drawDomainIcon(ctx, orbiter.name, orbiter.x, orbiter.y, 2.6 * scale, orbiter === front);
    ctx.globalAlpha = 1;
  };
  ctx.strokeStyle = "#E0E0E0";
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.ellipse(GLOBE.x, ORBIT.y, ORBIT.rx, ORBIT.ry, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  orbiters.filter((orbiter) => orbiter.depth <= 0).forEach(drawOrbiter);
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(GLOBE.x, GLOBE.y, GLOBE.r + 2, 0, Math.PI * 2);
  ctx.fill();
  const tilt = 0.32;
  for (let lat = -75; lat <= 75; lat += 12.5) {
    const phi = (lat * Math.PI) / 180;
    const ring = Math.cos(phi);
    const dots = Math.max(6, Math.round(34 * ring));
    for (let k = 0; k < dots; k++) {
      const theta = (k / dots) * Math.PI * 2 + spin;
      const sx = ring * Math.sin(theta);
      const sy = Math.sin(phi);
      const sz = ring * Math.cos(theta);
      const ty = sy * Math.cos(tilt) - sz * Math.sin(tilt);
      const tz = sy * Math.sin(tilt) + sz * Math.cos(tilt);
      if (tz < -0.05) continue;
      const x = GLOBE.x + sx * GLOBE.r;
      const y = GLOBE.y - ty * GLOBE.r;
      const size = 1.2 + tz * 1.2;
      ctx.fillStyle = Math.abs(lat) < 1 ? BLUE : INK;
      ctx.globalAlpha = 0.18 + 0.7 * tz;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#E0E0E0";
  ctx.beginPath();
  ctx.arc(GLOBE.x, GLOBE.y, GLOBE.r + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#E0E0E0";
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.ellipse(GLOBE.x, ORBIT.y, ORBIT.rx, ORBIT.ry, 0, 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
  orbiters
    .filter((orbiter) => orbiter.depth > 0)
    .sort((a, b) => a.depth - b.depth)
    .forEach(drawOrbiter);
  drawText(ctx, sky001.next.domains[front.i], GLOBE.x, 238, BLUE, "center", 12);
};

function polygon(ctx: CanvasRenderingContext2D, points: Point[], fill: string | null, stroke: string | null, dash: number[] = []) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.setLineDash(dash);
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

const PLAIN: Palette = { top: "#FFFFFF", left: "#EDEDED", right: "#D6D6D6", line: INK };
const ACTIVE: Palette = { top: "#EEF1FC", left: "#DCE2F8", right: "#B9C3F2", line: BLUE };

function drawGizmo(ctx: CanvasRenderingContext2D, ox: number, oy: number, active: { x: boolean; y: boolean; z: boolean }) {
  const axes: [string, number, number, boolean][] = [
    ["X", 0.866, 0.5, active.x],
    ["Y", -0.866, 0.5, active.y],
    ["Z", 0, -1, active.z],
  ];
  for (const [label, dx, dy, on] of axes) {
    const x = ox + dx * 30;
    const y = oy + dy * 30;
    ctx.strokeStyle = on ? BLUE : FAINT;
    ctx.lineWidth = on ? 1.8 : 1;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = on ? BLUE : FAINT;
    ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
    drawText(ctx, label, ox + dx * 41, oy + dy * 41 + 4, on ? BLUE : MUTED, "center", 11);
  }
  ctx.lineWidth = 1;
}

const rotate = (x: number, y: number, angle: number, ox = 0, oy = 0): Point => [
  ox + x * Math.cos(angle) - y * Math.sin(angle),
  oy + x * Math.sin(angle) + y * Math.cos(angle),
];

function drawSlab(
  ctx: CanvasRenderingContext2D,
  project: Project,
  hx: number,
  hy: number,
  angle: number,
  cx: number,
  cy: number,
  z0: number,
  z1: number,
  palette: Palette,
) {
  const corners = [
    [-hx, -hy],
    [hx, -hy],
    [hx, hy],
    [-hx, hy],
  ].map(([x, y]) => rotate(x, y, angle, cx, cy));
  corners
    .map((a, k) => {
      const b = corners[(k + 1) % 4];
      const nx = b[1] - a[1];
      const ny = -(b[0] - a[0]);
      return { a, b, facing: nx + ny, shade: nx - ny };
    })
    .filter((edge) => edge.facing > 0.01)
    .forEach(({ a, b, shade }) =>
      polygon(
        ctx,
        [project(a[0], a[1], z0), project(b[0], b[1], z0), project(b[0], b[1], z1), project(a[0], a[1], z1)],
        shade < 0 ? palette.left : palette.right,
        palette.line,
      ),
    );
  polygon(
    ctx,
    corners.map(([x, y]) => project(x, y, z1)),
    palette.top,
    palette.line,
  );
}

function drawPin(
  ctx: CanvasRenderingContext2D,
  project: Project,
  x: number,
  y: number,
  radius: number,
  z0: number,
  z1: number,
  palette: Palette,
  hole = 0,
) {
  const [cx, bottom] = project(x, y, z0);
  const [, top] = project(x, y, z1);
  const rx = radius * 1.22;
  const ry = radius * 0.707;
  ctx.beginPath();
  ctx.moveTo(cx - rx, top);
  ctx.lineTo(cx - rx, bottom);
  ctx.ellipse(cx, bottom, rx, ry, 0, Math.PI, 0, true);
  ctx.lineTo(cx + rx, top);
  ctx.closePath();
  ctx.fillStyle = palette.left;
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = palette.top;
  ctx.fill();
  ctx.stroke();
  if (hole) {
    ctx.beginPath();
    ctx.ellipse(cx, top, hole * 1.22, hole * 0.707, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#D6D6D6";
    ctx.fill();
    ctx.stroke();
  }
}

function drawSegment(ctx: CanvasRenderingContext2D, from: Point, to: Point, amount: number) {
  if (amount <= 0) return;
  ctx.beginPath();
  ctx.moveTo(...from);
  ctx.lineTo(from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount);
  ctx.stroke();
}

function drawCheck(ctx: CanvasRenderingContext2D, y: number, label: string, status: CheckStatus) {
  if (status === "done") {
    ctx.fillStyle = BLUE;
    ctx.fillRect(16, y - 8, 7, 7);
  } else {
    ctx.strokeStyle = status === "now" ? INK : FAINT;
    ctx.strokeRect(16.5, y - 7.5, 6, 6);
  }
  drawText(ctx, label, 30, y, status === "done" ? BLUE : status === "now" ? INK : MUTED, "left", 11);
}

const BASE = { hx: 64, hy: 38, h: 12 };
const PINS: Point[] = [
  [-30, 0],
  [30, 0],
];
const PIN = { r: 6, h: 14 };
const BRACKET = { hx: 46, hy: 17, h: 10, hole: 7.5 };
const ASSEMBLY_LOOP = 8.6;

const drawAssembly: DrawFn = (ctx, t) => {
  const phase = t % ASSEMBLY_LOOP;
  const alpha = Math.min(progress(phase, 0, 0.4) + 1e-4, 1 - progress(phase, 8, ASSEMBLY_LOOP));
  const slideX = progress(phase, 0.8, 1.6);
  const slideY = progress(phase, 1.7, 2.5);
  const turn = progress(phase, 2.8, 3.8);
  const drop = progress(phase, 4.1, 5);
  const slide = Math.min(slideX, slideY);
  const mated = phase >= 5;
  const project = isometric(232, 150, 1);
  const seat = BASE.h;
  const hover = BASE.h + PIN.h + 4;
  const startAngle = 0.45;
  const angle = startAngle * (1 - turn);
  const start = { x: 52, y: -58, z: hover + 30 };
  const startOffset = rotate(-30, 0, startAngle);
  const aligned = { x: PINS[0][0] - startOffset[0], y: PINS[0][1] - startOffset[1] };
  const offset = rotate(-30, 0, angle);
  const cx = turn > 0 ? PINS[0][0] - offset[0] : start.x + (aligned.x - start.x) * slideX;
  const cy = turn > 0 ? PINS[0][1] - offset[1] : start.y + (aligned.y - start.y) * slideY;
  const z = start.z + (hover - start.z) * progress(phase, 0.8, 2.5) + (seat - hover) * drop;
  const holes = [rotate(-30, 0, angle, cx, cy), rotate(30, 0, angle, cx, cy)];
  ctx.globalAlpha = alpha;
  drawSlab(ctx, project, BASE.hx, BASE.hy, 0, 0, 0, 0, BASE.h, PLAIN);
  PINS.forEach(([x, y]) => drawPin(ctx, project, x, y, PIN.r, BASE.h, BASE.h + PIN.h, PLAIN));
  const pinTop = BASE.h + PIN.h;
  [
    { a: project(holes[0][0], holes[0][1], z), b: project(PINS[0][0], PINS[0][1], pinTop), k: slide },
    { a: project(holes[1][0], holes[1][1], z), b: project(PINS[1][0], PINS[1][1], pinTop), k: turn },
    { a: project(cx, cy, z), b: project(cx, cy, BASE.h), k: drop },
  ].forEach(({ a, b, k }, i) => {
    if (k >= 1 || (i === 2 && turn < 1)) return;
    ctx.strokeStyle = k > 0 ? BLUE : "#CFCFCF";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 1.2;
  if (slideX > 0 && slideX < 1) drawSegment(ctx, project(holes[0][0], holes[0][1], z), project(PINS[0][0], holes[0][1], z), 1);
  if (slideY > 0 && slideY < 1) drawSegment(ctx, project(holes[0][0], holes[0][1], z), project(holes[0][0], PINS[0][1], z), 1);
  if (turn > 0 && turn < 1) {
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    for (let k = 0; k <= 20; k++) {
      const [px, py] = rotate(60, 0, angle * (1 - k / 20), PINS[0][0], PINS[0][1]);
      const point = project(px, py, z);
      if (k) ctx.lineTo(...point);
      else ctx.moveTo(...point);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.lineWidth = 1;
  drawSlab(ctx, project, BRACKET.hx, BRACKET.hy, angle, cx, cy, z, z + BRACKET.h, mated ? PLAIN : ACTIVE);
  holes.forEach(([hx, hy]) => {
    const [x, y] = project(hx, hy, z + BRACKET.h);
    ctx.beginPath();
    ctx.ellipse(x, y, BRACKET.hole * 1.22, BRACKET.hole * 0.707, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = mated ? INK : BLUE;
    ctx.stroke();
  });
  if (z + BRACKET.h < pinTop) PINS.forEach(([x, y]) => drawPin(ctx, project, x, y, PIN.r, z + BRACKET.h, pinTop, PLAIN));
  if (mated) {
    const pulse = 1 - progress(phase, 5, 5.8);
    if (pulse > 0) {
      ctx.globalAlpha = alpha * pulse;
      const spread = 1 + (1 - pulse) * 0.25;
      polygon(
        ctx,
        [
          project(cx - BRACKET.hx * spread, cy - BRACKET.hy * spread, seat),
          project(cx + BRACKET.hx * spread, cy - BRACKET.hy * spread, seat),
          project(cx + BRACKET.hx * spread, cy + BRACKET.hy * spread, seat),
          project(cx - BRACKET.hx * spread, cy + BRACKET.hy * spread, seat),
        ],
        null,
        BLUE,
      );
      ctx.globalAlpha = alpha;
    }
    const [tx, ty] = project(cx + BRACKET.hx, cy - BRACKET.hy, seat + BRACKET.h);
    ctx.fillStyle = BLUE;
    ctx.fillRect(tx + 8, ty - 9, 6, 6);
    drawText(ctx, figures.mated, tx + 18, ty - 2, BLUE, "left", 11);
  }
  const steps = [slide, turn, drop];
  figures.constraints.forEach((label, n) => drawCheck(ctx, 26 + n * 16, label, steps[n] >= 1 ? "done" : steps[n] > 0 ? "now" : "todo"));
  const dof = mated ? 0 : turn >= 1 ? 1 : slide >= 1 ? 2 : 6;
  drawText(ctx, `${figures.dof} ${dof}`, 16, 84, dof === 0 ? BLUE : INK, "left", 12);
  if (mated) drawText(ctx, figures.constrained, 16, 100, BLUE, "left", 11);
  const readouts: [string, number, number, string][] = [
    ["ΔX", holes[0][0] - PINS[0][0], slideX, ""],
    ["ΔY", holes[0][1] - PINS[0][1], slideY, ""],
    ["ΔZ", z - seat, drop, ""],
    ["Δθ", (angle * 180) / Math.PI, turn, "°"],
  ];
  ctx.font = `500 11px ${FONT}`;
  const column = 384 - ctx.measureText("ΔX +00.0°").width;
  readouts.forEach(([label, value, active, unit], n) => {
    const color = Math.abs(value) < 0.05 ? BLUE : active > 0 ? INK : MUTED;
    drawText(ctx, `${label} ${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}${unit}`, column, 190 + n * 16, color, "left", 11);
  });
  drawGizmo(ctx, 46, 214, { x: slideX > 0, y: slideY > 0, z: turn > 0 || drop > 0 });
  ctx.globalAlpha = 1;
};

const DRAWS: DrawFn[] = [drawAssembly, drawExplore, drawGlobe];
const STILLS = [6, 4.5, 0.6];

export function ContrarianFigure({ index }: { index: 0 | 1 | 2 }) {
  return <FigureCanvas draw={DRAWS[index]} still={STILLS[index]} label={figures.alts[index]} />;
}
