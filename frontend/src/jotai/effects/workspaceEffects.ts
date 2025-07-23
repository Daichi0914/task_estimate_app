import { atom } from 'jotai';
import { selectedWorkspaceAtom } from '../atoms/workspaceAtom';

const STORAGE_KEY = 'selectedWorkspaceId';

// localStorageから初期値を読み込む
const getInitialSelectedWorkspace = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

// 選択されたワークスペースのatom（localStorageと同期）
export const selectedWorkspaceWithStorageAtom = atom(
  (get) => get(selectedWorkspaceAtom) ?? getInitialSelectedWorkspace(),
  (get, set, newValue: string | null) => {
    set(selectedWorkspaceAtom, newValue);
    if (typeof window !== 'undefined') {
      if (newValue) {
        localStorage.setItem(STORAGE_KEY, newValue);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }
);
