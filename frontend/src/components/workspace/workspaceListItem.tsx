import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerIcon } from '../ui/icons';

interface WorkspaceListItemProps {
  id: string;
  children: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

export const WorkspaceListItem = ({ id, children, isSelected = false, onClick }: WorkspaceListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handleClick = (e: React.MouseEvent) => {
    // ドラッグハンドルをクリックした場合は選択しない
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
      return;
    }
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={{ 
        transform: CSS.Transform.toString(transform), 
        transition,
        zIndex: isDragging ? 9999 : 'auto',
        position: isDragging ? 'relative' : 'static'
      }}
      className={`p-2 border rounded-lg mb-1 flex items-center justify-between cursor-pointer transition-colors ${
        isDragging 
          ? 'shadow-lg opacity-80 border-gray-300 bg-white' 
          : isSelected
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <span className="flex-1">{children}</span>
      <span
        {...attributes}
        {...listeners}
        data-drag-handle
        className={`p-1 ml-2 flex items-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        aria-label="ドラッグして並べ替え"
        style={{ zIndex: isDragging ? 10000 : 'auto' }}
      >
        <HamburgerIcon />
      </span>
    </div>
  );
};
