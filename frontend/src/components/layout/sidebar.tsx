'use client';

import { useEffect, useRef, useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';

export const WorkspaceSidebar: React.FC = () => {
  const { toggle } = useSidebar();
  const [isShownCreateWorkSpace, setIsShownCreateWorkSpace] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isShownCreateWorkSpace || !inputRef.current) return;
    inputRef.current.focus();
  }, [isShownCreateWorkSpace])

  const showCreateWorkSpace = () => {
    if (isShownCreateWorkSpace) return;
    setIsShownCreateWorkSpace(true);
  };

  const hideCreateWorkSpace = () => {
    if (!isShownCreateWorkSpace) return;
    setIsShownCreateWorkSpace(false);
  };

  return (
    <div className="w-80 h-full pt-16 bg-white border-r border-gray-200 shadow-sm">
      <div className="h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">ワークスペース</h2>
          <button
            onClick={toggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="サイドバーを閉じる"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className='h-[calc(100% - 148px)] scroll-auto'>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[148px] px-4 py-6 flex flex-col justify-end">
          {isShownCreateWorkSpace ? (
            <form>
              <input
                type="text"
                name='workspaceName'
                className="w-full p-3 border border-black rounded-lg"
                ref={inputRef}
              />
              <div className="flex justify-between gap-4 mt-4">
                <button
                  type='button'
                  className="w-full p-1 bg-white hover:bg-gray-100 text-black border border-black rounded-lg transition-colors cursor-pointer"
                  onClick={hideCreateWorkSpace}
                >
                  キャンセル
                </button>
                <button
                  type='button'
                  className="w-full p-1 bg-black hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  作成する
                </button>
              </div>
            </form>
          ) : (
            <button
              className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              onClick={showCreateWorkSpace}
            >
              + 新しいワークスペース
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
