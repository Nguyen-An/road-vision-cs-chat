"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Grid2X2, List, Plus, SquarePen } from "lucide-react";
import { useMemo, useState } from "react";
import { CategorySidebar } from "@/components/category-sidebar";
import { getCategoryBySlug, getPostBySlug, getPostsByCategory } from "@/lib/data-cs";
import { renderMarkdown } from "@/lib/markdown";

type ManualManagementViewProps = {
  initialCategorySlug: string;
};

export function ManualManagementView({ initialCategorySlug }: ManualManagementViewProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | undefined>();
  const [expandedCategorySlugs, setExpandedCategorySlugs] = useState<string[]>([initialCategorySlug]);

  const category = getCategoryBySlug(selectedCategorySlug);
  const posts = category ? getPostsByCategory(category.id) : [];
  const selectedPost = category && selectedPostSlug ? getPostBySlug(category.id, selectedPostSlug) : undefined;
  const articleHtml = useMemo(() => (selectedPost ? renderMarkdown(selectedPost.content) : ""), [selectedPost]);

  if (!category) return null;
  const CategoryIcon = category.icon;

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategorySlugs((current) => (current.includes(categorySlug) ? current.filter((slug) => slug !== categorySlug) : [...current, categorySlug]));
  };

  const selectCategory = (categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setSelectedPostSlug(undefined);
  };

  const selectPost = (categorySlug: string, postSlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setSelectedPostSlug(postSlug);
    setExpandedCategorySlugs((current) => (current.includes(categorySlug) ? current : [...current, categorySlug]));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ChevronLeft size={16} />
            <Link href="/support">トップ</Link>
            <ChevronRight size={14} />
            <Link href="/support/categories">マニュアル管理</Link>
            <ChevronRight size={14} />
            <button type="button" onClick={() => selectCategory(category.slug)}>
              {category.title}
            </button>
            {selectedPost ? (
              <>
                <ChevronRight size={14} />
                <strong>{selectedPost.title}</strong>
              </>
            ) : null}
          </nav>
          <div className="view-toggle" aria-hidden="true">
            <button className="active" type="button">
              <Grid2X2 size={16} />
            </button>
            <button type="button">
              <List size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="support-layout">
        <CategorySidebar
          activeCategorySlug={selectedCategorySlug}
          activePostSlug={selectedPostSlug}
          count={posts.length}
          expandedCategorySlugs={expandedCategorySlugs}
          onSelectCategory={selectCategory}
          onSelectPost={selectPost}
          onToggleCategory={toggleCategory}
        />

        <section>
          {selectedPost ? (
            <article className="inline-post-detail">
              <div className="content-head">
                <div>
                  <h1>{selectedPost.title}</h1>
                  <p>{category.title}</p>
                </div>
                <div className="content-actions">
                  <button type="button">
                    <Plus size={17} />
                    <span>追加</span>
                  </button>
                  <button type="button">
                    <SquarePen size={17} />
                    <span>編集</span>
                  </button>
                </div>
              </div>
              <header className="article-header compact">
                <p className="article-description">{selectedPost.description}</p>
                <div className="metadata">
                  <span>
                    <Clock3 size={15} /> 読了時間 {selectedPost.readTime}
                  </span>
                  {selectedPost.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </header>
              <div className="article-body" dangerouslySetInnerHTML={{ __html: articleHtml }} />
            </article>
          ) : (
            <>
              <div className="content-head">
                <div>
                  <h1>{category.title}</h1>
                  <p>{posts.length} 件の記事</p>
                </div>
                <div className="content-actions">
                  <button type="button">
                    <Plus size={17} />
                    <span>追加</span>
                  </button>
                  <button type="button">
                    <SquarePen size={17} />
                    <span>編集</span>
                  </button>
                </div>
              </div>
              <div className="post-grid">
                {posts.map((post) => (
                  <button className="post-card" key={post.id} type="button" onClick={() => selectPost(category.slug, post.slug)}>
                    <div className="post-card-body">
                      <div className="post-kicker">
                        <CategoryIcon size={22} />
                        <span>{category.title}</span>
                      </div>
                      <h2>{post.title}</h2>
                      <p>{post.description}</p>
                      <div className="tags">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="post-card-foot">
                      <Clock3 size={14} /> {post.readTime}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
