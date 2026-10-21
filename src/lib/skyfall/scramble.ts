"use client";

import type { PointerEvent } from "react";
import { canHover, prefersReducedMotion } from "@/hooks/use-media-query";
import { gsap } from "./gsap";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

export function scramble(el: HTMLElement | null, { duration = 0.8, delay = 0 } = {}) {
  if (!el || prefersReducedMotion()) return;
  const text = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = text;
  if (gsap.isTweening(el)) return;
  const pinned = el.style.display !== "inline-block";
  if (pinned) {
    el.style.display = "inline-block";
    el.style.width = `${el.getBoundingClientRect().width}px`;
    el.style.whiteSpace = "nowrap";
  }
  return gsap.to(el, {
    duration,
    delay,
    ease: "none",
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: duration * 0.25 },
    onComplete: () => {
      if (!pinned) return;
      el.style.display = "";
      el.style.width = "";
      el.style.whiteSpace = "";
    },
  });
}

export function scrambleOnEnter(event: PointerEvent<HTMLElement>) {
  if (!canHover()) return;
  scramble(event.currentTarget.querySelector<HTMLElement>("[data-scramble]"), { duration: 0.6 });
}
