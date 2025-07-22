import { useCallback, useEffect } from 'react';
import { workspacesApi } from '@/lib/api/workspaces';
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from '@/types/workspace';
import { useAtom, useSetAtom } from 'jotai';
import { workspacesAtom } from '@/jotai/atoms/workspaceAtom';
import { useAsyncOperation } from './useAsyncOperation';

export const useWorkspace = () => {
  const [workspaces] = useAtom(workspacesAtom);
  const setWorkspacesOnly = useSetAtom(workspacesAtom);
  const { loading: isLoading, error, clearError, handleAsyncOperation } = useAsyncOperation();

  const fetchWorkspaces = useCallback(async () => {
    return handleAsyncOperation(async () => {
      const response = await workspacesApi.getWorkspaces();
      setWorkspacesOnly(response.data);
      return response.data;
    });
  }, [handleAsyncOperation, setWorkspacesOnly]);

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const newWorkspace = await workspacesApi.createWorkspace(data);
        await fetchWorkspaces();
        return newWorkspace;
      });
    },
    [handleAsyncOperation, fetchWorkspaces]
  );

  const updateWorkspace = useCallback(
    async (id: string, data: UpdateWorkspaceRequest) => {
      return handleAsyncOperation(async () => {
        const updatedWorkspace = await workspacesApi.updateWorkspace(id, data);
        await fetchWorkspaces();
        return updatedWorkspace;
      });
    },
    [handleAsyncOperation, fetchWorkspaces]
  );

  const deleteWorkspace = useCallback(
    async (id: string) => {
      return handleAsyncOperation(async () => {
        await workspacesApi.deleteWorkspace(id);
        await fetchWorkspaces();
      });
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
    saveWorkspaceOrder,
  };
};
