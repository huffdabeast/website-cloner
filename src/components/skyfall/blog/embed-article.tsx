"use client";

import { useEffect, useRef } from "react";
import type { BlogPost } from "@/content/blog";
import { container } from "@/lib/skyfall/classes";
import { ArticleReader } from "./article";
import type { PostSummary } from "./post-parts";

export interface EmbedAssets {
  styles: string[];
  modules: string[];
  scripts: string[];
}

interface EmbedArticleProps {
  post: BlogPost;
  posts: PostSummary[];
  embed: EmbedAssets;
  heroHtml: string;
  articleHtml: string;
}

const injected = new Set<string>();

export function EmbedArticle({ post, posts, embed, heroHtml, articleHtml }: EmbedArticleProps) {
  const base = `/blog-embeds/${post.slug}/`;
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sources = [...embed.modules.map((src) => ({ src, module: true })), ...embed.scripts.map((src) => ({ src, module: false }))];
    for (const { src, module } of sources) {
      if (injected.has(base + src)) continue;
      injected.add(base + src);
      const script = document.createElement("script");
      if (module) script.type = "module";
      else script.async = false;
      script.src = base + src;
      document.head.append(script);
    }
  }, [embed, base]);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented) event.stopPropagation();
    };
    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      {embed.styles.map((href) => (
        <link key={href} rel="stylesheet" href={base + href} precedence="blog-embed" />
      ))}
      <ArticleReader
        post={post}
        posts={posts}
        hero={
          heroHtml ? (
            <div className={container}>
              <div className="sky-tb blog-article" dangerouslySetInnerHTML={{ __html: heroHtml }} />
            </div>
          ) : undefined
        }
      >
        <div ref={body} className="sky-tb blog-article" dangerouslySetInnerHTML={{ __html: articleHtml }} />
      </ArticleReader>
    </>
  );
}
