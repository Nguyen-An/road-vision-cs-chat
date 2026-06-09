"use client";

import { BookOpen, ChevronDown, FileText, Plus, SquarePen } from "lucide-react";
import type { SupportMenuNode } from "@/lib/support-api";

type CategorySidebarProps = {
  menuTree: SupportMenuNode[];
  activeCategorySlug: string;
  activePostSlug?: string;
  count: number;
  expandedCategorySlugs: string[];
  onToggleCategory: (categorySlug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectPost: (categorySlug: string, postSlug: string) => void;
};

const iconButtonClass =
  "grid h-[38px] w-[38px] place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-px hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-[#102033] dark:text-slate-400 dark:hover:border-cyan-400 dark:hover:bg-[#102a41] dark:hover:text-cyan-300";

const editButtonClass =
  "grid h-[26px] w-[26px] place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 hover:-translate-y-px hover:border-cyan-400 hover:text-cyan-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-[#102033] dark:text-slate-400 dark:hover:bg-[#102a41] dark:hover:text-cyan-300";

function treeRowClass(active: boolean) {
  return `group grid min-h-9 grid-cols-[18px_minmax(0,1fr)_28px] items-center rounded-[7px] border transition ${
    active
      ? "border-cyan-400/70 bg-cyan-50 text-slate-950 dark:bg-[#102a41] dark:text-slate-50"
      : "border-transparent text-slate-600 hover:-translate-y-px hover:border-cyan-400/60 hover:bg-cyan-50 hover:text-slate-950 focus-within:-translate-y-px focus-within:border-cyan-400/60 focus-within:bg-cyan-50 dark:text-slate-400 dark:hover:bg-[#102a41] dark:hover:text-slate-50 dark:focus-within:bg-[#102a41] dark:focus-within:text-slate-50"
  }`;
}

export function CategorySidebar({
  menuTree,
  activeCategorySlug,
  activePostSlug,
  count,
  expandedCategorySlugs,
  onToggleCategory,
  onSelectCategory,
  onSelectPost
}: CategorySidebarProps) {
  return (
    <aside className="flex flex-col gap-[22px]">
      <div className="rounded-lg border border-slate-200 bg-white p-[18px] shadow-sm dark:border-[#243447] dark:bg-gradient-to-b dark:from-[#0f1e2e]/95 dark:to-[#071624]/95">
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <p className="m-0 text-sm font-bold text-slate-600 dark:text-[#8ea0b5]">目次（カテゴリ）</p>
          <div className="flex gap-2">
            <button className={iconButtonClass} type="button" aria-label="新しいカテゴリを追加">
              <Plus size={18} />
            </button>
            <button className={iconButtonClass} type="button" aria-label="選択中の項目を編集">
              <SquarePen size={17} />
            </button>
          </div>
        </div>

        <nav aria-label="目次（カテゴリ）">
          <ul className="grid list-none gap-1 p-0">
            {menuTree.map((category) => {
              if (!category.categorySlug) return null;
              const expanded = expandedCategorySlugs.includes(category.categorySlug);
              const activeCategory = category.categorySlug === activeCategorySlug && !activePostSlug;

              return (
                <li className="min-w-0" key={category.id}>
                  <div className={treeRowClass(activeCategory)}>
                    <button
                      className={`grid h-full w-[18px] place-items-center border-0 bg-transparent p-0 text-current transition ${expanded ? "" : "-rotate-90"}`}
                      type="button"
                      aria-label={`${category.title}を開閉`}
                      aria-expanded={expanded}
                      onClick={() => onToggleCategory(category.categorySlug as string)}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      className="grid w-full min-w-0 grid-cols-[20px_minmax(0,1fr)] items-center gap-2 border-0 bg-transparent py-2 text-left text-current cursor-pointer"
                      type="button"
                      onClick={() => {
                        onSelectCategory(category.categorySlug as string);
                        if (!expanded) onToggleCategory(category.categorySlug as string);
                      }}
                    >
                      <BookOpen className="text-current group-hover:text-cyan-500 group-focus-within:text-cyan-500 dark:group-hover:text-cyan-300 dark:group-focus-within:text-cyan-300" size={17} />
                      <span className="truncate">{category.title}</span>
                    </button>
                    <button className={editButtonClass} type="button" aria-label={`${category.title}を編集`}>
                      <SquarePen size={14} />
                    </button>
                  </div>

                  {expanded ? (
                    <ul className="relative ml-6 mt-1 grid list-none gap-1 p-0 pl-3.5 before:absolute before:bottom-2 before:left-0 before:top-0 before:border-l before:border-dotted before:border-slate-300 dark:before:border-slate-500/30">
                      {category.children?.map((post) => {
                        if (!post.categorySlug || !post.postSlug) return null;
                        const activePost = post.categorySlug === activeCategorySlug && post.postSlug === activePostSlug;
                        return (
                          <li className="min-w-0 text-[13px]" key={post.id}>
                            <div className={treeRowClass(activePost)}>
                              <span className="h-full w-[18px]" aria-hidden="true" />
                              <button className="grid w-full min-w-0 grid-cols-[20px_minmax(0,1fr)] items-center gap-2 border-0 bg-transparent py-2 text-left text-current cursor-pointer" type="button" onClick={() => onSelectPost(post.categorySlug as string, post.postSlug as string)}>
                                <FileText className="text-current group-hover:text-cyan-500 group-focus-within:text-cyan-500 dark:group-hover:text-cyan-300 dark:group-focus-within:text-cyan-300" size={16} />
                                <span className="truncate">{post.title}</span>
                              </button>
                              <button className={editButtonClass} type="button" aria-label={`${post.title}を編集`}>
                                <SquarePen size={14} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <button className="mt-[22px] flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[7px] border border-dashed border-slate-300 bg-transparent text-slate-500 transition hover:-translate-y-px hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-500/40 dark:text-slate-300 dark:hover:bg-[#102a41]/70 dark:hover:text-cyan-300" type="button">
          <Plus size={17} />
          <span>新しいカテゴリを追加</span>
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243447] dark:bg-[#0f1e2e]">
        <span className="block text-xs text-slate-500 dark:text-[#66788c]">記事数</span>
        <strong className="mt-2 block text-[26px]">
          {count}
          <small> 件</small>
        </strong>
      </div>
    </aside>
  );
}
