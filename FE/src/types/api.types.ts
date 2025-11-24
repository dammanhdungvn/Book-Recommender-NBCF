export interface ApiError {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export const LoadingState = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
} as const;

export type LoadingStateType = typeof LoadingState[keyof typeof LoadingState];

