'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace } from '../../types/workspace';
import { useWorkspaces, useCurrentWorkspace } from '../../hooks/useWorkspace';
import { useCurrentPage } from '../../hooks/useCurrentPage';
import { DuplicateIcon, TrashIcon } from '../ui/icons';

interface WorkspaceListItemProps {
  workspace: Workspace;
  isActive: boolean;
}

export const WorkspaceListItem: React.FC<WorkspaceListItemProps> = ({
  workspace,
  isActive,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { duplicateWorkspace, deleteWorkspace } = useWorkspaces();
  const { setCurrentWorkspaceById } = useCurrentWorkspace();
  const { isHomePage } = useCurrentPage();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // 外部クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleClick = () => {
    setCurrentWorkspaceById(workspace.id);
    
    // ホーム画面以外の場合はホームに戻る
    if (!isHomePage) {
      router.push('/');
    }
  };

  const handleDuplicate = async () => {
    await duplicateWorkspace(workspace.id);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm(`${workspace.name}を削除しますか？`)) {
      await deleteWorkspace(workspace.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`relative group cursor-pointer p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 border-blue-300'
          : 'hover:bg-gray-100 border-transparent'
      } border`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {workspace.name}
          </h3>
          {workspace.description && (
            <p className="text-sm text-gray-500 truncate">{workspace.description}</p>
          )}
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
        >
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={handleDuplicate}
          >
            <DuplicateIcon />
            複製
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
            onClick={handleDelete}
          >
            <TrashIcon />
            削除
          </button>
        </div>
      )}
    </div>
  );
};
