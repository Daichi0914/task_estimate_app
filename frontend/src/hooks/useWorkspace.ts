import { useCallback, useEffect, useState } from 'react';
import { workspacesApi } from '@/lib/api';
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from '@/types/workspace';
import { useAtom, useSetAtom } from 'jotai';
import { workspacesAtom } from '@/jotai/atoms/workspaceAtom';

export const useWorkspace = () => {
  const [workspaces] = useAtom(workspacesAtom);
  const setWorkspacesOnly = useSetAtom(workspacesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>, errorMessage: string): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchWorkspaces = useCallback(async () => {
    return handleAsyncOperation(async () => {
      const response = await workspacesApi.getWorkspaces();
      setWorkspacesOnly(response.data);
      return response.data;
    }, 'ワークスペース一覧の取得に失敗しました');
  }, [handleAsyncOperation, setWorkspacesOnly]);

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const newWorkspace = await workspacesApi.createWorkspace(data);
        await fetchWorkspaces();
        return newWorkspace;
      }, 'ワークスペースの作成に失敗しました');
    },
    [handleAsyncOperation, fetchWorkspaces]
  );

  const updateWorkspace = useCallback(
    async (id: string, data: UpdateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const updatedWorkspace = await workspacesApi.updateWorkspace(id, data);
        await fetchWorkspaces();
        return updatedWorkspace;
      }, 'ワークスペースの更新に失敗しました');
    },
    [handleAsyncOperation, fetchWorkspaces]
  );

  const deleteWorkspace = useCallback(
    async (id: string) => {
      return handleAsyncOperation(async () => {
        await workspacesApi.deleteWorkspace(id);
        await fetchWorkspaces();
      }, 'ワークスペースの削除に失敗しました');
    },
    [handleAsyncOperation, fetchWorkspaces]
  );

  const saveWorkspaceOrder = async (orders: { workspace_id: string; sort_order: number }[]) => {
    await workspacesApi.updateWorkspaceOrder(orders);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    isLoading,
    error,
    clearError,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    saveWorkspaceOrder, // 追加
  };
};
