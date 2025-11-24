import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService, userService } from '../services';
import { BookCard, Loading, ErrorMessage } from '../components';
import { useUser } from '../contexts';
import type { BookItem, SimilarBooksResponse, PredictResponse } from '../types';

export const BookDetailPage: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const { selectedUser } = useUser();

  const [book, setBook] = useState<BookItem | null>(null);
  const [similarBooks, setSimilarBooks] = useState<SimilarBooksResponse | null>(null);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    if (isbn) {
      loadBookDetail();
    }
  }, [isbn]);

  useEffect(() => {
    if (isbn && book && selectedUser) {
      loadPrediction();
    }
  }, [isbn, book, selectedUser]);

  const loadBookDetail = async () => {
    if (!isbn) return;

    try {
      setLoading(true);
      setError(null);

      // Load book detail
      const bookData = await bookService.getBookDetail(isbn);
      setBook(bookData);

      // Load similar books in parallel
      setLoadingSimilar(true);
      try {
        const similarData = await bookService.getSimilarBooks(isbn, 10);
        setSimilarBooks(similarData);
      } catch (err) {
        console.error('Error loading similar books:', err);
      } finally {
        setLoadingSimilar(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin sách');
    } finally {
      setLoading(false);
    }
  };

  const loadPrediction = async () => {
    if (!isbn || !selectedUser) return;

    try {
      setLoadingPrediction(true);
      const predictionData = await userService.predictRating({
        user_id: selectedUser.user_id,
        isbn: isbn,
      });
      setPrediction(predictionData);
    } catch (err) {
      console.error('Error loading prediction:', err);
      setPrediction(null);
    } finally {
      setLoadingPrediction(false);
    }
  };

  if (loading) {
    return <Loading text="Đang tải thông tin sách..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadBookDetail} />;
  }

  if (!book) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sách</h2>
        <Link to="/" className="btn-primary">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </button>

      {/* Book Detail */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {/* Book Image */}
          <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
            <img
              src={book.img_l || book.img_m}
              alt={book.book_title}
              className="max-w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.book_title}</h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <span className="text-gray-600">Tác giả: </span>
                  <span className="font-semibold text-gray-900">{book.book_author}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <span className="text-gray-600">Nhà xuất bản: </span>
                  <span className="font-semibold text-gray-900">{book.publisher}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="text-gray-600">Năm xuất bản: </span>
                  <span className="font-semibold text-gray-900">{book.year_of_publication}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <div>
                  <span className="text-gray-600">Ngôn ngữ: </span>
                  <span className="font-semibold text-gray-900 uppercase">{book.language}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <span className="text-gray-600">Thể loại: </span>
                  <span className="font-semibold text-gray-900">
                    {book.category.replace(/[\[\]']/g, '')}
                  </span>
                </div>
              </div>

              {book.rating_count > 0 && (
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-2xl font-bold text-gray-900">{book.rating_mean.toFixed(1)}</span>
                    <span className="text-gray-600">/10</span>
                  </div>
                  <span className="text-gray-500">({book.rating_count} đánh giá)</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {book.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Mô tả</h2>
                <p className="text-gray-700 leading-relaxed">{book.summary}</p>
              </div>
            )}

            {/* Prediction for Selected User */}
            {selectedUser && (
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Dự đoán cho bạn
                </h3>
                {loadingPrediction ? (
                  <p className="text-gray-600">Đang tính toán...</p>
                ) : prediction ? (
                  <p className="text-gray-700">
                    Nếu là <strong>User {selectedUser.user_id}</strong>, hệ thống dự đoán bạn sẽ chấm:{' '}
                    <span className="text-2xl font-bold text-primary-600">{prediction.predicted_rating.toFixed(1)}/10</span>
                  </p>
                ) : (
                  <p className="text-gray-600">Không có dự đoán cho sách này.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Books */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Sách tương tự
        </h2>

        {loadingSimilar ? (
          <Loading text="Đang tải sách tương tự..." />
        ) : similarBooks && similarBooks.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {similarBooks.items.map((item) => (
              <div key={item.isbn} className="relative">
                <BookCard book={item} />
                <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                  Độ tương đồng: {(item.predicted_rating * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Không có sách tương tự.</p>
        )}
      </div>
    </div>
  );
};

