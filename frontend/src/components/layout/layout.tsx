'use client';

import React from 'react';
import clsx from 'clsx';
import { Header } from '@/components/layout/header';
import { useSidebar } from '@/hooks/useSidebar';
import { WorkspaceSidebar } from '@/components/layout/sidebar';
import { layoutStyles } from '@/styles/components/layout';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  const sidebarClasses = clsx(
    layoutStyles.sidebar.base,
    {
      [layoutStyles.sidebar.open]: isOpen,
      [layoutStyles.sidebar.closed]: !isOpen,
    }
  );

  const mainClasses = clsx(
    layoutStyles.main.base,
    {
      [layoutStyles.main.withSidebar]: isOpen,
      [layoutStyles.main.withoutSidebar]: !isOpen,
    }
  );

  return (
    <div className={layoutStyles.container}>
      <Header />
      <div className="flex relative">
        <div className={sidebarClasses}>
          <WorkspaceSidebar />
        </div>
        
        <main className={mainClasses}>
          {children}
        </main>
      </div>
    </div>
  );
};
