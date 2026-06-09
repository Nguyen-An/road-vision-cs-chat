"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Grid2X2, List, Plus, SquarePen } from "lucide-react";
import { useMemo, useState } from "react";
import { CategorySidebar } from "@/components/category-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { renderMarkdown } from "@/lib/markdown";
import { useCategoriesQuery, useMenuTreeQuery, usePostDetailQuery, usePostsByCategoryQuery } from "@/lib/support-queries";
import { getCategoryIcon } from "@/lib/support-api";

type ManualManagementViewProps = {
  initialCategorySlug: string;
};

const shellClass = "min-h-screen bg-slate-50 text-slate-950 dark:bg-[#071624] dark:text-[#f4f8ff]";
const containerClass = "mx-auto w-[min(1232px,calc(100vw-48px))] max-sm:w-[min(100%-28px,1232px)]";
const layoutClass = `${containerClass} grid grid-cols-[320px_minmax(0,1fr)] gap-6 py-14 max-[900px]:grid-cols-1`;
const loadingClass = "rounded-lg border border-slate-200 bg-white p-[22px] text-slate-500 shadow-sm dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#9ba8b7]";
const actionButtonClass = "inline-flex h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-600 transition hover:-translate-y-px hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#9ba8b7] dark:hover:bg-[#102a41] dark:hover:text-cyan-300";
const tagClass = "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-[#1b2d3e] dark:text-[#9ba8b7]";
const articleBodyClass =
  "pt-[34px] text-[15px] leading-[1.9] text-slate-700 dark:text-[#d8e2ed] [&_h2]:mb-[18px] [&_h2]:mt-10 [&_h2]:border-l-[3px] [&_h2]:border-cyan-400 [&_h2]:pl-4 [&_h2]:text-[22px] [&_h2]:text-slate-950 dark:[&_h2]:text-[#f4f8ff] [&_h3]:mb-2.5 [&_h3]:mt-[26px] [&_h3]:text-slate-950 dark:[&_h3]:text-[#f4f8ff] [&_li+li]:mt-2 [&_ol]:mb-[18px] [&_p]:mb-[18px] [&_ul]:mb-[18px]";

