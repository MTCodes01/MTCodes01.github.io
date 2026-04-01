import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { useWindowResize } from '../hooks/useWindowResize';
import { Icons } from './Icons';

interface WindowProps {
  windowState: {
    id: string;
    title: string;
    icon: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    minimized: boolean;
    focused: boolean;
    zIndex: number;
  };
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const { closeWindow, focusWindow, minimizeWindow, updatePosition, updateSize } = useWindows();
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState<{ pos: { x: number; y: number }; size: { width: number; height: number } } | null>(null);

  const { handleMouseDown: handleDragMouseDown } = useWindowDrag(
    windowState.id,
    updatePosition,
    windowState.position
  );
  const { handleMouseDown: handleResizeMouseDown } = useWindowResize(
    windowState.id,
    updateSize,
    windowState.size
  );

  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowState.id === 'resume') return;
    if (isMaximized && preMaxState) {
      updatePosition(windowState.id, preMaxState.pos.x, preMaxState.pos.y);
      updateSize(windowState.id, preMaxState.size.width, preMaxState.size.height);
      setIsMaximized(false);
      setPreMaxState(null);
    } else {
      setPreMaxState({ pos: windowState.position, size: windowState.size });
      const topBarH = 32;
      const dockH = 80;
      updatePosition(windowState.id, 0, topBarH);
      updateSize(windowState.id, window.innerWidth, window.innerHeight - topBarH - dockH);
      setIsMaximized(true);
    }
  }, [isMaximized, preMaxState, windowState, updatePosition, updateSize]);

  if (windowState.minimized) return null;

  const isFocused = windowState.focused;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 4, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={`absolute window-chrome ${isFocused ? 'window-focused' : ''}`}
        style={{
          position: 'absolute',
          left: windowState.position.x,
          top: windowState.position.y,
          width: windowState.size.width,
          height: windowState.size.height,
          zIndex: windowState.zIndex,
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseDown={() => focusWindow(windowState.id)}
      >
        {/* Corner accent — only show when focused */}
        {isFocused && <div className="corner-accent pointer-events-none" />}

        {/* Title Bar */}
        <div
          className={`window-title-bar h-9 flex items-center justify-between px-3 cursor-move select-none border-b transition-colors duration-200 ${
            isFocused
              ? 'bg-os-surface border-white/8'
              : 'bg-os-window border-white/[0.04]'
          }`}
          onMouseDown={(e) => {
            if (isMaximized) return;
            focusWindow(windowState.id);
            handleDragMouseDown(e);
          }}
          onDoubleClick={handleMaximize}
        >
          {/* Mac controls */}
          <div className="flex items-center gap-2 group/controls z-50" onMouseDown={e => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
              className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center border border-black/20 hover:brightness-110 active:brightness-75 transition-all"
              title="Close"
            >
              <span className="opacity-0 group-hover/controls:opacity-100 text-[7px] font-bold text-black/60 leading-none">✕</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizeWindow(windowState.id); }}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center border border-black/20 hover:brightness-110 active:brightness-75 transition-all"
              title="Minimize"
            >
              <span className="opacity-0 group-hover/controls:opacity-100 text-[7px] font-bold text-black/60 leading-none">−</span>
            </button>
            <button
              onClick={handleMaximize}
              disabled={windowState.id === 'resume'}
              className={`w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center border border-black/20 hover:brightness-110 active:brightness-75 transition-all ${windowState.id === 'resume' ? 'opacity-30 cursor-not-allowed' : ''}`}
              title={windowState.id === 'resume' ? 'Fixed Size' : (isMaximized ? 'Restore' : 'Maximize')}
            >
              <span className="opacity-0 group-hover/controls:opacity-100 text-[6px] font-bold text-black/60 leading-none">
                {windowState.id === 'resume' ? '' : (isMaximized ? '⊙' : '+')}
              </span>
            </button>
          </div>

          {/* Centred title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <div className={`flex items-center gap-2 window-titlebar-text transition-opacity duration-200 ${isFocused ? 'opacity-75' : 'opacity-30'}`}>
              {Icons[windowState.icon] ? (
                React.createElement(Icons[windowState.icon], { size: 14, className: "text-white/60" })
              ) : (
                <span className="text-sm leading-none">{windowState.icon}</span>
              )}
              <span className="font-space-grotesk font-medium text-[11px] tracking-widest uppercase text-white/80">
                {windowState.title}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="w-14" />
        </div>

        {/* Content */}
        <div className="h-[calc(100%-2.25rem)] overflow-auto scroll-smooth relative bg-os-element">
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
          {children}
        </div>

        {/* Resize handle — hidden when maximized or for resume app */}
        {!isMaximized && windowState.id !== 'resume' && (
          <div
            className="resize-handle absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-1 opacity-40 hover:opacity-100 transition-opacity z-50"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="w-2 h-2 border-b border-r border-white/60 pointer-events-none" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Window;
