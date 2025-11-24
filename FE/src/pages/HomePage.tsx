import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts';

export const HomePage: React.FC = () => {
  const { selectedUser } = useUser();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl overflow-hidden mb-12">
        <div className="px-8 py-16 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 animate-slide-up">
              Khám phá thế giới sách cùng AI
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Hệ thống gợi ý sách thông minh sử dụng Machine Learning để tìm những cuốn sách phù hợp nhất với bạn
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/books" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Khám phá ngay
              </Link>
              {selectedUser && (
                <Link
                  to={`/users/${selectedUser.user_id}/recommendations`}
                  className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white"
                >
                  Xem gợi ý cho bạn
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tìm kiếm thông minh</h3>
            <p className="text-gray-600">
              Tìm kiếm sách theo tên, tác giả với kết quả chính xác và nhanh chóng
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gợi ý cá nhân hóa</h3>
            <p className="text-gray-600">
              Nhận gợi ý sách dựa trên sở thích và lịch sử đánh giá của bạn
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sách tương tự</h3>
            <p className="text-gray-600">
              Khám phá những cuốn sách tương tự với sách bạn yêu thích
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-100 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Cách hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chọn User Demo</h3>
            <p className="text-sm text-gray-600">Chọn một user demo từ danh sách</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phân tích sở thích</h3>
            <p className="text-sm text-gray-600">Hệ thống phân tích lịch sử đánh giá</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI gợi ý</h3>
            <p className="text-sm text-gray-600">Matrix Factorization đưa ra gợi ý</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Khám phá</h3>
            <p className="text-sm text-gray-600">Tìm những cuốn sách phù hợp nhất</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sẵn sàng khám phá?</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Bắt đầu hành trình tìm kiếm cuốn sách hoàn hảo của bạn ngay hôm nay
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/books" className="btn-primary text-lg">
            Xem danh mục sách
          </Link>
        </div>
      </div>
    </div>
  );
};

