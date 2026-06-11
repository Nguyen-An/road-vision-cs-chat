import { NextResponse } from "next/server";
import { getManualPdfData } from "@/data/support-data";

export async function GET() {
  return NextResponse.json(getManualPdfData());
}
