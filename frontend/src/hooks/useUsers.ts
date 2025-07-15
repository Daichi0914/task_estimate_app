import { useState, useCallback, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import type { User, CreateUserRequest } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // エラーをリセット
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 共通のエラーハンドリング関数
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ユーザー一覧取得
  const fetchUsers = useCallback(async () => {
    return handleAsyncOperation(
      async () => {
        const response = await usersApi.getUsers();
        setUsers(response.users);
        return response.users;
      },
      'ユーザー一覧の取得に失敗しました'
    );
  }, [handleAsyncOperation]);

  // ユーザー作成
  const createUser = useCallback(async (data: CreateUserRequest) => {
    return handleAsyncOperation(
      async () => {
        const newUser = await usersApi.createUser(data);
        setUsers(prev => [...prev, newUser]);
        return newUser;
      },
      'ユーザーの作成に失敗しました'
    );
  }, [handleAsyncOperation]);

  // ユーザー更新
  // const updateUser = useCallback(async (id: string, data: UpdateUserRequest) => {
  //   return handleAsyncOperation(
  //     async () => {
  //       const updatedUser = await usersApi.updateUser(id, data);
  //       setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
  //       return updatedUser;
  //     },
  //     'ユーザーの更新に失敗しました'
  //   );
  // }, [handleAsyncOperation]);

  // ユーザー削除
  // const deleteUser = useCallback(async (id: string) => {
  //   return handleAsyncOperation(
  //     async () => {
  //       await usersApi.deleteUser(id);
  //       setUsers(prev => prev.filter(user => user.id !== id));
  //     },
  //     'ユーザーの削除に失敗しました'
  //   );
  // }, [handleAsyncOperation]);

  // 初期データ取得
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    clearError,
    fetchUsers,
    createUser,
    // updateUser,
    // deleteUser,
  };
}; 