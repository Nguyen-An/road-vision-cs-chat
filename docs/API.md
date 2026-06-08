# Widget API Spec

## Tenant Settings

```txt
GET /api/widget/tenants/:tenantId/settings
```

Returns tenant-specific widget settings. The current implementation is a mock endpoint and is ready to be replaced by a backend lookup.

```json
{
  "tenantId": "demo_tenant",
  "theme": "dark",
  "primaryColor": "#00d9ff",
  "locale": "ja",
  "portalUrl": "/support",
  "allowedDomains": ["localhost", "127.0.0.1"],
  "routingTeam": "customer-success"
}
```

## Context Token

```txt
POST /api/widget/context-token
```

Use this endpoint when context contains sensitive fields that should not be passed through query strings.

Request:

```json
{
  "tenantId": "demo_tenant",
  "sessionId": "session_123",
  "userId": "user_123",
  "sourceUrl": "https://client.example.com/dashboard"
}
```

Response:

```json
{
  "token": "ctx_short_lived_token",
  "expiresIn": 300
}
```

## Tracking Events

The SDK currently logs structured events to `console.info`. The supported event names are:

```txt
widget_loaded
widget_opened
widget_closed
chat_started
portal_redirected
iframe_opened
widget_error
```

Future backend implementation should rate-limit this endpoint and validate tenant/domain ownership before accepting events.
