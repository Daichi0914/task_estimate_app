import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { selectedWorkspaceWithStorageAtom } from '@/jotai/effects/workspaceEffects';
import { workspacesAtom } from '@/jotai/atoms/workspaceAtom';
import { useEffect } from 'react';

export const useSelectedWorkspace = () => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useAtom(selectedWorkspaceWithStorageAtom);
  const workspaces = useAtomValue(workspacesAtom);

  // デフォルトで最初のワークスペースを選択
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId, setSelectedWorkspaceId]);

  // 選択されたワークスペースのオブジェクトを取得
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || null;

  const selectWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
  };

  return {
    selectedWorkspaceId,
    selectedWorkspace,
    selectWorkspace,
  };
};
