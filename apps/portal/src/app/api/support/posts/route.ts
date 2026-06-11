import { NextResponse } from "next/server";
import { getSupportPostsData } from "@/data/support-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryIdParam = searchParams.get("categoryId");
  const slug = searchParams.get("slug") ?? undefined;
  const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  return NextResponse.json(
    getSupportPostsData({
      categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
      slug
    })
  );
}
