import { atom } from 'jotai';
import { Workspace } from '../../types/workspace';

export const workspacesAtom = atom<Workspace[]>([]);

export const currentWorkspaceAtom = atom<Workspace | null>(null);

export const isWorkspaceSidebarOpenAtom = atom<boolean>(false);
