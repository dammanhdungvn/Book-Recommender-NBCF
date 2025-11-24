export interface BookItem {
  isbn: string;
  book_title: string;
  book_author: string;
  publisher: string;
  language: string;
  category: string;
  year_of_publication: number;
  img_s: string;
  img_m: string;
  img_l: string;
  summary: string;
  rating_count: number;
  rating_mean: number;
}

export interface BookListResponse {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  items: BookItem[];
}

export interface Recommendation {
  isbn: string;
  book_title: string;
  book_author: string;
  publisher: string;
  language: string;
  category: string;
  predicted_rating: number;
  img_s: string;
  img_m: string;
}

export interface RecommendResponse {
  user_id: number;
  top_k: number;
  items: Recommendation[];
}

export interface PredictRequest {
  user_id: number;
  isbn: string;
}

export interface PredictResponse {
  user_id: number;
  isbn: string;
  predicted_rating: number;
}

export interface SimilarBooksResponse {
  isbn: string;
  top_k: number;
  items: Recommendation[];
}

export interface DemoUser {
  user_id: number;
  n_ratings: number;
  avg_rating: number;
  top_categories: string[];
}

export interface CatalogFilters {
  page?: number;
  page_size?: number;
  category?: string;
  language?: string;
  sort_by?: 'popularity' | 'rating' | 'year';
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  q: string;
  page?: number;
  page_size?: number;
}

