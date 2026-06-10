"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid2X2, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryPostsSection } from "@/features/manual-management/components/category-posts-section";
import { CategorySidebar } from "@/features/manual-management/components/category-sidebar";
import { containerClass, layoutClass, loadingClass, shellClass } from "@/features/manual-management/components/manual-management-styles";
import { PostDetailPanel } from "@/features/manual-management/components/post-detail-panel";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { renderMarkdown } from "@/lib/markdown";
import { useCategoriesQuery, useMenuTreeQuery, usePostDetailQuery, usePostsByCategoryQuery } from "@/lib/api/support-queries";
import { getCategoryIcon } from "@/lib/api/support-api";

type ManualManagementViewProps = {
  initialCategorySlug: string;
};

type ViewMode = "grid" | "list";
const POSTS_PER_PAGE = 12;

export function ManualManagementView({ initialCategorySlug }: ManualManagementViewProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | undefined>();
  const [expandedCategorySlugs, setExpandedCategorySlugs] = useState<string[]>([initialCategorySlug]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [menuSearch, setMenuSearch] = useState("");
  const [debouncedMenuSearch, setDebouncedMenuSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: menuTree = [] } = useMenuTreeQuery(debouncedMenuSearch);

  const category = categories.find((item) => item.slug === selectedCategorySlug);
  const { data: categoryPosts = [], isLoading: postsLoading, isError: postsError } = usePostsByCategoryQuery(category?.id);
  const { data: selectedPost, isLoading: postDetailLoading, isError: postDetailError } = usePostDetailQuery(category?.id, selectedPostSlug);
  const articleHtml = useMemo(() => (selectedPost ? renderMarkdown(selectedPost.content) : ""), [selectedPost]);
  const pageCount = Math.max(1, Math.ceil(categoryPosts.length / POSTS_PER_PAGE));
  const visiblePosts = categoryPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [selectedCategorySlug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedMenuSearch(menuSearch);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [menuSearch]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (categoriesLoading || !category) {
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
    setPage(1);
  };

  const selectPost = (categorySlug: string, postSlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setSelectedPostSlug(postSlug);
    setExpandedCategorySlugs((current) => (current.includes(categorySlug) ? current : [...current, categorySlug]));
  };

  const viewButtonClass = (mode: ViewMode) =>
    `grid h-7 w-7 place-items-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
      viewMode === mode
        ? "bg-cyan-50 text-cyan-600 dark:bg-[#17314a] dark:text-cyan-300"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-[#9ba8b7] dark:hover:bg-[#1d2a3b] dark:hover:text-white"
    }`;

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
            <div className="flex gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 dark:border-[#243447] dark:bg-[#102033]" role="group" aria-label="表示形式">
              <button className={viewButtonClass("grid")} type="button" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <Grid2X2 size={16} />
              </button>
              <button className={viewButtonClass("list")} type="button" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}>
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
          menuSearch={menuSearch}
          expandedCategorySlugs={expandedCategorySlugs}
          onMenuSearchChange={setMenuSearch}
          onSelectCategory={selectCategory}
          onSelectPost={selectPost}
          onToggleCategory={toggleCategory}
        />

        <section>
          {selectedPostSlug ? (
            <PostDetailPanel articleHtml={articleHtml} category={category} isError={postDetailError} isLoading={postDetailLoading} post={selectedPost} />
          ) : (
            <CategoryPostsSection
              category={category}
              categoryIcon={CategoryIcon}
              isError={postsError}
              isLoading={postsLoading}
              page={page}
              pageCount={pageCount}
              posts={visiblePosts}
              postsCount={categoryPosts.length}
              setPage={setPage}
              viewMode={viewMode}
              onSelectPost={selectPost}
            />
          )}
        </section>
      </div>
    </main>
  );
}
