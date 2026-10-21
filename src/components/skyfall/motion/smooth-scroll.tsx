"use client";

import Lenis from "lenis";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { gsap, ScrollTrigger } from "@/lib/skyfall/gsap";

let current: Lenis | null = null;
const listeners = new Set<() => void>();

function setLenis(next: Lenis | null) {
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

export function scrollToTarget(lenis: Lenis | null, target: HTMLElement, offset?: number, duration = 1.2) {
  if (!lenis) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const resolvedOffset = offset ?? padding;
  const expectedTop = (parseFloat(getComputedStyle(target).scrollMarginTop) || 0) + padding - resolvedOffset;
  let retries = 3;
  const run = (seconds: number) => {
    lenis.scrollTo(target, {
      offset: resolvedOffset,
      duration: seconds,
      onComplete: () => {
        if (retries-- > 0 && Math.abs(target.getBoundingClientRect().top - expectedTop) > 4) run(0.5);
      },
    });
  };
  run(duration);
}

function HashLinks() {
  const lenis = useLenis();
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (href === "#") {
        event.preventDefault();
        return;
      }
      if (!href) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(href);
      } catch {
        return;
      }
      if (!target) return;
      event.preventDefault();
      scrollToTarget(lenis, target, target.closest(".sky-tb") ? undefined : -72, 1.4);
      try {
        history.replaceState(null, "", href);
      } catch {}
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);
  return null;
}

function ScrollTriggerRefresh() {
  useEffect(() => {
    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return (
    <>
      <HashLinks />
      <ScrollTriggerRefresh />
      {children}
    </>
  );
}
