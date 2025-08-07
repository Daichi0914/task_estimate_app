import { FC, useState, MouseEvent } from 'react';
import { Task } from '@/types/task';
import { MoreVerticalIcon } from '../ui/icons';
import { TaskDetailModal } from './taskDetailModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface KanbanCardProps {
  task: Task;
  id: string;
}

export const KanbanCard: FC<KanbanCardProps> = ({ task, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { isOver } = useDroppable({ id: `drop-${id}` });


  const handleMenuClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={`flex gap-2 justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        } ${isOver ? 'border-blue-400 bg-blue-50' : ''}`}
        {...attributes}
        {...listeners}
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <span>完了予定: {new Date(task.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleMenuClick}
          className="p-1 rounded hover:bg-gray-100 transition-colors z-10 cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreVerticalIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <TaskDetailModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
