'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { useWorkspaces } from '../../hooks/useWorkspace';

interface WorkspaceDescriptionEditorProps {
  workspaceId: string;
  currentDescription: string;
  onCancel: () => void;
  onSave: () => void;
}

export const WorkspaceDescriptionEditor: React.FC<WorkspaceDescriptionEditorProps> = ({
  workspaceId,
  currentDescription,
  onCancel,
  onSave,
}) => {
  const [description, setDescription] = useState(currentDescription);
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
    if (description.trim() !== currentDescription) {
      await updateWorkspace(workspaceId, { description: description.trim() });
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
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="h-6 px-2 py-1 text-sm text-gray-600 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        placeholder="説明を入力"
      />
    </form>
  );
}; 