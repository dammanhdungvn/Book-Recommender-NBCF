
# 1. ĐẶC TẢ API – BOOK RECOMMENDER SERVICE

## 1.1. Tổng quan

* **Mục đích**: Cung cấp các API phục vụ hệ thống gợi ý sách dựa trên:

  * Mô hình Matrix Factorization (MF – SVD-style) trên dữ liệu `Preprocessed_data.csv`.
  * Metadata sách (title, author, publisher, category, language, hình ảnh, summary, thống kê rating).
* **Base URL**: tùy môi trường, ví dụ:

  * Dev (Colab + ngrok): `https://<ngrok-subdomain>.ngrok-free.dev`
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
