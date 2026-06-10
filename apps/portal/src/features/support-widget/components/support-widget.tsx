"use client";

import { BookOpen, ChevronLeft, ChevronRight, FileQuestion, Headphones, Map, MapPin, MessageSquare, Video, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCategoryIcon } from "@/lib/api/support-api";
import { useCategoriesQuery } from "@/lib/api/support-queries";

type Screen = "home" | "categories";

type SupportWidgetProps = {
  embedded?: boolean;
};

const CATEGORIES_PER_PAGE = 5;
const OPERATOR_URL = "https://timerex.net/s/vanan6b_576b/096a4aff";

const actionCardClass =
  "grid min-h-16 grid-cols-[42px_minmax(0,1fr)] items-center gap-3.5 rounded-[10px] border border-transparent bg-slate-100 px-[18px] py-3.5 text-left text-slate-950 transition hover:-translate-y-px hover:border-cyan-400/70 hover:bg-cyan-50 hover:shadow-lg hover:shadow-slate-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-[#1d2a3b] dark:text-[#f4f8ff] dark:hover:bg-[#122a40] dark:hover:shadow-black/20 [&_svg]:text-cyan-500 dark:[&_svg]:text-[#00d9ff] [&_strong]:mb-1 [&_strong]:block [&_strong]:text-[15px] [&_small]:line-clamp-2 [&_small]:text-xs [&_small]:leading-[1.45] [&_small]:text-slate-500 dark:[&_small]:text-[#9ba8b7]";

export function SupportWidget({ embedded = false }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [categoryPage, setCategoryPage] = useState(1);
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen, screen]);

  useEffect(() => {
    setCategoryPage((current) => Math.min(current, Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE))));
  }, [categories.length]);

  const categoryPageCount = Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE));
  const visibleCategories = categories.slice((categoryPage - 1) * CATEGORIES_PER_PAGE, categoryPage * CATEGORIES_PER_PAGE);

  const closeWidget = () => {
    if (embedded) {
      window.parent.postMessage({ type: "support_widget_close" }, "*");
    }
    setIsOpen(false);
  };

  const openCategories = () => {
    setCategoryPage(1);
    setScreen("categories");
  };

  return (
    <div className={`${embedded ? "min-h-screen border-b-0 bg-transparent" : "min-h-screen border-b-2 border-lime-200 bg-slate-50 dark:bg-[#071624]"}`}>
      {isOpen ? (
        <section
          className={
            embedded
              ? "min-h-screen w-full overflow-hidden bg-white outline-none dark:bg-[#101b29]"
              : "fixed bottom-24 right-[22px] z-40 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 outline-none max-[520px]:inset-0 max-[520px]:w-auto max-[520px]:rounded-none dark:border-[#2b3b4e] dark:bg-[#101b29] dark:shadow-black/30"
          }
          ref={panelRef}
          tabIndex={-1}
          aria-label="カスタマーサポート"
        >
          <header className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 px-[18px] dark:border-[#243447]">
            {screen === "home" ? (
              <h1 className="m-0 text-[17px] font-bold">カスタマーサポート</h1>
            ) : (
              <button className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent text-sm font-bold text-cyan-600 dark:text-[#00d9ff]" type="button" onClick={() => setScreen("home")}>
                <ChevronLeft size={18} />
                <span>使い方を調べる</span>
              </button>
            )}
            <button className="inline-flex items-center border-0 bg-transparent text-slate-400 transition hover:text-slate-700 dark:text-[#9aa7b6] dark:hover:text-white" type="button" aria-label="閉じる" onClick={closeWidget}>
              <X size={22} />
            </button>
          </header>

          {screen === "home" ? (
            <div className={`grid gap-3 px-4 py-[18px] ${embedded ? "px-4 pb-[18px] pt-[22px]" : ""}`}>
              <p className="mb-2 mt-0 text-sm leading-[1.7] text-slate-600 dark:text-[#d6dee8]">こんにちは。どのようなご用件でしょうか？ 以下のオプションからお選びください。</p>
              <button className={actionCardClass} type="button" onClick={openCategories}>
                <BookOpen size={30} />
                <span>
                  <strong>使い方を調べる</strong>
                  <small>よくある質問やマニュアルを確認する</small>
                </span>
              </button>
              <a className={actionCardClass} href={OPERATOR_URL} target="_blank" rel="noopener noreferrer">
                <Headphones size={32} />
                <span>
                  <strong>担当者につなぐ</strong>
                  <small>オペレーターと直接チャットで相談する</small>
                </span>
              </a>
            </div>
          ) : categoriesLoading ? (
            <div className={`flex items-center justify-center px-4 ${embedded ? "min-h-[calc(100vh-57px)]" : "min-h-[360px]"}`} aria-label="Loading categories" role="status">
              <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-cyan-500/20 border-t-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.45)]" />
            </div>
          ) : (
            <div className={`grid gap-3 px-4 pb-[18px] pt-5 ${embedded ? "px-4 pb-[18px] pt-[22px]" : ""}`}>
              {visibleCategories.map((category) => {
                const Fallback = category.slug === "map-guide" ? Map : category.slug === "monitoring-point-guide" ? MapPin : category.slug === "video-guide" ? Video : category.slug === "faq" ? MessageSquare : FileQuestion;
                const CardIcon = getCategoryIcon(category) ?? Fallback;
                const href = `/support/categories/${category.slug}`;
                return (
                  <Link className={actionCardClass} key={category.id} href={href} target="_blank" rel="noopener noreferrer">
                    <CardIcon size={32} />
                    <span>
                      <strong>{category.title}</strong>
                      <small>{category.description}</small>
                    </span>
                  </Link>
                );
              })}

              {categoryPageCount > 1 ? (
                <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-[#9ba8b7]">
                  <button
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 transition hover:border-cyan-400 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#243447] dark:bg-[#0f1e2e] dark:hover:text-cyan-300"
                    type="button"
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft size={14} />
                    <span>前へ</span>
                  </button>
                  <span>
                    {categoryPage} / {categoryPageCount}
                  </span>
                  <button
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 transition hover:border-cyan-400 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#243447] dark:bg-[#0f1e2e] dark:hover:text-cyan-300"
                    type="button"
                    disabled={categoryPage === categoryPageCount}
                    onClick={() => setCategoryPage((current) => Math.min(categoryPageCount, current + 1))}
                  >
                    <span>次へ</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>
      ) : null}

      {!embedded ? (
        <button className="fixed bottom-6 right-[22px] z-40 grid h-[58px] w-[58px] place-items-center rounded-full border-0 bg-gradient-to-br from-[#12d3fb] to-[#0b72f0] text-white shadow-xl shadow-sky-500/40 transition hover:-translate-y-px max-[520px]:bottom-[18px] max-[520px]:right-[18px]" type="button" aria-label={isOpen ? "閉じる" : "開く"} onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      ) : null}
    </div>
  );
}
