import { useAtom } from 'jotai';
import { tasksAtom } from '@/jotai/atoms/taskAtom';
import { Task, TaskStatus, CreateTaskRequest } from '@/types/task';

export const useTask = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);

  // 選択されたワークスペースのタスクを取得
  const getTasksByWorkspace = (workspaceId: string) => {
    return tasks.filter((task) => task.workspaceId === workspaceId);
  };

  // 特定のステータスのタスクを取得
  const getTasksByStatus = (workspaceId: string, status: TaskStatus) => {
    return getTasksByWorkspace(workspaceId)
      .filter((task) => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  // タスクを作成
  const createTask = (request: CreateTaskRequest) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: request.title,
      description: request.description,
      status: request.status,
      workspaceId: request.workspaceId,
      order:
        tasks.filter((t) => t.workspaceId === request.workspaceId && t.status === request.status)
          .length + 1,
      estimatedHours: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  // タスクを更新
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
      );
      
      // 順序が更新された場合、同じステータスのタスクを再ソート
      if (updates.order !== undefined || updates.status !== undefined) {
        const targetTask = updatedTasks.find(t => t.id === taskId);
        if (targetTask) {
          const sameStatusTasks = updatedTasks
            .filter(t => t.status === targetTask.status)
            .sort((a, b) => a.order - b.order);
          
          // 順序を正規化（1, 2, 3...）
          const normalizedTasks = sameStatusTasks.map((task, index) => ({
            ...task,
            order: index + 1
          }));
          
          return updatedTasks.map(task => {
            const normalizedTask = normalizedTasks.find(nt => nt.id === task.id);
            return normalizedTask || task;
          });
        }
      }
      
      return updatedTasks;
    });
  };

  // タスクを削除
  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    getTasksByWorkspace,
    getTasksByStatus,
    createTask,
    updateTask,
    deleteTask,
  };
};
