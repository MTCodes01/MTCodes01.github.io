import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';

// SVG icon components — clean, minimal, monochrome
const Icons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  about: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  projects: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  terminal: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M6 9l4 3-4 3" />
      <path d="M13 18h5" />
    </svg>
  ),
  music: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M11 18V6l10-2v10" />
    </svg>
  ),
  resume: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  ),
  contact: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 9l10 6 10-6" />
    </svg>
  ),
  browser: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a14 14 0 010 20M12 2a14 14 0 000 20" />
    </svg>
  ),
  theme: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  battery: ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="7" width="16" height="10" rx="2" />
      <path d="M23 11v2M5 11h6" />
    </svg>
  ),
};

const DOCK_APPS = [
  { id: 'about',    title: 'About Me',  icon: 'about',    emoji: '👤' },
  { id: 'projects', title: 'Projects',  icon: 'projects', emoji: '💼' },
  { id: 'terminal', title: 'Terminal',  icon: 'terminal', emoji: '⌨️' },
  { id: 'music',    title: 'Music',     icon: 'music',    emoji: '🎵' },
  { id: 'resume',   title: 'Resume',    icon: 'resume',   emoji: '📄' },
  { id: 'contact',  title: 'Contact',   icon: 'contact',  emoji: '📧' },
  { id: 'browser',  title: 'Browser',   icon: 'browser',  emoji: '🌐' },
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
                  onClick={() => openWindow(app.id, app.title, app.emoji)}
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
