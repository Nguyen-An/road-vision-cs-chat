import Link from "next/link";
import { Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { CategorySidebar } from "@/components/category-sidebar";
import { DebouncedSearch } from "@/components/debounced-search";
import { Topbar } from "@/components/topbar";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/data-cs";

const PAGE_SIZE = 12;

type PageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function PostListPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const { q = "", page = "1" } = await searchParams;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const Icon = category.icon;
  const keyword = q.trim().toLowerCase();
  const posts = getPostsByCategory(category.id).filter((post) => {
    if (!keyword) return true;
    return [post.title, post.description, ...post.tags].join(" ").toLowerCase().includes(keyword);
  });
  const pageNumber = Math.max(1, Number(page) || 1);
  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pagePosts = posts.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);

  return (
    <main className="app-shell">
      <Topbar categoryTitle={category.title} categoryHref={`/support/categories/${category.slug}`} />
      <div className="support-layout">
        <CategorySidebar activeSlug={category.slug} count={posts.length} />
        <section>
          <div className="content-head">
            <div>
              <h1>{category.title}</h1>
              <p>{posts.length} 件の記事</p>
            </div>
            <DebouncedSearch defaultValue={q} />
          </div>
          <div className="post-grid">
            {pagePosts.map((post) => (
              <Link className="post-card" key={post.id} href={`/support/categories/${category.slug}/posts/${post.slug}`}>
                <div className="post-card-body">
                  <div className="post-kicker">
                    <Icon size={22} />
                    <span>{category.title}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <div className="tags">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="post-card-foot">
                  <Clock3 size={14} /> {post.readTime}
                </div>
              </Link>
            ))}
          </div>
          {pageCount > 1 ? (
            <nav className="pagination" aria-label="Pagination">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
                <Link className={item === pageNumber ? "active" : ""} href={`/support/categories/${category.slug}?q=${encodeURIComponent(q)}&page=${item}`} key={item}>
                  {item}
                </Link>
              ))}
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
