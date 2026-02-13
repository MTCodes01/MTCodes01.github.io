import React from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';

const DOCK_APPS = [
  { id: 'about', title: 'About Me', icon: '👤' },
  { id: 'projects', title: 'Projects', icon: '💼' },
  { id: 'terminal', title: 'Terminal', icon: '⌨️' },
  { id: 'music', title: 'Music', icon: '🎵' },
  { id: 'resume', title: 'Resume', icon: '📄' },
  { id: 'contact', title: 'Contact', icon: '📧' },
  { id: 'browser', title: 'Browser', icon: '🌐' },
];

const Dock: React.FC = () => {
  const { windows, openWindow } = useWindows();
  const { toggleTheme, toggleBatterySaver, batterySaver } = useTheme();

  const isWindowOpen = (id: string) => windows.some(w => w.id === id);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-4xl px-4">
      <div className="dock-container flex items-center justify-between gap-2 p-2 relative">
        {/* Decorative elements */}
        <div className="absolute -top-1 left-0 w-2 h-1 bg-white/20" />
        <div className="absolute -top-1 right-0 w-2 h-1 bg-white/20" />
        <div className="absolute -bottom-1 left-0 w-2 h-1 bg-white/20" />
        <div className="absolute -bottom-1 right-0 w-2 h-1 bg-white/20" />

        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-white/50 hidden md:block">
             SYS.READY
           </div>
           <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
        </div>

        <div className="flex items-center gap-3">
          {DOCK_APPS.map(app => (
            <motion.button
              key={app.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWindow(app.id, app.title, app.icon)}
              className="relative group p-1"
              title={app.title}
            >
              <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 border ${
                isWindowOpen(app.id) 
                  ? 'bg-white/10 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                  : 'bg-transparent border-transparent hover:border-white/20 hover:bg-white/5'
              }`}>
                <span className="text-2xl filter drop-shadow-md">{app.icon}</span>
              </div>
              
              {/* Active Indicator */}
              {isWindowOpen(app.id) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-[2px] bg-white shadow-[0_0_5px_white]" />
              )}
              
              {/* Label */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black border border-white/20 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {app.title.toUpperCase()}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-px bg-white/10 mx-2" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-xl"
            title="Toggle Theme"
          >
            🌓
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBatterySaver}
            className={`w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/30 transition-all text-xl ${
              batterySaver ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
            title="Battery Saver"
          >
            🔋
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dock;
