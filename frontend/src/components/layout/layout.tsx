'use client';

import React from 'react';
import { Header } from './header';
import { useSidebar } from '../../hooks/useSidebar';
import { WorkspaceSidebar } from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex relative">
        <div className={`fixed top-16 left-0 h-full transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <WorkspaceSidebar />
        </div>
        
        <main className={`transition-all duration-300 ease-in-out p-6 flex-1 ${
          isOpen ? 'ml-80' : 'ml-0'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};
