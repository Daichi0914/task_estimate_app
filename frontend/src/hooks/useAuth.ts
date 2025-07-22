import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { LoginRequest, SignupRequest } from '@/types/auth';
import { useAsyncOperation } from './useAsyncOperation';

export const useAuth = () => {
  const { loading, error, clearError, handleAsyncOperation } = useAsyncOperation();
  const router = useRouter();

  const login = useCallback(async (data: LoginRequest) => {
    return handleAsyncOperation(
      async () => {
        const response = await authApi.login(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user_id);
        router.push('/');
        return response;
      }
    );
  }, [handleAsyncOperation, router]);

  const signup = useCallback(async (data: SignupRequest) => {
    return handleAsyncOperation(
      async () => {
        const response = await authApi.signup(data);
        router.push('/login?fromSignup=true');
        return response;
      }
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
