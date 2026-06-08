export type SupportWidgetConfig = {
  tenantId: string;
  userId?: string;
  locale?: "vi" | "en" | "ja";
  theme?: "light" | "dark";
  position?: "bottom-right" | "bottom-left";
  mode?: "redirect" | "iframe";
  portalUrl?: string;
  primaryColor?: string;
  buttonText?: string;
  iconUrl?: string;
};

export type WidgetEvent =
  | "widget_loaded"
  | "widget_opened"
  | "widget_closed"
  | "chat_started"
  | "portal_redirected"
  | "iframe_opened"
  | "widget_error";

export type TenantWidgetSettings = {
  tenantId: string;
  theme: "light" | "dark";
  primaryColor: string;
  logoUrl?: string;
  iconUrl?: string;
  locale: "vi" | "en" | "ja";
  portalUrl: string;
  allowedDomains: string[];
  routingTeam?: string;
};

declare global {
  interface Window {
    SupportWidgetConfig?: SupportWidgetConfig;
    SupportWidget?: {
      init: (config?: Partial<SupportWidgetConfig>) => void;
      open: () => void;
      close: () => void;
      destroy: () => void;
    };
  }
}
