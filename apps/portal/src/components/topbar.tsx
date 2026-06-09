import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid2X2, List } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type TopbarProps = {
  categoryTitle?: string;
  categoryHref?: string;
  postTitle?: string;
};

export function Topbar({ categoryTitle, categoryHref = "/support/categories", postTitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 h-[68px] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-[#243447] dark:bg-[#071624]/95">
      <div className="mx-auto flex h-full w-[min(1232px,calc(100vw-48px))] items-center justify-between max-sm:w-[min(100%-28px,1232px)]">
        <nav className="flex items-center gap-2.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]" aria-label="Breadcrumb">
          <ChevronLeft size={16} />
          <Link className="hover:text-slate-950 dark:hover:text-white" href="/support">
            トップ
          </Link>
          {categoryTitle ? (
            <>
              <ChevronRight size={14} />
              <Link className="hover:text-slate-950 dark:hover:text-white" href={categoryHref}>
                {categoryTitle}
              </Link>
            </>
          ) : null}
          {postTitle ? (
            <>
              <ChevronRight size={14} />
              <strong className="text-slate-950 dark:text-white">{postTitle}</strong>
            </>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {!postTitle ? (
            <div className="flex gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 dark:border-[#243447] dark:bg-[#102033]" aria-hidden="true">
              <button className="grid h-7 w-7 place-items-center rounded-md bg-cyan-50 text-cyan-600 dark:bg-[#17314a] dark:text-cyan-300" type="button">
                <Grid2X2 size={16} />
              </button>
              <button className="grid h-7 w-7 place-items-center rounded-md text-slate-500 dark:text-[#9ba8b7]" type="button">
                <List size={16} />
              </button>
            </div>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
