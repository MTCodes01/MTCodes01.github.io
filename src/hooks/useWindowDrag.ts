import { useState, useEffect, useCallback } from 'react';

export const useWindowDrag = (
  windowId: string,
  updatePosition: (id: string, x: number, y: number) => void,
  initialPosition: { x: number; y: number }
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from title bar
    if ((e.target as HTMLElement).closest('.window-title-bar')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - initialPosition.x,
        y: e.clientY - initialPosition.y,
      });
    }
  }, [initialPosition]);

  useEffect(() => {
    if (!isDragging) return;

    // Create overlay to block all events on other windows/iframes
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '99999';
    overlay.style.cursor = 'move';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.pointerEvents = 'all';
    document.body.appendChild(overlay);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 200));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 100));
      updatePosition(windowId, newX, newY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseup', handleMouseUp);
    // Also listen for mouseleave in case cursor leaves the window
    overlay.addEventListener('mouseleave', handleMouseUp);

    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove);
      overlay.removeEventListener('mouseup', handleMouseUp);
      overlay.removeEventListener('mouseleave', handleMouseUp);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, [isDragging, dragStart, windowId, updatePosition]);

  return { handleMouseDown, isDragging };
};
