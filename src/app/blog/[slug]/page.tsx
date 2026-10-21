import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage } from "@/components/skyfall/blog/blog-page";
import { getPost, posts } from "@/content/blog";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPage post={post} />;
}
