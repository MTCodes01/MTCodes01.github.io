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

    // Create overlay to block all events on other windows/iframes
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '99999';
    overlay.style.cursor = 'se-resize';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.touchAction = 'none'; // Prevents mobile scrolling while dragging
    overlay.style.pointerEvents = 'all';
    document.body.appendChild(overlay);

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(minSize.width, resizeStart.width + deltaX);
      const newHeight = Math.max(minSize.height, resizeStart.height + deltaY);
      
      updateSize(windowId, newWidth, newHeight);
    };

    const handlePointerUp = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(false);
    };

    overlay.addEventListener('pointermove', handlePointerMove);
    overlay.addEventListener('pointerup', handlePointerUp);
    overlay.addEventListener('pointercancel', handlePointerUp);
    overlay.addEventListener('pointerleave', handlePointerUp);

    return () => {
      overlay.removeEventListener('pointermove', handlePointerMove);
      overlay.removeEventListener('pointerup', handlePointerUp);
      overlay.removeEventListener('pointercancel', handlePointerUp);
      overlay.removeEventListener('pointerleave', handlePointerUp);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, [isResizing, resizeStart, windowId, updateSize, minSize]);

  return { handlePointerDown, isResizing };
};
