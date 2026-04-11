import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNebulaOverride } from '../contexts/NebulaOverrideContext';

import { Icons } from './Icons';

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.04,
    }
  }
} as const;

const itemVariants = {
  hidden: { y: 25, opacity: 0, scale: 0.8 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 18
    }
  }
} as const;

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
  const { windows, openWindow, closeWindow } = useWindows();
  const { toggleTheme, toggleBatterySaver, batterySaver } = useTheme();
  const { registerBatterySaverClick } = useNebulaOverride();

  const [showTutorial, setShowTutorial] = React.useState(false);

  React.useEffect(() => {
    const hasSeen = localStorage.getItem('sys_live_tutorial_seen');
    if (!hasSeen) {
      localStorage.setItem('sys_live_tutorial_seen', 'true');
      setTimeout(() => setShowTutorial(true), 2500);
    }
  }, []);

  const dismissTutorial = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowTutorial(false);
  };

  const pressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPress = React.useRef(false);

  const handlePointerDown = (id: string) => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      closeWindow(id);
      isLongPress.current = true;
      pressTimer.current = null;
    }, 600);
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent, id: string, title: string, icon: string) => {
    e.preventDefault();
    if (!isLongPress.current) {
      openWindow(id, title, icon);
      if (id === 'about' && showTutorial) {
        dismissTutorial();
      }
    }
    isLongPress.current = false;
  };

  const handleBatterySaverClick = () => {
    toggleBatterySaver();
    registerBatterySaverClick();
  };

  const getWindowState = (id: string) => windows.find(w => w.id === id);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dock-container flex items-center justify-between gap-1 px-3 py-2.5 relative max-w-3xl w-full mx-4"
    >
        {/* Brand tag */}
        <motion.div 
          variants={itemVariants}
          className="hidden md:flex items-center gap-2.5 pr-4 border-r border-white/10"
        >
          <div className="w-1 h-1 rounded-full bg-[#ff003c] animate-pulse shadow-[0_0_8px_#ff003c]" />
          <span className="font-jetbrains text-[9px] text-os-muted uppercase tracking-[0.2em]">
            SYS.LIVE
          </span>
        </motion.div>

        {/* App icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center px-1 overflow-visible">
          {DOCK_APPS.map(app => {
            const IconComponent = Icons[app.icon];
            const windowState = getWindowState(app.id);
            const isOpen = !!windowState;
            const isMinimized = windowState?.minimized;

            return (
              <motion.div key={app.id} variants={itemVariants} className="relative group">
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-os-surface/95 backdrop-blur-md border border-white/10 text-os-main text-[10px] font-jetbrains uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none rounded-none -translate-y-2 group-hover:translate-y-0 z-50 shadow-xl">
                  {app.title}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-os-surface border-r border-b border-white/10 rotate-45" />
                </div>

                <motion.button
                  whileHover={{ y: -5, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onPointerDown={() => handlePointerDown(app.id)}
                  onPointerUp={cancelPress}
                  onPointerLeave={cancelPress}
                  onClick={(e) => handleClick(e, app.id, app.title, app.icon)}
                  className={`relative w-9 h-9 flex-shrink-0 sm:w-11 sm:h-11 flex items-center justify-center transition-colors duration-200 ${
                    isOpen && !isMinimized
                      ? 'text-os-main bg-os-element border border-os-muted'
                      : 'text-os-muted hover:text-os-main border border-transparent hover:border-os-muted hover:bg-os-element'
                  }`}
                  title={app.title}
                >
                  {IconComponent && <IconComponent size={window.innerWidth <= 768 ? 16 : 18} />}
                </motion.button>

                {/* Active dot */}
                {isOpen && (
                  <motion.div
                    layoutId={`dock-dot-${app.id}`}
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isMinimized ? 'bg-[#ffbd2e]' : 'bg-[#ff003c]'}`}
                    style={{ boxShadow: isMinimized ? '0 0 4px rgba(255,189,46,0.9)' : '0 0 4px rgba(255,0,60,0.9)' }}
                  />
                )}

                {/* Tutorial Popup */}
                {app.id === 'about' && showTutorial && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
                    className="absolute bottom-16 left-1/2 w-[180px] sm:w-[220px] px-3 py-3 sm:px-4 sm:py-3 box-border bg-os-surface/95 backdrop-blur-xl border border-[#ff003c]/30 text-os-main shadow-[0_0_30px_rgba(255,0,60,0.15)] z-[100] cursor-default"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                  >
                    <button 
                      onClick={dismissTutorial}
                      className="absolute top-1.5 right-1.5 text-os-muted hover:text-[#ff003c] transition-colors p-1"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse" />
                      <span className="text-[10px] uppercase font-jetbrains tracking-widest text-[#ff003c]">Welcome</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-os-muted m-0">
                      Click here to open the <strong className="text-os-main font-medium">About Me</strong> app and explore!
                    </p>
                    
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-os-surface border-b border-r border-[#ff003c]/30 rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <motion.div 
          variants={itemVariants}
          className="hidden md:flex items-center gap-1.5 pl-4 border-l border-white/10"
        >
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center border border-transparent hover:border-white/10 bg-transparent hover:bg-white/5 transition-all text-os-muted hover:text-os-main"
          >
            <Icons.theme size={15} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBatterySaverClick}
            aria-label="Toggle battery saver"
            className={`w-9 h-9 flex items-center justify-center border transition-all ${
              batterySaver
                ? 'bg-[#33ff00]/10 text-[#33ff00] border-[#33ff00]/30 shadow-[0_0_15px_rgba(51,255,0,0.1)]'
                : 'border-white/5 hover:border-white/20 bg-white/5 text-white/40 hover:text-white'
            }`}
          >
            <Icons.battery size={15} />
          </motion.button>
        </motion.div>
    </motion.div>
  );
};

export default Dock;
