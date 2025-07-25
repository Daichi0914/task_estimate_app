import { apiClient } from '@/lib/api-client';
import type { Workspace, CreateWorkspaceRequest } from '@/types/workspace';

interface WorkspacesResponse {
  data: Workspace[];
}

export const workspacesApi = {
  // ワークスペース一覧取得
  async getWorkspaces(): Promise<WorkspacesResponse> {
    return apiClient.get<WorkspacesResponse>('/workspaces');
  },

  // ワークスペース作成
  async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.post<Workspace, CreateWorkspaceRequest>('/workspaces', data);
  },

  // ワークスペース更新
  async updateWorkspace(id: string, data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.put<Workspace, CreateWorkspaceRequest>(`/workspaces/${id}`, data);
  },

  // ワークスペース削除
  async deleteWorkspace(id: string): Promise<void> {
    return apiClient.delete<void>(`/workspaces/${id}`);
  },

  // 並び順保存
  async updateWorkspaceOrder(orders: { workspace_id: string; sort_order: number }[]): Promise<void> {
    return apiClient.patch<void, { orders: { workspace_id: string; sort_order: number }[] }>(
      '/workspaces/order',
      { orders }
    );
  },
};
