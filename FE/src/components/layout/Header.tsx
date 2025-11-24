import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts';

export const Header: React.FC = () => {
  const { selectedUser, setSelectedUser, demoUsers, loadingUsers, errorUsers } = useUser();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleUserSelect = (user: typeof demoUsers[0]) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    navigate(`/users/${user.user_id}/recommendations`);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/books', label: 'Danh mục sách', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { path: '/search', label: 'Tìm kiếm', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Book Recommender
                </h1>
                <p className="text-xs text-gray-500">Khám phá sách phù hợp với bạn</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Tìm kiếm sách theo tên, tác giả, thể loại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* User Demo Selector */}
            <div className="relative">
              {loadingUsers ? (
                <div className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="hidden lg:inline">Đang tải...</span>
                </div>
              ) : errorUsers ? (
                <div className="px-4 py-2 text-red-600 text-sm bg-red-50 rounded-lg">
                  <span className="hidden lg:inline">⚠️ Lỗi tải users</span>
                  <span className="lg:hidden">⚠️</span>
                </div>
              ) : demoUsers.length > 0 ? (
                <>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                        {selectedUser ? selectedUser.user_id : '?'}
                      </div>
                      {selectedUser && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="text-left hidden lg:block">
                      {selectedUser ? (
                        <>
                          <div className="text-sm font-bold text-gray-900">User #{selectedUser.user_id}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{selectedUser.n_ratings} đánh giá</span>
                            <span className="mx-1">•</span>
                            <span>⭐ {selectedUser.avg_rating.toFixed(1)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-semibold text-blue-900">Chọn User</div>
                          <div className="text-xs text-blue-600">Xem gợi ý cá nhân</div>
                        </>
                      )}
                    </div>
                    
                    {/* Dropdown Icon */}
                    <svg className={`w-4 h-4 text-blue-600 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserDropdown(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                        {/* Dropdown Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                          <h3 className="font-bold text-lg mb-1">👥 Demo Users</h3>
                          <p className="text-xs text-blue-100">Chọn một user để xem gợi ý sách cá nhân hóa</p>
                        </div>
                        
                        {/* User List */}
                        <div className="max-h-[32rem] overflow-y-auto p-3 space-y-2">
                          {Array.isArray(demoUsers) && demoUsers.map((user) => {
                            const isSelected = selectedUser?.user_id === user.user_id;
                            return (
                              <button
                                key={user.user_id}
                                onClick={() => handleUserSelect(user)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md' 
                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Avatar */}
                                  <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                                      isSelected 
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                                    }`}>
                                      {user.user_id}
                                    </div>
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* User Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className={`font-bold text-base ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                        User #{user.user_id}
                                      </h4>
                                      {isSelected && (
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                          Đang chọn
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="flex items-center gap-3 mb-2 text-sm text-gray-700">
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-semibold">{user.n_ratings}</span>
                                        <span className="text-gray-500">ratings</span>
                                      </div>
                                      <span className="text-gray-400">•</span>
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold text-orange-600">{user.avg_rating.toFixed(1)}</span>
                                        <span className="text-gray-500">TB</span>
                                      </div>
                                    </div>
                                    
                                    {/* Top Categories */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {user.top_categories.slice(0, 4).map((cat, idx) => (
                                        <span 
                                          key={idx} 
                                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            isSelected 
                                              ? 'bg-blue-100 text-blue-700' 
                                              : 'bg-gray-200 text-gray-700'
                                          }`}
                                        >
                                          {cat}
                                        </span>
                                      ))}
                                      {user.top_categories.length > 4 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                                          +{user.top_categories.length - 4}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Dropdown Footer */}
                        <div className="border-t border-gray-200 p-3 bg-gray-50">
                          <p className="text-xs text-gray-600 text-center">
                            💡 Chọn user khác nhau để thấy gợi ý sách đa dạng hơn
                          </p>
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
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm kiếm sách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
                    active
                      ? 'text-blue-600 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Recommendations Link - Only show if user is selected */}
            {selectedUser && (
              <Link
                to={`/users/${selectedUser.user_id}/recommendations`}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
                  isActive(`/users/${selectedUser.user_id}/recommendations`)
                    ? 'text-blue-600 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Gợi ý cho tôi</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Selected User Info Banner */}
      {selectedUser && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold border-2 border-white/30">
                  {selectedUser.user_id}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-semibold">
                    Đang xem gợi ý cho User #{selectedUser.user_id}
                  </span>
                  <span className="text-xs text-blue-100">
                    {selectedUser.n_ratings} ratings • Avg {selectedUser.avg_rating.toFixed(1)}/10
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                title="Bỏ chọn user"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
