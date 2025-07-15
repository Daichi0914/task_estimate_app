import { useCallback, useEffect, useState } from "react";
import { workspacesApi } from "@/lib/api";
import { CreateWorkspaceRequest, UpdateWorkspaceRequest, Workspace } from "@/types/workspace";

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // エラーをリセット
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 共通のエラーハンドリング関数
  const handleAsyncOperation = useCallback(
    async <T>(
      operation: () => Promise<T>,
      errorMessage: string
    ): Promise<T> => {
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

  // ワークスペース一覧取得
  const fetchWorkspaces = useCallback(async () => {
    return handleAsyncOperation(async () => {
      const response = await workspacesApi.getWorkspaces();
      setWorkspaces(response.data);
      return response.data;
    }, "ワークスペース一覧の取得に失敗しました");
  }, [handleAsyncOperation]);

  // ワークスペース作成
  const createWorkspace = useCallback(
    async (data: CreateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const newWorkspace = await workspacesApi.createWorkspace(data);
        setWorkspaces((prev) => [...prev, newWorkspace]);
        return newWorkspace;
      }, "ワークスペースの作成に失敗しました");
    },
    [handleAsyncOperation]
  );

  // ワークスペース更新
  const updateWorkspace = useCallback(
    async (id: string, data: UpdateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const updatedWorkspace = await workspacesApi.updateWorkspace(id, data);
        setWorkspaces((prev) => prev.map((workspace) => workspace.id === id ? updatedWorkspace : workspace));
        return updatedWorkspace;
      }, "ワークスペースの更新に失敗しました");
    },
    [handleAsyncOperation]
  );

  // ワークスペース削除
  const deleteWorkspace = useCallback(
    async (id: string) => {
      return handleAsyncOperation(
        async () => {
          await workspacesApi.deleteWorkspace(id);
          setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id));
        },
        "ワークスペースの削除に失敗しました"
      );
    },
    [handleAsyncOperation]
  );

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
  };
};
