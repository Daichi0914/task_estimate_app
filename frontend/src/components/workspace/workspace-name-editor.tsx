'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { useWorkspaces } from '../../hooks/useWorkspace';

interface WorkspaceNameEditorProps {
  workspaceId: string;
  currentName: string;
  onCancel: () => void;
  onSave: () => void;
}

export const WorkspaceNameEditor: React.FC<WorkspaceNameEditorProps> = ({
  workspaceId,
  currentName,
  onCancel,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const { updateWorkspace } = useWorkspaces();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // フォーカスを当てて、テキストを選択
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== currentName) {
      await updateWorkspace(workspaceId, { name: name.trim() });
    }
    onSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="h-6 px-2 py-1 text-sm font-medium border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        placeholder="ワークスペース名"
      />
    </form>
  );
}; 