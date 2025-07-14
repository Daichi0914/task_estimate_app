export const layoutStyles = {
  container: 'min-h-screen bg-gray-50',
  flex: 'flex items-center justify-between',
  sidebar: {
    base: 'fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-30',
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
  main: {
    base: 'transition-all duration-300 ease-in-out mt-16 p-6 flex-1',
    withSidebar: 'ml-80',
    withoutSidebar: 'ml-0',
  },
};
