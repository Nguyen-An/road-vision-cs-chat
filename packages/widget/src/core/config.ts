import type { SupportWidgetConfig } from "../types/widget";

export const defaultConfig: Omit<SupportWidgetConfig, "tenantId"> = {
  locale: "ja",
  theme: "dark",
  position: "bottom-right",
  mode: "iframe",
  portalUrl: "https://support.example.com/support",
  primaryColor: "#00d9ff",
  buttonText: "サポート"
};

export function resolveConfig(config?: Partial<SupportWidgetConfig>): SupportWidgetConfig {
  const merged = { ...defaultConfig, ...window.SupportWidgetConfig, ...config };
  if (!merged.tenantId) {
    throw new Error("SupportWidgetConfig.tenantId is required.");
  }
  return merged as SupportWidgetConfig;
}
