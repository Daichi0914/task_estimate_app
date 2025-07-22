import { useState, useCallback } from 'react';

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'エラーが発生しました';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    clearError,
    handleAsyncOperation,
  };
};
