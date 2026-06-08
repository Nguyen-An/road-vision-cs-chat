# RoadVision Customer Support Widget

Source code này gồm 2 phần:

- `apps/portal`: Support Portal dùng Next.js App Router. Đây là domain hiển thị widget content, category list, post list và post detail.
- `packages/widget`: JavaScript SDK nhúng vào website khác qua thẻ `<script>`. SDK render floating bubble, mở popup iframe hoặc redirect sang portal.

Hiện chưa có backend thật, dữ liệu tạm được lấy từ fake data trong `apps/portal/src/lib/data-cs.ts`.

## Yêu Cầu

- Node.js đã cài.
- Dùng `corepack pnpm` để chạy lệnh. Trên Windows/PowerShell, lệnh `pnpm` hoặc `npm` có thể bị chặn bởi Execution Policy, nên repo này khuyến nghị dùng `corepack pnpm ...`.

Kiểm tra:

```bash
node --version
corepack pnpm --version
```

## Cài Dependencies

Chạy tại root project:

```bash
corepack pnpm install
```

## Chạy Portal Local

```bash
corepack pnpm dev
```

Mở:

```txt
http://localhost:3000/support
```

Các route chính:

```txt
/support
/support/categories
/support/categories/:categorySlug
/support/categories/:categorySlug/posts/:postSlug
/chat
```

Ví dụ:

```txt
http://localhost:3000/support/categories/map-guide
http://localhost:3000/support/categories/map-guide/posts/map-basic-operation
```

## Build

Build toàn bộ:

```bash
corepack pnpm build
```

Build riêng portal:

```bash
corepack pnpm build:portal
```

Build riêng SDK:

```bash
corepack pnpm build:widget
```

Sau khi build SDK, output nằm ở:

```txt
packages/widget/dist/support-widget.js
packages/widget/dist/support-widget.min.js
packages/widget/dist/support-widget.esm.js
```

## Test SDK Khi Nhúng Vào Project Khác Ở Local

Để website khác tải được SDK qua URL, copy file SDK vào thư mục `public` của portal:

```powershell
New-Item -ItemType Directory -Force apps/portal/public
Copy-Item packages/widget/dist/support-widget.js apps/portal/public/support-widget.js -Force
```

Sau đó chạy portal:

```bash
corepack pnpm dev
```

Kiểm tra SDK có truy cập được không:

```txt
http://localhost:3000/support-widget.js
```

Nếu mở URL trên thấy nội dung JavaScript là OK.

## Snippet Nhúng Vào Website Khác

Trong project khác, thêm snippet này vào HTML hoặc layout chính:

```html
<script>
  window.SupportWidgetConfig = {
    tenantId: "demo_tenant",
    userId: "user_123",
    locale: "ja",
    theme: "dark",
    mode: "iframe",
    portalUrl: "http://localhost:3000/support",
    primaryColor: "#00d9ff",
    buttonText: "サポート"
  };
</script>

<script async src="http://localhost:3000/support-widget.js"></script>
```

Khi click bubble:

- `mode: "iframe"`: mở popup iframe ngay trên website đang nhúng.
- `mode: "redirect"`: mở portal trong tab mới.

Trong iframe, widget chỉ hiển thị màn hình support home/category. Khi click vào category hoặc post list/detail, trình duyệt sẽ chuyển sang domain portal, ví dụ:

```txt
http://localhost:3000/support/categories/map-guide
```

## Ví Dụ HTML

File mẫu:

```txt
examples/basic.html
```

Bạn có thể mở file này bằng Live Server hoặc một static server khác, sau đó đảm bảo portal vẫn đang chạy ở `http://localhost:3000`.

## Cấu Hình Widget

```ts
type SupportWidgetConfig = {
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

Trường bắt buộc:

```txt
tenantId
```

## API Mock

API mock hiện có:

```txt
GET  /api/widget/tenants/:tenantId/settings
POST /api/widget/context-token
```

Chi tiết xem:

```txt
docs/API.md
```

## Lưu Ý Khi Develop

Nếu gặp lỗi port/lock như:

```txt
Port 3000 is in use
Unable to acquire lock at .next/dev/lock
```

Hãy dừng terminal đang chạy dev server bằng:

```txt
Ctrl + C
```

rồi chạy lại:

```bash
corepack pnpm dev
```

Nếu trình duyệt vẫn dùng SDK cũ, hard refresh trang nhúng bằng:

```txt
Ctrl + F5
```

hoặc build/copy lại SDK:

```bash
corepack pnpm build:widget
```

```powershell
Copy-Item packages/widget/dist/support-widget.js apps/portal/public/support-widget.js -Force
```
# road-vision-cs-chat
# road-vision-cs-chat
# road-vision-cs-chat
