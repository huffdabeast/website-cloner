"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { blogCopy, routes } from "@/content/skyfall";
import type { BlogPost } from "@/content/blog";
import { container, gutter, monoLabel } from "@/lib/skyfall/classes";
import { asset } from "@/lib/skyfall/media";
import { scrambleOnEnter } from "@/lib/skyfall/scramble";
import { FadeUp, SplitReveal } from "@/components/skyfall/motion/reveal";
import { scrollToTarget, useLenis } from "@/components/skyfall/motion/smooth-scroll";
import { SiteLink } from "@/components/skyfall/ui/site-link";
import { GridHeader, PostChips, PostGrid, PostMeta, type PostSummary } from "./post-parts";

function useLazyVideos(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const videos = [...(ref.current?.querySelectorAll("video") ?? [])];
    if (!videos.length || typeof IntersectionObserver === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (!entry.isIntersecting) video.pause();
          else if (reduced) video.preload = "metadata";
          else video.play().catch(() => {});
        }
      },
      { rootMargin: "200px 0px" },
    );
    for (const video of videos) observer.observe(video);
    return () => observer.disconnect();
  }, [ref]);
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.25) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [ids]);
  return active;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight))));
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[3px] bg-line/70">
      <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

const noopSubscribe = () => () => {};
const shareButton =
  "flex min-h-11 items-center border border-line bg-paper px-3 font-mono text-[11px] font-medium uppercase transition-colors hover:border-brand hover:text-brand";

function ShareLinks({ post }: { post: PostSummary }) {
  const [copied, setCopied] = useState(false);
  const url = useSyncExternalStore(
    noopSubscribe,
    () => window.location.href,
    () => "",
  );
  return (
    <div>
      <p className={`${monoLabel} mb-2.5`}>{blogCopy.reader.share}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            } catch {}
          }}
          className={`${shareButton} cursor-pointer`}
          aria-live="polite"
        >
          {copied ? blogCopy.reader.copied : blogCopy.reader.copy}
        </button>
        <a className={shareButton} target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
          LinkedIn
        </a>
        <a
          className={shareButton}
          target="_blank"
          rel="noreferrer"
          href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
        >
          X
        </a>
      </div>
    </div>
  );
}

function Breadcrumb({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <SiteLink
        href={routes.blog}
        onPointerEnter={scrambleOnEnter}
        className="group inline-flex h-11 items-center gap-3 border border-ink bg-paper px-4 font-mono text-[13px] font-semibold tracking-[-0.02em] text-ink uppercase transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white md:text-sm"
      >
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        <span data-scramble="">{blogCopy.reader.back}</span>
      </SiteLink>
    </nav>
  );
}

