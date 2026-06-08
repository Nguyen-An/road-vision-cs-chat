import { close, destroy, init, open } from "./core/init";
import type { SupportWidgetConfig } from "./types/widget";

window.SupportWidget = {
  init,
  open,
  close,
  destroy
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => init(window.SupportWidgetConfig));
} else {
  init(window.SupportWidgetConfig);
}

export type { SupportWidgetConfig };
