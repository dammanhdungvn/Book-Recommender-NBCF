# Hướng dẫn chạy Project

## 1. Backend

Backend được triển khai dưới dạng Google Colab Notebook.

**Cách chạy:**

1. Truy cập Google Colab.
2. Tải/Upload file `BE.ipynb` (hoặc mở trực tiếp từ link bên dưới).
3. Chạy tuần tự toàn bộ các cell trong notebook.
4. Backend sẽ khởi tạo API theo đúng cấu hình trong notebook.

**Link Colab:**  
<https://colab.research.google.com/drive/19gh-lv6bdY4HupmJb29sSFUD0mWYT9xm?usp=sharing>

---

## 2. Frontend

Frontend được xây dựng bằng React + Vite, chạy trên Node.js.

### Chạy trên local

```bash
git clone <repo-url>
cd <tên-thư-mục-dự-án>/FE   # hoặc đúng tên thư mục frontend của bạn
npm install
npm run dev       # chạy ở chế độ development
npm run build     # build project
npm run preview   # chạy bản build để kiểm tra bản build
```

**Link Frontend:** 
<https://book-recommender-nbcf.vercel.app>