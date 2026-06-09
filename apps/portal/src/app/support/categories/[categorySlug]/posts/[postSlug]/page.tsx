import { notFound } from "next/navigation";
import { CalendarDays, Clock3, List } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { extractToc, renderMarkdown } from "@/lib/markdown";
import { getCategoryBySlug, getPostBySlug } from "@/lib/support-api";

type PageProps = {
  params: Promise<{ categorySlug: string; postSlug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const post = await getPostBySlug(category.id, postSlug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const html = renderMarkdown(post.content);

  return (
    <main className="app-shell">
      <Topbar categoryTitle={category.title} categoryHref={`/support/categories/${category.slug}`} postTitle={post.title} />
      <div className="article-layout">
        <article>
          <header className="article-header">
            <span className="article-label">{category.title}</span>
            <h1>{post.title}</h1>
            <p className="article-description">{post.description}</p>
            <div className="metadata">
              <span><Clock3 size={15} /> 読了時間 {post.readTime}</span>
              <span><CalendarDays size={15} /> 更新日 {post.updatedAt}</span>
              {post.tags.map((tag) => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
          </header>
          {post.id === 1 ? (
            <figure className="article-image">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" alt="地図のメイン操作インターフェース" />
              <figcaption>図1: 地図のメイン操作インターフェース</figcaption>
            </figure>
          ) : null}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <aside className="toc">
          <div className="toc-title"><List size={14} /> 目次</div>
          {toc.map((item) => (
            <a key={item.id} href={`#${item.id}`} style={{ paddingLeft: item.level === 3 ? 14 : 0 }}>
              {item.text}
            </a>
          ))}
        </aside>
      </div>
    </main>
  );
}
