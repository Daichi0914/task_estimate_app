'use client';

import React from 'react';
import { useSidebar } from '@/hooks/useSidebar';

export const WorkspaceSidebar: React.FC = () => {
  const { toggle } = useSidebar();

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
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
        
        <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
          + 新しいワークスペース
        </button>
      </div>
    </div>
  );
};
