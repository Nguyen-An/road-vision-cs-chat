import type { TenantWidgetSettings } from "../types/widget";

export async function fetchTenantSettings(tenantId: string, apiBaseUrl = ""): Promise<TenantWidgetSettings | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/widget/tenants/${encodeURIComponent(tenantId)}/settings`, {
      credentials: "omit",
      mode: "cors"
    });
    if (!response.ok) return null;
    return (await response.json()) as TenantWidgetSettings;
  } catch {
    return null;
  }
}

export function isCurrentDomainAllowed(settings: TenantWidgetSettings) {
  const hostname = window.location.hostname;
  return settings.allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}
