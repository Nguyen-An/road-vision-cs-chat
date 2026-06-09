import { notFound } from "next/navigation";
import { ManualManagementView } from "@/components/manual-management-view";
import { getCategoryBySlug } from "@/lib/data-cs";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function ManualManagementPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return <ManualManagementView initialCategorySlug={category.slug} />;
}
