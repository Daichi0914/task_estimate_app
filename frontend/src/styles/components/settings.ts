export const settingsStyles = {
  container: 'max-w-4xl mx-auto',
  header: {
    container: 'mb-6',
    title: 'text-3xl font-bold text-gray-900',
    description: 'text-gray-600 mt-2',
  },
  grid: 'grid gap-6',
  card: 'p-6',
  section: {
    title: 'text-xl font-semibold text-gray-900 mb-4',
    content: 'flex flex-col gap-4 items-start',
  },
  form: {
    field: '',
    label: 'block text-sm font-medium text-gray-700 mb-2',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    button: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors',
  },
  toggle: {
    container: 'flex items-center justify-between',
    content: '',
    title: 'font-medium text-gray-900',
    description: 'text-sm text-gray-600',
    switch: {
      base: 'w-12 h-6 rounded-full relative',
      off: 'bg-gray-200',
      on: 'bg-blue-600',
      thumb: 'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
      thumbOff: 'left-0.5',
      thumbOn: 'right-0.5',
    },
  },
  account: {
    deleteButton: 'text-red-600 hover:text-red-700 font-medium',
    logoutButton: 'text-gray-600 hover:text-gray-700 font-medium',
  },
}; 