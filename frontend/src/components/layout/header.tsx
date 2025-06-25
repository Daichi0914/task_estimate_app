'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderIcon, UserIcon } from '@/components/ui/icons';
import { useSidebar } from '@/hooks/useSidebar';
import { headerStyles } from '@/styles/components/header';
import { layoutStyles } from '@/styles/components/layout';
import { buttonStyles } from '@/styles/components/button';

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
    <header className={headerStyles.base}>
      <div className={layoutStyles.flex}>
        <button
          onClick={toggle}
          className={buttonStyles.base}
          aria-label="ワークスペースメニューを開く"
        >
          <FolderIcon />
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogoClick}
            className={buttonStyles.logo}
          >
            <div className={headerStyles.logo.container}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={headerStyles.logo.text}>TaskEstimate</span>
          </button>
        </div>
        
        <button
          onClick={handleUserIconClick}
          className={buttonStyles.rounded}
          aria-label="ユーザー設定"
        >
          <UserIcon />
        </button>
      </div>
    </header>
  );
};
