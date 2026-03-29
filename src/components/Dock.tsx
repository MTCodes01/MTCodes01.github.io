import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';

import { Icons } from './Icons';

const DOCK_APPS = [
  { id: 'about',    title: 'About Me',  icon: 'about'},
  { id: 'projects', title: 'Projects',  icon: 'projects'},
  { id: 'terminal', title: 'Terminal',  icon: 'terminal'},
  { id: 'music',    title: 'Music',     icon: 'music'},
  { id: 'resume',   title: 'Resume',    icon: 'resume'},
  { id: 'contact',  title: 'Contact',   icon: 'contact'},
  { id: 'browser',  title: 'Browser',   icon: 'browser'},
  { id: 'vscode',   title: 'VS Code',   icon: 'vscode'},
];

const Dock: React.FC = () => {
  const { windows, openWindow } = useWindows();
  const { toggleTheme, toggleBatterySaver, batterySaver } = useTheme();

  const isWindowOpen = (id: string) => windows.some(w => w.id === id);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-3xl px-4">
      <div className="dock-container flex items-center justify-between gap-1 px-3 py-2.5 relative">
        {/* Brand tag */}
        <div className="hidden md:flex items-center gap-2 pr-2 border-r border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse" />
          <span className="font-jetbrains text-[9px] text-white/35 uppercase tracking-widest">
            SYS.LIVE
          </span>
        </div>

        {/* App icons */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {DOCK_APPS.map(app => {
            const IconComponent = Icons[app.icon];
            const isOpen = isWindowOpen(app.id);
            return (
              <div key={app.id} className="relative group">
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#0a0a0f] border border-white/15 text-white text-[10px] font-inter font-medium opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none rounded-sm -translate-y-1 group-hover:translate-y-0">
                  {app.title}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0a0a0f] border-r border-b border-white/15 rotate-45" />
                </div>

                <motion.button
                  whileHover={{ y: -5, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => openWindow(app.id, app.title, app.icon)}
                  className={`relative w-11 h-11 flex items-center justify-center transition-colors duration-200 ${
                    isOpen
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-white/50 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/5'
                  }`}
                  title={app.title}
                >
                  {IconComponent && <IconComponent size={18} />}
                </motion.button>

                {/* Active dot */}
                {isOpen && (
                  <motion.div
                    layoutId={`dock-dot-${app.id}`}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff003c]"
                    style={{ boxShadow: '0 0 4px rgba(255,0,60,0.9)' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-white/10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white"
            title="Toggle Theme"
          >
            <Icons.theme size={14} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleBatterySaver}
            className={`w-9 h-9 flex items-center justify-center border transition-all ${
              batterySaver
                ? 'bg-[#33ff00]/10 text-[#33ff00] border-[#33ff00]/30 hover:bg-[#33ff00]/20'
                : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'
            }`}
            title="Battery Saver"
          >
            <Icons.battery size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dock;
