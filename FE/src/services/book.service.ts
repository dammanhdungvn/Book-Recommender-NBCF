import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  BookItem,
  BookListResponse,
  CatalogFilters,
  SearchParams,
  SimilarBooksResponse,
} from '../types';

export const bookService = {
  /**
   * Get paginated book catalog with filters
   */
  async getBooks(filters?: CatalogFilters): Promise<BookListResponse> {
    return apiService.get<BookListResponse>(API_ENDPOINTS.BOOKS, filters as Record<string, unknown>);
  },

  /**
   * Search books by title or author
   */
  async searchBooks(params: SearchParams): Promise<BookListResponse> {
    return apiService.get<BookListResponse>(API_ENDPOINTS.BOOKS_SEARCH, params as unknown as Record<string, unknown>);
  },

  /**
   * Get book details by ISBN
   */
  async getBookDetail(isbn: string): Promise<BookItem> {
    return apiService.get<BookItem>(API_ENDPOINTS.BOOK_DETAIL(isbn));
  },

  /**
   * Get similar books for a given book
   */
  async getSimilarBooks(isbn: string, topK: number = 10): Promise<SimilarBooksResponse> {
    return apiService.get<SimilarBooksResponse>(API_ENDPOINTS.BOOK_SIMILAR(isbn), { top_k: topK });
  },
};

