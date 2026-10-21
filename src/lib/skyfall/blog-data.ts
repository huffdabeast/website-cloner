import { posts } from "@/content/blog";
import * as introducingSky001 from "@/content/embeds/introducing-sky-001";
import type { PostSummary } from "@/components/skyfall/blog/post-parts";

export const postSummaries: PostSummary[] = posts.map((post) => ({ ...post, html: "" }));

const embedHtml: Record<string, { heroHtml: string; articleHtml: string }> = {
  "introducing-sky-001": introducingSky001,
};

export const getEmbedHtml = (slug: string) => embedHtml[slug] ?? { heroHtml: "", articleHtml: "" };
