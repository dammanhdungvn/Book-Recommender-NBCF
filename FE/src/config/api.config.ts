export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://alla-designatory-griselda.ngrok-free.dev';

// Debug: Log API URL
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

export const API_ENDPOINTS = {
  HEALTH: '/health',
  DEMO_USERS: '/demo/users',
  BOOKS: '/books',
  BOOKS_SEARCH: '/books/search',
  BOOK_DETAIL: (isbn: string) => `/books/${isbn}`,
  BOOK_SIMILAR: (isbn: string) => `/books/${isbn}/similar`,
  USER_RECOMMENDATIONS: (userId: number) => `/users/${userId}/recommendations`,
  PREDICT: '/predict',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_TOP_K = 10;

