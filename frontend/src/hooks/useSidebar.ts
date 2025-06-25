import { useAtom } from 'jotai';
import { sidebarOpenAtom } from '@/jotai/atoms/sidebarAtom';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggle };
};
