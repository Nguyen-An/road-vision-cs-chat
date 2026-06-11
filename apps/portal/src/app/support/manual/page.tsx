import { ManualViewer } from "@/features/manual/components/manual-viewer";
import { getManualOutline, getManualPdf, type OutlineItem } from "@/lib/api/support-api";

type ManualPageProps = {
  searchParams: Promise<{
    outline?: string;
    page?: string;
  }>;
};

export const dynamic = "force-dynamic";

function findOutlineItem(items: OutlineItem[], id: string): OutlineItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    const child = item.children ? findOutlineItem(item.children, id) : undefined;
    if (child) return child;
  }
  return undefined;
}

function parsePageParam(page?: string) {
  const pageNumber = Number(page);
  return Number.isFinite(pageNumber) && pageNumber > 0 ? Math.trunc(pageNumber) : undefined;
}

export default async function ManualPage({ searchParams }: ManualPageProps) {
  const [{ outline: outlineId, page }, outline, pdf] = await Promise.all([searchParams, getManualOutline(), getManualPdf()]);
  const selectedOutline = outlineId ? findOutlineItem(outline, outlineId) : undefined;
  const initialPage = parsePageParam(page) ?? selectedOutline?.page ?? 1;

  return (
    <main className="h-screen min-h-screen bg-slate-50 text-slate-950 dark:bg-[#071624] dark:text-[#f4f8ff]">
      <ManualViewer
        pdf={pdf}
        outline={outline}
        initialOutlineId={selectedOutline?.id}
        initialPage={initialPage}
        title="RoadVision Manual"
        description={selectedOutline?.title ?? "User manual document"}
        outlineTitle="PDF Manual"
      />
    </main>
  );
}
