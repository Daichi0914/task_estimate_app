import { apiClient } from '@/lib/api-client';
import type { User, CreateUserRequest } from '@/types/user';

// バックエンドのレスポンス形式に合わせた型
interface UsersResponse {
  users: User[];
}

export const usersApi = {
  // ユーザー一覧取得
  async getUsers(): Promise<UsersResponse> {
    return apiClient.get<UsersResponse>('/users');
  },

//   // ユーザー詳細取得
//   async getUser(id: string): Promise<User> {
//     return apiClient.get<User>(`/users/${id}`);
//   },

  // ユーザー作成
  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User, CreateUserRequest>('/users', data);
  },

//   // ユーザー更新
//   async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
//     return apiClient.put<User>(`/users/${id}`, data);
//   },

//   // ユーザー削除
//   async deleteUser(id: string): Promise<void> {
//     return apiClient.delete<void>(`/users/${id}`);
//   },
};
