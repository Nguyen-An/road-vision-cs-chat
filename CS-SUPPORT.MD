# Customer Support Widget - User Guide Flow Specification

## 1. Overview

Xây dựng hệ thống hỗ trợ khách hàng gồm:

### Customer Support Widget (Popup)

Widget hiển thị dưới dạng floating button ở góc dưới bên phải màn hình.

Khi người dùng click vào button, popup hỗ trợ khách hàng sẽ được mở.

Popup là điểm khởi đầu (entry point) cho toàn bộ hệ thống hỗ trợ.

---

## 2. Screen Flow

```text
Support Widget
    ↓
Support Home
    ↓
Category List
    ↓
Post List
    ↓
Post Detail
    ↓
Back
    ↓
Post List (preserve state)
    ↓
Back
    ↓
Category List
    ↓
Back
    ↓
Support Home
```

---

# Screen 1 - Support Home

## Purpose

Màn hình chính của Customer Support Widget.

## UI Components

### Header

* Title: カスタマーサポート
* Close Button (X)

### Content

Hiển thị 2 action card:

#### Option 1 - User Guide

Title:

```text
使い方を調べる
```

Description:

```text
よくある質問やマニュアルを確認する
```

Action:

```text
Navigate → Category List Screen
```

---

#### Option 2 - Contact Support

Title:

```text
担当者につなぐ
```

Description:

```text
オペレーターと直接チャットで相談する
```

Action:

```text
Open Live Chat
OR
Redirect to Customer Support Portal
```

---

# Screen 2 - Category List

## Trigger

User click:

```text
使い方を調べる
```

## Purpose

Hiển thị danh sách các danh mục hướng dẫn sử dụng.

## UI Components

### Header

```text
← 使い方を調べる
```

### Category List

Ví dụ:

```text
地図の使い方
損傷ポイントの確認方法
動画の確認方法
レポートの見方
FAQ よくある質問
```

### Category Data Structure

```ts
interface Category {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
}
```

## Action

Click Category:

```text
Navigate → Post List Screen
```

---

# Screen 3 - Post List

## Purpose

Hiển thị danh sách bài viết thuộc category được chọn.

## Layout

### Left Sidebar

Hiển thị:

* Danh sách category
* Category hiện tại được highlight
* Tổng số bài viết trong category

---

### Main Content

Hiển thị:

* Category Title
* Article Count
* Search Input

Ví dụ:

```text
地図の使い方
4 件の記事
```

---

### Search

Cho phép tìm kiếm theo:

* Title
* Description
* Tags

Debounce:

```text
300ms
```

---

### Post Card

Ví dụ:

```text
地図の基本操作
レイヤーの切り替え方法
路線・区間を選択する
マップにメモを追加する
```

### Post Structure

```ts
interface Post {
  id: number;
  categoryId: number;

  title: string;
  slug: string;

  description: string;

  thumbnail?: string;

  content: string;

  tags: string[];

  readingTime: number;

  updatedAt: string;
}
```

---

### Pagination

Nếu số lượng bài viết vượt quá giới hạn.

Ví dụ:

```text
12 articles per page
```

Hiển thị:

```text
Previous
1
2
3
...
Next
```

---

## Actions

### Click Article

```text
Navigate → Post Detail Screen
```

### Click Category

```text
Reload article list of selected category
```

---

# Screen 4 - Post Detail

## Purpose

Hiển thị nội dung chi tiết bài viết.

---

## Layout

### Breadcrumb

```text
トップ
>
地図の使い方
>
地図の基本操作
```

---

### Header Section

#### Category Tag

```text
地図の使い方
```

#### Article Title

```text
地図の基本操作
```

#### Metadata

Hiển thị:

```text
読了時間
更新日
Tags
```

Ví dụ:

```text
読了時間: 3分
更新日: 2026-05-20
```

---

## Article Content

Hỗ trợ các loại nội dung:

### Text

```html
h1
h2
h3
p
ul
ol
blockquote
```

### Images

```html
img
```

* Có caption
* Responsive

### Video

```html
video
iframe
```

Hỗ trợ:

* MP4
* YouTube
* Vimeo

### Code Block

```html
pre
code
```

---

## Table of Contents (TOC)

Hiển thị sidebar bên phải.

Tự động generate từ:

```html
h2
h3
```

Ví dụ:

```text
マウス操作
タッチ操作
キーボードショートカット
```

Click TOC:

```text
Scroll tới section tương ứng
```

---

# Navigation Rules

## Detail → Post List

Khi user click:

* Back Button
* Breadcrumb Category

Hệ thống phải quay lại Post List.

### Preserve State

Giữ nguyên:

* Selected Category
* Search Keyword
* Current Page
* Scroll Position

---

## Post List → Category List

Khi click:

```text
← 使い方を調べる
```

Quay lại màn hình Category List.

---

## Category List → Support Home

Khi click:

* Back Button
* Close Button

Quay lại Support Home.

---

# Suggested Routes

```text
/support
    → Support Home

/support/categories
    → Category List

/support/categories/:categorySlug
    → Post List

/support/categories/:categorySlug/posts/:postSlug
    → Post Detail
```

---

# Widget Requirements

## Floating Widget

* Fixed bottom-right
* Always visible
* Smooth open animation
* Smooth close animation
* ESC để đóng popup

---

## Responsive

### Desktop

```text
Popup width: 400px
```

### Mobile

```text
Popup → Fullscreen Drawer
```

---

## Accessibility

Hỗ trợ:

* Keyboard Navigation
* Focus Trap
* ARIA Labels
* Screen Reader
* Tab Navigation

---

# Future Integration

## Contact Support Option

Khi chọn:

```text
担当者につなぐ
```

Hệ thống có thể:

### Option A

Mở Live Chat Widget

```text
Zendesk
Intercom
Freshdesk
Custom Chat
```

### Option B

Redirect

```text
/customer-support
```

hoặc

```text
https://support.example.com
```

---

# Expected User Experience

Người dùng có thể:

1. Mở widget hỗ trợ.
2. Chọn "Tìm hiểu cách sử dụng".
3. Chọn category.
4. Xem danh sách bài viết.
5. Tìm kiếm bài viết.
6. Xem chi tiết bài viết.
7. Quay lại đúng vị trí trước đó.
8. Liên hệ nhân viên hỗ trợ khi cần.

Mục tiêu là tạo trải nghiệm self-service support đơn giản, trực quan và dễ mở rộng trong tương lai.
