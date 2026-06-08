import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { tenantId?: string; sessionId?: string };
  const token = `ctx_${Buffer.from(`${body.tenantId ?? "tenant"}:${body.sessionId ?? "session"}:${Date.now()}`).toString("base64url")}`;

  return NextResponse.json({
    token,
    expiresIn: 300
  });
}
