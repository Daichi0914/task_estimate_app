import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerIcon } from '../ui/icons';

const WorkspaceListItem = ({ id, children }: { id: string; children: ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-2 border border-gray-300 rounded-lg mb-1 bg-white flex items-center justify-between cursor-pointer"
    >
      <span>{children}</span>
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 ml-2 flex items-center"
        aria-label="ドラッグして並べ替え"
      >
        <HamburgerIcon />
      </span>
    </div>
  );
};

export default WorkspaceListItem;
