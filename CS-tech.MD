# Technical Prompt: Customer Support Widget SDK

## Objective

Create a production-ready **Customer Support Widget SDK** that can be embedded into any external website using a JavaScript snippet.

The widget should render a floating chat bubble at the bottom-right corner of the website. When users click the bubble, the SDK should either:

1. Open an embedded support UI using iframe/modal.
2. Redirect or open a new tab to an external support portal.

The project should be implemented with **Next.js + TypeScript** and organized as a clean, scalable codebase.

---

# Main Use Case

External websites integrate the widget using:

```html
<script>
  window.SupportWidgetConfig = {
    tenantId: "TENANT_ID",
    userId: "USER_ID",
    locale: "vi",
    theme: "light"
  };
</script>

<script async src="https://widget.example.com/support-widget.js"></script>
```

After loading, the script should automatically initialize the widget, read configuration from `window.SupportWidgetConfig`, render the chat bubble, and attach all required event listeners.

---

# Expected Architecture

Use a monorepo-style structure with two main packages/apps:

```txt
apps/
  portal/
    # Independent support portal website
    # Built with Next.js App Router

packages/
  widget/
    # Embeddable widget SDK
    # Built into support-widget.js
```

---

# Package 1: Widget SDK

## Responsibility

The Widget SDK is a JavaScript file embedded into the customer website.

It must:

* Read config from `window.SupportWidgetConfig`.
* Validate required config such as `tenantId`.
* Render floating chat bubble.
* Manage open/close state.
* Create or reuse `sessionId`.
* Track widget events.
* Pass context to support portal.
* Support iframe modal mode.
* Support redirect mode.
* Avoid CSS/JS conflict with host website.
* Be lightweight and CDN-ready.

---

## Widget Config Type

Create this type:

```ts
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
```

---

## Global Window Declaration

Create global typing:

```ts
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
```

---

# Widget Behavior

## On Script Load

When `support-widget.js` is loaded:

1. Read `window.SupportWidgetConfig`.
2. Validate config.
3. Create session ID if not exists.
4. Render chat bubble.
5. Track `widget_loaded`.
6. Expose global API as `window.SupportWidget`.

---

## Bubble UI

The chat bubble should:

* Appear at bottom-right by default.
* Be responsive on mobile.
* Use Shadow DOM to isolate styles.
* Not affect host website layout.
* Support custom color/icon/text.
* Show optional notification badge.
* Have hover and click effects.
* Use high z-index but avoid breaking host page.

---

## Click Behavior

When user clicks the bubble:

### Mode 1: Redirect

Open support portal URL:

```txt
https://support.example.com/chat?tenantId=TENANT_ID&sessionId=SESSION_ID&locale=vi&sourceUrl=CURRENT_URL
```

Default behavior: open in new tab.

### Mode 2: Iframe Modal

Render a modal iframe inside the host page:

```txt
<iframe src="https://support.example.com/chat?tenantId=..."></iframe>
```

The iframe modal should have:

* Close button.
* Mobile full-screen mode.
* Desktop centered panel.
* Loading state.
* Error fallback.

---

# Context Passing

The SDK should pass context to the portal using query params:

```ts
{
  tenantId,
  userId,
  sessionId,
  locale,
  sourceUrl,
  referrer,
  userAgent,
  timestamp
}
```

For sensitive data, do not pass directly through URL.

Instead, design a method:

```ts
POST /api/widget/context-token
```

Request:

```json
{
  "tenantId": "abc123",
  "sessionId": "session_456",
  "userId": "user_789",
  "sourceUrl": "https://client-site.com/pricing"
}
```

Response:

```json
{
  "token": "short_lived_token"
}
```

Then redirect to:

```txt
https://support.example.com/chat?token=short_lived_token
```

---

# Tracking Events

Implement tracking utility for the following events:

```ts
type WidgetEvent =
  | "widget_loaded"
  | "widget_opened"
  | "widget_closed"
  | "chat_started"
  | "portal_redirected"
  | "iframe_opened"
  | "widget_error";
```

Create function:

```ts
trackEvent(eventName: WidgetEvent, payload?: Record<string, unknown>): void
```

For now, logging to console is acceptable, but structure the code so it can later call an API endpoint.

---

# Session Management

Create or reuse a session ID.

Rules:

* Use `sessionStorage` by default.
* Key: `support_widget_session_id`.
* Format: `session_${randomId}`.
* Do not store sensitive information.
* If storage is unavailable, fallback to in-memory session.

---

# Security Requirements

Implement and document the following:

