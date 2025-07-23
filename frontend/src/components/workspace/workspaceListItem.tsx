import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerIcon } from '../ui/icons';

const WorkspaceListItem = ({ id, children }: { id: string; children: ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ 
        transform: CSS.Transform.toString(transform), 
        transition,
        zIndex: isDragging ? 9999 : 'auto',
        position: isDragging ? 'relative' : 'static'
      }}
      className={`p-2 border border-gray-300 rounded-lg mb-1 bg-white flex items-center justify-between cursor-pointer ${
        isDragging ? 'shadow-lg opacity-80' : ''
      }`}
    >
      <span>{children}</span>
      <span
        {...attributes}
        {...listeners}
        className={`p-1 ml-2 flex items-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        aria-label="ドラッグして並べ替え"
        style={{ zIndex: isDragging ? 10000 : 'auto' }}
      >
        <HamburgerIcon />
      </span>
    </div>
  );
};

export default WorkspaceListItem;
