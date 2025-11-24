# 2. ĐẶC TẢ THỰC HIỆN FRONTEND

## 2.1. Mục tiêu & Kiến trúc tổng quan

### 2.1.1. Mục tiêu

* Xây dựng FE web đơn giản (SPA hoặc MPA) cho:

  * Khám phá catalog sách (phân trang, filter, search).
  * Xem chi tiết 1 sách, cùng với danh sách sách tương tự.
  * Chọn 1 user demo (từ `/demo/users`) để:

    * Xem danh sách gợi ý “dành cho user đó”.
    * Xem điểm rating dự đoán cho một cuốn sách cụ thể.

### 2.1.2. Kiến trúc FE (gợi ý)

* Tech stack gợi ý (anh tự chọn, tài liệu chỉ yêu cầu logic):

  * React / Vue / Next.js / bất kỳ framework SPA.
  * Axios hoặc fetch API để gọi backend.
* State quan trọng:

  * `selectedUser`: thông tin user demo đang được chọn (lấy từ `/demo/users`).
  * `catalogFilters`: page, page_size, category, language, sort_by, order.
  * `searchQuery`: chuỗi query search hiện tại.
  * `bookDetail`: dữ liệu 1 sách + list similar.
  * `recommendationsForUser`: list gợi ý khi user demo đã chọn.

---

## 2.2. Các màn hình / component chính

### 2.2.1. Header / Layout chung

* Thành phần:

  * Logo / tên hệ thống: “Book Recommender”.
  * Thanh chọn **User Demo**:

    * Dropdown hoặc horizontal scroll list.
    * Gọi `/demo/users` khi app load lần đầu:

      * Nếu empty: ẩn block “Gợi ý cho bạn”, chỉ hiển thị catalog/search.
    * Mỗi item: `user_id`, `n_ratings`, `avg_rating`, `top_categories`.

      * Ví dụ hiển thị: `User 123456 (215 ratings, avg 6.7, top: Fiction, History)`
    * Khi user click chọn một user:

      * Lưu `selectedUser` vào state global.
      * Điều hướng sang “Trang gợi ý cho user” hoặc chỉ bật tab “Gợi ý cho bạn”.

* Xử lý trạng thái:

  * **Loading** khi gọi `/demo/users`: hiển thị spinner hoặc text “Đang tải danh sách user demo…”.
  * **Error**: nếu call lỗi, log console + hiển thị “Không tải được danh sách user demo”.

---

### 2.2.2. Trang Catalog (Danh sách sách)

* Dùng API: `GET /books`.

* Chức năng:

  1. **Phân trang**:

     * Nút Previous / Next, hiển thị số trang hiện tại.
     * Gọi lại `/books?page={page}&page_size={page_size}&...`.
  2. **Filter**:

     * Category (input text hoặc dropdown phổ biến): map vào query `category`.
     * Language: map vào query `language`.
  3. **Sort**:

     * Dropdown: “Phổ biến nhất”, “Rating cao nhất”, “Mới nhất”.
     * Tương ứng:

       * `sort_by=popularity&order=desc`
       * `sort_by=rating&order=desc`
       * `sort_by=year&order=desc`
  4. **Hiển thị list sách**:

     * Card sách (grid):

       * Ảnh: `img_m`
       * Tiêu đề: `book_title`
       * Tác giả: `book_author`
       * Rating trung bình (nếu có): `rating_mean` kèm số lượt: `rating_count`
       * Category, Language.
     * Click card:

       * Điều hướng tới `/book/{isbn}` (FE route) → gọi API chi tiết.

* Loading/error:

  * Khi call `/books`:

    * `loadingCatalog = true` → hiển thị skeleton card.
  * Nếu lỗi (`5xx`, network…):

    * Hiển thị message: “Không tải được danh sách sách. Vui lòng thử lại.”

---

### 2.2.3. Trang Search sách

* Có thể:

  * Là một màn riêng, hoặc
  * Là cùng màn với Catalog nhưng khi có `searchQuery` thì dùng `/books/search` thay vì `/books`.

* API dùng: `GET /books/search?q=...`.

* Logic:

  * Khi user nhập vào ô tìm kiếm:

    * Debounce 300–500ms trước khi gọi API.
    * Nếu query rỗng -> fallback về `/books` (catalog).
  * Pagination:

    * Sử dụng `page`, `page_size` giống catalog.

* Hiển thị:

  * Giống grid card của catalog.
  * Header hiển thị: “Kết quả cho từ khóa: ‘{q}’ (X sách)”.

* Loading/error:

  * Tương tự trang catalog.

---

### 2.2.4. Trang Chi tiết Sách

Routing mẫu: `/books/:isbn`.

* API cần gọi:

  1. `GET /books/{isbn}` – lấy `BookItem`.
  2. `GET /books/{isbn}/similar?top_k=10` – lấy danh sách sách tương tự.
  3. (Nếu có `selectedUser`) – `POST /predict` để lấy rating dự đoán cho user đó với sách này.