* Only allow widget initialization when `tenantId` exists.
* Support domain whitelist validation through backend config.
* Do not store PII in localStorage.
* Do not pass sensitive data through query params.
* Use HTTPS-only portal and CDN URLs.
* Add rate-limit-ready tracking API design.
* Use short-lived token for sensitive context.
* Use strict iframe sandbox settings where possible.

Recommended iframe attributes:

```html
sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
```

---

# Multi-Tenant Support

The SDK must support tenant-based customization.

Each tenant can have:

```ts
type TenantWidgetSettings = {
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
```

Create placeholder API:

```ts
GET /api/widget/tenants/:tenantId/settings
```

This API should return tenant configuration.

If tenant settings API fails, fallback to local config.

---

# Portal App

Create a basic support portal with Next.js App Router.

Route:

```txt
/chat
```

The page should read:

* `tenantId`
* `sessionId`
* `locale`
* `sourceUrl`
* `token`

from query params.

The portal should contain placeholder sections for:

* Chat realtime UI
* FAQ / Knowledge Base
* Ticket form
* Conversation history

For this base version, implement mock UI only.

---

# Deployment Requirements

## Widget SDK

The widget package should build into a static JavaScript file:

```txt
dist/support-widget.js
```

The script should be CDN-ready:

```txt
https://cdn.example.com/widget/support-widget.v1.js
```

Requirements:

* Bundle size should be small.
* Avoid unnecessary dependencies.
* Do not bundle React inside widget SDK unless necessary.
* Prefer vanilla TypeScript for SDK.
* Output should be IIFE or UMD format.
* Support versioning.

---

## Portal

The portal app should be deployable as a normal Next.js website:

```txt
https://support.example.com
```

---

# Non-Functional Requirements

The widget must:

* Load asynchronously.
* Not block host website rendering.
* Have gzip bundle size under 100KB if possible.
* Avoid global CSS leakage.
* Avoid polluting global namespace except `window.SupportWidget`.
* Work on modern browsers.
* Handle initialization errors gracefully.
* Provide fallback UI if iframe fails.
* Include logging hooks for monitoring.

---

# Suggested Folder Structure

```txt
customer-support-widget/
│
├── apps/
│   └── portal/
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   └── chat/
│       │   │       └── page.tsx
│       │   ├── components/
│       │   ├── features/
│       │   │   └── chat/
│       │   ├── lib/
│       │   └── styles/
│       └── package.json
│
├── packages/
│   └── widget/
│       ├── src/
│       │   ├── core/
│       │   │   ├── init.ts
│       │   │   ├── config.ts
│       │   │   ├── session.ts
│       │   │   └── lifecycle.ts
│       │   ├── ui/
│       │   │   ├── bubble.ts
│       │   │   ├── iframe-modal.ts
│       │   │   └── styles.ts
│       │   ├── services/
│       │   │   ├── tenant-settings.ts
│       │   │   ├── context-token.ts
│       │   │   └── tracking.ts
│       │   ├── utils/
│       │   │   ├── dom.ts
│       │   │   ├── url.ts
│       │   │   └── logger.ts
│       │   ├── types/
│       │   │   └── widget.ts
│       │   └── index.ts
│       ├── dist/
│       ├── package.json
│       └── tsup.config.ts
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---

# Implementation Requirements

Please generate:

1. Complete monorepo folder structure.
2. Widget SDK source code.
3. Bubble rendering logic.
4. Shadow DOM style isolation.
5. Iframe modal implementation.
6. Redirect implementation.
7. Session management.
8. Config validation.
9. Tracking service.
10. Tenant settings placeholder API.
11. Context token placeholder API.
12. Portal `/chat` page.
13. Example integration HTML file.
14. README with setup and usage instructions.

---

# Example Integration HTML

Create:

```txt
examples/basic.html
```

Content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Support Widget Demo</title>
</head>
<body>
  <h1>Client Website</h1>

  <script>
    window.SupportWidgetConfig = {
      tenantId: "demo_tenant",
      userId: "user_123",
      locale: "vi",
      theme: "light",
      mode: "iframe",
      portalUrl: "https://support.example.com/chat",
      primaryColor: "#2563eb",
      buttonText: "Hỗ trợ"
    };
  </script>

  <script async src="./dist/support-widget.js"></script>
</body>
</html>
```

---

# Expected Result

After implementation:

* Running the widget build should generate `dist/support-widget.js`.
* Opening `examples/basic.html` should show a chat bubble.
* Clicking bubble should open iframe modal or redirect based on config.
* Portal `/chat` page should receive context from widget.
* Widget should not affect host website CSS/layout.
* Code should be clean, typed, modular, and production-oriented.


--- LIB

# Required Libraries & Dependencies

The new project should reuse the proven libraries from the existing RoadVision project whenever appropriate.

