import { notFound } from "next/navigation";
import { ManualManagementView } from "@/components/manual-management-view";
import { getCategoryBySlug } from "@/lib/support-api";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ManualManagementPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return <ManualManagementView initialCategorySlug={category.slug} />;
}
