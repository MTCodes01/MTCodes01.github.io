import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'INITIALIZING CHECKPOINT OS...';

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Randomize progress increment for a more "hacking" feel
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);

    // Typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    // Auto-complete after slightly longer to show off the effect
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(typingInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-cross-pattern z-50 flex items-center justify-center overflow-hidden"
        onClick={onComplete}
      >
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-50"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>

        <div className="text-center relative z-10 w-full max-w-md px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter">
              <span className="text-white text-shadow-neon glitch-hover cursor-default">
                CHECKPOINT
              </span>
            </h1>
            
            <div className="font-mono text-sm h-6 flex justify-center items-center text-[#00f0ff]">
              <span className="mr-2 opacity-70">{'>'}</span>
              {text}
              <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-[#00f0ff]"></span>
            </div>
          </motion.div>

          <div className="w-full max-w-xs mx-auto">
            {/* Progress Bar Container */}
            <div className="h-2 bg-[#1a1a1a] border border-white/20 rounded-sm overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff003c] via-[#ffaa00] to-[#fcee0a]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }} // fast updates for the jagged feel
              />
            </div>
            
            <div className="flex justify-between items-center mt-2 font-mono text-xs text-[#a0a0a0]">
              <div>SYSTEM_READY</div>
              <div>{progress}%</div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 text-center">
             <div className="text-[#404040] text-[10px] font-mono uppercase tracking-widest animate-pulse">
               Press any key to skip
             </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;
