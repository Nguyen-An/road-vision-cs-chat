import type { SupportWidgetConfig } from "../types/widget";

export function buildPortalUrl(config: SupportWidgetConfig, sessionId: string) {
  const url = new URL(config.portalUrl ?? "https://support.example.com/support", window.location.href);
  url.searchParams.set("tenantId", config.tenantId);
  url.searchParams.set("sessionId", sessionId);
  url.searchParams.set("locale", config.locale ?? "ja");
  url.searchParams.set("sourceUrl", window.location.href);
  url.searchParams.set("referrer", document.referrer);
  url.searchParams.set("timestamp", new Date().toISOString());
  if (config.userId) url.searchParams.set("userId", config.userId);
  return url.toString();
}
