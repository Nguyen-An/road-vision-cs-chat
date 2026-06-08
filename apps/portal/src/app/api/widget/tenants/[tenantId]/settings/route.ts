import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ tenantId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { tenantId } = await params;

  return NextResponse.json({
    tenantId,
    theme: "dark",
    primaryColor: "#00d9ff",
    locale: "ja",
    portalUrl: "/support",
    allowedDomains: ["localhost", "127.0.0.1"],
    routingTeam: "customer-success"
  });
}
