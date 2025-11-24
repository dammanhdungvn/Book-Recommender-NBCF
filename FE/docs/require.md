

# 1. ĐẶC TẢ API – BOOK RECOMMENDER SERVICE

## 1.1. Tổng quan

* **Mục đích**: Cung cấp các API phục vụ hệ thống gợi ý sách dựa trên:

  * Mô hình Matrix Factorization (MF – SVD-style) trên dữ liệu `Preprocessed_data.csv`.
  * Metadata sách (title, author, publisher, category, language, hình ảnh, summary, thống kê rating).
* **Base URL**: tùy môi trường, ví dụ:

  * Dev (Colab + ngrok): `https://alla-designatory-griselda.ngrok-free.dev/`
* **Format**:

  * Request/response: `application/json`
  * Mã hóa: UTF-8
* **Authentication**:

  * Hiện tại: **không yêu cầu auth**, dùng cho demo nội bộ.
* **CORS**:

  * Được enable `allow_origins=["*"]` (mọi domain đều gọi được, dùng cho dev/demo).

---

## 1.2. Models (Pydantic)

### 1.2.1. `BookItem`

Thông tin chi tiết 1 sách.

```jsonc
{
  "isbn": "034545104X",
  "book_title": "Example Title",
  "book_author": "Author Name",
  "publisher": "Publisher Name",
  "language": "en",
  "category": "['Fiction', 'Drama']",
  "year_of_publication": 2002,
  "img_s": "http://...thumb.jpg",
  "img_m": "http://...medium.jpg",
  "img_l": "http://...large.jpg",
  "summary": "Short description...",
  "rating_count": 123,
  "rating_mean": 7.5
}
```

### 1.2.2. `BookListResponse`

Kết quả phân trang danh sách sách.

```jsonc
{
  "page": 1,
  "page_size": 20,
  "total_items": 5438,
  "total_pages": 272,
  "items": [ /* array of BookItem */ ]
}
```

### 1.2.3. `Recommendation`

Item gợi ý hoặc sách tương tự.

```jsonc
{
  "isbn": "034545104X",
  "book_title": "Example Title",
  "book_author": "Author Name",
  "publisher": "Publisher Name",
  "language": "en",
  "category": "['Fiction']",
  "predicted_rating": 8.3,   // với recommend cho user: điểm dự đoán
  "img_s": "http://...thumb.jpg",
  "img_m": "http://...medium.jpg"
}
```

> Với API “sách tương tự”, `predicted_rating` thực chất là **similarity score** (cosine) giữa 2 sách.

### 1.2.4. `RecommendResponse`

```jsonc
{
  "user_id": 123456,
  "top_k": 10,
  "items": [ /* array of Recommendation */ ]
}
```

### 1.2.5. `PredictRequest` / `PredictResponse`

```jsonc
// Request
{
  "user_id": 123456,
  "isbn": "034545104X"
}

// Response
{
  "user_id": 123456,
  "isbn": "034545104X",
  "predicted_rating": 8.3
}
```

### 1.2.6. `SimilarBooksResponse`

```jsonc
{
  "isbn": "034545104X",
  "top_k": 10,
  "items": [ /* array of Recommendation (similarity) */ ]
}
```

### 1.2.7. `DemoUser`

Dùng cho UI scroll chọn user demo.

```jsonc
{
  "user_id": 123456,
  "n_ratings": 215,              // số rating user đó đã cho
  "avg_rating": 6.7,             // rating trung bình
  "top_categories": ["Fiction", "Drama", "History"]
}
```

---

## 1.3. Endpoints chi tiết

### 1.3.1. Health check

**GET** `/health`

* **Mô tả**: Kiểm tra service còn sống.
* **Request**:

  * Không có params.
* **Response 200**:

```json
{ "status": "ok" }
```

---

### 1.3.2. Danh sách user demo (cho scroll chọn user)

**GET** `/demo/users`

* **Mô tả**:

  * Trả về danh sách một số user tiêu biểu (user có nhiều rating) để FE hiển thị dạng scroll/dropdown.
  * Dùng cho demo, không phải danh sách user đầy đủ.
* **Request**:

  * Không có query params.
* **Response 200**: `List<DemoUser>`

Ví dụ:

```jsonc
[
  {
    "user_id": 123456,
    "n_ratings": 215,
    "avg_rating": 6.73,
    "top_categories": ["Fiction", "History", "Non-Fiction"]
  },
  {
    "user_id": 789012,
    "n_ratings": 180,
    "avg_rating": 7.10,
    "top_categories": ["Science", "Fantasy"]
  }
]
```

---

### 1.3.3. Danh sách sách (catalog + phân trang + filter)

