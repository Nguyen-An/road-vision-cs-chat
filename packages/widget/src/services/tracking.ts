import type { WidgetEvent } from "../types/widget";

export function trackEvent(eventName: WidgetEvent, payload: Record<string, unknown> = {}) {
  console.info("[SupportWidget]", eventName, {
    ...payload,
    timestamp: new Date().toISOString()
  });
}
