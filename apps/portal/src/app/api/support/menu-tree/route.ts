import { NextResponse } from "next/server";
import { getSupportMenuTreeData } from "@/data/support-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(getSupportMenuTreeData(searchParams.get("q") ?? ""));
}
