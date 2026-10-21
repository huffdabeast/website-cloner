"use client";

import type { ReactNode } from "react";
import { scrambleOnEnter } from "@/lib/skyfall/scramble";
import { SiteLink } from "./site-link";

interface ButtonProps {
  href: string;
  children?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

export function PrimaryButton({ href, children, tone = "dark", className = "" }: ButtonProps) {
  const dark = tone === "dark";
  return (
    <SiteLink
      href={href}
      onPointerEnter={scrambleOnEnter}
      className={`group relative inline-flex h-[52px] min-w-[220px] items-center justify-between gap-8 overflow-hidden px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase transition-[color,scale] duration-300 active:scale-[0.98] ${dark ? "bg-ink text-white" : "bg-white text-ink hover:text-white focus-visible:outline-white"} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-active:translate-x-0"
      />
      <span
        aria-hidden="true"
        className={`relative block size-2 transition-[rotate,background-color] duration-300 group-hover:-rotate-180 ${dark ? "bg-white" : "bg-ink group-hover:bg-white"}`}
      />
      <span className="relative" data-scramble="">
        {children}
      </span>
    </SiteLink>
  );
}

export function LineButton({ href, children, tone = "light", className = "" }: ButtonProps) {
  return (
    <SiteLink
      href={href}
      onPointerEnter={scrambleOnEnter}
      className={`group inline-flex h-[52px] items-center justify-between gap-8 border-b px-1 font-mono text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase transition-colors duration-300 ${tone === "dark" ? "border-white text-white hover:border-brand-lift hover:text-brand-lift focus-visible:outline-white" : "border-ink text-ink hover:border-brand hover:text-brand"} ${className}`}
    >
      <span data-scramble="">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </SiteLink>
  );
}
