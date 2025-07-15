import { useAtom } from 'jotai';
import { sidebarOpenAtom } from '@/jotai/atoms/sidebarAtom';
import { useEffect } from 'react';

const SIDEBAR_KEY = 'is_open'

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);

  useEffect(() => {
    const isOpenSidebar = localStorage.getItem(SIDEBAR_KEY);

    if (isOpenSidebar === null) return;

    setIsOpen(JSON.parse(isOpenSidebar))
  }, [setIsOpen])

  const toggle = () => {
    setIsOpen(!isOpen);
    localStorage.setItem(SIDEBAR_KEY, (!isOpen).toString());
  };

  return { isOpen, toggle };
};
