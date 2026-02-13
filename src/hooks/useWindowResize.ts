import { useState, useEffect, useCallback } from 'react';

export const useWindowResize = (
  windowId: string,
  updateSize: (id: string, width: number, height: number) => void,
  initialSize: { width: number; height: number },
  minSize = { width: 300, height: 200 }
) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      e.preventDefault();
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: initialSize.width,
        height: initialSize.height,
      });
    }
  }, [initialSize]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(minSize.width, resizeStart.width + deltaX);
      const newHeight = Math.max(minSize.height, resizeStart.height + deltaY);
      
      updateSize(windowId, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, windowId, updateSize, minSize]);

  return { handleMouseDown, isResizing };
};