* Kịch bản FE:

  * Khi vào `/books/034545104X`:

    1. `loadingDetail = true`.
    2. Gọi `GET /books/034545104X`.
    3. Sau khi xong, gọi song song:

       * `GET /books/034545104X/similar?top_k=10`
       * Nếu có `selectedUser`: `POST /predict` với `user_id` và isbn hiện tại.

* Hiển thị:

  * Khối **thông tin chính**:

    * Ảnh lớn: `img_l` hoặc `img_m`.
    * Tiêu đề, tác giả, publisher.
    * Category, Language, năm xuất bản.
    * Summary (mô tả).
    * Rating trung bình & số lượt: `rating_mean`, `rating_count`.

  * Khối **Dự đoán cho user hiện tại** (nếu có `selectedUser`):

    * Text: “Nếu là user {user_id}, hệ thống dự đoán bạn sẽ chấm: {predicted_rating}/10”.
    * Nếu gọi `/predict` trả 404 (user hoặc isbn không có trong MF): ẩn khối này hoặc hiển thị “Không có dự đoán cho sách này”.

  * Khối **Sách tương tự**:

    * Tiêu đề: “Sách tương tự”.
    * Dùng list `items` từ `/books/{isbn}/similar`:

      * Mỗi item: `img_s`/`img_m`, `book_title`, `book_author`.
      * Có thể hiển thị thêm `predicted_rating` (thực chất là similarity) dưới dạng “độ tương đồng: 0.93”.

* Handling lỗi:

  * `GET /books/{isbn}` trả 404:

    * Hiển thị trang “Không tìm thấy sách”.
  * `/books/{isbn}/similar` lỗi:

    * Chỉ tắt khối “Sách tương tự”, không chặn trang chính.

---

### 2.2.5. Trang “Gợi ý cho bạn” (User Recommendations)

Routing gợi ý: `/users/:userId/recommendations` hoặc một tab riêng.

* Điều kiện: chỉ dùng cho user đã chọn từ `/demo/users`.

* API:

  * `GET /users/{user_id}/recommendations?top_k=20`.

* Logic:

  1. Khi `selectedUser` được set (từ dropdown/scroll):

     * FE có thể:

       * Tự động điều hướng tới `/users/{user_id}/recommendations`.
       * Hoặc chỉ render tab “Recommend” bên cạnh catalog.

  2. Trên màn hình này:

     * Gọi API `/users/{user_id}/recommendations`.
     * Lưu kết quả vào `recommendationsForUser`.

* Hiển thị:

  * Header: “Gợi ý cho user {user_id}”.
  * Danh sách card (layout tương tự catalog), nhưng:

    * Thay vì rating trung bình, hiển thị:

      * “Điểm dự đoán: {predicted_rating}/10”.
    * Vẫn có thể show `rating_mean` / `rating_count` nếu join thêm, nhưng không bắt buộc.
  * Click card:

    * Điều hướng tới trang chi tiết sách tương ứng (`/books/{isbn}`).

* Loading/error:

  * Nếu `/users/{user_id}/recommendations` trả 404:

    * Hiển thị “User này không tồn tại trong tập train MF. Vui lòng chọn user khác.”

---

## 2.3. Xử lý trạng thái chung

### 2.3.1. Loading

* Với mỗi call API:

  * Có state `isLoading` tương ứng (catalog, search, detail, recommend, demoUsers).
  * UI tối thiểu:

    * Nút bấm disabled khi đang loading.
    * Skeleton card cho danh sách.
    * Spinner đơn giản cho load đầu trang.

### 2.3.2. Error chung

* Mọi call API nên được bọc trong try/catch:

  * Nếu lỗi network:

    * Message: “Không thể kết nối đến server. Vui lòng kiểm tra mạng hoặc thử lại sau.”
  * Nếu lỗi 4xx với `detail`:

    * Hiển thị `detail` từ BE (ví dụ ISBN không tồn tại).

### 2.3.3. Empty state

* `/books` trả `total_items = 0`:

  * Hiển thị “Không tìm thấy sách phù hợp với bộ lọc hiện tại.”
* `/books/search` không có kết quả:

  * Hiển thị “Không tìm thấy kết quả cho từ khóa ‘{q}’.”
* `/users/{user_id}/recommendations` trả `items = []`:

  * “Chưa có gợi ý nào cho user này.”

---

## 2.4. Tóm tắt mapping BE ↔ FE

| Tính năng FE                        | Endpoint BE                            | Dữ liệu chính dùng                 |
| ----------------------------------- | -------------------------------------- | ---------------------------------- |
| Catalog + phân trang + filter       | `GET /books`                           | `BookListResponse.items[]`         |
| Search theo tiêu đề/tác giả         | `GET /books/search`                    | `BookListResponse.items[]`         |
| Chi tiết sách                       | `GET /books/{isbn}`                    | `BookItem`                         |
| Sách tương tự                       | `GET /books/{isbn}/similar`            | `SimilarBooksResponse.items[]`     |
| Danh sách user demo cho scroll      | `GET /demo/users`                      | `DemoUser[]`                       |
| Gợi ý top-N sách cho user demo      | `GET /users/{user_id}/recommendations` | `RecommendResponse.items[]`        |
| Điểm rating dự đoán cho sách cụ thể | `POST /predict`                        | `PredictResponse.predicted_rating` |
