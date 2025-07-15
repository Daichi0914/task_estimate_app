'use client';

import { FC, useEffect, useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import CreateWorkspaceForm from '../workspace/createWorkspaceForm';
import { useWorkspace } from '@/hooks/useWorkspace';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import WorkspaceListItem from '../workspace/workspaceListItem';

export const WorkspaceSidebar: FC = () => {
  const { toggle } = useSidebar();
  const { workspaces, isLoading } = useWorkspace();
  const [localWorkspaces, setLocalWorkspaces] = useState(workspaces);

  useEffect(() => {
    setLocalWorkspaces(workspaces);
  }, [workspaces]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = localWorkspaces.findIndex((w) => w.id === String(active.id));
      const newIndex = localWorkspaces.findIndex((w) => w.id === String(over.id));
      const newArr = arrayMove(localWorkspaces, oldIndex, newIndex);
      setLocalWorkspaces(newArr);
      // 必要に応じてここでAPIで順序保存も可能
    }
  };

  const renderContent = () => {
    if (isLoading) return <p>読み込み中...</p>;

    if (!localWorkspaces || localWorkspaces.length === 0) return <p>ワークスペースがありません</p>;

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={localWorkspaces.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          {localWorkspaces.map((workspace) => (
            <WorkspaceListItem key={workspace.id} id={workspace.id}>
              {workspace.name}
            </WorkspaceListItem>
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="w-80 h-full pt-16 bg-white border-r border-gray-200 shadow-sm">
      <div className="h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">ワークスペース</h2>
          <button
            onClick={toggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
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
        <div className="h-[calc(100% - 124px)] scroll-auto">{renderContent()}</div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
};
