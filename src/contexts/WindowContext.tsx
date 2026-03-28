import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';

interface WindowState {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  focused: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (id: string, title: string, icon: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  focusedWindow: string | null;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

const DEFAULT_WINDOWS: Record<string, Partial<WindowState>> = {
  about:    { size: { width: 680, height: 580 }, position: { x: 100, y: 60 } },
  projects:  { size: { width: 860, height: 620 }, position: { x: 150, y: 70 } },
  terminal:  { size: { width: 700, height: 460 }, position: { x: 200, y: 100 } },
  music:     { size: { width: 420, height: 540 }, position: { x: 250, y: 80 } },
  resume:    { size: { width: 760, height: 820 }, position: { x: 120, y: 50 } },
  contact:   { size: { width: 760, height: 600 }, position: { x: 160, y: 70 } },
  browser:   { size: { width: 960, height: 700 }, position: { x: 80, y: 45 } },
};

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

  // Load window positions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('windowPositions');
    if (saved) {
      try {
        const positions = JSON.parse(saved);
        // Merge saved positions with defaults
        Object.keys(DEFAULT_WINDOWS).forEach(id => {
          if (positions[id]) {
            DEFAULT_WINDOWS[id] = { ...DEFAULT_WINDOWS[id], ...positions[id] };
          }
        });
      } catch (e) {
        console.error('Failed to load window positions', e);
      }
    }
  }, []);

  // Save window positions to localStorage
  useEffect(() => {
    const positions: Record<string, any> = {};
    windows.forEach(w => {
      positions[w.id] = { position: w.position, size: w.size };
    });
    localStorage.setItem('windowPositions', JSON.stringify(positions));
  }, [windows]);

  const openWindow = useCallback((id: string, title: string, icon: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        if (existing.minimized) {
          return prev.map(w => w.id === id ? { ...w, minimized: false, focused: true, zIndex: nextZIndex } : { ...w, focused: false });
        }
        return prev.map(w => w.id === id ? { ...w, focused: true, zIndex: nextZIndex } : { ...w, focused: false });
      }

      const defaults = DEFAULT_WINDOWS[id] || { size: { width: 600, height: 500 }, position: { x: 100, y: 100 } };
      const newWindow: WindowState = {
        id,
        title,
        icon,
        position: defaults.position!,
        size: defaults.size!,
        minimized: false,
        focused: true,
        zIndex: nextZIndex,
      };
      
      return [...prev.map(w => ({ ...w, focused: false })), newWindow];
    });
    
    setNextZIndex(prev => prev + 1);
    setFocusedWindow(id);
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setFocusedWindow(prev => prev === id ? null : prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      // Prevent unnecessary updates if already focused and top
      const target = prev.find(w => w.id === id);
      if (target && target.focused && target.zIndex === nextZIndex - 1) return prev;

      return prev.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }));
    });
    setNextZIndex(prev => prev + 1);
    setFocusedWindow(id);
  }, [nextZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized, focused: false } : w));
    setFocusedWindow(prev => prev === id ? null : prev);
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  }, []);

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      updatePosition,
      updateSize,
      focusedWindow,
    }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider');
  }
  return context;
};
