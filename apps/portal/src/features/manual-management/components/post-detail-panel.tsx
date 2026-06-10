import { Clock3, Plus, SquarePen } from "lucide-react";
import type { Category, Post } from "@/lib/api/support-api";
import { actionButtonClass, articleBodyClass, loadingClass, tagClass } from "@/features/manual-management/components/manual-management-styles";

type PostDetailPanelProps = {
  articleHtml: string;
  category: Category;
  isError: boolean;
  isLoading: boolean;
  post?: Post;
};

export function PostDetailPanel({ articleHtml, category, isError, isLoading, post }: PostDetailPanelProps) {
  if (isLoading) return <div className={loadingClass}>Loading post detail...</div>;
  if (isError || !post) return <div className={loadingClass}>Unable to load post detail.</div>;

  return (
    <article className="w-[min(100%,860px)]">
      <div className="mb-[26px] flex items-start justify-between gap-6 max-sm:grid">
        <div>
          <h1 className="m-0 text-2xl leading-tight">{post.title}</h1>
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
        <p className="leading-[1.8] text-slate-600 dark:text-[#9ba8b7]">{post.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={15} /> 読了時間 {post.readTime}
          </span>
          {post.tags.map((tag) => (
            <span className={tagClass} key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className={articleBodyClass} dangerouslySetInnerHTML={{ __html: articleHtml }} />
    </article>
  );
}
