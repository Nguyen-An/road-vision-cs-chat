# Customer Support Widget — Technical Prompt

## Objective

Xây dựng một **embeddable Customer Support Widget (JavaScript SDK)** có thể nhúng vào bất kỳ website nào thông qua một đoạn script. Widget hiển thị dạng chat bubble và cho phép mở hệ thống hỗ trợ khách hàng (chat portal).

---

## Integration

Widget được nhúng vào website thông qua:

```html
<script>
  window.SupportWidgetConfig = {
    tenantId: "TENANT_ID",
    userId: "USER_ID",
    locale: "vi",
    theme: "light"
  };
</script>

<script async src="https://cdn.example.com/support-widget.js"></script>
```

SDK phải:

* Tự động đọc config từ `window.SupportWidgetConfig`
* Tự khởi tạo khi script load xong

---

## Core Requirements

### 1. Widget SDK

Xây dựng một file JavaScript độc lập (`support-widget.js`) có khả năng:

* Render chat bubble (floating button góc phải dưới)
* Không ảnh hưởng CSS/JS của website host
* Responsive (desktop + mobile)
* Quản lý trạng thái open/close
* Tạo hoặc lấy `sessionId` (localStorage hoặc cookie)
* Track các event:

  * `widget_loaded`
  * `widget_opened`
  * `chat_started`

---

### 2. Widget Behavior

Khi user click vào bubble:

**Option A**

* Mở tab mới:

```
https://support.example.com/chat?tenantId=...&sessionId=...
```

**Option B**

* Mở iframe/modal embed trực tiếp trên trang

---

### 3. Context Passing

Widget cần truyền context sang portal:

* tenantId
* sessionId
* locale
* sourceUrl

⚠️ Không truyền dữ liệu nhạy cảm qua query string
→ Nếu cần: dùng short-lived token từ backend

---

### 4. Multi-tenant Support

Widget phải hỗ trợ nhiều tenant:

* Load config từ backend theo `tenantId`
* Mỗi tenant có:

  * theme
  * màu sắc
  * portal URL
  * domain whitelist

---

### 5. Security

* Chỉ cho phép domain hợp lệ nhúng widget
* Không expose PII qua URL
* Sử dụng HTTPS toàn bộ
* Token có thời hạn ngắn
* CORS config chặt chẽ
* Có rate limit API

---

### 6. Performance

* Script load async
* Bundle size < 100KB (gzip)
* Không block main thread
* Có fallback nếu load lỗi

---

### 7. Deployment

* Build SDK thành file JS tĩnh
* Deploy qua CDN (có versioning):

```
support-widget.v1.js
```

---

## Suggested Tech Stack

### Widget SDK

* Vanilla JS hoặc React + Vite (build ra JS bundle)

### Support Portal

* Next.js (chat UI, auth, ticket, realtime)

### Backend

* API tạo session/token
* Config theo tenant
* Tracking events

---

## Deliverables

* `support-widget.js` (SDK)
* Demo HTML page tích hợp widget
* Support portal (Next.js app)
* API spec cho session + config + tracking

---
