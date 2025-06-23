'use client';

import React, { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { useCurrentWorkspace } from '../hooks/useWorkspace';
import { Card } from '../components/ui/card';
import { WorkspaceNameEditor } from '../components/workspace/workspace-name-editor';
import { WorkspaceDescriptionEditor } from '../components/workspace/workspace-description-editor';
import { HomeIcon } from '../components/ui/icons';

export default function Home() {
  const { currentWorkspace } = useCurrentWorkspace();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameEditCancel = () => {
    setIsEditingName(false);
  };

  const handleNameEditSave = () => {
    setIsEditingName(false);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionEditCancel = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionEditSave = () => {
    setIsEditingDescription(false);
  };

  const renderWorkspaceHeader = () => {
    if (!currentWorkspace) {
      return null;
    }

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <WorkspaceNameEditor
              workspaceId={currentWorkspace.id}
              currentName={currentWorkspace.name}
              onCancel={handleNameEditCancel}
              onSave={handleNameEditSave}
            />
          ) : (
            <h1 
              className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={handleNameClick}
              title="クリックして編集"
            >
              {currentWorkspace.name}
            </h1>
          )}
        </div>
        <div className="mt-2">
          {renderDescription()}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          最終更新: {currentWorkspace.updatedAt.toLocaleDateString('ja-JP')}
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    if (isEditingDescription) {
      return (
        <WorkspaceDescriptionEditor
          workspaceId={currentWorkspace!.id}
          currentDescription={currentWorkspace!.description || ''}
          onCancel={handleDescriptionEditCancel}
          onSave={handleDescriptionEditSave}
        />
      );
    }

    if (currentWorkspace!.description) {
      return (
        <p 
          className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          onClick={handleDescriptionClick}
          title="クリックして編集"
        >
          {currentWorkspace!.description}
        </p>
      );
    }

    return (
      <p 
        className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer italic"
        onClick={handleDescriptionClick}
        title="クリックして説明を追加"
      >
        説明を追加...
      </p>
    );
  };

  const renderMainContent = () => {
    if (!currentWorkspace) {
      return (
        <div className="text-center py-16">
          <HomeIcon className="w-16 h-16 mx-auto text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">ワークスペースを選択してください</h2>
          <p className="text-gray-600">左側のメニューからワークスペースを選択するか、新しいワークスペースを作成してください。</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のタスク</h3>
          <p className="text-gray-600">まだタスクがありません</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">統計</h3>
          <p className="text-gray-600">統計情報がありません</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">アクティビティ</h3>
          <p className="text-gray-600">アクティビティがありません</p>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {renderWorkspaceHeader()}
        {renderMainContent()}
      </div>
    </Layout>
  );
}
