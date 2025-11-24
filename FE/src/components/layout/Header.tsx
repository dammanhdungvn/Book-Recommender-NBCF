import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts';
import { Input } from '../ui';

export const Header: React.FC = () => {
  const { selectedUser, setSelectedUser, demoUsers, loadingUsers, errorUsers } = useUser();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserSelect = (user: typeof demoUsers[0]) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    navigate(`/users/${user.user_id}/recommendations`);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                Book Recommender
              </h1>
              <p className="text-xs text-gray-500">Khám phá sách phù hợp với bạn</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-8">
            <Input
              type="search"
              placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </form>

          {/* User Demo Selector */}
          <div className="relative">
            {loadingUsers ? (
              <div className="px-4 py-2 text-gray-500 text-sm">Đang tải users...</div>
            ) : errorUsers ? (
              <div className="px-4 py-2 text-red-500 text-sm">Lỗi tải users</div>
            ) : demoUsers.length > 0 ? (
              <>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
                >
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="text-left hidden lg:block">
                    {selectedUser ? (
                      <>
                        <div className="text-sm font-semibold text-primary-900">User {selectedUser.user_id}</div>
                        <div className="text-xs text-primary-600">{selectedUser.n_ratings} ratings</div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-primary-700">Chọn User Demo</div>
                    )}
                  </div>
                  <svg className={`w-4 h-4 text-primary-600 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Demo Users</h3>
                        <p className="text-xs text-gray-500">Chọn một user để xem gợi ý</p>
                      </div>
                      <div className="p-2">
                        {Array.isArray(demoUsers) && demoUsers.map((user) => (
                          <button
                            key={user.user_id}
                            onClick={() => handleUserSelect(user)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                              selectedUser?.user_id === user.user_id ? 'bg-primary-50 border border-primary-200' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">User {user.user_id}</span>
                              {selectedUser?.user_id === user.user_id && (
                                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {user.n_ratings} ratings • Avg: {user.avg_rating.toFixed(1)}/10
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.top_categories.slice(0, 3).map((cat, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <Input
            type="search"
            placeholder="Tìm kiếm sách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </form>
      </div>

      {/* Selected User Banner */}
      {selectedUser && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>
                Đang xem gợi ý cho <strong>User {selectedUser.user_id}</strong> ({selectedUser.n_ratings} ratings, avg {selectedUser.avg_rating.toFixed(1)})
              </span>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

