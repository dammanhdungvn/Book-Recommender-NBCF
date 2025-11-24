# Book Recommender - Frontend

Hệ thống gợi ý sách thông minh sử dụng Machine Learning (Matrix Factorization) để đưa ra những gợi ý sách phù hợp nhất với người dùng.

## 🚀 Tính năng

- **Danh mục sách**: Duyệt qua hàng ngàn đầu sách với phân trang, lọc theo thể loại, ngôn ngữ và sắp xếp theo nhiều tiêu chí
- **Tìm kiếm thông minh**: Tìm kiếm sách theo tên hoặc tác giả
- **Chi tiết sách**: Xem thông tin đầy đủ về sách bao gồm mô tả, đánh giá, và các sách tương tự
- **Gợi ý cá nhân hóa**: Nhận gợi ý sách dựa trên sở thích của user demo
- **Dự đoán rating**: Xem điểm đánh giá dự đoán cho từng cuốn sách

## 🛠️ Công nghệ sử dụng

- **React 19** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📋 Yêu cầu

- Node.js >= 16.x
- npm hoặc yarn

## 🚀 Cài đặt & Chạy

### 1. Clone repository và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc và thêm URL của API backend:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

Ví dụ:
```env
VITE_API_BASE_URL=https://alla-designatory-griselda.ngrok-free.dev
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đang được sử dụng).

### 4. Build cho production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`.

### 5. Preview production build

```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # UI components
│   ├── ui/             # Base UI components (Button, Input, Loading...)
│   ├── books/          # Book-related components (BookCard, Pagination)
│   └── layout/         # Layout components (Header, Footer, Layout)
├── contexts/           # React contexts (UserContext)
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   ├── SearchPage.tsx
│   ├── BookDetailPage.tsx
│   └── RecommendationsPage.tsx
├── services/           # API services
│   ├── api.service.ts
│   ├── book.service.ts
│   └── user.service.ts
├── types/              # TypeScript types
├── config/             # Configuration files
└── App.tsx            # Main App component
```

## 🎨 Tính năng UI/UX

- **Responsive Design**: Hoạt động tốt trên mọi kích thước màn hình
- **Loading States**: Skeleton loading cho trải nghiệm mượt mà
- **Error Handling**: Xử lý lỗi thân thiện với người dùng
- **Animations**: Smooth transitions và animations
- **Modern Design**: UI đẹp mắt với Tailwind CSS

## 📖 Hướng dẫn sử dụng

### Chọn User Demo

1. Click vào dropdown "Chọn User Demo" ở header
2. Chọn một user từ danh sách
3. Hệ thống sẽ hiển thị banner với thông tin user đã chọn

### Xem gợi ý cho User

1. Sau khi chọn user, click vào "Xem gợi ý cho bạn" hoặc banner
2. Xem danh sách sách được gợi ý với điểm dự đoán

### Tìm kiếm sách

1. Nhập từ khóa vào ô tìm kiếm ở header
2. Nhấn Enter hoặc click icon tìm kiếm
3. Xem kết quả tìm kiếm với phân trang

### Lọc và sắp xếp

1. Truy cập trang "Danh mục sách"
2. Sử dụng bộ lọc theo thể loại, ngôn ngữ
3. Chọn cách sắp xếp: Phổ biến nhất, Rating cao nhất, Mới nhất

### Xem chi tiết sách

1. Click vào bất kỳ card sách nào
2. Xem thông tin đầy đủ, mô tả, đánh giá
3. Nếu đã chọn user, xem điểm dự đoán rating
4. Khám phá các sách tương tự

## 🔧 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📝 API Endpoints được sử dụng

- `GET /health` - Health check
- `GET /demo/users` - Danh sách user demo
- `GET /books` - Danh sách sách (có phân trang, filter, sort)
- `GET /books/search` - Tìm kiếm sách
- `GET /books/{isbn}` - Chi tiết sách
- `GET /books/{isbn}/similar` - Sách tương tự
- `GET /users/{user_id}/recommendations` - Gợi ý cho user
- `POST /predict` - Dự đoán rating

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Vui lòng tạo pull request hoặc issue nếu bạn có đề xuất.

## 📄 License

MIT License

## 👨‍💻 Author

Developed with ❤️ by dammanhdungvn
