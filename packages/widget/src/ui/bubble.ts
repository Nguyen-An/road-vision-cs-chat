import type { SupportWidgetConfig } from "../types/widget";

const closeIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const chatIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;

export function getBubbleIcon(config: SupportWidgetConfig, isOpen: boolean) {
  if (isOpen) return closeIcon;
  return config.iconUrl ? `<img src="${config.iconUrl}" alt="" width="28" height="28" />` : chatIcon;
}

export function createBubble(config: SupportWidgetConfig, onClick: () => void) {
  const button = document.createElement("button");
  button.className = "bubble";
  button.type = "button";
  button.setAttribute("aria-label", config.buttonText ?? "Support");
  button.innerHTML = getBubbleIcon(config, false);
  button.addEventListener("click", onClick);
  return button;
}
