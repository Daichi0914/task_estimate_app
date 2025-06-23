'use client';

import React from 'react';
import { Header } from './header';
import { WorkspaceSidebar } from '../workspace/workspace-sidebar';
import { useWorkspaceSidebar } from '../../hooks/useWorkspace';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen } = useWorkspaceSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WorkspaceSidebar />
      <main className={`transition-all duration-300 ease-in-out p-6 ${
        isOpen ? 'ml-80' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  );
};
