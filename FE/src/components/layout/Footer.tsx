import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">Book Recommender</h3>
            <p className="text-sm">
              Hệ thống gợi ý sách thông minh sử dụng Machine Learning để tìm những cuốn sách phù hợp nhất với bạn.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
              </li>
              <li>
                <a href="/books" className="hover:text-white transition-colors">Danh mục sách</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Công nghệ</h4>
            <p className="text-sm">
              Sử dụng Matrix Factorization (SVD) và Collaborative Filtering để đưa ra gợi ý chính xác.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Book Recommender. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

