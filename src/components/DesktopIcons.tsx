import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { Icons } from './Icons';

const DESKTOP_APPS = [
  { id: 'about',    title: 'About Me',  icon: 'about'    },
  { id: 'projects', title: 'Projects',  icon: 'projects' },
  { id: 'resume',   title: 'Resume',    icon: 'resume'   },
];

const ICON_SIZE = 64;
const ICON_FULL_HEIGHT = 80; // icon box + label
const TOPBAR_H = 38;
const DOCK_H = 100; // rough bottom safe zone

const LS_KEY = 'desktopIconPositions';

const getDefaultPositions = (): Record<string, { x: number; y: number }> => {
  const positions: Record<string, { x: number; y: number }> = {};
  DESKTOP_APPS.forEach((app, i) => {
    positions[app.id] = {
      x: 20,
      y: TOPBAR_H + 16 + i * (ICON_FULL_HEIGHT + 14),
    };
  });
  return positions;
};

const loadPositions = (): Record<string, { x: number; y: number }> => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults for any missing keys
      return { ...getDefaultPositions(), ...parsed };
    }
  } catch {
    // fall through
  }
  return getDefaultPositions();
};

const clampPosition = (x: number, y: number): { x: number; y: number } => {
  const maxX = window.innerWidth - ICON_SIZE - 10;
  const maxY = window.innerHeight - ICON_FULL_HEIGHT - DOCK_H;
  return {
    x: Math.max(10, Math.min(x, maxX)),
    y: Math.max(TOPBAR_H + 8, Math.min(y, maxY)),
  };
};

const DesktopIcons: React.FC = () => {
  const { openWindow, windows } = useWindows();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(loadPositions);
  const [selected, setSelected] = useState<string | null>(null);

  // Drag state
  const dragging = useRef<{
    id: string;
    startMouseX: number;
    startMouseY: number;
    startIconX: number;
    startIconY: number;
    hasMoved: boolean;
  } | null>(null);

  // Click/double-click state
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  // Persist to localStorage whenever positions change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(positions));
  }, [positions]);

  // Click on empty desktop → deselect
  const handleDesktopClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.desktop-icon')) {
      setSelected(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleDesktopClick);
    return () => document.removeEventListener('mousedown', handleDesktopClick);
  }, [handleDesktopClick]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      // Only left button
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const pos = positions[id];
      dragging.current = {
        id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startIconX: pos.x,
        startIconY: pos.y,
        hasMoved: false,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragging.current.startMouseX;
        const dy = ev.clientY - dragging.current.startMouseY;
        if (!dragging.current.hasMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        dragging.current.hasMoved = true;

        const newPos = clampPosition(
          dragging.current.startIconX + dx,
          dragging.current.startIconY + dy,
        );

        const currentId = dragging.current.id;
        setPositions(prev => ({ ...prev, [currentId]: newPos }));
      };

      const onMouseUp = () => {
        if (!dragging.current) return;
        const { id: dragId, hasMoved } = dragging.current;
        dragging.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (!hasMoved) {
          // Count clicks for single/double detection
          clickCount.current += 1;
          if (clickCount.current === 1) {
            clickTimer.current = setTimeout(() => {
              // Single click → select
              clickCount.current = 0;
              setSelected(dragId);
            }, 220);
          } else if (clickCount.current === 2) {
            // Double click → open
            if (clickTimer.current) clearTimeout(clickTimer.current);
            clickCount.current = 0;
            const app = DESKTOP_APPS.find(a => a.id === dragId);
            if (app) openWindow(app.id, app.title, app.icon);
          }
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [positions, openWindow],
  );

  // Touch support for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: string) => {
      const touch = e.touches[0];
      const pos = positions[id];
      dragging.current = {
        id,
        startMouseX: touch.clientX,
        startMouseY: touch.clientY,
        startIconX: pos.x,
        startIconY: pos.y,
        hasMoved: false,
      };

      const onTouchMove = (ev: TouchEvent) => {
        if (!dragging.current) return;
        const t = ev.touches[0];
        const dx = t.clientX - dragging.current.startMouseX;
        const dy = t.clientY - dragging.current.startMouseY;
        if (!dragging.current.hasMoved && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        dragging.current.hasMoved = true;
        ev.preventDefault();

        const newPos = clampPosition(
          dragging.current.startIconX + dx,
          dragging.current.startIconY + dy,
        );
        const currentId = dragging.current.id;
        setPositions(prev => ({ ...prev, [currentId]: newPos }));
      };

      const onTouchEnd = () => {
        if (!dragging.current) return;
        const { id: dragId, hasMoved } = dragging.current;
        dragging.current = null;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);

        if (!hasMoved) {
          clickCount.current += 1;
          if (clickCount.current === 1) {
            clickTimer.current = setTimeout(() => {
              clickCount.current = 0;
              setSelected(dragId);
            }, 300);
          } else {
            if (clickTimer.current) clearTimeout(clickTimer.current);
            clickCount.current = 0;
            const app = DESKTOP_APPS.find(a => a.id === dragId);
            if (app) openWindow(app.id, app.title, app.icon);
          }
        }
      };

      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    },
    [positions, openWindow],
  );

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence>
        {DESKTOP_APPS.map(app => {
          const IconComponent = Icons[app.icon];
          const pos = positions[app.id] ?? { x: 20, y: 60 };
          const isSelected = selected === app.id;
          const windowState = windows.find(w => w.id === app.id);
          const isOpen = !!windowState && !windowState.minimized;

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.05 * DESKTOP_APPS.findIndex(a => a.id === app.id) }}
              className={`desktop-icon pointer-events-auto`}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                userSelect: 'none',
                touchAction: 'none',
                width: ICON_SIZE,
              }}
              onMouseDown={e => handleMouseDown(e, app.id)}
              onTouchStart={e => handleTouchStart(e, app.id)}
            >
              {/* Icon box */}
              <div
                className={`desktop-icon__box ${isSelected ? 'desktop-icon__box--selected' : ''}`}
              >
                {/* Open indicator glow */}
                {isOpen && (
                  <div className="desktop-icon__open-glow" />
                )}

                {IconComponent && (
                  <IconComponent size={28} className="desktop-icon__svg" />
                )}
              </div>

              {/* Label */}
              <div className={`desktop-icon__label ${isSelected ? 'desktop-icon__label--selected' : ''}`}>
                {app.title}
              </div>

              {/* Running dot */}
              {isOpen && (
                <div className="desktop-icon__running-dot" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DesktopIcons;
