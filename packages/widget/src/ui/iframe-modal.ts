import type { SupportWidgetConfig } from "../types/widget";
import { buildPortalUrl } from "../utils/url";

function buildIframeUrl(config: SupportWidgetConfig, sessionId: string) {
  const url = new URL(buildPortalUrl(config, sessionId));
  url.searchParams.set("embed", "1");
  return url.toString();
}

export function createIframeModal(root: ShadowRoot, config: SupportWidgetConfig, sessionId: string, onClose: () => void) {
  const modal = document.createElement("section");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-label", "Customer support");
  modal.innerHTML = `
    <iframe title="Customer support" sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation" src="${buildIframeUrl(config, sessionId)}"></iframe>
  `;
  root.querySelector(".root")?.appendChild(modal);
  return modal;
}