**GET** `/books`

* **Mô tả**:

  * Trả về catalog sách với phân trang.
  * Hỗ trợ lọc theo category, language và sort theo:

    * Popularity: `rating_count`
    * Rating: `rating_mean`
    * Year: `year_of_publication`
* **Query params**:

| Tên         | Kiểu   | Mặc định | Bắt buộc | Mô tả                                                     |
| ----------- | ------ | -------- | -------- | --------------------------------------------------------- |
| `page`      | int    | 1        | Không    | Trang, ≥ 1                                                |
| `page_size` | int    | 20       | Không    | Số sách mỗi trang (1–100)                                 |
| `category`  | string | null     | Không    | Lọc contains theo `Category` (không phân biệt hoa/thường) |
| `language`  | string | null     | Không    | Lọc contains theo `Language`                              |
| `sort_by`   | string | null     | Không    | `popularity` | `rating` | `year`                          |
| `order`     | string | "desc"   | Không    | `asc` | `desc`                                            |

* **Response 200**: `BookListResponse`

Ví dụ:

`GET /books?page=1&page_size=20&sort_by=popularity&order=desc`

---

### 1.3.4. Search sách theo tiêu đề/tác giả

**GET** `/books/search`

* **Mô tả**:

  * Tìm kiếm sách theo từ khóa áp dụng trên `book_title` và `book_author`.
* **Query params**:

| Tên         | Kiểu   | Bắt buộc | Mô tả                     |
| ----------- | ------ | -------- | ------------------------- |
| `q`         | string | Có       | Từ khóa search            |
| `page`      | int    | Không    | Trang, ≥ 1                |
| `page_size` | int    | Không    | Số sách mỗi trang (1–100) |

* **Response 200**: `BookListResponse`

Ví dụ:

`GET /books/search?q=potter&page=1&page_size=12`

---

### 1.3.5. Chi tiết 1 sách

**GET** `/books/{isbn}`

* **Mô tả**:

  * Lấy đầy đủ metadata của 1 sách từ `books_df`.
* **Path param**:

| Tên    | Kiểu   | Mô tả   |
| ------ | ------ | ------- |
| `isbn` | string | Mã ISBN |

* **Response 200**: `BookItem`
* **Response 404**:

```json
{ "detail": "Không tìm thấy sách." }
```

---

### 1.3.6. Gợi ý sách tương tự (item-item)

**GET** `/books/{isbn}/similar`

* **Mô tả**:

  * Tìm Top-k sách tương tự 1 sách cho trước dựa trên vector latent Q (cosine similarity).
  * Dùng `Q_norm` và similarity score.
* **Path param**:

| Tên    | Kiểu   | Mô tả   |
| ------ | ------ | ------- |
| `isbn` | string | Mã ISBN |

* **Query params**:

| Tên     | Kiểu | Mặc định | Mô tả                   |
| ------- | ---- | -------- | ----------------------- |
| `top_k` | int  | 10       | Số sách tương tự (1–50) |

* **Response 200**: `SimilarBooksResponse` (trong đó `items[].predicted_rating = similarity`).
* **Response 404**:

```json
{ "detail": "ISBN không tồn tại trong tập train MF." }
```

---

### 1.3.7. Gợi ý sách cho user (user-based via MF)

**GET** `/users/{user_id}/recommendations`

* **Mô tả**:

  * Gợi ý Top-k sách cho một user bằng mô hình MF (user-item).
  * Chỉ hoạt động với user có trong tập train MF.
* **Path param**:

| Tên       | Kiểu | Mô tả                             |
| --------- | ---- | --------------------------------- |
| `user_id` | int  | ID user (user trong tập train MF) |

* **Query params**:

| Tên     | Kiểu | Mặc định | Mô tả                |
| ------- | ---- | -------- | -------------------- |
| `top_k` | int  | 10       | Số sách gợi ý (1–50) |

* **Response 200**: `RecommendResponse` (items: `Recommendation` với `predicted_rating` là rating dự đoán).
* **Response 404**:

```json
{ "detail": "User không tồn tại trong tập train MF." }
```

---

### 1.3.8. Dự đoán rating cho (user, sách)

**POST** `/predict`

* **Mô tả**:

  * Dự đoán điểm rating mà một user sẽ cho một cuốn sách.
  * Dùng cùng MF model với endpoint `/users/{user_id}/recommendations`.
* **Request body**: `PredictRequest`

```jsonc
{
  "user_id": 123456,
  "isbn": "034545104X"
}
```

* **Response 200**: `PredictResponse`
* **Response 404**:

  * User không tồn tại trong train MF.
  * ISBN không tồn tại trong train MF.

---

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

