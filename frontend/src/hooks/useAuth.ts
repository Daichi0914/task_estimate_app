import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { LoginRequest, SignupRequest } from '@/types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  // ログイン
  const login = useCallback(async (data: LoginRequest) => {
    return handleAsyncOperation(
      async () => {
        const response = await authApi.login(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user_id);
        router.push('/');
        return response;
      },
      'ログインに失敗しました'
    );
  }, [handleAsyncOperation, router]);

  // サインアップ
  const signup = useCallback(async (data: SignupRequest) => {
    return handleAsyncOperation(
      async () => {
        const response = await authApi.signup(data);
        router.push('/login?fromSignup=true');
        return response;
      },
      'アカウント作成に失敗しました'
    );
  }, [handleAsyncOperation, router]);

  return {
    loading,
    error,
    clearError,
    login,
    signup,
  };
};
