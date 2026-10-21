"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-media-query";

type HalftoneTone = "light" | "blue" | "night";
type HalftoneFade = "none" | "down" | "up";

const DOT_COLORS: Record<HalftoneTone, [number, number, number]> = {
  light: [0.2431, 0.3412, 0.8549],
  blue: [0.84, 0.86, 0.91],
  night: [0.4353, 0.5137, 0.9412],
};

const FALLBACK_COLORS: Record<HalftoneTone, string> = {
  light: "rgba(62, 87, 218, 0.5)",
  blue: "rgba(214, 219, 232, 0.7)",
  night: "rgba(111, 131, 240, 0.5)",
};

const FADE_UNIFORM: Record<HalftoneFade, number> = { none: 0, down: 1, up: -1 };

const FADE_MASK: Record<HalftoneFade, string | undefined> = {
  none: undefined,
  down: "linear-gradient(to bottom, #000 20%, transparent)",
  up: "linear-gradient(to top, #000 20%, transparent)",
};

const EFFECTS = [
  { id: "dots", mode: 0 },
  { id: "contours", mode: 1 },
  { id: "cells", mode: 2 },
  { id: "floor", mode: 3 },
  { id: "dither", mode: 4 },
  { id: "warp", mode: 1 },
  { id: "pulse", mode: 1 },
];
const DEFAULT_EFFECT = "contours";

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
#define gl_FragColor fragColor
out highp vec4 fragColor;
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform vec3 uDot;
uniform vec3 uPointer;
uniform float uFade;
uniform int uMode;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}
float bayer4(vec2 c) {
  vec2 m = mod(c, 4.0);
  float i = m.x + m.y * 4.0;
  float v = 0.0;
  if (i < 0.5) v = 0.0; else if (i < 1.5) v = 8.0; else if (i < 2.5) v = 2.0; else if (i < 3.5) v = 10.0;
  else if (i < 4.5) v = 12.0; else if (i < 5.5) v = 4.0; else if (i < 6.5) v = 14.0; else if (i < 7.5) v = 6.0;
  else if (i < 8.5) v = 3.0; else if (i < 9.5) v = 11.0; else if (i < 10.5) v = 1.0; else if (i < 11.5) v = 9.0;
  else if (i < 12.5) v = 15.0; else if (i < 13.5) v = 7.0; else if (i < 14.5) v = 13.0; else v = 5.0;
  return (v + 0.5) / 16.0;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr, uRes.y - gl_FragCoord.y / uDpr);
  float span = max(uRes.x, 900.0);
  float t = uTime * 0.045;
  float y = p.y / uRes.y;
  float fade = 1.0;
  if (uFade > 0.5) fade = 1.0 - smoothstep(0.25, 1.0, y);
  if (uFade < -0.5) fade = smoothstep(0.0, 0.75, y);
  float lens = uPointer.z * (1.0 - smoothstep(0.0, 170.0, distance(p, uPointer.xy)));
  float a = 0.0;

  if (uMode == 0) {
    vec2 c = floor(p / uCell);
    vec2 l = (p - c * uCell) / uCell - 0.5;
    vec2 q = (c * uCell) / span;
    float n = fbm(q * 3.2 + vec2(t, -t * 0.6)) * 0.62 + fbm(q * 1.3 - vec2(t * 0.5, t)) * 0.5;
    float level = max(smoothstep(0.42, 0.86, n) * fade, lens * 0.9);
    float r = 0.5 * sqrt(level) * 0.92;
    a = r < 0.03 ? 0.0 : (1.0 - smoothstep(r - 0.06, r + 0.06, length(l))) * 0.85;
  } else if (uMode == 1) {
    vec2 q = p / span;
    float n = fbm(q * 2.1 + vec2(t * 0.8, -t * 0.5)) + 0.35 * fbm(q * 0.9 - vec2(t * 0.3, t * 0.4)) + lens * 0.16;
    float v = n * 15.0;
    float w = fwidth(v);
    float line = 1.0 - smoothstep(0.0, 1.3, abs(fract(v) - 0.5) / w);
    float bold = 1.0 - smoothstep(0.0, 1.6, abs(fract(v / 5.0) - 0.5) / (w / 5.0));
    a = (line * 0.6 + bold * 0.7) * fade + line * lens * 0.4;
  } else if (uMode == 2) {
    float size = uCell * 4.0;
    vec2 c = floor(p / size);
    vec2 l = p - c * size;
    float edge = (1.0 - step(1.0, min(l.x, l.y))) * 0.22;
    float beat = floor(uTime * 1.2 + hash(c) * 9.0);
    float h = hash(c + beat * 0.137);
    float n = fbm(c * 0.09 + vec2(t, -t));
    float lit = step(0.9 - n * 0.22, h) * (0.25 + 0.55 * fract(h * 7.0));
    float trail = 1.0 - smoothstep(0.0, size * 2.6, distance((c + 0.5) * size, uPointer.xy));
    lit = max(lit, uPointer.z * trail * 0.8);
    float inset = step(2.0, l.x) * step(2.0, l.y);
    a = (edge + lit * inset) * fade;
  } else if (uMode == 3) {
    float horizon = uFade < -0.5 ? 0.05 : 0.0;
    float yy = uFade > 0.5 ? 1.0 - y : y;
    float depth = 1.0 / max(yy - horizon + 0.04, 0.04);
    vec2 g = vec2((p.x / uRes.x - 0.5) * depth * 5.0 + lens * 0.3, depth * 1.4 + uTime * 0.12);
    g.y += 0.18 * sin(g.x * 1.7 + uTime * 0.4);
    vec2 w = fwidth(g);
    vec2 d = abs(fract(g) - 0.5) / w;
    float line = 1.0 - smoothstep(0.0, 1.4, min(d.x, d.y));
    float near = smoothstep(0.02, 0.5, yy);
    a = line * (0.2 + 0.6 * near) * fade;
  } else {
    float px = 3.0;
    vec2 c = floor(p / px);
    vec2 q = (c * px) / span;
    float n = fbm(q * 2.6 + vec2(t, -t * 0.7)) * 0.7 + fbm(q * 1.1 - vec2(t * 0.4, t * 0.6)) * 0.45;
    float level = max(smoothstep(0.38, 0.95, n) * fade, lens * 0.75);
    a = step(bayer4(c), level) * 0.8;
  }

  gl_FragColor = vec4(uDot, a);
}
`;

let webgl2Support: boolean | undefined;

function supportsWebGL2() {
  if (webgl2Support !== undefined) return webgl2Support;
  try {
    webgl2Support = !!document.createElement("canvas").getContext("webgl2");
  } catch {
    webgl2Support = false;
  }
  return webgl2Support;
}

const noopSubscribe = () => () => {};

function readEffect() {
  const id = new URLSearchParams(window.location.search).get("fx");
  return EFFECTS.some((effect) => effect.id === id) && id ? id : DEFAULT_EFFECT;
}

function maxDpr() {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return coarse || cores <= 4 || memory <= 4 ? 1.5 : 2;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface HalftoneCanvasProps {
  tone: HalftoneTone;
  fade: number;
  cell: number;
  mode: number;
}

function HalftoneCanvas({ tone, fade, cell, mode }: HalftoneCanvasProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<((now: number) => void) | null>(null);
  const running = useRef(false);
  const inView = useInView(wrapper);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = canvas.current;
    const box = wrapper.current;
    if (!el || !box) return;
    const gl = el.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uTime = uniform("uTime");
    const uRes = uniform("uRes");
    const uDpr = uniform("uDpr");
    const uPointer = uniform("uPointer");
    gl.uniform1f(uniform("uCell"), cell);
    gl.uniform3f(uniform("uDot"), ...DOT_COLORS[tone]);
    gl.uniform1f(uniform("uFade"), fade);
    gl.uniform1i(uniform("uMode"), mode);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const pointer = { x: -9999, y: -9999, target: 0, value: 0 };
    const size = { width: 1, height: 1, dpr: 1 };
    const start = performance.now();
    let last = start;

    const render = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      pointer.value += (pointer.target - pointer.value) * Math.min(1, delta * 6);
      gl.viewport(0, 0, el.width, el.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uRes, size.width, size.height);
      gl.uniform1f(uDpr, size.dpr);
      gl.uniform3f(uPointer, pointer.x, pointer.y, pointer.value);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      size.dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), maxDpr());
      size.width = Math.max(1, rect.width);
      size.height = Math.max(1, rect.height);
      el.width = Math.round(size.width * size.dpr);
      el.height = Math.round(size.height * size.dpr);
      if (!running.current) render(performance.now());
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.target = inside && event.pointerType === "mouse" ? 1 : 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(box);
    resize();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    renderer.current = render;

    return () => {
      renderer.current = null;
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [tone, fade, cell, mode]);

  useEffect(() => {
    if (reduced || !inView) return;
    running.current = true;
    let frame = 0;
    const loop = (now: number) => {
      renderer.current?.(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      running.current = false;
      cancelAnimationFrame(frame);
    };
  }, [inView, reduced]);

  return (
    <div ref={wrapper} className="relative size-full overflow-hidden">
      <canvas ref={canvas} className="block size-full" />
    </div>
  );
}

// skyfall.ai lazy-loads the WebGL scene behind <Suspense>, so the dot fallback shows until that
// chunk resolves; `revealDelay` reproduces how long that takes after mount on each page.
function useDelayedReveal(delay: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return ready;
}

interface HalftoneFieldProps {
  tone?: HalftoneTone;
  fade?: HalftoneFade;
  cell?: number;
  mode?: number;
  revealDelay?: number;
  className?: string;
}

export function HalftoneField({ tone = "light", fade = "none", cell = 9, mode, revealDelay = 335, className = "" }: HalftoneFieldProps) {
  const effectId = useSyncExternalStore(noopSubscribe, readEffect, () => DEFAULT_EFFECT);
  const webgl = useSyncExternalStore(noopSubscribe, supportsWebGL2, () => false);
  const revealed = useDelayedReveal(revealDelay);
  const effect = EFFECTS.find((item) => item.id === effectId) ?? EFFECTS[1];
  const fallbackStyle: CSSProperties = {
    backgroundImage: `radial-gradient(${FALLBACK_COLORS[tone]} 1.6px, transparent 2px)`,
    backgroundSize: `${cell}px ${cell}px`,
    maskImage: FADE_MASK[fade],
    WebkitMaskImage: FADE_MASK[fade],
    opacity: 0.5,
  };
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {webgl && revealed ? (
        <HalftoneCanvas key={effect.id} tone={tone} fade={FADE_UNIFORM[fade]} cell={cell} mode={mode ?? effect.mode} />
      ) : (
        <div className="absolute inset-0" style={fallbackStyle} />
      )}
    </div>
  );
}

interface HeroFieldProps {
  className?: string;
  mask?: string;
  opacity?: number;
  revealDelay?: number;
}

export function HeroField({ className = "h-[240px] md:h-[336px]", mask, opacity, revealDelay }: HeroFieldProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 ${className}`} style={{ maskImage: mask, WebkitMaskImage: mask, opacity }}>
      <HalftoneField tone="light" fade="down" mode={2} revealDelay={revealDelay} className="size-full" />
    </div>
  );
}
