'use client';

import React from 'react';

interface DropIndicatorProps {
  index: number;
  dragOverIndex: number | null;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  index,
  dragOverIndex,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      className="h-2 bg-transparent rounded-full transition-colors duration-200 my-1"
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      {dragOverIndex === index && (
        <div className="h-1 bg-blue-400 rounded-full mt-2" />
      )}
    </div>
  );
}; 