function Prose({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const resolved = useMemo(() => html.replaceAll('src="blog-media/', `src="${asset("blog-media/")}`), [html]);
  useLazyVideos(ref);
  return <div ref={ref} className="blog-prose max-w-[680px]" dangerouslySetInnerHTML={{ __html: resolved }} />;
}

function KeepReading({ posts }: { posts: PostSummary[] }) {
  return (
    <section className={`bg-paper ${gutter} pb-16 md:pb-24`}>
      <div className={container}>
        <GridHeader title={blogCopy.reader.more}>
          <SiteLink
            href={routes.blog}
            className="inline-flex min-h-11 items-center gap-2 border-b border-ink font-mono text-[13px] font-semibold uppercase hover:border-brand hover:text-brand"
          >
            {blogCopy.all.title} <span aria-hidden="true">→</span>
          </SiteLink>
        </GridHeader>
        <PostGrid posts={posts} />
      </div>
    </section>
  );
}

const adjacentLabel = "font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px] text-muted";
const adjacentTitle = "text-xl leading-[1.2] font-medium tracking-[-0.04em] text-balance group-hover:text-brand";

interface ArticleReaderProps {
  post: BlogPost;
  posts: PostSummary[];
  hero?: ReactNode;
  children?: ReactNode;
}

export function ArticleReader({ post, posts, hero, children }: ArticleReaderProps) {
  const lenis = useLenis();
  const tocIds = useMemo(() => post.toc.map((item) => item.id), [post]);
  const active = useScrollSpy(tocIds);
  const [tocOpen, setTocOpen] = useState(false);
  const index = posts.findIndex((item) => item.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const both = !!(newer && older);
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    scrollToTarget(lenis, target);
    setTocOpen(false);
  };

  const toc = (
    <ol className="border-l border-line">
      {post.toc.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => jumpTo(item.id)}
            aria-current={active === item.id ? "location" : undefined}
            className={`-ml-px block min-h-9 w-full cursor-pointer border-l py-1.5 pl-3.5 text-left text-sm leading-[1.35] transition-colors ${active === item.id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {item.title}
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <ReadingProgress />
      <article id="article">
        <header className={`relative bg-paper ${gutter} pt-12 pb-10 md:pt-20 lg:pt-32`}>
          <FadeUp stagger={0.08} className={`relative ${container} flex flex-col gap-5 md:gap-6`}>
            <Breadcrumb className="mb-6 md:mb-14" />
            <PostMeta post={post} />
            <SplitReveal
              as="h1"
              immediate
              delay={0.25}
              className="max-w-[20ch] text-[38px] leading-none font-medium tracking-[-0.045em] text-balance sm:text-[56px] lg:text-[76px] lg:leading-[0.94]"
            >
              {post.title}
            </SplitReveal>
            <PostChips chips={post.chips} />
          </FadeUp>
        </header>
        <div className={gutter}>
          {hero ?? (
            <figure className="mx-auto w-full max-w-[1208px] border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(post.hero)} alt={post.heroAlt} className="block h-auto w-full" />
              {post.caption && <figcaption className="border-t border-line px-4 py-3 font-mono text-xs text-muted uppercase">{post.caption}</figcaption>}
            </figure>
          )}
        </div>
        <div className={`${gutter} pt-10 pb-16 md:pt-14 md:pb-24`}>
          <div className={`${container} grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16`}>
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-8">
                {post.toc.length > 0 && (
                  <nav aria-label={blogCopy.reader.toc}>
                    <p className="mb-3 font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]">{blogCopy.reader.toc}</p>
                    {toc}
                  </nav>
                )}
                <ShareLinks post={post} />
              </div>
            </aside>
            <div className="min-w-0">
              {post.toc.length > 0 && (
                <div className="mb-8 border border-line lg:hidden">
                  <button
                    type="button"
                    aria-expanded={tocOpen}
                    onClick={() => setTocOpen((open) => !open)}
                    className="flex min-h-[52px] w-full cursor-pointer items-center justify-between px-4 font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]"
                  >
                    <span>
                      {blogCopy.reader.toc} · {post.toc.length} {blogCopy.reader.sections}
                    </span>
                    <span aria-hidden="true" className={`text-base transition-transform duration-300 ${tocOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {tocOpen && <div className="border-t border-line px-4 py-3">{toc}</div>}
                </div>
              )}
              {children ?? <Prose html={post.html} />}
              <div className="mt-12 max-w-[680px] lg:hidden">
                <ShareLinks post={post} />
              </div>
              {(newer || older) && (
                <nav aria-label="More articles" className={`mt-12 grid max-w-[680px] border border-line ${both ? "md:grid-cols-2" : ""}`}>
                  {newer && (
                    <SiteLink href={routes.post(newer.slug)} className="group flex flex-col gap-2.5 p-6 hover:bg-tint">
                      <span className={adjacentLabel}>← {blogCopy.reader.newer}</span>
                      <span className={adjacentTitle}>{newer.title}</span>
                    </SiteLink>
                  )}
                  {older && (
                    <SiteLink
                      href={routes.post(older.slug)}
                      className={`group flex flex-col gap-2.5 p-6 hover:bg-tint md:text-right ${both ? "border-t border-line md:border-t-0 md:border-l" : ""}`}
                    >
                      <span className={adjacentLabel}>{blogCopy.reader.older} →</span>
                      <span className={adjacentTitle}>{older.title}</span>
                    </SiteLink>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </article>
      <KeepReading posts={related} />
    </>
  );
}
