import React, { useEffect, useState } from 'react';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';

const TopBar: React.FC = () => {
  const { focusedWindow, windows } = useWindows();
  const { theme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const focusedWindowData = windows.find(w => w.id === focusedWindow);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 glass-panel flex items-center justify-between px-4 text-sm z-[10000]">
      <div className="flex items-center gap-4">
        <div className="font-semibold">Portfolio OS</div>
        {focusedWindowData && (
          <>
            <div className="text-gray-400">|</div>
            <div className="flex items-center gap-2">
              <span>{focusedWindowData.icon}</span>
              <span>{focusedWindowData.title}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xs opacity-70">
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
        <div className="font-mono">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
