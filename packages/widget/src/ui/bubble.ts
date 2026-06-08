import type { SupportWidgetConfig } from "../types/widget";

export function createBubble(config: SupportWidgetConfig, onClick: () => void) {
  const button = document.createElement("button");
  button.className = "bubble";
  button.type = "button";
  button.setAttribute("aria-label", config.buttonText ?? "Support");
  button.innerHTML = config.iconUrl
    ? `<img src="${config.iconUrl}" alt="" width="28" height="28" />`
    : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  button.addEventListener("click", onClick);
  return button;
}
