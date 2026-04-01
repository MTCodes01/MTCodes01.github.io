import React, { useEffect, useState } from 'react';
import { useWindows } from '../contexts/WindowContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNebulaOverride } from '../contexts/NebulaOverrideContext';

const TopBar: React.FC = () => {
  const { focusedWindow, windows } = useWindows();
  const { theme, batterySaver } = useTheme();
  const { gameState, score, lives, wave, highScore } = useNebulaOverride();
  const [time, setTime] = useState(new Date());
  const isGameActive = gameState === 'playing';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const focusedWindowData = windows.find(w => w.id === focusedWindow);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`fixed top-0 left-0 right-0 h-8 glass-panel flex items-center justify-between px-4 text-xs z-[10000] transition-all duration-500 ${isGameActive ? 'border-b-[#ff003c]/30' : ''}`}>
      {/* Left: Brand + active app */}
      <div className="flex items-center gap-3">
        {isGameActive ? (
          <span className="font-jetbrains font-bold tracking-widest text-[11px] text-[#ff003c]" style={{ textShadow: '0 0 8px rgba(255,0,60,0.5)' }}>
            NEBULA<span className="text-[#00f0ff]">OVERRIDE</span>
          </span>
        ) : (
          <span className="font-space-grotesk font-bold text-white tracking-widest text-[11px]">
            CHECK<span className="text-[#ff003c]">POINT</span>
          </span>
        )}

        <div className="h-3 w-px bg-white/15" />

        {isGameActive ? (
          <div className="flex items-center gap-1.5 text-[#00f0ff]/60 font-jetbrains text-[10px] tracking-wider">
            WAVE <span className="text-[#00f0ff] font-bold">{wave}</span>
          </div>
        ) : focusedWindowData ? (
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
        {isGameActive ? (
          <>
            <div className="flex items-center gap-1.5 font-jetbrains text-[10px] tracking-wider">
              <span className="text-[#00f0ff]/50">SCORE</span>
              <span className="text-[#00f0ff] font-bold">{String(score).padStart(6, '0')}</span>
            </div>
            <div className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5 font-jetbrains text-[10px] tracking-wider">
              <span className="text-[#00f0ff]/50">HI</span>
              <span className="text-[#00f0ff]/70">{String(Math.max(score, highScore)).padStart(6, '0')}</span>
            </div>
            <div className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1">
              {Array.from({ length: lives }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" style={{ boxShadow: '0 0 4px rgba(0,240,255,0.6)' }} />
              ))}
              {Array.from({ length: Math.max(0, 3 - lives) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-white/10" />
              ))}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
