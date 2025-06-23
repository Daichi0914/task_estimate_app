import { useState, useCallback } from 'react';

interface DragItem {
  id: string;
  index: number;
}

export const useDragAndDrop = <T extends { id: string }>(
  items: T[],
  onReorder: (fromIndex: number, toIndex: number) => void
) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedItem({ id: items[index].id, index });
    e.dataTransfer.effectAllowed = 'move';
  }, [items]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.index !== index) {
      onReorder(draggedItem.index, index);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  }, [draggedItem, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverIndex(null);
  }, []);

  return {
    draggedItem,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};
