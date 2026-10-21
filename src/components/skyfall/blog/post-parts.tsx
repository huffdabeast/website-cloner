import type { ReactNode } from "react";
import { blogCopy, routes } from "@/content/skyfall";
import type { BlogPost } from "@/content/blog";
import { asset } from "@/lib/skyfall/media";
import { SplitReveal } from "@/components/skyfall/motion/reveal";
import { SiteLink } from "@/components/skyfall/ui/site-link";

export type PostSummary = Omit<BlogPost, "html">;

export const metaRow = "flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase";

export function MetaDot() {
  return <span aria-hidden="true" className="block size-1 bg-faint" />;
}

export function PostMeta({ post, date = true, className = "" }: { post: PostSummary; date?: boolean; className?: string }) {
  return (
    <div className={`${metaRow} ${className}`}>
      {date && (
        <>
          <time dateTime={post.iso} className="text-brand">
            {post.date}
          </time>
          <MetaDot />
        </>
      )}
      <span>{post.author}</span>
      <MetaDot />
      <span>
        {post.minutes} {blogCopy.minRead}
      </span>
    </div>
  );
}

export function PostChips({ chips }: { chips: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Keywords">
      {chips.map((chip) => (
        <li key={chip} className="flex h-[26px] items-center border border-line bg-paper px-2.5 font-mono text-[11px] text-body uppercase">
          {chip}
        </li>
      ))}
    </ul>
  );
}

export function PostThumb({ post, className = "" }: { post: PostSummary; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-studio ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(post.thumb)}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-left transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
    </div>
  );
}

function PostCard({ post }: { post: PostSummary }) {
  return (
    <li className="flex border-r border-b border-line">
      <SiteLink href={routes.post(post.slug)} className="group relative flex w-full flex-col bg-paper outline-offset-[-2px] hover:z-10 focus-visible:z-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-10 border border-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <PostThumb post={post} className="aspect-[16/10] border-b border-line" />
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <div className={metaRow}>
            <span className="text-brand">
              {post.minutes} {blogCopy.minRead}
            </span>
            <MetaDot />
            <span>{post.author}</span>
          </div>
          <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-0.05em] transition-colors duration-300 group-hover:text-brand">{post.title}</h3>
          <p className="line-clamp-2 text-[15px] leading-[1.5] text-body">{post.excerpt}</p>
          <PostChips chips={post.chips} />
          <div className={`${metaRow} mt-auto justify-between border-t border-dashed border-line pt-3.5`}>
            <time dateTime={post.iso}>{post.date}</time>
            <span className="text-ink transition-colors duration-300 group-hover:text-brand">
              {blogCopy.read} <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </SiteLink>
    </li>
  );
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  return (
    <ul className="grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ul>
  );
}

export function GridHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-b border-ink pb-4">
      <SplitReveal as="h2" className="text-[30px] leading-none font-medium tracking-[-0.045em] md:text-[44px]">
        {title}
      </SplitReveal>
      {children}
    </div>
  );
}
