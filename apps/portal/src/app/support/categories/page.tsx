import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategories, getCategoryIcon } from "@/lib/support-api";

export const dynamic = "force-dynamic";

const actionCardClass =
  "grid min-h-16 grid-cols-[42px_minmax(0,1fr)] items-center gap-3.5 rounded-[10px] border border-transparent bg-slate-100 px-[18px] py-3.5 text-left text-slate-950 transition hover:-translate-y-px hover:border-cyan-400/70 hover:bg-cyan-50 hover:shadow-lg hover:shadow-slate-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-[#1d2a3b] dark:text-[#f4f8ff] dark:hover:bg-[#122a40] dark:hover:shadow-black/20 [&_svg]:text-cyan-500 dark:[&_svg]:text-[#00d9ff] [&_strong]:mb-1 [&_strong]:block [&_strong]:text-[15px] [&_small]:line-clamp-2 [&_small]:text-xs [&_small]:leading-[1.45] [&_small]:text-slate-500 dark:[&_small]:text-[#9ba8b7]";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-[min(560px,calc(100vw-32px))] py-[72px]">
      <Link className="inline-flex items-center gap-1 border-0 bg-transparent text-sm font-bold text-cyan-600 dark:text-[#00d9ff]" href="/support">
        <ChevronLeft size={18} />
        <span>使い方を調べる</span>
      </Link>
      <div className="mt-[22px] grid gap-3">
        {categories.slice(0, 5).map((category) => {
          const Icon = getCategoryIcon(category);
          return (
            <Link className={actionCardClass} key={category.id} href={`/support/categories/${category.slug}`}>
              <Icon size={32} />
              <span>
                <strong>{category.title}</strong>
                <small>{category.description}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
