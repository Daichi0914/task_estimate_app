'use client';

import { usePathname } from 'next/navigation';

export const useCurrentPage = () => {
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';
  
  return {
    pathname,
    isHomePage,
  };
}; 