However, avoid installing unnecessary dependencies.

---

# Root Dependencies

## Core Framework

```json
{
  "next": "16.x",
  "react": "19.x",
  "react-dom": "19.x",
  "typescript": "^5.x"
}
```

Purpose:

* Next.js App Router
* React UI
* Type Safety
 
---

# Styling

```json
{
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "tailwind-merge": "^3",
  "clsx": "^2",
  "class-variance-authority": "^0.7"
}
```

Purpose:

* Utility CSS
* Component Variants
* ClassName composition

---

# Icons

```json
{
  "lucide-react": "^0.476"
}
```

Purpose:

* Widget icon
* Portal icons
* Navigation icons

---

# UI Components

Use Radix UI as the base component system.

Install:

```json
{
  "@radix-ui/react-dialog": "^1",
  "@radix-ui/react-dropdown-menu": "^2",
  "@radix-ui/react-popover": "^1",
  "@radix-ui/react-tooltip": "^1",
  "@radix-ui/react-tabs": "^1",
  "@radix-ui/react-select": "^2",
  "@radix-ui/react-checkbox": "^1",
  "@radix-ui/react-radio-group": "^1",
  "@radix-ui/react-accordion": "^1",
  "@radix-ui/react-slot": "^1"
}
```

Purpose:

* Modal
* Tooltip
* Dropdown
* FAQ Accordion
* Settings Panels

---

# Notifications

```json
{
  "sonner": "^2"
}
```

Purpose:

* Toast notifications
* Success/Error feedback

---

# Forms

```json
{
  "react-hook-form": "^7",
  "@hookform/resolvers": "^4",
  "zod": "^3"
}
```

Purpose:

* Ticket form
* Login form
* Support request form
* Config validation

---

# Data Fetching

```json
{
  "axios": "^1",
  "@tanstack/react-query": "^5"
}
```

Purpose:

* Tenant settings
* Context token generation
* Portal APIs
* FAQ APIs

---

# State Management

```json
{
  "zustand": "^5"
}
```

Purpose:

* Widget state
* User session state
* Portal UI state

Do NOT install Jotai.

Use Zustand only.

---

# Date Utilities

```json
{
  "date-fns": "^4"
}
```

Purpose:

* Ticket timestamps
* Chat timestamps
* Session expiration

---

# Animation

```json
{
  "framer-motion": "^12"
}
```

Purpose:

* Widget open animation
* Bubble hover effect
* Modal transitions

Do NOT use React Spring.

---

# Carousel (Optional)

```json
{
  "embla-carousel-react": "^8"
}
```

Purpose:

* FAQ carousel
* Knowledge base slider

Only install if needed.

---

# Media Support (Optional)

```json
{
  "@vidstack/react": "^1"
}
```

Purpose:

* Tutorial videos
* Help center videos

Only install if support portal contains video content.

---

# Mock API

```json
{
  "msw": "^2"
}
```

Purpose:

* Local development
* Mock tenant settings
* Mock support APIs

---

# Widget SDK Build Tools

The Widget SDK must be built separately from Next.js.

Install:

```json
{
  "tsup": "^8"
}
```

Purpose:

* Bundle widget SDK
* Generate IIFE build
* Generate ESM build

Output:

```txt
dist/
├── support-widget.js
├── support-widget.min.js
└── support-widget.esm.js
```

---

# Monorepo Tooling

Use pnpm workspaces.

Install:

```json
{
  "pnpm": "latest"
}
```

Structure:

```txt
apps/
  portal/

packages/
  widget/
```

---

# Linting

```json
{
  "eslint": "^9",
  "eslint-config-next": "^16"
}
```

Rules:

* Strict TypeScript
* No explicit any
* No unused variables
* Consistent imports

---

# Libraries NOT To Install

The following libraries exist in the RoadVision project but are NOT required for the Customer Support Widget project:

```txt
aws-amplify
@aws-amplify/ui-react
@aws-amplify/adapter-nextjs

tableau-react

react-tinder-card

swiper

react-resizable-panels

jotai
jotai-devtools
jotai-tanstack-query

video.js

react-day-picker
```

Do not install them unless a future requirement explicitly needs them.

---

# Expected package.json

The generated project should contain approximately:

```txt
Core:
- next
- react
- react-dom
- typescript

UI:
- radix-ui
- lucide-react
- sonner

Forms:
- react-hook-form
- zod

Data:
- axios
- react-query

State:
- zustand

Utils:
- date-fns

Animation:
- framer-motion

Development:
- msw
- tsup
- eslint
```

The dependency list should remain minimal, clean, and optimized for an embeddable SDK and customer support portal.
