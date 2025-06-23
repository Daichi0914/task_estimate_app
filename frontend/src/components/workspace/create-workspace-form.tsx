import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FormField } from '../ui/form-field';
import { useWorkspaces } from '../../hooks/useWorkspace';

interface CreateWorkspaceFormProps {
  onClose: () => void;
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createWorkspace } = useWorkspaces();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createWorkspace({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (error) {
      console.error('ワークスペースの作成に失敗しました:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="ワークスペース名"
        id="workspace-name"
        value={name}
        onChange={setName}
        placeholder="ワークスペース名を入力"
        required
      />
      <FormField
        label="説明（任意）"
        id="workspace-description"
        value={description}
        onChange={setDescription}
        placeholder="説明を入力"
      />
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          作成
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          キャンセル
        </Button>
      </div>
    </form>
  );
};
