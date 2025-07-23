import { atom } from 'jotai';
import type { Workspace } from '@/types/workspace';
 
export const workspacesAtom = atom<Workspace[]>([]);
export const selectedWorkspaceAtom = atom<string | null>(null);
