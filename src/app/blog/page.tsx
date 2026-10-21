import type { Metadata } from "next";
import { BlogPage } from "@/components/skyfall/blog/blog-page";
import { blogCopy } from "@/content/skyfall";

export const metadata: Metadata = {
  title: blogCopy.title,
  description: blogCopy.lede,
};

export default function BlogIndexRoute() {
  return <BlogPage />;
}
