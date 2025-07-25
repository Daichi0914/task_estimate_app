import { FC, useState, useRef } from 'react';
import { TaskStatus } from '@/types/task';
import { PlusIcon } from '../ui/icons';
import { useTask } from '@/hooks/useTask';

interface CreateTaskFormProps {
  status: TaskStatus;
  workspaceId: string;
}

export const CreateTaskForm: FC<CreateTaskFormProps> = ({ status, workspaceId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createTask } = useTask();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // タスクを作成
    createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      workspaceId,
    });
    
    setTitle('');
    setDescription('');
    
    // 入力フィールドにフォーカスを戻す
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">タスクを追加</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 flex flex-col gap-2">
      <input
        ref={inputRef}
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクのタイトル"
        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        >
          追加
        </button>
      </div>
    </form>
  );
};
