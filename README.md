# Hướng dẫn chạy Project

## 1. Backend

Backend được triển khai dưới dạng notebook.

**Cách chạy:**

1. Truy cập Google Colab.
2. Upload file `BE.ipynb`.
3. Chạy tuần tự toàn bộ các cell.
4. Backend sẽ khởi tạo API theo cấu hình trong notebook.
Link colab: "https://colab.research.google.com/drive/19gh-lv6bdY4HupmJb29sSFUD0mWYT9xm?usp=sharing"

## 2. Frontend

Frontend là dự án chạy bằng Node.js.

**Cách chạy:**

```bash
git clone <repo-url>
cd <tên-thư-mục-dự-án>
npm install
npm run dev       # chạy ở chế độ development
npm run build     # build project
npm run preview   # chạy bản build để kiểm tra
```
Link Fe: "https://book-recommender-nbcf.vercel.app/"