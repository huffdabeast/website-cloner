"use client";

import { blogCopy, routes } from "@/content/skyfall";
import { container, gutter, monoLabel } from "@/lib/skyfall/classes";
import { scrambleOnEnter } from "@/lib/skyfall/scramble";
import { FadeUp, SplitReveal } from "@/components/skyfall/motion/reveal";
import { Frame } from "@/components/skyfall/ui/layout";
import { SiteLink } from "@/components/skyfall/ui/site-link";
import { GridHeader, PostChips, PostGrid, PostMeta, PostThumb, type PostSummary } from "./post-parts";

export function BlogIndex({ posts }: { posts: PostSummary[] }) {
  const [featured, ...rest] = posts;
  const latest = posts.every((post) => post.iso <= featured.iso);
  return (
    <>
      <section className={`relative bg-paper ${gutter} pt-10 pb-10 md:pt-16`}>
        <div className={`relative ${container}`}>
          <Frame>
            <FadeUp stagger={0.1} className="flex flex-col gap-5 px-1">
              <span className={`${monoLabel} text-brand`}>/ {blogCopy.label}</span>
              <SplitReveal
                as="h1"
                immediate
                delay={0.25}
                className="text-[46px] leading-[0.92] font-medium tracking-[-0.045em] sm:text-[84px] lg:text-[120px] lg:leading-[0.86]"
              >
                {blogCopy.title}
              </SplitReveal>
              <p className="max-w-[44ch] text-lg leading-[1.4] text-body md:text-xl">{blogCopy.lede}</p>
            </FadeUp>
          </Frame>
        </div>
      </section>
      <section className={`bg-paper ${gutter} pb-16 md:pb-24`}>
        <FadeUp className={container}>
          <p className={`${monoLabel} mb-3.5 flex items-center gap-2.5`}>
            <span aria-hidden="true" className="block size-2 bg-brand" />
            {latest ? blogCopy.featured : blogCopy.featured.split(" · ")[0]}
          </p>
          <SiteLink
            href={routes.post(featured.slug)}
            className="group grid border border-line bg-paper transition-colors duration-300 hover:border-brand lg:grid-cols-[7fr_5fr]"
          >
            <PostThumb post={featured} className="aspect-[16/10] border-b border-line lg:aspect-auto lg:min-h-[440px] lg:border-r lg:border-b-0" />
            <div className="flex flex-col gap-5 p-6 md:p-10">
              <PostMeta post={featured} />
              <SplitReveal
                as="h2"
                className="text-[30px] leading-[1.05] font-medium tracking-[-0.045em] transition-colors duration-300 group-hover:text-brand md:text-[42px]"
              >
                {featured.title}
              </SplitReveal>
              <p className="line-clamp-4 text-base leading-[1.5] text-body">{featured.excerpt}</p>
              <PostChips chips={featured.chips} />
              <span
                onPointerEnter={scrambleOnEnter}
                className="mt-auto inline-flex min-h-11 w-fit items-center gap-2.5 border-b border-ink font-mono text-sm font-semibold uppercase transition-colors group-hover:border-brand group-hover:text-brand"
              >
                <span data-scramble="">{blogCopy.readMore}</span> <span aria-hidden="true">→</span>
              </span>
            </div>
          </SiteLink>
        </FadeUp>
      </section>
      <section className={`bg-paper ${gutter} pb-16 md:pb-24`}>
        <div className={container}>
          <GridHeader title={blogCopy.all.title}>
            <span className={`${monoLabel} text-muted`}>
              {String(rest.length).padStart(2, "0")} / {blogCopy.all.note}
            </span>
          </GridHeader>
          <PostGrid posts={rest} />
        </div>
      </section>
    </>
  );
}
