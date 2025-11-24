import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  DemoUser,
  RecommendResponse,
  PredictRequest,
  PredictResponse,
} from '../types';

export const userService = {
  /**
   * Get list of demo users
   */
  async getDemoUsers(): Promise<DemoUser[]> {
    return apiService.get<DemoUser[]>(API_ENDPOINTS.DEMO_USERS);
  },

  /**
   * Get book recommendations for a user
   */
  async getUserRecommendations(userId: number, topK: number = 10): Promise<RecommendResponse> {
    return apiService.get<RecommendResponse>(
      API_ENDPOINTS.USER_RECOMMENDATIONS(userId),
      { top_k: topK }
    );
  },

  /**
   * Predict rating for a user-book pair
   */
  async predictRating(request: PredictRequest): Promise<PredictResponse> {
    return apiService.post<PredictResponse>(API_ENDPOINTS.PREDICT, request);
  },
};

