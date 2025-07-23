import { FC } from 'react';
import { useSelectedWorkspace } from '@/hooks/useSelectedWorkspace';

export const Workspace: FC = () => {
  const { selectedWorkspace } = useSelectedWorkspace();

  if (!selectedWorkspace) {
    return (
      <div className="p-4 text-center text-gray-500">
        ワークスペースを選択してください
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {selectedWorkspace.name}
      </h3>
      <p className="text-sm text-gray-600">
        ワークスペースID: {selectedWorkspace.id}
      </p>
    </div>
  );
};
