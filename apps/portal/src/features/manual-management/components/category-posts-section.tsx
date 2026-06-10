import { ChevronLeft, ChevronRight, Clock3, Plus, SquarePen, type LucideIcon } from "lucide-react";
import type { Category, Post } from "@/lib/api/support-api";
import { actionButtonClass, loadingClass, tagClass } from "@/features/manual-management/components/manual-management-styles";

type ViewMode = "grid" | "list";

type CategoryPostsSectionProps = {
  category: Category;
  categoryIcon: LucideIcon;
  isError: boolean;
  isLoading: boolean;
  page: number;
  pageCount: number;
  posts: Post[];
  postsCount: number;
  setPage: (updater: number | ((current: number) => number)) => void;
  viewMode: ViewMode;
  onSelectPost: (categorySlug: string, postSlug: string) => void;
};

export function CategoryPostsSection({
  category,
  categoryIcon: CategoryIcon,
  isError,
  isLoading,
  page,
  pageCount,
  posts,
  postsCount,
  setPage,
  viewMode,
  onSelectPost
}: CategoryPostsSectionProps) {
  return (
    <>
      <div className="mb-[26px] flex items-start justify-between gap-6 max-sm:grid">
        <div>
          <h1 className="m-0 text-2xl leading-tight">{category.title}</h1>
          <p className="mt-1.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">{postsCount} 件の記事</p>
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

      {isLoading ? (
        <div className={loadingClass}>Loading posts...</div>
      ) : isError ? (
        <div className={loadingClass}>Unable to load posts.</div>
      ) : viewMode === "list" ? (
        <div className="grid gap-2.5">
          {posts.map((post) => (
            <button
              className="grid min-h-[68px] grid-cols-[28px_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-3 text-left text-slate-950 shadow-sm transition hover:-translate-y-px hover:border-cyan-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#f4f8ff]"
              key={post.id}
              type="button"
              onClick={() => onSelectPost(category.slug, post.slug)}
            >
              <CategoryIcon className="text-cyan-600 dark:text-cyan-300" size={20} />
              <span className="min-w-0">
                <strong className="block truncate text-[15px]">{post.title}</strong>
                <small className="mt-1 block truncate text-[13px] text-slate-600 dark:text-[#9ba8b7]">{post.description}</small>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#9ba8b7]">
                <Clock3 size={14} /> {post.readTime}
              </span>
              <ChevronRight className="text-slate-400 dark:text-[#738398]" size={16} />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
          {posts.map((post) => (
            <button className="flex min-h-52 flex-col justify-between rounded-lg border border-slate-200 bg-white p-0 text-left text-slate-950 shadow-sm transition hover:-translate-y-px hover:border-cyan-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#f4f8ff]" key={post.id} type="button" onClick={() => onSelectPost(category.slug, post.slug)}>
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

      {pageCount > 1 ? (
        <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            className="grid h-9 min-w-9 place-items-center rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
            <button
              className={`grid h-9 min-w-9 place-items-center rounded-lg border px-3 text-sm transition ${
                item === page
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-slate-200 bg-white text-slate-500 hover:border-cyan-400 hover:text-cyan-600 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
              }`}
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
          <button
            className="grid h-9 min-w-9 place-items-center rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#243447] dark:bg-[#0f1e2e] dark:text-[#9ba8b7] dark:hover:text-cyan-300"
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      ) : null}
    </>
  );
}
