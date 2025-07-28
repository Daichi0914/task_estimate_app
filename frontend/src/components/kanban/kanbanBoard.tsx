import { FC, useState } from 'react';
import { useSelectedWorkspace } from '@/hooks/useSelectedWorkspace';
import { KanbanColumn } from '@/components/kanban/kanbanColumn';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { useTask } from '@/hooks/useTask';
import { TaskStatus, Task } from '@/types/task';

export const KanbanBoard: FC = () => {
  const { selectedWorkspace } = useSelectedWorkspace();
  const { updateTask, tasks } = useTask();
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    // 同じタスクにドロップした場合は何もしない
    if (active.id === over.id) {
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // ドロップ先がカラムかタスクかを判定
    const isOverColumn = overId.includes('column-');

    if (isOverColumn) {
      // カラムの空の部分にドロップ
      const newStatus = getStatusFromContainerId(overId);
      if (newStatus) {
        // カラムの最後に追加
        const sameStatusTasks = tasks.filter(t => t.status === newStatus).sort((a, b) => a.order - b.order);
        const maxOrder = sameStatusTasks.length > 0 ? Math.max(...sameStatusTasks.map(t => t.order)) : 0;
        updateTask(taskId, { status: newStatus, order: maxOrder + 1 });
      }
    } else {
      // タスクにドロップ
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) {
        const activeTask = tasks.find(t => t.id === active.id);
        
        if (activeTask && activeTask.status === overTask.status) {
          // 同じカラム内での並べ替え
          const sameStatusTasks = tasks.filter(t => t.status === overTask.status).sort((a, b) => a.order - b.order);
          const activeIndex = sameStatusTasks.findIndex(t => t.id === active.id);
          const overIndex = sameStatusTasks.findIndex(t => t.id === over.id);
          
          // 新しい順序を計算
          let newOrder: number;
          if (activeIndex < overIndex) {
            // 下に移動する場合
            if (overIndex === sameStatusTasks.length - 1) {
              // 最後のタスクの後
              newOrder = overTask.order + 1;
            } else {
              // 中間に挿入
              const nextTask = sameStatusTasks[overIndex + 1];
              newOrder = (overTask.order + nextTask.order) / 2;
            }
          } else {
            // 上に移動する場合
            if (overIndex === 0) {
              // 最初のタスクの前
              newOrder = overTask.order - 1;
            } else {
              // 中間に挿入
              const prevTask = sameStatusTasks[overIndex - 1];
              newOrder = (prevTask.order + overTask.order) / 2;
            }
          }
          
          updateTask(taskId, { order: newOrder });
        } else {
          // 異なるカラム間の移動
          const targetStatus = overTask.status;
          const sameStatusTasks = tasks.filter(t => t.status === targetStatus).sort((a, b) => a.order - b.order);
          const overTaskIndex = sameStatusTasks.findIndex(t => t.id === overTask.id);
          
          // 新しい順序を計算（タスクの前後に挿入）
          let newOrder: number;
          if (overTaskIndex === 0) {
            // 最初のタスクの前
            newOrder = overTask.order - 1;
          } else if (overTaskIndex === sameStatusTasks.length - 1) {
            // 最後のタスクの後
            newOrder = overTask.order + 1;
          } else {
            // 中間のタスクの前後に挿入
            const prevTask = sameStatusTasks[overTaskIndex - 1];
            newOrder = (prevTask.order + overTask.order) / 2;
          }
          
          updateTask(taskId, { status: targetStatus, order: newOrder });
        }
      }
    }
  };

  const getStatusFromContainerId = (containerId: string): TaskStatus | null => {
    if (containerId.includes('column-TODO')) return 'TODO';
    if (containerId.includes('column-IN_PROGRESS')) return 'IN_PROGRESS';
    if (containerId.includes('column-PAUSE')) return 'PAUSE';
    if (containerId.includes('column-DONE')) return 'DONE';
    return null;
  };

  if (!selectedWorkspace) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        ワークスペースを選択してください
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col p-6 bg-gray-50 h-full">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">{selectedWorkspace.name}</h1>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-6 min-h-0 overflow-hidden">
          {/* TODO列 */}
          <div className="col-span-1 min-h-0">
            <KanbanColumn status="TODO" workspaceId={selectedWorkspace.id} />
          </div>

          {/* In Progress列 */}
          <div className="col-span-1 min-h-0">
            <KanbanColumn status="IN_PROGRESS" workspaceId={selectedWorkspace.id} />
          </div>

          {/* Done列 */}
          <div className="col-span-1 min-h-0">
            <KanbanColumn status="DONE" workspaceId={selectedWorkspace.id} />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="flex gap-2 justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-lg opacity-90 rotate-3 cursor-grabbing">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-2">{activeTask.title}</h4>
              {activeTask.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activeTask.description}</p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <span>完了予定: {new Date(activeTask.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-1">
              <div className="w-4 h-4 text-gray-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
