import { useAtom, useAtomValue } from 'jotai';
import { workspacesAtom, currentWorkspaceAtom, isWorkspaceSidebarOpenAtom } from '../jotai/atoms/workspaceAtom';
import { sortedWorkspacesAtom, firstWorkspaceAtom } from '../jotai/selectors/workspaceSelector';
import { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest, ReorderWorkspaceRequest } from '../types/workspace';
import React from 'react';

// サンプルデータ
const sampleWorkspaces: Workspace[] = [
  {
    id: '1',
    name: '個人プロジェクト',
    description: '個人的なタスクやプロジェクトを管理',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 0,
  },
  {
    id: '2',
    name: '仕事',
    description: '仕事関連のタスクを管理',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    order: 1,
  },
  {
    id: '3',
    name: '学習',
    description: '学習やスキルアップのタスクを管理',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    order: 2,
  },
];

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useAtom(workspacesAtom);
  const sortedWorkspaces = useAtomValue(sortedWorkspacesAtom);
  const firstWorkspace = useAtomValue(firstWorkspaceAtom);
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);

  // 初回ロード時にサンプルデータを設定
  React.useEffect(() => {
    setWorkspaces(sampleWorkspaces);
  }, [setWorkspaces]);

  // ワークスペースリストが変更された際に、currentWorkspaceが存在しない場合は自動選択
  React.useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const nextWorkspace = workspaces.sort((a, b) => a.order - b.order)[0];
      setCurrentWorkspace(nextWorkspace);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  const createWorkspace = async (request: CreateWorkspaceRequest) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: request.name,
      description: request.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: workspaces.length,
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    return newWorkspace;
  };

  const updateWorkspace = async (id: string, request: UpdateWorkspaceRequest) => {
    setWorkspaces(prev => prev.map(workspace => 
      workspace.id === id 
        ? { ...workspace, ...request, updatedAt: new Date() }
        : workspace
    ));
  };

  const deleteWorkspace = async (id: string) => {
    // 削除前の状態を保存
    const isCurrentWorkspaceBeingDeleted = currentWorkspace && currentWorkspace.id === id;
    
    setWorkspaces(prev => {
      const newWorkspaces = prev.filter(workspace => workspace.id !== id);
      
      // 現在選択中のワークスペースが削除される場合、次のワークスペースを選択
      if (isCurrentWorkspaceBeingDeleted) {
        if (newWorkspaces.length > 0) {
          const nextWorkspace = newWorkspaces.sort((a, b) => a.order - b.order)[0];
          // 同期的にcurrentWorkspaceを更新
          setTimeout(() => setCurrentWorkspace(nextWorkspace), 0);
        } else {
          setTimeout(() => setCurrentWorkspace(null), 0);
        }
      }
      
      return newWorkspaces;
    });
  };

  const duplicateWorkspace = async (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    if (!workspace) return;

    const duplicatedWorkspace: Workspace = {
      ...workspace,
      id: Date.now().toString(),
      name: `${workspace.name} (コピー)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: workspaces.length,
    };
    setWorkspaces(prev => [...prev, duplicatedWorkspace]);
  };

  const reorderWorkspace = async (request: ReorderWorkspaceRequest) => {
    setWorkspaces(prev => {
      const workspace = prev.find(w => w.id === request.workspaceId);
      if (!workspace) return prev;

      const newWorkspaces = prev.map(w => {
        if (w.id === request.workspaceId) {
          return { ...w, order: request.newOrder, updatedAt: new Date() };
        }
        return w;
      });

      return newWorkspaces.sort((a, b) => a.order - b.order);
    });
  };

  return {
    workspaces: sortedWorkspaces,
    firstWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    reorderWorkspace,
  };
};

export const useCurrentWorkspace = () => {
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const workspaces = useAtomValue(workspacesAtom);
  const firstWorkspace = useAtomValue(firstWorkspaceAtom);

  const setCurrentWorkspaceById = (id: string) => {
    // ワークスペースリストから指定されたIDのワークスペースを取得
    const targetWorkspace = workspaces.find(w => w.id === id);
    if (targetWorkspace) {
      setCurrentWorkspace(targetWorkspace);
    }
  };

  // 現在のワークスペースが存在しない場合、最初のワークスペースを自動選択
  // ただし、ワークスペースリストが空でない場合のみ
  React.useEffect(() => {
    // ワークスペースリストが空の場合は何もしない（削除後の空状態を維持）
    if (workspaces.length === 0) {
      return;
    }
    
    // 現在のワークスペースが存在しない場合のみ自動選択
    if (!currentWorkspace && firstWorkspace) {
      setCurrentWorkspace(firstWorkspace);
    }
    
    // 現在のワークスペースが存在するが、ワークスペースリストに含まれていない場合（削除された場合）
    if (currentWorkspace && !workspaces.find(w => w.id === currentWorkspace.id)) {
      if (firstWorkspace) {
        setCurrentWorkspace(firstWorkspace);
      } else {
        setCurrentWorkspace(null);
      }
    }
  }, [currentWorkspace, firstWorkspace, workspaces, setCurrentWorkspace]);

  return {
    currentWorkspace,
    setCurrentWorkspace,
    setCurrentWorkspaceById,
  };
};

export const useWorkspaceSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(isWorkspaceSidebarOpenAtom);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
