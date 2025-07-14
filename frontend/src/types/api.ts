// 共通のAPIレスポンス型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// エラーレスポンス型
export interface ApiError {
  message: string;
  code?: string;
}
