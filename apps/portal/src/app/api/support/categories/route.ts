import { NextResponse } from "next/server";
import { getSupportCategoriesData } from "@/data/support-data";

export async function GET() {
  return NextResponse.json(getSupportCategoriesData());
}
