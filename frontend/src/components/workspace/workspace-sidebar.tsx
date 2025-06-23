'use client';

import React, { useState } from 'react';
import { useWorkspaces, useCurrentWorkspace, useWorkspaceSidebar } from '../../hooks/useWorkspace';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { WorkspaceListItem } from './workspace-list-item';
import { CreateWorkspaceForm } from './create-workspace-form';
import { DropIndicator } from './drop-indicator';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { CloseIcon, EmptyStateIcon, PlusIcon } from '../ui/icons';

export const WorkspaceSidebar: React.FC = () => {
  const { isOpen, close } = useWorkspaceSidebar();
  const { workspaces, reorderWorkspace } = useWorkspaces();
  const { currentWorkspace } = useCurrentWorkspace();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const workspace = workspaces[fromIndex];
    if (workspace) {
      reorderWorkspace({ workspaceId: workspace.id, newOrder: toIndex });
    }
  };

  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    dragOverIndex,
    draggedItem,
  } = useDragAndDrop(workspaces, handleReorder);

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-xl z-30 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">ワークスペース</h2>
        <button
          onClick={close}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ワークスペースリスト */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {workspaces.length === 0 ? (
          <EmptyState
            icon={<EmptyStateIcon className="w-12 h-12 mx-auto text-gray-300" />}
            title="ワークスペースがありません"
            description="新しいワークスペースを作成してください"
          />
        ) : (
          <>
            {/* 一番上のドロップ位置 */}
            <DropIndicator
              index={0}
              dragOverIndex={dragOverIndex}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            
            {workspaces.map((workspace, index) => (
              <React.Fragment key={workspace.id}>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-200 ${
                    draggedItem?.index === index ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <WorkspaceListItem
                    workspace={workspace}
                    isActive={currentWorkspace?.id === workspace.id}
                  />
                </div>
                {/* 各アイテムの下のドロップ位置（最後のアイテム以外） */}
                {index < workspaces.length - 1 && (
                  <DropIndicator
                    index={index + 1}
                    dragOverIndex={dragOverIndex}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                )}
              </React.Fragment>
            ))}
            
            {/* 一番最後のドロップ位置 */}
            <DropIndicator
              index={workspaces.length}
              dragOverIndex={dragOverIndex}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </>
        )}
      </div>

      {/* 新規作成ボタン */}
      <div className="p-4 border-t">
        {showCreateForm ? (
          <CreateWorkspaceForm onClose={() => setShowCreateForm(false)} />
        ) : (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            新しいワークスペース
          </Button>
        )}
      </div>
    </div>
  );
};