export function ManualManagementView({ initialCategorySlug }: ManualManagementViewProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | undefined>();
  const [expandedCategorySlugs, setExpandedCategorySlugs] = useState<string[]>([initialCategorySlug]);
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: menuTree = [], isLoading: menuLoading } = useMenuTreeQuery();

  const category = categories.find((item) => item.slug === selectedCategorySlug);
  const { data: categoryPosts = [], isLoading: postsLoading, isError: postsError } = usePostsByCategoryQuery(category?.id);
  const { data: selectedPost, isLoading: postDetailLoading, isError: postDetailError } = usePostDetailQuery(category?.id, selectedPostSlug);
  const loading = categoriesLoading || menuLoading;
  const articleHtml = useMemo(() => (selectedPost ? renderMarkdown(selectedPost.content) : ""), [selectedPost]);

  if (loading || !category) {
    return (
      <main className={shellClass}>
        <div className={layoutClass}>
          <section className={loadingClass}>Loading manual data...</section>
        </div>
      </main>
    );
  }
  const CategoryIcon = getCategoryIcon(category);

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
    <main className={shellClass}>
      <header className="sticky top-0 z-10 h-[68px] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-[#243447] dark:bg-[#071624]/95">
        <div className={`${containerClass} flex h-full items-center justify-between`}>
          <nav className="flex items-center gap-2.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]" aria-label="Breadcrumb">
            <ChevronLeft size={16} />
            <Link className="hover:text-slate-950 dark:hover:text-white" href="/support">
              トップ
            </Link>
            <ChevronRight size={14} />
            <Link className="hover:text-slate-950 dark:hover:text-white" href="/support/categories">
              マニュアル管理
            </Link>
            <ChevronRight size={14} />
            <button className="border-0 bg-transparent p-0 text-inherit hover:text-slate-950 dark:hover:text-white" type="button" onClick={() => selectCategory(category.slug)}>
              {category.title}
            </button>
            {selectedPost ? (
              <>
                <ChevronRight size={14} />
                <strong className="text-slate-950 dark:text-white">{selectedPost.title}</strong>
              </>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 dark:border-[#243447] dark:bg-[#102033]" aria-hidden="true">
              <button className="grid h-7 w-7 place-items-center rounded-md bg-cyan-50 text-cyan-600 dark:bg-[#17314a] dark:text-cyan-300" type="button">
                <Grid2X2 size={16} />
              </button>
              <button className="grid h-7 w-7 place-items-center rounded-md text-slate-500 dark:text-[#9ba8b7]" type="button">
                <List size={16} />
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className={layoutClass}>
        <CategorySidebar
          menuTree={menuTree}
          activeCategorySlug={selectedCategorySlug}
          activePostSlug={selectedPostSlug}
          count={categoryPosts.length}
          expandedCategorySlugs={expandedCategorySlugs}
          onSelectCategory={selectCategory}
          onSelectPost={selectPost}
          onToggleCategory={toggleCategory}
        />

        <section>
          {selectedPostSlug ? (
            postDetailLoading ? (
              <div className={loadingClass}>Loading post detail...</div>
            ) : postDetailError || !selectedPost ? (
              <div className={loadingClass}>Unable to load post detail.</div>
            ) : (
              <article className="w-[min(100%,860px)]">
                <div className="mb-[26px] flex items-start justify-between gap-6 max-sm:grid">
                  <div>
                    <h1 className="m-0 text-2xl leading-tight">{selectedPost.title}</h1>
                    <p className="mt-1.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">{category.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className={actionButtonClass} type="button">
                      <Plus size={17} />
                      <span>追加</span>
                    </button>
                    <button className={actionButtonClass} type="button">
                      <SquarePen size={17} />
                      <span>編集</span>
                    </button>
                  </div>
                </div>
                <header className="border-b border-slate-200 pb-6 dark:border-[#243447]">
                  <p className="leading-[1.8] text-slate-600 dark:text-[#9ba8b7]">{selectedPost.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={15} /> 読了時間 {selectedPost.readTime}
                    </span>
                    {selectedPost.tags.map((tag) => (
                      <span className={tagClass} key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </header>
                <div className={articleBodyClass} dangerouslySetInnerHTML={{ __html: articleHtml }} />
              </article>
            )
          ) : (
            <>
              <div className="mb-[26px] flex items-start justify-between gap-6 max-sm:grid">
                <div>
                  <h1 className="m-0 text-2xl leading-tight">{category.title}</h1>
                  <p className="mt-1.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">{categoryPosts.length} 件の記事</p>
                </div>
                <div className="flex gap-2">
                  <button className={actionButtonClass} type="button">
                    <Plus size={17} />
                    <span>追加</span>
                  </button>
                  <button className={actionButtonClass} type="button">
                    <SquarePen size={17} />
                    <span>編集</span>
                  </button>
                </div>
              </div>
              {postsLoading ? (
                <div className={loadingClass}>Loading posts...</div>
              ) : postsError ? (
                <div className={loadingClass}>Unable to load posts.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
                  {categoryPosts.map((post) => (
                    <button className="flex min-h-52 flex-col justify-between rounded-lg border border-slate-200 bg-white p-0 text-left text-slate-950 shadow-sm transition hover:-translate-y-px hover:border-cyan-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#f4f8ff]" key={post.id} type="button" onClick={() => selectPost(category.slug, post.slug)}>
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CategoryIcon size={22} />
                          <span>{category.title}</span>
                        </div>
                        <h2 className="mb-2.5 mt-3.5 text-base">{post.title}</h2>
                        <p className="m-0 text-[13px] leading-[1.8] text-slate-600 dark:text-[#9ba8b7]">{post.description}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span className={tagClass} key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-[#243447] dark:text-[#9ba8b7]">
                        <Clock3 size={14} /> {post.readTime}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
