import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api.config';
import type { ApiError } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        // Header này để bypass Ngrok warning page
        'ngrok-skip-browser-warning': 'true',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        console.error('API Error:', error);
        
        if (!error.response) {
          // Network error hoặc CORS error
          throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra:\n1. API backend có đang chạy không?\n2. URL trong file .env có đúng không?\n3. CORS đã được enable chưa?');
        }

        const errorMessage = error.response?.data?.detail || error.message || 'Đã xảy ra lỗi';
        throw new Error(errorMessage);
      }
    );

    // Request interceptor để log requests
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();

