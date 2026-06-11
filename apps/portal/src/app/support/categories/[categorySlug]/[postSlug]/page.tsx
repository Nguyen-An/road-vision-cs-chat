import { notFound } from "next/navigation";
import { ManualManagementView } from "@/features/manual-management/components/manual-management-view";
import { getCategoryBySlug, getPostBySlug } from "@/lib/api/support-api";

type PageProps = {
  params: Promise<{ categorySlug: string; postSlug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ManualManagementPostPage({ params }: PageProps) {
  const { categorySlug, postSlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const post = await getPostBySlug(category.id, postSlug);
  if (!post) notFound();

  return <ManualManagementView initialCategorySlug={category.slug} initialPostSlug={post.slug} />;
}
