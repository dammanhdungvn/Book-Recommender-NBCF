import React, { useState, useEffect } from 'react';
import { bookService } from '../services';
import { BookCard, Pagination, ErrorMessage, EmptyState, Select } from '../components';
import type { BookListResponse, CatalogFilters } from '../types';
import { SkeletonList } from '../components/ui/Loading';

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'popularity', label: 'Phổ biến nhất' },
  { value: 'rating', label: 'Rating cao nhất' },
  { value: 'year', label: 'Mới nhất' },
];

const ORDER_OPTIONS = [
  { value: 'desc', label: 'Giảm dần' },
  { value: 'asc', label: 'Tăng dần' },
];

export const CatalogPage: React.FC = () => {
  const [data, setData] = useState<BookListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CatalogFilters>({
    page: 1,
    page_size: 20,
    sort_by: undefined,
    order: 'desc',
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBooks(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CatalogFilters['sort_by'];
    setFilters((prev) => ({ ...prev, sort_by: value || undefined, page: 1 }));
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CatalogFilters['order'];
    setFilters((prev) => ({ ...prev, order: value, page: 1 }));
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      category: categoryInput || undefined,
      language: languageInput || undefined,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setCategoryInput('');
    setLanguageInput('');
    setFilters({
      page: 1,
      page_size: 20,
      sort_by: undefined,
      order: 'desc',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh mục sách</h1>
        <p className="text-gray-600">Khám phá hàng ngàn đầu sách tuyệt vời</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Bộ lọc & Sắp xếp
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ví dụ: Fiction, Drama..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ví dụ: en, vi..."
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
            />
          </div>

          <Select
            label="Sắp xếp theo"
            options={SORT_OPTIONS}
            value={filters.sort_by || ''}
            onChange={handleSortChange}
          />

          <Select
            label="Thứ tự"
            options={ORDER_OPTIONS}
            value={filters.order || 'desc'}
            onChange={handleOrderChange}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleApplyFilters} className="btn-primary">
            Áp dụng
          </button>
          <button onClick={handleClearFilters} className="btn-secondary">
            Xóa bộ lọc
          </button>
        </div>

        {/* Active Filters */}
        {(filters.category || filters.language || filters.sort_by) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                Thể loại: {filters.category}
                <button onClick={() => setFilters({ ...filters, category: undefined, page: 1 })}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.language && (
              <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                Ngôn ngữ: {filters.language}
                <button onClick={() => setFilters({ ...filters, language: undefined, page: 1 })}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.sort_by && (
              <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                {SORT_OPTIONS.find((o) => o.value === filters.sort_by)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonList count={8} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadBooks} />
      ) : data && data.items && data.items.length === 0 ? (
        <EmptyState message="Không tìm thấy sách phù hợp với bộ lọc hiện tại." />
      ) : data && data.items ? (
        <>
          {/* Results Info */}
          <div className="mb-4 text-gray-600">
            Tìm thấy <strong>{data.total_items}</strong> cuốn sách
          </div>

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

