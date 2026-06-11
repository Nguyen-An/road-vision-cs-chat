import { NextResponse } from "next/server";
import { getManualOutlineData } from "@/data/support-data";

export async function GET() {
  return NextResponse.json(getManualOutlineData());
}
