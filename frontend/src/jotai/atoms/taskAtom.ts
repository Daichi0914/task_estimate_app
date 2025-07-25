import { atom } from 'jotai';
import type { Task } from '@/types/task';

export const tasksAtom = atom<Task[]>([]); 