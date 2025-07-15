'use client';

import { useSidebar } from '@/hooks/useSidebar';
import CreateWorkspaceForm from '../workspace/createWorkspaceForm';
import { useWorkspace } from '@/hooks/useWorkspace';

export const WorkspaceSidebar: React.FC = () => {
  const { toggle } = useSidebar();
  const { workspaces, isLoading } = useWorkspace();

  const renderContent = () => {
    if (isLoading) return <p>読み込み中...</p>;

    if (!workspaces || workspaces.length === 0) return <p>ワークスペースがありません</p>;

    return workspaces.map((workspace) => (
      <div key={workspace.id}>{workspace.name}</div>
    ));
  };

  return (
    <div className="w-80 h-full pt-16 bg-white border-r border-gray-200 shadow-sm">
      <div className="h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">ワークスペース</h2>
          <button
            onClick={toggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="サイドバーを閉じる"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className='h-[calc(100% - 124px)] scroll-auto'>
          {renderContent()}
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
};
