import { isEmbedPost, type BlogPost } from "@/content/blog";
import { getEmbedHtml, postSummaries } from "@/lib/skyfall/blog-data";
import { SiteFooter } from "@/components/skyfall/chrome/site-footer";
import { SiteNav } from "@/components/skyfall/chrome/site-nav";
import { ArticleReader } from "./article";
import { BlogIndex } from "./blog-index";
import { EmbedArticle } from "./embed-article";
import { NewsletterSection } from "./newsletter";

function BlogMain({ post }: { post?: BlogPost }) {
  if (!post) return <BlogIndex posts={postSummaries} />;
  if (isEmbedPost(post)) return <EmbedArticle post={post} posts={postSummaries} embed={post.embed} {...getEmbedHtml(post.slug)} />;
  return <ArticleReader post={post} posts={postSummaries} />;
}

export function BlogPage({ post }: { post?: BlogPost }) {
  return (
    <>
      <SiteNav page="blog" />
      <main>
        <BlogMain post={post} />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
