import { useState, useEffect, useCallback } from 'react';

export const useWindowResize = (
  windowId: string,
  updateSize: (id: string, width: number, height: number) => void,
  initialSize: { width: number; height: number },
  minSize = { width: 300, height: 200 }
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: initialSize.width,
      height: initialSize.height,
    });
  }, [initialSize]);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(minSize.width, resizeStart.width + deltaX);
      const newHeight = Math.max(minSize.height, resizeStart.height + deltaY);
      
      updateSize(windowId, newWidth, newHeight);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isResizing, resizeStart, windowId, updateSize, minSize]);

  return { handlePointerDown, isResizing };
};
