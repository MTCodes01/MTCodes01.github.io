import React, { useEffect, useState } from 'react';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';

const TopBar: React.FC = () => {
  const { focusedWindow, windows } = useWindows();
  const { theme, batterySaver } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const focusedWindowData = windows.find(w => w.id === focusedWindow);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="fixed top-0 left-0 right-0 h-8 glass-panel flex items-center justify-between px-4 text-xs z-[10000]">
      {/* Left: Brand + active app */}
      <div className="flex items-center gap-3">
        <span className="font-space-grotesk font-bold text-white tracking-widest text-[11px]">
          CHECK<span className="text-[#ff003c]">POINT</span>
        </span>

        <div className="h-3 w-px bg-white/15" />

        {focusedWindowData ? (
          <div className="flex items-center gap-1.5 text-white/60 font-inter">
            <span className="font-medium text-white/80">{focusedWindowData.title}</span>
          </div>
        ) : (
          <span className="text-white/30 font-jetbrains text-[10px] tracking-wider">
            No active window
          </span>
        )}
      </div>

      {/* Right: Status indicators + clock */}
      <div className="flex items-center gap-4">
        {batterySaver && (
          <div className="flex items-center gap-1 text-[#33ff00] font-jetbrains text-[9px] tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33ff00] animate-pulse" />
            POWER SAVE
          </div>
        )}

        <div className="flex items-center gap-1.5 text-white/40 font-inter">
          <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
        </div>

        <div className="h-3 w-px bg-white/15" />

        <div className="flex items-center gap-3 font-jetbrains text-[10px] text-white/60">
          <span className="text-white/35">{dateStr}</span>
          <span className="text-white font-medium tracking-widest">{timeStr}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
