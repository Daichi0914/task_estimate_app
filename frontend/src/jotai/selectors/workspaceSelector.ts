import { atom } from 'jotai';
import { workspacesAtom } from '../atoms/workspaceAtom';
import { Workspace } from '../../types/workspace';

export const sortedWorkspacesAtom = atom<Workspace[]>((get) => {
  const workspaces = get(workspacesAtom);
  return [...workspaces].sort((a, b) => a.order - b.order);
});

export const firstWorkspaceAtom = atom<Workspace | null>((get) => {
  const workspaces = get(sortedWorkspacesAtom);
  return workspaces.length > 0 ? workspaces[0] : null;
});
