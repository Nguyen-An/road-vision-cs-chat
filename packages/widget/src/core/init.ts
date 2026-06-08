import { resolveConfig } from "./config";
import { getSessionId } from "./session";
import { trackEvent } from "../services/tracking";
import type { SupportWidgetConfig } from "../types/widget";
import { createBubble } from "../ui/bubble";
import { createIframeModal } from "../ui/iframe-modal";
import { styles } from "../ui/styles";
import { buildPortalUrl } from "../utils/url";

let host: HTMLDivElement | null = null;
let modal: HTMLElement | null = null;
let activeConfig: SupportWidgetConfig | null = null;
let activeSessionId = "";
let messageListenerAttached = false;

function attachMessageListener() {
  if (messageListenerAttached) return;
  window.addEventListener("message", (event) => {
    if (event.data?.type === "support_widget_close") {
      close();
    }
  });
  messageListenerAttached = true;
}

export function init(config?: Partial<SupportWidgetConfig>) {
  try {
    destroy();
    activeConfig = resolveConfig(config);
    activeSessionId = getSessionId();

    host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styles(activeConfig.primaryColor ?? "#00d9ff", activeConfig.position ?? "bottom-right");
    const container = document.createElement("div");
    container.className = "root";
    const bubble = createBubble(activeConfig, open);
    container.appendChild(bubble);
    root.append(style, container);
    document.body.appendChild(host);
    attachMessageListener();

    trackEvent("widget_loaded", { tenantId: activeConfig.tenantId, sessionId: activeSessionId });
  } catch (error) {
    trackEvent("widget_error", { message: error instanceof Error ? error.message : "Unknown error" });
  }
}

export function open() {
  if (!activeConfig || !host) return;
  trackEvent("widget_opened", { tenantId: activeConfig.tenantId });
  trackEvent("chat_started", { tenantId: activeConfig.tenantId });

  if (activeConfig.mode === "redirect") {
    trackEvent("portal_redirected");
    window.open(buildPortalUrl(activeConfig, activeSessionId), "_blank", "noopener,noreferrer");
    return;
  }

  if (modal) return;
  modal = createIframeModal(host.shadowRoot as ShadowRoot, activeConfig, activeSessionId, close);
  trackEvent("iframe_opened");
}

export function close() {
  modal?.remove();
  modal = null;
  trackEvent("widget_closed");
}

export function destroy() {
  modal = null;
  host?.remove();
  host = null;
}
