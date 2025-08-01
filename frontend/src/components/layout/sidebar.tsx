'use client';

import { FC, useEffect, useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { CreateWorkspaceForm } from '../workspace/createWorkspaceForm';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useSelectedWorkspace } from '@/hooks/useSelectedWorkspace';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { DragEndEvent } from '@dnd-kit/core';
import { WorkspaceListItem } from '../workspace/workspaceListItem';
import debounce from 'lodash.debounce';

export const WorkspaceSidebar: FC = () => {
  const { toggle } = useSidebar();
  const { workspaces, isLoading, saveWorkspaceOrder } = useWorkspace();
  const { selectedWorkspaceId, selectWorkspace } = useSelectedWorkspace();
  const [localWorkspaces, setLocalWorkspaces] = useState(workspaces);

  useEffect(() => {
    setLocalWorkspaces(workspaces);
  }, [workspaces]);

  const debouncedSaveOrder = debounce((orderArr) => {
    saveWorkspaceOrder(orderArr);
  }, 500);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = localWorkspaces.findIndex((w) => w.id === String(active.id));
      const newIndex = localWorkspaces.findIndex((w) => w.id === String(over.id));
      const newArr = arrayMove(localWorkspaces, oldIndex, newIndex);
      setLocalWorkspaces(newArr);
      const orderArr = newArr.map((w, idx) => ({ workspace_id: w.id, sort_order: idx + 1 }));
      debouncedSaveOrder(orderArr);
    }
  };

  const renderContent = () => {
    if (isLoading) return <p>読み込み中...</p>;

    if (!localWorkspaces || localWorkspaces.length === 0) return <p>ワークスペースがありません</p>;

    return (
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={localWorkspaces.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          {localWorkspaces.map((workspace) => (
            <WorkspaceListItem 
              key={workspace.id} 
              id={workspace.id}
              isSelected={workspace.id === selectedWorkspaceId}
              onClick={() => selectWorkspace(workspace.id)}
            >
              {workspace.name}
            </WorkspaceListItem>
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="w-80 h-screen pt-16 bg-white border-r border-gray-200 shadow-sm">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ワークスペース</h2>
          <button
            onClick={toggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="サイドバーを閉じる"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="h-full overflow-y-auto hidden-scrollbar px-4 py-2 mb-[140px]">{renderContent()}</div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
};
