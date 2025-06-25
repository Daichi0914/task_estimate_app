'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderIcon, UserIcon } from '../ui/icons';
import { useSidebar } from '../../hooks/useSidebar';

export const Header: React.FC = () => {
  const router = useRouter();
  const { toggle } = useSidebar();

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleUserIconClick = () => {
    router.push('/settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 relative z-40">
      <div className="flex items-center justify-between">
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="ワークスペースメニューを開く"
        >
          <FolderIcon />
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TaskEstimate</span>
          </button>
        </div>
        
        <button
          onClick={handleUserIconClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="ユーザー設定"
        >
          <UserIcon />
        </button>
      </div>
    </header>
  );
};
