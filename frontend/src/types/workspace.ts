export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceRequest {
  name: string;
}

export interface UpdateWorkspaceRequest {
  name: string;
}
