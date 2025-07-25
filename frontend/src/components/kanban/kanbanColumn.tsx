import { FC } from 'react';
import { TaskStatus } from '@/types/task';
import { KanbanCard } from '@/components/kanban/kanbanCard';
import { CreateTaskForm } from '@/components/kanban/createTaskForm';
import { useTask } from '@/hooks/useTask';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  status: TaskStatus;
  workspaceId: string;
}

const getStatusConfig = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return {
        title: 'TODO',
        color: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
      };
    case 'IN_PROGRESS':
      return {
        title: 'In Progress',
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
      };
    case 'PAUSE':
      return {
        title: 'Pause',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
      };
    case 'DONE':
      return {
        title: 'Done',
        color: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      };
  }
};

export const KanbanColumn: FC<KanbanColumnProps> = ({ status, workspaceId }) => {
  const config = getStatusConfig(status);
  const { getTasksByStatus } = useTask();
  const { setNodeRef } = useDroppable({
    id: `column-${status}`,
  });

  // 実際のタスクデータを取得
  const tasks = getTasksByStatus(workspaceId, status);

  return (
    <div
      className={`h-full flex flex-col bg-white rounded-lg shadow-sm border ${config.borderColor} overflow-hidden`}
    >
      {/* ヘッダー */}
      <div
        className={`p-4 ${config.color} rounded-t-lg border-b ${config.borderColor} flex-shrink-0`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.textColor}`}>{config.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} ${config.textColor}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* タスクリスト */}
      <div ref={setNodeRef} className={'p-4 overflow-y-auto flex-1 min-h-0'}>
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">タスクがありません</div>
        ) : (
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map((task) => (
                <KanbanCard key={task.id} id={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {status === 'TODO' && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <CreateTaskForm status={status} workspaceId={workspaceId} />
        </div>
      )}
    </div>
  );
};
