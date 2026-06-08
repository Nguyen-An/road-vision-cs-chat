import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { categoryList } from "@/lib/data-cs";

export default function CategoriesPage() {
  return (
    <main className="category-list-page">
      <Link className="widget-back" href="/support">
        <ChevronLeft size={18} />
        <span>使い方を調べる</span>
      </Link>
      <div className="category-page-card">
        {categoryList.slice(0, 5).map((category) => {
          const Icon = category.icon;
          return (
            <Link className="widget-action-card" key={category.id} href={`/support/categories/${category.slug}`}>
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
