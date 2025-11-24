import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services';
import { BookCard, ErrorMessage, EmptyState } from '../components';
import { useUser } from '../contexts';
import type { RecommendResponse } from '../types';
import { SkeletonList } from '../components/ui/Loading';

export const RecommendationsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { selectedUser, setSelectedUser, demoUsers } = useUser();

  const [data, setData] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const uid = parseInt(userId, 10);
      
      // Update selected user if not already set
      if (!selectedUser || selectedUser.user_id !== uid) {
        const user = demoUsers.find((u) => u.user_id === uid);
        if (user) {
          setSelectedUser(user);
        }
      }

      loadRecommendations(uid);
    }
  }, [userId]);

  const loadRecommendations = async (uid: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserRecommendations(uid, 20);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải gợi ý');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User không hợp lệ</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-3 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gợi ý cho User {userId}</h1>
            {selectedUser && (
              <p className="text-gray-600">
                {selectedUser.n_ratings} ratings • Avg: {selectedUser.avg_rating.toFixed(1)}/10 •{' '}
                {selectedUser.top_categories.slice(0, 3).join(', ')}
              </p>
            )}
          </div>
        </div>
        <p className="text-gray-600">
          Những cuốn sách được hệ thống dự đoán bạn sẽ thích nhất
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Gợi ý được cá nhân hóa</h3>
            <p className="text-sm text-blue-800">
              Các cuốn sách dưới đây được sắp xếp theo điểm dự đoán từ cao đến thấp. 
              Điểm dự đoán cho biết hệ thống nghĩ bạn sẽ đánh giá sách này như thế nào.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonList count={8} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => loadRecommendations(parseInt(userId, 10))} />
      ) : data && data.items.length === 0 ? (
        <EmptyState message="Chưa có gợi ý nào cho user này." />
      ) : data ? (
        <>
          <div className="mb-4 text-gray-600">
            Tìm thấy <strong>{data.items.length}</strong> gợi ý
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((item, index) => (
              <div key={item.isbn} className="relative">
                <BookCard book={item} showPrediction />
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

