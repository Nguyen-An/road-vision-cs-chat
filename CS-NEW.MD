# Tài liệu phân tích thay đổi hệ thống Manual / Hướng dẫn sử dụng

## 1. Bối cảnh

Hiện tại chức năng Hướng dẫn sử dụng (Manual) đang được xây dựng nhằm mục đích demo giao diện và luồng sử dụng cho khách hàng.

Do Backend chưa được triển khai nên toàn bộ dữ liệu đang được quản lý bằng mock data trong dự án Next.js.

Các dữ liệu hiện tại gồm:

* Category (Danh mục)
* Post (Bài viết)
* PDF File

Mục tiêu ban đầu là mô phỏng một hệ thống quản lý tài liệu hướng dẫn với nhiều danh mục và nhiều bài viết.

---

# 2. Hiện trạng hệ thống

## Luồng hiện tại

### Bước 1 - Widget

Người dùng mở widget hỗ trợ.

Widget hiển thị danh sách Category.

Ví dụ:

```text
地図の使い方
損傷ポイントの確認方法
動画の確認方法
レポートの見方
FAQ
```

Khi click vào một Category sẽ điều hướng sang Portal.

---

### Bước 2 - Portal

Portal hiển thị:

* Danh sách Category ở menu bên trái
* Danh sách Post thuộc Category được chọn ở khu vực nội dung

Ví dụ:

```text
地図の使い方
 ├─ 地図の基本操作
 ├─ レイヤーの切り替え方法
 ├─ 路線・区間を選択する
 └─ マップにメモを追加する
```

Khi click vào một Post sẽ mở màn hình chi tiết.

---

### Bước 3 - Màn hình chi tiết

Mỗi Post tương ứng với một file PDF.

Màn hình chi tiết hiển thị:

* Mục lục PDF
* PDF Viewer
* Thanh tìm kiếm
* Chức năng zoom
* Điều hướng trang

---

# 3. Yêu cầu thay đổi mới từ khách hàng

Khách hàng đã thay đổi cách quản lý tài liệu hướng dẫn.

Hệ thống sẽ không còn:

* Category
* Post

nữa.

Thay vào đó toàn bộ nội dung sẽ được lấy từ một file PDF duy nhất.

Ví dụ:

```text
Tài liệu hướng dẫn sử dụng hệ thống.pdf
```

PDF này sẽ chứa toàn bộ nội dung hướng dẫn sử dụng của hệ thống.

---

# 4. Kiến trúc mới

## Mô hình cũ

```text
Category
 └─ Post
      └─ PDF
```

## Mô hình mới

```text
PDF Manual
 ├─ Chương 1
 │   ├─ Mục 1.1
 │   ├─ Mục 1.2
 │   └─ Mục 1.3
 │
 ├─ Chương 2
 │   ├─ Mục 2.1
 │   └─ Mục 2.2
 │
 └─ Chương 3
```

Toàn bộ điều hướng sẽ dựa trên mục lục của file PDF.

---

# 5. Thiết kế API tương lai

Hiện tại Backend chưa có.

Tạm thời Frontend sẽ tiếp tục sử dụng mock API để mô phỏng dữ liệu.

Tuy nhiên cấu trúc code cần được thiết kế theo hướng sau này có thể thay thế bằng API thật.

---

## API 1 - Lấy cây mục lục

Mục đích:

* Hiển thị menu trong Widget
* Hiển thị sidebar mục lục trong PDF Viewer
* Điều hướng đến vị trí tương ứng trong PDF

Mock response:

```json
[
  {
    "id": "chapter-1",
    "title": "1. Tổng quan hệ thống",
    "page": 4,
    "children": [
      {
        "id": "chapter-1-1",
        "title": "1.1 Giới thiệu",
        "page": 4
      }
    ]
  }
]
```

---

## API 2 - Lấy thông tin file PDF

Mục đích:

* Hiển thị PDF Viewer

Mock response:

```json
{
  "pdfUrl": "/mock/manual.pdf"
}
```

---

# 6. Luồng mới dự kiến

## Widget

Widget không còn hiển thị Category.

Thay vào đó sẽ hiển thị các mục lục cấp cao nhất của PDF.

Ví dụ:

```text
1. Tổng quan hệ thống
2. Quản lý bản đồ
3. Quản lý video
4. Quản lý hư hỏng
5. Tìm kiếm dữ liệu
```

Khi người dùng click:

```text
Widget
   ↓
Click mục lục
   ↓
Đi thẳng đến PDF Viewer
   ↓
Tự động chuyển đến đúng vị trí trong PDF
```

---

## Portal

Portal sẽ không còn khái niệm Category và Post.

Có hai phương án:

### Phương án 1 (Khuyến nghị)

Bỏ hoàn toàn màn hình danh sách.

Luồng:

```text
Widget
 ↓
PDF Viewer
```

---

### Phương án 2

Giữ Portal.

Portal chỉ hiển thị cây mục lục PDF.

Ví dụ:

```text
1. Tổng quan hệ thống
2. Quản lý bản đồ
3. Quản lý video
...
```

Khi click sẽ mở PDF Viewer.

---

## PDF Viewer

PDF Viewer sẽ trở thành màn hình chính.

Bố cục:

```text
+----------------------+----------------------+
|                      |                      |
|  Sidebar Mục lục     |      PDF Viewer      |
|                      |                      |
+----------------------+----------------------+
```

Khi màn hình mở:

1. Lấy dữ liệu mục lục
2. Lấy URL PDF
3. Render PDF
4. Render Sidebar
5. Scroll đến vị trí được chọn

---

# 7. Các thay đổi cần thực hiện ở Frontend

## Loại bỏ

Không còn sử dụng:

```text
Category
Post
Category List
Post List
Post Detail
```

Không còn phụ thuộc vào:

```text
categoryId
postId
postSlug
```

---

## Bổ sung

Tạo cấu trúc mới:

```ts
interface OutlineItem {
  id: string;
  title: string;
  page: number;
  children?: OutlineItem[];
}
```

---

## Component mới

```text
OutlineTree
OutlineSidebar
PdfViewer
```

---

## Mock API mới

```ts
getManualOutline()
getManualPdf()
```

Hiện tại trả dữ liệu từ file mock.

Sau này có Backend chỉ cần thay đổi tầng API mà không ảnh hưởng UI.

---

# 8. Mục tiêu của đợt refactor

* Loại bỏ mô hình Category/Post hiện tại.
* Chuyển sang mô hình điều hướng theo mục lục PDF.
* Chỉ sử dụng một file PDF duy nhất.
* Widget và PDF Viewer sử dụng chung nguồn dữ liệu mục lục.
* Thiết kế Frontend theo hướng dễ dàng tích hợp Backend trong tương lai.
* Tiếp tục sử dụng mock API để demo giao diện cho khách hàng trong giai đoạn hiện tại.
