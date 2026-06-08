import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryList } from "@/lib/data-cs";

type CategorySidebarProps = {
  activeSlug: string;
  count: number;
};

export function CategorySidebar({ activeSlug, count }: CategorySidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-label">カテゴリ</p>
        <nav className="category-nav" aria-label="カテゴリ">
          {categoryList.slice(0, 5).map((category) => {
            const Icon = category.icon;
            const active = category.slug === activeSlug;
            return (
              <Link className={`category-link ${active ? "active" : ""}`} href={`/support/categories/${category.slug}`} key={category.id}>
                <Icon size={18} />
                <span>{category.title}</span>
                {!active ? <ArrowRight size={14} /> : <span />}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="count-box">
        <span>記事数</span>
        <strong>{count}<small> 件</small></strong>
      </div>
    </aside>
  );
}
