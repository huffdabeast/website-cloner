"use client";

import { useEffect, useState } from "react";
import { blogCopy, routes, site } from "@/content/skyfall";
import { scrambleOnEnter } from "@/lib/skyfall/scramble";
import { Logo } from "@/components/skyfall/ui/logo";
import { SiteLink } from "@/components/skyfall/ui/site-link";

export type PageKey = "home" | "launch" | "blog";

export interface NavTab {
  label: string;
  href: string;
  current?: boolean;
  spy?: { from: string; to?: string } | null;
}

export function navTabs(page: PageKey): NavTab[] {
  const tabs: NavTab[] = [];
  for (const item of site.nav) {
    if (item.href === "#sky-001") tabs.push({ label: item.label, href: routes.sky001, current: page === "launch" });
  }
  tabs.push({ label: blogCopy.nav, href: routes.blog, current: page === "blog" });
  return tabs;
}

export function footerPages() {
  return navTabs("launch").map(({ label, href }) => ({ label, href }));
}

export function SiteNav({ page, home = "/" }: { page: PageKey; home?: string }) {
  const tabs = navTabs(page);
  const [spied, setSpied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const watched = tabs
      .map((tab) => ({ label: tab.label, spy: tab.spy ?? (tab.href.startsWith("#") && tab.href.length > 1 ? { from: tab.href } : null) }))
      .filter((tab): tab is { label: string; spy: { from: string; to?: string } } => !!tab.spy);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let active: string | null = null;
      for (const { label, spy } of watched) {
        const from = document.querySelector(spy.from);
        const to = spy.to ? document.querySelector(spy.to) : from;
        if (from && to && from.getBoundingClientRect().top <= line && to.getBoundingClientRect().bottom > line) active = label;
      }
      setSpied(active);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const isCurrent = (tab: NavTab) => (spied ? tab.label === spied : !!tab.current);

  return (
    <>
      <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 hidden h-14 border-b border-line bg-white px-10 lg:block">
        <div className="mx-auto flex h-full max-w-[1208px] items-stretch justify-between">
          <SiteLink href={home} aria-label="Skyfall AI home" className="flex items-center text-ink">
            <Logo width={132} />
          </SiteLink>
          <ul className="flex font-mono text-sm font-medium tracking-[-0.02em] uppercase">
            {tabs.map((tab, index) => {
              const current = isCurrent(tab);
              return (
                <li key={tab.label} className="flex">
                  <SiteLink
                    href={tab.href}
                    aria-current={current ? "location" : undefined}
                    onPointerEnter={scrambleOnEnter}
                    className={`flex items-center border-r border-line px-[22px] transition-colors duration-300 ease-out-expo ${index === 0 ? "border-l" : ""} ${current ? "border-brand bg-brand font-semibold text-white" : "bg-white text-ink hover:bg-studio"}`}
                  >
                    <span data-scramble="">{current ? `<${tab.label}>` : tab.label}</span>
                  </SiteLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-white pr-3 pl-6 lg:hidden">
        <SiteLink href={home} className="flex min-h-11 items-center text-ink" aria-label="Skyfall AI home">
          <Logo width={140} />
        </SiteLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="relative grid size-11 cursor-pointer place-items-center"
        >
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </header>
      <div
        id="mobile-menu"
        inert={!open}
        data-lenis-prevent=""
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pt-2 pb-8 transition-[clip-path] duration-500 ease-out-expo lg:hidden ${open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}
      >
        <ul>
          {tabs.map((tab, index) => (
            <li key={tab.label} className="border-b border-line">
              <SiteLink
                href={tab.href}
                onClick={() => setOpen(false)}
                className="flex min-h-16 items-center justify-between font-mono text-2xl font-medium tracking-[-0.04em] text-ink uppercase"
              >
                {tab.label}
                <span aria-hidden="true" className="text-sm text-faint">
                  0{index + 1}
                </span>
              </SiteLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
