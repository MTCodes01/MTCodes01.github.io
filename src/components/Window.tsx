import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { useWindowResize } from '../hooks/useWindowResize';

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

  if (windowState.minimized) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "circOut" }}
        className="absolute window-chrome bg-[#050505] shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
        style={{
          position: 'absolute',
          left: windowState.position.x,
          top: windowState.position.y,
          width: windowState.size.width,
          height: windowState.size.height,
          zIndex: windowState.zIndex,
        }}
        onMouseDown={() => focusWindow(windowState.id)}
      >
        {/* Corner Accents */}
        <div className="corner-accent pointer-events-none" />

          <div
            className="window-title-bar h-9 flex items-center justify-between px-3 cursor-move select-none bg-[#1a1a1a] border-b border-white/5 rounded-t-lg"
            onMouseDown={(e) => {
              focusWindow(windowState.id);
              handleDragMouseDown(e);
            }}
          >
            {/* Window Controls (Mac Style) - Left aligned */}
            <div className="flex items-center gap-2 group/controls z-50" onMouseDown={e => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(windowState.id);
                }}
                className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center border border-black/10 hover:brightness-90 active:brightness-75 transition-all"
                title="Close"
              >
                <span className="opacity-0 group-hover/controls:opacity-100 text-[8px] font-bold text-black/50">×</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(windowState.id);
                }}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center border border-black/10 hover:brightness-90 active:brightness-75 transition-all"
                title="Minimize"
              >
                <span className="opacity-0 group-hover/controls:opacity-100 text-[8px] font-bold text-black/50">−</span>
              </button>
              <button
                className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center border border-black/10 hover:brightness-90 active:brightness-75 transition-all cursor-default"
                title="Maximize"
              >
                <span className="opacity-0 group-hover/controls:opacity-100 text-[6px] font-bold text-black/50">sw</span>
              </button>
            </div>

            {/* Title */}
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex items-center gap-2 opacity-80">
                {/* <span className="text-sm">{windowState.icon}</span> */}
                <span className="font-space-grotesk font-medium text-xs tracking-wide text-gray-400">
                  {windowState.title}
                </span>
              </div>
            </div>

            {/* Spacer for balance */}
            <div className="w-14" /> 
          </div>

          {/* Content */}
          <div className="h-[calc(100%-2.25rem)] overflow-auto scroll-smooth relative bg-[#0a0a0f]">
             {/* Grid Overlay inside window - subtler */}
             <div className="absolute inset-0 bg-matrix-pattern opacity-5 pointer-events-none fixed" />
            {children}
          </div>

        {/* Resize Handle */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="w-2 h-2 border-b-2 border-r-2 border-white/40" />
          <div className="absolute bottom-1 right-2 w-2 h-2 border-b-2 border-r-2 border-white/20" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Window;
