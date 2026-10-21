"use client";

import { useMemo, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeTo = (query: string) => (onChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

const matches = (query: string) => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches;

export function prefersReducedMotion() {
  return matches(REDUCED_MOTION);
}

export function canHover() {
  return matches("(hover: hover)");
}

export function useMediaQuery(query: string) {
  const subscribe = useMemo(() => subscribeTo(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => matches(query),
    () => false,
  );
}

export function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION);
}
