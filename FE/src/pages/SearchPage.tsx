import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services';
import { BookCard, Pagination, ErrorMessage, EmptyState } from '../components';
import type { BookListResponse } from '../types';
import { SkeletonList } from '../components/ui/Loading';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [data, setData] = useState<BookListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      searchBooks();
    }
  }, [query, page]);

  const searchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.searchBooks({
        q: query,
        page,
        page_size: 20,
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tìm kiếm sách');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tìm kiếm sách</h2>
        <p className="text-gray-600">Nhập từ khóa vào ô tìm kiếm để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kết quả tìm kiếm cho: "{query}"
        </h1>
        {data && (
          <p className="text-gray-600">
            Tìm thấy <strong>{data.total_items}</strong> kết quả
          </p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonList count={8} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={searchBooks} />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          message={`Không tìm thấy kết quả cho từ khóa "${query}".`}
          icon={
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      ) : data ? (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((book) => (
              <BookCard key={book.isbn} book={book} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            totalItems={data.total_items}
            pageSize={data.page_size}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </div>
  );
};

