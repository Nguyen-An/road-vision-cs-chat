import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategories, getCategoryIcon } from "@/lib/support-api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="category-list-page">
      <Link className="widget-back" href="/support">
        <ChevronLeft size={18} />
        <span>使い方を調べる</span>
      </Link>
      <div className="category-page-card">
        {categories.slice(0, 5).map((category) => {
          const Icon = getCategoryIcon(category);
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
