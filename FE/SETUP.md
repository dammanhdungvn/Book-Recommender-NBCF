# Hướng dẫn Setup Dự án Book Recommender

## ✅ Hoàn thành

Dự án đã được xây dựng hoàn chỉnh với các tính năng sau:

### 🎯 Tính năng chính
- ✅ Trang chủ với Hero section đẹp mắt
- ✅ Danh mục sách với phân trang, lọc, sắp xếp
- ✅ Tìm kiếm sách theo tên/tác giả
- ✅ Chi tiết sách với sách tương tự
- ✅ Gợi ý sách cá nhân hóa cho user demo
- ✅ Dự đoán rating cho user-book pair
- ✅ Header với User Demo selector
- ✅ Responsive design
- ✅ Loading states và error handling
- ✅ Modern UI với Tailwind CSS

### 🛠️ Tech Stack
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS 3

## 📝 Các bước Setup

### 1. Cài đặt Dependencies (Đã hoàn thành)
```bash
npm install
```

### 2. Tạo file .env

**QUAN TRỌNG:** Bạn cần tạo file `.env` trong thư mục gốc của dự án với nội dung sau:

```env
VITE_API_BASE_URL=https://alla-designatory-griselda.ngrok-free.dev
```

Hoặc thay thế bằng URL API của bạn.

**Cách tạo file .env:**

#### Trên Windows:
1. Mở Notepad hoặc text editor
2. Paste nội dung: `VITE_API_BASE_URL=https://alla-designatory-griselda.ngrok-free.dev`
3. Save As -> chọn "All Files" -> đặt tên `.env` (có dấu chấm ở đầu)
4. Lưu vào thư mục gốc của dự án (cùng cấp với package.json)

#### Trên macOS/Linux:
```bash
echo "VITE_API_BASE_URL=https://alla-designatory-griselda.ngrok-free.dev" > .env
```

### 3. Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 4. Build cho Production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`

### 5. Preview Production Build

```bash
npm run preview
```

## 🎨 Cấu trúc dự án

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── books/           # Book components
│   └── layout/          # Layout components
├── contexts/            # React contexts
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript types
├── config/              # Configuration
└── App.tsx             # Main app
```

## 🔧 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📱 Các trang trong ứng dụng

1. **Home** (`/`) - Trang chủ
2. **Catalog** (`/books`) - Danh mục sách
3. **Search** (`/search?q=...`) - Tìm kiếm
4. **Book Detail** (`/books/:isbn`) - Chi tiết sách
5. **Recommendations** (`/users/:userId/recommendations`) - Gợi ý cho user

## 🚨 Lưu ý quan trọng

1. **File .env**: Đây là file quan trọng nhất để kết nối với API. Không có file này, ứng dụng sẽ không hoạt động.

2. **CORS**: Đảm bảo API backend đã enable CORS cho domain của frontend.

3. **API URL**: Nếu API backend thay đổi URL, cập nhật file `.env`.

## 🎯 Test ứng dụng

1. Chạy `npm run dev`
2. Mở `http://localhost:5173`
3. Click vào dropdown "Chọn User Demo" ở header
4. Chọn một user demo
5. Click "Xem gợi ý cho bạn" hoặc explore các trang khác

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra file `.env` đã được tạo chưa
2. Kiểm tra API backend có đang chạy không
3. Kiểm tra console trong browser để xem lỗi
4. Kiểm tra terminal để xem lỗi build/compile

## ✨ Tính năng nổi bật

### 1. User Demo Selector
- Dropdown đẹp mắt với thông tin chi tiết
- Hiển thị số ratings, avg rating, top categories
- Banner hiển thị user đã chọn

### 2. Book Cards
- Hiển thị ảnh, tên, tác giả, rating
- Hover effect mượt mà
- Responsive grid layout

### 3. Filters & Sort
- Lọc theo thể loại, ngôn ngữ
- Sắp xếp theo popularity, rating, year
- Active filters hiển thị rõ ràng

### 4. Search
- Debounce search để tối ưu performance
- Highlight từ khóa (có thể thêm)
- Pagination cho kết quả

### 5. Book Detail
- Thông tin đầy đủ về sách
- Dự đoán rating nếu đã chọn user
- Similar books với similarity score

### 6. Recommendations
- Top-N recommendations
- Predicted rating cho từng sách
- Badge cho top 3 recommendations

## 🎨 Customization

### Thay đổi màu sắc chính

Chỉnh sửa `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi màu ở đây
        500: '#ef4444',
        600: '#dc2626',
        // ...
      },
    },
  },
}
```

### Thêm animations

Thêm vào `tailwind.config.js`:

```js
animation: {
  'your-animation': 'yourKeyframes 1s ease-in-out',
},
keyframes: {
  yourKeyframes: {
    '0%': { /* ... */ },
    '100%': { /* ... */ },
  },
},
```

## 🚀 Next Steps

- [ ] Thêm authentication (nếu cần)
- [ ] Thêm user favorites/bookmarks
- [ ] Thêm review/rating functionality
- [ ] Thêm social sharing
- [ ] Thêm dark mode
- [ ] Optimize images (lazy loading, webp)
- [ ] Add PWA support
- [ ] Add analytics

---

**Happy Coding! 🎉**

