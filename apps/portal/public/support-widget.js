"use strict";
var SupportWidgetBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};

  // src/core/config.ts
  var defaultConfig = {
    locale: "ja",
    theme: "dark",
    position: "bottom-right",
    mode: "iframe",
    portalUrl: "https://support.example.com/support",
    primaryColor: "#00d9ff",
    buttonText: "\u30B5\u30DD\u30FC\u30C8"
  };
  function resolveConfig(config) {
    const merged = { ...defaultConfig, ...window.SupportWidgetConfig, ...config };
    if (!merged.tenantId) {
      throw new Error("SupportWidgetConfig.tenantId is required.");
    }
    return merged;
  }

  // src/core/session.ts
  var KEY = "support_widget_session_id";
  var memorySessionId = "";
  var randomId = () => {
    const value = new Uint8Array(12);
    crypto.getRandomValues(value);
    return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };
  function getSessionId() {
    try {
      const existing = sessionStorage.getItem(KEY);
      if (existing) return existing;
      const created = `session_${randomId()}`;
      sessionStorage.setItem(KEY, created);
      return created;
    } catch {
      if (!memorySessionId) memorySessionId = `session_${Math.random().toString(36).slice(2)}`;
      return memorySessionId;
    }
  }

  // src/services/tracking.ts
  function trackEvent(eventName, payload = {}) {
    console.info("[SupportWidget]", eventName, {
      ...payload,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }

  // src/ui/bubble.ts
  var closeIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  var chatIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  function getBubbleIcon(config, isOpen) {
    if (isOpen) return closeIcon;
    return config.iconUrl ? `<img src="${config.iconUrl}" alt="" width="28" height="28" />` : chatIcon;
  }
  function createBubble(config, onClick) {
    const button = document.createElement("button");
    button.className = "bubble";
    button.type = "button";
    button.setAttribute("aria-label", config.buttonText ?? "Support");
    button.innerHTML = getBubbleIcon(config, false);
    button.addEventListener("click", onClick);
    return button;
  }

  // src/utils/url.ts
  function buildPortalUrl(config, sessionId) {
    const url = new URL(config.portalUrl ?? "https://support.example.com/support", window.location.href);
    url.searchParams.set("tenantId", config.tenantId);
    url.searchParams.set("sessionId", sessionId);
    url.searchParams.set("locale", config.locale ?? "ja");
    url.searchParams.set("sourceUrl", window.location.href);
    url.searchParams.set("referrer", document.referrer);
    url.searchParams.set("timestamp", (/* @__PURE__ */ new Date()).toISOString());
    if (config.userId) url.searchParams.set("userId", config.userId);
    return url.toString();
  }

  // src/ui/iframe-modal.ts
  function buildIframeUrl(config, sessionId) {
    const url = new URL(buildPortalUrl(config, sessionId));
    url.searchParams.set("embed", "1");
    return url.toString();
  }
  function createIframeModal(root, config, sessionId, onClose) {
    const modal2 = document.createElement("section");
    modal2.className = "modal";
    modal2.setAttribute("role", "dialog");
    modal2.setAttribute("aria-label", "Customer support");
    modal2.innerHTML = `
    <iframe title="Customer support" sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation" src="${buildIframeUrl(config, sessionId)}"></iframe>
  `;
    root.querySelector(".root")?.appendChild(modal2);
    return modal2;
  }

  // src/ui/styles.ts
  function styles(primaryColor, position) {
    const side = position === "bottom-left" ? "left" : "right";
    return `
    :host { all: initial; }
    .root { position: fixed; ${side}: 22px; bottom: 22px; z-index: 2147483000; font-family: Arial, sans-serif; }
    .bubble { display: grid; place-items: center; width: 58px; height: 58px; border: 0; border-radius: 999px; color: #fff; cursor: pointer; background: linear-gradient(135deg, ${primaryColor}, #0b72f0); box-shadow: 0 14px 36px rgba(0, 140, 255, .42); }
    .bubble:hover { transform: translateY(-1px); }
    .modal { position: fixed; right: 22px; bottom: 94px; width: min(400px, calc(100vw - 32px)); height: min(640px, calc(100vh - 120px)); overflow: hidden; border: 1px solid #2b3b4e; border-radius: 16px; background: #071624; box-shadow: 0 22px 60px rgba(0,0,0,.4); }
    iframe { width: 100%; height: 100%; border: 0; background: #071624; }
    @media (max-width: 520px) { .modal { inset: 0; width: auto; height: auto; border-radius: 0; } .root { ${side}: 18px; bottom: 18px; } }
  `;
  }

  // src/core/init.ts
  var host = null;
  var modal = null;
  var activeConfig = null;
  var activeSessionId = "";
  var messageListenerAttached = false;
  function attachMessageListener() {
    if (messageListenerAttached) return;
    window.addEventListener("message", (event) => {
      if (event.data?.type === "support_widget_close") {
        close();
      }
    });
    messageListenerAttached = true;
  }
  function setBubbleOpen(isOpen) {
    if (!activeConfig || !host?.shadowRoot) return;
    const bubble = host.shadowRoot.querySelector(".bubble");
    if (!bubble) return;
    bubble.innerHTML = getBubbleIcon(activeConfig, isOpen);
    bubble.setAttribute("aria-expanded", String(isOpen));
  }
  function init(config) {
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
      const bubble = createBubble(activeConfig, () => modal ? close() : open());
      bubble.setAttribute("aria-expanded", "false");
      container.appendChild(bubble);
      root.append(style, container);
      document.body.appendChild(host);
      attachMessageListener();
      trackEvent("widget_loaded", { tenantId: activeConfig.tenantId, sessionId: activeSessionId });
    } catch (error) {
      trackEvent("widget_error", { message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
  function open() {
    if (!activeConfig || !host) return;
    trackEvent("widget_opened", { tenantId: activeConfig.tenantId });
    trackEvent("chat_started", { tenantId: activeConfig.tenantId });
    if (activeConfig.mode === "redirect") {
      trackEvent("portal_redirected");
      window.open(buildPortalUrl(activeConfig, activeSessionId), "_blank", "noopener,noreferrer");
      return;
    }
    if (modal) return;
    modal = createIframeModal(host.shadowRoot, activeConfig, activeSessionId, close);
    setBubbleOpen(true);
    trackEvent("iframe_opened");
  }
  function close() {
    modal?.remove();
    modal = null;
    setBubbleOpen(false);
    trackEvent("widget_closed");
  }
  function destroy() {
    modal = null;
    host?.remove();
    host = null;
  }

  // src/index.ts
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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=support-widget.js.map