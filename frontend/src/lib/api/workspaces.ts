import { apiClient } from '../api-client';
import type { Workspace, CreateWorkspaceRequest } from '@/types/workspace';

interface WorkspacesResponse {
  workspaces: Workspace[];
}

export const WorkspacesApi = {
  // ワークスペース一覧取得
  async getWorkspaces(): Promise<WorkspacesResponse> {
    return apiClient.get<WorkspacesResponse>('/workspaces');
  },

  // ワークスペース作成
  async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.post<Workspace, CreateWorkspaceRequest>('/workspaces', data);
  },

  // ワークスペース更新
  async updateWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.put<Workspace, CreateWorkspaceRequest>('/workspaces', data);
  },

  // ワークスペース削除
  async deleteWorkspace(id: string): Promise<void> {
    return apiClient.delete<void>(`/workspaces/${id}`);
  },
};
