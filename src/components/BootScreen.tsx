import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

const RENDER_LOGS = [
  '==> Starting build...',
  '==> Cloning repository...',
  'Cloning into "portfolio"...',
  '==> Checking out commit 8a9b2c3...',
  '==> Using Node version 18.17.0 (default)',
  '==> Running build command "npm run build"...',
  'npm WARN deprecated...',
  '> portfolio@1.0.0 build',
  '> tsc && vite build',
  'vite v4.4.9 building for production...',
  'transforming...',
  '✓ 342 modules transformed.',
  'rendering chunks...',
  'dist/index.html                  0.45 kB │ gzip:  0.29 kB',
  'dist/assets/index-c3a2b1.css   12.45 kB │ gzip:  3.12 kB',
  'dist/assets/index-f8d9e2.js   145.23 kB │ gzip: 45.67 kB',
  '✓ built in 1.42s',
  '==> Build successful 🎉',
  '==> Deploying...',
  '==> Starting service with "npm run preview"...',
  '> portfolio@1.0.0 preview',
  '> vite preview --port 5173',
  '  ➜  Local:   http://localhost:5173/',
  '  ➜  Network: use --host to expose',
  '==> Starting Checkpoint OS user space...',
  'Allocating virtual memory...',
  'Loading display adapter...',
  'Mounting virtual filesystem...',
  'Initializing workspace...',
  'System READY.',
];

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [logLines, setLogLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const complete = useCallback(() => onComplete(), [onComplete]);

  // Keyboard / click skip
  useEffect(() => {
    const handler = () => complete();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [complete]);

  // Boot message spewing
  useEffect(() => {
    let idx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Generate static timestamp strings based on initial load so they look realistic

    const addLine = () => {
      if (idx < RENDER_LOGS.length) {
        const newLine = RENDER_LOGS[idx];
        setLogLines(prev => [...prev, newLine]);
        idx++;
        
        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        // Variable speed like a real boot (fast bursts, occasional slow pauses)
        let delay = Math.random() * 50 + 10; 
        if (idx === 3 || idx === 10 || idx === 18) delay += 500; // Pause longer on some lines
        
        timeoutId = setTimeout(addLine, delay);
      } else {
        // Finished
        timeoutId = setTimeout(() => complete(), 800);
      }
    };

    timeoutId = setTimeout(addLine, 150);

    return () => clearTimeout(timeoutId);
  }, [complete]);

  // Real-ish timestamp offset generator
  const getTimestamp = () => {
    const now = new Date();
    // artifically offset milliseconds for effect
    now.setMilliseconds(Math.floor(Math.random() * 999));
    return now.toISOString();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        className="fixed inset-0 bg-[#0a0a0c] z-[9999] overflow-hidden cursor-pointer p-4 md:p-8"
        onClick={complete}
      >
        <div 
          ref={containerRef}
          className="h-full w-full overflow-y-auto scrollbar-hide font-jetbrains text-[11px] md:text-xs text-white/70"
        >
          {logLines.map((line, i) => {
            if (!line) return null; // Safety net
            const isHighlight = line.startsWith('==>');
            const isSuccess = line.startsWith('✓');
            const isError = line.includes('WARN') || line.includes('panic');
            
            let color = 'text-white/70';
            if (isHighlight) color = 'text-[#00f0ff] font-bold';
            else if (isSuccess) color = 'text-[#33ff00]';
            else if (isError) color = 'text-[#ffaa00]';
            else if (line.includes('http://')) color = 'text-[#00f0ff]/80 underline';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                className="flex gap-4 mb-1"
              >
                <span className="text-white/30 shrink-0 select-none hidden sm:inline-block w-52 truncate">
                  {getTimestamp()}
                </span>
                <span className={`break-all ${color}`}>{line}</span>
              </motion.div>
            );
          })}
          
          {logLines.length < RENDER_LOGS.length && (
            <div className="flex gap-4 mt-1">
              <span className="text-white/30 shrink-0 select-none hidden sm:inline-block w-52" />
              <span className="w-2 h-3 bg-white/50 animate-blink translate-y-1" />
            </div>
          )}
        </div>
        
        {/* Skip hint */}
        <div className="absolute bottom-4 right-4 font-jetbrains text-[10px] text-white/20 uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-sm backdrop-blur-sm pointer-events-none">
          Click or press any key to skip
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;
