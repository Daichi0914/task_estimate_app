import { apiClient } from '@/lib/api-client';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '@/types/auth';

export const authApi = {
  // ログイン
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse, LoginRequest>('/login', data);
  },

  // サインアップ
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return apiClient.post<SignupResponse, SignupRequest>('/signup', data);
  },
}; 
