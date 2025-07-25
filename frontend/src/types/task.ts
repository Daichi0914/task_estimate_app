export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'PAUSE' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  workspaceId: string;
  order: number;
  estimatedHours?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  workspaceId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  order?: number;
  estimatedHours?: number;
} 