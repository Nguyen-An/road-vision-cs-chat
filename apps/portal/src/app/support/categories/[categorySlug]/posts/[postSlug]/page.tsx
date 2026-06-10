import { notFound } from "next/navigation";
import { CalendarDays, Clock3, List } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { extractToc, renderMarkdown } from "@/lib/markdown";
import { getCategoryBySlug, getPostBySlug } from "@/lib/api/support-api";

type PageProps = {
  params: Promise<{ categorySlug: string; postSlug: string }>;
};

export const dynamic = "force-dynamic";

const tagClass = "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-[#1b2d3e] dark:text-[#9ba8b7]";
const articleBodyClass =
  "pt-[34px] text-[15px] leading-[1.9] text-slate-700 dark:text-[#d8e2ed] [&_h2]:mb-[18px] [&_h2]:mt-10 [&_h2]:border-l-[3px] [&_h2]:border-cyan-400 [&_h2]:pl-4 [&_h2]:text-[22px] [&_h2]:text-slate-950 dark:[&_h2]:text-[#f4f8ff] [&_h3]:mb-2.5 [&_h3]:mt-[26px] [&_h3]:text-slate-950 dark:[&_h3]:text-[#f4f8ff] [&_li+li]:mt-2 [&_ol]:mb-[18px] [&_p]:mb-[18px] [&_ul]:mb-[18px]";

export default async function PostDetailPage({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const post = await getPostBySlug(category.id, postSlug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const html = renderMarkdown(post.content);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#071624] dark:text-[#f4f8ff]">
      <Topbar categoryTitle={category.title} categoryHref={`/support/categories/${category.slug}`} postTitle={post.title} />
      <div className="mx-auto grid w-[min(1232px,calc(100vw-48px))] grid-cols-[minmax(0,856px)_240px] gap-12 py-14 pb-24 max-[900px]:grid-cols-1 max-sm:w-[min(100%-28px,1232px)]">
        <article>
          <header className="border-b border-slate-200 pb-8 dark:border-[#243447]">
            <span className="inline-flex rounded-full border border-cyan-400/60 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-[#063047] dark:text-[#00d9ff]">{category.title}</span>
            <h1 className="mb-[18px] mt-[18px] text-[32px] font-bold">{post.title}</h1>
            <p className="leading-[1.8] text-slate-600 dark:text-[#9ba8b7]">{post.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3.5 text-[13px] text-slate-500 dark:text-[#9ba8b7]">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} /> 読了時間 {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} /> 更新日 {post.updatedAt}
              </span>
              {post.tags.map((tag) => (
                <span className={tagClass} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>
          {post.id === 1 ? (
            <figure className="mb-[34px] mt-7">
              <img className="h-auto w-full rounded-lg border border-slate-200 dark:border-[#243447]" src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" alt="地図のメイン操作インターフェース" />
              <figcaption className="mt-2.5 text-center text-xs italic text-slate-500 dark:text-[#9ba8b7]">図1: 地図のメイン操作インターフェース</figcaption>
            </figure>
          ) : null}
          <div className={articleBodyClass} dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <aside className="sticky top-[100px] self-start text-[13px] text-slate-500 max-[900px]:static dark:text-[#9ba8b7]">
          <div className="mb-[18px] flex items-center gap-2 text-slate-500 dark:text-[#738398]">
            <List size={14} /> 目次
          </div>
          {toc.map((item) => (
            <a className="block py-2 hover:text-slate-950 dark:hover:text-white" key={item.id} href={`#${item.id}`} style={{ paddingLeft: item.level === 3 ? 14 : 0 }}>
              {item.text}
            </a>
          ))}
        </aside>
      </div>
    </main>
  );
}
